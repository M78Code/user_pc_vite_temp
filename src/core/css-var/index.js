

import final_css_config from "app/job/output/css/index.json"

import UserCtr from "src/core/user-config/user-ctr.js";


/**
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */
export const compute_css_variables = ({ category, module }) => {
  console.error(category, module)
  let css_obj = final_css_config[category][module] || {}
  let keys = Object.keys(css_obj)
  let final_obj = {}
  for (let key in css_obj) {
    // output final_css_config 输出格式不对，先注释
    // final_obj[`--q-${key}`] = final_css_config[category][module][UserCtr.theme]
    final_obj[`--q-${key}`] = css_obj[key][UserCtr.theme]
  }
  return final_obj
}

