<script setup lang="ts">
import { collection, getDocs, query, where } from "@firebase/firestore";
import {ref} from "vue";
import { db } from "../../firebase"

let userId = '';
const newMessage:any= ref('');
const newMessageList:any = ref([
// { userId: '', message: '' , timestamp:'',withUserId:''}
]);
const messageList:any=ref([]);

 // ログインユーザーのデータ取得
 const ownQ = query(
          collection(db, "messages"),
          where("userId", "==", "53PUV5WYMoOlaJWUVDmB"),
          where("withUserId", "==", "53PUV5WYMoOlaJWUVDmB"),
        );
        // const ownQSnapshot = await getDocs(ownQ);
        getDocs(ownQ).then((ownQSnapshot)=>{
            ownQSnapshot.forEach((docdata) => {
          const data = (docdata.id, " => ", docdata.data()); 
          messageList.push({
            userId: data.userId,
            message: data.message,
            timestamp: data.timestamp,
            withUserId:data.withUserId
          });
        });
        })
  
const addNewMassage =():void => {
    newMessageList.value.push({ userId: "53PUV5WYMoOlaJWUVDmB", message: newMessage.value, timestamp:"" ,withUserId:''})
    newMessage.value = String('')
}

</script>

<template>

    <ul>
        <li v-for="mess in messageList" :key="mess.userId">
        {{ mess.message }}
        </li>
    </ul>

    <ul>
        <li v-for="newMess in newMessageList" :key="newMess.userId">
        {{ newMess.message }}
        </li>
    </ul>

    <form  @submit.prevent="addNewMassage">
        <input v-model="newMessage">
        <button>送信</button>  
    </form>

</template>
