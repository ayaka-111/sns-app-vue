<script setup lang="ts">
import { ref, watch } from "vue";
import {
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "@firebase/auth";

// ログインユーザーのuid
const loginUser = ref("");
//postデータ
const postData: any = ref("");

onAuthStateChanged(auth, (currentUser: any) => {
  if (currentUser) {
    loginUser.value = currentUser.uid;
  }
});
console.log(loginUser);

// //コレクションへの参照を取得
const postCollectionRef = collection(db, "posts");

// //上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
const postDocRefId = doc(postCollectionRef, "nxvBjxNsshrRKcsXot7j");

// //上記を元にドキュメントのデータを取得
getDoc(postDocRefId).then((data) => {
  postData.value = data.data();
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
    }),
  });
  inputComment.value = "";
};
</script>

<template>
  <!-- <Suspense> -->
  <!-- <template #default> -->
  <section>
    <div>
      <img v-bind:src="postData.imageUrl" alt="投稿写真" />
    </div>
  </section>
  <section>
    <div>
      <a href="/profile">
        <img v-bind:src="postData.icon" alt="icon" class="iconImg" />
      </a>
      <a href="/profile">
        <p>{{ postData.userName }}</p>
      </a>
    </div>
    <div>
      <a href="/profile">
        <img v-bind:src="postData.icon" alt="icon" class="iconImg" />
      </a>
      <a href="/profile">
        <p>{{ postData.userName }}</p>
      </a>
      <div>{{ postData.caption }}</div>

      <div v-for="commentData in postData.comments" v-bind:key="commentData.id">
        <div>
          <img v-bind:src="commentData.icon" alt="iconImg" class="iconImg" />
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
      <span class="favoriteLength">{{ postData.favorites.length }}人</span>が「いいね!」しました
    </div>
    <div>
      <input type="text" v-model="inputComment" />
      <button @click="addComment">投稿する</button>
    </div>
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
.iconImg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.favoriteLength {
  font-weight: bold;
}
</style>
