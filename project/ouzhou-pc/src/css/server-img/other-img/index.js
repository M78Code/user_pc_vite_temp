import server_resource from "app/job/output/assets/index.json";
import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
import UserCtr from "src/core/user-config/user-ctr.js";

import all_other_image from "./config/index.js";
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({ key, theme, path }) {
  // 当前主题的 服务端配置
  let theme_config = server_resource[theme] || {};
  //最终资源键 计算
  let final_key = key;
  let key_config = all_other_image[key]
  if (key_config) {
    final_key =  key_config[CURRENT_ENV] ||key_config["default"];
   
  }
  //从打包的 环境拿 图片地址
  let url = theme_config[final_key] || "";
  return path
    ? { url }
    : {
        "background-image": `url(${url})`,
        "background-repeat": "no-repeat",
      };
}

export default compute_css_obj;
