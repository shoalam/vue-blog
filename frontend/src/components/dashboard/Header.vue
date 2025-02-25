<template lang="">
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="flex items-center justify-between px-4 py-3">
      <button @click="toggleSidebar" class="md:hidden">
        <span class="material-icons">menu</span>
      </button>
      <div class="flex items-center space-x-4">
        <!-- <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
                    </button> -->
        <button
          @click="logout"
          class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
        >
          Logout
        </button>
        <a-space wrap>
          <a-button type="primary">Primary Button</a-button>
          <a-button>Default Button</a-button>
          <a-button type="dashed">Dashed Button</a-button>
          <a-button type="text">Text Button</a-button>
          <a-button type="link">Link Button</a-button>
        </a-space>
        <a-badge count="5">
          <a-avatar shape="square" size="large" />
        </a-badge>
      </div>
    </div>
  </header>
</template>
<script>
import { UserOutlined } from "@ant-design/icons-vue";
export default {};
</script>
<style lang=""></style>
