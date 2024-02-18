import lodash from 'lodash'
const initialState = {
  current_score_info: {}, // 确定当前选中筛选项(主页顶部筛选)
  params: {
    mid: "", //赛事id
    tid: "", // 联赛 id
    sportId: "", //球类id
    media_type: "auto", // 直播类型
    time: Date.now()
  },
  isTop: true,//视频置顶
  topId: [],//置顶的玩法id
  play_media: {
    mid: 0,
    media_type: "",
    is_auto: true,
    time: Date.now()
  },
  // 点返回按钮 返到列表
  is_back_btn_click: false,
  // 电竞视频是否暂停
  is_pause_video: true,
  zoom: true,
  layout_statu: 0,//玩法列表单双列 0单列， 1双列
  is_fullscreen: false, //是否全屏
  // 赛事详情数量
  match_detail_count: 0,
  history_random: 1,
  // 当前选中玩法id
  tabs_active_index: 0,
  // 当前选中玩法对应的盘口玩法
  tabs_active_plays: [],
  detail_show_type: '',//详情页 显示类型 play:滚球   today：今日  early：早盘
  // 是否显示全屏投注
  is_show_full_bet:false,
  active_detail:{}, //详情比分面板，接口报错时的备用数据
  details_data_cache: {} // 玩法集对应玩法缓存数据
};

export default function matchesReducer(state = initialState, action) {
  
  const { type, data } = action
  switch (type) {
    // 
    case "SET_HISTORY_RANDOM":
      return {...state, history_random: data };
    // 
    case "SET_RIGHT_ZOOM":
      return {...state, zoom: data };
    // 
    case "SET_IS_PAUSE_VIDEO":
      return {...state, is_pause_video: data };
    // 保存详情右侧参数
    case "SET_MATCH_DETAILS_PARAMS":
      if (data) {
        let obj = Object.assign({},state.params, data, { time: Date.now() })
        return {...state, params: obj };
      } else {
        return {...state, params: {} };
      }
    // 设置置顶的玩法id
    case "SET_TOP_ID":
      let xdata = state.topId
      if (data.type) {
        if (!xdata.includes(data.id)) {
          xdata.push(data.id)
        }
      } else {
        xdata.splice(xdata.indexOf(data.id), 1)
      }
      return {...state, topId: xdata };
    // 
    case "SET_PLAY_MEDIA":
      data.is_auto = data.is_auto == undefined ? true : data.is_auto
      return {...state, play_media: data };
    // 
    case "SET_PLAY_MEDIA_AUTO":
      let new_play_media = lodash.cloneDeep(play_media);
      new_play_media.is_auto = data;
      return {...state, is_pause_video: new_play_media };
    // 设置玩法列表单双列 0单列， 1双列
    case "SET_LAYOUT_STATU":
      return {...state, layout_statu: data };
    // 
    case "SET_IS_FULLSCREEN":
      return {...state, is_fullscreen: data };
    // 设置赛事详情数量
    case "SET_MATCH_DETAIL_COUNT":
      return {...state, match_detail_count: data };
    // 设置获取是否从详情页返回
    case "SET_IS_BACK_BTN_CLICK":
      return {...state, is_back_btn_click: data };
    // 设置选中玩法id
    case "SET_TABS_ACTIVE_ID":
      return {...state, tabs_active_index: data };
    // 当前选中玩法对应的盘口玩法
    case "SET_TABS_ACTIVE_PLAYS":
      return {...state, tabs_active_plays: data || [] };
    // 设置详情页 显示类型
    case "SET_DETAIL_SHOW_TYPE":
      return {...state, detail_show_type: data };
    // 
    case "SET_IS_SHOW_FULL_BET":
      return {...state, is_show_full_bet: data };
    // 设置详情比分面板，接口报错时的备用数据
    case "SET_ACTIVE_DETAIL":
      return {...state, active_detail: data };
    // 设置玩法集对应玩法缓存数据
    case "SET_DETAILS_DATA_CACHE":
      if (!data || !Object.keys(data).length) {
        return {...state, details_data_cache: {} };
      }
      const details_data_cache = Object.assign({}, state.details_data_cache, data)
      return {...state, details_data_cache };
    default:
      return state;
  }
}
