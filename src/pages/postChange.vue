<script setup lang="ts">
import { db } from "../../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CustomHeader from "../components/organisms/header.vue";

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
  location.href = `/post/${postId}`;
};
// watch(caption)
</script>

<template>
  <CustomHeader />
  <section class="postChange">
    <section class="postChange_section">
      <div class="postChange_titleContent">
        <button @click="cancelButton" class="cancelBtn">キャンセル</button>
        <div class="postChangeTitle">情報を編集</div>
        <button @click="updateButton" class="completionBtn">完了</button>
      </div>
      <div>
        <div class="postChange_content">
          <div class="postChange_post">
            <img
              v-bind:src="postData.imageUrl"
              alt="投稿写真"
              class="postChange_postImg"
            />
          </div>
          <div>
            <div class="postChange_iconName">
              <img v-bind:src="postData.icon" alt="icon" class="iconImg" />
              <p class="postChange_userName">{{ postData.userName }}</p>
            </div>
            <div>
              <textarea
                v-model="caption"
                maxlength="2200"
                class="postChange_captionInput"
              />
            </div>
            <div class="postChange_captionLength">
              {{ caption.length }}/2200
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.postChange {
  overflow: hidden;
}
.postChange_section {
  margin-left: 400px;
  margin-top: 100px;
  width: 900px;
  height: 500px;
  background-color: #ffff;
  border-radius: 3%;
}
.postChange_titleContent {
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
}
.postChangeTitle {
  font-weight: bold;
  font-size: 1.7rem;
  margin: 0 auto;
}
.cancelBtn {
  font-size: 1.4rem;
  line-height: 5rem;
  margin-left: 10px;
}
.completionBtn {
  color: #1596f7;
  font-weight: bold;
  font-size: 1.4rem;
  line-height: 5rem;
  margin-right: 10px;
}
.postChange_content {
  display: flex;
  gap: 1%;
}
.postChange_post {
  height: 448px;
  width: 600px;
}
.postChange_postImg {
  width: 100%;
  height: 100%;
  border-radius: 0 0 0 3%;
  object-fit: cover;
}
.postChange_iconName {
  display: flex;
  align-items: center;
  gap: 5%;
  margin-top: 20px;
}
.iconImg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid lightgray;
  background-color: #ffff;
}
.postChange_userName {
  font-weight: bold;
}
.postChange_captionInput {
  width: 282px;
  height: 350px;
  border: none;
  padding-top: 10px;
  resize: none;
}
textarea:focus {
  outline: none;
}
.postChange_captionLength {
  color: lightgray;
  text-align: end;
  margin-right: 10px;
}
</style>
