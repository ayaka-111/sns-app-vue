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
import Header from "../components/organisms/header.vue";

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

onMounted(() => {
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
// いいねボタンを押された時に監視する
watch(favorite, () => {
  if (favorite.value) {
    addFavorite().then(() => {
      getDoc(loginUserDoc.value).then((user) => {
        loginUser.value = user.data();
      });
      getDoc(postDoc.value).then((post) => {
        const data: any = post.data();
        postData.value = data;
        postFavoriteLength.value = data.favorites.length;
      });
    });
  } else {
    removeFavorite().then(() => {
      getDoc(loginUserDoc.value).then((user) => {
        loginUser.value = user.data();
      });
      getDoc(postDoc.value).then((post) => {
        const data: any = post.data();
        postData.value = data;
        postFavoriteLength.value = data.favorites.length;
      });
    });
  }
});

// いいね追加
// ログインユーザーのfavoritePostsにpostIdとpostsのfavoriteにログインユーザーのuserNameを追加
const addFavorite = async () => {
  await updateDoc(postDoc.value, {
    favorites: arrayUnion(loginUserUid.value),
  });
  await updateDoc(loginUserDoc.value, {
    favoritePosts: arrayUnion(postId),
  });
};
// いいね削除
const removeFavorite = async () => {
  await updateDoc(postDoc.value, {
    favorites: arrayRemove(loginUserUid.value),
  });
  await updateDoc(loginUserDoc.value, {
    favoritePosts: arrayRemove(postId),
  });
};
// いいねボタンを押した時にbooleanを反転させる
const onClickAddFavorite = () => {
  favorite.value = !favorite.value;
};
const onClickRemoveFavorite = () => {
  favorite.value = !favorite.value;
};

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

// 削除ボタン
const deleteButton = async (e: any) => {
  //postsから削除
  await deleteDoc(doc(db, "posts", postId));

  // storageから削除
  console.log(e);
  // const file = e.target.files[0];→0がタイプエラー
  const gsReference = storageRef(
    storage,
    `${loginUserUid.value}/post/${postId}/postImg.png`
  );
  await deleteObject(gsReference);

  // ログインユーザーのusersのpostsから削除
  console.log(loginUserDoc.value);
  await updateDoc(loginUserDoc.value, {
    posts: arrayRemove(postId),
  });

  // この投稿のpostIdが含まれるusersのfavoritePostsから削除
  // favoritePostsにpostIdが含まれるusersを全件取得
  const favoriteCollectionRef: any = query(
    collection(db, "users"),
    where("favoritePosts", "array-contains", postId)
  );

  getDocs(favoriteCollectionRef).then((user: any) => {
    // data()の形で取得し、userListにpush
    const userList: any[] = [];
    user.forEach(async (data: any) => {
      userList.push(data.data());
    });
    userList.map(async (user) => {
      // 取得したusersデータの中からfavoritePosts,userIdを取得
      const favoriteArray = user.favoritePosts;
      const userId = user.userId;
      // favoritePostsからpostIdを削除(returnを書かないと全部削除されて空の配列が返ってくる)
      const deleteFavorite = favoriteArray.filter((id: any) => {
        return id !== postId;
      });
      // 対象usersのドキュメントを取得
      const favoriteRefId = doc(userCollection.value, userId);
      // 対象usersのfavoritePostsをpostIdを消した配列に更新
      await updateDoc(favoriteRefId, {
        favoritePosts: deleteFavorite,
      });
    });
  });

  // この投稿のpostIdが含まれるusersのkeepPostsから削除
  // keepPostsにpostIdが含まれるusersを全件取得
  const keepCollectionRef: any = query(
    collection(db, "users"),
    where("keepPosts", "array-contains", postId)
  );

  getDocs(keepCollectionRef).then((user: any) => {
    // data()の形で取得し、keepUserListにpush
    const keepUserList: any[] = [];
    user.forEach(async (data: any) => {
      keepUserList.push(data.data());
    });
    keepUserList.map(async (user) => {
      // 取得したusersデータの中からkeepPosts,userIdを取得
      const keepArray = user.keepPosts;
      const userId = user.userId;
      // keepPostsからpostIdを削除
      const deleteKeep = keepArray.filter((id: any) => {
        return id !== postId;
      });
      // 対象usersのドキュメントを取得
      const keepRefId = doc(userCollection.value, userId);
      // 対象usersのfavoritePostsをpostIdを消した配列に更新
      await updateDoc(keepRefId, {
        keepPosts: deleteKeep,
      });
    });
  });

  console.log("削除しました");
  // location.href = "/home";
};

// コメントアイコンボタン
const onClickComment = () => {
  const input = document.getElementById("inputComment");
  input?.focus();
};
</script>

<template>
  <!-- <Suspense> -->
  <!-- <template #default> -->
  <Header />
  <section class="post_wrapper">
    <section>
      <div class="post_postImg">
        <img v-bind:src="postData.imageUrl" alt="投稿写真" />
      </div>
    </section>
    <section class="post_content">
      <div class="post_title">
        <div class="post_profile" v-if="postData.userId === loginUserUid">
          <a href="/myAccountPage">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a href="/myAccountPage">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
        </div>
        <div class="post_profile" v-else>
          <a v-bind:href="`/accountPage/${postData.userId}`">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a v-bind:href="`/accountPage/${postData.userId}`">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
        </div>
        <div v-if="postData.userId === loginUserUid">
          <button @click="changeButton">編集</button>
          <button @click="deleteButton">削除</button>
        </div>
      </div>
      <div class="post_captionContent">
        <div class="post_caption" v-if="postData.userId === loginUserUid">
          <a href="/myAccountPage">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a href="/myAccountPage">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
          <div>{{ postData.caption }}</div>
        </div>
        <div class="post_caption" v-else>
          <a v-bind:href="`/accountPage/${postData.userId}`">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a v-bind:href="`/accountPage/${postData.userId}`">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
          <div>{{ postData.caption }}</div>
        </div>

        <div
          v-for="comment in commentData"
          v-bind:key="comment.id"
          class="post_caption"
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
            <p v-if="comment.userId === loginUserUid" class="post_commentName">
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
          <button @click="onClickRemoveFavorite" v-if="favorite">
            <font-awesome-icon
              :icon="['fas', 'heart']"
              class="post_heart post_redHeart"
            />
          </button>
          <button @click="onClickAddFavorite" v-else>
            <font-awesome-icon :icon="['far', 'heart']" class="post_heart" />
          </button>
          <button @click="onClickComment">
            <font-awesome-icon
              :icon="['far', 'comment']"
              class="post_comment"
            />
          </button>
        </div>
        <button>
          <font-awesome-icon
            :icon="['far', 'bookmark']"
            class="post_bookmark"
          />
        </button>
      </div>
      <div class="post_favorite">
        いいね
        <span class="post_favoriteLength">{{ postFavoriteLength }} </span>
        件
      </div>
      <div class="post_date">
        {{ dateToDate.month }}月 {{ dateToDate.date }}, {{ dateToDate.year }}
      </div>
      <div class="post_addCommentContent">
        <input
          type="text"
          v-model="inputComment"
          class="post_input"
          placeholder="コメントを追加..."
          id="inputComment"
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
  <!-- </template> -->
  <!-- <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </Suspense> -->
</template>

<style scoped>
.post_wrapper {
  display: flex;
  height: 550px;
  width: 1050px;
  margin-left: 330px;
  margin-top: 80px;
  background-color: #ffff;
  overflow: hidden;
}
.post_postImg {
  height: 550px;
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
}
.post_userName {
  font-weight: bold;
}
.post_captionContent {
  overflow-y: scroll;
  overflow-x: none;
  height: 380px;
  border-bottom: 1px solid lightgray;
}
.post_caption {
  display: flex;
  align-items: center;
  gap: 5%;
  margin-top: 3%;
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
  position: relative;
  border-top: 1px solid lightgray;
  margin-top: 2%;
}
.post_input {
  border: none;
  width: 100%;
  height: 40px;
}
.post_commentBtn {
  position: absolute;
  top: 25%;
  left: 85%;
  font-weight: bold;
  color: #67b6fa;
}
.post_focusCommentBtn {
  position: absolute;
  top: 25%;
  left: 85%;
  font-weight: bold;
  color: #1596f7;
}
button {
  cursor: pointer;
}
</style>
