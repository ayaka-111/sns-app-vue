<script lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { watch, defineComponent, onMounted, ref as vueref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../../../../firebase";
import type { Ref } from "vue";
import type { Router } from "vue-router";
import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "@firebase/firestore";

export default defineComponent({
  name: "keepBtn",
  props: { postId: String },
  setup: (props) => {
    const isKeeped: Ref<boolean> = vueref(false);
    const thePostKeepsArr: Ref<string[]> = vueref([]);
    const thePostId: Ref<any> = vueref(props.postId);
    const currentUserId: Ref<string> = vueref("");
    const router: Router = useRouter();

    onMounted(() => {
      onAuthStateChanged(auth, (currentUser: any) => {
        if (!currentUser) {
          router.push("/login");
        } else {
          currentUserId.value = currentUser.uid;
          const postDocRefId: DocumentReference<DocumentData> = doc(
            db,
            "posts",
            thePostId.value
          );
          getDoc(postDocRefId).then((post: DocumentSnapshot<DocumentData>) => {
            const postData: DocumentData | undefined = post.data();
            thePostKeepsArr.value = postData?.keeps ?? [];
            if (postData?.keeps.includes(currentUser.uid)) {
              isKeeped.value = true;
            }
          });
        }
      });
    });

    watch(isKeeped, () => {
      if (isKeeped.value) {
        addKeepFunc().then(() => {
          const postDocRefId: DocumentReference<DocumentData> = doc(
            db,
            "posts",
            thePostId.value
          );
          getDoc(postDocRefId).then((post: DocumentSnapshot<DocumentData>) => {
            const postData: DocumentData | undefined = post.data();
            thePostKeepsArr.value = postData?.keeps ?? [];
          });
        });
      } else {
        deleteKeepFunc().then(() => {
          const postDocRefId: DocumentReference<DocumentData> = doc(
            db,
            "posts",
            thePostId.value
          );
          getDoc(postDocRefId).then((post: DocumentSnapshot<DocumentData>) => {
            const postData: DocumentData | undefined = post.data();
            thePostKeepsArr.value = postData?.keeps ?? [];
          });
        });
      }
    });

    const addKeepFunc: () => Promise<void> = async () => {
      //   postsのkeepsにcurrentUserIdを追加
      const thePostRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        thePostId.value
      );
      await updateDoc(thePostRef, {
        keeps: arrayUnion(currentUserId.value),
      });
      // usersのkeepPostsにpostIdを追加
      const currentUserRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        currentUserId.value
      );
      await updateDoc(currentUserRef, {
        keepPosts: arrayUnion(thePostId.value),
      });
    };

    const deleteKeepFunc = async () => {
      //   postsのkeepsからcurrentUserIdを削除
      const thePostRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        thePostId.value
      );
      await updateDoc(thePostRef, {
        keeps: arrayRemove(currentUserId.value),
      });
      // usersのkeepPostsからpostIdを削除
      const currentUserRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        currentUserId.value
      );
      await updateDoc(currentUserRef, {
        keepPosts: arrayRemove(thePostId.value),
      });
    };

    // 保存ボタン押した時の処理
    const onClickAddKeep = () => {
      isKeeped.value = !isKeeped.value;
    };

    // 保存解除ボタンを押した時の処理
    const onClickdeleteKeep = () => {
      isKeeped.value = !isKeeped.value;
    };
    return {
      isKeeped,
      thePostKeepsArr,
      currentUserId,
      onClickAddKeep,
      onClickdeleteKeep,
    };
  },
});
</script>
<template>
  <button
    v-if="thePostKeepsArr !== null && thePostKeepsArr.includes(currentUserId)"
    @click="onClickdeleteKeep"
  >
    <font-awesome-icon :icon="['fas', 'bookmark']" class="home_bookmark" />
  </button>
  <button v-else @click="onClickAddKeep">
    <font-awesome-icon :icon="['far', 'bookmark']" class="home_bookmark" />
  </button>
</template>
<style scoped>
.home_bookmark {
  width: 18px;
  height: auto;
}
</style>
