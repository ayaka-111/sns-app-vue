<script setup lang="ts">
import { auth, db } from "../../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref as vueref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onAuthStateChanged } from "@firebase/auth";

//postIdを受け取る
const route = useRoute();
const userId: any = route.params.userId;

const router = useRouter();


const anotherUserData: any = vueref();
const currentUserId: any = vueref();
const isLoading: any = vueref(true);

onAuthStateChanged(auth, async (currentUser) => {
  if (!currentUser) {
    router.push("/login");
  } else {
    currentUserId.value = currentUser.uid;
    isLoading.value = false;
    //ドキュメントへの参照を取得
    const userDocRef: any = doc(db, "users", userId);

    //上記を元にドキュメントのデータを取得
    getDoc(userDocRef).then((userDocData) => {
      //取得したデータから必要なものを取り出す
      const userData: any = userDocData.data();
      anotherUserData.value = userData;
    });
  }
});
</script>

<template>
  <div v-if="!isLoading">
    <div class="user_info">
      <div class="user_icon">
        <img v-bind:src="anotherUserData.icon" alt="ユーザーアイコン" />
      </div>
      <div class="user_detail">
        <p>{{ anotherUserData.userName }}</p>
        <button>フォロー中</button>
        <!-- <button>フォローする</button> -->
        <button>メッセージを送信</button>
        <p>投稿{{ anotherUserData.posts.length }}件</p>
        <p>フォロワー{{ anotherUserData.follower.length }}人</p>
        <p>フォロー中{{ anotherUserData.follow.length }}人</p>
        <p>{{ anotherUserData.name }}</p>
        <p>{{ anotherUserData.profile }}</p>
      </div>
    </div>
    <div class="posts">
      <CurrentUserPosts v-bind:userId="currentUserId" />
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
