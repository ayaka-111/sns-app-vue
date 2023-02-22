<script>
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
export default {
  setup() {
    let input = ref(null);
    const showPassword = ref(false);
    const { validateCPasswordField, error } = formValidation();
    const validateInput = () => {
      validateCPasswordField("cPassword", input.value);
    };
    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value;
    };
    return { input, error, validateInput, toggleShowPassword, showPassword };
  },
};
</script>
<template>
  <div class="field">
    <div class="cpassword_field">
      <input
        :type="showPassword ? 'text' : 'password'"
        placeholder="確認用パスワード(6文字以上)"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button @click="toggleShowPassword" v-if="showPassword" class="eye_icon">
        <font-awesome-icon :icon="['fas', 'eye']" />
      </button>
      <button @click="toggleShowPassword" v-else class="eye_icon">
        <font-awesome-icon :icon="['fas', 'eye-slash']" />
      </button>
    </div>
    <div class="error_text" v-if="error.cPassword">
      {{ error.cPassword }}
    </div>
  </div>
</template>

<style scoped>
input {
  width: 100%;
  height: 35px;
}
.error_text {
  color: red;
  font-weight: bold;
}
.cpassword_field {
  position: relative;
}
.eye_icon {
  position: absolute;
  top: 10px;
  right: 5px;
}
</style>
