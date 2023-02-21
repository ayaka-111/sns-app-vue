<script lang="ts">
import {
  arrayUnion,
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../../../firebase";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Comment",
  props: ["postId", "loginUser"],
  setup: (props) => {
    // オブジェクトの形でpostIdが渡される
    // const postIdObj = defineProps(["postId"]);

    const postData: any = ref("");

    // コレクションへの参照を取得
    const postCollectionRef = collection(db, "posts");

    // 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
    const postDocRefId = doc(postCollectionRef, props.postId);

    // 上記を元にドキュメントのデータを取得
    getDoc(postDocRefId).then((data) => {
      postData.value = data.data();
    });

    //コメント機能(postsのcommentsに追加)
    const inputComment = ref("");

    const addComment = async () => {
      await updateDoc(postDocRefId, {
        comments: arrayUnion({
          userName: props.loginUser.userName,
          icon: props.loginUser.icon,
          comment: inputComment.value,
          userId: props.loginUser.userId,
          // timestamp: serverTimestamp(),
        }),
      });
      inputComment.value = "";
    };
    return { inputComment, addComment };
  },
});
</script>

<template>
  <div class="comment_form">
    <textarea
      v-model="inputComment"
      class="comment_input"
      placeholder="コメントを追加..."
    />
    <!-- inputに入力されてから表示する -->
    <button
      @click="addComment"
      class="comment_button"
      v-if="inputComment.length > 0"
    >
      投稿する
    </button>
  </div>
</template>

<style scoped>
.comment_form {
  position: relative;
}
.comment_input {
  border: none;
  width: 100%;
  resize: none;
}
.comment_input:focus {
  outline: none;
}
.comment_button {
  position: absolute;
  top: 30%;
  left: 85%;
  font-weight: bold;
  color: #1596f7;
}
</style>
