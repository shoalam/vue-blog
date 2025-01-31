import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      path: "/auth/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },
    {
      path: "/auth/register",
      name: "BlogDetails",
      component: () => import("../views/auth/Register.vue"),
    },
  ],
});

export default router;
