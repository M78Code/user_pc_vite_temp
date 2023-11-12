<!--
 * @Author: rise
 * @Date: 2023-11-07 16:16:01
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 17:49:29
 * @Description:  
-->
<template>
    <scroll-menu menu_type="1" @changeMenu="changeMenu"/>
    <!-- 赛事列表 -->
    <div class="match_page">
      <MatchContainer />
    </div>
</template>
<script setup>
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { MenuData } from "src/core/index.js";
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (mi) =>{
  MenuData.get_match_render_list();
}
</script>
<style lang="scss" scoped>
  .match_page{
    height: calc(100% - 76px - 122px);
    overflow-y: hidden;
    position: relative;
    .match-list-container{
      height: 100%;
      background: #fff !important;
      :deep(.scroll-wrapper){
        background: #fff !important;
        .s-w-item{
          background: #fff !important;
        }
      }
    }
  }
</style>