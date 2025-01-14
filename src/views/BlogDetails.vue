<template>
    <div>
        <h1>{{ post.title }}</h1>
        <p>{{ post.content }}</p>
        <router-link to="/">Back to Home</router-link>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'BlogDetails',
    setup() {
        const route = useRoute();
        const posts = [
            { id: 1, title: 'First Blog Post', content: 'This is the first blog post.' },
            { id: 2, title: 'Another Blog Post', content: 'Here is another blog post.' },
            { id: 3, title: 'Yet Another Post', content: 'Yet another post to enjoy!' },
        ];
        const post = ref(posts.find((p) => p.id === parseInt(route.params.id)));
        return { post };
    },
};
</script>