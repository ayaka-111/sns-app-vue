<script lang="ts">
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
import type { Ref } from "vue";

export default {
  setup() {
    let input: Ref<string> = ref("");
    const { validateEmailField, error } = formValidation();
    const validateInput: () => void = () => {
      validateEmailField("email", input.value);
    };
    return { input, error, validateInput };
  },
};
</script>
<template>
  <div>
    <div>
      <input
        type="email"
        placeholder="メールアドレス"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <div class="error_text" v-if="error.email">
      {{ error.email }}
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
