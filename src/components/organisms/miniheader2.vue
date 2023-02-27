<script setup lang="ts">
</script>

<template>
<!-- <div v-if to="/profireChange> -->

<div class="miniheader2">

    <div class="prosoto">
<router-link to="/profileChange">
<p class="pro2">プロフィールを編集</p>
</router-link>
</div>

<div class="passsoto">

<p class="pass2">パスワードを編集</p>

</div>

<!-- </div> -->
</div>

</template>

<style>
.miniheader2{
    margin-left: 330px;
    /* width: 85px; */
    height: 425px;
    /* max-width: 350px; */
    min-width: 200px;
    border-left: 1px solid silver;
    border-top: 1px solid silver;
    border-bottom: 1px solid silver;

    position: fixed;
    font-size: 15px;
    /* font-weight: bold; */
}
/* .prosoto{
    border-bottom: 1px solid silver;
} */
/* .passsoto{
    border-bottom: 1px solid silver;
}  */
.pro2{
    margin-top: 50px;
    margin-left: 10px;
    /* margin-bottom: 30px; */
    /* border-bottom: 1px solid silver; */
 
}

.pass2{
    margin-top: 50px;
    margin-left: 10px;
    margin-bottom: 30px;
    font-weight: bold;
}
</style>
