// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

import server_resource from "app/job/output/assets/index.json";
import UserCtr from "src/core/user-config/user-ctr.js";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"icon-sport-top",
  // local_dev: "pc-left-menu-bg-image",
  // local_test: "pc-left-menu-bg-image",
  // local_ylcs: "pc-left-menu-bg-image",
  // idc_pre: "pc-left-menu-bg-image",
  // idc_sandbox: "pc-left-menu-bg-image",
  // idc_lspre: "pc-left-menu-bg-image",
  // idc_online: "pc-left-menu-bg-image",
 
};
// x y 
const item = {
  1: 0,
  2: 1,
  3: 5,
  4: 10,
  5: 6,
  6: 8,
  7: 13,
  8: 2,
  9: 3,
  10: 4,
  11: 12,
  12: 9,
  13: 14,
  14: 15,
  15: 16,
  16: 12,
  17: 20,
  18: '',
  19: 12,
  20: 25,
  21: 13,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 1,
  28: 1,
  29: 1,
  30: 1,
  31: 1,
  32: 1,
  37: 1,
  38: 1,
  100: 1,
  101: 1,
  102: 1,
  103: 1,
};

/**
 * 根据item 计算雪碧图位置
 * @param {*} position 下标从0开始
 * @returns
 */
function compute_position(position) {
  const top = 0; // 雪碧图 距离顶部的 空白距离
  const left = 0; //左侧
  const width = 0; //表示是 横 向
  const x_space = 0; //每张图的间距 x

  const height = 70; //表示是 纵 向
  const y_space = 0.5; //每张图的间距 y
  const _v = item[position];
  if (_v > -1) {
    const x = x_space * _v + _v * width + left;
    const y = y_space * _v + _v * height + top;
    return `-${x}px -${y}px`;
  }
  return "0 0";
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
    "background-position": compute_position(position),
  };
}

export { compute_css_obj };
