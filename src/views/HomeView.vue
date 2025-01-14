<template>
  <h1>Home</h1>
  <ul>
    <li v-for="post in posts" :key="post.id">
      <RouterLink :to="`/blog/${post.id}`">{{ post.title }}</RouterLink>
    </li>
  </ul>
</template>

<script>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const posts = ref([
      { id: 1, title: 'First Blog Post' },
      { id: 2, title: 'Another Blog Post' },
      { id: 3, title: 'Yet Another Post' },
    ]);
    return { posts };
  },
};
</script>