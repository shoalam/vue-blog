<template>
  <n-layout has-sider position="absolute" style="height: 100vh;">
    <Sidebar :collapsed="collapsed" @update:collapsed="collapsed = $event" />
    <n-layout>
      <n-layout-header 
        bordered 
        style="height: 64px; position: absolute; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; padding: 0 24px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);"
      >
        <Header :collapsed="collapsed" @toggle-sidebar="collapsed = !collapsed" />
      </n-layout-header>
      <n-layout-content 
        content-style="padding: 24px; padding-top: 88px; min-height: 100vh;" 
        :native-scrollbar="false"
      >
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="mb-8">
            <n-breadcrumb class="mb-2">
              <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
                <span v-else>{{ item.label }}</span>
              </n-breadcrumb-item>
            </n-breadcrumb>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
          </div>

          <router-view />
        </div>
        <n-layout-footer bordered style="padding: 24px; margin-top: 40px;">
          <Footer />
        </n-layout-footer>
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
    NLayoutSider,
    NLayoutContent,
    NLayoutFooter,
    NBreadcrumb,
    NBreadcrumbItem,
} from 'naive-ui';

const collapsed = ref(false);
const route = useRoute();

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