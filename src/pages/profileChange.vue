<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase";
import {ref} from "vue"

// const name = ref();
// const userName =ref();
// const profile = ref();
const userData = ref();
// const loginUser:any = ref();

const uid = ref();

onAuthStateChanged(auth, (currentUser: any) => {
    console.log(currentUser.uid)
    uid.value = currentUser.uid
    const loginUserData = doc(db, "users", currentUser.uid);
    // loginUser.value = loginUserData
    getDoc(loginUserData).then((data) => {
// const data = (resultUserData.id, " => ", resultUserData.data()); 
    userData.value = data.data();
// name.value = data.data.name;
// userName.value=data.data.userName;
// profile.value = data.data.profile;
    });
});

const change =() :void=> {
    updateDoc(doc(db, "users", uid.value), {
        name:userData.value.name,
        userName:userData.value.userName,
        profile:userData.value.profile,
    });
    
}


</script>

<template>
        <form  @submit.prevent="change" >
        <div>
            <img src="../../public/noIcon.png"/>
            <p>プロフィール写真を変更</p>
        </div>
        <div>名前<input v-model="userData.name" ></div> 
        <div>ユーザーネーム<input v-model="userData.userName"></div> 
        <div>プロフィール<input v-model="userData.profile"></div> 
        <button class="button">変更</button>         
    </form>
</template>

<style>
.button{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    width: 100px;
    margin:30px;
    padding: 3px;
}

</style>
