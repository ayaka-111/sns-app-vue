<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import { onMounted, ref as vueref } from "vue";
import { auth, db } from "../../firebase";
import { useRoute, useRouter } from "vue-router";
import UserPostsList from "../components/organisms/UserPostsList.vue";
import Header from "../components/organisms/header.vue";
import KeepList from "../components/organisms/keepsList.vue";
import type { Ref } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type { User } from "../../types/types";
import type { DocumentData, DocumentReference } from "@firebase/firestore";
import UserIcon from "@/components/icons/UserIcon.vue";
import { watch } from "vue";

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const paramsPage: any = route.params.page;
const currentUserData: Ref<User | undefined | unknown> = vueref();
const currentUserId: Ref<string> = vueref("");
const isLoading: Ref<boolean> = vueref(true);
const displaySwitch: Ref<any> = vueref(true);
const iconStyle: Ref<string> = vueref("150px");
const params: Ref<any> = vueref(paramsPage);

console.log(params.value);
onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      const userDocRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        currentUser.uid
      );
      //上記を元にドキュメントのデータを取得
      getDoc(userDocRef).then((userDocData) => {
        currentUserData.value = userDocData.data();
      });
    }
  });
});
if (params.value === "saved") {
  displaySwitch.value = false;
}
watch(displaySwitch, () => {
  if (params.value === "saved") {
    params.value = "post";
  } else {
    params.value = "saved";
  }
});
const toProfileEdit: () => void = () => {
  router.push("/profileChange");
};
const onClickPost: () => void = () => {
  displaySwitch.value = true;
};
const onClickSaved: () => void = () => {
  displaySwitch.value = false;
};
</script>

<template>
  <Header
    @displaySwitchFalse="(ReceivedValue) => (displaySwitch = ReceivedValue)"
  />
  <div class="header_area">
    <div v-if="!isLoading" class="myPage_wrapper">
      <div class="user_info flex">
        <div class="user_info_left">
          <UserIcon
            v-bind:userId="currentUserId"
            v-bind:iconStyle="iconStyle"
          />
        </div>
        <div class="user_info_right">
          <div>
            <div class="flex first_line">
              <p class="user_name">{{ currentUserData.userName }}</p>
              <button @click="toProfileEdit" class="profile_edit_btn">
                プロフィール編集
              </button>
            </div>
            <div class="flex">
              <p class="three_amount">
                投稿<span class="amount">{{
                  currentUserData.posts.length
                }}</span
                >件
              </p>
              <a v-bind:href="`/followerList/${currentUserId}`">
                <p class="three_amount">
                  フォロワー<span class="amount">{{
                    currentUserData.follower.length
                  }}</span
                  >人
                </p>
              </a>
              <a v-bind:href="`/followList/${currentUserId}`">
                <p class="three_amount">
                  フォロー中<span class="amount">{{
                    currentUserData.follow.length
                  }}</span
                  >人
                </p>
              </a>
            </div>
            <p class="userName">{{ currentUserData.name }}</p>
            <p>{{ currentUserData.profile }}</p>
          </div>
        </div>
      </div>
      <div v-if="displaySwitch" class="displayLavel">
        <div class="effective flex">
          <p>
            <font-awesome-icon
              :icon="['fas', 'table-cells']"
              class="icon"
            />投稿
          </p>
        </div>
        <router-link to="/myAccountPage/saved">
          <div @click="onClickSaved" class="noEffect">
            <p>
              <font-awesome-icon
                :icon="['far', 'bookmark']"
                class="icon"
              />保存済み
            </p>
          </div>
        </router-link>
      </div>
      <div v-else class="displayLavel">
        <router-link to="/myAccountPage/post">
          <div @click="onClickPost" class="noEffect flex">
            <p>
              <font-awesome-icon
                :icon="['fas', 'table-cells']"
                class="icon"
              />投稿
            </p>
          </div>
        </router-link>
        <div class="effective">
          <p>
            <font-awesome-icon
              :icon="['far', 'bookmark']"
              class="icon"
            />保存済み
          </p>
        </div>
      </div>
      <div class="posts" v-if="displaySwitch">
        <div class="posts">
          <UserPostsList v-bind:userId="currentUserId" />
        </div>
      </div>
      <div class="keeps" v-else>
        <KeepList v-bind:userId="currentUserId" />
      </div>
    </div>
    <p v-else class="loading_text">loading...</p>
  </div>
</template>

<style scoped>
.header_area {
  margin-left: 250px;
}
.myPage_wrapper {
  width: 80%;
  margin: 0 auto;
  padding: 50px;
}
.user_info {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 30px;
}
.user_info_left {
  width: 30%;
}
.user_icon {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
  margin: auto;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user_info_right {
  width: 70%;
}
.flex {
  display: flex;
}
.first_line {
  margin-bottom: 20px;
}
.user_name {
  font-size: 17px;
  font-weight: bold;
}
.profile_edit_btn {
  background: #efefef;
  border-radius: 7px;
  font-weight: bold;
  padding: 2px 15px;
  margin-left: 30px;
}
.profile_edit_btn:hover {
  cursor: pointer;
}
.three_amount {
  margin-right: 20px;
  font-size: 15px;
}
.amount {
  font-weight: bold;
}
.userName {
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
}
.displayLavel {
  display: flex;
  line-height: 50px;
  border-top: 1px solid #dbdbdb;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
.effective,
.noEffect {
  margin-bottom: 10px;
  width: 150px;
}
.icon {
  padding-right: 7px;
}
.effective > p {
  margin: auto;
  width: 80px;
  border-top: 1px solid #262626;
  text-align: center;
}
.noEffect > p {
  opacity: 0.6;
  margin: auto;
  width: 80px;
  text-align: center;
}
.noEffect > p:hover {
  cursor: pointer;
}
.loading_text {
  text-align: center;
  margin-top: 200px;
  font-size: 16px;
  font-weight: bold;
}
</style>
