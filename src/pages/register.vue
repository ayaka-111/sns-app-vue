<script>
import EmailField from "@/components/atoms/EmailField.vue";
import NameField from "@/components/atoms/NameField.vue";
import UserNameField from "@/components/atoms/UserNameField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import { reactive } from "vue";
import SubmitButtonState from "@/components/molecules/SubmitBtnState";
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
    const { errors } = formValidation();
    const { isSignupButtonDisabled } = SubmitButtonState(user, errors);
    const signUpButtonPressed = () => {
      console.log(user);
      console.log("登録クリックした");
    };
    return { user, isSignupButtonDisabled, signUpButtonPressed };
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
