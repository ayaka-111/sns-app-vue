<script setup lang="ts">
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../../firebase";
import { ref } from "vue";

// オブジェクトの形でpostIdが渡される
const postIdObj = defineProps(["postId"]);

const postData: any = ref("");

// コレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, postIdObj.postId);

// 上記を元にドキュメントのデータを取得
getDoc(postDocRefId).then((data) => {
  postData.value = data.data();
});

//コメント機能(postsのcommentsに追加)
const inputComment = ref("");

const addComment = async () => {
  await updateDoc(postDocRefId, {
    comments: arrayUnion({
      userName: postData.value.userName,
      icon: postData.value.icon,
      comment: inputComment.value,
      // timestamp: serverTimestamp(),
    }),
  });
  inputComment.value = "";
};
</script>

<template>
  <div>
    <input
      type="text"
      v-model="inputComment"
      class="input"
      placeholder="コメントを追加..."
    />
    <!-- inputに入力されてから表示する -->
    <button @click="addComment">投稿する</button>
  </div>
</template>
