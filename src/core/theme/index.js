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

import { ref } from "vue";

import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

current_theme.value = "night";

class CurrentTheme {
  constructor() {
    this.current_theme = ref("day");

    this.all_css_module_obj = {
      global: ref({}),
      activity: ref({}),
    };
  }

  set_current_theme(val) {
    this.current_theme.value = val;
  }

  compute_all_css_module_obj() {
    // this.current_theme.value
  }
}


export default  new CurrentTheme()

/**
 * 获取当前节点的 CSS 变量值  style 对象
 * @param {*} css_module
 */

//  global    activity

export const compute_css_var_style = (css_module) => {
  return {
    "--qq--activity-bg-color": "#fff",
  };
};

let all_var_obj = {
  global: {
    "activity-bg-color": { day: "", night: "" },
  },
  activity: {
    "activity-bg-color": { day: "", night: "" },
  },
};
