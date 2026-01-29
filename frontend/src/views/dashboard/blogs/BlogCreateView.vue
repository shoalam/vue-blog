<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <!-- Simple Header -->
    <div class="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Post</h1>
      <p class="text-gray-500 dark:text-gray-400">Fill in the details below to publish your new blog post.</p>
    </div>

    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="top"
      size="large"
      @submit.prevent="submitPost"
      class="space-y-8"
    >
      <!-- 1. Post Title -->
      <n-form-item label="Post Title" path="title">
        <n-input 
          v-model:value="form.title" 
          placeholder="Enter a catchy title..." 
          maxlength="100"
          show-count
          class="rounded-xl"
        />
      </n-form-item>

      <!-- 2. Cover Photo -->
      <n-form-item label="Cover Photo" path="image">
        <n-upload
          list-type="image-card"
          :max="1"
          accept="image/*"
          class="w-full flex justify-start"
          @change="handleUploadChange"
          @remove="handleRemove"
        >
          <div class="flex flex-col items-center justify-center gap-2">
             <n-icon size="24" class="text-gray-400"><CloudUploadOutline /></n-icon>
             <n-text class="text-xs text-gray-400">Upload Cover</n-text>
          </div>
        </n-upload>
      </n-form-item>

      <!-- 3. Category -->
      <n-form-item label="Category" path="category">
        <n-select
          v-model:value="form.category"
          placeholder="Select a category"
          :options="categoryOptions"
          :loading="loadingCategories"
          class="rounded-xl"
          clearable
        />
      </n-form-item>

      <!-- 4. Status -->
      <n-form-item label="Publication Status" path="status">
         <n-select
          v-model:value="form.status"
          :options="[
            { label: '🚀 Published', value: 'published' },
            { label: '📝 Save as Draft', value: 'draft' }
          ]"
          class="rounded-xl"
        />
      </n-form-item>

      <!-- 5. Content -->
      <n-form-item label="Content" path="description">
        <n-input
          v-model:value="form.description"
          type="textarea"
          placeholder="Write your story here..."
          :autosize="{ minRows: 10, maxRows: 25 }"
          class="rounded-xl font-sans text-base"
        />
      </n-form-item>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
        <n-button quaternary round @click="$router.push({ name: 'dashboard-blogs' })">
          Cancel
        </n-button>
        <n-button 
          type="primary" 
          strong 
          round 
          :loading="submitting" 
          attr-type="submit"
          class="px-10 h-12 shadow-lg shadow-indigo-500/20"
        >
          Publish Post
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useMessage, NIcon } from "naive-ui";
import { useRouter } from "vue-router";
import { CloudUploadOutline, AddCircleOutline, ImageOutline, LayersOutline } from "@vicons/ionicons5";

const { getAuthHeader } = useAuth();
const message = useMessage();
const router = useRouter();

const formRef = ref(null);
const submitting = ref(false);
const loadingCategories = ref(false);
const categoryOptions = ref([]);

const form = ref({
    title: "",
    description: "",
    category: null,
    image: null,
    status: "published"
});

const rules = {
    title: {
        required: true,
        message: "Please enter a title",
        trigger: "blur"
    },
    description: {
        required: true,
        message: "Please enter a description",
        trigger: "blur"
    },
    category: {
        required: true,
        message: "Please select a category",
        trigger: ["blur", "change"]
    }
};

const fetchCategories = async () => {
    loadingCategories.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories`);
        const data = await response.json();
        if (response.ok) {
            categoryOptions.value = data.map(cat => ({
                label: cat.name,
                value: cat._id
            }));
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    } finally {
        loadingCategories.value = false;
    }
};

onMounted(() => {
    fetchCategories();
});

const handleUploadChange = (options) => {
    const { file } = options;
    if (file.file) {
        form.value.image = file.file;
    }
};

const handleRemove = () => {
    form.value.image = null;
};

const submitPost = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            submitting.value = true;
            
            // Use FormData for file upload
            const formData = new FormData();
            formData.append("title", form.value.title);
            formData.append("description", form.value.description);
            formData.append("category", form.value.category);
            formData.append("status", form.value.status);
            
            if (form.value.image) {
                formData.append("image", form.value.image);
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts`, {
                    method: "POST",
                    headers: { 
                        // Note: Content-Type is set automatically by the browser when using FormData
                        ...getAuthHeader()
                    },
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to submit post");
                }

                message.success("Post created successfully!");
                router.push({ name: 'dashboard-blogs' });
            } catch (error) {
                console.error("Error submitting post:", error);
                message.error(error.message || "Failed to submit post");
            } finally {
                submitting.value = false;
            }
        }
    });
};
</script>

<style scoped>
.a-form-item {
    @apply mb-4;
}
</style>

