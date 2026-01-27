<template>
  <n-card bordered>
    <template #header-extra>
      <n-input
        v-model:value="searchQuery"
        placeholder="Search by Post Title..."
        clearable
        @input="handleSearch"
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
      :data="paginatedPosts"
      :pagination="pagination"
      :bordered="false"
      :single-line="false"
      @update:page="handlePageChange"
    />
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { NButton, NSpace, NIcon, NTag, useMessage } from 'naive-ui';
import {
    SearchOutline,
    CreateOutline,
    TrashOutline,
} from '@vicons/ionicons5';

const { getAuthHeader } = useAuth();
const message = useMessage();

const blogPosts = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const pagination = ref({
    page: 1,
    pageSize: 5,
    showSizePicker: true,
    pageSizes: [5, 10, 20, 50],
    onChange: (page) => {
        pagination.value.page = page;
    },
    onUpdatePageSize: (pageSize) => {
        pagination.value.pageSize = pageSize;
        pagination.value.page = 1;
    }
});

const fetchPosts = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts`, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        blogPosts.value = data;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        message.error("Failed to load blog posts. Please try again.");
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    pagination.value.page = 1;
};

const deleteBlog = async (record) => {
    if (!confirm(`Are you sure you want to delete "${record.title}"?`)) {
        return;
    }

    try {
        const blogId = record._id || record.id;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${blogId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error("Failed to delete blog post");
        }

        message.success('Blog post deleted successfully!');
        await fetchPosts();
    } catch (error) {
        console.error("Error deleting blog post:", error);
        message.error("Failed to delete blog post. Please try again.");
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

const columns = [
    {
        title: 'Title',
        key: 'title',
        render(row) {
            const blogId = row._id || row.id;
            return h(
                RouterLink,
                { to: `/blog/${blogId}`, class: 'text-indigo-600 hover:text-indigo-800' },
                { default: () => row.title }
            );
        }
    },
    {
        title: 'Category',
        key: 'category'
    },
    {
        title: 'Author',
        key: 'author'
    },
    {
        title: 'Created At',
        key: 'createdAt',
        render(row) {
            return formatDate(row.createdAt);
        }
    },
    {
        title: 'Actions',
        key: 'actions',
        render(row) {
            return h(NSpace, null, {
                default: () => [
                    h(
                        NButton,
                        {
                            size: 'small',
                            quaternary: true,
                            circle: true,
                            onClick: () => {} // Edit Navigation handled by router
                        },
                        { 
                            default: () => h(RouterLink, { to: `/dashboard/blogs/edit/${row._id || row.id}` }, {
                                default: () => h(NIcon, null, { default: () => h(CreateOutline) })
                            })
                        }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            quaternary: true,
                            circle: true,
                            type: 'error',
                            onClick: () => deleteBlog(row)
                        },
                        { default: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
                    )
                ]
            });
        }
    }
];

const filteredPosts = computed(() => {
    if (!searchQuery.value) return blogPosts.value;
    return blogPosts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedPosts = computed(() => filteredPosts.value);

onMounted(fetchPosts);
</script>
