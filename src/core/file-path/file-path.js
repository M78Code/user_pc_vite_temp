import lodash from 'lodash'
// 电竞赛种csid
const e_sport_csids = [101, 100, 102, 103];
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
 
import {GLOBAL_CONSTANT } from "src/core/constant/global/index.js"
// 目前环境信息
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const {BUILD_VERSION, IS_DEV, CURRENT_ENV, DOMAIN_RESULT, PROJECT_NAME ,IS_TOPIC_PROJECT,LOCAL_COMMON_FILE_PREFIX, LOCAL_PROJECT_FILE_PREFIX} = BUILDIN_CONFIG;
let project_name = PROJECT_NAME
const src_rdm = Date.now();
// 字母顺序
const letter_num = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
};

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
    const e_sports_domain_img = LocalStorage.get('e_sports_domain_img')
    if(GLOBAL_CONSTANT.E_SPORTS_DOMAIN_IMG){
      return `${GLOBAL_CONSTANT.E_SPORTS_DOMAIN_IMG}/${path}`;
    }
    if(e_sports_domain_img){
      return `${e_sports_domain_img}/${path}`;
    }
  }
  //新配置是 数组
  let DOMAIN_RESULT_ = lodash.get(BUILDIN_CONFIG,'DOMAIN_RESULT') 
  const domain_img_str = DOMAIN_RESULT_.img_domains[0];
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

  if (IS_DEV) {
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

/**
 * @Description 加载图片
 * @param {object} el dom元素
 * @param {undefined} undefined
 */
const load_img_src = function (el) {
  let self_img = el.dataset.src;
  // 绝对地址时直接使用，否则需要重新获取地址
  let img_url =
    /^http(s)?/.test(self_img) || /^\/\//.test(self_img)
      ? self_img
      : get_server_file_path(self_img, el.getAttribute("data-csid"));
  if (img_url) {
    if (img_url.indexOf("?") == -1) {
      img_url = img_url + "?rdm=" + src_rdm;
    } else {
      img_url = img_url + "&rdm=" + src_rdm;
    }
  }
  image_is_exist(img_url, el).then((res) => {
    el.style.opacity = 1;
    if (res) return;
    el.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    // 队名图标的处理逻辑
    let team_letter = el.dataset.team;
    if (team_letter != "undefined") {
      let default_img = /[a-z]/i.test(team_letter) ? team_letter : "logo";
      el.classList.add("team-logo-" + default_img);
      if (letter_num[default_img]) {
        let width = el.width || el.clientWidth;
        let position =
          parseInt(((letter_num[default_img] * width * 64) / 44) * 100) / 100;
        el.style = `background-position:0 -${position}px`;
      }
      // 联赛图标
    } else {
      el.classList.add("leagues-logo-default");
    }
    el = null;
  });
  el.removeAttribute("data-src");
};
/**
 * @Description 加载图片
 * @param {object} el dom元素
 * @param {undefined} undefined
 */
const load_img_src_common = function (el) {
  let self_img = el.dataset.src;
  // 绝对地址时直接使用，否则需要重新获取地址
  let img_url = /^http(s)?/.test(self_img)
    ? self_img
    : get_server_file_path(self_img, el.getAttribute("data-csid"));
  image_is_exist(img_url, el).then((res) => {
    el.style.opacity = 1;
    if (res) return;
    el.src = el.dataset.default;
    el = null;
  });
  el.removeAttribute("data-src");
};
/**
 * 检测图片是否存在
 * @param url
 */
let image_is_exist = function (url, img) {
  return new Promise((resolve) => {
    // var img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        resolve(true);
        // img = null;
      }
    };
    img.onerror = function () {
      resolve(false);
      // img = null;
    };
    if (url) {
      img.src = url;
    } else {
      resolve(false);
    }
    img = null;
  });
};


/**
 * 计算本地图片路径 和 project 有关 
 * 因为在 vite.config.js  内 base 已指定  前缀  并且带 / 所以这里理论上 根本就用不到这个方法只需要在配置图片的时候不要加前/  不用加 前缀/
 *  如果要带/ 走这里的 路径 
 * 
 * 示例： 
 * 图片本地地址：  public/yazhou-h5/image/menu/refesh.svg
 * 本地运行地址：   /yazhou-h5/image/menu/refesh.svg
 * 线上打包地址：   `/${前缀}/yazhou-h5/image/menu/refesh.svg`
 * 
 * 
 * 传参： 
 */

const compute_local_project_file_path=(str='')=>{
  //归正
  str =''+str
  if(str.startsWith('/')){
    str= str.substring(1)
  }
  //不论本地开发还是生产打包 一定有前缀
  return  `${LOCAL_PROJECT_FILE_PREFIX}/${str}`

}
/**
 * 计算本地图片路径 和 project 无关
 *  
 * @param {*} str 
 * @returns 
 */
const compute_local_common_file_path=(str='')=>{
    //归正
  str =''+str
  if(str.startsWith('/')){
    str= str.substring(1)
  }
 
  return   IS_DEV?`/${str}` :  `${LOCAL_COMMON_FILE_PREFIX}/${str}`
 

}
// //本地项目内文件  公用的 不带项目标识专用目录的 
// const LOCAL_COMMON_FILE_PREFIX =  BUILD_VERSION ? `/${BUILD_VERSION}` :''
// //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
// const LOCAL_PROJECT_FILE_PREFIX =  BUILD_VERSION ? `/${BUILD_VERSION}/${PROJECT_NAME}` :`/${PROJECT_NAME}`



export { 
  get_server_file_path, 
  load_img_src, 
  load_img_src_common,
   image_is_exist, 
   project_name ,
   LOCAL_COMMON_FILE_PREFIX,
   LOCAL_PROJECT_FILE_PREFIX,
   compute_local_project_file_path,
   compute_local_common_file_path
   };
