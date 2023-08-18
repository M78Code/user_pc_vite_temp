<!-- 页面头部容器-->
<template>
  <div class="yb-h5-layout-header">
    <!-- 一级菜单 -->
    <ul>
      <li v-for="(item, index) in menu_list">
        <span @click="setMenu(item)">
          {{ item }}-{{ menu_obj.menus_i18n_map[item] || "" }}</span
        >
      </li>
    </ul>
    一级菜单下 menu 的二级
    <ul>
      <li v-for="(item, index) in menu_obj.get_current_lv_2_menu_list.sl">
        <span @click="setLv2Menu(item)">
          {{ item }}
          </span
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "src/store-redux/index.js";
import menu_obj from "src/core/menu-h5/menu-data-class.js";
const menu_list = ref([]);
const current_lv2_menu = ref({});
onMounted(() => {
  menu_list.value = menu_obj.get_menu_list();
});
//选中一级菜单
const setMenu = (item) => {
  menu_obj.set_current_menu(item);
};
//选中二级菜单
const setLv2Menu = (item) => {
  menu_obj.set_current_lv2_menu(item);
};
</script>
<style lang="scss" scoped>
.yb-h5-layout-header {
  height: 50px;
  ul {
    display: flex;
    li {
      flex: 1;
    }
  }
}
</style>
