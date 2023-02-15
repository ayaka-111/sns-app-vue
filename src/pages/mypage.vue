<script setup lang="ts">
import { onAuthStateChanged, User } from "@firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
} from "@firebase/firestore";
import { Ref, ref as vueref } from "vue";
import { auth, db } from "firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const currentUserData: Ref<string> = vueref("");
const currentUserId: Ref<string> = vueref("");

onAuthStateChanged(auth, async (currentUser) => {
  if (!currentUser) {
    router.push("/login");
  } else {
    currentUserId.value = currentUser.uid;
    //コレクションへの参照を取得
    // const userCollectionRef = collection(
    //   db,
    //   "users"
    // ) as CollectionReference<User>;
    console.log(currentUserId);
    console.log(currentUser.uid);

    // //上記を元にドキュメントへの参照を取得
    // const userDocRefId = doc(userCollectionRef, currentUserId);

    // //上記を元にドキュメントのデータを取得
    // const userDocId = await getDoc(userDocRefId);

    // //取得したデータから必要なものを取り出す
    // const userDataId = userDocId.data();
  }
});
</script>

<template>
  <h1>マイページ</h1>
</template>
