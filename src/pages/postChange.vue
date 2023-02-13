<script setup lang="ts">
import { db } from "../../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

//postIdを受け取る
const route = useRoute();
const postId: any = route.params.postId;

// キャンセルボタン
const router = useRouter();
// 投稿詳細から受け取ったpostIdをpostに渡す
const cancelButton = () => {
  router.push({ path: `/post/${postId}` });
};

//postデータ
const postData: any = ref("");

const caption = ref("");

// postsコレクションへの参照を取得
const postCollectionRef: any = collection(db, "posts");

// 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, postId);

// //上記を元にドキュメントのデータを取得
getDoc(postDocRefId).then((data) => {
  postData.value = data.data();
  const post = data.data();
  caption.value = post?.caption;
});

// 更新ボタン
const updateButton = async () => {
  await updateDoc(postDocRefId, {
    caption: caption.value,
  });
  console.log("更新しました");
};
</script>

<template>
  <div>
    <button @click="cancelButton">キャンセル</button>
    <h1>情報を編集</h1>
    <button @click="updateButton">完了</button>
  </div>
  <div>
    <div>
      <img v-bind:src="postData.imageUrl" alt="投稿写真" />
    </div>
    <div>
      <div>
        <img v-bind:src="postData.icon" alt="icon" class="iconImg" />
        <p>{{ postData.userName }}</p>
      </div>
      <input type="text" v-model="caption" />
    </div>
  </div>
</template>

<style>
.iconImg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
