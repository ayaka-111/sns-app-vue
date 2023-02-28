<script setup lang="ts">
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  type DocumentData,
} from "@firebase/firestore";
import { db } from "../../firebase";

import { ref } from "vue";
import Header from "../components/organisms/header.vue";
import { connectStorageEmulator } from "@firebase/storage";
import { useRoute, useRouter } from "vue-router";
import UserIcon from "../components/icons/UserIcon.vue";
// import searchResult from "@/components/organisms/searchResult.vue";

const iconStyle: any= ref("50px");
const allUserData: any = [];
const searchText: any = ref();
const searchResultUserId: any = [];
const userDataArr: any = ref([]);

// 全てのuser情報を取得
const userQuery = query(collection(db, "users"));
getDocs(userQuery).then((data) => {
  data.forEach((docdata) => {
    const data = docdata.data();
    console.log(data);
    allUserData.push({
      name: data.name,
      userName: data.userName,
      userId: data.userId,
    });
    console.log(allUserData);
  });
});

const search:() => void =()=> {
  // userDataArrが空配列ではなかったら、userDataArrを空にする
  // if(!userDataArr === [] ){
  // userDataArr.value= []
  // searchResultUserId.value=[]
  // console.log(userDataArr)
  // }

  allUserData.forEach((data: any) => {
    console.log(data);
    if (data.userName.includes(searchText.value)) {
      searchResultUserId.push(data.userId);
    } else if (data.name.includes(searchText.value)) {
      searchResultUserId.push(data.userId);
    }
  });

  console.log(searchResultUserId)

  const result: any = [];
  // ここをコンポーネンでかく
  for (const userId of searchResultUserId) {
    // console.log(userId)
    const resultUserDoc = doc(db, "users", userId);
    // console.log(resultUserDoc)
    getDoc(resultUserDoc).then((resultUserData) => {
      // if(resultUserData){
      console.log(resultUserData);
      // const data = (resultUserData.id, " => ", resultUserData.data());
      const getData = resultUserData.data();
      console.log(getData);


          //  userDataArr.value= []
      userDataArr.value.push({
          userId: getData?.userId,
          name: getData?.name,
          userName: getData?.userName,
          icon: getData?.icon,
        });

      // if (getData) {
        // userDataArr.value= []

        // result.push({
        //   userId: getData?.userId,
        //   name: getData?.name,
        //   userName: getData?.userName,
        //   icon: getData?.icon,
        // });

        // userDataArr.value = result

        // console.log(userDataArr)
      // }

      console.log( result )
      console.log(userDataArr.value);
      // userDataArr.value = result;
      // }
    });
  }
 



  searchText.value = String("");
};
</script>

<template>
  <Header />

  <div class="searchPage-250px">
    <div class="searchPage-auto">
      <div class="searchPage-50">

      <div class="searchPage-text">検索</div>

      <div class="searchPage-forminput">
        <form class="searchPage-form" @submit.prevent="search">
          <input class="searchPage-input" v-model="searchText" placeholder="検索" />
        </form>
      </div>
      <!-- <p>{{ userDataArr }}</p> -->
      
      <div
        class="searchPage-Result"
        v-for="
        (userDataResult,index) in userDataArr"
        :key="index"
      >

      <div class="searchPage-iconImg">
        <a v-bind:href="`/accountPage/${userDataResult.userId}`">
          <UserIcon 
            v-bind:userId="userDataResult.userId"
            v-bind:iconStyle="iconStyle"
          />
          <!-- <div v-if = "userDataResult.icon !== ''" >
          <img v-bind:src="userDataResult.icon" alt="icon" class="searchPage-iconImg" />
        </div>
        <div v-else>
          <img src= "../../public/noIcon.png" alt="icon" class="searchPage-iconImg" />
        </div> -->
        </a>
      </div>

        <div class="searchPageNameSet">
          <p class="searchPageUserName">{{ userDataResult.userName }}</p>
          <p>{{ userDataResult.name }}</p>
        </div>
      </div>

      <!-- <div>
      <CurrentUserPosts v-bind:userId="searchResultUserId" />
    </div> -->
  </div>
    </div>
  </div>
</template>

<style scoped>
.searchPage-250px{
  margin-left: 250px;
  margin-top: 25px;
}
.searchPage-auto{
  margin:auto;
  width:500px
  
}
.searchPage-50{
  border: solid 1px silver;
  background-color: white;
  width:90%;
  margin-left: 10%;
  height:600px;
}
.searchPage-text{
  font-size: x-large;
  font-weight: bold;
  padding: 15px;
}
.searchPage-forminput{
  margin-bottom: 20px;
  border-bottom: solid 1px silver;
}
.searchPage-form{
  padding-left: 15px;
  padding-top: 5px;
  outline: none;
  margin-bottom: 20px;
}

.searchPage-Result{
  display: flex; 
  margin-top: 10px;
}

.searchPage-iconImg{
margin-left: 10px;
margin-top: 5px;
margin-right: 10px;
/* width: 50px;
height: 50px;
border-radius: 50%; */
}
.searchPageNameSet{
  margin-top: 5px;
  margin-left: 10px;
}
.searchPageUserName{
  font-weight: bold;
}

.searchPage-input{
  /* background-color: #f5f5f5;
  border-radius: 5px;
  outline:solid 1px #f5f5f5;
  outline: none; */
  width:70%;
} 




/* .s {
  margin-left: 500px;
  margin-right: 300px;
  margin-top: 25px;
  border: solid 1px silver;
  background-color: white;
} */
/* .search{
    text-align: center;
} */
/* .text {
  font-size: x-large;
  font-weight: bold;
  padding: 15px;
} */

/* .i {
  margin-bottom: 20px;
  border-bottom: solid 1px silver;
} */
/* .input {
  padding-left: 15px;
  padding-top: 5px;
  outline: none;
  margin-bottom: 20px;
} */
/* .inp {
  background-color: #f5f5f5;
  border-radius: 5px;
  /* outline:solid 1px #f5f5f5; */
  /* outline: none; */
/* }  */
/* .iconImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
} */
/* .searchPageNameSet {
  margin-top: 5px;
  margin-left: 10px;
} */
/* .searchPageResult {
  display: flex; */
  /* margin-top: 10px; */
/* } */

/* .searchPageUserName { */
  /* font-weight: bold; */
/* } */
</style>
