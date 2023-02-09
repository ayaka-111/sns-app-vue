<script setup lang="ts">
// import { ref } from 'vue'
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
//   limit,
// } from "firebase/firestore";
// import { db } from "../../firebase"

// give each todo a unique id
// let id = 0

// const newMessage = ref('')
// const messages = ref([
// ])
// const MessageList = ref([{ userId: "id", message: "message", timestamp: "data" }])

// function removeTodo(massage:any) {
//     massages.value = massages.value.filter((t) => t !== massage)
// }

 // メッセージの箱を用意
//  const MesseList:Ref<never[]>{
//           userId: string;
//           message: string;
//           timestamp: Date;
//         }[] = ref([]);

        // ログインユーザーのデータ取得
//         const ownQ = query(
//           collection(db, "messages"),
//           where("userId", "==", "53PUV5WYMoOlaJWUVDmB"),
//           where("withUserId", "==", "53PUV5WYMoOlaJWUVDmB"),
//         );
//         const ownQSnapshot = await getDocs(ownQ);
//         console.log(ownQSnapshot)
//         ownQSnapshot.forEach((docdata) => {
//           const data = (docdata.id, " => ", docdata.data());
//           MesseList.push({
//             userId: data.userId,
//             message: data.message,
//             timestamp: data.timestamp,
//           });
//         });

//         console.log(MesseList)

//         function addTodo() {
//     messages.value.push({ id: id++, text: newMessage.value })
//   newMessage.value = ''
// }


        // // 会話相手の情報取得(メッセージ表示のため)
        // const anotherQ = query(
        //   collection(db, "messages"),
        //   where("userId", "==", "Yk7C0txAIjPLNQ72wNrd"),
        //   where("withUserId", "==", "Yk7C0txAIjPLNQ72wNrd"),
        // );
        // const anotherQSnapshot = await getDocs(anotherQ);
        // anotherQSnapshot.forEach((docdata) => {
        //   const data = (docdata.id, " => ", docdata.data());
        //   // const timestamp = data.timestamp.toDate();
        //   MesseList.push({
        //     userId: data.userId,
        //     message: data.message,
        //     timestamp: data.timestamp,
        //   });
        // });
        // setMesseDisplay(MesseList);

</script>

<template>
    <!-- <ul>
    <li v-for="massage in messages" :key="massage.id">
      {{ massage.text }} -->
      <!-- <button @click="removeTodo(massage)">X</button> -->
    <!-- </li>
  </ul>
  <form @submit.prevent="addTodo">
    <input v-model="newMessage "> -->
    <!-- <button>送信</button>     -->
  <!-- </form> -->
</template>

<style>

</style>
