<template>
    <div>
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <a-card :bordered="false">
                <p class="text-lg font-semibold">Total Posts</p>
                <p class="text-2xl font-bold">{{ totalPosts }}</p>
            </a-card>
            <a-card :bordered="false">
                <p class="text-lg font-semibold">Published Posts</p>
                <p class="text-2xl font-bold">{{ publishedPosts }}</p>
            </a-card>
            <a-card :bordered="false">
                <p class="text-lg font-semibold">Draft Posts</p>
                <p class="text-2xl font-bold">{{ draftPosts }}</p>
            </a-card>
            <a-card :bordered="false">
                <p class="text-lg font-semibold">Total Views</p>
                <p class="text-2xl font-bold">{{ totalViews }}</p>
            </a-card>
        </div>

        <a-card>
            <div class="flex flex-wrap justify-between gap-6 mb-6">
                <h2 class="text-4xl font-bold text-black">Recent Posts</h2>
                <a-input v-model:value="searchQuery" placeholder="Search by Post Title" style="width: 300px"
                    @change="handleSearch" />
            </div>
            <!-- Recent Posts Table -->
            <a-table :columns="columns" :data-source="filteredPosts" :pagination="pagination" rowKey="id" bordered>
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

        <!-- Search Bar -->
        <!-- <div class="mb-4 flex justify-between items-center">
            <a-input v-model:value="searchQuery" placeholder="Search by Post Title" style="width: 300px"
                @change="handleSearch" />
        </div> -->


    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";

// Dashboard Statistics
const totalPosts = ref(45);
const publishedPosts = ref(30);
const draftPosts = ref(15);
const totalViews = ref(12000);

// Post Data
const posts = ref([
    { id: 1, title: "Vue 3 Best Practices", status: "Published", views: 350 },
    { id: 2, title: "Understanding Reactivity", status: "Draft", views: 120 },
    { id: 3, title: "Ant Design Vue Components", status: "Published", views: 500 },
    { id: 4, title: "Using Pinia for State Management", status: "Published", views: 290 },
    { id: 5, title: "SEO Optimization in Nuxt", status: "Draft", views: 180 },
]);

// Table Configuration
const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Views", dataIndex: "views", key: "views" },
    { title: "Action", dataIndex: "action", key: "action" },
];

const searchQuery = ref("");

// Filtered Data for Searching
const filteredPosts = computed(() =>
    posts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// Pagination Configuration
const pagination = ref({
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20"],
});

// Handle Search
const handleSearch = () => {
    // Since `filteredPosts` is reactive, it updates automatically
};
</script>

<style scoped>
.a-card {
    @apply shadow-lg p-4 rounded-lg border border-gray-200;
}
</style>