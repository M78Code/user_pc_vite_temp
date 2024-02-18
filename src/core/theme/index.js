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

import server_theme_list from "app/job/output/theme/index.json";
import { server_key_map } from "src/boot/i18n.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import lodash from 'lodash'
 //模块之间通信 ，去耦合化的一个 键值对 仓库
 export { GLOBAL_CONSTANT } from "src/core/constant/global/index.js";
 
//查找默认的主题
const theme_map = {}
for (let key in server_theme_list) {
  const val = server_theme_list[key]
  const _i18n = lodash.get(val, "i18n", {})
  const local_i18n = {}
  for (let key in _i18n) {
    local_i18n[server_key_map[key]] = _i18n[key]
  }
  theme_map[key] = {
    ...val,
    i18n: local_i18n,
    _i18n: _i18n
  }
}


const theme_list = Object.values(theme_map).sort((a, b) => a.order - b.order)
let default_theme_key;
let default_theme = theme_list.find(i => i.is_default == 1);
if (default_theme) {
  default_theme_key = default_theme.key
} else {
  default_theme_key = theme_list[0].key
}
// 设置默认主题
LocalStorage.set('default-theme', LocalStorage.get('default-theme') || default_theme_key)

export {
  theme_list,
  theme_map,
  default_theme_key
}
