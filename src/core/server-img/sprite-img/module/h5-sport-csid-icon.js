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
    101:0,  //足球
    102:2,  //篮球
    103:18, //棒球
    104:16, //冰球
    105:4, //网球
    106:24, //美足
    107:10, //斯诺克
    108:8, //乒乓球
    109:14, //排球
    110:6, //羽毛球
    111:26, //手球
    112:12, //拳击
    113:30, //沙滩排球
    114:28, //橄榄球
    115:40, //曲棍球
    116:34, //水球
    117:17, //田径  ?
    118:22, //政治娱乐
    119:48, //游泳
    120:50, //体操
    121:42, //跳水
    123:52, //举重
    124:54, //射箭
    125:58, //击剑
    128:44, //高尔夫
    129:76, //自行车
    140:35, //其他  ?
    150:9, //趣味  ?
    2100:100, //LOL
    2102:106, //CS.GO
    2101:104, //Dota2
    2103:102, //王者荣耀
    30:60, //赛马
    31:62, //帆船
    32:74, //划船
    26:32, //冰壶
    27:46, //跆拳道
    33:47, //赛车  ？
    34:48, //柔道 ？
    35:49, //空手道 ？
    36:50, //摔跤
    37:51, //板球 ?
    38:52, //飞镖 ?
    39:53, //沙球 ?
    22:55, //射击 ？
    1001:88, //VR足球
    1002:94, //VR赛狗
    1004:90, //VR篮球
    1010:96, //VR摩托车
    1011:92, //VR赛马
    1009:98, //VR泥地摩托车
    2000:72, // 电子竞技
    300:86, //VR体育
    400:68, //冠军
};// 0 - 54个
// 足球 - 棒球 10   射击= 类似棒球 20  击剑 30  摔跤 40  英雄联盟上面那个 50

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
