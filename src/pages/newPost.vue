<script setup lang="ts">
import { ref } from "vue";
import { onAuthStateChanged } from "@firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, db, storage } from "../../firebase";

// ログインユーザー
const loginUser: any = ref("");

//ログインユーザーのドキュメント
const loginUserDocRefId: any = ref("");

const fileName = ref();

const gsRef = ref();

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

    loginUserDocRefId.value = userDocRefId;

    // 上記を元にドキュメントのデータを取得
    getDoc(userDocRefId).then((data) => {
      loginUser.value = data.data();
    });
  }
});

// 写真アップロードボタン
const uploadButton = (e: any) => {
  const file = e.target.files[0];
  fileName.value = file;
  const gsReference = storageRef(
    storage,
    `${loginUser.value.userId}/post/postId/${file.name}`
  );

  gsRef.value = gsReference;

  uploadBytesResumable(gsReference, file).then(() => {
    console.log("追加しました");
    getDownloadURL(gsReference).then((url) => {
      // 画面表示で追加されたか判断するためrefに代入
      postUrl.value = url;
    });
  });
};

// シェアボタン
const shareButton = async () => {
  // postsコレクション取得
  const postsCollectionRef: any = collection(db, "posts");

  // postsに追加する内容
  const postDoc = await addDoc(postsCollectionRef, {
    userId: loginUser.value.userId,
    userName: loginUser.value.userName,
    caption: inputCaption.value,
    timestamp: serverTimestamp(),
    favorites: [],
    keeps: [],
    comments: [],
    icon: loginUser.value.icon,
  });

  // storageのpath更新(postIdを指定して画像アップロードする)
  const newGsReference = storageRef(
    storage,
    `${loginUser.value.userId}/post/${postDoc.id}/postImg.png`
  );

  //新しいURL取得
  uploadBytesResumable(newGsReference, fileName.value).then(() => {
    console.log("追加しました");
    getDownloadURL(newGsReference).then((newUrl) => {
      // addDocで追加した時に自動生成されたドキュメントを参照
      const newPostDocRefId = doc(db, "posts", postDoc.id);
      console.log(newUrl);
      //取得したドキュメントとidとURLを元にpostIdとimageURLを追加
      updateDoc(newPostDocRefId, {
        postId: postDoc.id,
        imageUrl: newUrl,
      });
    });
  });

  // ログインユーザーのusersデータのpostsにpostIdを追加
  updateDoc(loginUserDocRefId.value, {
    posts: arrayUnion(postDoc.id),
  });

  // 最初にアップロードしたstorageの画像を削除
  await deleteObject(gsRef.value)
    .then(() => {
      console.log("postIdファイル削除完了");
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("投稿完了");

  // home画面に遷移する
  location.href = "/home";
};
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
