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
import Header from "../components/organisms/header.vue";
import type { Ref } from "vue";
import type { Router } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { DocumentData, DocumentReference } from "firebase/firestore";

//postIdを受け取る
const route: RouteLocationNormalizedLoaded = useRoute();
const userId: any = route.params.userId;
const router: Router = useRouter();

// userIdを渡す
const userIdPush: () => void = () => {
  router.push({ path: `/dmPage/${userId}` });
};

const anotherUserData: Ref<any> = vueref();
const currentUserId: Ref<string> = vueref("");
const isLoading: Ref<boolean> = vueref(true);
const isFollowing: Ref<boolean> = vueref(false);
const numberOfFollower: Ref<number | unknown> = vueref(0);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      const userDocRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId
      );
      getDoc(userDocRef).then((userDocData) => {
        const userData: DocumentData | undefined = userDocData.data();
        anotherUserData.value = userData;
        numberOfFollower.value = anotherUserData.value.follower.length;
        if (anotherUserData.value.follower.includes(currentUser.uid)) {
          isFollowing.value = true;
        }
      });
    }
  });
});

// isLoadingを監視して変更があった際にデータ操作とfollower配列取得処理を行う
watch(isFollowing, () => {
  if (isFollowing.value) {
    addFollowFunc().then(() => {
      const userDocRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId
      );
      getDoc(userDocRef).then((userDocData) => {
        const userData: DocumentData | undefined = userDocData.data();
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
const addFollowFunc: () => Promise<void> = async () => {
  const currentUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    currentUserId.value
  );
  await updateDoc(currentUserRef, {
    follow: arrayUnion(userId),
  });
  const anotherUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    userId
  );
  await updateDoc(anotherUserRef, {
    follower: arrayUnion(currentUserId.value),
  });
};

// フォロー解除するデータ処理
const unFollowFunc: () => Promise<void> = async () => {
  const currentUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    currentUserId.value
  );
  await updateDoc(currentUserRef, {
    follow: arrayRemove(userId),
  });
  const anotherUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    userId
  );
  await updateDoc(anotherUserRef, {
    follower: arrayRemove(currentUserId.value),
  });
};

// フォローするボタン押した時の処理
const onClickAddFollow: () => void = () => {
  isFollowing.value = !isFollowing.value;
};

// フォロー解除ボタンを押した時の処理
const onClickUnFollow: () => void = () => {
  isFollowing.value = !isFollowing.value;
};
</script>

<template>
  <Header />
  <div class="header_area">
    <div v-if="!isLoading" class="accountPage_wrapper">
      <div class="user_info flex">
        <div class="user_info_left">
          <div class="user_icon">
            <img v-bind:src="anotherUserData.icon" alt="ユーザーアイコン" />
          </div>
        </div>
        <div class="user_info_right">
          <div>
            <div class="flex first_line">
              <p class="user_name">{{ anotherUserData.userName }}</p>
              <button
                v-if="isFollowing"
                @click="onClickUnFollow"
                class="follow_btn"
              >
                フォロー中
              </button>
              <button v-else @click="onClickAddFollow" class="un_follow_btn">
                フォローする
              </button>
              <button @click="userIdPush" class="dm_btn">
                メッセージを送信
              </button>
            </div>
            <div class="flex">
              <p class="three_amount">
                投稿<span class="amount">{{
                  anotherUserData.posts.length
                }}</span
                >件
              </p>
              <a v-bind:href="`/followerList/${userId}`">
                <p class="three_amount">
                  フォロワー<span class="amount">{{ numberOfFollower }}</span
                  >人
                </p>
              </a>
              <a v-bind:href="`/followList/${userId}`">
                <p class="three_amount">
                  フォロー中<span class="amount">{{
                    anotherUserData.follow.length
                  }}</span
                  >人
                </p>
              </a>
            </div>
            <p class="name">{{ anotherUserData.name }}</p>
            <p>{{ anotherUserData.profile }}</p>
          </div>
        </div>
      </div>
      <div>
        <UserPostsList v-bind:userId="userId" />
      </div>
    </div>
    <p v-else class="loading_text">loading...</p>
  </div>
</template>

<style scoped>
.header_area {
  margin-left: 250px;
}
.accountPage_wrapper {
  width: 80%;
  margin: 0 auto;
  padding: 50px;
}
.user_info {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 30px;
}
.flex {
  display: flex;
}
.user_info_left {
  width: 30%;
}
.user_icon {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
  margin: auto;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user_info_right {
  width: 70%;
}
.first_line {
  margin-bottom: 20px;
}
.user_name {
  font-size: 17px;
  font-weight: bold;
}
.dm_btn,
.follow_btn {
  background: #efefef;
  border-radius: 7px;
  font-weight: bold;
  padding: 2px 15px;
  margin-left: 30px;
}
.un_follow_btn {
  background: #1596f7;
  border-radius: 7px;
  font-weight: bold;
  padding: 2px 15px;
  margin-left: 30px;
  color: #fff;
}
.follow_btn:hover,
.dm_btn:hover,
.un_follow_btn:hover {
  cursor: pointer;
}
.three_amount {
  margin-right: 20px;
  font-size: 15px;
}
.amount {
  font-weight: bold;
}
.name {
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
}
.loading_text {
  text-align: center;
  margin-top: 200px;
  font-size: 16px;
  font-weight: bold;
}
</style>
