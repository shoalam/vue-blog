<template>
    <article
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <!-- <img :src="blog.image" :alt="blog.title" class="w-full h-48 object-cover"> -->
        <div class="p-6">
            <div class="flex items-center mb-3">
                <span
                    class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm px-3 py-1 rounded-full">
                    {{ blog.category }}
                </span>
            </div>
            <h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {{ blog.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ blog.excerpt }}
            </p>
            <div class="flex items-center justify-between mt-4">
                <div class="flex items-center">
                    <div class="text-sm">
                        <p class="text-gray-900 dark:text-gray-100 font-semibold">
                            {{ blog.author }}
                        </p>
                        <p class="text-gray-500 dark:text-gray-400">
                            {{ formatDate(blog.date) }}
                        </p>
                    </div>
                </div>
                <router-link :to="`/blog/${blog.id}`"
                    class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>
        </div>
    </article>
</template>

<script setup>
defineProps({
    blog: {
        type: Object,
        required: true
    }
})

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>