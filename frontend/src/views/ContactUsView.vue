<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div class="max-w-3xl mx-auto">

            <!-- Header Section -->
            <div class="text-center mb-12">
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Contact
                    Us</h1>
                <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors">
                    Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as
                    possible.
                </p>
            </div>

            <!-- Contact Form -->
            <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg transition-colors">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Name Field -->
                    <div>
                        <label for="name"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">Name</label>
                        <input type="text" id="name" v-model="formData.name" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 
                       focus:ring-indigo-500 dark:focus:ring-indigo-400 p-2 transition-colors" required>
                    </div>

                    <!-- Email Field -->
                    <div>
                        <label for="email"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">Email</label>
                        <input type="email" id="email" v-model="formData.email" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 
                       focus:ring-indigo-500 dark:focus:ring-indigo-400 p-2 transition-colors" required>
                    </div>

                    <!-- Subject Field -->
                    <div>
                        <label for="subject"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">Subject</label>
                        <input type="text" id="subject" v-model="formData.subject" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 
                       focus:ring-indigo-500 dark:focus:ring-indigo-400 p-2 transition-colors" required>
                    </div>

                    <!-- Message Field -->
                    <div>
                        <label for="message"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">Message</label>
                        <textarea id="message" v-model="formData.message" rows="4" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 
                       focus:ring-indigo-500 dark:focus:ring-indigo-400 p-2 transition-colors" required></textarea>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end">
                        <button type="submit" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-md 
                       hover:bg-indigo-700 dark:hover:bg-indigo-600 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                       focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                        </button>
                    </div>
                </form>

                <!-- Success Message -->
                <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-md transition-colors">
                    <p class="text-green-700 dark:text-green-200">Thank you for your message! We'll get back to you
                        soon.</p>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div class="text-center sm:text-left">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Visit Us</h2>
                    <p class="text-gray-600 dark:text-gray-300 transition-colors">
                        123 Blog Street<br>
                        San Francisco, CA 94103<br>
                        United States
                    </p>
                </div>
                <div class="text-center sm:text-left">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Get in Touch
                    </h2>
                    <p class="text-gray-600 dark:text-gray-300 transition-colors">
                        Email: hello@yourblog.com<br>
                        Phone: (555) 123-4567<br>
                        Hours: Mon-Fri 9am - 5pm PST
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        isDark.value = savedTheme === 'dark'
    } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    }
})

const handleSubmit = async () => {
    isSubmitting.value = true

    try {
        // Replace this with your actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Clear form
        formData.name = ''
        formData.email = ''
        formData.subject = ''
        formData.message = ''

        // Show success message
        showSuccess.value = true
        setTimeout(() => {
            showSuccess.value = false
        }, 5000)
    } catch (error) {
        console.error('Error submitting form:', error)
        // Handle error appropriately
    } finally {
        isSubmitting.value = false
    }
}
</script>