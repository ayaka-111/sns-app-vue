<script lang="ts">
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "../../../firebase";
import { defineComponent, onMounted, ref as vueref } from "vue";
import type { Ref } from "vue";

interface NeedPostData {
  postId: string;
  timestamp: any;
  imageUrl: string;
}

export default defineComponent({
  name: "keepList",
  props: { userId: String },
  setup: (props) => {
    const currentUserData: any = vueref();
    const currentUserId: any = vueref(props.userId);
    const isLoading: any = vueref(true);
    const currentKeepsData: Ref<NeedPostData[]> = vueref([]);
    const currentUserKeepPostIds: any = vueref();

    isLoading.value = false;
    const userDocRef: any = doc(db, "users", currentUserId.value);
    getDoc(userDocRef)
      .then((userDocData) => {
        const userData: any = userDocData.data();
        currentUserData.value = userData;
        currentUserKeepPostIds.value = userData.keepPosts;
        console.log(currentUserKeepPostIds.value);
      })
      .then(() => {
        currentUserKeepPostIds.value.forEach((currentUserKeepPostId: any) => {
          const postDocRef: any = doc(db, "posts", currentUserKeepPostId);
          getDoc(postDocRef).then((postDocData) => {
            const postData: any = postDocData.data();
            console.log(postData.postId);
            currentKeepsData.value.push({
              postId: postData.postId,
              timestamp: postData.timestamp,
              imageUrl: postData.imageUrl,
            });
            currentKeepsData.value.sort((a: any, b: any) => {
              return a.timestamp.toDate() > b.timestamp.toDate() ? -1 : 1;
            });
            console.log(currentKeepsData.value[0].postId);
          });
        });
      });

    return {
      currentUserData,
      currentUserId,
      isLoading,
      currentKeepsData,
      currentUserKeepPostIds,
    };
  },
});
</script>

<template>
  <div v-if="currentKeepsData">
    <div v-if="!isLoading" class="threeRowsPostList">
      <div
        v-for="(currentKeepData, index) in currentKeepsData"
        :key="index"
        class="threeRowsPostList__image"
      >
        <a v-bind:href="`/post/${currentKeepData.postId}`">
          <img
            v-bind:src="currentKeepData.imageUrl"
            alt="投稿画像"
            class="post_img"
          />
        </a>
      </div>
    </div>
    <div v-else class="threeRowsPostList__message">Loading...</div>
  </div>
  <div v-else class="threeRowsPostList__message">投稿がありません</div>
</template>

<style scoped>
.threeRowsPostList {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
}
.threeRowsPostList__image {
  width: calc((100% - 60px) / 3);
  aspect-ratio: 1/1;
  margin-right: 0;
}
.threeRowsPostList__image:hover {
  opacity: 0.7;
}
.threeRowsPostList__message {
  margin-top: 10%;
  text-align: center;
}
.post_img {
  width: 100%;
  object-fit: cover;
  height: 100%;
}
</style>
