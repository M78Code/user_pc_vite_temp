<!--
 * @Author: jiffy
 * @Date: 2023-08-01 18:37:50
 * @LastEditTime: 2023-08-04 10:41:02
 * @LastEditors: jiffy
 * @Description: 说明
 *  
-->
<template>
  <div id="ty-app">
    <MainLayOut />
    <!-- <h1>客户端模块化+SDK版本</h1>
    <img src="images/tes.png" alt="" /> -->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import MainLayOut from "./src/pages/main_layout.vue";

onMounted(() => {
  // document.querySelector("#loading-root-ele").style.display = "none";
});
</script>

<style lang="scss" scoped>
</style>