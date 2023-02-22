<script setup lang="ts">
import {ref} from "vue";
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase';
import {
  getAuth,
  onAuthStateChanged, 
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import Header from "../components/organisms/header.vue"

const userData = ref();
const nowPassValue:any =ref();
const newPassValue:any = ref();
const errMessage = ref();
const current:any = ref("");

onAuthStateChanged(auth, (currentUser: any) => {
    current.value=currentUser
    const loginUserData = doc(db, "users", currentUser.uid);
    getDoc(loginUserData).then((data) => {
    userData.value = data.data();
    console.log(current)
    });
  });

// const auth = getAuth();
// const currentUser: any = auth.currentUser;

 // パスワードの変更関数を定義(Authentication)
 const updatePassword = (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (current.value == null) {
        return reject();
      }


      // クレデンシャルの取得
      const credential = EmailAuthProvider.credential(
        current.value.email || "",
        oldPassword
        // current.value.password
      );

      // メールアドレスの再認証
      reauthenticateWithCredential(current.value, credential)
        .then((userCredential) => {
          console.log(userCredential)
          // パスワードの更新
          firebaseUpdatePassword(userCredential.user, newPassword)
            .then(() => resolve())
            .catch((error) => {
                reject(error)
                console.log(userCredential.user);
            }
            );
        })
        .catch((error) => reject(errMessage.value=error));
    });  
  };



const passChange :()=> void = () => {
    updatePassword(nowPassValue.value, newPassValue.value);
    console.log(nowPassValue)
    console.log(newPassValue)
    console.log(current.value)

    // ここにデータベースの更新のコードもかく
}


</script>

<template>

<Header />

<div class="passwordChange">
<p>{{ current.email }}</p>

<div class="passwordChangeNameset">
<!-- <img v-bind:src="userData.icon" alt="icon" class="iconImg" /> -->
<!-- <p>{{ userData.name }}</p> -->
</div>

<form  @submit.prevent="passChange" >
  {{ current.password }}
  {{ current.email}}
<div>現在のパスワード<input v-model="nowPassValue"  placeholder="現在のパスワード" /></div> 
<div>新しいパスワード<input  v-model="newPassValue"   placeholder="半角英小文字、数字を含む6文字以上15文字以内" /></div>
<div>新しいパスワードを確認<input v-model="newPassValue"  placeholder="確認の為もう一度入力" /></div>
<button class="passwordChangeButton">パスワードを変更</button>
</form>

</div>
</template>

<style>
.passwordChangeNameset{
    display: flex;
}
.passwordChangeButton{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    padding: 5px;
}
.passwordChange{
    margin-left: 350px;
}
</style>
