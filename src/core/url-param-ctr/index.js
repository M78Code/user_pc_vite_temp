/**
 * @Author: hanmar
 * @Date: 2023-11-12 13:52:55
 * @Description: url参数页面跳转核心逻辑
 */

// 允许在url中直接累加的参数key
const PARAM_ADD_KEY = ['wsl', 'pb'];

// 获取sessionStorage中的location_search数据
function get_session_storage_location_search()
{
  // 获取sessionStorage中的url参数
  const location_search = sessionStorage.getItem('LOCATION_SEARCH') || '';
  return new URLSearchParams(location_search);
}

// 同步局部参数到sessionStorage中location.search参数字符串中
const url_param_ctr_set = (obj={})=>{
  // 全局获取url参数值使用
  const search_params = window.SEARCH_PARAMS.param;
  for (const key in obj) {
    // 增加数据
    obj[key] && search_params.set(key, obj[key]);
  }
  sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
}
// 获取当前url(删除所有参数)
const get_url_no_param = ()=>{
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
const url_param_ctr_init = (vue_that)=>{
  // 获取项目信息
  const PROJECT_NAME = window.BUILDIN_CONFIG.PROJECT_NAME;
  // 全局获取url参数值使用
  const search_params= window.SEARCH_PARAMS.param;
  if(!sessionStorage.getItem('LOCATION_SEARCH')){
    // 参数持久化
    sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()));
  }
  // let url = get_url_no_param();
  // window.history.replaceState('', '', url);
  switch (PROJECT_NAME) {
    case 'yazhou-h5':
      
      break;
    case 'app-h5':
    
      break;
    case 'ouzhou-h5':
    
      break;
    case 'yazhou-pc':
    
      break;
    case 'new-pc':
    
      break;
    case 'ouzhou-pc':
    
      break;
    default:
      break;
  }
};
export default url_param_ctr_init
