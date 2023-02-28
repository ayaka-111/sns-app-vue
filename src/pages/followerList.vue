<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { onMounted, ref as vueref } from "vue";
import { auth, db } from "../../firebase";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "@firebase/firestore";
import Header from "../components/organisms/header.vue";
import type { Ref } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type { User } from "../../types/types";
import type { DocumentData, DocumentReference } from "@firebase/firestore";

const route: RouteLocationNormalizedLoaded = useRoute();
const userId: any = route.params.userId;
const router: Router = useRouter();
const anotherUserData: Ref<User[]> = vueref([]);
const currentUserId: Ref<string | undefined> = vueref();
const isLoading: Ref<boolean> = vueref(true);

let followerUserIds: string[] = [];
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      const userDocRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId
      );
      getDoc(userDocRef)
        .then((userDocData) => {
          const userData: DocumentData | undefined = userDocData.data();
          followerUserIds = userData?.follower;
        })
        .then(() => {
          followerUserIds.forEach((followerUserId: string) => {
            const followerUserDocRef: DocumentReference<DocumentData> = doc(
              db,
              "users",
              followerUserId
            );
            getDoc(followerUserDocRef).then((userDocData) => {
              const userData: any = userDocData.data();
              anotherUserData.value.push(userData);
            });
          });
        });
    }
  });
});
</script>
<template>
  <Header />
  <div class="header_area">
    <div class="follower_wrapper">
      <p class="title">フォロワー</p>
      <div v-if="!isLoading">
        <div v-if="anotherUserData.value !== []">
          <ol>
            <div v-for="(anotherUser, index) in anotherUserData" :key="index">
              <li class="user_data" v-if="anotherUser == currentUserId">
                <a href="/myAccountPage">
                  <div class="user_icon">
                    <img v-bind:src="anotherUser.icon" alt="ユーザーアイコン" />
                  </div>
                </a>
                <a href="/myAccountPage">
                  <div class="user_text_data">
                    <p class="user_name">{{ anotherUser.userName }}</p>
                    <p class="name">{{ anotherUser.name }}</p>
                  </div>
                </a>
              </li>
              <li class="user_data" v-else>
                <a v-bind:href="`/accountPage/${anotherUser.userId}`">
                  <div class="user_icon">
                    <img v-bind:src="anotherUser.icon" alt="ユーザーアイコン" />
                  </div>
                </a>
                <a v-bind:href="`/accountPage/${anotherUser.userId}`">
                  <div class="user_text_data">
                    <p class="user_name">{{ anotherUser.userName }}</p>
                    <p class="name">{{ anotherUser.name }}</p>
                  </div>
                </a>
              </li>
            </div>
          </ol>
        </div>
        <div v-else>
          <p class="no_follow">現在フォロワーはいません</p>
        </div>
      </div>
      <div v-else>
        <p class="loading">Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header_area {
  margin-left: 250px;
}
.follower_wrapper {
  width: 500px;
  margin: auto;
}
.title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 30px 0;
}
.user_data {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}
.user_icon {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
  margin-right: 10px;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user_text_data {
  margin: auto 0;
}
.user_name {
  font-weight: bold;
}
.name {
  color: #8e8e8e;
}
.loading,
.no_follow {
  font-size: 16px;
  text-align: center;
  margin-top: 100px;
}
</style>
