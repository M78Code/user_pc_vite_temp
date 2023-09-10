

import final_css_config from  "app/job/output/css/index.js"

import FINAL_MERCHANT_CONFIG from  "app/job/output/merchant/config.json"

let { project } = FINAL_MERCHANT_CONFIG;

import UserCtr from "src/core/user-config/user-ctr.js";

 
// 处理  演示代码 
// 全局的   
// const modules = import.meta.globEager("./module/*.js");
const global_modules = {}//import.meta.global(`../../../../project/yazhou-pc/src/css/global/*js`);
const component_modules = {}//import.meta.global(`../../../../project/yazhou-pc/src/css/component/*js`);
  const conmpute_css_obj =(   modules)=>{
    let css_obj={}
    Object.keys(modules).forEach((key) => {
        let arr=  key.split("/")
        let _key = arr[arr.length-1] 
        _key = _key.substring(0,_key.length-3)
        css_obj[_key] = modules[_key].default;
      });
      debugger
      return   css_obj
  }
 
// const all_css=  {
//     global: conmpute_css_obj(global_modules),
//     component: conmpute_css_obj(component_modules)
// };

//  :style =compute_css_variables()
/**
 * 
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */

export const compute_css_variables=( {  category ,module    })=>{
   let css_obj=  all_css[category][module] ||{}

   let keys = Object.keys(css_obj)


   let final_obj={}

   for(let key in   css_obj){

    final_obj[`--qq--${key}`] = final_css_config[key][   UserCtr.theme]



   }

   return final_obj 

}

