<template>
  <template v-if="['matchList', 'sport_menu'].includes(route.name)">
    <!--  顶部菜单 -->
    <TopMenu />
    <!-- 滑动菜单组件 -->
    <ScrollMenu />
    <!--  -->
    <SwitchWap />
    <!--  -->
    <SearchTab @searchHandle="select_dialog = true"/>
  </template>
</template>

<script setup> 
import { TopMenu,ScrollMenu,SearchTab,SwitchWap } from 'src/base-h5/components/menu/ouzhou-h5-menu/index'
import { useRoute } from "vue-router";
const route = useRoute();



</script>