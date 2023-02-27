<script setup lang="ts">
import {ref} from "vue";
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase';
import {
  getAuth,
  onAuthStateChanged, 
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import Header from "../components/organisms/header.vue"
import Miniheader2 from "../components/organisms/miniheader2.vue"

const userData = ref();
const nowPassValue:any =ref();
const newPassValue:any = ref();
const CPassValue:any = ref();
const errMessage = ref();
const current:any = ref("");

onAuthStateChanged(auth, (currentUser: any) => {
    current.value=currentUser.uid
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

      updateDoc(doc(db, "users", current.value), {
      password:newPassValue.value,
      Cpassword:newPassValue.value,
    });


}


</script>

<template>

<Header />

<Miniheader2 />

<div class="passwordChange-header">

<div class="passwordChange">
<p>{{ current.email }}</p>

<div class="passwordChangeNameset">
<img v-bind:src="userData.icon" alt="icon" class="iconImg" />
<p class="name"> {{ userData.name }}</p>
</div>

<div class="passwordChangeThreeChange">
<form  @submit.prevent="passChange" >
<div class="passwordChange-old">現在のパスワード<input class="passwordChangeInput" v-model="nowPassValue"  placeholder="現在のパスワード" /></div> 
<div class="passwordChange-new">新しいパスワード<input class="passwordChangeInput" v-model="newPassValue"   placeholder="半角英小文字、数字を含む6文字以上15文字以内" /></div>
<div class="passwordChange-new2">新しいパスワード(確認)<input class="passwordChangeInput" v-model="CPassValue"  placeholder="確認の為もう一度入力" /></div>
<div v-if="newPassValue !== CPassValue ">
  <!-- CPassValue.length > 0 && -->
  <p class="passwordChange-not">
    新しいパスワードと新しいパワード(確認)が一致していません
  </p>
  <button class="passwordChangeButton">パスワードを変更</button>

</div>

<div v-else>
<button class="passwordChangeButton2">パスワードを変更</button>
</div>

</form>
</div>

</div>
</div>
</template>


<style>
.passwordChange-header{
  margin-left: 490px;
    margin-top: 50px;
}
.passwordChange{
    margin:auto;
    width:800px;
    font-size: 15px;
    font-weight: bold;
    border : solid 1px silver;
}
.passwordChange-not{
  margin-left: 200px;
  font-size: 13px;
  color: red;
  margin-top: 5px;
}
.passwordChangeButton{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    padding: 5px;
    margin-left: 350px;
    margin-top: 40px;
    margin-bottom:20px;
    width:150px
}
.passwordChangeButton2{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    padding: 5px;
    margin-left: 350px;
    margin-top: 60px;
    margin-bottom:27px;
    width:150px
}
.passwordChangeNameset{
    display: flex;
    margin-top: 40px;
    margin-left: 85px;
    margin-bottom: 50px;
}
.iconImg{
  width: 50px;
    height: 50px;
    border-radius: 50%;
}
.name{
    padding-top: 15px;
    padding-left: 15px;
    font-size: 12px;
}
.passwordChangeThreeChange{
  margin-top: 40px;
    margin-left: 20px;
    width:700px;
}
.passwordChange-old{
  margin-left: 54px; 
    width:100%;
    margin-top: 40px;
}

.passwordChange-new{
  margin-left: 54px; 
    margin-top: 40px;
    width:100%;
}
.passwordChange-new2{
  margin-left: 11px; 
    margin-top: 40px;
    width:100%;
}

.passwordChangeInput{
  margin-left: 20px;
    width:70%;
}



</style>
