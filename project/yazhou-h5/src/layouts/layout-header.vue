<!-- 页面头部容器-->
<template>
    <div class="yb-h5-layout-header" >
      <!-- 一级菜单 -->

     <ul>
        <li>滚球</li>
        <li>早盘</li>
        <li>电竞</li>
     </ul>
     {{ menu_obj.get_menu_list() }}
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import store from "src/store-redux/index.js";
  import menu_obj from "src/core/menu-h5/menu-data-class.js";
  const menu_list = ref([]);
  onMounted(()=>{
    menu_list.value = menu_obj.get_menu_list()
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