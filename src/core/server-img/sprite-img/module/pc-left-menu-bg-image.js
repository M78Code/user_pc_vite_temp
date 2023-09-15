// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/merchant/server-resource.json";
import UserCtr from "src/core/user-config/user-ctr.js";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
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

  const height = 40; //表示是 纵 向
  const y_space = 10; //每张图的间距 y
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
function compute_css({ position, theme }) {
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

export { compute_css };
