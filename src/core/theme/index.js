/**
 * 根据节点 注册 变量 到对应节点
 * 这里提供方法
 *
 *
 * 需要实现：
 * 1.读取最终商户配置内的 CSS key   {activity-bg-color：{day:"",night:""}}
 * job\output\merchant\config.json
 *
 */

import merchant_config from "app/job/output/merchant/config.json";
import all_css_keys from "app/job/output/css/index";
import { ref, computed } from "vue";
import store from "src/store-redx/";

import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
const { langReducer } = store.getState();
const current_theme = ref(langReducer.theme);
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, (_v) => {
  current_theme.value = _v;
});

//前缀名称
const css_prefix = "--qq--";
/**
 * 获取当前节点的 CSS 变量值  style 对象
 * @param {*} css_module
 */
export const compute_css_var_style = (css_module) => {
  //要看看最后css的解构是如何的
  return computed(() => {
    if(!all_css_keys[css_module])return {}
    return all_css_keys[css_module].reduce((obj, key) => {
      css_prefix;
      obj[`${css_prefix}${key}`] =
        merchant_config.css[key][current_theme.value];
      return obj;
    }, {});
  });
};
let all_var_obj = {
  global: {
    "activity-bg-color": { day: "", night: "" },
  },
  activity: {
    "activity-bg-color": { day: "", night: "" },
  },
};
