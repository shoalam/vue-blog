<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <!-- Main Content -->
        <div class="transition-all duration-300"
            :class="[isSidebarOpen ? 'ml-64' : 'ml-0', 'flex flex-col min-h-screen']">
            <!-- Top Header -->
            <Header @toggle-sidebar="toggleSidebar" :isOpen="isSidebarOpen" />

            <!-- Page Content -->
            <main class="flex-1 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidebar from '../dashboard/Sidebar.vue';
import Header from '../dashboard/Header.vue';

// State
const isSidebarOpen = ref(true);

// Computed
// const isSuperAdmin = computed(() => false); // Replace with actual user role check when auth is implemented

// Methods
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>