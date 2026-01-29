<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    bordered
    @update:collapsed="$emit('update:collapsed', $event)"
  >
    <div class="flex flex-col h-full">
      <!-- Logo Section (Matching Header Height) -->
      <div class="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
        <router-link to="/" class="flex items-center gap-3 overflow-hidden">
          <n-icon size="32" color="#4f46e5">
            <LogoIonic />
          </n-icon>
          <span v-if="!collapsed" class="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap tracking-tight"
            >Blog CMS</span
          >
        </router-link>
      </div>

      <!-- Navigation -->
      <div class="flex-1 py-4 overflow-y-auto">
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </div>

      <!-- Footer User Profile -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div class="flex items-center gap-3">
          <n-avatar round size="medium" src="https://i.pravatar.cc/150" />
          <div v-if="!collapsed" class="overflow-hidden">
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userRole }}</p>
          </div>
        </div>
      </div>
    </div>
  </n-layout-sider>
</template>

<script setup>
import { h, ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import { useAuth } from "@/composables/useAuth";
import {
  GridOutline,
  BookOutline,
  AddOutline,
  ListOutline,
  PeopleOutline,
  LogoIonic,
  TerminalOutline,
  LayersOutline
} from "@vicons/ionicons5";

const props = defineProps({
  collapsed: Boolean
});

const emit = defineEmits(['update:collapsed']);

const { user } = useAuth();
const route = useRoute();
const activeKey = ref(route.name);

const userName = computed(() => {
  if (!user.value) return 'Guest';
  return user.value.firstName && user.value.lastName 
    ? `${user.value.firstName} ${user.value.lastName}` 
    : user.value.email || 'User';
});

const userRole = computed(() => {
  return user.value?.role || 'Administrator';
});

watch(() => route.name, (newName) => {
  activeKey.value = newName;
});

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(RouterLink, { to: { name: "dashboard" } }, { default: () => "Dashboard" }),
    key: "dashboard",
    icon: renderIcon(GridOutline)
  },
  {
    label: "Manage Posts",
    key: "manage-posts",
    icon: renderIcon(BookOutline),
    children: [
      {
        label: () => h(RouterLink, { to: { name: "create-blog" } }, { default: () => "Add Post" }),
        key: "create-blog",
        icon: renderIcon(AddOutline)
      },
      {
        label: () => h(RouterLink, { to: { name: "dashboard-blogs" } }, { default: () => "Post List" }),
        key: "dashboard-blogs",
        icon: renderIcon(ListOutline)
      },
      {
        label: () => h(RouterLink, { to: { name: "dashboard-categories" } }, { default: () => "Categories" }),
        key: "dashboard-categories",
        icon: renderIcon(LayersOutline)
      }
    ]
  },
  {
    label: () => h(RouterLink, { to: { name: "dashboard-users" } }, { default: () => "Users List" }),
    key: "dashboard-users",
    icon: renderIcon(PeopleOutline)
  },
  {
    label: () => h(RouterLink, { to: { name: "api-explorer" } }, { default: () => "API Explorer" }),
    key: "api-explorer",
    icon: renderIcon(TerminalOutline)
  }
];
</script>
