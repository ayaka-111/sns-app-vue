<script>
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
export default {
  setup() {
    let input = ref(null);
    const showPassword = ref(false);
    const { validatePasswordField, error } = formValidation();
    const validateInput = () => {
      validatePasswordField("password", input.value);
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
    <div class="password_field">
      <input
        :type="showPassword ? 'text' : 'password'"
        placeholder="パスワード(6文字以上)"
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
    <div class="error_text" v-if="error.password">
      {{ error.password }}
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
.password_field {
  position: relative;
}
.eye_icon {
  position: absolute;
  top: 10px;
  right: 5px;
}
</style>
