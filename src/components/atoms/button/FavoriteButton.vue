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
  props: ["postId", "loginUserDoc", "loginUser", "loginUserUid"],
  setup: (props) => {
    // 各postの全データ
    const postData: any = ref("");

    // postのfavorites配列の要素数
    const postFavoriteLength = ref(0);

    // postsのfavoritesにloginUserUidが含まれているかどうか
    const favorite = ref(false);
    const noFavorite = ref(false);

    // コレクションへの参照を取得
    const postCollectionRef = collection(db, "posts");

    // 上記を元にドキュメントへの参照を取得(クリックされた投稿のpostIdを指定する)
    const postDocRefId = doc(postCollectionRef, props.postId);

    getDoc(postDocRefId).then((post) => {
      postData.value = post.data();
      postFavoriteLength.value = post.data()?.favorites.length;
      // context.emit("response", postFavoriteLength.value);
      if (post.data()?.favorites.includes(props.loginUserUid)) {
        favorite.value = true;
        console.log(`${props.postId}含まれている`);
      } else {
        noFavorite.value = false;
        console.log(`${props.postId}含まれていない`);
      }
    });

    watch(favorite, () => {
      if (favorite.value) {
        addFavorite().then(() => {
          getDoc(postDocRefId).then((post) => {
            postData.value = post.data();
            postFavoriteLength.value = post.data()?.favorites.length;
            // context.emit("response", postFavoriteLength.value);
          });
        });
      } else {
        removeFavorite().then(() => {
          getDoc(postDocRefId).then((post) => {
            postData.value = post.data();
            postFavoriteLength.value = post.data()?.favorites.length;
            // context.emit("response", postFavoriteLength.value);
          });
        });
      }
    });

    // いいね機能
    const addFavorite = async () => {
      await updateDoc(postDocRefId, {
        favorites: arrayUnion(props.loginUserUid),
      });
      await updateDoc(props.loginUserDoc, {
        favoritePosts: arrayUnion(props.postId),
      });
    };
    // いいね削除
    const removeFavorite = async () => {
      await updateDoc(postDocRefId, {
        favorites: arrayRemove(props.loginUserUid),
      });
      await updateDoc(props.loginUserDoc, {
        favoritePosts: arrayRemove(props.postId),
      });
    };
    // いいねボタンを押した時にbooleanを反転させる
    const onClickAddFavorite = () => {
      favorite.value = !favorite.value;
    };
    const onClickRemoveFavorite = () => {
      favorite.value = !favorite.value;
    };
    return {
      onClickAddFavorite,
      onClickRemoveFavorite,
      postData,
      favorite,
      postFavoriteLength,
    };
  },
});
</script>

<template>
  <div class="favBtnNum">
    <button @click="onClickRemoveFavorite" v-if="favorite">
      <font-awesome-icon :icon="['fas', 'heart']" class="removeHeart heart" />
    </button>
    <button @click="onClickAddFavorite" v-else>
      <font-awesome-icon :icon="['far', 'heart']" class="heart" />
    </button>
    <div>
      いいね<span class="favoriteBold">{{ postFavoriteLength }}</span
      >件
    </div>
  </div>
</template>

<style scoped>
.favBtnNum {
  display: flex;
  flex-direction: column;
  width: 67px;
  height: 60px;
  justify-content: space-between;
}
.removeHeart {
  color: red;
}
.heart {
  width: 25px;
  height: auto;
}
.favoriteBold {
  font-weight: bold;
}
button {
  cursor: pointer;
}
</style>
