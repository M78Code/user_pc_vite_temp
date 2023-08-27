import { i18n } from "src/boot/i18n.js"
import image_panda_placeholder from '/panda/image/panda_placeholder.jpg'


/**
 * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number} 
 */
export const rem = (value) => {
  let font_size = innerWidth * 100 / 375;
  return Math.ceil(value * font_size);
}
/** 
 * @description: 参考iphone6,7,8窗口高度(667)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number} 
 */
export const rem_height = (value) => {
  let limit = 170;
  let font_size = innerHeight * 100 / 667;
  // 注释掉，放开响应式变化限制
  /*if(font_size > limit){
    font_size = limit
  }*/
  return Math.ceil(value * font_size);
}
/**
 * @description: 拼接图片地址
 * @param {String} str 需要拼接的图片尾部
 * @return {String} 
 */
export const compute_image_src = (str) => {
  return str ? get_file_path(str) : image_panda_placeholder
}
/**
 * @description: 判断是否为低端机
 * @param {Undefined} Undefined
 * @return {Boolean} 
 */
export const is_low = () => {
  let timing = window.performance.timing;
  let sub = Math.abs(timing.domComplete - timing.connectStart);
  return sub > 2600;
}
/**
 * 获取当前服务器时间
 * @param {Undefined} Undefined
 * @return {Boolean} 
 */
export const get_now_server = () => {
  if (!window.vue.get_local_server_time) {
    let now = new Date();
    window.vue.get_local_server_time = {
      server_time: now.getTime(),
      local_time_init: now.getTime()
    }
  }
  let remote_time = window.vue.get_local_server_time.server_time * 1;
  let local_time = window.vue.get_local_server_time.local_time_init * 1;
  let now = new Date().getTime();
  return remote_time + (now - local_time);
}

// TODO: window.BUILDIN_CONFIG 待替換
/**
 * @description: 获取图片完整网络路径
 * @param {String} path 图片路径
 * @return {String} csid 球种类型
 */
export const get_file_path = (path, csid = 0) => {
  // 目前环境信息
  const current_env = window.BUILDIN_CONFIG.current_env;
  if (!path || path == 'undefined') {
    return '';
  }
  // 如果是http开头 直接返回地址
  if (_.toString(path).indexOf('http') == 0) {
    return path
  }
  // // 电竞菜单下如果type没有传值，默认为2
  // let _menutype = _.get(window,'vue.$store.getters.get_menu_type')
  // if (_menutype == 3000 && !type) {
  //   type = 2
  // }
  // 电竞图片域名模式
  if ([101,100,102,103].includes(1 * csid)) {
    return `${window.BUILDIN_CONFIG.e_sports.domain_img}/${path}`;
  }
  // 优先使用oss返回的有效图片域名地址
  let domain_img_str = '';
  if (window.BUILDIN_CONFIG.oss_img_domains) {
    domain_img_str = window.BUILDIN_CONFIG.oss_img_domains[0];
  }
  if (domain_img_str) {
    return `${domain_img_str}/${path}`;
  }

  domain_img_str = window.BUILDIN_CONFIG.domain_img[window.BUILDIN_CONFIG.current_env];
  if (domain_img_str) {
    return `${domain_img_str}/${path}`;
  }

  if (current_env == 'idc_sandbox' || current_env == 'idc_pre' || current_env == 'idc_ylcs') {
    let api_domain = window.BUILDIN_CONFIG.domain[window.BUILDIN_CONFIG.current_env][0];
    // 试玩环境使用生产api图片
    api_domain = window.BUILDIN_CONFIG.domain['idc_online'][0];
    api_domain = api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }

  if ((window.env.NODE_ENV == 'development')) {
    let api_domain = window.BUILDIN_CONFIG.domain[window.BUILDIN_CONFIG.current_env][0];
    api_domain = api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }

  let arr = location.host.split(".");
  let api_domain_2 = `${location.protocol}//image.${arr[arr.length - 2]}.${arr[arr.length - 1]}`;

  // api_domain = api_domain.replace(/\/\/.*?\./,'//image.');
  return `${api_domain_2}/${path}`;
}