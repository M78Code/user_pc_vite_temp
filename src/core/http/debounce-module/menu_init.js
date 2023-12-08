/**
 *
 * 菜单接口  缓存、限频、节流
 */

 import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import AxiosDebounceCache from "./axios-debounce-cache.js"



// 实例化
const instance = new AxiosDebounceCache('menu/init');
// 开关
instance.ENABLED =true;
// 最小请求间隔  也就是前端限频
instance.minimum_interval =2000;
// 防抖时间 也就是前端节流
instance.debounce_time =4000;
//是否开启随机前端节流  ，主要用于消除峰值， 默认关闭，避免引起问题
//场景比如WS推送导致菜单更新 ，赛事列表主接口更新 之类的
instance.enabled_random_debounce_time = true;
//开启随机前端节流 最小节流时间 ，必须大于  minimum_interval
instance.random_debounce_time_min=  4000;
//开启随机前端节流 最大节流时间 必须大于  random_debounce_time_min
instance.random_debounce_time_max=  10000;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `sys_${params.sys||7}_disabled_${params.disabled}_lang_${  LocalStorage.get("lang",'zh')}`
  return str
}



export default instance
