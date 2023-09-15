import server_resource from "app/job/output/merchant/server-resource.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
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
function compute_css({ key, theme }) {
  console.error('sss',all_other_image)
  let config = all_other_image[key] || {};
  //从打包的 环境拿 图片地址
  let url = get(
    server_resource,
    `${config[CURRENT_ENV] || config["default"]}.${UserCtr.theme}`
  );
  if (!url) {
    //从本地拿
    url = get(config, CURRENT_ENV) || get(config, UserCtr.theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-size": "contain",
    "background-repeat": 'no-repeat'
  };
}

export default compute_css;
