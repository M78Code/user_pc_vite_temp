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

/**
 * @description: 移除ws消息监听
 * @param {function} callback 需要销毁的方法
 * @return {undefined} undefined
 */
const ws_remove_message_listener = (callback) =>{
  // 移除ws消息监听
  window.removeEventListener("message", callback);
}
export {ws_add_message_listener, ws_remove_message_listener};

