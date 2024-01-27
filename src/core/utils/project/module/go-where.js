/**
 * @Author: MasterJ
 * @Date: 2022-07-12 21:13
 * @Description 左上角 箭头返回 公用方法控制
 */
// ==========临时待实际跳转页面设置后修改============
  let is_banner_jump = ''
  let is_close_video = false
  let golistpage = false
  let godetailpage = false
// =============================================
import { MatchDetailCalss } from "src/output/module/project-single.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { PROJECT_NAME } = BUILDIN_CONFIG ;
// 返回首页
const go_home = ({back_to, route_name, route, router}) => {
  if(get_show_favorite_list){
    set_show_favorite_list(false);
  } else {
    // 应该需要url回传参数才对
    router.push({name: 'home'});
  }
}
// 详情页返回
const go_to_back = ({back_to, route_name, route, router}) => {
  if (is_banner_jump) {       // 从视频直播进来返回时
    router.push({name: 'home'});      // 返回到视频直播页
  } else if (
      // 从规则页返回到虚拟体育页时，再点击返回要返回到列表页
      route.query.from == 'rule_description' ||
      // 如果赛事关闭
      is_close_video || 
      // 赛果页返回
      ['result_details', 'match_result'].includes(route.name) ||
      // 如果商户要求不要首页
      golistpage
  ) {
    router.push({name: 'matchList'});     // 返回列表页
  }
  else if(godetailpage){  //如果商户是直接从外面跳到的详情页
    router.push({name: 'matchList'});
    godetailpage = false; // 重置数据
  }
  else{
    router.go(-1);             // 返回上一级菜单
  }
}
// 虚拟体育返回
const go_back_from_virtual = ({back_to, route_name, route, router}) => {
  if(route.query.home && !golistpage){
    router.push(route.query.home);      // 返回到  ‘home’字段的 页面
  // } else if (['rule_description', 'match_list'].includes(route.query.from) || is_close_video || ['result_details', 'match_result'].includes(route.name) || get_golistpage) {
  } else if (['rule_description', 'match_list'].includes(route.query.from) || is_close_video || ['result_details', 'match_result'].includes(route.name) ) {
    //从规则页返回到虚拟体育页时，再点击返回要返回到列表页
    router.push({name: 'matchList'});
  } else if(is_banner_jump){ // 从视频直播进来返回时
    // router.push({name: 'home'});       // 返回到视频直播页
    router.push({name: 'match'});       // 返回到视频直播页
  } else if(PROJECT_NAME == 'app-h5'){//复刻版
    router.push({name: 'matchList'});
  }else{
    router.go(-1);        // 返回上一级菜单
  }
} 
// 虚拟体育详情返回
const go_back_from_virtual_detail = ({back_to, route_name, route, router}) => {
  //删除详情页玩法缓存
  for (const key in sessionStorage) {
    if (key.match(/^\d.+-cache/)) {
      sessionStorage.removeItem(key);
    }
  }
  // 重置此值
  MatchDetailCalss.set_is_show_details_analyse(false)
  router.push({name:'virtual_sports',query:{home: route.query.home ? route.query.home : 'match'}})
}
// 公告页返回
const go_back_from_notice = ({back_to, route_name, route, router}) => {
  if(get_menu_type == 900 && route.name == 'rule_description') {
    router.push({name:'virtual_sports',query:{from:'rule_description'}});//跳转到虚拟体育
    return
  }
 
  if(route.name == 'rule_description'){
    const query = route.query
    router.push({name: `${route_name}`, query}); // 从首页进入规则说明, 返回到首页 列表进入就返回到列表页
    return
  }
  if(route.name == 'notice') router.push({name: 'home'});
}
 // 详情mini header返回
 const go_back_from_mini_header = ({back_to, route_name, route, router}) => {
  let count = -1;
  // 因为get_change_count默认是0次 点击切换视频或动画 此数字+1
  // count -= get_change_count; //todo
  // 所以返回页面不能写死-1 需要动态获取
  router.go(count);
}
// 活动页返回
const go_back_from_activity = ({back_to, route_name, route, router}) => {
  let {act} = route.params
  // 如果是 场馆进来
  if(act){
    if (!location.search.includes('keep_url')) {
      history.replaceState(window.history.state,'',`{location.pathname}{location.hash}`)
    }
    // 设置 replace 属性（默认值: false）的话，当点击时，会调用 router.replace() 而不是 router.push()，于是导航后不会留下 history 记录,即使点击返回按钮也不会回到这个页面
    // 便于点击返回 到商户的 原来的 banner 页面
    router.replace({ name: "home"});
  }else{
    // 如果不是场馆，回到自己的项目内页
    if(router.go){
      router.go(-1)
    }else{
      router.replace({ name: "home"});
    }
  }
}
// 左上角 箭头返回 公用方法
function go_where({back_to, route_name='', route ={}, router = {}}) {
    // 目标跳转控制映射map
    const page_target_map = {
      go_home,
      go_to_back,
      go_back_from_virtual,
      go_back_from_virtual_detail,
      go_back_from_notice,
      go_back_from_mini_header,
      go_back_from_activity
    }
    
    page_target_map[back_to]({back_to, route_name, route, router})
}
export { go_where }
