<template>
    <div class="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Add New Post</h2>

        <!-- Form submission handling -->
        <form @submit.prevent="submitPost">
            <div class="space-y-6">
                <div class="border-b border-gray-900/10 pb-12">

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <!-- Title Input -->
                        <div class="sm:col-span-full">
                            <label for="title" class="block text-sm/6 font-medium text-gray-900">Post Title</label>
                            <div class="mt-2">
                                <input type="text" id="title" v-model="form.title" name="title"
                                    autocomplete="given-name"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <!-- Description Input -->
                        <div class="col-span-full">
                            <label for="description"
                                class="block text-sm/6 font-medium text-gray-900">Description</label>
                            <div class="mt-2">
                                <textarea id="description" v-model="form.description" name="description" rows="3"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></textarea>
                            </div>
                        </div>

                        <!-- Category Select -->
                        <div class="sm:col-span-4">
                            <label for="category" class="block text-sm/6 font-medium text-gray-900">Category</label>
                            <div class="mt-2">
                                <select id="category" v-model="form.category" name="category"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <option v-for="category in categories" :key="category" :value="category">{{ category
                                        }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Cover Photo Upload -->
                        <div class="col-span-full">
                            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Cover
                                photo</label>
                            <div
                                class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div class="text-center">
                                    <svg class="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <div class="mt-4 flex text-sm/6 text-gray-600">
                                        <label for="file-upload"
                                            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" type="file" class="sr-only"
                                                @change="handleImageUpload" />
                                        </label>
                                        <p class="pl-1">or drag and drop</p>
                                    </div>
                                    <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="submit"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
    title: "",
    description: "",
    category: null,
    image: null,
});

const categories = ref([
    "Technology",
    "Business",
    "Health",
    "Education",
    "Entertainment",
]);

// Handle file upload
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = URL.createObjectURL(file);  // This will create a preview URL for the image
    }
};

// Submit the form

const submitPost = async () => {
    const postData = {
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        image: form.value.image,
    };

    try {
        const response = await fetch("http://localhost:8080/api/v1/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit post");
        }

        alert("Post submitted successfully!");
        form.value = { title: "", description: "", category: null, image: null };
    } catch (error) {
        console.error("Error submitting post:", error);
        alert("Failed to submit post");
    }
};
</script>

<style scoped>
.a-form-item {
    @apply mb-4;
}
</style>
