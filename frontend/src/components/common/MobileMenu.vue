// MobileMenu.vue
<template>
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="isOpen" class="md:hidden mt-4">
            <div class="flex flex-col space-y-2 px-2 pt-2 pb-3">
                <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                    class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
                    @click="$emit('close')">
                    {{ item.name }}
                </router-link>

                <div class="mt-4 space-y-2">
                    <router-link to="/auth/login"
                        class="block w-full text-center text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200"
                        @click="$emit('close')">
                        Login
                    </router-link>
                    <router-link to="/auth/register"
                        class="block w-full text-center text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200"
                        @click="$emit('close')">
                        Register
                    </router-link>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    navItems: {
        type: Array,
        required: true
    }
})

defineEmits(['close'])
</script>
