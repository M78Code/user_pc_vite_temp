<template>
  <div id="ty-app">
    <h1>客户端模块化+SDK版本</h1>
    <img src="images/tes.png" alt="" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { http } from "src/core/http/index";
onMounted(() => {
  console.log(http);
  document.querySelector("#loading-root-ele").style.display = "none";
});
</script>

<style lang="scss" scoped>
</style>