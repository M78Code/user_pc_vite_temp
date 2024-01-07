<!--
 * @Author: Amor
 * @Date: 2020-08-08 08:56:43
 * @Description: 赛事列表头部——滚球——赛事类型
-->
<template>
  <!-- 球种标题 -->
   <div
     class="match-type text-left col yb-flex-between"
     :class="`match-type-bg${menuInfo.field1}`"
     v-if="menuInfo.menuName"
   >
     <div class="col-left">
       <!-- 球种名称 -->
       {{menuInfo.menuName}}
       <!-- 赛事数量 -->
       <span style="color: rgba(255,255,255,0.9);">{{menuInfo.count}}</span>
     </div>
   </div>
 </template>
  
 <script setup>

  import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
  import {component_symbol ,need_register_props} from "../config/index.js"
  useRegistPropsHelper(component_symbol, need_register_props)
  const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

  
 </script>
 <style lang="scss" scoped>
 .match-type {
   padding: 0 15px 0 10px;
   height: 34px;
   line-height: 34px;
   font-size: 14px;
   cursor: pointer;
   .match-number {
     margin-left: 5px;
   }
   .col-left span {
     margin-left: 5px;
   }
   .icon-refresh-wrap {
     display: none;
   }
   &:hover {
     .icon-refresh-wrap {
       display: block;
     }
   }
 }
 </style>
 
 