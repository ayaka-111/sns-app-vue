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
    const theUserPostsData: any = vueref([]);
    // currentUserのpostデータ取得
    const postCollectionRef: any = query(
      collection(db, "posts"),
      where("userId", "==", theUserId.value)
    );
    // 上記を元にドキュメントのデータを取得(post)
    getDocs(postCollectionRef).then((post: any) => {
      post.forEach((doc: any) => {
        theUserPostsData.value.push(doc.data());
        // 日付順に並び替え
        theUserPostsData.value.sort((a: any, b: any) => {
          return a.timestamp.toDate() > b.timestamp.toDate() ? -1 : 1;
        });
      });
          console.log(theUserPostsData.value[0].postId)

      // const newPostDocIds = postDocId.docs;
      // theUserPostsData.value = newPostDocIds.map((id) => id.data());
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
  <div v-if="theUserPostsData">
    <div v-if="theUserId" class="threeRowsPostList">
      <div
        v-for="(theUserPost, index) in theUserPostsData"
        :key="index"
        class="threeRowsPostList__image"
      >
        <a v-bind:href="`/post/${theUserPost.postId}`">
          <img
            v-bind:src="theUserPost.imageUrl"
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
