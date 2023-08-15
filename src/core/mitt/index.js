import mitt from "mitt";
import * as MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js";
import * as MITT_TYPES_DEFAULT from "./mitt-keys";
const MITT_TYPES = Object.assign({}, MITT_TYPES_DEFAULT, MITT_TYPES_PROJECT);

const emitter = new mitt();
/**
 * 使用 mitt on方法
 * @returns {off,emit(data)}
 */
function useMittOn(...args) {
  const [key, fun] = args;
  
 
  if(key.startsWith('EMIT_')&&MITT_TYPES[key]){
    emitter.on.apply(emitter, args);
    return {
      off: () => emitter.off(key, fun),
      emit: (data) => useMittEmit(key, data),
    };

  }else{
    console.error("mitt key 未注册 或者 不规范 :", key);
    return{
      off:()=>{},
      emit:()=>{},
    }
  }

}
/**
 * 使用 mitt emit方法
 *
 */
function useMittEmit(key, data) {
  console.log("useMittEmit", key, data);
  if(key.startsWith('EMIT_')&&MITT_TYPES[key]){
    emitter.emit(key, data);
  }else{
    console.error("mitt key 未注册 或者 不规范 :", key);
  }

}
export { useMittOn, useMittEmit, MITT_TYPES };
