import store from "src/store-redux/index.js";
import { onBeforeUnmount, ref } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt";
const { layoutReducer } = store.getState();
//是否为mini状态
const is_mini_menu = ref(layoutReducer.left_menu_is_mini);
const main_menu_toggle = ref(layoutReducer.left_menu_is_mini);

//监听宽度变化/单击事件
const list_emit = [
  useMittOn(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, (v) => {
    is_mini_menu.value = v == "mini";
    main_menu_toggle.value = v;
  }).off,
];

export { is_mini_menu, main_menu_toggle, list_emit };
