/**
 * 根据节点 注册 变量 到对应节点
 * 这里提供方法
 *
 *
 * 需要实现：
 * 1.读取最终商户配置内的 CSS key  
 * job\output\merchant\config.json
 *
 */

import theme_list from "app/job/output/theme/index.json";
import all_css_keys from "app/job/output/css/index";
import { ref, computed } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, (_v) => {
  current_theme.value = _v;
});

function get_theme_list() {
  return theme_list
}
export {
  get_theme_list
}
