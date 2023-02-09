import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../pages/login.vue";
import Register from "@/pages/register.vue";
import Post from "../pages/post.vue";
import Home from "../pages/home.vue";
import LogoutBtn from "@/components/atoms/LogoutBtn.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
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
      path: "/logout",
      name: "logout",
      component: LogoutBtn,
    },
  ],
});

export default router;
