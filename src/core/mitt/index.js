import mitt from "mitt";
import * as MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js";
import * as MITT_TYPES_DEFAULT from "./mitt-keys";
import { hasIn, startsWith } from "lodash";
const MITT_TYPES = Object.assign({}, MITT_TYPES_DEFAULT, MITT_TYPES_PROJECT);

const emitter = new mitt();
/**
 * 使用 mitt on方法
 * @returns {off,emit(data)}
 */
function useMittOn(...args) {
  const [key, fun] = args;
  // if (!hasIn(MITT_TYPES, key)) {
  //   console.error("mitt key is not register:", key);
  //   return;
  // }
  emitter.on.apply(emitter, args);
  return {
    off: () => emitter.off(key, fun),
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
