import yazhou_h5_css from  "app/job/output/css/yazhou-h5.js"
// 处理 H5 演示代码 
// 全局的   
// const modules = import.meta.globEager("./module/*.js");
const global_modules = import.meta.globEager("../../../../project/yazhou-h5/src/css/global/*js");
const component_modules = import.meta.globEager("../../../../project/yazhou-h5/src/css/component/*js");
  const conmpute_css_obj =(   modules)=>{
    let css_obj={}
    Object.keys(modules).forEach((key) => {
        let arr=  key.split("/")
        let _key = arr[arr.length-1] 
        _key = _key.substring(0,_key.length-3)
        css_obj[_key] = modules[_key].default;
      });
      return   css_obj
  }
 
const all_css=  {
    global: conmpute_css_obj(global_modules),
    component: conmpute_css_obj(component_modules)
};

//  :style =compute_css_var()
/**
 * 
 * @param {*} category  :     global   /  component
 * @param {*} module   :    css 目录下 ：  global   /  component  目录下 ：文件名字  ： 例如  background
 */

export const compute_css_var=( {  category ,module, theme })=>{

   let css_obj=  all_css[category][module] ||{}

   let keys = Object.keys(css_obj)


   let final_obj={}

   for(let key in   css_obj){

    final_obj[`--qq--${key}`] = yazhou_h5_css[key][theme]



   }

   return final_obj 

}

