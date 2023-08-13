<template>
  <div>
    menuList
    <ul>
      <li v-for="(item, index) in base_data.left_menu_base_mi_arr">
        <span @click="setMenu(item)">
          {{ item }}-{{ base_data.menus_i18n_map[item] || "" }}</span
        >
      </li>
    </ul>
    选中 menu 列表{{ base_data.menus_i18n_map[current_menu] }}
    <ul>
      <li v-for="(item, index) in current_menu_list.sl">
        <span> {{ base_data.menus_i18n_map[item.mi] || "" }}-----数量:{{ item.ct }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
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
const current_menu_list = ref([]);
onMounted(() => {});
const setMenu = (item) => {
  current_menu.value = item;
  let mi = item;
  current_menu_list.value = props.base_data.mew_menu_list_res.find((x) => x.mi == mi) || {
    sl: [],
  };
  // menu_config.set_left_menu_result(current_menu)
};
</script>
