<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AllComments",
  props: { postId: String },
  setup: (props) => {
    //オブジェクトの形で渡される
    // const postIdObj = defineProps(["postId"]);

    const router = useRouter();

    const commentBtn = () => {
      router.push({ path: `/post/${props.postId}` });
    };
    return { commentBtn };
  },
});
</script>

<template>
  <button @click="commentBtn" class="AllComment_button">
    コメントをすべて見る
  </button>
</template>

<style scoped>
.AllComment_button {
  color: #757575;
}
</style>
