<template>
  <n-card bordered>
    <template #header-extra>
      <n-input
        v-model:value="searchQuery"
        placeholder="Search users..."
        clearable
        style="width: 300px"
      >
        <template #prefix>
          <n-icon>
            <SearchOutline />
          </n-icon>
        </template>
      </n-input>
    </template>

    <n-data-table
      remote
      :loading="loading"
      :columns="columns"
      :data="filteredUsers"
      :pagination="pagination"
      :bordered="false"
      :single-line="false"
    />
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { NButton, NSpace, NIcon, NAvatar, NTag, useMessage } from 'naive-ui';
import {
    SearchOutline,
    TrashOutline,
} from '@vicons/ionicons5';

const { getAuthHeader } = useAuth();
const message = useMessage();

const users = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const pagination = ref({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
});

const fetchUsers = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        users.value = data;
    } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to load users list");
    } finally {
        loading.value = false;
    }
};

const deleteUser = async (record) => {
    if (!confirm(`Are you sure you want to delete user "${record.name || record.email}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${record._id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        message.success('User deleted successfully!');
        await fetchUsers();
    } catch (error) {
        console.error("Error deleting user:", error);
        message.error("Failed to delete user. Please try again.");
    }
};

const columns = [
    {
        title: 'User',
        key: 'user',
        render(row) {
            return h(NSpace, { align: 'center' }, {
                default: () => [
                    h(NAvatar, {
                        round: true,
                        size: 'small',
                        src: row.avatar || row.image || 'https://i.pravatar.cc/150'
                    }),
                    h('div', null, {
                        default: () => [
                            h('div', { class: 'font-bold' }, { default: () => row.name || `${row.firstName} ${row.lastName}` }),
                            h('div', { class: 'text-xs text-gray-400' }, { default: () => row.email })
                        ]
                    })
                ]
            });
        }
    },
    {
        title: 'Role',
        key: 'role',
        render(row) {
            return h(NTag, {
                type: row.role === 'admin' ? 'error' : 'info',
                size: 'small',
                round: true
            }, { default: () => row.role || 'author' });
        }
    },
    {
        title: 'Joined',
        key: 'createdAt',
        render(row) {
            return row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A';
        }
    },
    {
        title: 'Actions',
        key: 'actions',
        render(row) {
            return h(
                NButton,
                {
                    size: 'small',
                    quaternary: true,
                    circle: true,
                    type: 'error',
                    onClick: () => deleteUser(row)
                },
                { default: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
            );
        }
    }
];

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const q = searchQuery.value.toLowerCase();
    return users.value.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) || 
        u.email.toLowerCase().includes(q) ||
        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q))
    );
});

onMounted(fetchUsers);
</script>
