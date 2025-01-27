<template>
    <main class="container mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Blog Posts</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlogCard from '../components/BlogCard.vue'
import { fetchAllBlogs } from '../api/index'

const blogs = ref([])

onMounted(async () => {
    blogs.value = await fetchAllBlogs()
})
</script>