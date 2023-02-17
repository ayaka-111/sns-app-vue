<script setup lang="ts">
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from "@firebase/firestore";
import {createApp, ref} from "vue";
import { useRoute } from "vue-router";
import { db } from "../../firebase"
import Header from "../components/organisms/header.vue"

//userIdを受け取る
const route = useRoute();
const userId: any = route.params.userId;

console.log(userId)

const newMessage:any= ref('');
const newMessageList:any = ref([]);
const messageList:any=ref([]);
const uid:any=ref('');
const withUserData:any=ref('');
const withUserName:any=ref('');
const withUserIcon:any=ref('');

// 会話相手の情報を取得
const userCollectionRef = collection(db, "users");
const userDocRefId = doc(userCollectionRef, userId);
console.log(userDocRefId )
getDoc(userDocRefId).then((data) => {
withUserData.value = data.data();
withUserIcon.value=withUserData.value.icon
withUserName.value = withUserData.value.name;
    });



// ログイン判定
const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  uid.value=auth.currentUser?.uid
  const loginUserId = auth.currentUser?.uid
//   const userId:any=ref(currentUserId)
  console.log(currentUserId)
//   console.log(userId)

    onAuthStateChanged(auth, (currentUser: any) => {
        // const currentUserId = currentUser?.uid;
   

 // ログインユーザーのデータ取得
 const ownQ = query(
          collection(db, "messages"),
        //   ログインユーザーのID
          where("userId", "==", currentUser?.uid),
          where("withUserId", "==", userId),
        //   limit(5)
        );
        // const ownQSnapshot = await getDocs(ownQ);
        getDocs(ownQ).then((ownQSnapshot)=>{
            // console.log(ownQSnapshot)
            ownQSnapshot.forEach((docdata) => {

          const data = (docdata.id, " => ", docdata.data()); 
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
    where("userId", "==", userId),
    //   ログインユーザーのID
    where("withUserId", "==", currentUser?.uid),
    // limit(5)
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




});






// inputに入力したものをfirebaseに追加
const addNewMessage =() :void=> {
    // 表示するnewMessageListに追加　これなくていいかも
    newMessageList.value.push({ userId: uid.value, message: newMessage.value, timestamp:"" ,withUserId:''})
    const now = new Date();
    const time = now.toLocaleTimeString();
    // firestoreにデータ追加
    const collectionMessages:any =collection(db, "messages");
    addDoc(collectionMessages, 
    {
    userId: uid.value,
    message:newMessage.value,
    // timestamp: serverTimestamp(),
    timestamp: time,
    withUserId:userId
    }).then(()=>{
        console.log("a")
    })

    // inputのところ空にする
    newMessage.value = String('')

}


messageList.value.sort((a: any, b: any) => {
    return a.messageList.timestamp > b.messageList.timestamp ? -1 : 1;
  });


</script>

<template>

    <Header />

<div class="dm">

    <div class="your">
    <img v-bind:src="withUserIcon" alt="withUserIcon" class="img"/>
    <!-- <img src="../../public/noIcon.png" class="img"/> -->
    <p class="name">{{ withUserName }}</p>
    </div>

    <div class="m">
    <ul>
        <li v-for="mess in messageList" :key="mess.userId" >
        <div v-if="userId === mess.userId " class="withUser">
        <p class="yourmess">{{ mess.message }}</p>
        <p class="yourtime">{{ mess.timestamp}}</p>
        </div>

        <div v-if="userId === mess.withUserId" class="user">
        <p class="mess">{{ mess.message }}</p>
        <p class="time">{{ mess.timestamp}}</p>  
        </div>

        </li>
    </ul>

    <ul>
        <li v-for="newMess in newMessageList" :key="newMess.userId">
        <p class="mess">{{ newMess.message }}</p>
        <p class="time">{{ newMess.timestamp }}</p>
        </li>
    </ul>

</div>

    <form  @submit.prevent="addNewMessage" class="form">
        <div class="inputButton">
        <input class="input" v-model="newMessage" placeholder="メッセージを入力...">
        <button class="button">送信</button> 
        </div> 
    </form>

</div>

</template>


<style scoped>
.dm{
    margin-left: 350px;
}
.your{
    /* border: #c0c0c0; */
    /* text-align: center; */
    /* justify-content: center; */
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
.mess{
    background-color: #e0dddd;
    /* margin: 10px 10px 10px 10px; */
    border: 1px solid #afadad;
    border-radius: 10px;
    padding: 10px;
    margin-left:200px;
}
.yourmess{
    background-color: #e0dddd;
    /* margin: 10px 10px 10px 10px; */
    border: 1px solid #afadad;
    border-radius: 10px;
    padding: 10px;
    margin-right:200px;

}
.time{
    display: block;
    padding-right: 10px;
    text-align: right;
    margin-left:200px;
}
.yourtime{
    display: block;
    padding-right: 10px;
    text-align: right;
    margin-right:200px;
}
.m{
    font-size: 13px;
    /* margin: 10px 10px 10px auto; */
    width: 40%;
}

</style>
