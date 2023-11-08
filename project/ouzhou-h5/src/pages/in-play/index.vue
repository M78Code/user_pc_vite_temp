<!--
 * @Author: rise
 * @Date: 2023-11-07 16:16:01
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 17:49:29
 * @Description:  
-->
<template>
    <scroll-menu menu_type="1"  v-if="MenuData.menu_list.length" />
    <div>
        in-play 滚球
    </div>
</template>
<script setup>
import { watch } from "vue";
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import { MenuData } from "src/core/index.js";
watch(() => MenuData.update_time.value, () => {
  console.log("菜单id-球类id-对应euid",`${MenuData.menu_type.value}-${MenuData.menu_mi.value}-${MenuData.get_euid()}`)
})
</script>