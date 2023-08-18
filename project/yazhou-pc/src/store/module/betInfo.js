/*
 * @Description: 投注信息管理器
 */
const initialState = {
  // 押注信息列表
  bet_list: [],
  // 押注扁平化对象扁平
  bet_obj: {},

  // 串关信息列表
  bet_s_list: [],
  // 串关对象扁平化
  bet_s_obj: {},

  bet_single_list: [],
  //单关投注对象
  bet_single_obj: {},
  // true: 单关投注 false: 串关投注
  is_bet_single: true,
  // 是否正在处理投注
  is_handle: false,
  // 单关 是否正在处理投注
  is_single_handle: false,
  // 菜单是否改变
  menu_change: false,
  // 选择的选项
  menu_obj: {},
  // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
  bet_mode: -1,
  // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
  bet_item_lock: false,
  // 当前是否为虚拟投注
  is_virtual_bet: true,
  // 虚拟投注是否正在进行
  is_virtual_handle: false,
  // 虚拟投注列表
  virtual_bet_list: [],
  // 虚拟投注对象
  virtual_bet_obj: {},
  // 虚拟体育串关列表
  virtual_bet_s_list: [],
  // 虚拟体育串关列表对象
  virtual_bet_s_obj: {},
  // 虚拟体育投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
  virtual_bet_mode: -1,
  // 虚拟体育错误信息
  virtual_error_info: {},
  // 左侧菜单的切换状态 true: 展开 false: 收缩
  left_menu_toggle: true,
  // 当前电竞查询的模式 false单关模式
  cur_esports_mode: false,
  // 是否为合并模式
  is_bet_merge: false,
  // 投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
  bet_category: 1,
  // 最小串关数
  mix_min_count: 2,
  // 最大串关数
  mix_max_count: 10,
  // 被预约的投注项id
  bet_appoint_obj: null,
  /* bet_appoint_odds_value: null,
  bet_appoint_ball_head: null */
  //需要预约的盘口
  pre_bet_list: null,
  //输入框最小值 备注 (预约投注用)
  pre_min_odd_value: -1,
  //聊天室来源跟单盘口状况eu
  chat_room_type: '',
  // 记录投注金额
  bet_current_money_obj: {},
};

export default function betInfoReducer(state = initialState, action) {
  switch (action.type) {
    //  押注信息列表
    case "set_bet_list":
      return { ...state, bet_list: action.data };
    // 押注扁平化对象扁平
    case "set_bet_obj":
      return { ...state, bet_obj: action.data };
    // 串关信息列表
    case "set_bet_s_list":
      return { ...state, bet_s_list: action.data };
    // 串关对象扁平化
    case "set_bet_s_obj":
      return { ...state, bet_s_obj: action.data };
    //
    case "set_bet_single_list":
      return { ...state, bet_single_list: action.data };
    // 单关投注对象
    case "set_bet_single_obj":
      return { ...state, bet_single_obj: action.data };
    // true: 单关投注 false: 串关投注
    case "set_is_bet_single":
      return { ...state, is_bet_single: action.data };
    // 是否正在处理投注
    case "set_is_handle":
      return { ...state, is_handle: action.data }
    //  单关 是否正在处理投注
    case "set_is_single_handle":
      return { ...state, is_single_handle: action.data };
    //  菜单是否改变
    case "set_menu_change":
      return { ...state, menu_change: action.data };
    //  选择的选项
    case "set_menu_obj":
      return { ...state, menu_obj: action.data };
    //  投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    case "set_bet_mode":
      return { ...state, bet_mode: action.data };
    // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
    case "set_bet_item_lock":
      return { ...state, bet_item_lock: action.data };
    // 当前是否为虚拟投注
    case "set_is_virtual_bet":
      return { ...state, is_virtual_bet: action.data };
    // 虚拟投注是否正在进行
    case "set_is_virtual_handle":
      return { ...state, is_virtual_handle: action.data };
    //  虚拟投注列表
    case "set_virtual_bet_list":
      return { ...state, virtual_bet_list: action.data };
    //  虚拟投注对象
    case "set_virtual_bet_obj":
      return { ...state, virtual_bet_obj: action.data };
    // 虚拟体育串关列表
    case "set_virtual_bet_s_list":
      return { ...state, virtual_bet_s_list: action.data };
    // 虚拟体育串关列表对象
    case "set_virtual_bet_s_obj":
      return { ...state, virtual_bet_s_obj: action.data };
    // 拟体育投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    case "set_virtual_bet_mode":
      return { ...state, virtual_bet_mode: action.data };
    //  虚拟体育错误信息
    case "set_virtual_error_info":
      return { ...state, virtual_error_info: action.data };
    // 左侧菜单的切换状态 true: 展开 false: 收缩
    case "set_left_menu_toggle":
      return { ...state, left_menu_toggle: action.data };
    //  当前电竞查询的模式 false单关模式
    case "set_cur_esports_mode":
      return { ...state, cur_esports_mode: action.data };
    //  是否为合并模式
    case "set_is_bet_merge":
      return { ...state, is_bet_merge: action.data };
    //  投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
    case "set_bet_category":
      return { ...state, bet_category: action.data };
    // 最小串关数
    case "set_mix_min_count":
      return { ...state, mix_min_count: action.data };
    //  最大串关数
    case "set_mix_max_count":
      return { ...state, mix_max_count: action.data };
    // 被预约的投注项id
    case "set_bet_appoint_obj":
      return { ...state, bet_appoint_obj: action.data };
    // 需要预约的盘口
    case "set_pre_bet_list":
      return { ...state, pre_bet_list: action.data };
    // 输入框最小值 备注 (预约投注用)
    case "set_pre_min_odd_value":
      return { ...state, pre_min_odd_value: action.data };
    // 聊天室来源跟单盘口状况eu
    case "set_chat_room_type":
      return { ...state, chat_room_type: action.data };
    // 记录投注金额
    case "set_bet_current_money_obj":
      return { ...state, bet_current_money_obj: action.data };
    default:
      return state;
  }
}


/**
 * @description: 添加单关投注项对象
 * @param {*} state
 * @param {*} obj 要添加的对象
 */
const bet_single_obj_attr = (state,obj) => {
  let new_obj = _.cloneDeep(state.bet_obj);
  // if(obj.key && (Object.keys(new_obj).indexOf(obj.key) > -1) && !(_.get(obj, 'is_update_single', false))) return;
  console.log('添加单关投注项对象----------',obj);
  if(obj.key && !obj.mode) {
    if(obj.cs.source == 'is_chat_room' || obj.cs.play_name == ''){  
      if(obj.cs.play_name == '' && state.bet_single_obj[obj.key] && state.bet_single_obj[obj.key].cs && state.bet_single_obj[obj.key].bs){
      let _cs = _.cloneDeep(state.bet_single_obj[obj.key].cs)
      let _bs = _.cloneDeep(state.bet_single_obj[obj.key].bs)
        obj.cs.play_name = _cs.play_name;
        obj.bs.hps[0].hl[0].ol.hpn = _bs.hps[0].hl[0].ol.hpn
      }
      state.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      state.bet_single_obj = _.cloneDeep(state.bet_single_obj);
    }else{
      state.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      state.bet_single_obj = _.cloneDeep(state.bet_single_obj);
    }
  } else if (obj.key && obj.mode=='clear_and_add') {
    state.bet_single_obj = {};
    state.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
    state.bet_single_obj = _.cloneDeep(state.bet_single_obj);
  } else if(obj && !obj.key) {
    state.bet_single_obj = obj;
  }
}