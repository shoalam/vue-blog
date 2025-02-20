import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
    {
      path: "/",
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

    // Dashboard Routes
    {
      path: "/dashboard",
      component: () => import("../components/layouts/DashboardLayout.vue"),
      // meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/dashboard/DashboardView.vue"),
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/dashboard/ProfileView.vue"),
        },
        {
          path: "blogs",
          children: [
            {
              path: "",
              name: "dashboard-blogs",
              component: () =>
                import("../views/dashboard/blogs/BlogListView.vue"),
            },
            {
              path: "create",
              name: "create-blog",
              component: () =>
                import("../views/dashboard/blogs/BlogCreateView.vue"),
            },
            {
              path: "edit/:id",
              name: "edit-blog",
              component: () =>
                import("../views/dashboard/blogs/BlogEditView.vue"),
            },
          ],
        },
        // Admin Routes
        // {
        //   path: "admin",
        //   meta: { requiresAdmin: true },
        //   children: [
        //     {
        //       path: "users",
        //       name: "user-management",
        //       component: () =>
        //         import("../views/dashboard/admin/UserManagement.vue"),
        //     },
        //     {
        //       path: "categories",
        //       name: "category-management",
        //       component: () =>
        //         import("../views/dashboard/admin/CategoryManagement.vue"),
        //     },
        //     {
        //       path: "settings",
        //       name: "site-settings",
        //       component: () =>
        //         import("../views/dashboard/admin/SiteSettings.vue"),
        //     },
        //   ],
        // },
      ],
    },

    // 404 Route
    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "not-found",
    //   component: () => import("../views/NotFound.vue"),
    // },
  ],
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = false; // Replace with your auth logic
  const isAdmin = false; // Replace with your admin check logic

  // Handle auth required routes
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // Handle admin required routes
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (!isAdmin) {
      next({ name: "dashboard" });
      return;
    }
  }

  next();
});

export default router;
