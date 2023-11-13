/*
 * @Author: 
 * @Date: 2021-09-05 17:35:52
 * @Description: 
 */
/*
 * @Author: success
 * @Description: 用户基本信息缓存存储,及工具方法(语种信息,赔率类型,主题设置等)
 */

export default class BaseUserInfo
{
  /**
   * @description: 构造函数
   */  
  constructor()
  {
  }
  // 数据持久化使用到的key值
  static local_storage_key = 'pc_user_base_info';


  /**
   * @description: 获取用户基础信息
   * @return {Object} 用户基础信息
   */  
  static get(){
    let str = localStorage.getItem(BaseUserInfo.local_storage_key);
    let data = null;
    if(str){
      try {
        data = JSON.parse(str);
      } catch (error) {
        console.error('BaseUserInfo get() 错误:',error);
      }
    }
    return data;
  }

  /**
   * @description: 设置用户基础信息
   * @param {Object} 用户基础信息  {languageName:'语种',userMarketPrefer:'赔率种类',theme:'主题:theme01白,theme02黑'}  
   */  
  static set(obj){
    if(obj){
      try {
        let data = {languageName:obj.languageName, userMarketPrefer:obj.userMarketPrefer,theme:obj.theme,token:obj.token};
        if(!obj.theme && window.vue){
          // 设置主题类型
          data.theme = window.vue.$store.getters.get_theme;
        }
        localStorage.setItem(BaseUserInfo.local_storage_key,JSON.stringify(data));
      } catch (error) {
        console.error('BaseUserInfo set() 错误:',error);
      }
    }
  }

  /**
   * @description: 合并用户基础信息
   * @param {Object} 合并后的用户基础信息 {languageName:'语种',userMarketPrefer:'赔率种类',theme:'主题:theme01白,theme02黑'}   
   */  
  static assign(obj_){
    let obj = BaseUserInfo.get();
    if(obj && obj_){
      try {
        Object.assign(obj,obj_);
        BaseUserInfo.set(obj);
      } catch (error) {
        console.error('BaseUserInfo assign() 错误:',error);
      }
    }
    return obj;
  }




  /**
   * @description: 检测本地是否存有用户基础信息, 有用户信息返回用户基本信息,否则返回null,
   * @return {Object} 有用户信息返回用户基本信息对象,否则返回null
   */  
  static check_hava_user_base_info(){
    let res = null;
    let obj = BaseUserInfo.get();
    if(obj && obj.languageName && obj.userMarketPrefer){
      res = obj;
    }
    return res;
  }
  
}
