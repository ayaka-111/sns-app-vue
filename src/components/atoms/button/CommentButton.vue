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
  <button @click="commentBtn">コメント</button>
</template>
