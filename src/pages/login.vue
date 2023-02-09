<script lang="ts">
import { reactive } from "vue";
import { ref } from "vue";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, storage, db } from "../../firebase";

const message = ref("ログイン");
const inputEmail = ref("");
const inputPassword = ref("");
export default {
  setup() {
    const handleSubmit: () => Promise<void> = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      inputEmail.value,
      inputPassword.value
    );
    console.log("ログイン成功");
    // $router.push("/");
  } catch (error) {
    alert("メールアドレスまたはパスワードが間違っています");
    console.log(error);
  }
};
  },
};

</script>

<template>
  <h1>{{ message }}</h1>
  <div>
    <form @submit.prevent="handleSubmit">
      <input
        v-model="email"
        type="email"
        name="email"
        placeholder="メールアドレスを入力"
      />
      <input
        v-model="password"
        type="password"
        name="password"
        placeholder="パスワードを入力"
      />
      <button type="button">ログイン</button>
    </form>
    <p>アカウントをお持ちでないですか？</p>
    <router-link to="/register">登録する</router-link>
  </div>
</template>
