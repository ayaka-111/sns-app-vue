<script lang="ts">
import { defineComponent, ref } from "vue";
import FavoriteButton from "../atoms/button/FavoriteButton.vue";
import CommentButton from "../atoms/button/CommentButton.vue";
import KeepBtn from "../atoms/button/keepBtn.vue";

export default defineComponent({
  name: "ThreeButtons",
  props: ["postId", "loginUserDoc", "loginUser", "loginUserUid"],
  components: { FavoriteButton, CommentButton, KeepBtn },
  setup: (props) => {
    const prPostId = ref(props.postId);
    const prLoginUserDoc = ref(props.loginUserDoc);
    const prLoginUser = ref(props.loginUser);
    const prLoginUserUid = ref(props.loginUserUid);
    return {
      prPostId,
      prLoginUserDoc,
      prLoginUser,
      prLoginUserUid,
    };
  },
});
</script>

<template>
  <div class="buttons_buttons">
    <div class="buttons_favCom">
      <FavoriteButton
        v-bind:postId="prPostId"
        v-bind:loginUserDoc="prLoginUserDoc"
        v-bind:loginUser="prLoginUser"
        v-bind:loginUserUid="prLoginUserUid"
      />

      <CommentButton v-bind:postId="prPostId" />
    </div>
    <KeepBtn v-bind:postId="prPostId" />
  </div>
</template>

<style scoped>
.buttons_buttons {
  display: flex;
  justify-content: space-between;
  margin: 2% 0;
  align-items: flex-start;
}
.buttons_favCom {
  display: flex;
  align-items: flex-start;
  gap: 5%;
}
</style>
