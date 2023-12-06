import { ref } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import { MenuData } from "src/output/index.js";
//是否为mini状态
/**
 * main_menu_toggle 左侧列表显示形式 default: 'normal' -- normal：展开 mini：收起
 * is_mini_menu 获取菜单收起状态 default: false
 */
const is_mini_menu = ref(MenuData.left_menu_is_mini);
const main_menu_toggle = ref(MenuData.left_menu_status);
//监听宽度变化/单击事件
const list_emit = [
  useMittOn(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, (v) => {
    is_mini_menu.value = v == "mini";
    main_menu_toggle.value = v;
  }).off,
];

export { is_mini_menu, main_menu_toggle, list_emit };
