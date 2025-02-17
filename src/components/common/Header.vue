<template>
    <header class="bg-white dark:bg-gray-800 shadow-md">
        <nav class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <router-link to="/" class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <img src="@/assets/logo.svg" alt="" class="h-8 w-8 inline-block mr-2">
                    Vue-blog
                </router-link>

                <nav class="space-x-8 hidden md:flex">
                    <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                        class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                        {{ item.name }}
                    </router-link>
                </nav>

                <div class="flex items-center space-x-8 md:space-x-6">
                    <!-- Sun/Moon theme toggle button -->
                    <button @click="$emit('toggle-theme')"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span v-if="isDark">🌞</span>
                        <span v-else>🌙</span>
                    </button>

                    <!-- Login and Register buttons -->
                    <div class="flex space-x-2">
                        <router-link to="/auth/login"
                            class="text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition duration-200 ease-in-out">
                            Login
                        </router-link>
                        <router-link to="/auth/register"
                            class="text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition duration-200 ease-in-out">
                            Register
                        </router-link>
                    </div>
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

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
]
</script>
