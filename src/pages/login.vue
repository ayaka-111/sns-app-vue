<script lang="ts">
import { reactive, ref, defineComponent, onMounted } from "vue";
import type { Ref } from "vue";
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
import type { Router } from "vue-router";
import type { Auth } from "firebase/auth";

export default defineComponent({
  components: {
    EmailField,
    PasswordField,
  },
  setup() {
    let user: {
      email: string;
      password: string;
    } = reactive({
      email: "",
      password: "",
    });

    const router: Router = useRouter();
    const loginJudge: Ref<boolean> = ref(false);
    const currentAuth: Auth = getAuth();

    onMounted(() => {
      onAuthStateChanged(currentAuth, (currentUser) => {
        if (currentUser) {
          loginJudge.value = !loginJudge.value;
        }
        console.log(`ログイン状態：${loginJudge.value}`);
      });
    });

    const { error } = formValidation();
    const { isSignupButtonDisabled } = SubmitButtonState(user, error);

    const toTop: () => void = () => {
      router.push("/home");
    };

    const loginButtonPressed: () => Promise<void> = async () => {
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
  <section v-if="loginJudge === false">
    <div class="login_wrapper">
      <img src="/mobileLogo.png" alt="firstgram" class="icon" />
      <form @submit.prevent novalidate class="form">
        <EmailField v-model="user.email" class="email_input" />
        <PasswordField v-model="user.password" />
        <button
          class="login_button"
          :disabled="isSignupButtonDisabled"
          @click="loginButtonPressed"
        >
          ログイン
        </button>
      </form>
      <div class="no_account">
        <p>アカウントをお持ちでないですか？</p>
        <a href="/register" class="register">登録する</a>
      </div>
    </div>
  </section>
  <button @click="toTop" v-else>TOPへ</button>
</template>

<style scoped>
.login_wrapper {
  width: 350px;
  border: 1px solid #dbdbdb;
  background: #fff;
  margin: 150px auto;
  padding: 20px 0;
}
.icon {
  margin: 0 auto;
}
.form {
  margin: 30px 50px;
}
.email_input {
  margin-bottom: 20px;
}
.login_button {
  background-color: #1596f7;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
  margin: 30px 0;
  padding: 3px;
  height: 32px;
}
.login_button:hover {
  cursor: pointer;
}
.no_account {
  display: flex;
  font-size: 14px;
  justify-content: center;
}
.register {
  font-weight: bold;
  color: #1596f7;
  margin-left: 10px;
}
.register:hover {
  opacity: 0.6;
}
</style>
