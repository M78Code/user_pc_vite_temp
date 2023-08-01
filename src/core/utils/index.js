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
   * @description 根据 ms 返回是否是滚球
   * @param  {number} ms  赛事的当前状态
   * @oaran {array} exclude 排除的状态
   * @return {number} is_play 是否滚球：0 非滚球 1 滚球
   */
 export function get_match_status(ms, exclude) {
    let _ms = Number(ms)
    // 为滚球的所有状态
    let all_ms = [1, 2, 7, 10, 110]

    // 排除某些滚球状态
    if (exclude) {
      all_ms = all_ms.concat(exclude).filter(v => !all_ms.includes(v) || !exclude.includes(v))
    }

    // 非滚球
    let is_play = 0
    // 进行中,暂停,延迟,比赛中断,即将开赛
    if (all_ms.includes(_ms)) {
      is_play = 1
    }

    return is_play
  }




