<template>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

        <!-- Profile Information Card -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

                <form @submit.prevent="updateProfile">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profile Picture -->
                        <div class="md:col-span-2 flex items-center gap-6">
                            <div class="relative">
                                <img 
                                    :src="profileForm.avatarPreview || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileForm.firstName + ' ' + profileForm.lastName) + '&size=128&background=random'" 
                                    alt="Profile" 
                                    class="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="block">
                                    <span class="sr-only">Choose profile photo</span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        @change="handleAvatarUpload"
                                        class="block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100
                                            dark:file:bg-indigo-900 dark:file:text-indigo-200
                                            dark:hover:file:bg-indigo-800"
                                    />
                                </label>
                                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF (MAX. 2MB)</p>
                            </div>
                        </div>

                        <!-- First Name -->
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                First Name
                            </label>
                            <input 
                                type="text" 
                                id="firstName" 
                                v-model="profileForm.firstName"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <!-- Last Name -->
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last Name
                            </label>
                            <input 
                                type="text" 
                                id="lastName" 
                                v-model="profileForm.lastName"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                v-model="profileForm.email"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <!-- Username -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input 
                                type="text" 
                                id="username" 
                                v-model="profileForm.username"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <!-- Bio -->
                        <div class="md:col-span-2">
                            <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea 
                                id="bio" 
                                v-model="profileForm.bio"
                                rows="4"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="mt-6 flex justify-end">
                        <button 
                            type="submit"
                            :disabled="profileUpdating"
                            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ profileUpdating ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Change Password Card -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

                <form @submit.prevent="changePassword">
                    <div class="space-y-4">
                        <!-- Current Password -->
                        <div>
                            <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <input 
                                type="password" 
                                id="currentPassword" 
                                v-model="passwordForm.currentPassword"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <!-- New Password -->
                        <div>
                            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <input 
                                type="password" 
                                id="newPassword" 
                                v-model="passwordForm.newPassword"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                                minlength="6"
                            />
                        </div>

                        <!-- Confirm New Password -->
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                v-model="passwordForm.confirmPassword"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                required
                                minlength="6"
                            />
                        </div>

                        <!-- Error Message -->
                        <div v-if="passwordError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                            {{ passwordError }}
                        </div>
                    </div>

                    <!-- Update Password Button -->
                    <div class="mt-6 flex justify-end">
                        <button 
                            type="submit"
                            :disabled="passwordUpdating"
                            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ passwordUpdating ? 'Updating...' : 'Update Password' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const profileForm = reactive({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Passionate blogger and developer sharing insights about technology and life.',
    avatar: null,
    avatarPreview: null,
});

const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const profileUpdating = ref(false);
const passwordUpdating = ref(false);
const passwordError = ref('');

const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }
        profileForm.avatar = file;
        profileForm.avatarPreview = URL.createObjectURL(file);
    }
};

const updateProfile = async () => {
    try {
        profileUpdating.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would make an actual API call
        // const response = await fetch('http://localhost:3001/api/v1/users/profile', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(profileForm),
        // });

        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    } finally {
        profileUpdating.value = false;
    }
};

const changePassword = async () => {
    passwordError.value = '';

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordError.value = 'New passwords do not match';
        return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
        passwordError.value = 'Password must be at least 6 characters long';
        return;
    }

    try {
        passwordUpdating.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would make an actual API call
        // const response = await fetch('http://localhost:3001/api/v1/users/change-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         currentPassword: passwordForm.currentPassword,
        //         newPassword: passwordForm.newPassword,
        //     }),
        // });

        alert('Password changed successfully!');
        
        // Reset form
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
    } catch (error) {
        console.error('Error changing password:', error);
        passwordError.value = 'Failed to change password. Please try again.';
    } finally {
        passwordUpdating.value = false;
    }
};

onMounted(() => {
    // Fetch user profile data from API
    // This is placeholder data
});
</script>