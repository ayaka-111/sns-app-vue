<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import {
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRoute, useRouter } from "vue-router";

//postIdを受け取る
const route = useRoute();
const postId: any = route.params.postId;

//編集ボタン
const router = useRouter();
const changeButton = () => {
  // const postId = "nxvBjxNsshrRKcsXot7j";
  router.push({ path: `/postChange/${postId}` });
};

// ログインユーザーのuid
const loginUserUid = ref("");

// ユーザーコレクション
const userCollection: any = ref("");
// ログインユーザーのドキュメント
const loginUserDoc: any = ref("");
//postデータ
const postData: any = ref("");

//timestampの表記変更
const dateToDate = reactive({
  year: "",
  month: "",
  date: "",
  hour: "",
  min: "",
});

//ログイン認証、uid取得
onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    loginUserUid.value = currentUser.uid;

    const loginUserCollectionRef = collection(db, "users");
    userCollection.value = loginUserCollectionRef;
    const loginUserDocRefId = doc(loginUserCollectionRef, currentUser.uid);
    loginUserDoc.value = loginUserDocRefId;
  }
});
console.log(loginUserUid);

// postsコレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, postId);

// //上記を元にドキュメントのデータを取得
getDoc(postDocRefId).then((data) => {
  postData.value = data.data();

  //timestamp取得
  const dataList = data.data();
  const timestamp = dataList?.timestamp.toDate();
  dateToDate.year = timestamp.getFullYear();
  dateToDate.month = timestamp.getMonth() + 1;
  dateToDate.date = timestamp.getDate();
  dateToDate.hour = timestamp.getHours();
  dateToDate.min = timestamp.getMinutes();
});

//コメント機能(postsのcommentsに追加)
const inputComment = ref("");

const addComment = async () => {
  await updateDoc(postDocRefId, {
    comments: arrayUnion({
      // id: +1,
      userName: postData.value.userName,
      icon: postData.value.icon,
      comment: inputComment.value,
      // timestamp: serverTimestamp(),
    }),
  });
  inputComment.value = "";
};

// 削除ボタン
const deleteButton = async (e: any) => {
  //postsから削除
  await deleteDoc(doc(db, "posts", postId));

  // storageから削除→0がタイプエラー
  console.log(e)
  // const file = e.target.files[0];
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
</script>

<template>
  <!-- <Suspense> -->
  <!-- <template #default> -->
  <section class="post_wrapper">
    <section>
      <div>
        <img v-bind:src="postData.imageUrl" alt="投稿写真" />
      </div>
    </section>
    <section class="post_content">
      <div class="post_title">
        <div class="post_profile">
          <a href="/profile">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a href="/profile">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
        </div>
        <div v-if="postData.userId === loginUserUid">
          <button @click="changeButton">編集</button>
          <button @click="deleteButton">削除</button>
        </div>
      </div>
      <div class="post_captionContent">
        <div class="post_caption">
          <a href="/profile">
            <img v-bind:src="postData.icon" alt="icon" class="post_iconImg" />
          </a>
          <a href="/profile">
            <p class="post_userName">{{ postData.userName }}</p>
          </a>
          <div>{{ postData.caption }}</div>
          <!-- <div>{{ loginUserDoc }}</div> -->
        </div>

        <div
          v-for="commentData in postData.comments"
          v-bind:key="commentData.id"
          class="post_caption"
        >
          <div>
            <img
              v-bind:src="commentData.icon"
              alt="iconImg"
              class="post_iconImg"
            />
          </div>
          <div>
            <p>{{ commentData.userName }}</p>
            <p>{{ commentData.comment }}</p>
          </div>
        </div>
      </div>
      <div>
        <button>♡</button>
        <button>📝</button>
        <button>🏷</button>
      </div>
      <div>
        <span class="post_favoriteLength"
          >いいね{{ postData.favorites.length }}件</span
        >
      </div>
      <div>
        {{ dateToDate.month }}月 {{ dateToDate.date }}, {{ dateToDate.year }}
      </div>
      <div>
        <input type="text" v-model="inputComment" />
        <button @click="addComment">投稿する</button>
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

<style>
.post_wrapper {
  display: flex;
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
  gap: 5%;
  width: 200px;
}
.post_iconImg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.post_userName {
  font-weight: bold;
}
.post_captionContent {
  overflow-y: hidden;
  overflow-x: none;
}
.post_caption {
  display: flex;
  align-items: center;
  gap: 5%;
}
.post_favoriteLength {
  font-weight: bold;
}
</style>
