import all_sprit_fn from "project_path/src/css/server-img/sprite-img/index.js";
import compute_other_image_css from "project_path/src/css/server-img/other-img/index.js";

import UserCtr from "src/core/user-config/user-ctr.js";
/**
 * 计算精灵图和 其他主题图 的 css
 * 传对象   key: 本地文件的键一般和服务器上一样，但是可以通过配置重定向
 *         position :精灵图 定位键 ， 
 *         path : 1 真值代表返回 {url} 
 * 定位键每个精灵图自己原定自己的 返回自己的 ，不建议 用假值 ：0 类似
 * @param {*} params
 * @returns
 */
const compute_css_obj = (params = {}) => {
  const theme = UserCtr.theme || "theme-1";
  let { key, position, path=0, size } = params;
  if (!key) {
    return {};
  }
  let result = {};
  if (params.hasOwnProperty("position")) {
    //精灵图
    if (all_sprit_fn[key]) {
      result = all_sprit_fn[key]({ position, theme, path, size });
    }
  } else {
    //常规单图  other
    result = compute_other_image_css({ key, theme, path });
  }
  return result;
};


/**
 * 非精灵图返回url 
 * @param {*} key 
 * @returns 
 */              
const  compute_img_url =(key)=>{
  let obj = compute_css_obj({key ,path:1})
  return obj.url

}


export { compute_css_obj ,compute_img_url };
