import { createApp } from "vue";
import { Quasar } from "quasar";
// import { createPinia } from 'pinia'
// const pinia = createPinia()
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
// Import Quasar css
import "quasar/src/css/index.sass";
// import BetBoxDialog from "../../src/components/test/bet-box-dialog.vue";
//所有的组件
 

const  ALL_COMPONENTS_GLOB = import.meta.glob("./components.js",{ eager: true });
const  ALL_COMPONENTS  =Object.values(ALL_COMPONENTS_GLOB)[0]['default'] 
console.log('ALL_COMPONENTS----------',ALL_COMPONENTS);

 
//初始化域
// import init_domain from "src/core/http/domain.js";
//所有组件的key
let ALL_COMPONENTS_NAMES = Object.keys(ALL_COMPONENTS);
console.log('ALL_COMPONENTS_NAMES',ALL_COMPONENTS_NAMES);
// import * as EMITTER from "src/core/mitt/index.js";//mitt
// 环境配置
import final_config_env from "app/job/output/env/index.js";
/**
 * 根据参数生成实例
 */
const draw_component = (config) => {
  let { dom_id, component, props } = config;
  let component_module = ALL_COMPONENTS[component];
  if (!component_module) {
    window.alert("组件未注册");
    return false;
  }
  let instance = null;
  if (props) {
    instance = createApp(component_module, props);
  } else {
    instance = createApp(component_module);
  }
  instance.use(Quasar, {
    plugins: {},
  });
  instance.mount(dom_id);
  return instance
};
function init_env() {
  window.env = final_config_env;
}



const  install=(app, options)=>{
  //https://cn.vuejs.org/guide/reusability/plugins.html
  // 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
  // 通过 app.provide() 使一个资源可被注入进整个应用。
  // 向 app.config.globalProperties 中添加一些全局实例属性或方法
  ALL_COMPONENTS_NAMES.forEach(item => {
    app.component(item, ALL_COMPONENTS[item])
  })
}

console.log('ALL_COMPONENTS_NAMES',ALL_COMPONENTS_NAMES);
const SDK = {
  install, 
  init_env,
  ALL_COMPONENTS_NAMES,
 
 
  draw_component,
  // init_domain,
  // EMITTER,
};
export default SDK;
