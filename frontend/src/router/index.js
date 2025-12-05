import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public Routes
    {
      path: "/",
      component: () => import("@/components/layouts/MainLayout.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
        },
        {
          path: "/blog",
          name: "blog",
          component: () => import("../views/BlogView.vue"),
        },
        {
          path: "/blog/:id",
          name: "BlogDetails",
          component: () => import("../views/BlogDetails.vue"),
        },

        {
          path: "/contact",
          name: "contact",
          component: () => import("../views/ContactUsView.vue"),
        },
      ],
    },

    // Auth Routes
    {
      path: "/auth",
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("../views/auth/Login.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("../views/auth/Register.vue"),
        },
      ],
    },

    // Dashboard Routes (Protected)
    {
      path: "/dashboard",
      component: () => import("@/components/layouts/DashboardLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/dashboard/DashboardView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/dashboard/ProfileView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "blogs",
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "dashboard-blogs",
              component: () =>
                import("../views/dashboard/blogs/BlogListView.vue"),
              meta: { requiresAuth: true },
            },
            {
              path: "create",
              name: "create-blog",
              component: () =>
                import("../views/dashboard/blogs/BlogCreateView.vue"),
              meta: { requiresAuth: true },
            },
            {
              path: "edit/:id",
              name: "edit-blog",
              component: () =>
                import("../views/dashboard/blogs/BlogEditView.vue"),
              meta: { requiresAuth: true },
            },
          ],
        },
      ],
    },

    // 404 Route
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      redirect: "/",
    },
  ],
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if user is authenticated
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login with return URL
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  next();
});

export default router;

