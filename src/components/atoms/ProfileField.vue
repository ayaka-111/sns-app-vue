<script lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

export default {
  setup() {
    let textarea: Ref<string> = ref("");
    return { textarea };
  },
};
</script>
<template>
  <div>
    <textarea
      placeholder="自己紹介"
      autocomplete="off"
      v-model="textarea"
      @input="$emit('update:modelValue', $event.target.value)"
      cols="38"
      rows="5"
    />
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  resize: none;
}
</style>
