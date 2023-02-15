<script lang="ts">
import { collection, getDocs, query, where } from "@firebase/firestore";
import { defineComponent, ref as vueref } from "vue";
import { db } from "../../../firebase";

export default defineComponent({
  name: "CurrentUserPosts",
  props: { userId: String },
  setup: (props) => {
    const currentUserData: any = vueref();
    const currentUserId: any = vueref(props.userId);
    const currentUserPostsData: any = vueref("");
    // currentUserのpostデータ取得
    const postCollectionRef: any = query(
      collection(db, "posts"),
      where("userId", "==", currentUserId.value)
    );
    // 上記を元にドキュメントのデータを取得(post)
    getDocs(postCollectionRef).then((postDocId) => {
      const newPostDocIds = postDocId.docs;
      currentUserPostsData.value = newPostDocIds.map((id) => id.data());
    });
    return {
      currentUserPostsData,
      currentUserData,
      currentUserId,
    };
  },
});
</script>

<template>
  <div v-if="currentUserId">
    <div v-for="(currentUserPost, index) in currentUserPostsData" :key="index">
      <a v-bind:href="`/post/${currentUserPost.postId}`">
        <img v-bind:src="currentUserPost.imageUrl" alt="投稿画像" />
      </a>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>
