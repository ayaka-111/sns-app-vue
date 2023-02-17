<script>
import { ref } from "vue";
export default {
  setup() {
    let textarea = ref(null);
    return { textarea };
  },
};
</script>
<template>
  <div class="ui left icon input big">
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
input {
  width: 100%;
}
</style>
