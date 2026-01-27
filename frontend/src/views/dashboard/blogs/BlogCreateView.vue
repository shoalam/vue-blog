<template>
  <n-card bordered class="max-w-4xl mx-auto">
    <n-form
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
          @change="handleUploadChange"
          @remove="handleRemove"
        >
          <n-text style="font-size: 12px">Click or Drag to Upload</n-text>
        </n-upload>
      </n-form-item>

      <div class="flex justify-end gap-3 mt-4">
        <n-button @click="$router.push({ name: 'dashboard-blogs' })">Cancel</n-button>
        <n-button type="primary" :loading="submitting" attr-type="submit">Save Post</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";

const { getAuthHeader } = useAuth();
const message = useMessage();
const router = useRouter();

const formRef = ref(null);
const submitting = ref(false);

const form = ref({
    title: "",
    description: "",
    category: null,
    image: null,
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

const categoryOptions = [
    { label: "Technology", value: "Technology" },
    { label: "Business", value: "Business" },
    { label: "Health", value: "Health" },
    { label: "Education", value: "Education" },
    { label: "Entertainment", value: "Entertainment" },
];

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
            submitting.value = true;
            const postData = {
                title: form.value.title,
                description: form.value.description,
                category: form.value.category,
                image: form.value.image,
            };

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    },
                    body: JSON.stringify(postData),
                });

                if (!response.ok) {
                    throw new Error("Failed to submit post");
                }

                message.success("Post submitted successfully!");
                router.push({ name: 'dashboard-blogs' });
            } catch (error) {
                console.error("Error submitting post:", error);
                message.error("Failed to submit post");
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

