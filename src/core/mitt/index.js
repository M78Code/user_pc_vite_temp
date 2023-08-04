/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:35:21
 * @LastEditTime: 2023-08-04 15:52:52
 * @LastEditors: pmtymalick pmtymalick
 * @Description: 说明
 *
 */

import mitt from "mitt";
import * as  MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js";

import  * as MITT_TYPES_DEFAULT from "./mitt-keys"

const MITT_TYPES= Object.assign({}, MITT_TYPES_DEFAULT ,MITT_TYPES_PROJECT)




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
