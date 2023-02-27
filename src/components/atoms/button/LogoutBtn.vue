<script lang="ts">
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useRouter } from "vue-router";
import type { Router } from "vue-router";
export default {
  setup() {
    const router: Router = useRouter();
    const onClickLogout: () => Promise<void> = async () => {
      await signOut(auth);
      router.push("/login");
    };
    return {
      onClickLogout,
    };
  },
};
</script>

<template>
  <div>
    <button type="button" @click="onClickLogout">ログアウト</button>
  </div>
</template>
