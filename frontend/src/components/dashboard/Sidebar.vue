<template lang="">
  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out"
  >
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="p-4 border-b dark:border-gray-700">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="w-6 h-6" />
          <span class="text-lg font-bold text-gray-800 dark:text-white"
            >Blog CMS</span
          >
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-2 overflow-y-auto">
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          style="width: 256px"
          mode="inline"
          :theme="theme"
          :items="items"
        />
    </nav>

<!-- User Profile -->
<!-- <div class="p-4 border-t dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img :src="user.avatar || '/default-avatar.png'" alt="User avatar"
                            class="w-10 h-10 rounded-full">
                        <div>
                            <p class="font-medium text-gray-800 dark:text-white">{{ user.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.role }}</p>
                        </div>
                    </div>
                </div> -->
</div>
</aside>
</template>
<script setup>
import { h, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";

const theme = ref("light");
const selectedKeys = ref(["dashboard"]);
const openKeys = ref(["manage-posts"]);

const items = ref([
  {
    key: "dashboard",
    icon: h(DashboardOutlined),
    label: h(RouterLink, { to: "/dashboard" }, () => "Dashboard"),
    title: "Dashboard",
  },
  {
    key: "manage-posts",
    icon: h(FileTextOutlined),
    label: "Manage Posts",
    title: "Manage Posts",
    children: [
      {
        key: "add-post",
        label: h(RouterLink, { to: "/dashboard/blogs/create" }, () => "Add Post"),
        title: "Add Post",
      },
      {
        key: "post-list",
        label: h(RouterLink, { to: "/dashboard/blogs" }, () => "Post List"),
        title: "Post List",
      },
      {
        key: "edit-post",
        label: h(RouterLink, { to: `/dashboard/blogs/edit/` }, () => "Edit Post"),
        title: "Edit Post",
      },
    ],
  },
  {
    key: "users-list",
    icon: h(UserOutlined),
    label: h(RouterLink, { to: "/users" }, () => "Users List"),
    title: "Users List",
  },
]);

const changeTheme = (checked) => {
  theme.value = checked ? "dark" : "light";
};


</script>
<style lang=""></style>
