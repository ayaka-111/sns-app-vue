
import DmPage from "../pages/dmPage.vue"
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../pages/login.vue";
import Post from "../pages/post.vue";
import Home from "../pages/home.vue";
import Header from "../components/organisms/header.vue";
import SearchPage from "../pages/searchPage.vue"

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
      path: "/header",
      name: "header",
      component: Header,
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
      path: '/searchPage',
      name: 'searchPage',
      component: SearchPage
    },
  ],
});

export default router;
