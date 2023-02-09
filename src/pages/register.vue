<script>
import EmailField from "@/components/atoms/EmailField.vue";
import NameField from "@/components/atoms/NameField.vue";
import UserNameField from "@/components/atoms/UserNameField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import { reactive } from "vue";
import SubmitButtonState from "@/components/atoms/SubmitBtnState";
import formValidation from "@/components/molecules/formValidation";

export default {
  components: {
    EmailField,
    NameField,
    UserNameField,
    PasswordField,
  },
  setup() {
    let user = reactive({
      email: "",
      name: "",
      userName: "",
      password: "",
    });

    const { error } = formValidation();
    const { isSignupButtonDisabled } = SubmitButtonState(user, error);

    const loginButtonPressed = () => {
      console.log(user);
      // const collectionMessages: any = collection(db, "users");
      // addDoc(collectionMessages, {
      //   userId: "53PUV5WYMoOlaJWUVDmB",
      //   message: newMessage.value,
      //   timestamp: serverTimestamp(),
      //   withUserId: "53PUV5WYMoOlaJWUVDmB",
      // }).then(() => {
      //   console.log("a");
      // });
    };

    return {
      user,
      isSignupButtonDisabled,
      loginButtonPressed,
    };
  },
};
</script>

<template>
  <section class="signup-view">
    <form @submit.prevent class="ui form">
      <EmailField v-model="user.email" />
      <NameField v-model="user.name" />
      <UserNameField v-model="user.userName" />
      <PasswordField v-model="user.password" />
      <button
        :disabled="isSignupButtonDisabled"
        @click="loginButtonPressed"
        class="ui button red fluid big"
      >
        登録する
      </button>
    </form>
  </section>
</template>

<style scoped>
.signup-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.form {
  width: 450px;
}
</style>
