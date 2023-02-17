<script lang="ts">
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../../../firebase";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "FavoriteButton",
  // props: {
  //   postId: String,
  //   loginUserUid: String,
  //   // loginUserDoc:,
  //   // postDoc:,
  // },
  props: ["postId", "loginUserDoc", "loginUser", "loginUserUid"],
  setup: (props) => {
    const postData: any = ref("");

    // コレクションへの参照を取得
    const postCollectionRef = collection(db, "posts");

    // 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
    const postDocRefId = doc(postCollectionRef, props.postId);

    getDoc(postDocRefId).then((post) => {
      postData.value = post.data();
      // console.log(post.data());
    });

    // いいね機能
    const addFavorite = async () => {
      await updateDoc(postDocRefId, {
        favorites: arrayUnion(props.loginUser.userName),
      });
      await updateDoc(props.loginUserDoc, {
        favoritePosts: arrayUnion(props.postId),
      });
    };
    // いいね削除
    const removeFavorite = async () => {
      await updateDoc(postDocRefId, {
        favorites: arrayRemove(props.loginUser.userName),
      });
      await updateDoc(props.loginUserDoc, {
        favoritePosts: arrayRemove(props.postId),
      });
    };
    return { addFavorite, removeFavorite, postData };
  },
});
</script>

<template>
  <button
    @click="removeFavorite"
    v-if="loginUser.favoritePosts.includes(postId)"
  >
    <font-awesome-icon :icon="['fas', 'heart']" class="post_heart" />
  </button>
  <button @click="addFavorite" v-else>
    <font-awesome-icon :icon="['far', 'heart']" />
  </button>
</template>
