<template>
    <div>
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Posts</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalPosts }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Published Posts</p>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ publishedPosts }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Draft Posts</p>
                <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{{ draftPosts }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Views</p>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{{ totalViews }}</p>
            </div>
        </div>

        <!-- Recent Posts Section -->
        <div class="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap justify-between gap-6 mb-6">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Recent Posts</h2>
                <input 
                    v-model="searchQuery" 
                    placeholder="Search by Post Title" 
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    style="width: 300px"
                    @input="handleSearch" 
                />
            </div>

            <!-- Recent Posts Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Title
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Views
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="record in paginatedPosts" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <RouterLink :to="`/blog/${record.id}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                                    {{ record.title }}
                                </RouterLink>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span 
                                    :class="record.status === 'Published' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'"
                                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ record.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {{ record.views }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <RouterLink 
                                    :to="`/dashboard/blogs/edit/${record.id}`"
                                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4">
                                    Edit
                                </RouterLink>
                                <button 
                                    @click="deletePost(record.id)"
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
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";

// Dashboard Statistics
const totalPosts = ref(45);
const publishedPosts = ref(30);
const draftPosts = ref(15);
const totalViews = ref(12000);

// Post Data
const posts = ref([
    { id: 1, title: "Vue 3 Best Practices", status: "Published", views: 350 },
    { id: 2, title: "Understanding Reactivity", status: "Draft", views: 120 },
    { id: 3, title: "Ant Design Vue Components", status: "Published", views: 500 },
    { id: 4, title: "Using Pinia for State Management", status: "Published", views: 290 },
    { id: 5, title: "SEO Optimization in Nuxt", status: "Draft", views: 180 },
    { id: 6, title: "Building Scalable Vue Apps", status: "Published", views: 420 },
    { id: 7, title: "Vue Router Deep Dive", status: "Published", views: 310 },
    { id: 8, title: "Composition API Guide", status: "Draft", views: 95 },
]);

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(5);

// Filtered Data for Searching
const filteredPosts = computed(() =>
    posts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => currentPage.value * pageSize.value);
const paginatedPosts = computed(() => filteredPosts.value.slice(startIndex.value, endIndex.value));

// Handle Search
const handleSearch = () => {
    currentPage.value = 1; // Reset to first page on search
};

// Delete Post
const deletePost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
        const index = posts.value.findIndex(post => post.id === id);
        if (index !== -1) {
            posts.value.splice(index, 1);
            // Update statistics
            totalPosts.value--;
            // Here you would also make an API call to delete from backend
        }
    }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>