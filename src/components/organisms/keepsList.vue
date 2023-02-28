<script lang="ts">
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "../../../firebase";
import { defineComponent, onMounted, ref as vueref } from "vue";
import type { Ref } from "vue";
import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";

interface NeedPostData {
  postId: string;
  timestamp: any;
  imageUrl: string;
}

export default defineComponent({
  name: "keepList",
  props: { userId: String },
  setup: (props) => {
    const currentUserData: Ref<any> = vueref();
    const currentUserId: Ref<any> = vueref(props.userId);
    const isLoading: Ref<boolean> = vueref(true);
    const currentKeepsData: Ref<NeedPostData[]> = vueref([]);
    const currentUserKeepPostIds: Ref<string[] | undefined> = vueref();

    isLoading.value = false;
    const userDocRef: DocumentReference<DocumentData> = doc(
      db,
      "users",
      currentUserId.value
    );
    getDoc(userDocRef)
      .then((userDocData: DocumentSnapshot<DocumentData>) => {
        const userData: DocumentData | undefined = userDocData.data();
        currentUserData.value = userData;
        currentUserKeepPostIds.value = userData?.keepPosts;
      })
      .then(() => {
        currentUserKeepPostIds.value?.forEach(
          (currentUserKeepPostId: string) => {
            const postDocRef: DocumentReference<DocumentData> = doc(
              db,
              "posts",
              currentUserKeepPostId
            );
            getDoc(postDocRef).then(
              (postDocData: DocumentSnapshot<DocumentData>) => {
                const postData: DocumentData | undefined = postDocData.data();
                currentKeepsData.value.push({
                  postId: postData?.postId,
                  timestamp: postData?.timestamp,
                  imageUrl: postData?.imageUrl,
                });
                currentKeepsData.value.sort((a: any, b: any) => {
                  return a.timestamp.toDate() > b.timestamp.toDate() ? -1 : 1;
                });
              }
            );
          }
        );
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
  <div v-if="currentKeepsData.length > 0">
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
.post_img {
  width: 100%;
  object-fit: cover;
  height: 100%;
}
.threeRowsPostList__image:hover {
  opacity: 0.7;
}
.threeRowsPostList__message {
  margin-top: 10%;
  text-align: center;
}
</style>
