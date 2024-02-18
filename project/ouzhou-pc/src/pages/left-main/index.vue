<!--
 * @Description: 主菜单
-->
<template>
  <div class="c-main-menu column">

    <div style="display:none;"> {{ MenuData.menu_data_version }} </div>
    
    <LeftMenuTemplate1/>
    
  </div>
</template>

<script setup>

import LeftMenuTemplate1 from "src/base-pc/components/menus/menu.vue";

import { MenuData } from "src/output/index.js";

</script>

<style lang="scss" scoped>
.c-main-menu {
  font-size: 13px;
  /* *** 头部 ************ -S */
  z-index: 211;
  width: 100%;
}
</style>