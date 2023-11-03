<!--
 * @Author: rise
 * @Date: 2023-10-31 19:13:00
 * @LastEditors: rise
 * @LastEditTime: 2023-11-03 13:30:59
 * @Description:  
-->
<template>
  <template v-if="['matchList', 'sport_menu'].includes(route.name)">
    <!--  顶部菜单 -->
    <TopMenu />
    <!-- 滑动菜单组件 -->
    <ScrollMenu />
    <!--  -->
    <!-- <SwitchWap /> -->
    <!--  -->
    <SearchTab @searchHandle="select_dialog = true"/>
    <!-- 筛选+搜索   已脱离文档流-->
    <div v-if="select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="select_dialog = false" />
        <setect-league @closedHandle="select_dialog = false"></setect-league>
    </div>
  </template>
</template>

<script setup> 
import {
  ref
} from "vue";
import { useMittOn, MITT_TYPES } from "src/core/";
import { TopMenu,ScrollMenu,SearchTab,SwitchWap } from 'src/base-h5/components/menu/app-h5-menu/index'
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { useRoute } from "vue-router";
const route = useRoute();
const inner_height = window.innerHeight;  // 视口高度
const select_dialog = ref(false)//暂时筛选窗口
// 监听搜索框状态
useMittOn(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, function (value) {
    select_dialog.value = value
  }).off

</script>