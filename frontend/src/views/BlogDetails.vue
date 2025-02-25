<template>
    <main class="min-h-screen py-10 bg-gray-50 dark:bg-gray-900">
        <div v-if="loading" class="container mx-auto px-4">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-200 dark:bg-gray-700 w-3/4 mb-4 rounded"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 w-1/4 mb-8 rounded"></div>
                <div class="h-96 bg-gray-200 dark:bg-gray-700 mb-8 rounded"></div>
            </div>
        </div>

        <article v-else-if="blog" class="container mx-auto px-4">
            <!-- Header Section -->
            <header class="max-w-4xl mx-auto mb-8">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <router-link to="/blog" class="hover:text-blue-500">
                        ← Back to Blog
                    </router-link>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {{ blog.title }}
                </h1>

                <!-- Author and Date Info -->
                <div class="flex items-center gap-4 mb-6">
                    <div class="flex items-center gap-2">
                        <img :src="getAuthorAvatar()" :alt="blog.author" class="w-10 h-10 rounded-full" />
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ blog.author }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(blog.date) }}
                            </p>
                        </div>
                    </div>
                    <span class="text-gray-300 dark:text-gray-600">|</span>
                    <span class="text-gray-600 dark:text-gray-400">
                        {{ readingTime }} min read
                    </span>
                </div>

                <!-- Category and Tags -->
                <div class="flex flex-wrap gap-2 mb-8">
                    <span
                        class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                        {{ blog.category }}
                    </span>
                    <span v-for="tag in blog.tags" :key="tag"
                        class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {{ tag }}
                    </span>
                </div>
            </header>

            <!-- Featured Image -->
            <!-- <div class="max-w-4xl mx-auto mb-12">
                <img :src="blog.image" :alt="blog.title" class="w-full h-[400px] object-cover rounded-xl shadow-lg" />
            </div> -->

            <!-- Blog Content -->
            <div class="max-w-3xl mx-auto">
                <div class="prose dark:prose-invert prose-lg dark:text-white max-w-none">
                    {{ blog.content }}
                </div>

                <!-- Share Section -->
                <div class="border-t dark:border-gray-800 mt-12 pt-8">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Share this article
                    </h3>
                    <div class="flex gap-4">
                        <button v-for="platform in sharePlatforms" :key="platform.name"
                            @click="shareArticle(platform.url)"
                            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span class="sr-only">Share on {{ platform.name }}</span>
                            <component :is="platform.icon" class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Related Posts -->
            <div class="max-w-4xl mx-auto mt-10">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Related Posts
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <BlogCard v-for="post in relatedPosts" :key="post.id" :blog="post" />
                </div>
            </div>
        </article>

        <div v-else class="container mx-auto px-4 text-center">
            <p class="text-gray-600 dark:text-gray-400">Blog post not found.</p>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BlogCard from '../components/BlogCard.vue'
import { fetchBlogById, fetchAllBlogs } from '../api'

const route = useRoute()
const router = useRouter()
const blog = ref(null)
const loading = ref(true)
const relatedPosts = ref([])

// Compute reading time based on content length
const readingTime = computed(() => {
    if (!blog.value?.content) return 0
    const wordsPerMinute = 200
    const wordCount = blog.value.content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
})

const getAuthorAvatar = () => {
    // You can replace this with actual author avatar logic
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.value.author)}&background=random`
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const sharePlatforms = [
    {
        name: 'Twitter',
        url: (title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`,
        icon: 'TwitterIcon'
    },
    {
        name: 'LinkedIn',
        url: (title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        icon: 'LinkedInIcon'
    },
    {
        name: 'Facebook',
        url: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        icon: 'FacebookIcon'
    }
]

const shareArticle = (urlGenerator) => {
    const url = urlGenerator(blog.value.title)
    window.open(url, '_blank')
}

const fetchRelatedPosts = async () => {
    const allBlogs = await fetchAllBlogs()
    relatedPosts.value = allBlogs
        .filter(post =>
            post.id !== blog.value.id &&
            (post.category === blog.value.category ||
                post.tags.some(tag => blog.value.tags.includes(tag)))
        )
        .slice(0, 3)
}

onMounted(async () => {
    try {
        const blogId = parseInt(route.params.id)
        blog.value = await fetchBlogById(blogId)

        if (!blog.value) {
            router.push('/404')
            return
        }

        await fetchRelatedPosts()
    } catch (error) {
        console.error('Error fetching blog:', error)
    } finally {
        loading.value = false
    }
})
</script>
