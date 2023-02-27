<script lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "../../../firebase";
import { defineComponent, ref } from "vue";
import NewPost from "../pages/newPost.vue";

export default defineComponent({
  name: "CustomHeader",
  setup: () => {
    const userData: any = ref();
    const iconUrl: any = ref();
    const sonotaKanri: any = ref(false);

    onAuthStateChanged(auth, (currentUser: any) => {
      console.log(currentUser.uid);
      const loginUserData = doc(db, "users", currentUser.uid);
      getDoc(loginUserData).then((data) => {
        userData.value = data.data();
        iconUrl.value = userData.value.icon;
      });
    });

    const sonota = () => {
      sonotaKanri.value = !sonotaKanri.value;
      console.log(sonotaKanri.value);
    };

    // モーダル
    const show = ref(false);
    const open = () => {
      show.value = true;
    };
    const close = () => {
      show.value = false;
    };
    return { iconUrl, sonotaKanri, sonota };
  },
});
</script>

<template>
  <div class="header">
    <div class="logo">
      <img class="logoImg" src="../../../public/logo_transparent.png" />
    </div>

    <ul class="ul">
      <router-link to="/home">
        <li class="li">
          <div>
            <p>
              <font-awesome-icon
                :icon="['fas', 'house']"
                class="headerIcon"
              />&nbsp;&nbsp;ホーム
            </p>
          </div>
        </li>
      </router-link>

      <router-link to="/searchPage">
        <li class="li">
          <div>
            <p>
              <font-awesome-icon
                :icon="['fas', 'magnifying-glass']"
                class="headerIcon"
              />&nbsp;&nbsp;検索
            </p>
          </div>
        </li>
      </router-link>

      <router-link to="/newPost">
        <li class="li">
          <div>
            <p>
              <font-awesome-icon
                :icon="['far', 'square-plus']"
                class="headerIcon"
              />&nbsp;&nbsp;作成
            </p>
          </div>
        </li>
      </router-link>
      <!-- <div id="newPostModal" class="newPostModal">
        <button @click="open" class="newPostModal_open_btn">作成</button> -->

      <!--  モーダルウィンドウ  -->
      <!-- <div v-show="show" class="newPostModal_contents"> -->
      <!-- モーダルウィンドウの背景 -->
      <!-- <div @click="close" class="newPostModal_contents_bg">
            <font-awesome-icon :icon="['fas', 'xmark']" class="newPostXmark" />
          </div> -->

      <!--   モーダルウィンドウを閉じる   -->
      <!-- <button @click="close" class="newPostModal_close_btn"></button> -->

      <!--   モーダルウィンドウの中身   -->
      <!-- <div class="newPostModal_contents_wrap">
            <NewPost />
          </div>
        </div>
      </div> -->

      <router-link to="/myAccountPage">
        <li class="li">
          <div>
            <div class="prof">
              <img v-bind:src="iconUrl" alt="icon" class="icon" />
              <p class="profName">プロフィール</p>
            </div>
          </div>
        </li>
      </router-link>

      <li class="liEnd">
        <div v-if="sonotaKanri">
          <button @click="sonota">
            <p>
              <font-awesome-icon
                :icon="['fas', 'bars']"
                class="headerIcon"
              />&nbsp;&nbsp;その他
            </p>
          </button>
          <div class="ul2">
            <router-link to="/profileChange">
              <p class="li">
                <font-awesome-icon
                  :icon="['fas', 'gear']"
                  class="headerIcon"
                />&nbsp;&nbsp;設定
              </p>
            </router-link>
            <!-- <router-link to="/profileChange"> -->
            <p class="li">
              <font-awesome-icon
                :icon="['far', 'bookmark']"
                class="headerBookMarkIcon"
              />&nbsp;&nbsp;保存済み
            </p>
            <!-- </router-link> -->
            <LogoutBtn />
          </div>
        </div>

        <div v-else>
          <button @click="sonota">
            <p>
              <font-awesome-icon
                :icon="['fas', 'bars']"
                class="headerIcon"
              />&nbsp;&nbsp;その他
            </p>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.logo {
  width: 90px;
  margin: 20px auto 0 auto;
}
.logoImg {
  width: 70px;
  height: 70px;
}
.icon {
  width: 40px;
  height: 40px;
  background-color: #ffff;
  border-radius: 50%;
  border: 1px solid lightgray;
}

.header {
  width: 250px;
  height: 100vh;
  max-width: 350px;
  min-width: 200px;
  border-right: 1px solid lightgray;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffff;
  font-size: 16px;
  font-weight: bold;
}
.ul {
  height: 450px;
  width: 90%;
  margin: 50px 0 0 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 10%;
}
.ul2 {
  height: 100px;
  width: 90%;
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 10%;
}
.li {
  margin: 0 auto;
  padding: 0;
  padding-left: 10px;
  width: 100%;
  list-style: none;
}
.liEnd {
  margin: 0 auto;
  padding: 0;
  padding-left: 10px;
  width: 100%;
  list-style: none;
  /* margin-top: 100px; */
}
.profName {
  display: grid;
  place-items: center;
  margin-left: 10px;
}
.prof {
  display: flex;
}
/* icon */
.headerIcon {
  width: 20px;
  height: auto;
}
.headerBookMarkIcon {
  width: 15px;
  height: auto;
}
button {
  cursor: pointer;
}
/* モーダル */
.newPostModal {
  padding-right: 4%;
}
/* モーダルウィンドウを開く要素 */
.newPostModal_open_btn {
  cursor: pointer;
}
/* モーダルウィンドウ要素 */
.newPostModal_contents {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
}
/* モーダルウィンドウの背景要素 */
.newPostModal_contents_bg {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.newPostXmark {
  display: flex;
  margin-right: 2%;
  margin-left: auto;
  padding-top: 2%;
  width: 20px;
  height: auto;
  color: #ffff;
  cursor: pointer;
  position: absolute;
  top: 2%;
  right: 2%;
}
/* モーダルウィンドウの中身*/
.newPostModal_contents_wrap {
  /* position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  width: 35%;
  height: 70%;
  margin: auto;
  transform: translate(-50%, -50%);
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  text-align: center; */
  z-index: 2000;
}
/* モーダルウィンドウを閉じる要素 */
.newPostModal_close_btn {
  cursor: pointer;
  height: 33%;
  color: #ffff;
}
</style>
