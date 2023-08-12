<template>
  <div>
    menuList
    <ul>
        <li v-for="item in base_data.left_menu_base_mi_arr">
            <span> {{ base_data.menus_i18n_map[item1] || "" }}</span>
        </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => { },
  },
  base_data: {
    type: Object,
    default: () => { },
  }
})
onMounted(() => {
   
});
</script>
