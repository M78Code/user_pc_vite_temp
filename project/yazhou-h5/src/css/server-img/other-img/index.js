import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
import UserCtr from "src/core/user-config/user-ctr.js";
import all_other_image from "./module/h5.js";
import all_assets from "app/job/output/assets/index";
/**
 * 拿图片地址 和位置
 * @param {*} param0 
 * @returns 
 */
function compute_css({ key, theme }) {
  const server_resource = all_assets[UserCtr.theme]

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
  return {
    "background-image": `url(${url})`,
    "background-repeat": 'no-repeat'
  };
}

export default compute_css;
