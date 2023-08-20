<template>
  <div class="menu-container">
    <ul class="menu-container-lv1">
      <li v-for="(item, index) in menu_list">
        <span @click="setMenu(item)"> {{ menu_obj.lv_1_menu_map[item.mi]||item.mi }}</span>
      </li>
    </ul>
    <ul class="menu-container-lv2">
      <li v-for="(item, index) in current_menu.sl">
        <span @click="setMenuItem(item)">
          {{
            base_data.menus_i18n_map[menu_obj.recombine_menu_desc(item.mi)] ||
            ""
          }}<i>{{ item.ct }}</i>
        </span>
      </li>
    </ul>
    选中 menu 列表euid{{ current_menu_item }}
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import menu_obj from "src/core/menu-h5/menu-data-class.js";
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => {},
  },
  base_data: {
    type: Object,
    default: () => {},
  },
});
const current_menu = ref("101");
//选中的球类
const current_menu_item = ref("");
const menu_list = ref([]);
const e_uid = ref("");
onMounted(() => {
  menu_list.value = menu_obj.recombine_menu(props.base_data.mew_menu_list_res);
  setMenu(menu_list.value[0])
});
//选中二级菜单
const setMenuItem = (item) => {
  current_menu_item.value = item;
  menu_obj.set_current_lv2_menu(item)
};
const setMenu = (item) => {
  current_menu.value = item;
  menu_obj.set_current_menu(item)
};
</script>
<style lang="scss">
.menu-container-lv1{
  display: flex;
  list-style: none;
  li {
    list-style: none;
    flex: 1;
    text-align: center;
  }
}
.menu-container-lv2 {
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 0.13rem;
  padding-bottom: 0.05rem;
  flex-wrap: nowrap;
  display: flex;
  list-style: none;
  li {
    width: 0.7rem;
    height: 100%;
    flex-shrink: 0;
    display: flex;
  }
}
</style>
