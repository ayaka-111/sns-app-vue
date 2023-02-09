<script>
import { ref } from "vue";
import formValidation from "../molecules/formValidation";
export default {
  setup() {
    let input = ref(null);
    const { validateEmailField, error } = formValidation();
    const validateInput = () => {
      validateEmailField("email", input.value);
    };
    return { input, error, validateInput };
  },
};
</script>
<template>
  <div class="field">
    <div class="ui left icon input big">
      <input
        type="email"
        placeholder="メールアドレス"
        autocomplete="off"
        v-model="input"
        @keyup="validateInput"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <div class="ui basic label pointing red" v-if="error.email">
      {{ error.email }}
    </div>
  </div>
</template>
