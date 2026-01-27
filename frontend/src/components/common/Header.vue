<template>
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <nav class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <!-- Logo -->
                <router-link to="/" class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <img src="@/assets/logo.svg" alt="" class="h-8 w-8 inline-block mr-2">
                    Vue-blog
                </router-link>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex space-x-8">
                    <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                        class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200">
                        {{ item.name }}
                    </router-link>
                </nav>

                <!-- Desktop Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Theme Toggle -->
                    <button @click="$emit('toggle-theme')"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <span v-if="isDark">🌞</span>
                        <span v-else>🌙</span>
                    </button>

                    <!-- Auth Buttons -->
                    <div class="hidden md:flex space-x-2" v-if="!isAuthenticated">
                        <router-link to="/auth/login"
                            class="text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200">
                            Login
                        </router-link>
                        <router-link to="/auth/register"
                            class="text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200">
                            Register
                        </router-link>
                    </div>

                    <!-- User Menu (when authenticated) -->
                    <div class="hidden md:flex items-center space-x-2" v-else>
                        <router-link to="/dashboard"
                            class="text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200">
                            Dashboard
                        </router-link>
                        <button @click="handleLogout"
                            class="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-all duration-200">
                            Logout
                        </button>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button @click="isMenuOpen = !isMenuOpen"
                        class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg v-if="isMenuOpen" xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu Component -->
            <MobileMenu :is-open="isMenuOpen" :nav-items="navItems" @close="isMenuOpen = false" />
        </nav>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MobileMenu from './MobileMenu.vue'
import { useAuth } from '@/composables/useAuth'
import { useMessage } from 'naive-ui'

const props = defineProps({
    isDark: {
        type: Boolean,
        required: true
    }
})

defineEmits(['toggle-theme'])

const router = useRouter()
const message = useMessage()
const { isAuthenticated, logout } = useAuth()
const isMenuOpen = ref(false)

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
]

const handleLogout = async () => {
    try {
        await logout()
        message.success('Logged out successfully')
        router.push('/')
    } catch (error) {
        message.error('Logout failed')
    }
}
</script>