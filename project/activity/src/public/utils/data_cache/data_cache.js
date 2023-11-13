/*
 * @Author: success
 * @Date: 2020-10-13 14:42:46
 * @Description: url请求数据缓存
 */

export default class DataCache
{
  timeout_obj = {}; //定时器集合
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   */
  constructor(view)
  {
    // 视图对象
    this.view = view;
    // 赛事序列列表{key:{key:key, api:'api函数',param:{url参数}, data:{返回的参数}, model:'模块',auto_upd_time:0}}
    this.cache_obj = {};
    // 自动更新时间(秒)
    this.auto_upd_time = 0;
    // 初始化数据
    this.init();
  }


  /**
   * @description: 数据初始化
   */
  init(){
    // 启动自动更新数据
    this.run()
  }

  /**
   * @description: 增加缓存项
   * @param {String} key 唯一标识
   * @param {Function} api api函数
   * @param {Object} param 请求参数
   * @param {String} model 模块名称
   * @param {Object} data  请求响应数据
   */  
  add_cache_obj(key, api, param, model, data){
    if(key && (!this.cache_obj[key]))
    {
      this.cache_obj[key] = {key, api, param, model, data}
    }
  }


  /**
   * @description: 启动自动更新缓存数据
   */  
  run(){
    if(this.auto_upd_time){
     this.timeout_obj.timer1 = setInterval(() => {
        for (const key in this.cache_obj) {
          const item = this.cache_obj[key];
          if(item) {
            // 获取网络数据
            item.api(params).then(({ data }) => {
              let code = _.get(data, "code");
              if (code == 200) {
                item.data = data;
              }
            })
          }
        }
      }, this.auto_upd_time*1000);
    }
  }

  /**
   * @description: 获取缓存数据
   * @param {String} key 唯一标识
   * @return {Object} 缓存数据
   */
  get_cache_obj(key){
    return this.cache_obj[key];
  }

  /**
   * @description: 删除指定缓存数据
   * @param {String} key 唯一标识
   * @return {Object} 缓存数据
   */
  del_cache_obj(key){
    delete this.cache_obj[key];
  }

  /**
   * @description: 清除指定模块缓存
   * @param {String} model 模块名称
   */  
  clear_model_cache(model){
    for (const key in this.cache_obj) {
      const item = this.cache_obj[key];
      if(item && item.model == model) {
        delete this.cache_obj[key]
      }
    }
  }

  /**
   * @description: 清除指定所有缓存
   * @param {String} model 模块名称
   */  
  clear_cache(model){
    for (const key in this.cache_obj) {
      delete this.cache_obj[key]
    }
  }
  

  /**
   * @description: 清空对象
   * @param {Object,Array} any 要清空的对象和列表
   */
  clear(any){
    if(any&&(typeof any) == 'object')
    {
      if(any instanceof Array){
        any.splice(0,any.length);
      } else{
        for (const key in any) {
          delete any[key]
        }
      }
    }
  }

  /**
   * @description: 清除所有数据
   */
  clearData(){
    this.clear(this.cache_obj);
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   */
  destroy(){
    this.clear(this.cache_obj);
    this.view = null;
     /**清除定时器 */
    for (const key in this.timeout_obj) {
      clearInterval(this.timeout_obj[key]);
    }
    this.timeout_obj = {};
  }
}

// new DataCache()