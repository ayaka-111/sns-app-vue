<script>
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
export default {
  setup() {
    let input = ref(null);
    const { validatePasswordField, error } = formValidation();
    const validateInput = () => {
      validatePasswordField("password", input.value);
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
        placeholder="パスワード(6文字以上)"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
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
</style>
