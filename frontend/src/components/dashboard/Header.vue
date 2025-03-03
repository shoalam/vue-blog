<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="flex items-center justify-between px-4 py-4">
      <!-- Hamburger Menu Button (For Mobile) -->
      <a-button type="text" @click="toggleSidebar">
        <span :class="isSidebarOpen ? 'anticon-close' : 'anticon-menu'">
          <MenuOutlined />
          <CloseOutlined v-if="isSidebarOpen" />
        </span>
      </a-button>

      <!-- User Profile Dropdown -->
      <div class="flex items-center space-x-4 justify-self-end">
        <a-dropdown>
          <a class="flex items-center space-x-2 cursor-pointer">
            <a-avatar :src="user.avatar" />
            <span class="text-gray-700 dark:text-white">{{ user.name }}</span>
            <span class="text-gray-500">
              <DownOutlined />
            </span> <!-- Down Arrow Icon -->
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile">
                <template #icon>
                  <UserOutlined />
                </template>
                <RouterLink to="/profile">Profile</RouterLink>
              </a-menu-item>
              <a-menu-item key="settings">
                <template #icon>
                  <SettingOutlined />
                </template>
                <RouterLink to="/settings">Settings</RouterLink>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="logout">
                <template #icon>
                  <LogoutOutlined />
                </template>
                Logout
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { MenuOutlined, CloseOutlined, UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons-vue";

const user = ref({
  name: "John Doe",
  avatar: "https://i.pravatar.cc/40",
});

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen;
  console.log("Sidebar Toggled:", isSidebarOpen.value);
};

const logout = () => {
  console.log("Logging out...");
};
</script>
