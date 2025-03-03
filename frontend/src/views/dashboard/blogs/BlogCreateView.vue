<!-- eslint-disable vue -->

<template>
    <div class="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Add New Post</h2>

        <a-form layout="vertical" @finish="submitPost">
            <!-- Post Title -->
            <a-form-item label="Post Title" required>
                <!-- eslint-disable-next-line vue/attribute-hyphenation -->
                <a-input v-model:value="form.title" placeholder="Enter post title" />
            </a-form-item>

            <!-- Post Description -->
            <a-form-item label="Post Description" required>
                <!-- eslint-disable-next-line vue/attribute-hyphenation -->
                <a-textarea v-model:value="form.description" placeholder="Write something..." :rows="5" />
            </a-form-item>

            <!-- Post Category -->
            <a-form-item label="Post Category" required>
                <a-select v-model:value="form.category" placeholder="Select a category">
                    <a-select-option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <!-- Feature Image Upload -->
            <a-form-item label="Feature Image">
                <a-upload list-type="picture-card" :before-upload="beforeUpload" @change="handleImageUpload">
                    <div v-if="!form.image">
                        <plus-outlined />
                        <div class="mt-2">Upload</div>
                    </div>
                </a-upload>
                <img v-if="form.image" :src="form.image" class="mt-2 w-40 rounded-md shadow-sm" />
            </a-form-item>

            <!-- Submit Button -->
            <a-form-item>
                <a-button type="primary" html-type="submit" class="w-full">Submit Post</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";

// Form State
const form = ref({
    title: "",
    description: "",
    category: null,
    image: null,
});

// Categories
const categories = ref(["Technology", "Business", "Health", "Education", "Entertainment"]);

// Image Upload Handler
const handleImageUpload = (info) => {
    if (info.file.status === "done") {
        form.value.image = URL.createObjectURL(info.file.originFileObj);
    }
};

// Prevent Uploading
const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        alert("You can only upload image files!");
    }
    return isImage;
};

// Form Submit Handler
const submitPost = () => {
    console.log("Submitted Post:", form.value);
    alert("Post submitted successfully!");
};
</script>

<style scoped>
.a-form-item {
    @apply mb-4;
}
</style>