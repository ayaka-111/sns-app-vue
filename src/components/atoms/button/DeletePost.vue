<script lang="ts">
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db, storage } from "../../../../firebase";
import { defineComponent } from "vue";
import { deleteObject, ref as storageRef } from "@firebase/storage";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "DeletePost",
  props: ["postId", "loginUserUid", "loginUserDoc", "userCollection"],
  setup: (props) => {
    const router = useRouter();

    const deleteButton = async (e: any) => {
      //postsから削除
      await deleteDoc(doc(db, "posts", props.postId))
        .then(async () => {
          // storageから削除
          console.log(e);
          // const file = e.target.files[0];→0がタイプエラー
          const gsReference = storageRef(
            storage,
            `${props.loginUserUid}/post/${props.postId}/postImg.png`
          );
          await deleteObject(gsReference);
        })

        .then(async () => {
          // ログインユーザーのusersのpostsから削除
          console.log(props.loginUserDoc);
          await updateDoc(props.loginUserDoc, {
            posts: arrayRemove(props.postId),
          });
        })
        .then(() => {
          // この投稿のpostIdが含まれるusersのfavoritePostsから削除
          // favoritePostsにpostIdが含まれるusersを全件取得
          const favoriteCollectionRef = query(
            collection(db, "users"),
            where("favoritePosts", "array-contains", props.postId)
          );

          console.log(favoriteCollectionRef);
          getDocs(favoriteCollectionRef).then((user) => {
            console.log(user);
            // data()の形で取得し、userListにpush
            const userList: any[] = [];
            console.log(userList);
            user.forEach(async (data) => {
              userList.push(data.data());
            });
            console.log(userList);
            userList.map(async (user) => {
              // 取得したusersデータの中からfavoritePosts,userIdを取得
              const favoriteArray = user.favoritePosts;
              const userId = user.userId;
              console.log(favoriteArray);
              console.log(userId);
              // favoritePostsからpostIdを削除(returnを書かないと全部削除されて空の配列が返ってくる)
              const deleteFavorite = favoriteArray.filter((id: string) => {
                return id !== props.postId;
              });
              console.log(props.userCollection);
              // 対象usersのドキュメントを取得
              const favoriteRefId = doc(props.userCollection, userId);
              // 対象usersのfavoritePostsをpostIdを消した配列に更新
              await updateDoc(favoriteRefId, {
                favoritePosts: deleteFavorite,
              });
            });
          });
        })

        .then(() => {
          // この投稿のpostIdが含まれるusersのkeepPostsから削除
          // keepPostsにpostIdが含まれるusersを全件取得
          const keepCollectionRef = query(
            collection(db, "users"),
            where("keepPosts", "array-contains", props.postId)
          );

          getDocs(keepCollectionRef).then((user) => {
            // data()の形で取得し、keepUserListにpush
            const keepUserList: any[] = [];
            user.forEach(async (data: any) => {
              keepUserList.push(data.data());
            });
            keepUserList.map(async (user) => {
              // 取得したusersデータの中からkeepPosts,userIdを取得
              const keepArray = user.keepPosts;
              const userId = user.userId;
              // keepPostsからpostIdを削除
              const deleteKeep = keepArray.filter((id: string) => {
                return id !== props.postId;
              });
              // 対象usersのドキュメントを取得
              const keepRefId = doc(props.userCollection, userId);
              // 対象usersのfavoritePostsをpostIdを消した配列に更新
              await updateDoc(keepRefId, {
                keepPosts: deleteKeep,
              });
            });
          });
        })
        .then(() => {
          console.log("削除しました");
          router.push("/myAccountPage");
        });
    };

    return { deleteButton };
  },
});
</script>

<template>
  <button @click="deleteButton" class="deletePostBtn">削除</button>
</template>

<style scoped>
.deletePostBtn {
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  color: red;
  font-weight: bold;
  height: 25%;
}
</style>
