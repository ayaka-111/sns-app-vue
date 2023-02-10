<script setup lang="ts">
import { reactive, ref, watch } from "vue";
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
import { useRouter } from "vue-router";

// ログインユーザーのuid
const loginUserUid: any = ref("");

//mapで回す取得したpost全データ
const postList: any = ref([]);

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

    //自分とfollowしているユーザーのuserId配列
    const userList: any[] = [currentUser.uid];

    getDoc(userDocRefId).then((user) => {
      //data()の形で取得
      const userData = user.data();

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
      });
    });
  }
});

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
        <button>♡</button>
        <button>コメント</button>
        <button>🏷</button>
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
  </section>
  <section v-else>
    <div>投稿がありません</div>
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
