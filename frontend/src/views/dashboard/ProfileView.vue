<template>
  <div class="max-w-4xl mx-auto pb-8">
    <n-space vertical size="large">
      <div class="flex justify-end">
        <n-tag :type="user?.role === 'admin' ? 'error' : 'info'" round>
          {{ user?.role?.toUpperCase() || 'USER' }}
        </n-tag>
      </div>

      <!-- Profile Information Card -->
      <n-card title="Personal Information" bordered>
        <n-form
          ref="profileFormRef"
          :model="profileForm"
          label-placement="top"
          size="large"
          @submit.prevent="handleUpdateProfile"
        >
          <n-grid :cols="2" :x-gap="24">
            <n-gi :span="2">
              <div class="flex items-center gap-6 mb-8">
                <n-avatar
                  round
                  :size="80"
                  :src="userAvatar"
                />
                <n-upload
                  :max="1"
                  @change="handleAvatarChange"
                  @remove="handleAvatarRemove"
                >
                  <n-button quaternary type="primary">Change Avatar</n-button>
                </n-upload>
              </div>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="First Name" path="firstName">
                <n-input v-model:value="profileForm.firstName" placeholder="First Name" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Last Name" path="lastName">
                <n-input v-model:value="profileForm.lastName" placeholder="Last Name" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Email Address" path="email">
                <n-input v-model:value="profileForm.email" disabled placeholder="Email" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Username" path="username">
                <n-input v-model:value="profileForm.username" placeholder="Username" />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Bio" path="bio">
                <n-input
                  v-model:value="profileForm.bio"
                  type="textarea"
                  placeholder="Tell us about yourself..."
                  :autosize="{ minRows: 3, maxRows: 6 }"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <div class="flex justify-end mt-4">
            <n-button type="primary" :loading="profileUpdating" attr-type="submit">
              Save Profile Changes
            </n-button>
          </div>
        </n-form>
      </n-card>

      <!-- Change Password Card -->
      <n-card title="Security" bordered>
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="top"
          size="large"
          @submit.prevent="handleChangePassword"
        >
          <n-grid :cols="1" :y-gap="12">
            <n-gi>
              <n-form-item label="Current Password" path="currentPassword">
                <n-input
                  v-model:value="passwordForm.currentPassword"
                  type="password"
                  show-password-on="click"
                  placeholder="Enter current password"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="New Password" path="newPassword">
                <n-input
                  v-model:value="passwordForm.newPassword"
                  type="password"
                  show-password-on="click"
                  placeholder="Enter new password"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Confirm New Password" path="confirmPassword">
                <n-input
                  v-model:value="passwordForm.confirmPassword"
                  type="password"
                  show-password-on="click"
                  placeholder="Confirm new password"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <div class="flex justify-end mt-6">
            <n-button type="primary" :loading="passwordUpdating" attr-type="submit">
              Update Password
            </n-button>
          </div>
        </n-form>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useMessage } from 'naive-ui';

const { user, getAuthHeader } = useAuth();
const message = useMessage();

const profileFormRef = ref(null);
const passwordFormRef = ref(null);
const profileUpdating = ref(false);
const passwordUpdating = ref(false);

const profileForm = reactive({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: '',
    avatar: null,
});

const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const userAvatar = computed(() => {
    return user.value?.avatar || 'https://i.pravatar.cc/150';
});

const passwordRules = {
    currentPassword: {
        required: true,
        message: 'Current password is required',
        trigger: 'blur'
    },
    newPassword: {
        required: true,
        message: 'New password is required',
        trigger: 'blur',
        min: 6
    },
    confirmPassword: [
        {
            required: true,
            message: 'Please confirm your password',
            trigger: 'blur'
        },
        {
            validator: (rule, value) => value === passwordForm.newPassword,
            message: 'Passwords do not match',
            trigger: 'blur'
        }
    ]
};

const handleAvatarChange = (options) => {
    const { file } = options;
    if (file.file) {
        // In a real app, you would upload to a server here or use a base64
        profileForm.avatar = 'https://i.pravatar.cc/150'; 
    }
};

const handleAvatarRemove = () => {
    profileForm.avatar = null;
};

const handleUpdateProfile = async () => {
    try {
        profileUpdating.value = true;
        const userId = user.value?._id || user.value?.id;
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/profile/${userId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(profileForm),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        message.success('Profile updated successfully!');
        // Update local user state if needed (usually handled by auth provider or re-fetch)
    } catch (error) {
        console.error('Error updating profile:', error);
        message.error(error.message || 'Failed to update profile');
    } finally {
        profileUpdating.value = false;
    }
};

const handleChangePassword = async () => {
    passwordFormRef.value?.validate(async (errors) => {
        if (!errors) {
            try {
                passwordUpdating.value = true;
                const userId = user.value?._id || user.value?.id;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/change-password/${userId}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    },
                    body: JSON.stringify({
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to change password');
                }

                message.success('Password changed successfully!');
                
                // Reset form
                passwordForm.currentPassword = '';
                passwordForm.newPassword = '';
                passwordForm.confirmPassword = '';
            } catch (error) {
                console.error('Error changing password:', error);
                message.error(error.message || 'Failed to change password');
            } finally {
                passwordUpdating.value = false;
            }
        }
    });
};

onMounted(() => {
    if (user.value) {
        profileForm.firstName = user.value.firstName || '';
        profileForm.lastName = user.value.lastName || '';
        profileForm.email = user.value.email || '';
        profileForm.username = user.value.username || '';
        profileForm.bio = user.value.bio || '';
    }
});
</script>

<style scoped>
</style>
