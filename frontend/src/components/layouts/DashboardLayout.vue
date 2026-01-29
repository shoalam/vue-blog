<template>
  <n-layout has-sider position="absolute" style="height: 100vh;">
    <!-- Desktop Sidebar -->
    <Sidebar 
      v-if="!isMobile"
      :collapsed="collapsed" 
      @update:collapsed="collapsed = $event" 
    />

    <!-- Mobile Sidebar (Drawer) -->
    <n-drawer
      v-model:show="showMobileMenu"
      :width="240"
      placement="left"
      class="md:hidden"
    >
      <Sidebar 
        :collapsed="false" 
        @update:collapsed="showMobileMenu = false"
      />
    </n-drawer>

    <n-layout>
      <n-layout-header 
        bordered 
        style="height: 64px; position: absolute; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; padding: 0 24px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);"
      >
        <Header 
          :collapsed="collapsed" 
          @toggle-sidebar="toggleSidebar" 
        />
      </n-layout-header>
      <n-layout-content 
        content-style="padding: 16px; padding-top: 88px; min-height: 100vh; display: flex; flex-direction: column;" 
        :native-scrollbar="false"
      >
        <div class="max-w-7xl mx-auto w-full flex-grow">
          <!-- Page Header -->
          <div class="mb-6 md:mb-8 px-2 md:px-0">
            <n-breadcrumb class="mb-2 hidden sm:flex">
              <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
                <span v-else>{{ item.label }}</span>
              </n-breadcrumb-item>
            </n-breadcrumb>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
          </div>

          <router-view />
        </div>
        
        <!-- Footer wrapper to ensure it stays below content -->
        <div class="mt-auto pt-8 md:pt-12">
          <n-layout-footer bordered class="flex justify-center border-t border-gray-100 dark:border-gray-800" style="background: transparent;">
            <Footer />
          </n-layout-footer>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Sidebar from '../dashboard/Sidebar.vue';
import Header from '../dashboard/Header.vue';
import Footer from '../dashboard/Footer.vue';
import {
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NBreadcrumb,
    NBreadcrumbItem,
    NDrawer,
    useBreakpoint
} from 'naive-ui';

const collapsed = ref(false);
const showMobileMenu = ref(false);
const route = useRoute();
const breakpoints = useBreakpoint();

const isMobile = computed(() => breakpoints.value.l === false);

const toggleSidebar = () => {
  if (isMobile.value) {
    showMobileMenu.value = true;
  } else {
    collapsed.value = !collapsed.value;
  }
};

const pageTitle = computed(() => route.meta.title || 'Dashboard');

const breadcrumbs = computed(() => {
  const matched = route.matched;
  return matched
    .filter(m => m.meta && m.meta.title)
    .map(m => ({
      label: m.meta.title,
      path: m.children && m.children.length > 0 ? m.path : null
    }));
});
</script>
