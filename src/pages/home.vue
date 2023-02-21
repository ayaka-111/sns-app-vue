<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "vue-router";
import CommentButton from "@/components/atoms/button/CommentButton.vue";
import Comment from "../components/molecules/Comment.vue";
import AllComments from "../components/atoms/button/AllComments.vue";
import FavoriteButton from "@/components/atoms/button/FavoriteButton.vue";
import Header from "../components/organisms/header.vue";
import Date from "../components/molecules/Date.vue";
import KeepBtn from "../components/atoms/button/keepBtn.vue";

// ログインユーザーのuid
const loginUserUid: any = ref("");

// ログインユーザーデータ
const loginUser: any = ref("");

const loginUserDoc: any = ref("");

//mapで回す取得したpost全データ
const postList: any = ref([]);

const loading = ref(true);

const router = useRouter();

onMounted(() => {
  //ログイン認証、一覧で表示するデータ取得
  onAuthStateChanged(auth, (currentUser: any) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      console.log(currentUser.uid);
      loginUserUid.value = currentUser.uid;
      //usersからログインユーザーの情報取得
      const userCollectionRef = collection(db, "users");

      const userDocRefId = doc(userCollectionRef, currentUser.uid);

      loginUserDoc.value = userDocRefId;

      loading.value = false;

      //自分とfollowしているユーザーのuserId配列
      const userList: any[] = [currentUser.uid];

      // watch([loginUser, postList], async () => {
      // const getData = async () => {
      getDoc(userDocRefId).then((user) => {
        //data()の形で取得
        const userData = user.data();
        loginUser.value = userData;

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
              // 日付順に並び替え
              postList.value.sort((a: any, b: any) => {
                return a.timestamp.toDate() > b.timestamp.toDate() ? -1 : 1;
              });
            });
          });
        });
      });
    }
  });
});

// ボタンクリックでbooleanを管理
const readMore = ref(true);
// 続きを読むボタン
const onRead = () => {
  // ボタンクリックでbooleanを反転
  readMore.value = !readMore.value;
  console.log(readMore.value);
  // 続きを読むボタンを取得
  const button = document.getElementsByClassName("home_captionReadMore");
  // ボタンにid(display:none;スタイリングがついている)を付与
  button[0].setAttribute("id", "home_captionId");
};
console.log(readMore.value);

console.log(postList.value);
</script>

<template>
  <Header />
  <section v-if="postList.length > 0" class="home">
    <div class="home_wrapper" v-for="post in postList" v-bind:key="post.id">
      <div class="home_titleHeader" v-if="post.userId === loginUserUid">
        <a href="/myAccountPage">
          <img v-bind:src="post.icon" alt="icon" class="home_iconImg" />
        </a>
        <a href="/myAccountPage">
          <p class="home_userName">{{ post.userName }}</p>
        </a>
        <Date v-bind:date="post.timestamp" />
      </div>
      <div class="home_titleHeader" v-else>
        <a v-bind:href="`/accountPage/${post.userId}`">
          <img v-bind:src="post.icon" alt="icon" class="home_iconImg" />
        </a>
        <a v-bind:href="`/accountPage/${post.userId}`">
          <p class="home_userName">{{ post.userName }}</p>
        </a>
        <Date v-bind:date="post.timestamp" />
      </div>

      <div class="home_postImg">
        <img v-bind:src="post.imageUrl" alt="投稿写真" />
      </div>

      <div class="home_buttons">
        <div class="home_favCom">
          <FavoriteButton
            v-bind:postId="post.postId"
            v-bind:loginUserDoc="loginUserDoc"
            v-bind:loginUser="loginUser"
            v-bind:loginUserUid="loginUserUid"
          />

          <CommentButton v-bind:postId="post.postId" />
        </div>
        <KeepBtn v-bind:postId="post.postId" />
      </div>

      <div class="home_postContent">
        <p class="home_postUserName" v-if="post.userId === loginUserUid">
          <a href="/myAccountPage">{{ post.userName }}</a>
        </p>
        <p class="home_postUserName" v-else>
          <a v-bind:href="`/accountPage/${post.userId}`">{{ post.userName }}</a>
        </p>
        <div class="home_caption">
          <p class="home_captionHidden" id="home_captionRemove" v-if="readMore">
            {{ post.caption }}
          </p>
          <p v-else>{{ post.caption }}</p>
          <button
            @click="onRead"
            class="home_captionReadMore"
            v-if="post.caption.length > 30"
          >
            続きを読む
          </button>
        </div>
      </div>

      <AllComments v-bind:postId="post.postId" />

      <Comment v-bind:postId="post.postId" v-bind:loginUser="loginUser" />
    </div>
  </section>
  <section v-else class="home_noPostSection">
    <div class="home_noPost">投稿がありません</div>
  </section>
</template>

<style scoped>
.home {
  padding-left: 500px;
  background-color: #ffff;
}
.home_wrapper {
  border-bottom: 1px solid lightgray;
  width: 500px;
}
.home_titleHeader {
  display: flex;
  gap: 5%;
  align-items: center;
  height: 60px;
}
.home_iconImg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.home_userName {
  font-weight: bold;
}
.home_caption {
  white-space: normal;
  width: 410px;
  word-wrap: break-word;
}
.home_captionHidden {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.home_captionReadMore {
  color: #757575;
}
#home_captionId {
  display: none;
}
.home_smallIconImg {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.home_postImg {
  width: 500px;
  height: 500px;
}
.home_postImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.home_buttons {
  display: flex;
  justify-content: space-between;
  margin: 2% 0;
  align-items: flex-start;
}
.home_favCom {
  display: flex;
  align-items: flex-start;
  gap: 5%;
}

.home_favoriteLength {
  font-weight: bold;
}
.home_postContent {
  display: flex;
  gap: 3%;
}
.home_postUserName {
  font-weight: bold;
}
.home_commentLink {
  color: #757575;
}
.home_noPostSection {
  overflow: hidden;
}
.home_noPost {
  font-weight: bold;
  font-size: 1.6rem;
  margin-top: 100px;
  margin-left: 50%;
}
button {
  cursor: pointer;
}
</style>
