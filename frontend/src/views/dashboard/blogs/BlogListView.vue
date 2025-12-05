<template>
    <div>
        <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap justify-between gap-6 mb-6">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">All Blog Posts</h2>
                <input 
                    v-model="searchQuery" 
                    placeholder="Search by Post Title" 
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    style="width: 300px"
                    @input="handleSearch" 
                />
            </div>

            <!-- Blog Posts Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Title
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Author
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Created At
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-if="loading">
                            <td colspan="5" class="px-6 py-8 text-center">
                                <div class="flex justify-center items-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span class="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="paginatedPosts.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No blog posts found.
                            </td>
                        </tr>
                        <tr v-else v-for="record in paginatedPosts" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4">
                                <RouterLink :to="`/blog/${record.id}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                                    {{ record.title }}
                                </RouterLink>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {{ record.category }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {{ record.author }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {{ formatDate(record.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <RouterLink 
                                    :to="`/dashboard/blogs/edit/${record.id}`"
                                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4">
                                    Edit
                                </RouterLink>
                                <button 
                                    @click="deleteBlog(record)"
                                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-between">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredPosts.length) }} of {{ filteredPosts.length }} results
                </div>
                <div class="flex gap-2">
                    <button 
                        @click="currentPage--" 
                        :disabled="currentPage === 1"
                        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <span class="px-3 py-1 text-gray-700 dark:text-gray-300">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button 
                        @click="currentPage++" 
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { getAuthHeader } = useAuth();

const blogPosts = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchPosts = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts`, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        blogPosts.value = data;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Show error message to user
        alert("Failed to load blog posts. Please try again.");
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    currentPage.value = 1; // Reset to first page on search
};

const editBlog = (record) => {
    console.log('Edit blog:', record);
    // Navigation handled by RouterLink
};

const deleteBlog = async (record) => {
    if (!confirm(`Are you sure you want to delete "${record.title}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${record.id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error("Failed to delete blog post");
        }

        alert('Blog post deleted successfully!');
        // Refresh the list
        await fetchPosts();
    } catch (error) {
        console.error("Error deleting blog post:", error);
        alert("Failed to delete blog post. Please try again.");
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

// Filtered Data for Searching
const filteredPosts = computed(() => {
    if (!searchQuery.value) return blogPosts.value;
    
    return blogPosts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => currentPage.value * pageSize.value);
const paginatedPosts = computed(() => filteredPosts.value.slice(startIndex.value, endIndex.value));

onMounted(fetchPosts);
</script>
