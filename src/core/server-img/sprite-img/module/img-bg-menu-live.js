// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
import { server_resource } from "app/job/output/merchant/index.js";
const { CURRENT_ENV } = window.BUILD_CONFIG;
const night = {
  common: "图片地址",
  local_test: "图片地址",
};
const day = {
  local_test: "图片地址",
};
const config = {
  label: "img-bg-menu-live",
  night,
  day,
};
const item = {
  item_0: 0, //下标从0开始
  item_1: 0,
};

/**
 * 根据item 计算雪碧图位置
 * @param {*} key 下标从0开始
 * @returns
 */
function compute_position(key) {
  const top = 0; // 雪碧图 距离顶部的 空白距离
  const left = 0; //左侧
  const width = 0; //表示是 横 向
  const x_space = 0; //每张图的间距 x

  const height = 40; //表示是 纵 向
  const y_space = 10; //每张图的间距 y
  const _v = item[key];
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
function compute_css({ key, theme }) {
  //从打包的 环境拿 图片地址
  let { theme } = server_resource[config.label] || {};
  if (!theme) {
    //从本地拿
    theme = config[theme] ? config[theme][CURRENT_ENV] : undefined;
    if (!theme) {
      //从本地公共拿
      theme = config.common ? config.common[CURRENT_ENV] : undefined;
    }
  }
  return {
    "background-image": `url(${theme})`,
    "background-position": compute_position(key),
  };
}

export { compute_css };
