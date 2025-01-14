<template>
    <footer>
        <p>&copy; {{ new Date().getFullYear() }} Personal Blog</p>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style>
footer {
    background: #f8f9fa;
    text-align: center;
    padding: 10px;
    position: relative;
    bottom: 0;
    width: 100%;
}
</style>