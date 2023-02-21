<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import { onMounted, ref as vueref } from "vue";
import { auth, db } from "../../firebase";
import { useRouter } from "vue-router";
import UserPostsList from "../components/organisms/UserPostsList.vue";
import Header from "../components/organisms/header.vue";
import KeepList from "../components/organisms/keepsList.vue";

const router = useRouter();

const currentUserData: any = vueref();
const currentUserId: any = vueref();
const isLoading: any = vueref(true);
const displaySwitch: any = vueref(true);

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      //ドキュメントへの参照を取得
      const userDocRef: any = doc(db, "users", currentUser.uid);

      //上記を元にドキュメントのデータを取得
      getDoc(userDocRef).then((userDocData) => {
        //取得したデータから必要なものを取り出す
        const userDataId: any = userDocData.data();
        currentUserData.value = userDataId;
      });
    }
  });
});
const toProfileEdit = () => {
  router.push("/profileChange");
};
const onClickChangeSwitch = () => {
  displaySwitch.value = !displaySwitch.value;
};
console.log(displaySwitch.value);
</script>

<template>
  <Header />
  <div class="header_area">
    <div v-if="!isLoading" class="myPage_wrapper">
      <div class="user_info flex">
        <div class="user_info_left">
          <div class="user_icon">
            <img v-bind:src="currentUserData.icon" alt="ユーザーアイコン" />
          </div>
        </div>
        <div class="user_info_right">
          <div class="user_detail">
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
            <p class="name">{{ currentUserData.name }}</p>
            <p>{{ currentUserData.profile }}</p>
          </div>
        </div>
      </div>
      <div v-if="displaySwitch" class="displayLavel">
        <div class="effective">
          <p>投稿</p>
        </div>
        <div @click="onClickChangeSwitch" class="noEffect">
          <p>保存済み</p>
        </div>
      </div>

      <div v-else class="displayLavel">
        <div @click="onClickChangeSwitch" class="noEffect">
          <p>投稿</p>
        </div>
        <div class="effective">
          <p>保存済み</p>
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
.user_info_left {
  width: 30%;
}
.user_info_right {
  width: 70%;
}
.user_info {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 30px;
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
.flex {
  display: flex;
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
.first_line {
  margin-bottom: 20px;
}
.three_amount {
  margin-right: 20px;
  font-size: 15px;
}
.amount {
  font-weight: bold;
}
.name {
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
}
.loading_text {
  text-align: center;
  margin-top: 200px;
  font-size: 16px;
  font-weight: bold;
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
</style>
