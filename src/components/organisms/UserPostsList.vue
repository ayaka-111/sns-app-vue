<script lang="ts">
import { collection, getDocs, query, where } from "@firebase/firestore";
import { defineComponent, ref as vueref } from "vue";
import { db } from "../../../firebase";

export default defineComponent({
  name: "UserPostsList",
  props: { userId: String },
  setup: (props) => {
    const userData: any = vueref();
    const theUserId: any = vueref(props.userId);
    const theUserPostsData: any = vueref("");
    // currentUserのpostデータ取得
    const postCollectionRef: any = query(
      collection(db, "posts"),
      where("userId", "==", theUserId.value)
    );
    // 上記を元にドキュメントのデータを取得(post)
    getDocs(postCollectionRef).then((postDocId) => {
      const newPostDocIds = postDocId.docs;
      theUserPostsData.value = newPostDocIds.map((id) => id.data());
    });
    return {
      theUserPostsData,
      userData,
      theUserId,
    };
  },
});
</script>

<template>
  <div v-if="theUserId">
    <div v-for="(theUserPost, index) in theUserPostsData" :key="index">
      <a v-bind:href="`/post/${theUserPost.postId}`">
        <img v-bind:src="theUserPost.imageUrl" alt="投稿画像" />
      </a>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>
