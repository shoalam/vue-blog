<template>
    <header class="bg-white dark:bg-gray-800 shadow-md">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <router-link to="/" class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <img src="@/assets/logo.svg" alt="" class="h-8 w-8 inline-block mr-2">
                    Vue-blog
                </router-link>

                <nav class="space-x-4">
                    <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                        class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                        {{ item.name }}
                    </router-link>
                </nav>

                <div class="flex items-center space-x-6">
                    <div class="relative">
                        <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search blogs..."
                            class="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    </div>

                    <button @click="$emit('toggle-theme')"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span v-if="isDark">🌞</span>
                        <span v-else>🌙</span>
                    </button>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    isDark: Boolean
})

defineEmits(['toggle-theme'])

const router = useRouter()
const searchQuery = ref('')

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/auth/login' },
    { name: 'Register', path: '/auth/register' }
]

const handleSearch = () => {
    if (searchQuery.value.length > 2) {
        router.push(`/search?q=${searchQuery.value}`)
    }
}
</script>