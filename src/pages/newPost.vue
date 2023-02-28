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
import CustomHeader from "../components/organisms/header.vue";
import { useRouter } from "vue-router";
import type { User } from "../../types/types";
import type { Ref } from "vue";
import type { DocumentData } from "firebase/firestore";
import UserIcon from "../components/icons/UserIcon.vue";

// ログインユーザー
const loginUser: Ref<User | DocumentData | undefined> = ref();

//ログインユーザーのドキュメント
const loginUserDocRefId: any = ref();

const fileName = ref();

const gsRef = ref();

//caption入力内容
const inputCaption = ref("");

//投稿する画像のurl
const postUrl = ref("");

const router = useRouter();

const iconStyle: Ref<string> = ref("30px");

//ログイン認証、user情報取得
onAuthStateChanged(auth, (currentUser) => {
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
    `${loginUser.value?.userId}/post/postId/${file.name}`
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

const show = ref(false);

// シェアボタン
const shareButton = async () => {
  // postsコレクション取得
  const postsCollectionRef = collection(db, "posts");

  // postsに追加する内容
  const postDoc = await addDoc(postsCollectionRef, {
    userId: loginUser.value?.userId,
    userName: loginUser.value?.userName,
    caption: inputCaption.value,
    timestamp: serverTimestamp(),
    favorites: [],
    keeps: [],
    comments: [],
    icon: loginUser.value?.icon,
  });

  // storageのpath更新(postIdを指定して画像アップロードする)
  const newGsReference = storageRef(
    storage,
    `${loginUser.value?.userId}/post/${postDoc.id}/postImg.png`
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
  // location.href = "/home";
  // モーダル開く
  show.value = true;
};
const close = () => {
  // show.value = false;
  router.push("/myAccountPage/post");
};
</script>

<template>
  <CustomHeader />
  <section class="newPost">
    <section v-if="postUrl === ''" class="newPost_uploadingSection">
      <div class="newPost_title">新規投稿を作成</div>
      <div class="newPost_upload">
        <div class="newPost_pictureIcon">
          <font-awesome-icon
            :icon="['far', 'images']"
            class="newPost_pictureIconImg"
          />
        </div>
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
      </div>
    </section>

    <section v-else class="newPost_uploadedSection">
      <div class="newPost_uploadedTitleContent">
        <div class="newPost_uploadedTitle">新規投稿を作成</div>

        <div id="shareModal" class="shareModal">
          <!--  クリック要素  -->
          <button @click="shareButton" class="share modal_open_btn">
            シェア
          </button>

          <!--  モーダルウィンドウ  -->
          <div v-show="show" class="modal_contents">
            <!-- モーダルウィンドウの背景 -->
            <div @click="close" class="modal_contents_bg">
              <font-awesome-icon :icon="['fas', 'xmark']" class="xmark" />
            </div>

            <!--   モーダルウィンドウを閉じる   -->
            <button @click="close" class="modal_close_btn"></button>

            <!--   モーダルウィンドウの中身   -->
            <div class="modal_contents_wrap">
              <p class="shareModal_title">投稿をシェアしました</p>
              <div class="shareModal_contents">
                <font-awesome-icon
                  :icon="['far', 'circle-check']"
                  class="check"
                />

                <p class="shareModal_text">投稿がシェアされました</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="newPost_uploadedContent">
        <div class="newPost_post">
          <img v-bind:src="postUrl" alt="投稿写真" class="newPost_postImg" />
        </div>
        <div>
          <div class="newPost_iconName">
            <UserIcon
              v-bind:userId="loginUser?.userId"
              v-bind:iconStyle="iconStyle"
              id="iconImg"
            />
            <p class="newPost_userName">{{ loginUser?.userName }}</p>
          </div>
          <div>
            <textarea
              v-model="inputCaption"
              placeholder="キャプションを入力..."
              maxlength="2200"
              class="newPost_captionInput"
            />
          </div>
          <div class="newPost_captionLength">
            {{ inputCaption.length }}/2200
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.newPost {
  overflow: hidden;
}
.newPost_uploadingSection {
  margin-left: 570px;
  margin-top: 100px;
  width: 500px;
  height: 500px;
  background-color: #ffff;
  border-radius: 3%;
}
.newPost_title {
  font-size: 1.7rem;
  font-weight: bold;
  border-bottom: 1px solid lightgray;
  text-align: center;
  height: 50px;
  padding-top: 10px;
}
.newPost_upload {
  margin-top: 140px;
}
.newPost_pictureIcon {
  width: 100px;
  height: auto;
  margin: 0 auto 20px auto;
}
.newPost_pictureIconImg {
  width: 100%;
  height: 100%;
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
  margin: 0 auto;
}
.uploadLabel:hover {
  opacity: 0.6;
  cursor: pointer;
}
.uploadInput {
  display: none;
}
.newPost_uploadedSection {
  margin-left: 400px;
  margin-top: 100px;
  width: 900px;
  height: 500px;
  background-color: #ffff;
  border-radius: 3%;
}
.newPost_uploadedTitleContent {
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
  /* justify-content: space-between; */
}
.newPost_uploadedTitle {
  font-weight: bold;
  font-size: 1.7rem;
  margin: 0 auto;
}
.share {
  color: #1596f7;
  font-weight: bold;
  font-size: 1.4rem;
  line-height: 5rem;
  /* margin-right: 10px; */
}
.newPost_uploadedContent {
  display: flex;
  gap: 1%;
}
.newPost_post {
  height: 448px;
  width: 600px;
}
.newPost_postImg {
  width: 100%;
  height: 100%;
  border-radius: 0 0 0 3%;
  object-fit: cover;
}
.newPost_iconName {
  display: flex;
  align-items: center;
  gap: 5%;
  margin-top: 20px;
}
#iconImg {
  /* width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid lightgray;
  background-color: #ffff; */
  margin: 0 0;
}
.newPost_userName {
  font-weight: bold;
}
.newPost_captionInput {
  width: 282px;
  height: 350px;
  border: none;
  padding-top: 10px;
  resize: none;
}
textarea:focus {
  outline: none;
}
.newPost_captionLength {
  color: lightgray;
  text-align: end;
  margin-right: 10px;
}
.shareModal {
  padding-right: 4%;
}
/* モーダルウィンドウを開く要素 */
.modal_open_btn {
  cursor: pointer;
}
/* モーダルウィンドウ要素 */
.modal_contents {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  width: 100%;
}
/* モーダルウィンドウの背景要素 */
.modal_contents_bg {
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
}
.xmark {
  display: flex;
  margin-right: 2%;
  margin-left: auto;
  padding-top: 2%;
  width: 20px;
  height: auto;
  color: #ffff;
  cursor: pointer;
}
/* モーダルウィンドウの中身*/
.modal_contents_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  width: 35%;
  height: 70%;
  margin: auto;
  transform: translate(-50%, -50%);
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.shareModal_title {
  /* font-size: 1.7rem; */
  border-bottom: 1px solid lightgray;
  height: 50px;
  padding-top: 5%;
  font-weight: bold;
}
.shareModal_contents {
  display: flex;
  flex-direction: column;
  margin: auto auto;
}
.check {
  width: 100px;
  height: auto;
  margin: 0 auto;
  background: linear-gradient(
    to bottom right,
    #fdc103,
    #fd5727,
    #fd174a,
    #c602ab,
    #8d22e4
  );
  /* background-clip: text; */
  /* -webkit-background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
  color: #ffff;
  border-radius: 50%;
}
.shareModal_text {
  font-size: 1.7rem;
  margin-top: 10%;
}
/* モーダルウィンドウを閉じる要素 */
.modal_close_btn {
  cursor: pointer;
  height: 33%;
  color: #ffff;
}
</style>
