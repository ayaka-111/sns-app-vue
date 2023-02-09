<script setup lang="ts">

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

<li class="li">
<div>
<p>📷 作成</p>
</div>
</li>

<li class="li">
<div>
<div class="prof"><img class="icon" src="../../../public/noIcon.png" /> <p class="profName">プロフィール</p></div>
</div>
</li>

<li class="liEnd">
<div>
<p>🌱 その他</p>
</div>
</li>

</ul>

</div>

</template>

<style>
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
    margin-top: 100px;
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
