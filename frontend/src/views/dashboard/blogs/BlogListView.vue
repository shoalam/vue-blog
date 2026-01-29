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
      :data="blogPosts"
      :pagination="pagination"
      :bordered="false"
      :single-line="false"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      scroll-x="1000"
    />
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted, h, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { NButton, NSpace, NIcon, NTag, useMessage, NPopconfirm } from 'naive-ui';
import {
    SearchOutline,
    CreateOutline,
    TrashOutline,
    CheckmarkCircleOutline,
    DocumentTextOutline,
} from '@vicons/ionicons5';

const { getAuthHeader } = useAuth();
const message = useMessage();

const blogPosts = ref([]);
const searchQuery = ref("");
const loading = ref(false);

const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    onChange: (page) => {
        pagination.page = page;
        fetchPosts();
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
        fetchPosts();
    }
});

const fetchPosts = async () => {
    loading.value = true;
    try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/v1/posts`);
        url.searchParams.append("page", pagination.page);
        url.searchParams.append("limit", pagination.pageSize);
        if (searchQuery.value) {
            url.searchParams.append("search", searchQuery.value);
        }

        const response = await fetch(url.toString(), {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();
        // Backend returns { posts, total, page, limit, totalPages }
        blogPosts.value = data.posts || [];
        pagination.itemCount = data.total || 0;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        message.error("Failed to load blog posts. Please try again.");
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    pagination.page = 1;
    fetchPosts();
};

const handlePageChange = (page) => {
    pagination.page = page;
    fetchPosts();
};

const handlePageSizeChange = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    fetchPosts();
};

const deleteBlog = async (record) => {
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
        fetchPosts();
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
        title: 'Image',
        key: 'image',
        render(row) {
            if (!row.image) return 'No Image';
            const imageUrl = row.image.startsWith('http') 
                ? row.image 
                : `${import.meta.env.VITE_API_URL}/${row.image}`;
            return h('img', {
                src: imageUrl,
                style: 'width: 40px; height: 40px; object-fit: cover; border-radius: 4px;'
            });
        }
    },
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
        key: 'category',
        render(row) {
            return row.category?.name || 'Uncategorized';
        }
    },
    {
        title: 'Content Snippet',
        key: 'description',
        width: 300,
        render(row) {
            const text = row.description || '';
            return text.length > 80 ? text.substring(0, 80) + '...' : text;
        }
    },
    {
        title: 'Created At',
        key: 'createdAt',
        render(row) {
            return formatDate(row.createdAt);
        }
    },
    {
        title: 'Status',
        key: 'status',
        render(row) {
            const isPublished = row.status === 'published';
            return h(
                NTag,
                {
                    type: isPublished ? 'success' : 'warning',
                    round: true,
                    bordered: false,
                    size: 'small',
                    class: 'px-3 font-bold'
                },
                { 
                    default: () => h('div', { class: 'flex items-center gap-1' }, [
                        h(NIcon, { size: '14' }, { default: () => h(isPublished ? CheckmarkCircleOutline : DocumentTextOutline) }),
                        isPublished ? 'Published' : 'Draft'
                    ])
                }
            );
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
                        },
                        { 
                            default: () => h(RouterLink, { to: `/dashboard/blogs/edit/${row._id || row.id}` }, {
                                default: () => h(NIcon, null, { default: () => h(CreateOutline) })
                            })
                        }
                    ),
                    h(
                        NPopconfirm,
                        {
                            onPositiveClick: () => deleteBlog(row),
                            positiveText: 'Delete',
                            negativeText: 'Cancel'
                        },
                        {
                            trigger: () => h(
                                NButton,
                                {
                                    size: 'small',
                                    quaternary: true,
                                    circle: true,
                                    type: 'error',
                                },
                                { default: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
                            ),
                            default: () => `Are you sure you want to delete "${row.title}"?`
                        }
                    )
                ]
            });
        }
    }
];

onMounted(fetchPosts);
</script>
