// components/blog/BlogList.vue
<template>
    <div>
        <h2>Blog Posts</h2>
        <a-table :columns="columns" :data-source="blogPosts" :row-key="record => record.id">
            <template #headerCell="{ column }">
                <template v-if="column.key === 'action'">
                    <span>Action</span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button type="primary" size="small" @click="editBlog(record)">
                            Edit
                        </a-button>
                        <a-button type="danger" size="small" @click="deleteBlog(record)">
                            Delete
                        </a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
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