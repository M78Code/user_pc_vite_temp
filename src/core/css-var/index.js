
import themes from "app/job/output/css/index";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";

 
/**
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */
export function compute_css_variables({ category, module }) {
  const _theme_key = themes[LocalStorage.get('default-theme') || 'theme-1']
  let final_obj = {}
  if (_theme_key) {
    let css_obj =lodash.get(_theme_key[category],module,{})
    for (let key in css_obj) {
      final_obj[`--q-${key}`] = css_obj[key]
    }
  }
  return final_obj
}