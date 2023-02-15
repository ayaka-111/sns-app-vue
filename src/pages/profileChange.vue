<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import {ref} from "vue"
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, db, storage } from "../../firebase";
import Header from "../components/organisms/header.vue"

const name = ref();
const userName =ref();
const profile = ref();
const userData = ref();
// const loginUser:any = ref();

const uid = ref();

const fileName = ref();
const gsRef = ref();
const iconUrl = ref();


onAuthStateChanged(auth, (currentUser: any) => {
    console.log(currentUser.uid)
    uid.value = currentUser.uid
    const loginUserData = doc(db, "users", currentUser.uid);
    // loginUser.value = loginUserData
    getDoc(loginUserData).then((data) => {
// const data = (resultUserData.id, " => ", resultUserData.data()); 
    userData.value = data.data();
    iconUrl.value=userData.value.icon
name.value = userData.value.name;
userName.value=userData.value.userName;
profile.value = userData.value.profile;
    });
});


const uploadButton = (e: any):void => {
    const file = e.target.files[0];
  fileName.value = file;
  const gsReference = storageRef(
    storage,
    `${uid}/icon/${file.name}`
  );

  gsRef.value = gsReference;

  uploadBytesResumable(gsReference, file).then(() => {
    console.log("追加しました");
    getDownloadURL(gsReference).then((url) => {
      // 画面表示で追加されたか判断するためrefに代入
      iconUrl.value = url;
    });
  });
}

const change =() :void=> {
    updateDoc(doc(db, "users", uid.value), {
        name:userData.value.name,
        userName:userData.value.userName,
        profile:userData.value.profile,
        icon:iconUrl.value
    });
    
}


</script>

<template>
    <Header />
    <div class="profileChange">
    <form  @submit.prevent="change" >
    <div>
    <label htmlFor="iconUpload" class="uploadLabel">
        プロフィール写真を変更
    </label>
    <input
        name="iconUpload"
        id="iconUpload"
        type="file"
        accept=".png, .jpeg, .jpg"
        @change="uploadButton"
        class="uploadInput"
    />
    <img v-bind:src="iconUrl" alt="icon" class="iconImg" />
    </div>


        <div>名前<input v-model="name" ></div> 
        <div>ユーザーネーム<input v-model="userName"></div> 
        <div>プロフィール<input v-model="profile"></div> 
        <button class="button">変更</button>         
    </form>
</div>
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
.iconImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.profileChange{
    margin-left: 350px;
}

</style>
