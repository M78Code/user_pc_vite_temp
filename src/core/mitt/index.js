import mitt from "mitt";
 
import  {MITT_TYPES_GLOABLE, MITT_TYPES_BASE ,MITT_TYPES_PROJECT} from "app/job/output/entry/index.js";

import { onUnmounted } from "vue";

/** @type {MittType} */
const MITT_TYPES = Object.assign({}, MITT_TYPES_GLOABLE, MITT_TYPES_BASE, MITT_TYPES_PROJECT);

const emitter = mitt();

/**
 * 使用 mitt on方法, 组件卸载时调用off()取消监听 ,若在setup作用域内可使用 useMitt(type,callback) 函数
 * @param {keyof MittType} type MITT_TYPES事件类型
 * @param {(params?)=>void} callback 事件触发时的回调函数
 * @returns {MITT.UseMittOnResult} { off(), emit() }
 * @example 
 * import { useMittOn, MITT_TYPES } from "src/output/index.js";
 * const {off} = useMittOn(MITT_TYPES.EMIT_KEY,(param?)=>void)
 * // 组件卸载时调用off() 取消事件监听
 * @description 该函数新旧版进行不兼容的重构, 以下旧写法已经废弃.
 * @example useMittOn(type,callback).off;
 */
function useMittOn(type,callback) {
 
  if(String(type).startsWith('EMIT_')&&MITT_TYPES[type]){
    // console.error("mitt----------useMittOn-----   :", type);
    emitter.on(type,callback);
    return {
      off: () => emitter.off(type, callback),
      emit: (param) => {
        useMittEmit(type, param)
      },
    };

  }else{
    // console.error("mitt type 未注册 或者 不规范 :", type);
    return{
      off:()=>{},
      emit:()=>{},
    }
  }
}
/** mittOn方法的Setup封装,限Setup作用域调用
 * @example 
 * import { useMitt, MITT_TYPES } from "src/output/index.js";
 * useMitt(MITT_TYPES.EMIT_KEY,(param?)=>{})
 * @description 函数内注册onUnmounted钩子移除mitt监听
 * @param {keyof MittType} type MITT_TYPES事件类型
 * @param {(params?)=>void} callback 事件触发时的回调函数
 * @returns {MITT.UseMittOnResult}
 */
function useMitt(type, callback){
  const {off} = useMittOn(type,callback)
  onUnmounted(off)
}
/**
 * 使用 mitt emit方法
 * @param {OtherMittType} type MITT_TYPES事件类型
 * @param {any} [param] 事件传递的参数
 * @example 
 * import { useMittEmit, MITT_TYPES } from "src/output/index.js";
 * useMittEmit(MITT_TYPES.EMIT_KEY)
 * useMittEmit(MITT_TYPES.EMIT_KEY,{key:value})
 */
function useMittEmit(type, param) {
  
  //console.error("mitt----------useMittEmit-----   :", type,';',param);
 
  if(String(type).startsWith('EMIT_')&&MITT_TYPES[type]){
    emitter.emit(type, param);
  }else{
    // console.error("mitt type 未注册 或者 不规范 :", type);
  }

}


  /**
   * 生产随机字符串
   */
  const  randomstring=(n=16)=>{

    let result=''
    let str="ABCDEFGH1KLMNOPQRSTUVWXYZabCdefghijk1mnopqrstuVWxyz0123456789"
    for(let i=0;i<n;i++){
    

        let i = Math.floor(Math.random()* (str.length))
        result+= str[i]  

    }
      
     return result

  }


//==============================事件监听  生成器  demo  option  开始  ====================================
// //头部引入  
// import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/output/index.js";
// //methods 内添加 
// /**
// * 生成事件监听  
// */
// handle_generat_emitters(){
// let event_pairs=  [
// // 投注数量
// { type:MITT_TYPES.EMIT_BET_TOTAL_COUNT_CMD, callback:this.get_bet_total_count} 
// ]
// let  { emitters_off } =  useMittEmitterGenerator(event_pairs)
// this.emitters_off=emitters_off  
// },

// //created 内 执行 
// this.handle_generat_emitters()

// //移除相应监听事件 //视图销毁钩子函数内执行
// if(this.emitters_off){this.emitters_off()} 

//==============================事件监听  生成器  demo   option   结束 ====================================

 
/**
 * 批量  生成 事件监听 和 取消 事件监听     事件监听  生成器 
 * @param {Array<{type: keyof MittType,callback: ()=>void}>} event_pairs  事件 配置对象数组
 * @returns { MITT.UseMittEmitterGeneratorResult } { emitters_off() } 批量取消挂载的事件监听
 * @example
 * import { MITT_TYPES, useMittEmitterGenerator } from "src/output/index.js";
 * const { emitters_off } = useMittEmitterGenerator([
 *  {
 *    type: MITT_TYPES.EMIT_KEY,
 *    callback: ()=>{}
 *  }
 * ])
 * onUnmounted(emitters_off);
 */

const useMittEmitterGenerator = (event_pairs) => {
  //挂载点 
  let emitters = {}


  // 添加相应监听事件
  const emitters_on = () => {
    event_pairs.map((item, i) => {
      let { type, callback } = item
      if (!callback) {
        callback = () => { }
      }

      emitters[`emitter_${randomstring()}`] = useMittOn(type, callback).off
    })

  }
  // 执行 
  emitters_on()

  // 移除相应监听事件
  const emitters_off = () => {
    Object.values(emitters).map((x) => x());
  }



  return { emitters, emitters_off }
}




export { emitter, useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES,useMitt };
