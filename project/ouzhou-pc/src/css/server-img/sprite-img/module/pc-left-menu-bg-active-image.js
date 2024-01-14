// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

import server_resource from "app/job/output/assets/index.json";
import UserCtr from "src/core/user-config/user-ctr.js";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"pc-left-menu-bg-active-image",
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
  item_0: 1, //下标从0开始
  item_1: 0, //
  item_2: 1,
  item_3: 9,
  item_4: 8,
  item_5: 2,
  item_6: 12,
  item_7: 5,
  item_8: 4,
  item_9: 7,
  item_10: 3,
  item_11: 13,
  item_12: 6,
  item_13: 15,
  item_14: 14,
  item_15: 20,

  item_16: 15,
  item_17: 23,
  item_18: 11,
  item_19: 24,
  item_20: 25,
  item_21: 21,

  item_22: 27,
  item_23: 26,
  item_24: 27,

  item_25: 29,
  item_26: 16,

  item_27: 40,

  item_28: 22,
  item_29: 38,

  item_30: 30,
  item_31: 31,
  item_32: 37,
  item_33: 33,
  item_34: 42,
  item_35: 40,
  item_36: 39,
  item_37: 19,

  item_38: 28,
  item_39: 18,

  item_40: 57,
  item_50: 35,

  item_90: 55,
  item_91: 56,

  item_100: 50,
  item_101: 52,
  item_102: 53,
  item_103: 51,

  item_1001: 44,
  item_1002: 47,
  item_1004: 45,
  item_1007: 46,
  item_1008: 46,
  item_1009: 49,
  item_1010: 48,
  item_1011: 46,

  item_300: 43,
  item_2000: 36,
  item_400: 34, 
};

/**
 * 根据item 计算雪碧图位置
 * @param {*} position 下标从0开始
 * @returns
 */
function compute_position(position,size) {
  const top = 0; // 雪碧图 距离顶部的 空白距离
  const left = 0; //左侧
  const width = 0; //表示是 横 向
  const x_space = 0; //每张图的间距 x

  const height = size || 18; //表示是 纵 向
  const y_space = 1; //每张图的间距 y
  const _v = item[position];
  if (_v > -1) {
    const x = x_space * _v + _v * width + left;
    const y = y_space * _v + _v * height + top;
    return `-${x}px -${y-_v}px`;
  }
  return "0 0";
}
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({ position, theme  ,path, size  }) {
  // 当前主题的 服务端配置
   let theme_config=   server_resource[theme] ||{}
    //最终资源键 计算
    let final_key = ''  
    final_key =   config[CURRENT_ENV] || config['default']
   //从打包的 环境拿 图片地址
   let url =theme_config[final_key] ||'';
   return  path?{url}:{
    "background-image": `url(${url})`,
    "background-position": compute_position(position,size),
  };
}

export { compute_css_obj };
