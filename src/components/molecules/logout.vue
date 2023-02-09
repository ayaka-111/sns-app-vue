<script setup lang="ts">
import { ref } from "vue";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, storage, db } from "../../../firebase";

const message = ref("ログアウト");
const inputEmail = ref("");
const inputPassword = ref("");
onAuthStateChanged(auth, async (currentUser: any) => {
      if (!currentUser) {
        console.log("ログアウト状態");
      } else {
        console.log(currentUser.uid)
      }
    });

    // const onClickLogout = async() {
    //       await signOut(auth);
    // navigate("/login");
    // }


</script>

<template>
  <h1>{{ message }}</h1>
  <div>
    <button type="button" @click="onClickLogout">ログアウト</button>
  </div>
</template>
