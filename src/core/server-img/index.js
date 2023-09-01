import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import { MITT_TYPES, useMittOn } from "../mitt/";
import store from "src/store-redx/";
const { langReducer } = store.getState();
import { ref, computed } from "vue";
const theme = ref(langReducer.theme);
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, (_v) => {
  theme.value = _v;
});
// import
const compute_css = ({ key, label }) => {
  return computed(() => {
    // img-bg-menu-live
    const func = key ? sprite_compute[label] : other_compute[label];
    return func({ key, label, theme: theme.value });
  }).value;
};

export { compute_css };


/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， label 是 精灵图内 item 单个元素的 标识键
 *  
 * 对于 非 精灵图  key  统一 :'other-image'  ， label 是  单个素材资源的 标识键
 * 
 */