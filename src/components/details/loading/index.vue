<template>
  <div class="loading_page">
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/loding.gif`"  alt="">
    <div class="text">LOADING <span class="dot"> </span> </div>
  </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core";
const props = defineProps({
  propsText: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.loading_page{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background-color: rgba(56, 55, 50, 0.01);
  .text{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    color: #000;
    background-color: rgba(56, 55, 50, 0.01);
  }
  img {
    position: relative;
    width: 80px;
    height: 80px;
    margin-right: 8px;
    background-color: rgba(56, 55, 50, 0.01);
  }
  .dot{
    width: 20px;
    height: 1em;
    line-height: 1;
    display: flex; 
    flex-direction: column;
    overflow: hidden;
    padding-left: 3px;
    color: #000;
  }
}
.dot::before{
  content: '... \A .\A ..';
  white-space: pre-wrap;
  position: relative;
  top: 2px;
  animation: dot 2.5s infinite step-end;
}
@keyframes dot{
  33% {transform: translateY(-1em);}
  66% {transform: translateY(-2em);}
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
