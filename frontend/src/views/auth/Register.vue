<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 py-12">
    <n-card class="max-w-md w-full shadow-xl" bordered>
      <div class="text-center mb-8">
        <n-icon size="48" class="text-indigo-600 mb-2">
          <LogoIonic />
        </n-icon>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Already have an account?
          <router-link :to="{ name: 'login' }" class="text-indigo-600 font-semibold hover:underline">
            Sign in
          </router-link>
        </p>
      </div>

      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="top"
        size="large"
        @submit.prevent="handleSubmit"
      >
        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-form-item label="First Name" path="firstName">
              <n-input v-model:value="form.firstName" placeholder="John" clearable />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Last Name" path="lastName">
              <n-input v-model:value="form.lastName" placeholder="Doe" clearable />
            </n-form-item>
          </n-gi>
        </n-grid>

        <n-form-item label="Email Address" path="email">
          <n-input v-model:value="form.email" placeholder="john.doe@example.com" clearable>
            <template #prefix>
              <n-icon><MailOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="Password" path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            show-password-on="click"
            placeholder="Min 6 characters"
            clearable
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="acceptTerms">
          <n-checkbox v-model:checked="form.acceptTerms">
            I agree to the <a href="#" class="text-indigo-600 hover:underline">Terms & Conditions</a>
          </n-checkbox>
        </n-form-item>

        <n-button
          type="primary"
          block
          size="large"
          attr-type="submit"
          :loading="loading"
          class="font-bold mt-2"
        >
          Create Account
        </n-button>
      </n-form>

      <div class="mt-8">
        <div class="relative flex items-center justify-center mb-6">
          <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span class="px-4 text-xs text-gray-500 uppercase">Or continue with</span>
          <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-button block quaternary bordered>
              <template #icon>
                <n-icon><LogoGoogle /></n-icon>
              </template>
              Google
            </n-button>
          </n-gi>
          <n-gi>
            <n-button block quaternary bordered>
              <template #icon>
                <n-icon><LogoGithub /></n-icon>
              </template>
              GitHub
            </n-button>
          </n-gi>
        </n-grid>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useMessage } from 'naive-ui'
import {
    MailOutline,
    LockClosedOutline,
    LogoGoogle,
    LogoGithub,
    LogoIonic
} from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const { register: authRegister } = useAuth()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false
})

const rules = {
    firstName: { required: true, message: 'First name is required', trigger: 'blur' },
    lastName: { required: true, message: 'Last name is required', trigger: 'blur' },
    email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Password is required', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
    ],
    acceptTerms: {
        validator: (rule, value) => !!value,
        message: 'You must accept the terms',
        trigger: 'change'
    }
}

const handleSubmit = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            try {
                const result = await authRegister({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    username: form.email.split('@')[0], // Simple username fallback
                })

                if (result.success) {
                    message.success('Registration successful! Please login.')
                    router.push({ name: 'login' })
                } else {
                    message.error(result.error || 'Registration failed')
                }
            } catch (error) {
                console.error('Registration error:', error)
                message.error('An unexpected error occurred. Please try again.')
            } finally {
                loading.value = false
            }
        }
    })
}
</script>