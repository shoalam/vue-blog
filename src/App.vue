<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script>
import DefaultLayout from './components/layout/DefaultLayout.vue';
import { RouterView } from 'vue-router';
export default {
  name: 'App',
};
</script>