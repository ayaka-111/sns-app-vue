<script lang="ts">
import { collection, doc, getDoc } from "@firebase/firestore";
import { db } from "../../../firebase";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CommentUserIcon",
  props: { userId: String },
  setup: (props) => {
    // const prUserId = ref(props.userId);
    const userName = ref("");
    const userCollectionRef = collection(db, "users");
    const userDocRef = doc(userCollectionRef, props.userId);
    getDoc(userDocRef).then((user) => {
      userName.value = user.data()?.userName;
    });
    return { userName };
  },
});
</script>

<template>
  <p>{{ userName }}</p>
</template>
