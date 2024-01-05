/*
 * @Author: success
 * @Description: 自动循环回调函数工具类
 */
import {sleep} from "licia";
export default class LoopCallback {
  /**
   * @Description:构造函数
   * @param {Object} config_obj {loop_count: 10, step: 1000,} // 配置信息,循环次数和间隔时间 
   * @param {Function} callback // 回调函数,返回true代码loop结束
   */  
  constructor(callback, config_obj) {
    // 回调函数复制
    this.callback = callback;
    this.run = true;
    // 默认配置参数
    this.config = {
      // 循环次数
      loop_count: 10,
      // 步长(毫秒)
      step: 1000,
      // 默认最大轮询值
      max:60,
    }
    if(config_obj)
    {
      Object.assign(this.config, config_obj);
    }
    
    // 实际的循环次数
    this.l_count = 0;
    
    if(this.callback){
      this.run_loop();
    }
  }
  /**
   * @description: 自动loop工作函数
   */  
  run_loop(){
    (async () => {
      let ret = false;
      while (this.run) {
        if(this.callback)
        {
          try {
            ret = await this.callback(this.l_count);
          } catch (error) {
            console.error(error)
          }
        }
        this.l_count++;
        await sleep(this.config.step);
        if(ret || (this.l_count>=this.config.loop_count) || this.l_count>this.config.max){
          this.run = false;
        }
      }
    })();
  }

  /**
   * @description: 销毁函数(销毁时关闭)
   */  
  destroy(){
    this.run = false;
  }
}

/** 
  // 使用demo1
  let fun = async function(n){
    let res_ = false;
    await api_common.get_time_server().then(res => {
      if(n>5){
        res_ = true;
      }
    })
    .catch((e) => {
      console.error(e)
    });
    return res_;
  }
  new LoopCallback(fun, {loop_count: 10, step: 1000,});


  // ----------------------------------------------
  // 使用demo2
  new LoopCallback(async(n)=>{
      let res_ = false;
      await api_common.get_time_server().then(res => {
        if(n>5){
          res_ = true;
        }
      })
      console.log('>>>>>>>>>>>>>>>>>>>>>'+n)
      return res_;
    }, {loop_count: 20, step: 1000,});
*/