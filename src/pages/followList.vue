<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { onMounted, ref as vueref } from "vue";
import { auth, db } from "../../firebase";
import { useRoute, useRouter } from "vue-router";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
// import { watch } from "fs";

const route = useRoute();
const userId: any = route.params.userId;
const router = useRouter();
const anotherUserData: any = vueref([]);
const currentUserId: any = vueref();
const isLoading: any = vueref(true);
const followUserArr: any = vueref();
const isUnFollowing: any = vueref(false);
const numberOfFollower: any = vueref(0);
const isFollowing: any = vueref(false);

let followUserIds: any[] = [];
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      currentUserId.value = currentUser.uid;
      isLoading.value = false;
      const userDocRef: any = doc(db, "users", userId);
      getDoc(userDocRef)
        .then((userDocData) => {
          const userData: any = userDocData.data();
          followUserIds = userData.follow;
          console.log(followUserIds);
        })
        .then(() => {
          followUserIds.forEach((followUserId) => {
            const followUserDocRef: any = doc(db, "users", followUserId);
            getDoc(followUserDocRef).then((userDocData) => {
              const userData: any = userDocData.data();
              anotherUserData.value.push(userData);
              console.log(anotherUserData);
            });
          });
        });
    }
  });
});
// // フォローするデータ処理
// const addFollowFunc = async () => {
//   const currentUserRef = doc(db, "users", currentUserId.value);
//   await updateDoc(currentUserRef, {
//     follow: arrayUnion(userId),
//   });
//   const anotherUserRef = doc(db, "users", userId);
//   await updateDoc(anotherUserRef, {
//     follower: arrayUnion(currentUserId.value),
//   });
// };

// // フォロー解除するデータ処理
// const unFollowFunc = async () => {
//   const currentUserRef = doc(db, "users", currentUserId.value);
//   await updateDoc(currentUserRef, {
//     follow: arrayRemove(userId),
//   });
//   const anotherUserRef = doc(db, "users", userId);
//   await updateDoc(anotherUserRef, {
//     follower: arrayRemove(currentUserId.value),
//   });
// };

// watch(isFollowing, () => {
//   if (isFollowing.value) {
//     addFollowFunc().then(() => {
//       const userDocRef: any = doc(db, "users", userId);
//       getDoc(userDocRef).then((userDocData) => {
//         const userData: any = userDocData.data();
//         anotherUserData.value = userData;
//       });
//     });
//   } else {
//     unFollowFunc().then(() => {
//       const userDocRef: any = doc(db, "users", userId);
//       getDoc(userDocRef).then((userDocData) => {
//         const userData: any = userDocData.data();
//         anotherUserData.value = userData;
//       });
//     });
//   }
// });

// // フォローするボタンを押した時の処理
// const onClickAddFollow = () => {
//   isFollowing.value = !isFollowing.value;
// };

// // フォロー解除ボタンを押した時の処理
// const onClickUnFollow = () => {
//   isFollowing.value = !isFollowing.value;
// };
</script>
<template>
  <div class="follow_wrapper">
    <p class="title">フォロー中</p>
    <div v-if="!isLoading">
      <div v-if="anotherUserData.value !== []">
        <ol>
          <div v-for="(anotherUser, index) in anotherUserData" :key="index">
            <li
              class="user_data"
              v-if="anotherUser.value == currentUserId.value"
            >
              <a href="/myAccountPage">
                <div class="user_icon">
                  <img v-bind:src="anotherUser.icon" alt="ユーザーアイコン" />
                </div>
              </a>
              <a href="/myAccountPage">
                <div class="user_text_data">
                  <p class="user_name">{{ anotherUser.userName }}</p>
                  <p class="name">{{ anotherUser.name }}</p>
                </div>
              </a>
            </li>
            <li class="user_data" v-else>
              <a v-bind:href="`/accountPage/${anotherUser.userId}`">
                <div class="user_icon">
                  <img v-bind:src="anotherUser.icon" alt="ユーザーアイコン" />
                </div>
              </a>
              <a v-bind:href="`/accountPage/${anotherUser.userId}`">
                <div class="user_text_data">
                  <p class="user_name">{{ anotherUser.userName }}</p>
                  <p class="name">{{ anotherUser.name }}</p>
                </div>
              </a>
            </li>
            <!-- <button v-if="isFollowing" @click="onClickUnFollow" class="follow_btn">
        フォロー中
      </button>
      <button v-else @click="onClickAddFollow" class="un_follow_btn">
        フォローする
      </button> -->
          </div>
        </ol>
      </div>
      <div v-else>
        <p class="no_follow">フォローしているユーザーはいません</p>
        <div class="lets_follow">
          <a href="/searchPage">Let's follow！</a>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="loading">Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 30px 0;
}
.follow_wrapper {
  width: 500px;
  margin: auto;
}
.user_data {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

.user_name {
  font-weight: bold;
}
.name {
  color: #8e8e8e;
}
.user_icon {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
  margin-right: 10px;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user_text_data {
  margin: auto 0;
}
.loading,
.no_follow {
  font-size: 16px;
  text-align: center;
  margin-top: 100px;
}
.lets_follow {
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}
.lets_follow > a:hover {
  opacity: 0.6;
}

</style>
