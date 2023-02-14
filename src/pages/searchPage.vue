
<script setup lang="ts">
import { collection, doc, getDoc, getDocs, query } from "@firebase/firestore";
import { db } from "../../firebase";

import {ref} from "vue";
import Header from "../components/organisms/header.vue"
import { connectStorageEmulator } from "@firebase/storage";

const allUserData:any = ([]);
const searchText:any = ref();
const searchResult:any=([]);
const userDataArr:any=ref([]);




// 全てのuser情報を取得
const userQuery = query(collection(db, "users"));
getDocs(userQuery).then((data) => {
  data.forEach((docdata) => {
    const data = docdata.data();
    console.log(data)
    allUserData.push({name:data.name,userName:data.userName,userId:data.userId});  
    console.log(allUserData) 
    });
    });



const search = (): void => {
  // searchResult.value.push(searchText.value);

  allUserData.forEach((data:any) => { 
    console.log(data)
      if (data.userName.includes(searchText.value)) {
        searchResult.push(data.userId);
      } else if (data.name.includes(searchText.value)) {
        searchResult.push(data.userId);
      }
    });
  searchText.value = String("");

  console.log(searchResult)

  for (const userId of searchResult) {
      console.log(userId)
      const resultUserDoc = doc(db, "user", userId);
      console.log(resultUserDoc)
      getDoc(resultUserDoc).then((resultUserData) => {
        console.log(resultUserData)
        const data = (resultUserData.id, " => ", resultUserData.data()); 
        const getData: any = resultUserData.data();
        console.log(getData)
        console.log(data)
        if (getData) {
          userDataArr.value.push({
            userId: getData.userId,
            name: getData.name,
            userName: getData.userName,
            icon: getData.icon,
          });
        }
      });
    }

};




</script>

<template>
  <Header />

  <div class="s">
    <div class="search">
      <div class="text">検索</div>

      <form class="input" @submit.prevent="search">
        <input class="inp" v-model="searchText" placeholder="検索" />
      </form>

      <div>
    {{ userDataArr.name }}
    </div>

    </div>
  </div>
</template>

<style>
.s {
  margin-left: 500px;
  margin-right:300px;
  margin-top: 25px;
  border : solid 1px silver;
  background-color: white;
}
/* .search{
    text-align: center;
} */
.text {
  font-size: x-large;
  font-weight: bold;
  padding: 15px;
}
.input{
  padding-left: 15px;
  padding-top: 5px;
  outline: none;
}
.inp{
  background-color: #f5f5f5;
  border-radius:5px;
  /* outline:solid 1px #f5f5f5; */
  /* outline: none; */
}
</style>
