// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
// import server_resource from "app/job/output/assets/index.json";
const server_resource = {}
import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  local: "/src/core/server-img/sprite-img/image/pc-popup-language-icon-image-day.png",
  default: "pc-popup-language-icon-image",
};

// 字母顺序
// const item = { zh: 0, tw: 1, tw: 2, vi: 3, ms: 4, th: 5, ad: 6, md: 7, ry: 8, pty: 9, hy: 10, ru: 12 }
const item = { zh: 0, en: 1, tw: 2,  vi: 3,  ms: 4, th: 5, ad: 6, mya: 7,ry:8, pt: 9, ko: 10, es: 11, ru: 12}

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

  const height = 10; //表示是 纵 向
  const y_space = 15; //每张图的间距 y
  const _v = item[position];
 
  if (_v > -1) {
    const x = x_space * _v + _v * width + left;
    const y = y_space * _v  + top;
    // const y = y_space * _v + _v * height + top;
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
  let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${theme}`);
  if (!url) {
    //从本地拿
    url = get(config, theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-position": compute_position(position),
  };
}

export { compute_css_obj };
