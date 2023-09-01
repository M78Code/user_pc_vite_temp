// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
import server_resource from "app/job/output/merchant/server-resource.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {

 
  'bet-hot-xxxx': {
      label: "bet-hot-xxxx",
      // local_dev: "image01",
 
    
    }
  
}


/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css({ theme }) {
  console.log(CURRENT_ENV, "CURRENT_ENV");
  //从打包的 环境拿 图片地址
  let url = get(server_resource, `${config[CURRENT_ENV]}.${theme}`);
  if (!url) {
    //从本地拿
    url = get(config, theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-size": "contain",
  };
}

export { compute_css };
