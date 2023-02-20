<script setup lang="ts">
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import {ref} from "vue";


const userData :any= ref()
const iconUrl :any= ref()
const sonotaKanri :any= ref(false)

onAuthStateChanged(auth, (currentUser: any) => {
    console.log(currentUser.uid)
    const loginUserData = doc(db, "users", currentUser.uid);
    getDoc(loginUserData).then((data) => {
    userData.value = data.data();
    iconUrl.value=userData.value.icon
    });
});

const sonota =() =>{
    sonotaKanri.value= !sonotaKanri.value
    console.log(sonotaKanri.value)
}

</script>

<template>

<div class="header">

<div class="logo">
<img  class="logoImg" src="../../../public/logo_transparent.png"/>
</div>

<ul class="ul">

<router-link to="/home">
<li class="li">
<div>
<p>🏠 ホーム</p>
</div>
</li>
</router-link>

<router-link to="/searchPage">
<li class="li">
<div>
<p>🔍 検索</p>
</div>
</li>
</router-link>

<router-link to="/newPost">
<li class="li">
<div>
<p>📷 作成</p>
</div>
</li>
</router-link>

<router-link to="/myAccountPage">
<li class="li">
<div>
<div class="prof">
    <img v-bind:src="iconUrl" alt="icon" class="icon" />
     <p class="profName">プロフィール</p></div>
</div>
</li>
</router-link>

<li class="liEnd">

<div v-if="sonotaKanri">
<button @click="sonota"><p>🌱 その他</p></button>
<div class="ul2">
<router-link to="/profileChange">
<p class="li">⚙️ 設定</p>
</router-link>
<!-- <router-link to="/profileChange"> -->
<p class="li">📂 保存済み</p>
<!-- </router-link> -->
<router-link to="/logout">
<p class="li">ログアウト</p>
</router-link>
</div>
</div>

<div v-else>
<button @click="sonota"><p>🌱 その他</p></button>  
</div>


</li>

</ul>

</div>

</template>

<style scoped>
.logo{
    width: 90px;
    margin: 20px auto 0 auto;
}
.logoImg{
    width:70px;
    height: 70px;
}
.icon{
    width:40px;
    height:40px;
    background-color: #c0c0c0;
    border-radius:50%;
}

.header{
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
.ul{
    height: 450px;
    width: 90%;
    margin: 50px 0 0 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 10%;
}
.ul2{
    height: 100px;
    width: 90%;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 10%;
}
.li{
    margin: 0 auto;
    padding: 0;
    padding-left: 10px;
    width: 100%;
    list-style: none;
}
.liEnd{
    margin: 0 auto;
    padding: 0;
    padding-left: 10px;
    width: 100%;
    list-style: none;
    /* margin-top: 100px; */
}
.profName{
    display: grid;
    place-items: center;
    margin-left: 10px;
}
.prof{
    display: flex;
}
</style>
