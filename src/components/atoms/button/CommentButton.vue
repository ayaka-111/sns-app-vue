<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CommentButton",
  components:{},
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
  <button @click="commentBtn">コメント</button>
</template>
