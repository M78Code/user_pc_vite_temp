import server_resource from "app/job/output/assets/index.json";
import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
import UserCtr from "src/core/user-config/user-ctr.js";

const modules = import.meta.globEager("./module/*.js");
let all_other_image = {};
Object.keys(modules).forEach((key) => {
  // const module_name = key.replace("./module/", "").replace(".js", "");
  all_other_image = Object.assign(
    all_other_image,
    modules[key].default
  );
});

/**
 * 拿图片地址 和位置
 * @param {*} param0 
 * @returns 
 */
function compute_css_obj({ key, theme, type='' }) {

  let current_theme = UserCtr.theme
  // 当前主题配置 
 
  //先从商户配置拿 再从本地拿 
  let config = server_resource[key] || all_other_image[key] || {};
  //从打包的 环境拿 图片地址
  let url = get(
    server_resource,
    `${config[CURRENT_ENV] || config["default"]}.${UserCtr.theme}`
  );
  if (!url) {
    //从本地拿
    url = get(config, UserCtr.theme);
  }
  return type ? url : {
    "background-image": `url(${url})`,
    "background-repeat": 'no-repeat'
  };
}

export default compute_css_obj;
