/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:35:21
 * @LastEditTime: 2023-08-02 17:04:46
 * @LastEditors: jiffy
 * @Description: 说明
 *
 */

import mitt from "mitt";
import * as  MITT_TYPES from "./mitt-keys.js";
const emitter = new mitt();
/**
 * 使用 mitt on方法
 * @returns {off,emit(data)}
 */
function useMittOn(...args) {
  const [key] = args;
  if (!MITT_TYPES[key]) {
    console.error("mitt key is not register");
    return;
  }
  emitter.on.apply(emitter, args);
  return {
    off: () => emitter.off(key),
    emit: (data) => useMittEmit(key, data),
  };
}
/**
 * 使用 mitt emit方法
 *
 */
function useMittEmit(key, data) {
  console.log("useMittEmit", key, data);
  emitter.emit(key, data);
}
export { useMittOn, useMittEmit, MITT_TYPES };
