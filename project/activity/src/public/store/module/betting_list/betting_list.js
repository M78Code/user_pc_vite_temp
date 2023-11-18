/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注中使用的vuex数据部分
 */
import { reactive } from 'vue';
import play_mapping from "project/activity/src/public/config/mapping/play_mapping.js";


const state = reactive({
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
    pre_min_odd_value:-1,
    //聊天室来源跟单盘口状况eu
    chat_room_type: '',
       // 记录投注金额
    bet_current_money_obj: {},
})

// 投注列表缓存对象
export default {
  getters: {
     /**
     * 聊天室来源跟单盘口状况eu
     * @param {*} state
     * @returns
     */
    get_chat_room_type() {
      return state.chat_room_type;
    },
    /**
     * 获取输入框最小值
     * @param {*} state
     * @returns
     */
    get_pre_min_odd_value() {
      return state.pre_min_odd_value;
    },
    /**
     * 获取当前盘口下所有的投注项
     * @param {*} state
     * @returns
     */
    get_pre_bet_list() {
      return state.pre_bet_list;
    },
    /**
     * @description: 获取串关列表(主要存入的是串关投注项id)
     * @param {*} state
     */
    get_bet_list() {
      return state.bet_list;
    },
    /**
     * @description: 获取串关投注项对象
     * @param {*} state
     */
    get_bet_obj() {
      return state.bet_obj;
    },
    /**
     * @description: 获取串关投注输入列表部分数据(主要存入的是串关输入部分的id如:2001,3001)
     * @param {*} state
     */
    get_bet_s_list() {
      return state.bet_s_list;
    },
    /**
     * @description: 获取串关投注输入对象数据
     * @param {*} state
     */
    get_bet_s_obj() {
      return state.bet_s_obj;
    },
    /**
     * @description: 是否为单关
     * @param {*} state
     */
    is_bet_single() {
      return state.is_bet_single;
    },
    /**
     * @description: 串关是否正在投注中
     * @param {*} state
     */
    get_is_handle() {
      return state.is_handle;
    },
    /**
     * @description: 获取单关列表(以前单关可以有多个，历史原因目前数组中只存一个值)
     * @param {*} state
     */
    get_bet_single_list() {
      return state.bet_single_list;
    },
    /**
     * @description: 获取单关投注项对象
     * @param {*} state
     */
    get_bet_single_obj() {
      return state.bet_single_obj;
    },
    get_is_single_handle() {
      return state.is_single_handle;
    },
    /**
     * @description: 获取用户喜好菜单数据
     * @param {*} state
     */
    get_menu_obj() {
      return state.menu_obj;
    },
    /**
     * @description: 用户喜好菜单是否被更改过
     * @param {*} state
     */
    get_menu_change() {
      return state.menu_change
    },
    //投注模式
    get_bet_mode() {
      return state.bet_mode;
    },
    /**
     * @description: 当前是否为虚拟体育投注
     * @param {*} state
     */
    get_is_virtual_bet() {
      return state.is_virtual_bet;
    },
    /**
     * @description: 虚拟体育投注是否正在进行
     * @param {*} state
     * @return {*}
     */
    get_is_virtual_handle() {
      return state.is_virtual_handle;
    },
    /**
     * @description: 虚拟体育投注列表(列表只有一个id时默认为单关，为多个时默认为串关，因此虚拟体育不做是否为单关还是串关的标识)
     * @param {*} state
     */
    get_virtual_bet_list() {
      return state.virtual_bet_list;
    },
    /**
     * @description: 获取虚拟体育投注对象
     * @param {*} state
     */
    get_virtual_bet_obj() {
      return state.virtual_bet_obj;
    },
    /**
     * @description: 获取虚拟体育投注输入部分列表数据
     * @param {*} state
     */
    get_virtual_bet_s_list() {
      return state.virtual_bet_s_list;
    },
    /**
     * @description: 获取虚拟体育投注输入部分对象
     * @param {*} state
     */
    get_virtual_bet_s_obj() {
      return state.virtual_bet_s_obj;
    },
    /**
     * @description: 获取虚拟体育投注模式
     * @param {*} state
     */
    get_virtual_bet_mode() {
      return state.virtual_bet_mode;
    },
    /**
     *
     * @param {*} state
     * @returns  投注项是否要锁
     */
    get_bet_item_lock() {
      return state.bet_item_lock;
    },
    /**
     *
     * @param {*} state
     * @returns  电竞虚拟投注提示信息
     */
    get_virtual_error_info() {
      return state.virtual_error_info;
    },
     /**
     *
     * @param {*} state
     * @returns  左侧菜单状态 展开或收起
     */
    get_left_menu_toggle() {
      return state.left_menu_toggle;
    },
    /**
     * @param {*} state
     * @returns  当前模式
     */
    get_cur_esports_mode() {
      return state.cur_esports_mode;
    },
    /**
     * @param {*} state
     * @returns  显示投注按钮
     */
    get_show_bet_btn() {
      return state.show_bet_btn;
    },
     /**
     * @param {*} state
     * @returns  是否合并
     */
    get_is_bet_merge() {
      return state.is_bet_merge;
    },
    get_bet_category() {
      return state.bet_category;
    },
    /**
     * @param {*} state
     * @returns  获取最小
     */
    get_mix_min_count() {
      return state.mix_min_count;
    },
    /**
     * @param {*} state
     * @returns  获取最大
     */
    get_mix_max_count() {
      return state.mix_max_count;
    },
    /**
     * 被预约的投注项
     * @param {*} state 
     * @returns 
     */
    get_bet_appoint_obj() {
      return state.bet_appoint_obj;
    },
    get_bet_current_money_obj() {
      return state.bet_current_money_obj;
    }
  },
  actions: {
    set_chat_room_type({ commit }, chat_room_type){
      commit("set_chat_room_type", chat_room_type);
    },
    set_pre_min_odd_value({ commit }, pre_min_odd_value) {
      commit("set_pre_min_odd_value", pre_min_odd_value);
    },
    set_pre_bet_list({ commit }, pre_bet_list) {
      commit("set_pre_bet_list", pre_bet_list)
    },
    set_bet_list({ commit }, bet_list) {
      commit("set_bet_list", bet_list)
    },
    bet_list_remove({ commit }, i) {
      commit("bet_list_remove", i)
    },
    bet_list_push({ commit }, obj) {
      commit("bet_list_push", obj)
    },
    bet_obj_add_attr({ commit }, obj) {
      commit("bet_obj_add_attr", obj)
    },
    bet_obj_remove_attr({ commit }, key) {
      commit("bet_obj_remove_attr", key)
    },
    bet_mix_clear({commit}) {
      commit('bet_mix_clear');
    },
    set_is_bet_single({ commit }, is_bet_single) {
      commit("set_is_bet_single", is_bet_single)
    },
    //串关信息
    set_bet_s_list({ commit }, list) {
      commit("set_bet_s_list", list)
    },
    bet_s_list_remove({ commit }, i) {
      commit("bet_s_list_remove", i)
    },
    bet_s_list_push({ commit }, obj) {
      commit("bet_s_list_push", obj)
    },
    bet_s_obj({ commit }, obj) {
      commit("bet_s_obj", obj)
    },
    bet_s_obj_upd_cs({ commit }, obj) {
      commit("bet_s_obj_upd_cs", obj)
    },
    bet_s_obj_add_attr({ commit }, obj) {
      commit("bet_s_obj_add_attr", obj)
    },
    bet_s_remove_attr({ commit }, key) {
      commit("bet_s_remove_attr", key)
    },
    set_is_handle({ commit }, is_handle) {
      commit("set_is_handle", is_handle)
    },
    upd_bet_obj({ commit }, callback) {
      commit("upd_bet_obj", callback)
    },
    // 刷新列表时数据合并
    http_upd_data({ commit }, obj) {
      commit("http_upd_data", obj)
    },
    set_bet_single_list({ commit }, bet_single_list) {
      commit('set_bet_single_list', bet_single_list);
    },
    bet_single_list_remove({ commit }, i) {
      commit('bet_single_list_remove', i);
    },
    bet_single_list_push({ commit }, obj) {
      commit('bet_single_list_push', obj);
    },
    bet_single_obj_attr({ commit }, obj) {
      // console.log( "bet_single_obj_attr  ----", JSON.stringify(obj))
      commit('bet_single_obj_attr', obj);
    },
    bet_single_obj_remove_attr({ commit }, key) {
      commit('bet_single_obj_remove_attr', key);
    },
    bet_single_clear({ commit }) {
      commit('bet_single_clear');
    },
    set_is_single_handle({commit}, flag) {
      commit('set_is_single_handle', flag);
    },
    set_menu_obj({commit}, menu_obj) {
      commit('set_menu_obj', menu_obj);
    },
    set_menu_change({commit}, menu_change) {
      commit('set_menu_change', menu_change);
    },
    set_bet_mode({commit}, bet_mode) {
      commit('set_bet_mode', bet_mode);
    },
    set_is_virtual_bet({commit}, is_virtual_bet) {
      commit('set_is_virtual_bet', is_virtual_bet);
    },
    set_is_virtual_handle({commit}, is_virtual_handle) {
      commit('set_is_virtual_handle', is_virtual_handle);
    },
    set_virtual_bet_list({commit}, virtual_bet_list) {
      commit('set_virtual_bet_list', virtual_bet_list);
    },
    virtual_bet_list_push({commit}, id) {
      commit('virtual_bet_list_push', id);
    },
    virtual_bet_list_del({commit}, id) {
      commit('virtual_bet_list_del', id);
    },
    virtual_bet_s_obj_upd_cs({ commit }, obj) {
      commit("virtual_bet_s_obj_upd_cs", obj)
    },
    virtual_bet_obj_add({commit}, obj) {
      commit('virtual_bet_obj_add', obj);
    },
    virtual_bet_obj_del({commit}, key) {
      commit('virtual_bet_obj_del', key);
    },
    set_virtual_bet_s_list({commit}, list) {
      commit('set_virtual_bet_s_list', list);
    },
    set_virtual_bet_s_obj({commit}, virtual_bet_s_obj) {
      commit('set_virtual_bet_s_obj', virtual_bet_s_obj);
    },
    virtual_bet_s_obj_add({commit}, obj) {
      commit('virtual_bet_s_obj_add', obj);
    },
    virtual_bet_s_obj_del({commit}, key) {
      commit('virtual_bet_s_obj_del', key);
    },
    virtual_bet_s_clear({commit}, key) {
      commit('virtual_bet_s_clear', key);
    },
    virtual_bet_clear({commit}, key) {
      commit('virtual_bet_clear', key);
    },
    set_virtual_bet_mode({commit}, virtual_bet_mode) {
      commit('set_virtual_bet_mode', virtual_bet_mode);
    },
    set_bet_item_lock({commit}, bet_item_lock) {
      commit('set_bet_item_lock', bet_item_lock);
    },
    set_virtual_error_info({commit}, virtual_error_info) {
      commit('set_virtual_error_info', virtual_error_info);
    },
    //左侧菜单切换
    set_left_menu_toggle({commit}, left_menu_toggle) {
      commit('set_left_menu_toggle', left_menu_toggle);
    },
    set_cur_esports_mode({commit}, cur_esports_mode) {
      commit('set_cur_esports_mode', cur_esports_mode);
    },
    set_is_bet_merge({commit}, is_bet_merge) {
      commit('set_is_bet_merge', is_bet_merge);
    },
    set_bet_category({commit}, bet_category) {
      commit('set_bet_category', bet_category);
    },
    set_mix_min_count({commit}, mix_min_count) {
      commit('set_mix_min_count', mix_min_count);
    },
    set_mix_max_count({commit}, mix_max_count) {
      commit('set_mix_max_count', mix_max_count);
    },
    set_bet_appoint_obj({commit}, bet_appoint_obj) {
      commit('set_bet_appoint_obj', bet_appoint_obj);
    },
    set_bet_current_money_obj({commit}, money_obj) {
      commit('set_bet_current_money_obj', money_obj);
    }
  },
  mutations: {
    /**
     * 设置聊天室来源跟单盘口状况eu
     * @param {*} state
     * @returns
     */
    set_chat_room_type(chat_room_type){
      state.chat_room_type = chat_room_type;
    },
    /**
     *  设置输入框最小值
     * @param {*} state
     * @returns
     */
    set_pre_min_odd_value(state, pre_min_odd_value) {
      state.pre_min_odd_value = pre_min_odd_value;
    },
    /**
     * 存储是否能预约
     * @param {*} state
     * @param {*} is_pre
     */
    set_is_pre(state, is_pre) {
      state.is_pre = is_pre;
    },
    /**
     * 获取所有预约数据
     * @param {*} state
     * @param {*} pre_bet_list
     */
    set_pre_bet_list(pre_bet_list) {
      state.pre_bet_list = pre_bet_list;
    },
    /**
     * @description: 设置串关列表
     * @param {*} state
     * @param {*} bet_list
     */
    set_bet_list(state, bet_list) {
      state.bet_list = bet_list
    },
    /**
     * @description: 删除串关列表
     * @param {*} state
     * @param {*} i 需要删除的id索引
     */
    bet_list_remove(state, i) {
      let temp = Object.assign([], state.bet_list);
      temp.splice(i, 1);
      state.bet_list = temp;
    },
    /**
     * @description: 添加串关列表
     * @param {*} state
     * @param {*} id 加入的id
     */
    bet_list_push(state, id) {
      if (!state.bet_list.includes(id)) {
        state.bet_list.push(id);
      }
    },
    /**
     * @description: 添加串关投注项对象
     * @param {*} state
     * @param {*} obj 要添加的投注项对象
     */
    bet_obj_add_attr(state, obj) {
      let new_obj = _.cloneDeep(state.bet_obj);
      if (obj.key && new_obj[obj.key] && new_obj[obj.key].cs) {
        new_obj[obj.key].cs.is_serial = obj.cs.is_serial
      }
      // if(obj.key && !(Object.keys(new_obj).indexOf(obj.key) > -1)){
        // new_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      // }
      if(obj.key) {
        new_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      }
      state.bet_obj = new_obj
    },
    /**
     * @description: 删除投注对象
     * @param {*} state
     * @param {*} key 需要删除对象的键值
     */
    bet_obj_remove_attr(state, key) {
      delete state.bet_obj[key];
    },
    /**
     * @description: 清除虚拟投注数据
     * @param {*} state
     */
    bet_mix_clear(state) {
      state.bet_list = [];
      state.bet_s_list = [];
      state.bet_obj = {};
      state.bet_s_obj = {};
    },
    /**
     * @description: 设置单关串关标志
     * @param {*} state
     * @param {*} is_bet_single 是否为单关
     */
    set_is_bet_single(state, is_bet_single) {
      state.is_bet_single = is_bet_single;
    },
    /**
     * @description: 串关投注项输入列表设置
     * @param {*} state
     * @param {*} list 要设置的列表数据
     */
    set_bet_s_list(state, list) {
      state.bet_s_list = list;
    },
    /**
     * @description: 移除串关投注项输入列表中的数据
     * @param {*} state
     * @param {*} i 需要移除的索引
     */
    bet_s_list_remove(state, i) {
      let temp = Object.assign([], state.bet_s_list);
      temp.splice(i, 1);
      state.bet_s_list = temp;
    },
    bet_s_list_push(state, obj) {
      if (!state.bet_s_list.includes(obj)) {
        state.bet_s_list.push(obj);
      }
    },
    /**
     * @description: 投注项输入对象设置
     * @param {*} state
     * @param {*} obj 需要设置的对象
     */
    bet_s_obj(state, obj) {
      state.bet_s_obj = obj;
    },
    /**
     * @description: 更新投注项对象(合并最大最小值时使用)
     * @param {*} state
     * @param {*} obj 需要更新的对象
     */
    bet_s_obj_upd_cs(state, obj) {
      // {
        // "code": 0,
        // "globalId": "62999667334a40779ea392afd2bcaeec",
        // "minBet": "0.33",
        // "orderMaxPay": "0",
        // "playId": "",
        // "type": "2001"
    // },
      if(obj && obj.type)
      {
        if(state.bet_s_obj[obj.type])
        {
          Object.assign(state.bet_s_obj[obj.type].cs,{
            min_money:obj.minBet,
            max_money:obj.orderMaxPay
          })
        }
      }
    },
    /**
     * @description: 添加投注串关输入对象
     * @param {*} state
     * @param {*} obj 需要添加的对象
     */
    bet_s_obj_add_attr(state, obj) {
      if(obj.key) {
        state.bet_s_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
        state.bet_s_obj = _.cloneDeep(state.bet_s_obj);
      }
    },
    /**
     * @description: 删除串关投注项输入对象
     * @param {*} state
     * @param {*} key 串关投注项输入对象的键值
     */
    bet_s_remove_attr(state, key) {
      delete state.bet_s_obj[key];
    },
    /**
     * @description: 串关是否正在进行
     * @param {*} state
     * @param {*} is_handle 进行的标志位
     */
    set_is_handle(state, is_handle) {
      state.is_handle = is_handle;
    },
    /**
     * @description: 更新投注项对象
     * @param {*} state
     * @param {*} callback 回调函数
     */
    upd_bet_obj(state, callback) {
      if (callback) {
        callback(state)
      }
    },
    /**
     * @description: 调用queryLatestMarketInfo完接口后的回调方法用来更新vuex中投注项的数据
     * @param {*} state
     * @param {*} obj 设置的新对象
     */
    http_upd_data(state, obj) {
      // console.log('进入queryLatestMarketInfo回调方法',{method: 'http_upd_data'});
      let i = obj.i;

      let http_data_list = obj.http_data_list;  //接口返回的http_data_list
      let id, hpid, old_hv, old_on, new_on = '', handicap_value, old_odds_value, bs, hid, msc, bet_obj, score_type;
      let bet_item, self = obj.self, handicap_change = {};

      if(state.is_bet_single) {
        bet_obj = "bet_single_obj";
        id = state.bet_single_list[i];
      } else {
        bet_obj = "bet_obj";
        id = state.bet_list[i];
      }
      if(!id) return;
      if(!state[bet_obj][id]) {
        return;
      }
      bet_item = state.bet_obj[id];
      bs = state[bet_obj][id].bs;

      hid =  _.get(bs, 'hps[0].hl[0].hid') || _.get(bs, 'hps[0].hl[0].ol.hid');
      hpid = _.get(bs, 'hps[0].hpid') ||  _.get(bs, 'hps[0].hl[0].ol.hpid');
      old_hv = bs.hps[0].hl[0].hv ||  _.get(bs, 'hps[0].hl[0].ol.hv');
      old_on = bs.hps[0].hl[0].ol[0] ?bs.hps[0].hl[0].ol[0].on:bs.hps[0].hl[0].ol.on;
      old_odds_value = bs.hps[0].hl[0].ol[0]?bs.hps[0].hl[0].ol[0].ov:bs.hps[0].hl[0].ol.ov;
      // console.log('提起获取上次旧数据:', {hid, old_hv, old_on, old_odds_value })
      // 如果盘口有正负号,则移除正负号
      if(old_hv) {
       old_hv = _.trim(old_hv);
       if(old_hv.startsWith('+') || old_hv.startsWith('-')) {
        old_hv = old_hv.substr(1, old_hv.length);
       } else if (old_hv.endsWith('+') || old_hv.endsWith('-')) {
        old_hv = old_hv.substr(0, old_hv.length-1);
       }
      }

      // 取掉盘口值 如: 大
      if(old_on && old_on.includes(old_hv)) {
        // 用&nbsp;先取代盘口的位置
        new_on = old_on.replace(old_hv, '&nbsp;');
        // console.log(`========用&nbsp;先取代盘口的位置===============>${new_on}`);
      }

      //整合数据
      http_data_list.forEach((market_info) => {
        let {
            away, // 客队id
            home,  // 主队id
            matchInfoId, // 赛事id
            matchPeriodId, // 赛事阶段
            matchStatus, // 赛事状态
            matchHandicapStatus,//赛事盘口状态
            playId,    // 玩法id
            playName,  // 玩法名称
            tournamentName, // 联赛名称
            currentMarket,  // 当前选中的盘口数据
            marketList, // 当前玩法下的盘口数据
            matchOver,   //赛事结束
            cds,//数据源
            pendingOrderStatus
        } = market_info;

        if(bs.mid == matchInfoId) {
          let sportId = _.get(state,`${bet_obj}.${id}.bs.csid`);
          if(!_.isUndefined(matchOver) && !_.isNull(matchOver)) {
            state[bet_obj][id].cs.match_over = matchOver;
          }
          if(!_.isUndefined(matchStatus) && !_.isNull(matchStatus)) {
            state[bet_obj][id].bs.ms = matchStatus; // 赛事状态
          }
          if(!_.isUndefined(matchHandicapStatus) && !_.isNull(matchHandicapStatus)) {
            state[bet_obj][id].bs.mhs = matchHandicapStatus; // 赛事状态
            state[bet_obj][id].cs.match_status = matchHandicapStatus;
          }
          if(!_.isUndefined(matchPeriodId) && !_.isNull(matchPeriodId)) {
            // 根据不同的赛事阶段更新score_type的值
            let match = state[bet_obj][id].bs;
            score_type = self.set_basic_key(match);
            // 赛事阶段不同对score_type进行更新
            if(score_type && state[bet_obj][id].bs.mmp !=  matchPeriodId) {
              state[bet_obj][id].cs.score_type = score_type;
            }
            // 赛事阶段
            state[bet_obj][id].bs.mmp = matchPeriodId;
          }
          // 主队
          if(!_.isEmpty(home)) {
            state[bet_obj][id].bs.mhn = home;
            state[bet_obj][id].cs.home = home;
          }
          // 客队
          if(!_.isEmpty(away)) {
            state[bet_obj][id].bs.man = away;
            state[bet_obj][id].cs.away = away;
          }
          // 数据源
          if(!_.isEmpty(cds)) {
            state[bet_obj][id].bs.cds = cds;
            state[bet_obj][id].cs.cds = cds;
          }
          // 玩法名称
          if(_.get(state,`${bet_obj}.${id}.cs.${playId}`, false) &&
            !_.isUndefined(playName) &&
            !_.isNull(playName)) {
            state[bet_obj][id].bs.hps[0].hpn = playName;
            state[bet_obj][id].cs.play_name = playName;
          }


          // 联赛名称
          if(!_.isUndefined(tournamentName) && !_.isNull(tournamentName)) {
            state[bet_obj][id].bs.tn = tournamentName;
          }
          if(!_.isUndefined(currentMarket) && !_.isNull(currentMarket)) {
            let  {
              marketType,
              placeNum,
              status,
              marketValue,
              marketOddsList,
              score
            } = currentMarket;
            if((placeNum &&
               (matchInfoId == bs.mid) &&
               (placeNum == _.get(bs, 'hps[0].hl[0].hn', -1) &&
               playId == hpid) ||

               (currentMarket.id == hid && playId == hpid))) {
              // 赛事比分
              let item_score, home_score = _.get(bet_item, 'cs.home_score') || '0', away_score = _.get(bet_item, 'cs.away_score') || '0',  msc;
              if(score && score.includes('|') && score.includes(':')) {
                let scoreBenchmark = score.split('|');
                score_type = scoreBenchmark[0];
                // console.log(`==============cs.score_type:${state[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
                if(score_type == state[bet_obj][id].cs.score_type) {
                  let scroe_array = scoreBenchmark[1].split(':');
                  home_score = scroe_array[0] || '0';
                  away_score = scroe_array[1] || '0';
                  item_score = `${score_type}|${home_score}:${away_score}`;
                }
              }
              msc = state[bet_obj][id].bs.msc || [];
              if(!['match_details','details'].includes(state[bet_obj][id].cs.source)) {
                let score_obj = {};
                let len = msc.length;
                for (let i = 0; i < len; i++) {
                  if (msc[i] && msc[i].includes('|')) {
                    let mcs_item_arr = msc[i].split('|');
                    if(mcs_item_arr[0] == score_type) {
                      score_obj[mcs_item_arr[0]] = `${home_score}:${away_score}`;
                    } else {
                      score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
                    }
                  }
                }
                msc = [];
                for (let [key, value] of Object.entries(score_obj)) {
                  let item = `${key}|${value}`;
                  msc.push(item);
                }

                if (msc.length == 0 && item_score) {
                  msc = [item_score];
                }

                if(msc.length > 0) {
                  state[bet_obj][id].bs.msc = msc;
                }
              } else if(_.isArray(msc) && !_.isEmpty(score)) { // 详情意外的其他模块比分处理
                let index = _.findIndex(msc, item => item.includes(score_type));
                if(index == -1) {
                  msc.push(score);
                } else {
                  msc[index] = score;
                }
              }

              // console.log(`==============cs.score_type:${state[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
              if(!_.isEmpty(score) && score_type == state[bet_obj][id].cs.score_type) {
                // 合并主队得分
                state[bet_obj][id].cs.home_score = home_score;
                // 合并客队得分
                state[bet_obj][id].cs.away_score = away_score;
              }
              // 坑位存在与盘口id不相等，则需要更新盘口id
              if(placeNum && currentMarket.id != hid ) {
                // 盘口是否发生变化(坑位变化)
                handicap_change = {
                  mid: matchInfoId,
                  hpid: playId,
                  csid: sportId
                };
                state[bet_obj][id].bs.hps[0].hl[0].hid = currentMarket.id;
                state[bet_obj][id].cs.handicap_id = currentMarket.id
              }
              // 盘口类型
              if(!_.isUndefined(marketType) && !_.isNull(marketType)) {
                state[bet_obj][id].bs.hps[0].hl[0].hmt = marketType;
                state[bet_obj][id].cs.market_type = marketType;
              }
              if(!_.isEmpty(marketValue)  && state[bet_obj][id].bs.hps[0].hl[0].hv != marketValue) {
                handicap_change = {
                  mid: matchInfoId,
                  hpid: playId,
                  csid: sportId
                };
              }
              let  no_merage_market_value = play_mapping.NO_MERAGE_MARKETVALUE[sportId];
              // 盘口值
              if(
                _.isArray(no_merage_market_value) &&
                !no_merage_market_value.includes(`${playId}`) &&
                !_.isUndefined(marketValue) &&
                !_.isNull(marketValue)) {
                handicap_value = _.trim(marketValue) || '';
              }
              // 盘口状态合并
              if(!_.isUndefined(status) && !_.isNull(status)) {
                state[bet_obj][id].cs.handicap_status = status;
                state[bet_obj][id].bs.hps[0].hl[0].hs = status;
              }
            }
            if(_.isArray(marketOddsList)) {
              let hn;
              // 如果赛事存在玩法id,以及坑位
              if(playId && placeNum) {
                hn = `${matchInfoId}_${playId}_${placeNum}`;
              }
              // 移除盘口正负号
              if(handicap_value) {
                handicap_value = _.trim(handicap_value);
                if(handicap_value.startsWith('+') || handicap_value.startsWith('-')) {
                  handicap_value = handicap_value.substr(1, handicap_value.length);
                } else if (handicap_value.endsWith('+') || handicap_value.endsWith('-')) {
                  handicap_value = handicap_value.substr(0, handicap_value.length-1);
                }
              }
              //  投注项数据合并
              marketOddsList.forEach(odds_item => {
                // 投注项类型存在,则坑位加上投注项类型才是完整的坑位id
                if(hn && odds_item.oddsType) {
                  hn = `${hn}_${odds_item.oddsType}`;
                } else {
                  hn = null;
                }

                let state_obj = state[bet_obj][id];
                let kid = state_obj.cs.kid;
                let clone_obj ={};
                if(!(state_obj.bs.hps[0].hl[0].ol instanceof Array)) {
                  clone_obj  = _.cloneDeep(state_obj.bs.hps[0].hl[0].ol)
                }
                if(!state_obj.bs.hps[0].hl[0].ol[0])
                {
                  state_obj.bs.hps[0].hl[0].ol[0] = clone_obj;
                }
                if(hn && hn == kid) { // 如果坑位存在,则需要合并oid
                  // 投注项oid
                  state_obj.cs.oid = odds_item.id;
                  state_obj.bs.hps[0].hl[0].ol[0].oid = odds_item.id;

                  // 赔率
                  state_obj.cs.odds_value = odds_item.oddsValue;
                  state_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

                  // 投注状态
                  state_obj.cs.active = odds_item.oddsStatus;
                  state_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
                  if(handicap_value && old_hv != handicap_value) {
                    // console.log(`=============将&nbsp;的位置替换为盘口值===========>${new_on.replace('&nbsp;', handicap_value)}`);
                    // console.log('将&nbsp;的位置替换为盘口值:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                    state_obj.bs.hps[0].hl[0].hv = handicap_value;
                    state_obj.cs.handicap_value = handicap_value;
                    // 将&nbsp;的位置替换为盘口值
                    state_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace('&nbsp;', handicap_value);
                    // console.log(`================11111==========>>>>>on:${state_obj.bs.hps[0].hl[0].ol[0].on}`);
                  }
                  // ot(投注类型)字段合并
                  if(!_.isUndefined(odds_item.oddsType) && !_.isNull(odds_item.oddsType)) {
                    state_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
                  }
                  // 前后盘口值有变化则进行标记
                  if(handicap_value && old_hv != handicap_value && old_odds_value != odds_item.oddsValue) {
                    state_obj.cs.hv_ov_change = true;
                  }
                  //如果是预约投注添加预约投注数据
                  if(!_.isUndefined(pendingOrderStatus) &&  !_.isNull(pendingOrderStatus)) {
                    state[bet_obj][id].cs.pending_order_status = pendingOrderStatus;
                    // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
                  }
                } else if (state_obj.cs.oid == odds_item.id) { // 坑位不存在,通过oid进行匹配合并赔率以及状态
                  // 赔率
                  state_obj.cs.odds_value = odds_item.oddsValue;
                  state_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

                  // 投注状态
                  state_obj.cs.active = odds_item.oddsStatus;
                  state_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
                  if(odds_item.playOptions) {
                    state_obj.bs.hps[0].hl[0].ol[0].on = odds_item.playOptions;
                    handicap_value = odds_item.playOptions;
                    state_obj.bs.hps[0].hl[0].hv = handicap_value;
                    state_obj.cs.handicap_value = handicap_value;
                  } else if(handicap_value && old_hv != handicap_value) {
                    // 重新拼接新的on 之前为`大 盘口值` // 将&nbsp;的位置替换为盘口值
                    // console.log(`=======重新拼接新的on============>${new_on.replace('&nbsp;', handicap_value)}`);
                    // console.log('重新拼接新的on:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                    state_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace('&nbsp;', handicap_value);
                    // console.log(`================222222==========>>>>>on:${state_obj.bs.hps[0].hl[0].ol[0].on}`);
                  }
                  // ot(投注类型)字段合并
                  if(!_.isUndefined(odds_item.oddsType) && !_.isNull(odds_item.oddsType)) {
                    state_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
                  }
                  // 如果盘口和赔率都不相同则把标志为设置为true
                  if(handicap_value && old_hv != handicap_value && old_odds_value != odds_item.oddsValue) {
                    // console.log('重置盘口赔率一起变化的hv_ov_change参数',{handicap_value, old_hv,old_odds_value,odds_value:odds_item.oddsValue})
                    state_obj.cs.hv_ov_change = true;
                  }
                  //如果是预约投注添加预约投注数据
                  if(!_.isUndefined(pendingOrderStatus) &&  !_.isNull(pendingOrderStatus)) {
                    state[bet_obj][id].cs.pending_order_status = pendingOrderStatus;
                    // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
                  }
                }
              });
            }
          }
          // 如果有坑位变化则发送C303，否则就发送C105
          if(!_.isEmpty(handicap_change)) {
            self.yabo_common.update_handicap(handicap_change);
          } else {
            // 同步盘口下所有投注项的数据
            self.yabo_common.update_odds_info2({
              mid: matchInfoId,
              sportId,
              mhs: matchHandicapStatus,
              playId,
              marketList
            });
          }
        }
      });

    },
    /**
     * @description: 设置单关数据
     * @param {*} state
     * @param {*} bet_single_list 设置的单关列表
     */
    set_bet_single_list(state, bet_single_list) {
      state.bet_single_list = bet_single_list;
    },
    /**
     * @description: 移除单关列表
     * @param {*} state
     * @param {*} i 要移除的位置
     */
    bet_single_list_remove(state, i) {
      let temp = Object.assign([], state.bet_single_list);
      temp.splice(i, 1);
      state.bet_single_list = temp;
    },
    /**
     * @description: 添加单关投注
     * @param {*} state
     * @param {*} id 要添加的投注项id
     */
    bet_single_list_push(state, id) {
      if (!state.bet_single_list.includes(id)) {
        state.bet_single_list.push(id);
      }
    },
    /**
     * @description: 添加单关投注项对象
     * @param {*} state
     * @param {*} obj 要添加的对象
     */
    bet_single_obj_attr(state,obj) {
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
    },
    /**
     * @description: 移除单关投注项对象
     * @param {*} state
     * @param {*} key 要移除的投注项的键值
     */
    bet_single_obj_remove_attr(state, key) {
      delete state.bet_single_obj[`${key}`];
    },
    /**
     * @description: 清除单关数据
     * @param {*} state
     */
    bet_single_clear(state) {
      state.bet_single_obj = {};
      state.bet_single_list = [];
    },
    /**
     * 设置单关是否处理中
     * @param {*} state
     * @param {*} flag
     */
    set_is_single_handle(state, flag) {
      state.is_single_handle = flag;
    },
    /**
     * @description: 设置菜单对象
     * @param {*} state
     * @param {*} menu_obj 要设置的数据
     */
    set_menu_obj(state, menu_obj){
      state.menu_obj = menu_obj;
    },
    /**
     * @description: 菜单是否有变化
     * @param {*} state
     * @param {*} menu_change
     */
    set_menu_change(state, menu_change) {
      state.menu_change = menu_change;
    },
    /**
     * 设置投注模式
     * @param {*} state
     * @param {*} bet_mode
     */
    set_bet_mode(state, bet_mode) {
      state.bet_mode = bet_mode;
    },
    /**
     * @description: 当前是否为虚拟投注
     * @param {*} state
     * @param {*} is_virtual_bet
     */
    set_is_virtual_bet(state, is_virtual_bet) {
      state.is_virtual_bet = is_virtual_bet;
    },
    /**
     * @description: 设置虚拟体育是否在投注中
     * @param {*} state
     * @param {*} is_virtual_handle
     */
    set_is_virtual_handle(state, is_virtual_handle) {
      state.is_virtual_handle = is_virtual_handle;
    },
    /**
     * @description: 设置虚拟体育投注项列表数据
     * @param {*} state
     */
    set_virtual_bet_list(state, virtual_bet_list) {
      state.virtual_bet_list = virtual_bet_list;
    },
    /**
     * @description: 添加虚拟体育id到列表中
     * @param {*} state
     * @param {*} id 虚拟体育投注项id
     */
    virtual_bet_list_push(state, id) {
      if (!state.virtual_bet_list.includes(id)) {
        state.virtual_bet_list.push(id);
      }
    },
    /**
     * @description: 删除指定的虚拟投注项列表
     * @param {*} state
     * @param {*} i 要删除列表中数据的索引
     */
    virtual_bet_list_del(state, i) {
      let temp = Object.assign([], state.virtual_bet_list);
      temp.splice(i, 1);
      state.virtual_bet_list = temp;
    },
    /**
     * @description: 设置虚拟体育投注项对象
     * @param {*} state
     * @param {*} obj
     */
    set_virtual_bet_s_obj(state, obj) {
      state.virtual_bet_s_obj = obj;
    },
    /**
     * @description: 添加虚拟体育投注项对象
     * @param {*} state
     * @param {*} obj 新增的投注想对象
     */
    virtual_bet_obj_add(state, obj) {
      if(obj.key) {
        state.virtual_bet_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
        state.virtual_bet_obj = _.cloneDeep(state.virtual_bet_obj);
      }
    },
    /**
     * @description: 删除虚拟体育投注项对象
     * @param {*} state
     * @param {*} key 要删除的投注项对象键值
     */
    virtual_bet_obj_del(state, key) {
      delete state.virtual_bet_obj[key];
    },
    /**
     * @description: 串关输入列表设置
     * @param {*} state
     * @param {*} list 输入列表集合
     */
    set_virtual_bet_s_list(state, list) {
      state.virtual_bet_s_list = list;
    },
    /**
     * @description: 设置串关输入项的最低限额以及最高可投
     * @param {*} state
     * @param {*} obj
     */
    virtual_bet_s_obj_upd_cs(state, obj) {
      if(obj && obj.type) {
        if(state.virtual_bet_s_obj[obj.type]) {
          Object.assign(state.virtual_bet_s_obj[obj.type].cs,{
            min_money:obj.minBet,
            max_money:obj.orderMaxPay
          })
        }
      }
    },
    /**
     * @description: 添加虚拟体育投注输入对象
     * @param {*} state
     * @param {*} obj 新增的对象
     */
    virtual_bet_s_obj_add(state, obj) {
      if(obj.key) {
        state.virtual_bet_s_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
        state.virtual_bet_s_obj = _.cloneDeep(state.virtual_bet_s_obj);
      }
    },
    /**
     * @description: 删除虚拟投注输入对象
     * @param {*} state
     * @param {*} key 要删除的键
     */
    virtual_bet_s_obj_del(state, key) {
      delete state.virtual_bet_s_obj[key];
    },
    virtual_bet_s_clear(state) {
      state.virtual_bet_s_list = [];
      state.virtual_bet_s_obj = {};
    },
    /**
     * 清除虚拟投注数据
     * @param {*} state 
     */
    virtual_bet_clear(state) {
      state.virtual_bet_list = [];
      state.virtual_bet_s_list = [];
      state.virtual_bet_obj = {};
      state.virtual_bet_s_obj = {};
    },
    /**
     * 设置虚拟体育投注模式
     * @param {*} state
     * @param {*} bet_item_lock
     */
    set_virtual_bet_mode(state, virtual_bet_mode) {
      state.virtual_bet_mode = virtual_bet_mode;
    },
    /**
     * 设置投注模式
     * @param {*} state
     * @param {*} bet_item_lock
     */
    set_bet_item_lock(state, bet_item_lock) {
      state.bet_item_lock = bet_item_lock;
    },
    /**
     * 虚拟体育错误提示信息
     * @param {*} state
     * @param {*} virtual_error_info
     */
    set_virtual_error_info(state, virtual_error_info) {
      state.virtual_error_info = virtual_error_info;
    },
    /**
     * 左侧菜单切换
     * @param {*} state
     * @param {*} left_menu_toggle
     */
    set_left_menu_toggle(state, left_menu_toggle) {
      state.left_menu_toggle = left_menu_toggle;
    },
    /**
     * 设置当前电竞查询的模式 false单关模式
     * @param {*} state 
     * @param {*} cur_esports_mode 
     */
    set_cur_esports_mode(state, cur_esports_mode) {
      state.cur_esports_mode = cur_esports_mode;
    },
    /**
     * 设置是否合并
     * @param {*} state 
     * @param {*} is_bet_merge 
     */
    set_is_bet_merge(state, is_bet_merge) {
      state.is_bet_merge = is_bet_merge;
    },
    /**
     * 设置投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
     * @param {*} state 
     * @param {*} bet_category 
     */
    set_bet_category(state, bet_category) {
      state.bet_category = bet_category;
    },
    /**
     * 设置最小串关数
     * @param {*} state 
     * @param {*} mix_min_count 
     */
    set_mix_min_count(state, mix_min_count) {
      state.mix_min_count = mix_min_count
    },
    /**
     * 设置最大串关数
     * @param {*} state 
     * @param {*} mix_max_count 
     */
    set_mix_max_count(state, mix_max_count) {
      state.mix_max_count = mix_max_count
    },
    /**
     * 设置被预约的投注项
     * @param {*} param0 
     * @param {*} bet_appoint_obj 
     */
    set_bet_appoint_obj(state, bet_appoint_obj) {
      state.bet_appoint_obj = bet_appoint_obj;
    },
    set_bet_current_money_obj(state, money_obj) {
      if (money_obj.value) {
        state.bet_current_money_obj[money_obj.id] = money_obj.value;
      }else{
        state.bet_current_money_obj = {}
      }
    }
  }
}
