<template>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/blog">Blogs</router-link>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
};
</script>

<style>
nav {
    display: flex;
    gap: 10px;
    background: #f8f9fa;
    padding: 10px;
}

nav a {
    text-decoration: none;
    color: #007bff;
}

nav a.router-link-exact-active {
    font-weight: bold;
    color: #0056b3;
}
</style>