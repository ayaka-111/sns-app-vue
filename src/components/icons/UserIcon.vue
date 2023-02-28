<script lang="ts">
import { doc, getDoc } from "@firebase/firestore";
import { defineComponent, ref as vueref } from "vue";
import { db } from "../../../firebase";
import type { Ref } from "vue";
import type { DocumentData, DocumentReference } from "@firebase/firestore";

export default defineComponent({
  name: "UserIcon",
  props: { userId: String, iconStyle: String },
  setup: (props) => {
    const theUserId: any = vueref(props.userId);
    const theUserIcon: Ref<string> = vueref("");
    const sideLength: Ref<string | undefined> = vueref(props.iconStyle);
    // currentUserのpostデータ取得
    const theUserDocRef: DocumentReference<DocumentData> = doc(
      db,
      "users",
      theUserId.value
    );
    getDoc(theUserDocRef).then((theUserDocData: any) => {
      const theUserData: DocumentData | undefined = theUserDocData.data();
      theUserIcon.value = theUserData?.icon;
    });
    console.log(sideLength.value)
    return {
      theUserIcon,
      theUserId,
      sideLength,
    };
  },
});
</script>

<template>
  <div class="user_icon" v-if="theUserIcon !== ''">
    <img v-bind:src="theUserIcon" alt="ユーザーアイコン" />
  </div>
  <div class="user_icon" v-else>
    <img src="/noIcon.png" alt="ユーザーアイコン" />
  </div>
</template>

<style>
.user_icon {
  border-radius: 50%;
  width: v-bind(iconStyle);
  height: v-bind(iconStyle);
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #ffff;
  margin: auto;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
