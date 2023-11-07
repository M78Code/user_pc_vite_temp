<!--
 * @Author: lockie
 * @Date: 2023-07-15 19:10:41
 * @FilePath: \user-pc-vue3\src\components\loading\index.vue
 * @Description: 
-->
<template>
  <div class="loading_wrap">
    <div class="loading_box">
      <img src="" alt="">
      <div>
        LOADING...
      </div>
    </div>
  </div>
</template>

<script setup>
  // import loading_img from 'src/assets/images/loading.gif';

</script>

<style lang="scss">
  .loading_wrap {
    width: 100%;
    height: 100%;
    padding-right: 7px;
    box-sizing: border-box;
  }
  .loading_box {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding-top: 200px;
    background: #FFFFFF;
    box-sizing: border-box;
    img {
      width: 60px;
      height: 60px;
    }
    div {
      font-family: Roboto;
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      color: #1a1a1a;
    }
  }

</style>