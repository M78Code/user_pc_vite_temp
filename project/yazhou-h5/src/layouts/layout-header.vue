<!-- 页面头部容器-->
<template>
    <div class="yb-h5-layout-header" >
      <!-- 一级菜单 -->
     <ul>
        <li>滚球</li>
        <li>早盘</li>
        <li>电竞</li>
     </ul>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, reactive } from 'vue'
  import store from "src/store-redux/index.js";
  import menu_obj1 from "src/core/meu-h5/menu-data-class.js";
  onMounted(()=>{
    console.error(menu_obj1,"menudata")
  })
  </script>
 <style lang="scss" scoped>
 .yb-h5-layout-header {
    height:50px ;
    ul{
        display: flex;
        li{
            flex: 1;
        }
    }
 }
 </style>