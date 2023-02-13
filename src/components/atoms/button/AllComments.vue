<script setup lang="ts">
import { useRouter } from "vue-router";

//オブジェクトの形で渡される
const postIdObj = defineProps(["postId"]);

const router = useRouter();

const commentBtn = () => {
  router.push({ path: `/post/${postIdObj.postId}` });
};
</script>

<template>
  <button @click="commentBtn" class="AllComment_button">
    コメントをすべて見る
  </button>
</template>

<style>
.AllComment_button {
  color: #757575;
}
</style>
