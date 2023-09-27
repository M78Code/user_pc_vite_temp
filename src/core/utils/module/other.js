/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
// import  lodash from "lodash";

import lodash from "lodash";
// 目前环境信息



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