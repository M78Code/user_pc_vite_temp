
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
    default: "h5-demo-demo",
};

// x y 
const item = {
    item_1: 0, // 足球
    item_2: -23, // 蓝球
    item_5: -46, // 网球
    item_7: -69, // 斯诺克
    item_10: -115, // 羽毛球
    item_8: -138, // 乒乓球
    item_9: -161, // 排球
    item_4: -184, // 冰球
    item_3: -207, // 棒球
    item_114: -230, // 橄榄球
}
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({ position, theme  ,path  }) {
 // 当前主题的 服务端配置
  let theme_config=   server_resource[theme] ||{}
   //最终资源键 计算
   let final_key = ''  
   final_key =   config[CURRENT_ENV] || config['default']
  //从打包的 环境拿 图片地址
  let url =theme_config[final_key] ||'';
 
    return  path?{url}:{
        "background-image": `url(${url})`,
        "background-position-x": `36px`,
        "background-position-y": `${item[position]}px`,
    };
}

export { compute_css_obj };