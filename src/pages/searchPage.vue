
<script setup lang="ts">
import { collection, doc, DocumentReference, getDoc, getDocs, query, type DocumentData } from "@firebase/firestore";
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
  // userDataArrが空配列ではなかったら、userDataArrを空にする
  // if(!userDataArr === [] ){
    userDataArr.value= []
    console.log(userDataArr)
  // }
  
  allUserData.forEach((data:any) => { 
    console.log(data)
      if (data.userName.includes(searchText.value)) {
        searchResult.push(data.userId);
      } else if (data.name.includes(searchText.value)) {
        searchResult.push(data.userId);
      }
    });

  console.log(searchResult)

  for (const userId of searchResult) {
      console.log(userId)
      const resultUserDoc= doc(db, "users", userId);
      console.log(resultUserDoc)
      getDoc(resultUserDoc).then((resultUserData) => {

        
        // if(resultUserData){
          console.log(resultUserData)
        // const data = (resultUserData.id, " => ", resultUserData.data()); 
        const getData = resultUserData.data();
        console.log(getData)

        if (getData) {
          userDataArr.value.push({
            userId: getData.userId,
            name: getData.name,
            userName: getData.userName,
            icon: getData.icon,
          });
        }

      // }

      });
    }

      searchText.value = String("");

};




</script>

<template>
  <Header />

  <div class="s">
    <div class="search">
      <div class="text">検索</div>

      <div class="i">
      <form class="input" @submit.prevent="search">
        <input class="inp" v-model="searchText" placeholder="検索" />
      </form>
    </div>

  <div class="searchPageResult" v-for="data in userDataArr">

  <div>
  <img v-bind:src="data.icon" alt="icon" class="iconImg" />
  </div>
  
  <div class="searchPageNameSet">
  <p class="searchPageUserName">{{ data.userName }}</p>
  <p>{{ data.name }}</p>
  </div>

    </div>


    </div>
  </div>
</template>

<style scoped>
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

.i{
  margin-bottom: 20px;
  border-bottom: solid 1px silver;
}
.input{
  padding-left: 15px;
  padding-top: 5px;
  outline: none;
  margin-bottom: 20px;

}
.inp{
  background-color: #f5f5f5;
  border-radius:5px;
  /* outline:solid 1px #f5f5f5; */
  /* outline: none; */
}
.iconImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.searchPageNameSet{
    margin-top: 5px;
    margin-left: 10px;
}
.searchPageResult{
  display: flex;
  /* margin-top: 10px; */
}

.searchPageUserName{
  font-weight: bold;
}

</style>
