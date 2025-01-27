<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header @toggle-theme="toggleDark" :isDark="isDark" />
      <router-view></router-view>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from './theme/switchTheme'
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'

const { isDark, toggleDark } = useDarkMode()

</script>

<style scoped></style>
