<script lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "../../../firebase";
import { defineComponent, onMounted, ref } from "vue";
import LogoutBtn from "../atoms/button/LogoutBtn.vue";
import type { Ref } from "vue";

export default defineComponent({
  name: "CustomHeader",
  components: { LogoutBtn },
  setup: (props, { emit }) => {
    const userData: any = ref();
    const iconUrl: any = ref("");
    const sonotaKanri: any = ref(false);
    const iconStyle: Ref<string> = ref("40px");
    const userId: Ref<string | undefined> = ref("");

    onMounted(() => {
      onAuthStateChanged(auth, (currentUser: any) => {
        userId.value = currentUser.uid;
        console.log(currentUser.uid);
        const loginUserData = doc(db, "users", currentUser.uid);
        getDoc(loginUserData).then((data) => {
          userData.value = data.data();
          iconUrl.value = userData.value.icon;
        });
      });
    });

    const sonota = () => {
      sonotaKanri.value = !sonotaKanri.value;
      console.log(sonotaKanri.value);
    };

    // 保存済みリストへの処理
    const toKeepList = () => {
      emit("displaySwitchFalse", false);
    };
    return { iconUrl, sonotaKanri, sonota, toKeepList, userId, iconStyle };
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
            <div class="headerMenu">
              <div class="iconImg">
                <font-awesome-icon
                  :icon="['fas', 'house']"
                  class="headerIcon"
                />
              </div>
              <p class="menuTitle">ホーム</p>
            </div>
          </div>
        </li>
      </router-link>

      <router-link to="/searchPage">
        <li class="li">
          <div>
            <div class="headerMenu">
              <div class="iconImg">
                <font-awesome-icon
                  :icon="['fas', 'magnifying-glass']"
                  class="headerIcon"
                />
              </div>
              <p class="menuTitle">検索</p>
            </div>
          </div>
        </li>
      </router-link>

      <router-link to="/newPost">
        <li class="li">
          <div>
            <div class="headerMenu">
              <div class="iconImg">
                <font-awesome-icon
                  :icon="['far', 'square-plus']"
                  class="headerIcon"
                />
              </div>
              <p class="menuTitle">作成</p>
            </div>
          </div>
        </li>
      </router-link>

      <router-link to="/myAccountPage/post">
        <li class="li">
          <div>
            <div class="prof">
              <img
                v-if="iconUrl === ''"
                src="/noIcon.png"
                alt="アイコン"
                class="icon"
              />
              <img v-else v-bind:src="iconUrl" alt="icon" class="icon" />
              <p class="profName">プロフィール</p>
            </div>
          </div>
        </li>
      </router-link>

      <li class="liEnd">
        <div v-if="sonotaKanri">
          <button class="other" @click="sonota">
            <div class="headerMenu">
              <div class="iconImg">
                <font-awesome-icon :icon="['fas', 'bars']" class="headerIcon" />
              </div>
              <p class="menuTitle">その他</p>
            </div>
          </button>
          <div class="ul2">
            <router-link to="/profileChange">
              <div class="liMenu">
                <div class="showMenuIcon">
                  <font-awesome-icon
                    :icon="['fas', 'gear']"
                    class="headerIcon"
                  />
                </div>
                <p>設定</p>
              </div>
            </router-link>
            <!-- <router-link to="/profileChange"> -->
            <router-link to="/myAccountPage/saved">
              <div @click="toKeepList">
                <div class="liMenu">
                  <div class="showMenuIcon">
                    <font-awesome-icon
                      :icon="['far', 'bookmark']"
                      class="headerBookMarkIcon"
                    />
                  </div>
                  <p>保存済み</p>
                </div>
              </div>
            </router-link>
            <!-- </router-link> -->
            <LogoutBtn />
          </div>
        </div>

        <div v-else>
          <button class="other" @click="sonota">
            <div class="headerMenu">
              <div class="iconImg">
                <font-awesome-icon :icon="['fas', 'bars']" class="headerIcon" />
              </div>
              <p class="menuTitle">その他</p>
            </div>
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
.liMenu {
  margin: 0 auto;
  padding: 0;
  padding-left: 10px;
  width: 100%;
  list-style: none;
  display: flex;
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
.headerMenu {
  display: flex;
}
.menuTitle {
  margin-left: 10px;
}
.iconImg {
  width: 40px;
  height: 40px;
  text-align: center;
}
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
.other {
  font-size: 16px;
  font-weight: bold;
}
.other:hover {
  opacity: 1;
  cursor: pointer;
}
.showMenuIcon {
  width: 25px;
  height: auto;
}
</style>
