<template>
  <div class="flex items-center justify-between w-full h-full">
    <div class="flex items-center gap-4">
      <n-button quaternary circle @click="$emit('toggle-sidebar')">
        <template #icon>
          <n-icon size="20">
            <MenuOutline v-if="collapsed" />
            <CloseOutline v-else />
          </n-icon>
        </template>
      </n-button>
    </div>

    <div class="flex items-center gap-4">
      <!-- Dark mode toggle could go here -->
      <n-dropdown trigger="click" :options="userOptions" @select="handleUserSelect">
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 px-2 rounded-full transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
          <n-avatar round size="small" :src="userAvatar" />
          <span class="text-sm font-bold text-gray-700 dark:text-gray-300 hidden sm:inline-block">{{ userName }}</span>
          <n-icon size="14" class="text-gray-400">
            <ChevronDownOutline />
          </n-icon>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NIcon, useMessage } from "naive-ui";
import { useAuth } from "@/composables/useAuth";
import {
  MenuOutline,
  CloseOutline,
  PersonOutline,
  SettingsOutline,
  LogOutOutline,
  ChevronDownOutline
} from "@vicons/ionicons5";

const props = defineProps({
  collapsed: Boolean
});

const emit = defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const message = useMessage();
const { user, logout: authLogout } = useAuth();

const userName = computed(() => {
  if (!user.value) return 'Guest';
  return user.value.firstName && user.value.lastName 
    ? `${user.value.firstName} ${user.value.lastName}` 
    : user.value.email || 'User';
});

const userAvatar = computed(() => {
  return user.value?.avatar || "https://i.pravatar.cc/150";
});

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const userOptions = [
  {
    label: "Profile",
    key: "profile",
    icon: renderIcon(PersonOutline)
  },
  {
    label: "Settings",
    key: "settings",
    icon: renderIcon(SettingsOutline)
  },
  {
    type: "divider",
    key: "d1"
  },
  {
    label: "Logout",
    key: "logout",
    icon: renderIcon(LogOutOutline)
  }
];

const handleUserSelect = (key) => {
  if (key === 'logout') {
    handleLogout();
  } else if (key === 'profile') {
    router.push({ name: 'profile' });
  } else {
    message.info(`Selected ${key}`);
  }
};

const handleLogout = async () => {
    try {
        await authLogout();
        message.success("Logged out successfully");
        router.push({ name: 'login' });
    } catch (error) {
        message.error("Logout failed");
    }
};
</script>

<style scoped>
</style>
