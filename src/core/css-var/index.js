

import final_css_config from "app/job/output/css/index.json"

import UserCtr from "src/core/user-config/user-ctr.js";

const BUILDIN_CONFIG = window.BUILDIN_CONFIG;
const PROJECT_NAME = BUILDIN_CONFIG.TARGET_PROJECT_NAME;
// const IS_PC = PROJECT_NAME.includes("pc");


// 处理  演示代码 
// 全局的   
// const modules = import.meta.globEager("./module/*.js");
const global_modules = import(`../../../project/${PROJECT_NAME}/src/css/variables/global/*js`);
const component_modules = import(`../../../project/${PROJECT_NAME}/src/css/variables/component/*js`);

const conmpute_css_obj = (modules) => {
  let css_obj = {}
  Object.keys(modules).forEach((path) => {
    let arr = path.split("/")
    let key = arr[arr.length - 1]
    key = key.substring(0, key.length - 3)
    modules[path]().then((module) => {
      css_obj[key] = module.default;
    })
  });
  return css_obj
}

const all_css = {
  global: conmpute_css_obj(global_modules),
  component: conmpute_css_obj(component_modules)
};

/**
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */

export const compute_css_variables = ({ category, module }) => {
  let css_obj = all_css[category][module] || {}

  let keys = Object.keys(css_obj)

  let final_obj = {}

  for (let key in css_obj) {
    // output final_css_config 输出格式不对，先注释
    // final_obj[`--q-${key}`] = final_css_config[category][module][UserCtr.theme]
    final_obj[`--q-${key}`] = css_obj[key]
  }

  return final_obj

}

