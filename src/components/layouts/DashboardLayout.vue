<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <!-- Sidebar -->
        <aside
            class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out"
            :class="{ '-translate-x-full': !isSidebarOpen }">
            <div class="flex flex-col h-full">
                <!-- Logo -->
                <div class="p-4 border-b dark:border-gray-700">
                    <router-link to="/" class="flex items-center space-x-2">
                        <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8">
                        <span class="text-xl font-bold text-gray-800 dark:text-white">Blog CMS</span>
                    </router-link>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                    <!-- Dashboard -->
                    <router-link to="/dashboard"
                        class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons mr-3">dashboard</span>
                        Dashboard
                    </router-link>

                    <!-- Blogs -->
                    <router-link to="/dashboard/blogs"
                        class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons mr-3">article</span>
                        My Blogs
                    </router-link>

                    <!-- Users (Super Admin Only) -->
                    <router-link v-if="isSuperAdmin" to="/dashboard/users"
                        class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons mr-3">people</span>
                        Manage Users
                    </router-link>

                    <!-- Categories (Super Admin Only) -->
                    <router-link v-if="isSuperAdmin" to="/dashboard/categories"
                        class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons mr-3">category</span>
                        Categories
                    </router-link>
                </nav>

                <!-- User Profile -->
                <div class="p-4 border-t dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img :src="user.avatar || '/default-avatar.png'" alt="User avatar"
                            class="w-10 h-10 rounded-full">
                        <div>
                            <p class="font-medium text-gray-800 dark:text-white">{{ user.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="ml-64 flex flex-col min-h-screen">
            <!-- Top Header -->
            <header class="bg-white dark:bg-gray-800 shadow-sm">
                <div class="flex items-center justify-between px-4 py-3">
                    <button @click="toggleSidebar" class="md:hidden">
                        <span class="material-icons">menu</span>
                    </button>
                    <div class="flex items-center space-x-4">
                        <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="material-icons">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
                        </button>
                        <button @click="logout"
                            class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { useAuth } from '@/composables/useAuth'
// import { useTheme } from '@/composables/useTheme'

// const { user, logout } = useAuth()
// const { isDark, toggleTheme } = useTheme()
const isSidebarOpen = ref(true)

const isSuperAdmin = computed(() => user.value?.role === 'super_admin')

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}
</script>