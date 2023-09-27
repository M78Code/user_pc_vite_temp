/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
// import  lodash from "lodash";

import lodash from "lodash";

import { csid_map_concede_points_id } from "src/core/index.js";
import { MenuData } from "src/core/index.js";
// 目前环境信息
const { current_env, NODE_ENV } = window.BUILDIN_CONFIG

// import { image_panda_placeholder } from 'project_path/src/core/utils/local-image.js'

/**
 * 获取url参数的方法 默认返回全部 {name:value}
 * @param {string} name 获取单个
 * @returns {name:value}|value
 */
export function GetUrlParams(name) {
  let url = location.search;
  if (!location.search) {
    url = "?" + location.hash.split("?")[1];
  }
  const search_ary = url.slice(1).split("&");
  const obj = {};
  search_ary.forEach((item) => {
    const [key, value] = item.split("=");
    obj[key] = decodeURIComponent(value);
  });
  if (name) return obj[name];
  return obj;
}

/**
 * 深度合并方法 和lodash Merge不一样
 * @param {object} src 源
 * @param {object} target 目标
 * @returns {object} 返回深度合并后的对象
 * */
export const deepMerge = (src, target) => {
  console.error(" 自己实现 -");

  return {};
};

/**
 * @description: 获取国际化模板信息,进行二次操作
 * @param {String} t_path 国际化信息路径
 * @param {Number} csid 赛事种类
 * @return {Array} 国际化字符串信息
 */
export const get_match_tpl_title = (t_path, csid) => {
  let ret = lodash.cloneDeep(window.vue.i18n_t(t_path));
  try {
    if (csid) {
      if (localStorage.getItem("lang") == "en") {
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
        switch (t_path) {
          case "list.match_tpl_title.tpl7.bet_col":
            if (ret && ret[2] && ret[2] == "1X2") {
              if (csid == 2) {
                //2-篮球
                // ret[2] = window.vue.i18n_t('list.play_name_other_name.play_capot_name2');
              }
            }
            break;
          case "list.match_tpl_title.tpl1.bet_col":
          case "list.match_tpl_title.tpl16.bet_col":
            if (ret) {
              if (csid == 2 || csid == 6) {
                //2-篮球
                // let cur_title =  window.vue.i18n_t('list.play_name_other_name.play_capot_name2')
                ret[0] = cur_title;
                ret[3] && (ret[3] = ret[3].replace("1x2", cur_title));
              } else if (!(csid == 4 || csid == 1)) {
                // ret[0] = window.vue.i18n_t('list.play_name_other_name.play_capot_name1');
              }
            }

            break;

          default:
            break;
        }
      } else if (localStorage.getItem("lang") == "vi") {
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
        switch (t_path) {
          case "list.match_tpl_title.tpl9.bet_col":
            if (ret && ret[0] && ret[0] == "1X2") {
              if (csid == 5) {
                //5-网球
                // ret[0] = window.vue.i18n_t('list.play_name_other_name.play_capot_name1');
              }
            }
            break;
          default:
            break;
        }
      } else if (localStorage.getItem("lang") == "zh") {
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 11-手球
        switch (t_path) {
          case "list.match_tpl_title.tpl1.bet_col":
            if (ret) {
              if (csid == 11) {
                //11-手球
                // ret = lodash.cloneDeep(window.vue.i18n_t('list.match_tpl_title.tpl1.bet_col_csid_11'));
              }
            }
            break;
          default:
            break;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
export const rem = (value) => {
  let font_size = (innerWidth * 100) / 375;
  return Math.ceil(value * font_size);
};
/**
 * @description: 参考iphone6,7,8窗口高度(667)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
export const rem_height = (value) => {
  let limit = 170;
  let font_size = (innerHeight * 100) / 667;
  // 注释掉，放开响应式变化限制
  /*if(font_size > limit){
    font_size = limit
  }*/
  return Math.ceil(value * font_size);
};
/**
 * @description: 拼接图片地址
 * @param {String} str 需要拼接的图片尾部
 * @return {String}
 */
export const compute_image_src = (str) => {
  return str ? get_file_path(str) : "";
};
/**
 * @description: 判断是否为低端机
 * @param {Undefined} Undefined
 * @return {Boolean}
 */
export const is_low = () => {
  let timing = window.performance.timing;
  let sub = Math.abs(timing.domComplete - timing.connectStart);
  return sub > 2600;
};
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
      local_time_init: now.getTime(),
    };
  }
  let remote_time = window.vue.get_local_server_time.server_time * 1;
  let local_time = window.vue.get_local_server_time.local_time_init * 1;
  let now = new Date().getTime();
  return remote_time + (now - local_time);
};

/**
 * @description: 解绑防抖
 * @param {String} fun 函数
 * @return {String} 
 */
export const debounce_throttle_cancel = (fun) => {
  if (fun && fun.cancel && typeof fun.cancel == "function") {
    fun.cancel();
  }
}