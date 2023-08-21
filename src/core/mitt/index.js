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
  
 
  if(String(key).startsWith('EMIT_')&&MITT_TYPES[key]){
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
  if(String(key).startsWith('EMIT_')&&MITT_TYPES[key]){
    emitter.emit(key, data);
  }else{
    console.error("mitt key 未注册 或者 不规范 :", key);
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
// import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/core/mitt/index.js";
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
// ////移除相应监听事件 //视图销毁钩子函数内执行
// //if(this.emitters_off){this.emitters_off()}   
// },


//==============================事件监听  生成器  demo   option   结束 ====================================

 
/**
 * 批量  生成 事件监听 和 取消 事件监听     事件监听  生成器 
 * @param {*} event_pairs  事件 配置对象数组
 * @returns 
 */

const useMittEmitterGenerator =(event_pairs)=>{
  //挂载点 
  let emitters={}


  // 添加相应监听事件
const emitters_on=()=>{
  event_pairs.map((item,i)=>{
    let { type, callback} =item
    if(!callback){
      callback=()=>{}
    }

    emitters[`emitter_${   randomstring() }`] =  useMittOn(type, callback ).off 
  })

}
// 执行 
emitters_on()

 // 移除相应监听事件
  const emitters_off=()=>{
     Object.values( emitters).map((x) => x());
}

 

  return  { emitters,   emitters_off }
}




export { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES };
