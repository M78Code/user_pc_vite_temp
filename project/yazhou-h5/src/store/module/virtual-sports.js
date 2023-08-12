/*
 * @Description: 虚拟体育vuex store
 */
const initialState = {
  //当前选中的联赛
  current_league: {},
  //当前选中的批次
  current_batch: {},
  //视频进程接口已获取标志
  video_process_loaded: {},
  //当前赛事id
  current_match_mid: "",
  //视频进程数据
  video_process_data: null,
  //正在跳转详情的赛事
  current_gotodetail_match: {},
  //上次请求的虚拟赛事列表参数
  prev_v_sports_params: {},
  //上次请求的虚拟体育赛事列表
  prev_v_sports: {},
  // 是否是用户（顶部按钮）刷新
  is_user_refreshing: false,
};

export default function virtualSportsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_PREV_V_SPORTS":
      return { ...state, prev_v_sports: action.data };
    case "SET_PREV_V_SPORTS_PARAMS":
      return { ...state, prev_v_sports_params: action.data };
    case "SET_CURRENT_LEAGUE":
      return { ...state, current_league: action.data };
    case "SET_CURRENT_BATCH":
      return { ...state, current_batch: action.data };
    case "SET_VIDEO_PROCESS_LOADED":
      return { ...state, video_process_loaded: action.data };
    case "SET_CURRENT_MID":
      return { ...state, current_match_mid: action.data };
    case "SET_VIDEO_PROCESS_DATA":
      return { ...state, video_process_data: action.data };
    case "SET_CURRENT_GOTODETAIL_MATCH":
      return { ...state, current_gotodetail_match: action.data };

    // case "SET_CURRENT_MATCH_ASSIGN":
    // return { ...state, current_gotodetail_match: action.data };
    case "SET_IS_USER_REFRESHING":
      return { ...state, is_user_refreshing: action.data };
    default:
      return state;
  }
}
