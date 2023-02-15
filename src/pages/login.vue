<script lang="ts">

import { reactive, ref, defineComponent } from "vue";

import EmailField from "@/components/atoms/EmailField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import SubmitButtonState from "@/components/atoms/SubmitBtnState";
import formValidation from "@/components/molecules/formValidation";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    EmailField,
    PasswordField,
  },
  setup() {
    let user = reactive({
      email: "",
      password: "",
    });

    const router = useRouter();
    const loginJudge: any = ref(false);
    const currentAuth = getAuth();
    console.log(loginJudge.value);

    onAuthStateChanged(currentAuth, (currentUser) => {
      if (currentUser) {
        loginJudge.value = !loginJudge.value;
      }

      console.log(loginJudge.value);
    });

    const { error } = formValidation();
    const { isSignupButtonDisabled } = SubmitButtonState(user, error);

    const toTop = () => {
      router.push("/home");
    };

    const loginButtonPressed = async () => {
      console.log(user);
      console.log("mtouroku");
      try {
        await signInWithEmailAndPassword(auth, user.email, user.password).then(
          () => {
            router.push("/home");
          }
        );
      } catch (error) {
        alert("メールアドレスまたはパスワードが間違っています");
      }
    };

    return {
      user,
      isSignupButtonDisabled,
      loginButtonPressed,
      toTop,
      loginJudge,
    };
  },
});
</script>
<template>
  <section v-if="loginJudge === false" class="signup-view">
    <form @submit.prevent novalidate class="ui form">
      <div class="ui stacked segment">
        <EmailField v-model="user.email" />
        <PasswordField v-model="user.password" />
        <button
          class="ui button red fluid"
          :disabled="isSignupButtonDisabled"
          @click="loginButtonPressed"
        >
          ログイン
        </button>
      </div>
    </form>
    <div>
      <p>アカウントをお持ちでないですか？</p>
      <a href="/register">登録する</a>
    </div>
  </section>
  <button @click="toTop" v-else>TOPへ</button>
</template>
