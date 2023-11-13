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
function url_param_ctr_set(obj={}){
  // 全局获取url参数值使用
  const search_params = window.SEARCH_PARAMS.param;
  for (const key in obj) {
    // 增加数据
    obj[key] && search_params.set(key, obj[key]);
  }
  sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
}

// 获取当前url(删除所有参数)
function get_url_no_param(){
  let url = location.href;
  try {
    if(url){
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

// 同步局部参数到sessionStorage中location.search参数字符串中,并进行参数获取分流操作
function url_param_init() {
  // 允许在url中直接累加的参数key
  const PARAM_ADD_KEY = ['wsl', 'pb'];
  // 获取url参数
  let location_search = location.search;
  let hash = location.hash;
  // hash后面的参数处理
  if(hash && hash.indexOf('?')>-1){
    hash = hash.substring(hash.indexOf('?')+1);
    location_search = location_search+'&'+hash;
  }
  // 新参数数据
  const search_params_new = new URLSearchParams(location_search);

  // 旧参数数据
  const search_params_old = get_session_storage_location_search();

  // 获取新数据中的token
  const token = search_params_new.get('token');

  // 当前可以使用的url参数对象
  let search_params = null;
  // 发现有token时重新同步sessionStorage中LOCATION_SEARCH值数据
  if(token){
    // 同步允许在url中直接累加的参数key(部分旧数据同步到新数据中)
    PARAM_ADD_KEY.forEach(key => {
      const val = search_params_old.get(key);
      val && search_params_new.set(key, val);
    });
    search_params = search_params_new;
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
// 浏览器参数对象
const search_params_obj = {};
// 当前最新的href
search_params_obj.href = location.href;
// 当前最新href和session中的参数集合
search_params_obj.param = url_param_init();

// 全局获取url参数值使用
window.SEARCH_PARAMS = search_params_obj;
// 获取清除参数的url
let url = get_url_no_param();
// 清除页面url参数
// window.history.replaceState('', '', url);