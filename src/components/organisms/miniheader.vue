<script setup lang="ts">
</script>

<template>
<!-- <div v-if to="/profireChange> -->

<div class="miniheader">

    <div class="prosoto">
<p class="pro">プロフィールを編集</p>
</div>

<div class="passsoto">
<router-link to="/passwordChange">
<p class="pass">パスワードを編集</p>
</router-link>
</div>

<!-- </div> -->
</div>

</template>

<style>
.miniheader{
    margin-top: 50px;
    margin-left: 330px;
    height: 425px;
    min-width: 160px;
    border-left: 1px solid silver;
    border-top: 1px solid silver;
    border-bottom: 1px solid silver;
    position: fixed;
    font-size: 15px;

}
.pro{
    margin-top: 50px;
    margin-left: 10px;
    font-weight: bold;
    
}

.pass{
    margin-top: 50px;
    margin-left: 10px;
    margin-bottom: 30px;
}

</style>
