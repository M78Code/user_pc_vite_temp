/**
 *
 * 赛事列表  缓存、限频、节流
 */

import AxiosDebounceCache from "./axios-debounce-cache.js"



// 实例化
const instance = new AxiosDebounceCache('get_match_list');
// 开关
instance.ENABLED = false;
// 最小请求间隔  也就是前端限频
instance.minimum_interval =2000;
// 防抖时间 也就是前端节流
instance.debounce_time =4000;
//缓存并检查接口参数的 菜单ID
instance.euid_cache_and_check = true;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `match_list_cuid_${params.cuid}_euid_${params.euid}_orpt_${params.orpt}_sort_${params.sort}_tid_${params.tid}`;
  return str
}



export default instance
