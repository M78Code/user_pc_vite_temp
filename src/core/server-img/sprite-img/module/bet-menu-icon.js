// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
import server_resource from "app/job/output/merchant/server-resource.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
  local_dev: "bet-menu-icon",
  local_test: "bet-menu-icon",
  local_ylcs: "bet-menu-icon",
  idc_pre: "bet-menu-icon",
  idc_sandbox: "bet-menu-icon",
  idc_lspre: "bet-menu-icon",
  idc_online: "bet-menu-icon",
  night: "图片地址",
  day: "图片地址",
};

const item = {
  item_0: 0, //下标从0开始
  item_1: 1,
  item_2: 2,
  item_3: 3,
  item_4: 4,
  item_5: 5,
  item_6: 6,
  item_7: 7,
  item_8: 8,
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

  const height = 36; //表示是 纵 向
  const y_space = 15; //每张图的间距 y
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
  let url = get(server_resource, `${config[CURRENT_ENV]}.${theme}`);
  if (!url) {
    //从本地拿
    url = get(config, theme);
  }
  return {
    "background-image": `url(${url})`,
    "background-position": compute_position(key),
  };
}

export { compute_css };
