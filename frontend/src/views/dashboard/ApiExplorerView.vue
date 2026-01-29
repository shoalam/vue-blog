<template>
  <div class="api-explorer container mx-auto p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">API Explorer</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">View detailed documentation and test live API endpoints.</p>
      </div>
      <n-tag :bordered="false" type="info" size="large">
        Base URL: {{ baseUrl }}
      </n-tag>
    </div>

    <n-collapse arrow-placement="right" class="space-y-4 font-sans">
      <template v-for="(category, catIndex) in apiCategories" :key="catIndex">
        <n-collapse-item :title="category.name" :name="category.name">
          <template #header-extra>
            <n-tag :bordered="false" size="small" type="primary" round>{{ category.endpoints.length }} Endpoints</n-tag>
          </template>
          
          <div class="space-y-6 mt-4 pb-4">
            <n-card v-for="(endpoint, endIndex) in category.endpoints" :key="endIndex" :bordered="true" class="endpoint-card shadow-sm hover:shadow-md transition-shadow">
              <template #header>
                <div class="flex items-center gap-3">
                  <n-tag :type="getMethodType(endpoint.method)" size="small" class="font-bold w-20 justify-center">
                    {{ endpoint.method }}
                  </n-tag>
                  <code class="text-indigo-600 dark:text-indigo-400 font-mono text-lg font-semibold">{{ endpoint.path }}</code>
                </div>
              </template>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Documentation Section -->
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                    <p class="text-gray-700 dark:text-gray-300">{{ endpoint.description }}</p>
                  </div>

                  <div v-if="endpoint.auth && endpoint.auth !== '🔓'">
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Authentication</h3>
                    <n-tag :bordered="false" :type="endpoint.auth === '👑' ? 'error' : 'warning'" size="small">
                      {{ endpoint.auth === '👑' ? 'Admin Only' : 'Authenticated User' }}
                    </n-tag>
                  </div>

                  <div v-if="endpoint.requestBody">
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Request Body (Schema)</h3>
                    <pre class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-gray-100 dark:border-gray-800 whitespace-pre-wrap">{{ JSON.stringify(endpoint.requestBody, null, 2) }}</pre>
                  </div>
                </div>

                <!-- Testing Section -->
                <div class="flex flex-col">
                  <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Live Test</h3>
                  <div class="flex-1 space-y-4">
                    <div v-if="endpoint.method !== 'GET' && endpoint.method !== 'DELETE'" class="flex-1">
                       <n-input
                        v-model:value="endpoint.testBody"
                        type="textarea"
                        placeholder='{"key": "value"}'
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        class="font-mono text-xs rounded-xl"
                      />
                    </div>
                    
                    <n-button 
                      type="primary" 
                      @click="testEndpoint(endpoint)" 
                      :loading="endpoint.loading"
                      class="shadow-indigo-500/20 shadow-lg px-8 rounded-lg"
                      size="medium"
                    >
                      Send Request
                    </n-button>
                    
                    <div v-if="endpoint.response" class="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div class="flex items-center justify-between mb-2">
                         <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Response</h3>
                         <n-tag :type="endpoint.responseStatus < 400 ? 'success' : 'error'" size="small" :bordered="false">
                           Status: {{ endpoint.responseStatus }}
                         </n-tag>
                      </div>
                      <n-scrollbar x-scrollable style="max-height: 300px">
                        <pre class="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto shadow-inner border border-gray-800">{{ JSON.stringify(endpoint.response, null, 2) }}</pre>
                      </n-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </n-card>
          </div>
        </n-collapse-item>
      </template>
    </n-collapse>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useMessage } from 'naive-ui';

const message = useMessage();
const baseUrl = '/api/v1'; // Using relative path for the frontend proxy/integration

const getMethodType = (method) => {
  switch (method) {
    case 'GET': return 'success';
    case 'POST': return 'info';
    case 'PUT': return 'warning';
    case 'DELETE': return 'error';
    default: return 'default';
  }
};

const apiCategories = reactive([
  {
    name: 'Authentication',
    endpoints: [
      {
        path: '/auth/register',
        method: 'POST',
        description: 'Register a new author account.',
        auth: '🔓',
        requestBody: { firstName: 'string', lastName: 'string', email: 'string', password: 'string (min 6)', username: 'string (optional)' },
        testBody: JSON.stringify({ firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password123', username: 'testuser' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/auth/login',
        method: 'POST',
        description: 'Authenticate and receive a JWT token.',
        auth: '🔓',
        requestBody: { email: 'string', password: 'string' },
        testBody: JSON.stringify({ email: 'admin@example.com', password: 'password' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/auth/logout',
        method: 'POST',
        description: 'Clear the authentication cookie.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      }
    ]
  },
  {
    name: 'Posts',
    endpoints: [
      {
        path: '/posts',
        method: 'GET',
        description: 'List all posts with support for search, pagination, and category filters.',
        auth: '🔓',
        testBody: '',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/posts',
        method: 'POST',
        description: 'Create a new post. Automatically assigns author from token.',
        auth: '🔐',
        requestBody: { title: 'string', description: 'string', content: 'string', category: 'ID', tags: 'array or csv', status: 'draft | published' },
        testBody: JSON.stringify({ title: 'New Post', description: 'Summary', content: 'Content', category: 'CATEGORY_ID_HERE' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/posts/:id',
        method: 'GET',
        description: 'Get a single post details and increment views.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/posts/:id',
        method: 'PUT',
        description: 'Update a post (Owner or Admin only).',
        auth: '🔐',
        requestBody: { title: 'string', description: 'string', content: 'string', category: 'ID' },
        testBody: JSON.stringify({ title: 'Updated Title' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/posts/:id',
        method: 'DELETE',
        description: 'Delete a post (Owner or Admin only).',
        auth: '🔐',
        loading: false, response: null, responseStatus: null
      }
    ]
  },
  {
    name: 'Categories',
    endpoints: [
      {
        path: '/categories',
        method: 'GET',
        description: 'List all available categories.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/categories',
        method: 'POST',
        description: 'Create a new category (Admin only recommended).',
        auth: '🔐',
        requestBody: { name: 'string', description: 'string' },
        testBody: JSON.stringify({ name: 'Web Dev', description: 'Articles about coding' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/categories/:id',
        method: 'GET',
        description: 'Get category details by ID or Slug.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/categories/:id',
        method: 'PUT',
        description: 'Update a category.',
        auth: '🔐',
        requestBody: { name: 'string', description: 'string' },
        testBody: JSON.stringify({ name: 'Mobile Dev' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/categories/:id',
        method: 'DELETE',
        description: 'Delete a category.',
        auth: '🔐',
        loading: false, response: null, responseStatus: null
      }
    ]
  },
  {
    name: 'Comments',
    endpoints: [
      {
        path: '/comments/post/:postId',
        method: 'GET',
        description: 'Get all comments for a specific post.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/comments/post/:postId',
        method: 'POST',
        description: 'Post a new comment.',
        auth: '🔐',
        requestBody: { content: 'string', parentComment: 'ID (optional)' },
        testBody: JSON.stringify({ content: 'I really enjoyed this!' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/comments/:id',
        method: 'PUT',
        description: 'Edit a comment (Owner only).',
        auth: '🔐',
        requestBody: { content: 'string' },
        testBody: JSON.stringify({ content: 'Updated comment text' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/comments/:id',
        method: 'DELETE',
        description: 'Delete a comment (Owner only).',
        auth: '🔐',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/comments/:id/like',
        method: 'POST',
        description: 'Like or unlike a comment.',
        auth: '🔐',
        loading: false, response: null, responseStatus: null
      }
    ]
  },
  {
    name: 'Users',
    endpoints: [
      {
        path: '/users',
        method: 'GET',
        description: 'List all users (Admin only).',
        auth: '👑',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users',
        method: 'POST',
        description: 'Create a new user manually (Admin only).',
        auth: '👑',
        requestBody: { firstName: 'string', lastName: 'string', email: 'string', password: 'string', role: 'author | admin' },
        testBody: JSON.stringify({ firstName: 'Admin', lastName: 'User', email: 'admin2@test.com', password: 'password', role: 'admin' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users/:id',
        method: 'GET',
        description: 'Get user profile details.',
        auth: '🔓',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users/:id',
        method: 'PUT',
        description: 'Update user role or profile (Admin only).',
        auth: '👑',
        requestBody: { firstName: 'string', lastName: 'string', role: 'author | admin' },
        testBody: JSON.stringify({ role: 'admin' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users/:id',
        method: 'DELETE',
        description: 'Delete a user account (Admin only).',
        auth: '👑',
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users/profile/:id',
        method: 'PUT',
        description: 'Update own profile information.',
        auth: '🔐',
        requestBody: { firstName: 'string', lastName: 'string', bio: 'string', avatar: 'url' },
        testBody: JSON.stringify({ bio: 'I am a tech enthusiast.' }, null, 2),
        loading: false, response: null, responseStatus: null
      },
      {
        path: '/users/change-password/:id',
        method: 'POST',
        description: 'Change account password.',
        auth: '🔐',
        requestBody: { currentPassword: 'string', newPassword: 'string' },
        testBody: JSON.stringify({ currentPassword: 'password', newPassword: 'newpassword123' }, null, 2),
        loading: false, response: null, responseStatus: null
      }
    ]
  }
]);

const testEndpoint = async (endpoint) => {
  endpoint.loading = true;
  endpoint.response = null;
  
  try {
    const token = localStorage.getItem('token');
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };

    if (endpoint.method !== 'GET' && endpoint.method !== 'DELETE' && endpoint.testBody) {
      options.body = endpoint.testBody;
    }

    // In a real app, this would be a full URL if not proxied
    const fullUrl = `http://localhost:8080${baseUrl}${endpoint.path}`;
    
    const res = await fetch(fullUrl, options);
    endpoint.responseStatus = res.status;
    const data = await res.json();
    endpoint.response = data;
    
    if (res.ok) {
      message.success('Request successful');
    } else {
      message.error(data.message || 'Request failed');
    }
  } catch (error) {
    endpoint.responseStatus = 500;
    endpoint.response = { error: error.message };
    message.error('Connection error: Make sure the backend is running at :3001');
  } finally {
    endpoint.loading = false;
  }
};
</script>

<style scoped>
.endpoint-card {
  --n-border-radius: 16px;
}
:deep(.n-collapse-item) {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 0 16px;
  background: white;
  margin-bottom: 12px;
}
.dark :deep(.n-collapse-item) {
  background: #18181c;
  border-color: rgba(255, 255, 255, 0.05);
}
</style>
