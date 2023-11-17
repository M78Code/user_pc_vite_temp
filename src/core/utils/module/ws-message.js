
/*
 * @Author: hanmar
 * @Date: 2023-11-13 17:13:55
 * @Description: ws消息监听处理函数
 * 
 *  // 引入
    import * as ws_message_listener from "src/core/utils/module/ws-message.js";
    // 增加监听接受返回的监听函数
    this.message_fun = ws_message_listener.ws_add_message_listener((cmd,data)=>{
      console.error('cmd:',cmd,data);
    })
    // 组件销毁时销毁监听函数
    ws_message_listener.ws_remove_message_listener(this.message_fun)
 * 
 */

/**
 * @description: 增加ws消息监听
 * @param {function} callback 需要回调的方法
 * @return {function} 返回window.addEventListener的方法,这个方法必须再组件销毁时使用ws_remove_event_listener进行销毁
 */
const ws_add_message_listener = (callback) =>{
  // 移除ws消息监听
  let fun = (obj) =>{
    // 获取window.postMessage自定义命令
    const cmd = lodash.get(obj, 'data.cmd');
    if(cmd == 'WS_MSG_REV'){
      // 是ws推送过来的消息
      // 获取消息数据体
      const data = lodash.get(obj, 'data.data');
      if(data){
        // ws推送消息分流
        const ws_cmd = lodash.get(data,'cmd');
        callback && callback(ws_cmd, data)
      }
    }
  }
  window.addEventListener("message", fun);
  return fun;
}

/** 增加ws消息监听的包装函数, 返回取消监听的回调函数, 在组件销毁时调用
 * @param {(cmd:string,data:{cmd:string,ctsp:number,ld:string,cd:object})=>void} callback 
 * @returns {()=>void} 移除监听的函数, 于组件销毁时调用
 * @example
 * import { addWsMessageListener } from "src/core/utils/module/ws-message.js"
 * const close = addWsMessageListener(callback)
 * onBeforeUnmount(close)
 */
function addWsMessageListener(callback){
  const close = ws_add_message_listener(callback)
  // onBeforeUnmount(close)
  return ws_remove_message_listener.bind((void 0),close)
}

/**
 * @description: 移除ws消息监听
 * @param {function} callback 需要销毁的方法
 * @return {undefined} undefined
 */
const ws_remove_message_listener = (callback) =>{
  // 移除ws消息监听
  window.removeEventListener("message", callback);
}
export {ws_add_message_listener, ws_remove_message_listener, addWsMessageListener };

