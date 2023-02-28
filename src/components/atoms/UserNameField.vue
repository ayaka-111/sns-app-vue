<script lang="ts">
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
import type { Ref } from "vue";

export default {
  setup() {
    let input: Ref<string> = ref("");
    const { validateUserNameField, error } = formValidation();
    const validateInput: () => void = () => {
      validateUserNameField("userName", input.value);
    };
    return { input, error, validateInput };
  },
};
</script>
<template>
  <div>
    <div>
      <input
        type="text"
        placeholder="ユーザーネーム"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <div class="error_text" v-if="error.userName">
      {{ error.userName }}
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
