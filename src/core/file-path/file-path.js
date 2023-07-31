/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-30 19:59:10
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-30 20:03:55
 * @FilePath       : \user-pc-vite\src\core\file-path\file-path.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 电竞赛种csid
const e_sport_csids = [101, 100, 102, 103];

/**
 * @description: 获取图片完整网络路径
 * @param {String} path 图片路径
 * @return {String} csid 球种类型
 */
export const get_file_path = (path, csid = 0) => {
  // oss返回的有效图片域名地址
  const oss_img_domains = []
  // 电竞图片域名
  const e_sports_img = ''
  // 图片域名地址
  const img_domain = {}
  // 域名地址
  const current_domain = {}
  // 目前环境信息
  const current_env = 'local_test';
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
  if (e_sport_csids.includes(1 * csid)) {
    return `${e_sports_img}/${path}`;
  }
  // 优先使用oss返回的有效图片域名地址
  let domain_img_str = '';
  if (oss_img_domains) {
    domain_img_str = oss_img_domains[0];
  }
  if (domain_img_str) {
    return `${domain_img_str}/${path}`;
  }

  domain_img_str = img_domain[current_env];
  if (domain_img_str) {
    return `${domain_img_str}/${path}`;
  }

  if (current_env == 'idc_sandbox' || current_env == 'idc_pre' || current_env == 'idc_ylcs') {
    let api_domain = current_domain[current_env][0];
    // 试玩环境使用生产api图片
    api_domain = current_domain['idc_online'][0];
    api_domain = api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }

  if ((window.env.NODE_ENV == 'development')) {
    let api_domain = current_domain[current_env][0];
    api_domain = api_domain.replace(/\/\/.*?\./, '//image.');
    return `${api_domain}/${path}`;
  }

  let arr = location.host.split(".");
  let api_domain_2 = `${location.protocol}//image.${arr[arr.length - 2]}.${arr[arr.length - 1]}`;

  // api_domain = api_domain.replace(/\/\/.*?\./,'//image.');
  return `${api_domain_2}/${path}`;
}
