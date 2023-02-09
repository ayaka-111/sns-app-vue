<script setup lang="ts">
import { addDoc, collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from "@firebase/firestore";
import {ref} from "vue";
import { db } from "../../firebase"
import Header from "../components/organisms/header.vue"


const newMessage:any= ref('');
const newMessageList:any = ref([]);
const messageList:any=ref([]);

 // ログインユーザーのデータ取得
 const ownQ = query(
          collection(db, "messages"),
        //   ログインユーザーのID
          where("userId", "==", "53PUV5WYMoOlaJWUVDmB"),
          where("withUserId", "==", "53PUV5WYMoOlaJWUVDmB"),
          limit(5)
        );
        // const ownQSnapshot = await getDocs(ownQ);
        getDocs(ownQ).then((ownQSnapshot)=>{
            // console.log(ownQSnapshot)
            ownQSnapshot.forEach((docdata) => {
                console.log(docdata)
          const data = (docdata.id, " => ", docdata.data()); 
          console.log(data)
        //   messageList.push
          messageList.value.push
          ({
            userId: data.userId,
            message: data.message,
            timestamp: data.timestamp,
            withUserId:data.withUserId
          });
        });
        })

// 会話相手の情報取得(メッセージ表示のため)
const anotherQ = query(
    collection(db, "messages"),
    where("userId", "==", "53PUV5WYMoOlaJWUVDmB"),
    //   ログインユーザーのID
    where("withUserId", "==", "53PUV5WYMoOlaJWUVDmB"),
    limit(5)
);
getDocs(anotherQ).then((ownQSnapshot)=>{
            // console.log(ownQSnapshot)
            ownQSnapshot.forEach((docdata) => {
                console.log(docdata)
          const data = (docdata.id, " => ", docdata.data()); 
          console.log(data)
        //   messageList.push
          messageList.value.push
          ({
            userId: data.userId,
            message: data.message,
            timestamp: data.timestamp,
            withUserId:data.withUserId
          });
        });
        })


// inputに入力したものをfirebaseに追加
const addNewMassage =():void => {
    // 表示するnewMessageListに追加　これなくていいかも
    newMessageList.value.push({ userId: "53PUV5WYMoOlaJWUVDmB", message: newMessage.value, timestamp:"" ,withUserId:''})
    
    // firestoreにデータ追加
    const collectionMessages:any =collection(db, "messages");
    addDoc(collectionMessages, 
    {
    userId:"53PUV5WYMoOlaJWUVDmB",
    message:newMessage.value,
    timestamp: serverTimestamp(),
    withUserId:'53PUV5WYMoOlaJWUVDmB'
    }).then(()=>{
        console.log("a")
    })

    // inputのところ空にする
    
    
}

</script>

<template>

    <Header />

<div class="dm">

    <div class="your">
    <img src="../../public/noIcon.png" class="img"/>
    <p class="name">えみりさん</p>
    </div>

    <div class="m">
    <ul>
        <li v-for="mess in messageList" :key="mess.userId" >
            <!-- userid === mess.userid ? (
<p class="myMess">{{ mess.message }}</p>
            ) :(
<p class="yourMess">{{ mess.message }}</p>
            )-->
        {{ mess.message }}
        <p >{{ mess.timestamp }}</p>
        </li>
    </ul>

    <ul>
        <li v-for="newMess in newMessageList" :key="newMess.userId">
        <p class="myMess">{{ newMess.message }}</p>
        <p class="myTime">{{ newMess.timestamp }}</p>
        </li>
    </ul>

</div>

    <form  @submit.prevent="addNewMassage" class="form">
        <div class="inputButton">
        <input class="input" v-model="newMessage" placeholder="メッセージを入力...">
        <button class="button">送信</button> 
        </div> 
    </form>

</div>

</template>


<style>
.dm{
    margin-left: 350px;
}
.your{
    /* border: #c0c0c0; */
    /* text-align: center; */
    justify-content: center;
    display: flex;
    /* width:50%; */
}
.img{
    background-color: #c0c0c0;
    border-radius:50%;
    width: 40px;
    height: 40px;
}
.name{
    display: grid;
    place-items: center;
    margin-left: 10px;
}
/* .form {
    margin:auto;
} */
.inputButton{
    text-align: center;
    /* margin-top: 10px; */
}
.button{
    color: #1596F7;
}
.input{
    border-radius:5px;
    outline:solid 1px #c0c0c0;
    width: 50%;
}
/* .m{
    margin-left: 350px;
} */

</style>
