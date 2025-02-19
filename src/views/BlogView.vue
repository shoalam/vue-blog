<template>
    <main class="container mx-auto px-4 py-12">
        <!-- Search Input -->
        <div class="relative mb-10 w-full md:w-1/2 mx-auto">
            <input type="text" v-model="searchQuery" placeholder="Search blogs..."
                class="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600 w-full" />
        </div>

        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Blog Posts</h1>

        <!-- Blog Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard v-for="blog in filteredBlogs" :key="blog.id" :blog="blog" />
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BlogCard from '../components/BlogCard.vue'
import { fetchAllBlogs } from '../api'

const blogs = ref([])
const searchQuery = ref('')

// Fetch all blogs when the component is mounted
onMounted(async () => {
    blogs.value = await fetchAllBlogs();
})

// Computed property to filter blogs based on search query
const filteredBlogs = computed(() => {
    if (!searchQuery.value) return blogs.value

    const query = searchQuery.value.toLowerCase()
    return blogs.value.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query)
    )
});

</script>