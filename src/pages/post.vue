<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRoute, useRouter } from "vue-router";
import CustomHeader from "../components/organisms/header.vue";
import KeepBtn from "../components/atoms/button/keepBtn.vue";
import DeletePost from "../components/atoms/button/DeletePost.vue";
import PostFavorite from "../components/atoms/button/PostFavorite.vue";

//postIdを受け取る
const route = useRoute();
const postId: any = route.params.postId;

//編集ボタン
const router = useRouter();
const changeButton = () => {
  router.push({ path: `/postChange/${postId}` });
};

// ログインユーザーのuid
const loginUserUid = ref("");

// ログインユーザーの情報
const loginUser: any = ref("");

// ログインユーザーのfavoritePostsにpostIdが含まれているかどうか
const favorite = ref(false);
const noFavorite = ref(false);

// ユーザーコレクション
const userCollection: any = ref("");

// ログインユーザーのドキュメント
const loginUserDoc: any = ref("");

const postDoc: any = ref("");
//postデータ
const postData: any = ref("");
const commentData: any = ref([]);
const commentLength: any = ref();
const postFavoriteLength = ref(0);

//timestampの表記変更
const dateToDate = reactive({
  year: "",
  month: "",
  date: "",
  hour: "",
  min: "",
});

// 取得を待つ
const loading = ref(true);

const postDocumentIdArray: any = ref([]);

const referrer = ref();

onMounted(() => {
  referrer.value = document.referrer;
  console.log(referrer.value);
  //ログイン認証、uid取得
  onAuthStateChanged(auth, (currentUser: any) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      loginUserUid.value = currentUser.uid;

      loading.value = false;
      const loginUserCollectionRef = collection(db, "users");
      userCollection.value = loginUserCollectionRef;
      const loginUserDocRefId = doc(loginUserCollectionRef, currentUser.uid);
      loginUserDoc.value = loginUserDocRefId;

      getDoc(loginUserDocRefId).then((data) => {
        const userData = data.data();
        loginUser.value = userData;
        if (userData?.favoritePosts.includes(postId)) {
          favorite.value = true;
        } else {
          noFavorite.value = false;
        }
      });
    }
  });

  // postsコレクションへの参照を取得
  const postCollectionRef = collection(db, "posts");

  // postsのドキュメントId全件取得
  getDocs(postCollectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      postDocumentIdArray.value.push(doc.id);
    });
  });
  console.log(postDocumentIdArray.value);

  // 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
  const postDocRefId = doc(postCollectionRef, postId);
  postDoc.value = postDocRefId;

  // //上記を元にドキュメントのデータを取得
  getDoc(postDocRefId).then((data) => {
    postData.value = data.data();
    commentData.value = data.data()?.comments;
    postFavoriteLength.value = data.data()?.favorites.length;
    commentLength.value = data.data()?.comments.length;
    // comment.value = true;
    console.log(data.data()?.comments);
    //timestamp取得
    const dataList = data.data();
    const timestamp = dataList?.timestamp.toDate();
    dateToDate.year = timestamp.getFullYear();
    dateToDate.month = timestamp.getMonth() + 1;
    dateToDate.date = timestamp.getDate();
    dateToDate.hour = timestamp.getHours();
    dateToDate.min = timestamp.getMinutes();
  });
});

// 投稿ボタン押された時に監視する
watch(commentLength, () => {
  console.log(commentLength.value);
  addComment().then(() => {
    getDoc(postDoc.value).then((data) => {
      const post: any = data.data();
      postData.value = post;
      commentData.value = post.comments;
      console.log(post.comments);
    });
  });
});

//コメント機能(postsのcommentsに追加)
// inputに入力された情報を管理
const inputComment = ref("");

const addComment = async () => {
  await updateDoc(postDoc.value, {
    comments: arrayUnion({
      userName: loginUser.value.userName,
      icon: loginUser.value.icon,
      comment: inputComment.value,
      userId: loginUserUid.value,
      // timestamp: serverTimestamp(),
    }),
  });
  inputComment.value = "";
};
// ボタンが押されたら1足して情報が変化していることをwatchに伝える
const onClickAddComment = () => {
  commentLength.value = commentLength.value + 1;
};

// コメントアイコンボタン
const onClickComment = () => {
  const input = document.getElementById("inputComment");
  input?.focus();
};

// menuの表示切り替え
const show = ref(false);
// モーダル開く
const open = () => {
  show.value = true;
};
// モーダル閉じる
const close = () => {
  show.value = false;
};
// 削除再確認モーダル
const deleteShow = ref(false);
const deleteOpen = () => {
  deleteShow.value = true;
};
const deleteClose = () => {
  deleteShow.value = false;
};
</script>

<template>
  <CustomHeader />
  <section class="post">
    <section v-if="!loading">
      <section v-if="postDocumentIdArray.includes(postId)" class="post_wrapper">
        <section>
          <div class="post_postImg">
            <img v-bind:src="postData.imageUrl" alt="投稿写真" />
          </div>
        </section>
        <section class="post_content">
          <div class="post_title">
            <div class="post_profile" v-if="postData.userId === loginUserUid">
              <a href="/myAccountPage">
                <img
                  v-bind:src="postData.icon"
                  alt="icon"
                  class="post_iconImg"
                />
              </a>
              <a href="/myAccountPage">
                <p class="post_userName">{{ postData.userName }}</p>
              </a>
              <p
                class="post_editedText"
                v-if="referrer === `http://localhost:5173/postChange/${postId}`"
              >
                編集済み
              </p>
            </div>
            <div class="post_profile" v-else>
              <a v-bind:href="`/accountPage/${postData.userId}`">
                <img
                  v-bind:src="postData.icon"
                  alt="icon"
                  class="post_iconImg"
                />
              </a>
              <a v-bind:href="`/accountPage/${postData.userId}`">
                <p class="post_userName">{{ postData.userName }}</p>
              </a>
            </div>

            <div
              id="postNav"
              class="postNav"
              v-if="postData.userId === loginUserUid"
            >
              <!--  クリック要素  -->
              <span @click="open" class="modal_open_btn"
                ><font-awesome-icon
                  :icon="['fas', 'ellipsis']"
                  class="post_menu"
              /></span>

              <!--  モーダルウィンドウ  -->
              <div v-show="show" class="modal_contents">
                <!-- モーダルウィンドウの背景 -->
                <div @click="close" class="modal_contents_bg"></div>

                <!--   モーダルウィンドウの中身   -->
                <div class="modal_contents_wrap">
                  <!-- <button @click="deleteButton" class="deleteBtn">削除</button> -->
                  <button @click="deleteOpen" class="deleteBtn">削除</button>

                  <!--  削除再確認モーダルウィンドウ  -->
                  <div v-show="deleteShow" class="modal_contents">
                    <!-- 削除再確認モーダルウィンドウの背景 -->
                    <div @click="deleteClose" class="modal_contents_bg"></div>
                    <!-- 削除再確認モーダルの中身 -->
                    <div class="deleteModal_contents_wrap">
                      <div class="deleteModal_title">
                        <h1>投稿を削除しますか？</h1>
                        <p class="deleteText">この投稿を削除しますか？</p>
                      </div>
                      <DeletePost
                        v-bind:postId="postId"
                        v-bind:loginUserUid="loginUserUid"
                        v-bind:loginUserDoc="loginUserDoc"
                        v-bind:userCollection="userCollection"
                      />
                      <button
                        @click="deleteClose"
                        class="deleteModal_close_btn"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>

                  <button @click="changeButton" class="updateBtn">編集</button>
                  <!--   モーダルウィンドウを閉じる   -->
                  <button @click="close" class="modal_close_btn">
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="post_captionContent">
            <div
              class="post_commentList"
              v-if="postData.userId === loginUserUid"
            >
              <a href="/myAccountPage">
                <img
                  v-bind:src="postData.icon"
                  alt="icon"
                  class="post_iconImg"
                />
              </a>
              <a href="/myAccountPage">
                <p class="post_userName">{{ postData.userName }}</p>
              </a>
              <div class="post_caption">{{ postData.caption }}</div>
            </div>
            <div class="post_commentList" v-else>
              <a v-bind:href="`/accountPage/${postData.userId}`">
                <img
                  v-bind:src="postData.icon"
                  alt="icon"
                  class="post_iconImg"
                />
              </a>
              <a v-bind:href="`/accountPage/${postData.userId}`">
                <p class="post_userName">{{ postData.userName }}</p>
              </a>
              <div class="post_caption">{{ postData.caption }}</div>
            </div>

            <div
              v-for="comment in commentData"
              v-bind:key="comment.id"
              class="post_commentList"
            >
              <div
                v-if="comment.userId === loginUserUid"
                class="post_commentIconImg"
              >
                <a href="/myAccountPage">
                  <img v-bind:src="comment.icon" alt="iconImg" />
                </a>
              </div>
              <div v-else class="post_commentIconImg">
                <a v-bind:href="`/accountPage/${comment.userId}`">
                  <img v-bind:src="comment.icon" alt="iconImg" />
                </a>
              </div>
              <div class="post_commentContent">
                <p
                  v-if="comment.userId === loginUserUid"
                  class="post_commentName"
                >
                  <a href="/myAccountPage">{{ comment.userName }}</a>
                </p>
                <p v-else class="post_commentName">
                  <a v-bind:href="`/accountPage/${comment.userId}`">
                    {{ comment.userName }}
                  </a>
                </p>
                <p>{{ comment.comment }}</p>
              </div>
            </div>
          </div>
          <div class="post_buttons">
            <div class="post_favCom">
              <PostFavorite
                v-bind:favorite="favorite"
                v-bind:loginUserDoc="loginUserDoc"
                v-bind:loginUser="loginUser"
                v-bind:postDoc="postDoc"
                v-bind:postData="postData"
                v-bind:loginUserUid="loginUserUid"
                v-bind:postId="postId"
                @response="(length) => (postFavoriteLength = length)"
              />
              <button @click="onClickComment">
                <font-awesome-icon
                  :icon="['far', 'comment']"
                  class="post_comment"
                />
              </button>
            </div>
            <KeepBtn v-bind:postId="postId" />
          </div>
          <div class="post_favorite">
            いいね
            <span class="post_favoriteLength">{{ postFavoriteLength }} </span>
            件
          </div>
          <div class="post_date">
            {{ dateToDate.month }}月 {{ dateToDate.date }},
            {{ dateToDate.year }}
          </div>
          <div class="post_addCommentContent">
            <textarea
              v-model="inputComment"
              class="post_commentTextarea"
              placeholder="コメントを追加..."
              id="inputComment"
              maxlength="2200"
            />
            <button
              @click="onClickAddComment"
              class="post_focusCommentBtn"
              v-if="inputComment.length > 0"
            >
              投稿する
            </button>
            <button class="post_commentBtn" v-else>投稿する</button>
          </div>
        </section>
      </section>
      <section class="post_wrapper" v-else>
        <p class="post_noPostText">投稿が存在しません</p>
      </section>
    </section>
    <p v-else class="loading_text">loading...</p>
  </section>
</template>

<style scoped>
.post {
  overflow: hidden;
}
.post_wrapper {
  display: flex;
  height: 600px;
  width: 1050px;
  margin-left: 330px;
  margin-top: 45px;
  background-color: #ffff;
  position: relative;
}
.post_postImg {
  height: 600px;
  width: 600px;
}
.post_postImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post_content {
  width: 500px;
}
.post_title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
  padding: 3% 0;
  padding-left: 3.5%;
  align-items: center;
}
.post_profile {
  display: flex;
  align-items: center;
  gap: 11%;
  width: 200px;
}
.post_iconImg {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid lightgray;
  background-color: #ffff;
}
.post_userName {
  font-weight: bold;
}
.post_editedText {
  width: fit-content;
  white-space: nowrap;
  color: gray;
  font-size: 1.1rem;
}
.post_captionContent {
  overflow-y: scroll;
  overflow-x: none;
  height: 400px;
  border-bottom: 1px solid lightgray;
}
.post_caption {
  width: 270px;
  white-space: normal;
  word-wrap: break-word;
}
.post_commentList {
  display: flex;
  /* align-items: center; */
  gap: 5%;
  margin-top: 3%;
  margin-left: 3.5%;
}
.post_commentIconImg {
  width: 35px;
  height: 35px;
}
.post_commentIconImg img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid lightgray;
  background-color: #ffff;
}
.post_commentName {
  font-weight: bold;
}
.post_commentContent {
  display: flex;
  align-items: center;
  gap: 3%;
  width: 85%;
}
.post_redHeart {
  color: red;
}
.post_buttons {
  margin: 2% 2%;
  display: flex;
  justify-content: space-between;
}
.post_favCom {
  display: flex;
  gap: 5%;
}
.post_heart {
  width: 23px;
  height: auto;
}
.post_comment {
  width: 23px;
  height: auto;
}
.post_bookmark {
  width: 17px;
  height: auto;
}
.post_favorite {
  margin-left: 2%;
}
.post_favoriteLength {
  font-weight: bold;
}
.post_date {
  color: #a6a6a6;
  font-size: 0.8rem;
  margin-left: 2%;
}
.post_addCommentContent {
  /* position: relative; */
  border-top: 1px solid lightgray;
  margin-top: 2%;
  display: flex;
}
.post_commentTextarea {
  border: none;
  width: 85%;
  height: 40px;
  resize: none;
}
.post_commentTextarea:focus {
  outline: none;
}
.post_focusCommentBtn {
  /* position: absolute; */
  /* top: 25%; */
  /* left: 85%; */
  font-weight: bold;
  color: #1596f7;
}
.post_commentBtn {
  /* position: absolute; */
  /* top: 25%; */
  /* left: 85%; */
  font-weight: bold;
  color: #67b6fa;
}
button {
  cursor: pointer;
}
.postNav {
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
/* モーダルウィンドウの中身*/
.modal_contents_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  width: 25%;
  height: 30%;
  margin: auto;
  transform: translate(-50%, -50%);
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.deleteBtn {
  height: 33%;
  color: red;
  font-weight: bold;
}
.deleteModal_contents_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  width: 100%;
  height: 100%;
  margin: auto;
  transform: translate(-50%, -50%);
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.deleteModal_title {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.deleteText {
  color: gray;
}
.deleteModal_deleteBtn {
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  color: red;
  font-weight: bold;
  height: 25%;
}
.deleteModal_close_btn {
  cursor: pointer;
  height: 25%;
}
.updateBtn {
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  height: 33%;
}
/* モーダルウィンドウを閉じる要素 */
.modal_close_btn {
  cursor: pointer;
  height: 33%;
}
.post_noPostText {
  position: absolute;
  top: 50%;
  left: 50%;
  font-weight: bold;
  font-size: 2rem;
  color: gray;
  transform: translate(-50%, -50%);
}
.loading_text {
  text-align: center;
  margin-top: 200px;
  font-size: 16px;
  font-weight: bold;
}
</style>
