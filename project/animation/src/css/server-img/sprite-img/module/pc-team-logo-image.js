// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
// const server_resource = {}
import lodash from "lodash";

import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"pc-team-logo-image",
};
// 电竞赛种csid
const e_sport_csids = [101, 100, 102, 103];
/**
 * @description: 获取图片完整网络路径
 * @param {String} path 图片路径
 * @return {String} csid 球种类型
 */
const get_server_file_path = (path, csid = 0) => {
  if (!path || path == 'undefined') {
    return '';
  }
  // 如果是http开头 直接返回地址
  if (lodash.toString(path).indexOf('http') == 0) {
    return path
  }
  // // 电竞菜单下如果type没有传值，默认为2
  // let _menutype = _.get(window,'vue.$store.getters.get_menu_type')
  // if (_menutype == 3000 && !type) {
  //   type = 2
  // }
  // 电竞图片域名模式
  if (e_sport_csids.includes(1 * csid)) {
    return `${GLOBAL_CONSTANT.E_SPORTS_DOMAIN_IMG}/${path}`;
  }
  //新配置是 数组
  let DOMAIN_RESULT_ = lodash.get(BUILDIN_CONFIG,'DOMAIN_RESULT') 
  const domain_img_str ="https://image.bricblogy.com";
  if (!lodash.isEmpty(domain_img_str)) {
    return `${domain_img_str}/${path}`;
  }

  if (CURRENT_ENV == 'idc_sandbox' || CURRENT_ENV == 'idc_pre' || CURRENT_ENV == 'idc_ylcs') {
    // let api_domain = config.domain[CURRENT_ENV][0];
    let api_domain = DOMAIN_RESULT_.first_one
    // 试玩环境使用生产api图片
    // api_domain = config.domain['idc_online'][0];
    api_domain = api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }

  if ((NODE_ENV == 'development')) {
    // let api_domain = config.domain[CURRENT_ENV][0]; //config没有赋值domain 从老项目迁移
    const { img_domains } = DOMAIN_RESULT_
    let api_domain = img_domains[0]
    api_domain = api_domain && api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }
  let arr = location.host.split(".");
  let api_domain_2 = `${location.protocol}//image.${arr[arr.length - 2]}.${arr[arr.length - 1]}`;
  // api_domain = api_domain.replace(/\/\/.*?\./,'//image.');
  return `${api_domain_2}/${path}`;
}
// x y 
// const item = {
//   item_0_8: [0,8], //下标从0开始
//   item_1: 0,
// };
 // 字母顺序
 const item = {A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,}
/**
 * 根据item 计算雪碧图位置
 * @param {*} position 下标从0开始
 * @returns
 */
function compute_position(position) {
  console.log(position,'position');
  const top = 0; // 雪碧图 距离顶部的 空白距离
  const left = 0; //左侧
  const width = 0; //表示是 横 向
  const x_space = 0; //每张图的间距 x

  const height = position[2]? 44: 28; //表示是 纵 向
  const y_space = 10; //每张图的间距 y
   //如果使用本地图片 position的索引1位真的时候  
  const _v = item[position[1]];
  if (_v > -1) {
    // const x = x_space * _v + _v * width + left;
    // const y = y_space * _v + _v * height + top;
    let y = parseInt(_v * height * 64 / 44 * 100) / 100;
    return `0px -${y}px`;
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
   let theme_config=  {}
    //最终资源键 计算
    let final_key = ''  
    final_key =   config[CURRENT_ENV] || config['default']
   //从打包的 环境拿 图片地址
   let url =theme_config[final_key] ||'';
   //如果有服务器图片，使用cdn图片
  if(position[0]){
    return {
      "background-image": `url(${get_server_file_path(position[0])})`,
      "background-position": "0 0",
      "background-size": "100%",
     " background-repeat":"no-repeat"
    };
  }
  return {
    "background-image": `url(${url})`,
    "background-position": compute_position(position),
    "background-size": "100%",
   " background-repeat":"no-repeat"
  };
}

export { compute_css_obj };
