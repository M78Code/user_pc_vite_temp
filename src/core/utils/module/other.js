/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
import { cloneDeep, isObject } from "lodash";
/**
 * 获取url参数的方法 默认返回全部 {name:value}
 * @param {string} name 获取单个
 * @returns {name:value}|value
 */
export function GetUrlParams(name) {
  const search_ary = location.search.slice(1).split("&");
  const obj = {};
  search_ary.forEach((item) => {
    const [key, value] = item.split("&");
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
export function deepMerge(src, target) {
  let key;
  const res = cloneDeep(src);
  for (key in target) {
    res[key] = isObject(res[key])
      ? deepMerge(res[key], target[key])
      : target[key];
  }
  return res;
}
 

/**
   * @description: 获取国际化模板信息,进行二次操作
   * @param {String} t_path 国际化信息路径
   * @param {Number} csid 赛事种类
   * @return {Array} 国际化字符串信息
   */
export const get_match_tpl_title = (t_path, csid) => {
  let ret = cloneDeep(window.vue.i18n.t(t_path));
  try {
    if(csid){
      if(localStorage.getItem('lang') == 'en'){
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
        switch (t_path) {
          case 'list.match_tpl_title.tpl7.bet_col':
            if(ret && ret[2] && ret[2] == '1X2'){
              if(csid == 2) { //2-篮球
                // ret[2] = window.vue.i18n.t('list.play_name_other_name.play_capot_name2');
              }
            }
            break;
          case 'list.match_tpl_title.tpl0.bet_col':
          case 'list.match_tpl_title.tpl16.bet_col':
            if(ret){
              if(csid == 2 || csid == 6) { //2-篮球
                // let cur_title =  window.vue.i18n.t('list.play_name_other_name.play_capot_name2')
                ret[0] = cur_title;
               ret[3] &&  (ret[3] = ret[3].replace('1x2',cur_title))
              } else if(!(csid == 4 || csid == 1)){
                // ret[0] = window.vue.i18n.t('list.play_name_other_name.play_capot_name1');
              }
            }

            break;

          default:
            break;
        }
      } else if(localStorage.getItem('lang') == 'vi'){
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
        switch (t_path) {
          case 'list.match_tpl_title.tpl9.bet_col':
            if(ret && ret[0] && ret[0] == '1X2'){
              if(csid == 5) { //5-网球
                // ret[0] = window.vue.i18n.t('list.play_name_other_name.play_capot_name1');
              }
            }
            break;
          default:
            break;
        }
      } else if(localStorage.getItem('lang') == 'zh'){
        // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 11-手球
        switch (t_path) {
          case 'list.match_tpl_title.tpl0.bet_col':
            if(ret){
              if(csid == 11) { //11-手球
                // ret = cloneDeep(window.vue.i18n.t('list.match_tpl_title.tpl0.bet_col_csid_11'));
              }
            }
            break;
          default:
            break;
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
};


