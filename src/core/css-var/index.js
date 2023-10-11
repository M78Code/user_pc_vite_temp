

import final_css_config from "app/job/output/css/index.json"
import { computed, ref } from "vue";
import { UserCtr, useMittOn, MITT_TYPES } from "src/core/";
import themes from "app/job/output/css/index";

/**/
// const theme= ref(UserCtr.theme);
// useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, function () {
//   theme.value = UserCtr.theme;
// })

/**
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */
export function compute_css_variables({ category, module }) {
  const _theme_key = themes[UserCtr.theme]
  let final_obj = {}
  if (_theme_key) {
    let css_obj =lodash.get(_theme_key[category],module,{})
    for (let key in css_obj) {
      final_obj[`--q-${key}`] = css_obj[key]
    }
  }
  return final_obj
}