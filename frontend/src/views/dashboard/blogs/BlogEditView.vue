<template>
  <n-card bordered class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <n-space v-if="loading" vertical>
      <n-skeleton height="40px" width="100%" />
      <n-skeleton height="100px" width="100%" />
      <n-skeleton height="40px" width="50%" />
      <n-skeleton height="100px" width="100%" />
    </n-space>

    <!-- Error State -->
    <n-alert v-else-if="error" type="error" closable class="mb-4">
      {{ error }}
    </n-alert>

    <!-- Form -->
    <n-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="top"
      size="large"
      @submit.prevent="submitPost"
    >
      <n-form-item label="Post Title" path="title">
        <n-input v-model:value="form.title" placeholder="Enter post title" clearable />
      </n-form-item>

      <n-form-item label="Description" path="description">
        <n-input
          v-model:value="form.description"
          type="textarea"
          placeholder="Enter post content..."
          :autosize="{ minRows: 3, maxRows: 10 }"
          clearable
        />
      </n-form-item>

      <n-grid :cols="2" :x-gap="12">
        <n-gi>
          <n-form-item label="Category" path="category">
            <n-select
              v-model:value="form.category"
              placeholder="Select category"
              :options="categoryOptions"
              clearable
            />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-form-item label="Cover Photo">
        <n-upload
          list-type="image-card"
          :max="1"
          :default-file-list="defaultFileList"
          @change="handleUploadChange"
          @remove="handleRemove"
        >
          <n-text style="font-size: 12px">Click or Drag to Upload</n-text>
        </n-upload>
      </n-form-item>

      <div class="flex justify-end gap-3 mt-4">
        <n-button @click="$router.push({ name: 'dashboard-blogs' })">Cancel</n-button>
        <n-button type="primary" :loading="submitting" attr-type="submit">Save Changes</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useMessage } from "naive-ui";

const route = useRoute();
const router = useRouter();
const { getAuthHeader } = useAuth();
const message = useMessage();

const formRef = ref(null);
const loading = ref(true);
const submitting = ref(false);
const error = ref(null);

const form = ref({
    title: "",
    description: "",
    category: null,
    image: null,
});

const defaultFileList = ref([]);

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

const categoryOptions = [
    { label: "Technology", value: "Technology" },
    { label: "Business", value: "Business" },
    { label: "Health", value: "Health" },
    { label: "Education", value: "Education" },
    { label: "Entertainment", value: "Entertainment" },
];

const fetchBlogData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const blogId = route.params.id;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${blogId}`, {
            headers: getAuthHeader()
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch blog post");
        }
        
        const data = await response.json();
        
        form.value = {
            title: data.title || "",
            description: data.description || data.content || "",
            category: data.category || null,
            image: data.image || null,
        };

        if (data.image) {
            defaultFileList.value = [
                {
                    id: 'current',
                    name: 'Current Image',
                    status: 'finished',
                    url: data.image
                }
            ];
        }
    } catch (err) {
        console.error("Error fetching blog data:", err);
        error.value = "Failed to load blog post. Please try again.";
        message.error(error.value);
    } finally {
        loading.value = false;
    }
};

const handleUploadChange = (options) => {
    const { file } = options;
    if (file.file) {
        form.value.image = URL.createObjectURL(file.file);
    }
};

const handleRemove = () => {
    form.value.image = null;
};

const submitPost = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            try {
                submitting.value = true;
                const blogId = route.params.id;
                const postData = {
                    title: form.value.title,
                    description: form.value.description,
                    category: form.value.category,
                    image: form.value.image,
                };

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${blogId}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    },
                    body: JSON.stringify(postData),
                });

                if (!response.ok) {
                    throw new Error("Failed to update post");
                }

                message.success("Post updated successfully!");
                router.push({ name: 'dashboard-blogs' });
            } catch (err) {
                console.error("Error updating post:", err);
                message.error("Failed to update post. Please try again.");
            } finally {
                submitting.value = false;
            }
        }
    });
};

onMounted(() => {
    fetchBlogData();
});
</script>

<style scoped>
.a-form-item {
    @apply mb-4;
}
</style>
