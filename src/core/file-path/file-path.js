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
const get_file_path = (path, csid = 0) => {
  // oss返回的有效图片域名地址
  const oss_img_domains = [];
  // 电竞图片域名
  const e_sports_img = "";
  // 图片域名地址
  const img_domain = {};
  // 域名地址
  const current_domain = {};
  // 目前环境信息
  const current_env = "local_test";
  if (!path || path == "undefined") {
    return "";
  }
  // 如果是http开头 直接返回地址
  if (_.toString(path).indexOf("http") == 0) {
    return path;
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
  let domain_img_str = "";
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

  if (
    current_env == "idc_sandbox" ||
    current_env == "idc_pre" ||
    current_env == "idc_ylcs"
  ) {
    let api_domain = current_domain[current_env][0];
    // 试玩环境使用生产api图片
    api_domain = current_domain["idc_online"][0];
    api_domain = api_domain.replace(/\/\/.*?\./, "//image.");
    return `${api_domain}/${path}`;
  }

  if (window.env.NODE_ENV == "development") {
    let api_domain = current_domain[current_env][0];
    api_domain = api_domain.replace(/\/\/.*?\./, "//image.");
    return `${api_domain}/${path}`;
  }

  let arr = location.host.split(".");
  let api_domain_2 = `${location.protocol}//image.${arr[arr.length - 2]}.${
    arr[arr.length - 1]
  }`;

  // api_domain = api_domain.replace(/\/\/.*?\./,'//image.');
  return `${api_domain_2}/${path}`;
};
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
      : get_file_path(self_img, el.getAttribute("data-csid"));
  if (img_url) {
    if (img_url.indexOf("?") == -1) {
      img_url = img_url + "?rdm=" + window.src_rdm;
    } else {
      img_url = img_url + "&rdm=" + window.src_rdm;
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
    : get_file_path(self_img, el.getAttribute("data-csid"));
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

export { get_file_path, load_img_src, load_img_src_common, image_is_exist };
