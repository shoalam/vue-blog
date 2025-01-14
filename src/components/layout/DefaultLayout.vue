<template>
    <div>
        <Navbar />
        <main>
            <RouterView />
        </main>
        <Footer />
    </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
    name: 'DefaultLayout',
    components: {
        Navbar,
        Footer,
    },
};
</script>

<style>
main {
    padding: 20px;
}
</style>