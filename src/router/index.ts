import DmPage from "../pages/dmPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../pages/login.vue";
import Register from "@/pages/register.vue";
import Post from "../pages/post.vue";
import Home from "../pages/home.vue";
import Header from "../components/organisms/header.vue";
import SearchPage from "../pages/searchPage.vue";
import LogoutBtn from "@/components/atoms/LogoutBtn.vue";
import newPost from "../pages/newPost.vue";
import postChange from "../pages/postChange.vue";
import ProfileChange from "../pages/profileChange.vue";
import PasswordChange from "../pages/passwordChange.vue";
import myAccountPage from "@/pages/myAccountPage.vue";
import accountPage from "../../src/pages/accountPage.vue";
import followList from "@/pages/followList.vue";
import followerList from "@/pages/followerList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/dmPage/:userId",
      name: "dmPage",
      component: DmPage,
      // props: true
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/post/:postId",
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
      path: "/newPost",
      name: "newPost",
      component: newPost,
    },
    {
      path: "/postChange/:postId",
      name: "postChange",
      component: postChange,
    },
    {
      path: "/myAccountPage",
      name: "myAccountPage",
      component: myAccountPage,
    },
    {
      path: "/accountPage/:userId",
      name: "accountPage",
      component: accountPage,
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutBtn,
    },
    {
      path: "/searchPage",
      name: "searchPage",
      component: SearchPage,
    },
    {
      path: "/profileChange",
      name: "profileChange",
      component: ProfileChange,
    },
    {
      path: "/passwordChange",
      name: "passwordChange",
      component: PasswordChange,
    },
    {
      path: "/followList/:userId",
      name: "followList",
      component: followList,
    },
    {
      path: "/followerList/:userId",
      name: "followerList",
      component: followerList,
    },
  ],
});

export default router;
