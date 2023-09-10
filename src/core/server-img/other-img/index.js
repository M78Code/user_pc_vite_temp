import server_resource from "app/job/output/merchant/server-resource.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;

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
function compute_css({ key    , theme }) {
  let config = all_other_image[key] || {};

  console.log(CURRENT_ENV, "CURRENT_ENV");
  //从打包的 环境拿 图片地址
  let url = get(
    server_resource,
    `${config[CURRENT_ENV] || config["default"]}.${theme}`
  );
  if (!url) {
    //从本地拿
    url = get(config, theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-size": "contain",
  };
}

export default compute_css;
