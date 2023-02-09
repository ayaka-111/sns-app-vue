<script setup lang="ts">
import { ref, watch } from "vue";
import {
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";

// ログインユーザーのuid
const loginUserUid: any = ref("");

onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    loginUserUid.value = currentUser.uid;
  }
});

//usersからログインユーザーの情報取得
const loginUser: any = ref("");

const userCollectionRef = collection(db, "users");

const userDocRefId = doc(userCollectionRef, "n3TDdidXCSRKEOVUUUudXGVhP9y2");

const userList = ref(["n3TDdidXCSRKEOVUUUudXGVhP9y2"]);

const postData: any = ref([]);


getDoc(userDocRefId).then((data) => {
  // loginUser.value = data.data();
  const userData = data.data();
  const follow = userData?.follow;
  // const userList = ["n3TDdidXCSRKEOVUUUudXGVhP9y2"];
  follow.map((id: string) => userList.value.push(id));
  // console.log(userList);
})

//ログインユーザーとフォローしているユーザーのuserIdのみ格納

// loginUser.value.follow.map((userId: string) => {
//   userList.value.push(userId);
// });

// loginUserFollow.value.map((userId: string) => {
//   userList.value.push(userId);
// });

//自分とfollowしているユーザーのpostデータ取得
// const postData: any = ref([]);
// console.log(postData.value)

// getDoc(userDocRefId).then((data) => {
//   // loginUser.value = data.data();
//   const userData = data.data();
//   const follow = userData?.follow;
//   const userList = ["n3TDdidXCSRKEOVUUUudXGVhP9y2"];
//   follow.map((id: string) => userList.push(id));
//   console.log(userList);

  userList.value.map((userId) => {
    const postsCollectionRef = query(
      collection(db, "posts"),
      where("userId", "==", userId)
    );

    console.log(postData.value);
    getDocs(postsCollectionRef).then((d: any) => {
      d.forEach((doc: any) => {
        console.log(doc.data());

        postData.value.push(doc.data());
      });
    });
  });
// });

//以下コメント用
// コレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, "nxvBjxNsshrRKcsXot7j");

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
    }),
  });
  inputComment.value = "";
};
</script>

<template>
  <div class="wrapper" v-for="post in postData" v-bind:key="post.id">
    <div class="titleHeader">
      <a href="/profile">
        <img v-bind:src="post.icon" alt="icon" class="iconImg" />
      </a>
      <a href="/profile">
        <p>{{ post.userName }}</p>
      </a>
    </div>

    <div class="postImg">
      <img v-bind:src="post.imageUrl" alt="投稿写真" />
    </div>

    <div>
      <button>♡</button>
      <button>📝</button>
      <button>🏷</button>
    </div>

    <div>{{ loginUser }}</div>
    <!-- <div>{{ loginUser.follow }}</div> -->

    <div>
      <span class="favoriteLength">いいね{{ post.favorites.length }}件</span>
    </div>

    <div class="postContent">
      <a href="/profile">
        <p class="postUserName">{{ post.userName }}</p>
      </a>
      <div>{{ post.caption }}</div>
    </div>

    <div>
      <!-- あとでモーダルが開くようにする -->
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
  </div>
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
