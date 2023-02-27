<script lang="ts">
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { defineComponent, ref as vueref } from "vue";
import { db } from "../../../firebase";
import type { Ref } from "vue";
import type {
  DocumentData,
  Query,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentReference,
} from "@firebase/firestore";

export default defineComponent({
  name: "UserIcon",
  props: { userId: String },
  setup: (props) => {
    const theUserId: any = vueref(props.userId);
    const theUserIcon: Ref<string> = vueref("");
    console.log(props.userId)
    // currentUserのpostデータ取得
    const theUserDocRef: DocumentReference<DocumentData> = doc(
      db,
      "users",
      theUserId
    );
    getDoc(theUserDocRef).then((theUserDocData: any) => {
      const theUserData: DocumentData | undefined = theUserDocData.data();
      theUserIcon.value = theUserData?.icon;
      console.log(theUserData.icon)
    });
    console.log(theUserIcon.value);
    return {
      theUserIcon,
      theUserId,
    };
  },
});
</script>

<template>
  <div class="user_icon" v-if="theUserIcon !== ''">
    <img v-bind:src="theUserIcon" alt="ユーザーアイコン" />
  </div>
  <div class="user_icon" v-else>
    <img src="/noicon.png" alt="ユーザーアイコン" />
  </div>
</template>



<style>
.user_icon {
  border-radius: 50%;
  width: 150px;
  height: 150px;
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

// userIdとstyleのサイズを渡したい
