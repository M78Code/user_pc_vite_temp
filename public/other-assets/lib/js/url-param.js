/**
 * @Author: hanmar
 * @Date: 2023-11-12 13:52:55
 * @Description: url参数页面跳转核心逻辑
 */

// 获取sessionStorage中的location_search数据
function get_session_storage_location_search()
{
  // 获取sessionStorage中的url参数
  const location_search = sessionStorage.getItem('LOCATION_SEARCH') || '';
  return new URLSearchParams(location_search);
}

// 同步局部参数到sessionStorage中location.search参数字符串中
function location_href_param_set(obj={}){
  // 全局获取url参数值使用
  const search_params = window.SEARCH_PARAMS.init_param;
  for (const key in obj) {
    // 增加数据
    obj[key] && search_params.set(key, obj[key]);
  }
  sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
}
// 删除局部参数到sessionStorage中location.search参数字符串中
function location_href_param_del(keys=[]){
  // 全局获取url参数值使用
  const search_params = window.SEARCH_PARAMS.init_param;
  keys.forEach(key => {
    search_params.has(key) && search_params.delete(key);
  });
  sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
}

// 获取当前url(删除所有参数)
function get_url_no_param(){
  let url = location.href;
  try {
    if(url && url.indexOf('token')>-1){
      let hash = location.hash;
      if(hash && hash.indexOf('?') > -1){
        hash = hash.substring(0,hash.indexOf('?'));
        // document.location.hash=hash;
      }
      url = location.origin+location.pathname+hash;
    }
  } catch (error) {
    console.error(error);
  }
  return url;
}
// 获取url中的所有参数
function get_url_param(url){
  let url_temp = new URL(url);
  // 获取url参数
  let location_search = url_temp.search;
  let hash = url_temp.hash;
  // hash后面的参数处理
  if(hash && hash.indexOf('?')>-1){
    hash = hash.substring(hash.indexOf('?')+1);
    location_search = location_search+'&'+hash;
  }
  const search_params_new = new URLSearchParams(location_search);
  return search_params_new;
}

// 同步局部参数到sessionStorage中location.search参数字符串中,并进行参数获取分流操作
function get_location_href_param() {
  // 允许在url中直接累加的参数key
  const PARAM_ADD_KEY = ['wsl', 'pb', 'vlg', 'lang', 'theme', 'gr', 'ignore_iframe_pc','wpx','vconsole_h5'];
  // 获取url参数
  let search_params_new = get_url_param(location.href);
  // 旧参数数据
  const search_params_old = get_session_storage_location_search();

  // 获取新数据中的token
  const token = search_params_new.get('token');

  // 当前可以使用的url参数对象
  let search_params = null;
  let search_params_new_temp = new URLSearchParams('');
  // 发现有token时重新同步sessionStorage中LOCATION_SEARCH值数据
  if(token){
    // 同步允许在url中直接累加的参数key(部分旧数据同步到新数据中)
    PARAM_ADD_KEY.forEach(key => {
      const val = search_params_old.get(key);
      val && search_params_new_temp.set(key, val);
    });
    search_params_new.forEach((val, key)=> {
      search_params_new_temp.set(key, val);
    });
    search_params = search_params_new_temp;
    sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
  } else {
    // 同步允许在url中直接累加的参数key(部分新数据同步到旧数据中)
    PARAM_ADD_KEY.forEach(key => {
      const val = search_params_new.get(key);
      val && search_params_old.set(key, val);
    });
    search_params = search_params_old;
    sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
  }
  return search_params;
};
// 获取TY_SDK_key持久化信息
function get_storage_sdk_key(storage,key){
  let res = '';
  if(storage && key){
    let val = storage.getItem('TY_SDK_'+key.toUpperCase());
    if(val){
      try {
        res = JSON.parse(val).value;
      } catch (error) {
        console.error(error);
      }
    }
  }
  return res;
}
// 获取topic
function get_topic(){
  return get_storage_sdk_key(localStorage, 'topic') || {};
}
// 浏览器参数对象
const search_params_obj = {};
// 当前最新的href
search_params_obj.href = location.href;
// 当前最新href和session中的参数集合
search_params_obj.init_param = get_location_href_param();
// 删除方法
search_params_obj.init_param_del = location_href_param_del;
// 增加方法 
search_params_obj.init_param_set = location_href_param_set;
// 获取指定url中的所有参数 
search_params_obj.get_url_param = get_url_param;
// 设置获取TY_SDK_key方法
search_params_obj.get_storage_sdk_key = get_storage_sdk_key;
// 设置topic数据
search_params_obj.get_topic = get_topic
// 是否有token 
let has_token = true;
try {
  if(!search_params_obj.init_param.get('token')){
    has_token = false;
  }
} catch (error) {
  console.error(error);
}
// 设置是否有token 
search_params_obj.has_token = has_token;
// 全局获取url参数值使用
window.SEARCH_PARAMS = search_params_obj;
// 获取清除参数的url
// let url = get_url_no_param();
// 清除页面url参数
// window.history.replaceState('', '', url);