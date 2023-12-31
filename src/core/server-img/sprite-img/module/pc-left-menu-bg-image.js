// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 

import server_resource from "app/job/output/assets/index.json";
import UserCtr from "src/core/user-config/user-ctr.js";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"pc-left-menu-bg-image",
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
  item_0: 0, //下标从0开始
  item_1: 1,
  item_2: 3,
  item_3: 28,
  item_4: 2,
  item_5: 19,
  item_6: 4,
  item_7: 15,
  item_8: 7,
  item_9: 6,
  item_10: 22,
  item_11: 13,
  item_12: 10,
  item_13: 12,
  item_14: 20,
  item_15: 8,
  item_16: 14,
  item_17: 17,
  item_18: 26,
  item_19: 21,
  item_20: 16,
  item_21: 18,
  item_23: 29,
  item_24: 30,
  item_25: 31,
  item_28: 33,
  item_29: 32,
  item_40: 35,
  item_50: 9,
  item_100: 41,
  item_101: 38,
  item_102: 40,
  item_103: 39,
  item_10001: 36,
  item_10002: 37,
  item_10003: 38,
  item_30: 42,
  item_31: 43,
  item_32: 44,
  item_26: 45,
  item_27: 46,
  item_33: 47,
  item_34: 48,
  item_35: 49,
  item_36: 50,
  item_37: 51,
  item_38: 52,
  item_39: 53,
  item_22: 55,
  item_1010: 56,
  item_1002: 11,
  item_1001: 36,
  item_1004: 37,
  item_1011: 23,
  item_1009: 24,
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

  const height = 25; //表示是 纵 向
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
function compute_css_obj({ position, theme }) {
  //从打包的 环境拿 图片地址
  let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${UserCtr.theme}`);
  if (!url) {
    //从本地拿
    url = get(config, UserCtr.theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-position": compute_position(position),
  };
}

export { compute_css_obj };
