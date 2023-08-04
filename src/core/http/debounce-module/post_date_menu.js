/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-16 22:29:54
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-16 22:30:00
 * @FilePath       : \user-pc-vue3\src\public\utils\http\module\post_date_menu.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 *
 * 赛事列表  缓存、限频、节流
 */

import AxiosDebounceCache from "./axios-debounce-cache.js"



// 实例化
const instance = new AxiosDebounceCache('post_date_menu');
// 开关
instance.ENABLED = true;
// 最小请求间隔  也就是前端限频
instance.minimum_interval = 2000;
// 防抖时间 也就是前端节流
instance.debounce_time =4000;
//缓存并检查接口参数的 菜单ID
instance.euid_cache_and_check = true;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `euid_${params.euid}`;
  return str
}



export default instance