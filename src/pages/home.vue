<script setup lang="ts">
import { ref, watch } from "vue";
import {
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";

// ログインユーザーのuid
const loginUser = ref("");

onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    loginUser.value = currentUser.uid;
  }
});

//usersからログインユーザーのfollow配列取得

//自分とfollowしているユーザーのpostデータ取得
const postData: any = ref("");

// //コレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// //上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, "nxvBjxNsshrRKcsXot7j");

// //上記を元にドキュメントのデータを取得
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
    }),
  });
  inputComment.value = "";
};
</script>

<template>
  <section class="wrapper">
    <div class="titleHeader">
      <a href="/profile">
        <img v-bind:src="postData.icon" alt="icon" class="iconImg" />
      </a>
      <a href="/profile">
        <p>{{ postData.userName }}</p>
      </a>
    </div>

    <div class="postImg">
      <img v-bind:src="postData.imageUrl" alt="投稿写真" />
    </div>

    <div>
      <button>♡</button>
      <button>📝</button>
      <button>🏷</button>
    </div>

    <div>
      <span class="favoriteLength">いいね{{ postData.favorites.length }}件</span
      >
    </div>

    <div class="postContent">
      <a href="/profile">
        <p class="postUserName">{{ postData.userName }}</p>
      </a>
      <div>{{ postData.caption }}</div>
    </div>

    <div>
      <!-- あとでモーダルにする -->
      <a href="/post">
        <p class="commentLink">コメントをすべて見る</p>
      </a>
    </div>

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
  </section>
</template>

<style>
.wrapper {
  border-bottom: 1px solid lightgray;
}
.titleHeader {
  display: flex;
  gap: 5%;
  align-items: center;
  height: 100px;
}
.iconImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.smallIconImg {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.postImg {
  width: 500px;
  height: 500px;
}
.postImg img {
  width: 100%;
  height: 100%;
}
.favoriteLength {
  font-weight: bold;
}
.postContent {
  display: flex;
  gap: 3%;
}
.postUserName {
  font-weight: bold;
}
.commentLink {
  color: #757575;
}
.input {
  border: none;
}
.input:focus {
  outline: none;
}
</style>
