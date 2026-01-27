<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <n-card class="max-w-md w-full shadow-xl" bordered>
      <div class="text-center mb-8">
        <n-icon size="48" class="text-indigo-600 mb-2">
          <LogoIonic />
        </n-icon>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Don't have an account?
          <router-link :to="{ name: 'register' }" class="text-indigo-600 font-semibold hover:underline">
            Sign up
          </router-link>
        </p>
      </div>

      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="top"
        size="large"
        @submit.prevent="handleLogin"
      >
        <n-form-item label="Email Address" path="email">
          <n-input
            v-model:value="form.email"
            placeholder="Enter your email"
            clearable
          >
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
            placeholder="Enter your password"
            clearable
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <div class="flex items-center justify-between mb-6">
          <n-checkbox v-model:checked="form.rememberMe">Remember me</n-checkbox>
          <a href="#" class="text-sm text-indigo-600 hover:underline">Forgot password?</a>
        </div>

        <n-button
          type="primary"
          block
          size="large"
          attr-type="submit"
          :loading="loading"
          class="font-bold"
        >
          Sign In
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
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()
const message = useMessage()
const { login: authLogin } = useAuth()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
    email: '',
    password: '',
    rememberMe: false
})

const rules = {
    email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Password is required', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
    ]
}

const handleLogin = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            try {
                const result = await authLogin(form.email, form.password)

                if (result.success) {
                    message.success('Welcome back!')
                    const redirect = route.query.redirect || '/dashboard'
                    router.push(redirect)
                } else {
                    message.error(result.error || 'Invalid email or password')
                }
            } catch (error) {
                console.error('Login error:', error)
                message.error('An unexpected error occurred. Please try again.')
            } finally {
                loading.value = false
            }
        }
    })
}
</script>