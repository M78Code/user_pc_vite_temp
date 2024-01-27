/**
 * @Author: hanmar
 * @Date: 2023-11-12 13:52:55
 * @Description: url参数页面跳转核心逻辑
 */
import { into_home_event } from "src/core/hide-api/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
// 获取sessionStorage中的location_search数据
const get_session_storage_location_search = () =>
{
  // 获取sessionStorage中的url参数
  const location_search = sessionStorage.getItem('LOCATION_SEARCH') || '';
  return new URLSearchParams(location_search);
}

// 同步局部参数到sessionStorage中location.search参数字符串中
const url_param_ctr_set = (obj={})=>{
  // 全局获取url参数值使用
  const search_params = window.SEARCH_PARAMS.init_param;
  for (const key in obj) {
    // 增加数据
    obj[key] && search_params.set(key, obj[key]);
  }
  sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()))
}
// 获取当前url(删除所有参数)
const get_url_no_param = ()=>{
  let url = location.href;
  if(!SEARCH_PARAMS.init_param.get('keep_url')){
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
  }
  return url;
}

//地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
const to_corresponding_router_yazhou_h5 = (that, params_obj) => {
  // 是否跳转/home页面
  let goto_home = true //that.$options.name=='homeIndex'?false:true;
  try {
    // 获取指定key值参数数组的url参数对象
    // let params_obj = this.get_url_param_key_obj(['m','s','mid','label','sy','activity','mt1','mt2','csid','isAPP','gotohash','keep_url']);
    let act = params_obj.get('activity');
    // home_index.vue页面辅助参数
    that.tianzhuan = true
    if (params_obj.get('label') == 1 || params_obj.get('sy') == 1) {
      //  商户是否需要直接跳到列表页（url地址有label参数）
      // that.set_golistpage(true) // hanmar需求对应
    }

    if(params_obj.get('mt1') && params_obj.get('mt1') != 900){ //去到列表页
      that.$router.push({
        name: 'matchList',
        query: {mt1:params_obj.get('mt1'), mt2:params_obj.get('mt2')}
      });
      // 删除多余参数
      SEARCH_PARAMS.init_param_del(['mt1','m','s','mt2']);
      goto_home = false;
    }else if (params_obj.get('m') == '407' || params_obj.get('mt1') == 900) {   //去到虚拟体育
      that.$router.push({ name: 'virtual_sports', query: { home: 'home' } })
      goto_home = false;
    } else if (params_obj.get('mid')) {   //去赛事详情
      // if ([100,101,102,103].includes(+params_obj.get('csid'))) {  // 如果是电竞赛事，需要设置菜单类型
      //   that.set_menu_type(3000)
      // }
      // // 改变跳转详情页标志状态
      // that.set_godetailpage(true)
      // // 更新赛事详情对应的赛事id
      // that.set_goto_detail_matchid(params_obj.get('mid'));
      // // 更新详情玩法集
      // that.set_details_item(0);
      that.$router.push({name:'category',params:{flag:1, mid:params_obj.get('mid')}});
      goto_home = false;
    } else if (params_obj.get('m')) {  //去到列表页
      that.$router.push({
        name: 'matchList',
        query: {
          m:params_obj.get('m'),
          s:params_obj.get('s'),
        }
      });
      // 删除多余参数
      SEARCH_PARAMS.init_param_del(['mt1','m','s','mt2']);
      goto_home = false;
    } else if (act){
      act = act.split(',')[0]
      if (['10007', '10008', '10009'].includes(act)) {
        that.$router.replace({ name: "activity_task", params:  { act: act,isAPP:params_obj.get('isAPP')}, query: { rdm: new Date().getTime() } });
        goto_home = false;
      } else {
        that.tianzhuan = false
      }
    } else if(params_obj.get('label') == 1 || params_obj.get('sy') == 1){
      // 不要首页页面,'m','s','mid','mt1','mt2'值为空时,直接跳到赛事列表页面
      that.$router.push({
          name: 'matchList',
      });
      // 删除多余参数
      SEARCH_PARAMS.init_param_del(['mt1','m','s','mt2']);
      goto_home = false;
    } else {
      that.tianzhuan = false
    }
  } catch (error) {
    console.error(error)
  }
  // 默认跳转到home页面
  if(goto_home){
    that.$router.replace({
      name: 'home',
      query: that.$router.query
    });
  }
}
//地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
const to_corresponding_router_yazhou_pc = (that, params_obj) => {
  try {
    // 获取指定key值参数数组的url参数对象['mt1','mt2','mid','csid','activity']
    if(params_obj.get('mt1') && params_obj.get('mt1') != 900){
      //去到列表页
      that.$router.push({
        name: 'home',
        query: {mt1:params_obj.get('mt1'), mt2:params_obj.get('mt2')}
      });
    } else if (params_obj.get('mt1') == 900) {
      //去到虚拟体育
      that.$router.push({ name: 'virtual_sports', query: { home: 'home' } })
    } else if (params_obj.get('mid')) {
      // 去赛事详情
      const csid = params_obj.get('csid');
      that.$router.push({name:'details',params:{flag:1, mid:params_obj.get('mid'),csid},query:{flag:1}});
    } else if (params_obj.get('activity')){
      // 去活动页面
      let act = params_obj.get('activity').split(',')[0]
      if (['10007', '10008', '10009'].includes(act)) {
        that.$router.replace({ name: "activity_task", params:  { act: act}, query: { rdm: new Date().getTime() } });
      }
    }
  } catch (error) {
    console.error(error)
  }
  // 删除多余参数
  SEARCH_PARAMS.init_param_del(['mt1','mt2','mid','csid','activity']);
}
//地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
const to_corresponding_router_app_h5 = (that, params_obj) => {
  try {
    // 获取指定key值参数数组的url参数对象['mt1','mt2','mid','csid','isAPP','activity','label','sy']
    if (params_obj.get('label') == 1 || params_obj.get('sy') == 1) {
      //去到列表页
      that.$router.push({
        name: 'matchList',
      });
    } else if(params_obj.get('mt1') && params_obj.get('mt1') != 900){
      //去到列表页
      that.$router.push({
        name: 'matchList',
        query: {mt1:params_obj.get('mt1'), mt2:params_obj.get('mt2')}
      });
    } else if (params_obj.get('mt1') == 900) {
      //去到虚拟体育
      that.$router.push({ name: 'virtual_sports', query: { home: 'home' } })
    } else if (params_obj.get('mid')) {
      // 去赛事详情
      const csid = params_obj.get('csid');
      that.$router.push({name:'category',params:{flag:1, mid:params_obj.get('mid'),csid}});
    } else if (params_obj.get('activity')){
      // 去活动页面
      let act = params_obj.get('activity').split(',')[0]
      if (['10007', '10008', '10009'].includes(act)) {
        that.$router.replace({ name: "activity_task", params:  { act: act,isAPP:params_obj.get('isAPP')}, query: { rdm: new Date().getTime() } });
      }
    }
  } catch (error) {
    console.error(error)
  }
  // 删除多余参数
  SEARCH_PARAMS.init_param_del(['mt1','mt2','mid','csid','isAPP','activity','label','sy']);
}

//地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
const to_corresponding_router_ouzhou_h5 = (that, params_obj) => {
  try {
    // 获取指定key值参数数组的url参数对象['mt1','mt2','mid','tid','csid','isAPP','activity','label','sy']
    if (params_obj.get('label') == 1 || params_obj.get('sy') == 1) {
      //去到列表页
      that.$router.push({
        name: 'matchList',
      });
    } else if(params_obj.get('mt1') && params_obj.get('mt1') != 900){
      //去到列表页
      that.$router.push({
        name: 'matchList',
        query: {mt1:params_obj.get('mt1'), mt2:params_obj.get('mt2')}
      });
    } else if (params_obj.get('mt1') == 900) {
      //去到虚拟体育
      that.$router.push({ name: 'virtual_sports', query: { home: 'home' } })
    } else if (params_obj.get('mid')) {
      // 去赛事详情
      const csid = params_obj.get('csid');
      const tid = params_obj.get('tid');
      that.$router.push({name:'category',params:{flag:1, mid:params_obj.get('mid'),csid,tid}});
    } else if (params_obj.get('activity')){
      // 去活动页面
      let act = params_obj.get('activity').split(',')[0]
      if (['10007', '10008', '10009'].includes(act)) {
        that.$router.replace({ name: "activity_task", params:  { act: act,isAPP:params_obj.get('isAPP')}, query: { rdm: new Date().getTime() } });
      }
    }
  } catch (error) {
    console.error(error)
  }
  // 删除多余参数
  SEARCH_PARAMS.init_param_del(['mt1','mt2','mid','tid','csid','isAPP','activity','label','sy']);
}

//地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
const to_corresponding_router_ouzhou_pc = (that, params_obj) => {
  try {
    // 获取指定key值参数数组的url参数对象['mt1','mt2','mid','csid','activity']
    if(params_obj.get('mt1') && params_obj.get('mt1') != 900){
      //去到列表页
      that.$router.push({
        name: 'matchList',
        query: {mt1:params_obj.get('mt1'), mt2:params_obj.get('mt2')}
      });
    } else if (params_obj.get('mt1') == 900) {
      //去到虚拟体育
      that.$router.push({ name: 'virtual_sports', query: { home: 'home' } })
    } else if (params_obj.get('mid')) {
      // 去赛事详情
      const csid = params_obj.get('csid');
      that.$router.push({name:'details',params:{flag:1, mid:params_obj.get('mid'),csid}});
    } else if (params_obj.get('activity')){
      // 去活动页面
      let act = params_obj.get('activity').split(',')[0]
      if (['10007', '10008', '10009'].includes(act)) {
        that.$router.replace({ name: "activity_task", params:  { act: act}, query: { rdm: new Date().getTime() } });
      }
    }
  } catch (error) {
    console.error(error)
  }
  // 删除多余参数
  SEARCH_PARAMS.init_param_del(['mt1','mt2','mid','csid','activity']);
}
let timer = 0;
const watch_route_fun = (to, from, that)=>{
  clearTimeout(timer);
  // if(BUILDIN_CONFIG.PROJECT_NAME == 'app-h5' && to.name == 'virtual_sports_details'){
  //   return;
  // }
  // 发送进入首页埋点消息
  if(that && ['matchList','home'].includes(to.name)){
    clearTimeout(that.timer);
    that.timer = setTimeout(() => {
      lodash.get(UserCtr,'user_info.userId') && into_home_event();
    }, 2000);
  }
  if(location.href.indexOf('token') == -1){
    return;
  }
  // 发送进入首页埋点消息
  if(that && ['matchList','home'].includes(to.name)){
    clearTimeout(that.timer);
    that.timer = setTimeout(() => {
      lodash.get(UserCtr,'user_info.userId') && into_home_event();
    }, 2000);
  }
  timer = setTimeout(() => {
    // 删除所有url参数
    let hash = location.hash;
    if(hash && hash.indexOf('?') > -1){
      hash = hash.substring(0,hash.indexOf('?'));
      document.location.hash=hash;
    }
    // 使用replaceState时需要传入当前history的state  具体可查文档中关于replaceState的使用 https://router.vuejs.org/guide/migration/
    window.history.replaceState(window.history.state, '', get_url_no_param());
  }, 200);
}

// 同步局部参数到sessionStorage中location.search参数字符串中,并进行参数获取分流操作
const url_param_ctr_init = (vue_that)=>{
  // 获取项目信息
  const PROJECT_NAME = BUILDIN_CONFIG.PROJECT_NAME;
  // 全局获取url参数值使用
  const search_params= window.SEARCH_PARAMS.init_param;
  if(!sessionStorage.getItem('LOCATION_SEARCH')){
    // 参数持久化
    sessionStorage.setItem('LOCATION_SEARCH', decodeURIComponent(search_params.toString()));
  }
  let url = get_url_no_param();
  // window.history.replaceState('', '', url);
  switch (PROJECT_NAME) {
    case 'yazhou-h5':
      window.history.replaceState('', '', url);
      to_corresponding_router_yazhou_h5(vue_that, search_params);
      break;
    case 'app-h5':
      window.history.replaceState('', '', url);
      to_corresponding_router_app_h5(vue_that, search_params);
      break;
    case 'ouzhou-h5':
      window.history.replaceState('', '', url);
      to_corresponding_router_ouzhou_h5(vue_that, search_params);
      break;
    case 'yazhou-pc':
      window.history.replaceState('', '', url);
      to_corresponding_router_yazhou_pc(vue_that, search_params);
      break;
    case 'new-pc':
    
      break;
    case 'ouzhou-pc':
      window.history.replaceState('', '', url);
      to_corresponding_router_ouzhou_pc(vue_that, search_params);
      break;
    case 'activity':
      window.history.replaceState('', '', url);
      break;
    default:
      break;
  }
};
export {url_param_ctr_init, watch_route_fun};
