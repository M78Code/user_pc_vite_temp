import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
import all_other_image from "./module/h5.js";
import all_assets from "app/job/output/assets/index";
/**
 * 拿图片地址 和位置
 * @param {*} param0 
 * @returns 
 */
function compute_css({ key, theme }) {
  const server_resource = all_assets[theme]
  //先从商户配置拿 再从本地拿 
  let url = server_resource[key]
  if (!url) {
    //从本地拿
    url = get(all_other_image, CURRENT_ENV);
  }
  return {
    "background-image": `url(${url})`,
    "background-repeat": 'no-repeat'
  };
}

export default compute_css;
