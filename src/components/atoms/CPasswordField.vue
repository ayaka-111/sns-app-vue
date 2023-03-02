<script lang="ts">
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
import type { Ref } from "vue";

export default {
  setup() {
    let input: Ref<string> = ref("");
    const showPassword: Ref<boolean> = ref(false);
    const { validateCPasswordField, error } = formValidation();
    const validateInput: () => void = () => {
      validateCPasswordField("cPassword", input.value);
    };
    const toggleShowPassword: () => void = () => {
      showPassword.value = !showPassword.value;
    };
    return { input, error, validateInput, toggleShowPassword, showPassword };
  },
};
</script>
<template>
  <div>
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
.cpassword_field {
  position: relative;
}
input {
  width: 100%;
  height: 35px;
}
.eye_icon {
  position: absolute;
  top: 10px;
  right: 5px;
}
.error_text {
  color: red;
  font-weight: bold;
}
</style>
