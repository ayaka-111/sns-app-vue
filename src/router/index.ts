
import DmPage from "../pages/DmPage.vue";
import Test from "../pages/test.vue"
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../pages/login.vue";
import Post from "../pages/post.vue";
import Home from "../pages/home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dmPage',
      name: 'dmPage',
      component: DmPage
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: "/",
      name: "home",
      component: HomeView,

    },
    {
      path: "/post",
      name: "post",
      component: Post,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
