// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

import server_resource from "app/job/output/assets/index.json";

import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"pc-home-featured-image",
  // local_dev: "pc-left-menu-bg-image",
  // local_test: "pc-left-menu-bg-image",
  // local_ylcs: "pc-left-menu-bg-image",
  // idc_pre: "pc-left-menu-bg-image",
  // idc_sandbox: "pc-left-menu-bg-image",
  // idc_lspre: "pc-left-menu-bg-image",
  // idc_online: "pc-left-menu-bg-image",
 
};
const item = {
	0: 54, //下标从0开始
  1: 0, //
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,

  10: 9,
  11: 10,
  12: 11,
  13: 12,
  14: 13,
  15: 14,

  16: 15,
  17: 16,
  18: 17,
  19: 18,
  20: 19,
  21: 20,

  22: 21,
  23: 22,
  24: 23,

  25: 24,
	26: 25,

  27: 26,

  28: 27,
  29: 28,

  30: 29,
  31: 30,
  32: 31,
  33: 32,
  34: 33,
  35: 34,
  36: 35,
  37: 36,

  38: 37,
  39: 38,

  40: 39,
  50: 40,

  90: 52,
  91: 53,

  100: 41,
  101: 42,
  102: 43,
  103: 44,

  1001: 45,
  1002: 46,
  1004: 47,
  1009: 48,
  1010: 49,
  1011: 50,
  400: 51,

  2100: 41,
  2101: 42,
  2102: 43,
  2103: 44,

}
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

  const height = 80; //表示是 纵 向
  const y_space = 0; //每张图的间距 y
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
