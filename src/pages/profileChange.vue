<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { ref } from "vue";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, db, storage } from "../../firebase";
import CustomHeader from "../components/organisms/header.vue";
import Miniheader from "../components/organisms/miniheader.vue";
// import router from "@/router";
import { useRouter } from "vue-router";

const router = useRouter()

const name = ref();
const userName = ref();
const profile = ref();
const userData = ref();
// const loginUser:any = ref();

const uid = ref();

const fileName = ref();
const gsRef = ref();
const iconUrl = ref();

const show = ref(false);

onAuthStateChanged(auth, (currentUser: any) => {
  console.log(currentUser.uid);
  uid.value = currentUser.uid;
  const loginUserData = doc(db, "users", currentUser.uid);
  // loginUser.value = loginUserData
  getDoc(loginUserData).then((data) => {
    // const data = (resultUserData.id, " => ", resultUserData.data());
    userData.value = data.data();
    iconUrl.value = userData.value.icon;
    name.value = userData.value.name;
    userName.value = userData.value.userName;
    profile.value = userData.value.profile;
  });
});

const uploadButton = (e: any): void => {
  const file = e.target.files[0];
  fileName.value = file;
  const gsReference = storageRef(storage, `${uid}/icon/${file.name}`);

  gsRef.value = gsReference;

  uploadBytesResumable(gsReference, file).then(() => {
    console.log("追加しました");
    getDownloadURL(gsReference).then((url) => {
      // 画面表示で追加されたか判断するためrefに代入
      iconUrl.value = url;
    });
  });
};

const change = (): void => {
  updateDoc(doc(db, "users", uid.value), {
    name: name.value,
    userName: userName.value,
    profile: profile.value,
    icon: iconUrl.value,
  });

  router.push("/myAccountPage/post");

  show.value = true;
};
const close = () => {
  // show.value = false;
  router.push("/myAccountPage/post");
};
</script>

<template>

  <CustomHeader />
  <Miniheader />

  <div class = "soto">

  
  <div class="profileChange-header250">
    <div class="profileChange">
      <form @submit.prevent="change">
        <div class="profileChangeIconChange">
            <div v-if="iconUrl !== '' ">
            <img v-bind:src="iconUrl" alt="icon" class="profileChangeIconImg" />
          </div>
          <div v-else>
            <img src="../../public/noIcon.png" alt="icon" class="profileChangeIconImg" />
          </div>
          <div class="profileChangeIconInput">
            <label htmlFor="iconUpload">プロフィール写真を変更</label>
            <input
              name="iconUpload"
              id="iconUpload"
              type="file"
              accept=".png, .jpeg, .jpg"
              @change="uploadButton"
              class="uploadInput"
            />
          </div>
        </div>

        <div class="profileChangeThreeChange">
          <div class="profileChangeName">
            名前<input v-model="name" class="profileChangeInput" />
          </div>
          <div class="profileChangeUserName">
            ユーザーネーム<input
              v-model="userName"
              class="profileChangeInput"
            />
          </div>
          <div class="profileChangeprofile">
            プロフィール<input v-model="profile" class="profileChangeInput" />
          </div>
        </div>

        <button class="profileChangeButton">変更</button>

              <!--  モーダルウィンドウ  -->
  <!-- <div v-show="show"> -->
    <!--   モーダルウィンドウを閉じる   -->
    <!-- <button @click="close">×</button> -->
    <!--   モーダルウィンドウの中身   -->
    <!-- <p>変更が完了されました</p> -->
  <!-- </div> -->

      </form>
    </div>
  </div>

</div>
</template>

<style>
.soto{
    overflow: hidden;
    
}
.profileChange-header250 {
  margin-left: 490px;
  margin-top: 50px;
  height: 425px;
  border: solid 1px silver;
  width: 800px;
}
.profileChange {
  margin: auto;
  width: 800px;
  font-size: 15px;
  font-weight: bold;
  /* border: solid 1px silver; */
  /* height: 425px; */
}
.profileChangeIconChange {
  display: flex;
  margin-top: 40px;
  margin-left: 85px;
  margin-bottom: 50px;
}
.profileChangeIconInput {
  padding-top: 15px;
  padding-left: 30px;
  color: #1596f7;
  font-size: 12px;
}

.profileChangeButton {
  background-color: #1596f7;
  color: white;
  font-weight: bold;
  border-radius: 20%;
  width: 100px;
  margin: 30px;
  padding: 3px;
  margin-top: 60px;
  margin-left: 350px;
}

.profileChangeIconImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.profileChangeThreeChange {
  margin-top: 40px;
  margin-left: 20px;
  width: 700px;
}

.profileChangeName {
  margin-left: 74px;
  width: 100%;
  margin-top: 40px;
}

.profileChangeprofile {
  margin-left: 16px;
  margin-top: 40px;
  width: 100%;
}

.profileChangeUserName {
  margin-top: 40px;
  width: 100%;
}

.profileChangeInput {
  margin-left: 20px;
  width: 70%;
}

.uploadInput {
  display: none;
}

/* .profileChange{
    margin-left: 450px;
    margin-right: 100px;
    margin-top: 50px;
    font-size: 15px;
    font-weight: bold;
    border : solid 1px silver;
}
.profileChangeIconChange{
    display: flex;
    margin-top: 40px;
    margin-left: 85px;
    margin-bottom: 50px;
}
.profileChangeIconInput{
    padding-top: 15px;
    padding-left: 30px;
    color: #1596F7;
    font-size: 12px;
}
.profileChangeButton{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    width: 100px;
    margin:30px;
    padding: 3px;
    margin-top: 60px;
    margin-left: 420px;
}
.profileChangeIconImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    
}
.profileChangeThreeChange{
    margin-top: 40px;
    margin-left: 20px;

}
.profileChangeName{
    margin-top: 40px;
    margin-left: 74px;
}
.profileChangeprofile{
    margin-top: 40px;
    margin-left: 16px;
}
.profileChangeUserName{
    margin-top: 40px;
}
.profileChangeInput{
    margin-left: 20px;
    width:700px
} */
</style>
