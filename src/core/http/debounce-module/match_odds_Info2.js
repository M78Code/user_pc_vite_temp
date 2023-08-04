


/**
 *
 * 详情接口  缓存、限频、节流
 */

 import AxiosDebounceCache from "./axios-debounce-cache.js"



// 实例化
const instance = new AxiosDebounceCache('match_odds_Info2');
// 开关
instance.ENABLED = false;
// 最小请求间隔  也就是前端限频
instance.minimum_interval =500;
// 防抖时间 也就是前端节流
instance.debounce_time =2000;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `odds_info_${params.cuid}_mcid_${params.mcid}_mid_${params.mid}`;
  return str
}



export default instance
