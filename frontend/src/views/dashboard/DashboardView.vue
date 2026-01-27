<template>
  <div class="space-y-6">
    <!-- Statistics Cards -->
    <n-grid cols="1 s:2 m:4" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-card bordered size="small">
          <n-statistic label="Total Posts" :value="totalPosts">
            <template #prefix>
              <n-icon>
                <BookOutline />
              </n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card bordered size="small">
          <n-statistic label="Published" :value="publishedPosts">
            <template #prefix>
              <n-icon color="#18a058">
                <CheckmarkCircleOutline />
              </n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card bordered size="small">
          <n-statistic label="Drafts" :value="draftPosts">
            <template #prefix>
              <n-icon color="#f0a020">
                <DocumentTextOutline />
              </n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card bordered size="small">
          <n-statistic label="Total Views" :value="totalViews">
            <template #prefix>
              <n-icon color="#2080f0">
                <EyeOutline />
              </n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Recent Posts Section -->
    <n-card title="Recent Posts" bordered>
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
        :columns="columns"
        :data="paginatedPosts"
        :pagination="pagination"
        :bordered="false"
        :single-line="false"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, h } from "vue";
import { RouterLink } from "vue-router";
import { NTag, NButton, NSpace, NIcon } from "naive-ui";
import {
  BookOutline,
  CheckmarkCircleOutline,
  DocumentTextOutline,
  EyeOutline,
  SearchOutline,
  CreateOutline,
  TrashOutline
} from "@vicons/ionicons5";

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
    { id: 6, title: "Building Scalable Vue Apps", status: "Published", views: 420 },
    { id: 7, title: "Vue Router Deep Dive", status: "Published", views: 310 },
    { id: 8, title: "Composition API Guide", status: "Draft", views: 95 },
]);

const searchQuery = ref("");
const pagination = ref({
  pageSize: 5
});

// Table Columns
const columns = [
  {
    title: "Title",
    key: "title",
    render(row) {
      const blogId = row._id || row.id;
      return h(
        RouterLink,
        { to: `/blog/${blogId}`, class: "text-indigo-600 hover:text-indigo-800" },
        { default: () => row.title }
      );
    }
  },
  {
    title: "Status",
    key: "status",
    render(row) {
      return h(
        NTag,
        {
          type: row.status === "Published" ? "success" : "warning",
          round: true,
          size: "small"
        },
        { default: () => row.status }
      );
    }
  },
  {
    title: "Views",
    key: "views"
  },
  {
    title: "Actions",
    key: "actions",
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: "small",
              quaternary: true,
              circle: true,
              onClick: () => {} // Edit logic here or use RouterLink
            },
            { default: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
          ),
          h(
            NButton,
            {
              size: "small",
              quaternary: true,
              circle: true,
              type: "error",
              onClick: () => deletePost(row._id || row.id)
            },
            { default: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
          )
        ]
      });
    }
  }
];

// Content of Filtered Data for Searching
const filteredPosts = computed(() =>
    posts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const paginatedPosts = computed(() => filteredPosts.value);

// Handle Search
const handleSearch = () => {
    // Naive UI data table handles internal searching if we provide search function
    // but here we are using computed for simplicity and consistency with old code
};

// Delete Post
const deletePost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
        const index = posts.value.findIndex(post => post.id === id);
        if (index !== -1) {
            posts.value.splice(index, 1);
            totalPosts.value--;
        }
    }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>