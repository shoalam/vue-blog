<template>
    <main class="container mx-auto px-4 py-12">
        <div class="relative mb-10 w-1/2 mx-auto">
            <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search blogs..."
                class="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600 w-full" />
        </div>
        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Blog Posts</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BlogCard from '../components/BlogCard.vue'
import { fetchAllBlogs, searchBlogs } from '../api'

const blogs = ref([])
const searchQuery = ref('')
const router = useRouter()

// Fetch all blogs when the component is mounted
onMounted(async () => {
    blogs.value = await fetchAllBlogs()
})

// Watch for changes in searchQuery and trigger search
watch(searchQuery, async (newQuery) => {
    if (newQuery.length > 2) {
        // Perform search after user types more than 2 characters
        const searchResults = await searchBlogs(newQuery)
        blogs.value = searchResults
        router.push(`/search?q=${newQuery}`)
    } else if (newQuery === '') {
        // If searchQuery is empty, reset the blog list
        blogs.value = await fetchAllBlogs()
        router.push(`/`)
    }
})

const handleSearch = () => {
    // Triggers the search when the user presses a key or changes the input
    if (searchQuery.value.length > 2) {
        router.push(`/search?q=${searchQuery.value}`)
    }
}
</script>
