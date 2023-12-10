/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
// import  lodash from "lodash";

import PageSourceData from "src/core/page-source/page-source.js";

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
 * @description: 拼接图片地址
 * @param {String} str 需要拼接的图片尾部
 * @return {String}
 */
export const compute_image_src = (str) => {
  return str ? get_server_file_path(str) : "";
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
  if (!PageSourceData.init_time.server_time) {
    let now = new Date();
    PageSourceData.set_init_time({
      server_time: now.getTime(),
      local_time: now.getTime(),
    });
  }
  let remote_time = PageSourceData.init_time.server_time * 1;
  let local_time = PageSourceData.init_time.local_time * 1;
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



  /**
   * 阻止用户频繁点击切换
   */
  export function  is_time_limit(time1=500){
    let flag = true;
    let now = new Date().getTime();
    if(!this.change_time || (now - this.change_time) > time1){
      flag = false;
      this.change_time = now;
    }
    return flag;
  }