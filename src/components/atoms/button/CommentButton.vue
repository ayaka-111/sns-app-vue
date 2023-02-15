<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CommentButton",
  props: { postId: String },
  setup: (props) => {
    // const postIdObj = defineProps<Props>(["postId"]);
    // const props = defineProps<Props>();
    const router = useRouter();

    const commentBtn = () => {
      router.push({ path: `/post/${props.postId}` });
    };
    return { commentBtn };
  },
});
</script>

<template>
  <button @click="commentBtn">
    <font-awesome-icon :icon="['far', 'comment']" />
  </button>
</template>
