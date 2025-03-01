// components/blog/BlogList.vue
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
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: 'Action',
        key: 'action',
    },
];

// Sample data - in real application, this would come from an API
const blogPosts = ref([
    {
        id: 1,
        title: 'Vue 3 Best Practices',
        category: 'Technology',
        author: 'John Doe',
        createdAt: '2024-02-23',
    },
    {
        id: 2,
        title: 'Getting Started with Ant Design Vue',
        category: 'Technology',
        author: 'Jane Smith',
        createdAt: '2024-02-22',
    },
]);

const editBlog = (record) => {
    console.log('Edit blog:', record);
    // Implement edit functionality
};

const deleteBlog = (record) => {
    console.log('Delete blog:', record);
    message.success('Blog post deleted successfully!');
    // Implement delete functionality
};
</script>