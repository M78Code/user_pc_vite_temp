/**
 *
 * 列表bymids  缓存、限频、节流
 */


/**
 * //生产 bymids限蘋目前设置每秒3次， 滚动节流不能超过1秒3次  滚动产生的bymids调用不走全局节流逻辑  src\public\utils\matchlist\matchlist.js
 * bymids 和并mid节流功能文件 src\public\mixins\websocket\data\ws_debounce.js
 *
 * 功能说明：
 * 3秒内多次请求bymids会合并mid参数只请求一次
 *
 * 如果mid参数是纯足球则节流时间是3秒
 * 只要mid参数有非足球球种节流时间是1秒
 *
 * 节流时间在89行 和91行设置
 *
 */


import AxiosDebounceCache from  "./axios-debounce-cache.js"


// 实例化
const instance = new AxiosDebounceCache('get_match_base_info_by_mids');
// 开关
instance.ENABLED =true;
// 是否是bymids 接口
instance.is_bymids_api = true;
// 最小请求间隔  也就是前端限频   这个 最低 1000 不能再低
instance.minimum_interval =1000;
// 防抖时间 也就是前端节流
instance.debounce_time =4000;
//缓存并检查接口参数的 菜单ID
instance.euid_cache_and_check = true;
// 自定义哈希算法
instance.hash_code=function(params){
// 把参数传进来 核心参数拼接 ，注意需要自己去掉非 _ 下划线之外的特殊符号
  let str = `mids_cuid_${params.cuid}_euid_${params.euid}_mids_${params.mids}_orpt_${params.orpt}_sort_${params.sort}_tid_${params.tid}_cos_${params.cos}_scroll_${params.scroll}`;
  return str
}



export default instance



// mids_params_arr= [ {1},{2},{3}]

// mids   合并 去重  ， 后面 截取 12 个
// tabs   合并   倒序 去重（mids）     过滤 mids






// 1. 检查   hash_code   一样不一样  mids_params_arr 清空
//      一样 ： 走了限频
//      不一样：  can_send_request  一定会返回可以发起请求 ，上一次自动取消



// 2.     can_send_request   发  起   ==》 mids_params_arr  清空


// 合并参数





