<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import { ref as vueref } from "vue";
import { auth, db } from "../../firebase";
import { useRouter } from "vue-router";
import UserPostsList from "../components/organisms/UserPostsList.vue";

const router = useRouter();

const currentUserData: any = vueref();
const currentUserId: any = vueref();
const isLoading: any = vueref(true);

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

</script>

<template>
  <div v-if="!isLoading">
    <div class="user_info">
      <div class="user_icon">
        <img v-bind:src="currentUserData.icon" alt="ユーザーアイコン" />
      </div>
      <div class="user_detail">
        <p>{{ currentUserData.userName }}</p>
        <button>プロフィール編集</button>
        <p>投稿{{ currentUserData.posts.length }}件</p>
        <p>フォロワー{{ currentUserData.follower.length }}人</p>
        <p>フォロー中{{ currentUserData.follow.length }}人</p>
        <p>{{ currentUserData.name }}</p>
        <p>{{ currentUserData.profile }}</p>
      </div>
    </div>
    <div class="posts">
      <UserPostsList v-bind:userId="currentUserId" />
    </div>
  </div>
  <p v-else>loading...</p>
</template>

<style scoped>
.user_info {
  width: 100%;
  display: flex;
}
.user_icon {
  border-radius: 50%;
  width: 10%;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
