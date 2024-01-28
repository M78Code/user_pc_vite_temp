/**
 * @Author: hanmar
 * @Date: 2023-11-12 13:52:55
 * @Description: main.js公共配置方法
 */

import BUILDIN_CONFIG from "app/job/output/env/index.js";
/**
 * @description: 设置全局访问app key值
 * @param app vue实例app
 * @param obj key值对象
 */
const set_global_app_key = (app, obj) => {
  if(app && obj) {
    for (const key in obj) {
      if (key && obj[key]) {
        app.config.globalProperties[key] = obj[key];
        window[key] = obj[key];
      }
    }
  }
}

/**
 * @description: app文件公共配置函数
 * @param app vue实例app
 */
const main_js_common_fun = (app) => {
  // app.config.globalProperties.lodash = lodash;
  // window.lodash = lodash;
  const obj = {
    'LOCAL_PROJECT_FILE_PREFIX': BUILDIN_CONFIG.LOCAL_PROJECT_FILE_PREFIX,
  }
  // 设置全局访问app key值
  set_global_app_key(app, obj);
}
export { main_js_common_fun };