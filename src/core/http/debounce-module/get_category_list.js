/**
 *
 * 赛事列表  缓存、限频、节流
 */
import lodash from 'lodash'

import AxiosDebounceCache from "./axios-debounce-cache.js"
// import { useRoute } from "vue-router";

// const route = useRoute();

// 实例化
const instance = new AxiosDebounceCache('get_category_list');
// 开关
instance.ENABLED =true;
// 最小请求间隔  也就是前端限频
instance.minimum_interval = 1000;
// 防抖时间 也就是前端节流
instance.debounce_time = 5000;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `sportId${params.sportId}_mid_${params.mid}`;
  return str
}



export default instance
