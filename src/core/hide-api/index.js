/**
 * 埋点api操作 
 * 
 */
import { api_hide } from "src/api/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const {PROJECT_NAME,IS_PC} = BUILDIN_CONFIG;
const HIDE_API_NAME_MAP1 = {
  'yazhou-h5':{version:'',version_id:''},
  'yazhou-pc':{version:'',version_id:''},
  'ouzhou-h5':{version:'2023欧洲版',version_id:'3'},
  'ouzhou-pc':{version:'2023欧洲版',version_id:'3'},
  'new-pc':'',
  'app-h5':{version:'2023亚洲版',version_id:'2'},
}
// 埋点使用的缓存数据
let hide_api_data_obj = {};
/**
 * @description 埋点逻辑处理函数
 * @param obj 埋点提交数据,必传参数play_back_id,page_id,sport_id,match_id,tournament_id
 * @return 
 */
const replay_click_event = (obj) => {
  if(obj){
    // 部分数据为空时阻止运行
    if(!(obj.play_back_id && obj.page_id && obj.sport_id && obj.match_id && obj.tournament_id)){
      console.error('replay_click_event obj is error!', obj);
      return
    }
  } else {
    console.error('replay_click_event obj is null!');
    return;
  }
  //play_back_id和play_back_type对应关系
  const PLAY_BACK_MAP = {
    '1':'进球',
    '2':'角球',
    '3':'罚牌'
  }
  // page_id和page_name对应关系
  const PAGE_ID_MAP = {
    '1001':'PC赛果页面',
    '1002':'PC全屏投注页面',
    '1003':'PC赛事详情页面',
    '1004':'PC首页右侧页面',
    '1005':'PC大视频页面',
    '2001':'H5赛果',
    '2002':'H5全屏投注页面',
    '2003':'H5赛事详情(赛事分析)',
  }
  // eventCode转play_back_id值
  const event_code_to_play_back_id_fun = function(event_code){
    let res = '';
    switch (event_code) {
      case 'goal': 
        res= '1'; //进球
        break;
      case 'corner':
        res= '2'; //角球
        break;
      default:
        res= '3'; //罚牌
        break;
    }
    return res;
  }
  // eventCode转play_back_id值
  const play_back_id = event_code_to_play_back_id_fun(obj.play_back_id);
  let event_obj = {
    eventId: 1,// 事件id  1-精彩回放赛事id
    eventCode:null, // 事件名称 eventId为1时,eventCode值为精彩回放(暂时不传)
    playBackId: play_back_id, // 类型id 1-进球，2-角球，3-罚牌 (从obj对象总获取)
    playBackType: PLAY_BACK_MAP[play_back_id], // 回放类型：参数：进球、角球、罚牌  (从obj对象总获取-中文)
    pageId: obj.page_id,   //入口页id     (从obj对象总获取)   
    pageName: PAGE_ID_MAP[obj.page_id], //入口页名称   (从obj对象总获取)   
    sportId: obj.sport_id, // 球种   (从obj对象总获取)
    matchId: obj.match_id, // 赛事id/长id (从obj对象总获取)  
    tournamentId: obj.tournament_id, // 联赛id  (从obj对象总获取)  
    // user_id:_.get(window,'vue.$store.getters.get_user.userId'), // 玩家id (业务提供)
    // user_name:_.get(window,'vue.$store.getters.get_user.userName'), // 玩家名称 (业务提供)
    version: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version'), //  >>>前端提供(格式)
    versionId: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version_id'),
    deviceType:IS_PC?'1':'2', // 终端id：1-pc/2-h5/3-app/4  前端定义(h5/pc统一)     
    other1:'', // 其他扩展1
    other2:'', //其他扩展2
    other3:'', //其他扩展3
    other4:'', //其他扩展4
  }
  // eventCode提交埋点数据
  event_obj.versionId && api_hide.submit_event_collection(event_obj).then( res => {
    if(lodash.get(res, 'data.code') == 200){
      console.log('提交成功!');
    }
  })
}
/**
 * @description 进入列表埋点逻辑处理函数
 * @param obj 
 * @return 
 */
const into_home_event = (obj={}) => {
  // 暂时只发送欧洲版的埋点
  if(!['ouzhou-h5','ouzhou-pc','app-h5'].includes(PROJECT_NAME)){
    return;
  }
  let event_obj = {
    eventId: 2,// 事件id  2-进入首页id
    version: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version'), //  >>>前端提供(格式)
    versionId: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version_id'),
    deviceType:IS_PC?'1':'2', // 终端id：1-pc/2-h5/3-app/4  前端定义(h5/pc统一)     
  }
  Object.assign(event_obj,obj);
  // eventCode提交埋点数据
  event_obj.versionId && api_hide.submit_event_collection(event_obj).then( res => {
    if(lodash.get(res, 'data.code') == 200){
      console.log('提交成功!');
    }
  })
}
/**
 * @description 设置埋点缓存数据
 * @param event_id: 3-video查看视频, 4-animation	查看动画
 * @return 
 */
const set_hide_api_data_obj = (event_id, obj={})=>{
  console.error('set_hide_api_data_obj:',obj);
  hide_api_data_obj['event_id_'+event_id] = obj;
}
/**
 * @description 获取埋点缓存数据
 * @param obj 
 * @return 
 */
const get_hide_api_data_obj = (event_id)=>{
  return hide_api_data_obj['event_id_'+event_id] || {}
}

/**
 * @description 进入动画和视频的埋点逻辑处理函数
 * @param obj 
 * @return 
 */
const into_video_anima_event = (type)=>{
  console.error('into_video_anima_event:',type);

  // event_id:3	video	查看视频
  // event_id:4	animation	查看动画
  let event_id = '';
  switch (type+'') {
    case 'muUrl':
      event_id = 3;
      break;
    case 'animationUrl':
      event_id = 4;
      break;
  
    default:
      break;
  }
  if(event_id){
    // 获取埋点缓存数据
    const hide_api_obj = get_hide_api_data_obj(event_id);
    let event_obj = {
      eventId: event_id,// 事件id
      version: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version'), //  >>>前端提供(格式)
      versionId: lodash.get(HIDE_API_NAME_MAP1[PROJECT_NAME], 'version_id'),
      deviceType:IS_PC?'1':'2', // 终端id：1-pc/2-h5/3-app/4  前端定义(h5/pc统一)
      sportId: lodash.get(hide_api_obj, 'match.csid','1'),
      buttonId: lodash.get(hide_api_obj, 'button','3'), // 1.列表  2.右侧赛事信息 3.详情页  
      matchId:lodash.get(hide_api_obj, 'match.mid',''),
      tournamentId:lodash.get(hide_api_obj, 'match.tid',''),
    }
    // 情况埋点缓存数据
    set_hide_api_data_obj(event_id,{});
    // eventCode提交埋点数据
    event_obj.versionId && api_hide.submit_event_collection(event_obj).then( res => {
      if(lodash.get(res, 'data.code') == 200){
        console.log('提交成功!');
      }
    })
  }
}

export { 
  replay_click_event, 
  into_home_event, 
  into_video_anima_event,
  set_hide_api_data_obj,
  get_hide_api_data_obj
};
  