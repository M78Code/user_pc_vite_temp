

import final_css_config from "app/job/output/css/index.json"
import { computed, ref } from "vue";
import { UserCtr, useMittOn, MITT_TYPES } from "src/core/";

/**/
// const theme= ref(UserCtr.theme);
// useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, function () {
//   theme.value = UserCtr.theme;
// })

const file_themes = import.meta.glob("app/job/output/theme/*json", { eager: true });
const themes = {}
//将文件 转换为 对象
for (let file_path in file_themes) {
  const file_name = String(file_path).replace('.json', '').split('/').pop()
  themes[file_name] = file_themes[file_path].default
}
/**
 * 多主体格式
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */
export function compute_css_var({ category, module }) {
  const { css } = themes[UserCtr.theme]
  let final_obj = {}
  for (let key in css) {
    final_obj[`--q-${key}`] = css[key]
  }
  return final_obj
}

/**
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */
export function compute_css_variables({ category, module }) {
  let css_obj = final_css_config[category][module] || {}
  let final_obj = {}
  for (let key in css_obj) {
    // output final_css_config 输出格式不对，先注释
    // final_obj[`--q-${key}`] = final_css_config[category][module][UserCtr.theme]
    final_obj[`--q-${key}`] = css_obj[key][UserCtr.theme]
  }
  return final_obj
}