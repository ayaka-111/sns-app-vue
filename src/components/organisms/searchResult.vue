<!-- <script lang="ts">
import { collection, doc, getDoc, query, where } from '@firebase/firestore';
import { db } from '../../../firebase';
import { defineComponent, ref} from 'vue';


export default defineComponent({
  name: "searchResult",
  props: { userId: String },
  setup: (props) => {
    const searchResultUserId:any=ref([props.userId]);
    const searchResultUserData:any=ref();

    // searchResultUseのusers情報データ取得
    for (const userId of searchResultUserId) {
    //   console.log(userId)
      const resultUserDoc= doc(db, "users", userId);
      getDoc(resultUserDoc).then((resultUserData) => {
        const getData = resultUserData.data();
        if (getData) {
            searchResultUserData.value.push({
            userId: getData.userId,
            name: getData.name,
            userName: getData.userName,
            icon: getData.icon,
          });
        }
      });
    }


    return {
        searchResultUserData,
        searchResultUserId
    };
  },
});

</script>

<template>
      <div v-if="searchResultUserId">
    <div v-for="(user, index) in searchResultUserData" :key="index">
      <a v-bind:href="`/accountPage/${user.userId}`">
        <img v-bind:src="user.icon" alt="アイコン" />
      </a>
      <p>{{ user.name }}</p>
      <p>{{ user.userName }}</p>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>


<style>
</style> -->
