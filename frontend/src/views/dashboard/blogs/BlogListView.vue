<!-- eslint-disable vue -->
<template>
    <div>
        <a-card>
            <div class="flex flex-wrap justify-between gap-6 mb-6">
                <h2 class="text-4xl font-bold text-black">All Blog Posts</h2>
                <a-input v-model:value="searchQuery" placeholder="Search by Post Title" style="width: 300px"
                    @change="handleSearch" />
            </div>
            <!-- Recent Posts Table -->
            <a-table :columns="columns" :data-source="blogPosts" :pagination="pagination" rowKey="id" bordered>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'title'">
                        <RouterLink :to="`/post/${record.id}`" class="text-blue-500">
                            {{ record.title }}
                        </RouterLink>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :color="record.status === 'Published' ? 'green' : 'orange'">
                            {{ record.status }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'views'">
                        {{ record.views }}
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const blogPosts = ref([]);
const searchQuery = ref("");
const pagination = { pageSize: 5 };

const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Action', key: 'action' },
];

const fetchPosts = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/posts');
        if (!response.ok) {
            throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        blogPosts.value = data;
    } catch (error) {
        message.error("Failed to load blog posts");
        console.error("Error fetching blog posts:", error);
    }
};

const handleSearch = () => {
    fetchPosts();
    if (searchQuery.value) {
        blogPosts.value = blogPosts.value.filter(post =>
            post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
};

const editBlog = (record) => {
    console.log('Edit blog:', record);
    // Implement edit functionality
};

const deleteBlog = (record) => {
    console.log('Delete blog:', record);
    message.success('Blog post deleted successfully!');
    // Implement delete functionality
};

onMounted(fetchPosts);
</script>
