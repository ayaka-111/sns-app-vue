
<script setup lang="ts">
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../../firebase";
import { ref } from "vue";
import Header from "../components/organisms/header.vue";

const allUserData: any = ref([]);
const searchText: any = ref();
const searchResult: any = ref([]);


// 全てのuser情報を取得
const userQuery = query(collection(db, "user"));
getDocs(userQuery).then((data) => {
  data.forEach((docdata) => {
    const data = docdata.data();
    allUserData.push({ name: data.name, userName: data.username });
  });
});

// // userNameにsearchText.valueが含まれている または、nameに
// // user情報を配列に格納

// // mapで回して、アイコンと名前を表示

const search = (): void => {
  searchResult.value.push(searchText.value);
  searchText.value = String("");
};
</script>

<template>
  <Header />

  <div class="s">
    <div class="search">
      <div class="text">検索</div>

      <form @submit.prevent="search">
        <input v-model="searchText" placeholder="検索" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.s {
  margin-left: 350px;
}
/* .search{
    text-align: center;
} */
.text {
  font-size: x-large;
  font-weight: bold;
}
</style>
