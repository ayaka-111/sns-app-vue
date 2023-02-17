<script setup lang="ts">
import { auth, db } from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { watch, onMounted, ref as vueref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onAuthStateChanged } from "@firebase/auth";
import UserPostsList from "../components/organisms/UserPostsList.vue";

//postIdを受け取る
const route = useRoute();
const userId: any = route.params.userId;

const router = useRouter();


// userIdを渡す
const userIdPush = () => {
  // const postId = "nxvBjxNsshrRKcsXot7j";
  router.push({ path: `/dmPage/${userId}` });
};

const anotherUserData: any = vueref();
const currentUserId: any = vueref();
const isLoading: any = vueref(true);
const isFollowing: any = vueref(false);
const isUnFollowing: any = vueref(false);
const numberOfFollower: any = vueref(0);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      const userDocRef: any = doc(db, "users", userId);
      getDoc(userDocRef).then((userDocData) => {
        const userData: any = userDocData.data();
        anotherUserData.value = userData;
        numberOfFollower.value = anotherUserData.value.follower.length;
        if (anotherUserData.value.follower.includes(currentUser.uid)) {
          isFollowing.value = true;
        } else {
          isUnFollowing.value = true;
        }
      });
    }
  });
});

// isLoadingを監視して変更があった際にデータ操作とfollower配列取得処理を行う
watch(isFollowing, () => {
  if (isFollowing.value) {
    addFollowFunc().then(() => {
      const userDocRef: any = doc(db, "users", userId);
      getDoc(userDocRef).then((userDocData) => {
        const userData: any = userDocData.data();
        anotherUserData.value = userData;
        numberOfFollower.value = anotherUserData.value.follower.length;
      });
    });
  } else {
    unFollowFunc().then(() => {
      const userDocRef: any = doc(db, "users", userId);
      getDoc(userDocRef).then((userDocData) => {
        const userData: any = userDocData.data();
        anotherUserData.value = userData;
        numberOfFollower.value = anotherUserData.value.follower.length;
      });
    });
  }
});

// フォローするデータ処理
const addFollowFunc = async () => {
  const currentUserRef = doc(db, "users", currentUserId.value);
  await updateDoc(currentUserRef, {
    follow: arrayUnion(userId),
  });
  const anotherUserRef = doc(db, "users", userId);
  await updateDoc(anotherUserRef, {
    follower: arrayUnion(currentUserId.value),
  });
};

// フォロー解除するデータ処理
const unFollowFunc = async () => {
  const currentUserRef = doc(db, "users", currentUserId.value);
  await updateDoc(currentUserRef, {
    follow: arrayRemove(userId),
  });
  const anotherUserRef = doc(db, "users", userId);
  await updateDoc(anotherUserRef, {
    follower: arrayRemove(currentUserId.value),
  });
};

// フォローするボタン押した時の処理
const onClickAddFollow = () => {
  isFollowing.value = !isFollowing.value;
};

// フォロー解除ボタンを押した時の処理
const onClickUnFollow = () => {
  isFollowing.value = !isFollowing.value;
};
</script>

<template>
  <div v-if="!isLoading">
    <div class="user_info">
      <div class="user_icon">
        <img v-bind:src="anotherUserData.icon" alt="ユーザーアイコン" />
      </div>
      <div class="user_detail">
        <p>{{ anotherUserData.userName }}</p>

        <button v-if="isFollowing" @click="onClickUnFollow">フォロー中</button>
        <button v-else @click="onClickAddFollow">フォローする</button>
        <button>メッセージを送信</button>
        <p>投稿{{ anotherUserData.posts.length }}件</p>
        <p>フォロワー{{ numberOfFollower }}人</p>
        <p>フォロー中{{ anotherUserData.follow.length }}人</p>
        <p>{{ anotherUserData.name }}</p>
        <p>{{ anotherUserData.profile }}</p>
      </div>
    </div>
    <div class="posts">
      <UserPostsList v-bind:userId="userId" />
    </div>
  </div>
  <p v-else>loading...</p>
</template>

<style scoped>
.user_info {
  width: 100%;
  display: flex;
}
.user_icon {
  border-radius: 50%;
  width: 10%;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
