<template>
  <main>
    <!-- Banner Section -->
    <section class="dark:bg-gray-700 dark:text-white bg-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Blog</h1>
        <p class="text-xl mb-8">Discover amazing stories and insights</p>
      </div>
    </section>

    <!-- Recent Blogs Section -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Recent Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard v-for="blog in recentBlogs" :key="blog.id" :blog="blog" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlogCard from '../components/BlogCard.vue'
import { fetchRecentBlogs } from '../api'

const recentBlogs = ref([])

onMounted(async () => {
  recentBlogs.value = await fetchRecentBlogs()
})
</script>
