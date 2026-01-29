<template>
  <div class="max-w-6xl mx-auto px-2 md:px-4 py-4 md:py-8">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Organize your blog posts into meaningful topics.</p>
      </div>
      <n-button type="primary" strong round @click="showCreateModal" class="shadow-lg shadow-indigo-500/20">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        Add New Category
      </n-button>
    </div>

    <n-card :bordered="false" class="shadow-sm rounded-2xl overflow-hidden">
      <div class="mb-4 flex items-center justify-between px-4 pt-4">
         <n-input
          v-model:value="searchQuery"
          placeholder="Search categories..."
          clearable
          class="max-w-xs rounded-xl"
          @input="handleSearch"
        >
          <template #prefix>
            <n-icon><SearchOutline /></n-icon>
          </template>
        </n-input>
      </div>

      <n-data-table
        remote
        :loading="loading"
        :columns="columns"
        :data="categories"
        :pagination="pagination"
        :bordered="false"
        :single-line="false"
        class="category-table"
        @update:page="handlePageChange"
        scroll-x="800"
      />
    </n-card>

    <!-- Create/Edit Modal -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="isEdit ? 'Edit Category' : 'Create New Category'"
      class="max-w-md rounded-2xl shadow-2xl"
      :bordered="false"
      size="huge"
    >
      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="top"
        size="large"
      >
        <n-form-item label="Category Name" path="name">
          <n-input v-model:value="form.name" placeholder="e.g. Technology" class="rounded-xl" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            v-model:value="form.description"
            type="textarea"
            placeholder="Tell us about this topic..."
            :autosize="{ minRows: 3, maxRows: 6 }"
            class="rounded-xl"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <n-button @click="showModal = false" round>Cancel</n-button>
          <n-button 
            type="primary" 
            :loading="submitting" 
            strong 
            round 
            @click="handleSubmit"
            class="px-8"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, h, reactive, watch } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useMessage, NButton, NSpace, NIcon, NPopconfirm } from "naive-ui";
import { AddOutline, SearchOutline, CreateOutline, TrashOutline } from "@vicons/ionicons5";

const { getAuthHeader } = useAuth();
const message = useMessage();

// Table Data & Pagination
const categories = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    onChange: (page) => {
        pagination.page = page;
        fetchCategories();
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
        fetchCategories();
    }
});

// Modal & Form State
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const submitting = ref(false);
const formRef = ref(null);
const form = reactive({
    name: "",
    description: ""
});

const rules = {
    name: {
        required: true,
        message: "Please enter a category name",
        trigger: "blur"
    }
};

const fetchCategories = async () => {
    loading.value = true;
    try {
        // Note: The original backend getAllCategories doesn't seem to support pagination yet.
        // We'll fetch all and do client-side pagination if needed, or update the backend.
        // For now, let's assume it supports search.
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/v1/categories`);
        if (searchQuery.value) url.searchParams.append("search", searchQuery.value);
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        if (response.ok) {
            // Backend doesn't support pagination object yet, so we'll mock it or use slice
            const allData = Array.isArray(data) ? data : [];
            pagination.itemCount = allData.length;
            
            // Client-side pagination for now
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            categories.value = allData.slice(start, end);
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    pagination.page = 1;
    fetchCategories();
};

const handlePageChange = (page) => {
    pagination.page = page;
    fetchCategories();
};

const showCreateModal = () => {
    isEdit.value = false;
    editId.value = null;
    form.name = "";
    form.description = "";
    showModal.value = true;
};

const showEditModal = (row) => {
    isEdit.value = true;
    editId.value = row._id;
    form.name = row.name;
    form.description = row.description || "";
    showModal.value = true;
};

const handleSubmit = () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            submitting.value = true;
            const url = isEdit.value 
                ? `${import.meta.env.VITE_API_URL}/api/v1/categories/${editId.value}`
                : `${import.meta.env.VITE_API_URL}/api/v1/categories`;
            
            const method = isEdit.value ? "PUT" : "POST";

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    },
                    body: JSON.stringify(form)
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Failed to save category");

                message.success(isEdit.value ? "Category updated!" : "Category created!");
                showModal.value = false;
                fetchCategories();
            } catch (error) {
                message.error(error.message);
            } finally {
                submitting.value = false;
            }
        }
    });
};

const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`, {
            method: "DELETE",
            headers: getAuthHeader()
        });
        if (response.ok) {
            message.success("Category deleted successfully");
            fetchCategories();
        } else {
            const data = await response.json();
            message.error(data.message || "Failed to delete category");
        }
    } catch (error) {
        message.error("Error deleting category");
    }
};

const columns = [
    {
        title: "Name",
        key: "name",
        render: (row) => h("span", { class: "font-bold text-indigo-600 dark:text-indigo-400" }, row.name)
    },
    {
        title: "Slug",
        key: "slug",
        render: (row) => h("code", { class: "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs" }, row.slug)
    },
    {
        title: "Description",
        key: "description",
        render: (row) => h("span", { class: "text-gray-500 text-sm truncate block max-w-xs" }, row.description || "-")
    },
    {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (row) => h(NSpace, { justify: "end" }, {
            default: () => [
                h(
                    NButton,
                    {
                        quaternary: true,
                        circle: true,
                        onClick: () => showEditModal(row)
                    },
                    { default: () => h(NIcon, { size: 18 }, { default: () => h(CreateOutline) }) }
                ),
                h(
                    NPopconfirm,
                    {
                        onPositiveClick: () => deleteCategory(row._id),
                        positiveText: "Yes, Delete",
                        negativeText: "Cancel"
                    },
                    {
                        trigger: () => h(
                            NButton,
                            { quaternary: true, circle: true, type: "error" },
                            { default: () => h(NIcon, { size: 18 }, { default: () => h(TrashOutline) }) }
                        ),
                        default: () => "Delete this category?"
                    }
                )
            ]
        })
    }
];

onMounted(fetchCategories);
</script>

<style scoped>
.category-table :deep(.n-data-table-td) {
  padding: 16px;
}
</style>
