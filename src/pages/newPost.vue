<script setup lang="ts">
import { ref } from "vue";
import { onAuthStateChanged } from "@firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "@firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, db, storage } from "../../firebase";

// ログインユーザー
const loginUser: any = ref("");

//caption入力内容
const inputCaption = ref("");

//投稿する画像のurl
const postUrl = ref("");

//ログイン認証、user情報取得
onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    //ログインユーザーの情報取得
    const userCollectionRef = collection(db, "users");

    // 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
    const userDocRefId = doc(userCollectionRef, currentUser.uid);

    // 上記を元にドキュメントのデータを取得
    getDoc(userDocRefId).then((data) => {
      loginUser.value = data.data();
    });
  }
});

// 写真アップロードボタン
const uploadButton = (e: any) => {
  const file = e.target.files[0];
  const gsReference = storageRef(storage, "image/" + file.name);

  uploadBytesResumable(gsReference, file).then(() => {
    console.log("追加しました");
    getDownloadURL(gsReference).then((url) => {
      console.log(url);
      postUrl.value = url;
    });
  });
};

// postsに追加ボタン
const shareButton = async () => {
  const postsCollectionRef: any = collection(db, "posts");
  await addDoc(postsCollectionRef, {
    userId: loginUser.value.userId,
    userName: loginUser.value.userName,
    imageUrl: postUrl.value,
    caption: inputCaption.value,
    timestamp: serverTimestamp(),
    favorites: [],
    keeps: [],
    comments: [],
    icon: loginUser.value.icon,
  });
  console.log("投稿完了");
  location.href = "/home";
};
console.log(postUrl.value);
</script>

<template>
  <section v-if="postUrl === ''">
    <div class="title">新規投稿を作成</div>
    <div class="uploadButton">
      <label htmlFor="iconUpload" class="uploadLabel">
        写真をアップロード
      </label>
      <input
        name="iconUpload"
        id="iconUpload"
        type="file"
        accept=".png, .jpeg, .jpg"
        @change="uploadButton"
        class="uploadInput"
      />
    </div>
  </section>

  <section v-else>
    <div>
      <div>新規投稿を作成</div>
      <button @click="shareButton" class="share">シェア</button>
    </div>
    <div>
      <div>
        <img v-bind:src="postUrl" alt="投稿写真" />
      </div>
    </div>
    <div>
      <div>
        <img v-bind:src="loginUser.icon" alt="icon" class="iconImg" />
        <p>{{ loginUser.userName }}</p>
      </div>
      <div>
        <input
          type="text"
          v-model="inputCaption"
          placeholder="キャプションを入力..."
          maxlength="2200"
        />
      </div>
      <div>{{ inputCaption.length }}/2200</div>
    </div>
  </section>
</template>

<style>
.title {
  font-size: 1.7rem;
  font-weight: bold;
}
.uploadButton {
  background-color: #1596f7;
  color: #ffff;
  font-weight: bold;
  font-size: 1.3rem;
  /* line-height: 5rem; */
  width: 135px;
  padding: 5px 8px;
  /* height: 20px; */
  text-align: center;
  border-radius: 5%;
}
.uploadLabel:hover {
  opacity: 0.6;
  cursor: pointer;
}
.uploadInput {
  display: none;
}
.share {
  color: #1596f7;
  font-weight: bold;
  font-size: 1.4rem;
  line-height: 5rem;
}
.iconImg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
