<script setup lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import {
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "vue-router";
import CommentButton from "@/components/atoms/button/CommentButton.vue";
import Comment from "../components/molecules/Comment.vue";
import AllComments from "../components/atoms/button/AllComments.vue";
import FavoriteButton from "@/components/atoms/button/FavoriteButton.vue";

type Post = {
  postId: string;
  userId: string;
  imageUrl: string;
  caption: string;
  timestamp: Date;
  favorites: string[];
  keeps: string[];
  comments: string[];
  icon: string;
  userName: string;
};
// type DocumentData = {
//   [field: string]: any;
// };

// ログインユーザーのuid
const loginUserUid: any = ref("");

// ログインユーザーデータ
const loginUser: any = ref("");

const loginUserDoc: any = ref("");

//mapで回す取得したpost全データ
const postList: any = ref([]);

const postDoc: any = ref();

//timestampの表記変更
const dateToDate = reactive({
  year: "",
  month: "",
  date: "",
  hour: "",
  min: "",
});

//ログイン認証、一覧で表示するデータ取得
onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    loginUserUid.value = currentUser.uid;
    //usersからログインユーザーの情報取得
    const userCollectionRef = collection(db, "users");

    const userDocRefId = doc(userCollectionRef, currentUser.uid);

    loginUserDoc.value = userDocRefId;

    // watchのために一度データ取得
    // watch(loginUser, () => {
    //   getDoc(userDocRefId).then((data) => {
    //     loginUser.value = data.data();
    //     console.log(data.data())
    //   });
    // });
    // getUserData();
    // いいね機能でデータ更新されるのを監視
    // watch(loginUser, getUserData);

    //自分とfollowしているユーザーのuserId配列
    const userList: any[] = [currentUser.uid];

    getDoc(userDocRefId).then((user) => {
      //data()の形で取得
      const userData = user.data();
      loginUser.value = userData;
      console.log(user.data());

      //followのみ取得し、上記配列に格納
      const follow = userData?.follow;
      follow.map((id: string) => userList.push(id));

      //もし上記getDocの外で以下記述した場合userIdがpushされる前に処理されてしまう
      // userIdが入っている配列をmapで回し、postsからuserIdと等しいデータを取得
      userList.map((userId) => {
        const postsCollectionRef = query(
          collection(db, "posts"),
          where("userId", "==", userId)
        );

        // const getPostData = () => {
        //data()の形で取得し、順番にpostListにpushする
        getDocs(postsCollectionRef).then((post: any) => {
          post.forEach((doc: any) => {
            postList.value.push(doc.data());

            //timestamp取得
            // const dataList = doc.data();
            // const timestamp = dataList?.timestamp.toDate();
            // dateToDate.year = timestamp.getFullYear();
            // dateToDate.month = timestamp.getMonth() + 1;
            // dateToDate.date = timestamp.getDate();
            // dateToDate.hour = timestamp.getHours();
            // dateToDate.min = timestamp.getMinutes();
          });
        });
        // };
        // getPostData();
        // watch(postList, getPostData);
        // console.log(postList.value);
      });
    });
  }
});
console.log(postList.value);

// 日付順に並び替え
// postList.value.sort((a: any, b: any) => {
//   return a.timestamp.toDate() > b.timestamp.toDate() ? -1 : 1;
// });

//コメント用
const postData: any = ref("");

// コレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, "nxvBjxNsshrRKcsXot7j");
postDoc.value = postDocRefId;

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
// console.log(postList.value);

// いいね機能
// const addFavorite = async () => {
//   await updateDoc(postDocRefId, {
//     favorites: arrayUnion(loginUser.value.userName),
//   });
//   await updateDoc(loginUserDoc.value, {
//     favoritePosts: arrayUnion(postId),
//   });
// };
// いいね削除
// const removeFavorite = async () => {
//   await updateDoc(postDocRefId, {
//     favorites: arrayRemove(loginUser.value.userName),
//   });
//   await updateDoc(loginUserDoc.value, {
//     favoritePosts: arrayRemove(postId),
//   });
// };
</script>

<template>
  <section v-if="postList.length > 0">
    <div class="wrapper" v-for="post in postList" v-bind:key="post.id">
      <div class="titleHeader">
        <a href="/profile">
          <img v-bind:src="post.icon" alt="icon" class="iconImg" />
        </a>
        <a href="/profile">
          <p>{{ post.userName }}</p>
        </a>
        <!-- <div>
        {{ dateToDate.month }}月 {{ dateToDate.date }}, {{ dateToDate.year }}
        {{ dateToDate.hour }}:{{ dateToDate.min }}
      </div> -->
      </div>

      <div class="postImg">
        <img v-bind:src="post.imageUrl" alt="投稿写真" />
      </div>

      <div>
        <FavoriteButton
          v-bind:postId="post.postId"
          v-bind:loginUserDoc="loginUserDoc"
          v-bind:loginUser="loginUser"
          v-bind:loginUserUid="loginUserUid"
        />
        <CommentButton v-bind:postId="post.postId" />
        <button>
          <button><font-awesome-icon :icon="['far', 'bookmark']" /></button>
        </button>
      </div>

      <div>
        <span class="favoriteLength">いいね{{ post.favorites.length }}件</span>
      </div>

      <div class="postContent">
        <a href="/profile">
          <p class="postUserName">{{ post.userName }}</p>
        </a>
        <div>{{ post.caption }}</div>
      </div>

      <AllComments v-bind:postId="post.postId" />

      <Comment v-bind:postId="post.postId" />
    </div>
  </section>
  <section v-else class="noPostSection">
    <div class="noPost">投稿がありません</div>
  </section>
</template>

<style scoped>
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
.noPost {
  font-weight: bold;
  font-size: 1.6rem;
  margin-top: 100px;
  margin-left: 100px;
}
</style>
