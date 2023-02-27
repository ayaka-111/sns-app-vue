<script setup lang="ts">
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { createApp, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { db } from "../../firebase";
import Header from "../components/organisms/header.vue";

//userIdを受け取る
const route = useRoute();
const userId: any = route.params.userId;

console.log(userId);

const newMessage: any = ref("");
const newMessageList: any = ref([]);
const messageList: any = ref([]);
const uid: any = ref("");
const withUserData: any = ref("");
const withUserName: any = ref("");
const withUserIcon: any = ref("");

const now = new Date();
const nowStr = now.toLocaleTimeString();
const timeStrRef = ref(nowStr);

// 会話相手の情報を取得
const userCollectionRef = collection(db, "users");
const userDocRefId = doc(userCollectionRef, userId);
console.log(userDocRefId);
getDoc(userDocRefId).then((data) => {
  withUserData.value = data.data();
  withUserIcon.value = withUserData.value.icon;
  withUserName.value = withUserData.value.name;
});

// ログイン判定
const auth = getAuth();
const currentUserId = auth.currentUser?.uid;
uid.value = auth.currentUser?.uid;
const loginUserId = auth.currentUser?.uid;
//   const userId:any=ref(currentUserId)
console.log(currentUserId);
//   console.log(userId)

onAuthStateChanged(auth, (currentUser: any) => {
  // const currentUserId = currentUser?.uid;

  // ログインユーザーのデータ取得
  const ownQ = query(
    collection(db, "messages"),
    //   ログインユーザーのID
    where("userId", "==", currentUser?.uid),
    where("withUserId", "==", userId)
    //   limit(5)
  );
  // const ownQSnapshot = await getDocs(ownQ);
  getDocs(ownQ).then((ownQSnapshot) => {
    // console.log(ownQSnapshot)
    ownQSnapshot.forEach((docdata) => {
      const data = (docdata.id, " => ", docdata.data());
      messageList.value.push({
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp,
        hour: data.timestamp.toDate().getHours().toString().padStart(2, "0"),
        min: data.timestamp.toDate().getMinutes().toString().padStart(2, "0"),
        withUserId: data.withUserId,
      });
      // 日付順に並び替え
      messageList.value.sort((a: any, b: any) => {
        return a.timestamp.toDate() < b.timestamp.toDate() ? -1 : 1;
      });
    });
  });

  // 会話相手の情報取得(メッセージ表示のため)
  const anotherQ = query(
    collection(db, "messages"),
    where("userId", "==", userId),
    //   ログインユーザーのID
    where("withUserId", "==", currentUser?.uid)
    // limit(5)
  );
  getDocs(anotherQ).then((ownQSnapshot) => {
    ownQSnapshot.forEach((docdata) => {
      const data = (docdata.id, " => ", docdata.data());
      messageList.value.push({
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp,
        hour: data.timestamp.toDate().getHours().toString().padStart(2, "0"),
        min: data.timestamp.toDate().getMinutes().toString().padStart(2, "0"),
        withUserId: data.withUserId,
      });
      // 日付順に並び替え
      messageList.value.sort((a: any, b: any) => {
        return a.timestamp.toDate() < b.timestamp.toDate() ? -1 : 1;
      });
    });
  });
});

// inputに入力したものをfirebaseに追加
const addNewMessage = () => {
  // firestoreにデータ追加
  addDoc(collection(db, "messages"), {
    userId: uid.value,
    message: newMessage.value,
    timestamp: serverTimestamp(),
    withUserId: userId,
  }).then(() => {
    console.log("a");
  });

  // newMessageList.value.push({ message: newMessage.value })

  // inputのところ空にする
  newMessage.value = "";
};

console.log(typeof messageList.value);
console.log(messageList.value);

// messageList.value.timestamp.sort(function(a:any, b:any){
// 	return (a < b ? 1 : -1);
// });

// messageList.value.sort((a: any, b: any) => {
//     return a.messageList.times > b.messageList.times ? -1 : 1;
//   });
</script>

<template>
  <Header />
  <div class="dmPage-header250">
    <div class="dmPage-auto">
      <div class="dmPage-50">
        <div class="dmPage-withUser">
          <img
            v-bind:src="withUserIcon"
            alt="withUserIcon"
            class="dmPage-withUserIcon"
          />
          <!-- <img src="../../public/noIcon.png" class="img"/> -->
          <p class="dmPage-withUserName">{{ withUserName }}</p>
        </div>

        <div class="dmPage-message">
          <ul>
            <li v-for="mess in messageList" :key="mess.userId">
              <div v-if="userId === mess.userId">
                <p class="dmPage-withUserMess">{{ mess.message }}</p>
                <p class="dmPage-withUserTime">
                  {{ mess.hour }}:{{ mess.min }}
                </p>
              </div>

              <div v-if="userId === mess.withUserId">
                <p class="dmPage-Mymess">{{ mess.message }}</p>
                <p class="dmPage-Mytime">{{ mess.hour }}:{{ mess.min }}</p>
              </div>
            </li>
          </ul>

          <ul>
            <li v-for="newMess in newMessageList" :key="newMess.userId">
              <p class="dmPage-Mymess">{{ newMess.message }}</p>
              <p class="dmPage-Mytime">{{ timeStrRef }}</p>
            </li>
          </ul>
        </div>

        <form @submit.prevent="addNewMessage" class="dmPage-form">
          <div class="inputButton">
            <input
              class="input"
              v-model="newMessage"
              placeholder="メッセージを入力..."
            />
            <button class="button">送信</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
.dmPage-header25 {
  margin-left: 259px;
}
.dmPage-auto {
  margin: auto;
  width: 800px;
}
.dmPage-50 {
  border: solid 1px silver;
  background-color: white;
  width: 100%;
  margin-left: 10%;
  margin-top: 5%;
  margin-bottom: 5%;
  /* height:600px; */
}
.dmPage-withUser {
  display: flex;
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
}
.dmPage-withUserIcon {
  /* background-color: #c0c0c0; */
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.dmPage-withUserName {
  display: grid;
  place-items: center;
  margin-left: 10px;
  /* font-weight: bold; */
}

.dmPage-withUserMess {
  background-color: #e0dddd;
  /* margin: 10px 10px 10px 10px; */
  border: 1px solid #afadad;
  border-radius: 10px;
  padding: 10px;
  width: 40%;
  /* margin-right:200px; */
}
.dmPage-withUserTime {
  display: block;
  padding-right: 10px;
  text-align: right;
  width: 40%;
  /* margin-right:200px; */
}
.dmPage-Mymess {
  background-color: #e0dddd;
  border: 1px solid #afadad;
  border-radius: 10px;
  padding: 10px;
  width: 40%;
  margin-left: auto;
  margin-right: 10%;
}
.dmPage-Mytime {
  display: block;
  padding-right: 10px;
  text-align: right;
  margin-left: auto;
  margin-right: 10%;
}

.dmPage-form {
  margin: auto;
  display: flex;
}
.inputButton {
  text-align: center;
  width: 100%;
}

.input {
  width: 85%;
  margin-bottom: 20px;
  margin-top: 30px;
}

.button {
  color: #1596f7;
}
</style>
