<template>
    <div class="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Edit Post</h2>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submitPost">
            <div class="space-y-6">
                <div class="border-b border-gray-900/10 pb-12">

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <!-- Title Input -->
                        <div class="sm:col-span-full">
                            <label for="title" class="block text-sm/6 font-medium text-gray-900">Post Title</label>
                            <div class="mt-2">
                                <input type="text" id="title" v-model="form.title" name="title"
                                    autocomplete="given-name"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
                                    required />
                            </div>
                        </div>

                        <!-- Description Input -->
                        <div class="col-span-full">
                            <label for="description"
                                class="block text-sm/6 font-medium text-gray-900">Description</label>
                            <div class="mt-2">
                                <textarea id="description" v-model="form.description" name="description" rows="3"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    required></textarea>
                            </div>
                        </div>

                        <!-- Category Select -->
                        <div class="sm:col-span-4">
                            <label for="category" class="block text-sm/6 font-medium text-gray-900">Category</label>
                            <div class="mt-2">
                                <select id="category" v-model="form.category" name="category"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    required>
                                    <option value="">Select a category</option>
                                    <option v-for="category in categories" :key="category" :value="category">{{ category
                                        }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Cover Photo Upload -->
                        <div class="col-span-full">
                            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Cover
                                photo</label>
                            
                            <!-- Current Image Preview -->
                            <div v-if="form.imagePreview" class="mt-2 mb-4">
                                <p class="text-sm text-gray-600 mb-2">Current image:</p>
                                <img :src="form.imagePreview" alt="Current cover" class="h-32 w-auto rounded-md object-cover" />
                            </div>

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
                                            <span>Upload a new file</span>
                                            <input id="file-upload" type="file" class="sr-only"
                                                @change="handleImageUpload" accept="image/*" />
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

            <!-- Action Buttons -->
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" @click="$router.push('/dashboard/blogs')"
                    class="text-sm font-semibold text-gray-900">
                    Cancel
                </button>
                <button type="submit" :disabled="submitting"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ submitting ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { getAuthHeader } = useAuth();

const form = ref({
    title: "",
    description: "",
    category: "",
    image: null,
    imagePreview: null,
});

const categories = ref([
    "Technology",
    "Business",
    "Health",
    "Education",
    "Entertainment",
]);

const loading = ref(true);
const submitting = ref(false);
const error = ref(null);

// Fetch existing blog data
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
        
        // Pre-populate form with existing data
        form.value = {
            title: data.title || "",
            description: data.description || data.content || "",
            category: data.category || "",
            image: null,
            imagePreview: data.image || null,
        };
    } catch (err) {
        console.error("Error fetching blog data:", err);
        error.value = "Failed to load blog post. Please try again.";
    } finally {
        loading.value = false;
    }
};

// Handle file upload
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
        form.value.imagePreview = URL.createObjectURL(file);
    }
};

// Submit the form
const submitPost = async () => {
    try {
        submitting.value = true;
        error.value = null;

        const blogId = route.params.id;
        const postData = {
            title: form.value.title,
            description: form.value.description,
            category: form.value.category,
            image: form.value.imagePreview,
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

        alert("Post updated successfully!");
        router.push("/dashboard/blogs");
    } catch (err) {
        console.error("Error updating post:", err);
        error.value = "Failed to update post. Please try again.";
    } finally {
        submitting.value = false;
    }
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
