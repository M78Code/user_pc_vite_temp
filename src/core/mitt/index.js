/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:35:21
 * @LastEditTime: 2023-08-02 16:35:37
 * @LastEditors: jiffy
 * @Description: 说明
 *
 */

import mitt from "mitt";
import TYPES from "../mitt-keys.js";
const emitter = new mitt();
/**
 * 使用 mitt on方法
 *
 */
function useMittOn(...args) {
  osnt[key] = args;
  if (!TYPES[key]) {
    console.error("key is not register");
    return;
  }
  emitter.on.apply(emitter, args);
  return {
    remove: () => emitter.off(key),
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
export { useMittOn, useMittEmit, TYPES };
