<script>
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
export default {
  setup() {
    let input = ref(null);
    const { validateCPasswordField, error } = formValidation();
    const validateInput = () => {
      validateCPasswordField("cPassword", input.value);
    };
    return { input, error, validateInput };
  },
};
</script>
<template>
  <div class="field">
    <div class="ui left icon input big">
      <input
        type="password"
        placeholder="確認用パスワード(6文字以上)"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <div class="error_text" v-if="error.cPassword">
      {{ error.cPassword }}
    </div>
  </div>
</template>

<style scoped>
  input {
    width: 100%;
  }
  .error_text {
    color: red;
    font-weight: bold;
  }
</style>
