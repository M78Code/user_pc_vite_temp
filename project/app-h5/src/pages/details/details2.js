/*
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛事详情信息
 */
export default {
  state: {
    // 列表跳详情是播放视频或者动画
    is_in_play: '',
    // 是否关闭罚款说明
    is_close_info: 0,
    // 是否视频直播跳转到详情
    play_video:false,
    // 是否显示详情页的统计页面
    is_show_details_analyse: false,
    // 是否从首页轮播区域跳转到详情
    is_banner_jump: false,
    // 一键收起状态: 1.全展开 2.全收起 3.部分展开 1和3箭头向上
    fewer: 1,
    // 点击视频或者是动画的时候玩法集是否固定
    tab_fix:false,
    // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    details_item: 0,
    //猜你喜欢列表
    like_item:[],
    details_chatroom_data: {},//聊天室对应开关地址集合
    // 详情玩法集第一个
    first_details_item: '0',
    // 详情页的滚动条
    // details_scroll: true,
    // 详情页的数据
    detail_data: "",
    // 赛事id
    goto_detail_matchid: null,
    // 赛事对象
    goto_detail_match_info: {},
    // 控制内容是否高亮用作新手引导使用(home页使用)
    show_content: true,
    // 获取高亮元素高(match-list页使用)
    element_height: "",
    // 初始化状态值
    is_show_settle_tab: false,
    // 详情下拉三角是否显示
    sanjiao_is_bool: true,
    // 视频置顶
    video_zhiding: true,
    // 玩法集置顶效果
    zhiding_info: false,
    // 玩法集的title栏
    details_tabs_list: null,
    // 模板6 最后进球的队员
    ol_list1_flag: 0,
    // 赛事比分变化
    detail_msc_changed: "",
    // 置顶按钮是否高亮
    zhiding: true,
    // 是否显示info说明
    info_show: false,
    // 视频里边是否高清 标清 切换页面
    hd_sd_show: false,
    // 标清0 高清1
    hd_sd: 1,
    // 是否显示全屏下投注弹窗
    bet_show: false,
    // 赛果详情注单记录数据
    note_sheet_records_data: null,
    // 是否全屏
    is_full_screen: false,
    // 改变了收藏状态
    details_changing_favorite:0,
    // 当前选中的玩法集的下标
    subscript_game_index: 0,
    // 当前赛事信息
    match_base_info_obj: {},
    //显示分析弹框
    analyze_show:false,
    // 详情返回后，未滚动至目标计数
    not_found_target_dom_count: 0,
    // 玩法集对应玩法缓存数据
    details_data_cache: {},
    // 记录展开收起玩法，以便切换玩法集不会丢失用户展开或收起行为
    hshow_map:{},
    chpid_obj:{},
    // 比赛时间计时
    match_real_time: '',
    event_list: [],
    curr_tab_info: {},
  },
  getters: {
    // /**
    //  *@description 根据不同赛事阶段取不同的比分
    // *@param {Number} num 0-主队  1-客队
    // *@return {Number} 主队或客队得分
    // */
    // get_total_score: (state) => (num) => {
    //   let match = state.detail_data
    //   try {
    //     if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
    //     let score_, mscmap = new Map(match.msc.map(item => [item.split('|')[0], item.split('|')[1].split(':')]));
    //     if (match.csid == "1" || match.csid == "11") {    //足球和手球
    //       switch (String(match.mmp)) {
    //         //  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
    //         case '41': case '33': case '42': case '110':
    //           score_ = mscmap.get('S7')
    //           break;
    //         // 50 点球大战  120 点球大战结束
    //         case '50': case '120':
    //           score_ = mscmap.get('S170')
    //           break;
    //         // 即将加时和等待点球的阶段固定取0
    //         case '32': case '34':
    //           score_ = 0
    //           break;
    //         //全场结束,取点球大战比分，加时赛比分或者全场比分
    //         case '999':
    //           score_ = mscmap.get('S170') || mscmap.get('S7') || mscmap.get('S1')
    //           break;
    //         default:
    //           score_ = mscmap.get('S1')
    //           break;
    //       }
    //     } else {
    //       score_ = mscmap.get('S1')
    //     }
    //     return score_ && score_[num] || 0
    //   } catch (error) {
    //     console.error(error)
    //     return 0
    //   }
    // },
    get_not_found_target_dom_count(state) {
      return state.not_found_target_dom_count;
    },
    get_details_changing_favorite(state){
      return state.details_changing_favorite;
    },
    get_subscript_game_index(state){
      return state.subscript_game_index;
    },
    get_is_close_info(state) {
      return state.is_close_info;
    },
    get_is_in_play(state) {
      return state.is_in_play;
    },
    get_play_video(state) {
      return state.play_video;
    },
    get_note_sheet_records_data(state) {
      return state.note_sheet_records_data;
    },
    get_is_show_details_analyse(state){
      return state.is_show_details_analyse;
    },
    get_is_banner_jump(state){
      return state.is_banner_jump;
    },
    get_info_show(state){
      return state.info_show;
    },
    get_hd_sd_show(state){
      return state.hd_sd_show;
    },
    get_hd_sd(state){
      return state.hd_sd;
    },
    get_bet_show(state){
      return state.bet_show;
    },
    get_analyze_show(state, value) {
      return state.analyze_show;
    },
    get_fewer(state){
      return state.fewer;
    },
    get_tab_fix(state){
      return state.tab_fix;
    },
    get_detail_msc_changed(state) {
      return state.detail_msc_changed;
    },
    get_flag_get_ol_list(state) {
      return state.ol_list1_flag;
    },
    get_details_item(state) {
      return state.details_item;
    },
    get_like_item(state) {
      return state.like_item;
    },
    get_details_chatroom_data(state) {
      return state.details_chatroom_data;
    },
    get_first_details_item(state) {
      return state.first_details_item;
    },
    get_detail_data(state) {
      return state.detail_data;
    },
    get_goto_detail_matchid(state) {
      return state.goto_detail_matchid;
    },
    get_goto_detail_match_info(state) {
      return state.goto_detail_match_info;
    },
    get_show_content(state) {
      return state.show_content;
    },
    get_element_height(state) {
      return state.element_height;
    },
    get_is_show_settle_tab(state) {
      return state.is_show_settle_tab;
    },
    get_sanjiao_is_bool(state) {
      return state.sanjiao_is_bool;
    },
    get_video_zhiding(state) {
      return state.video_zhiding;
    },
    get_zhiding_info(state) {
      return state.zhiding_info;
    },
    get_zhiding(state) {
      return state.zhiding;
    },
    get_details_tabs_list(state) {
      return state.details_tabs_list;
    },
    get_is_full_screen(state) {
      return state.is_full_screen;
    },
    get_match_base_info_obj(state) {
      return state.match_base_info_obj;
    },
    // 玩法集对应玩法缓存数据
    get_details_data_cache(state) {
      return state.details_data_cache
    },
    get_hshow_map(state){
      return state.hshow_map
    },
    get_chpid_obj(state){
      return state.chpid_obj
    },
    get_match_real_time(state){
      return state.match_real_time
    },
    get_event_list(state){
      return state.event_list
    },
    get_curr_tab_info(state){
      return state.curr_tab_info
    },


  },
  actions: {
    set_note_sheet_records_data({ commit }, payload) {
      commit("set_note_sheet_records_data", payload);
    },
    set_goto_detail_matchid({ commit }, payload) {
      commit("set_details_item", payload);
    },
    set_details_item({ commit }, payload) {
      commit("set_details_item", payload);
    },
    set_like_item({ commit }, payload) {
      commit("set_like_item", payload);
    },
    set_detail_data({ commit }, payload) {
      commit("set_detail_data", payload);
    },
    upd_detail_data({ commit }, payload) {
      commit("upd_detail_data", payload);
    },
    set_show_content({ commit }, payload) {
      commit("set_show_content", payload);
    },
    set_element_height({ commit }, payload) {
      commit("set_element_height", payload);
    },
    set_is_show_settle_tab({ commit }, payload) {
      commit("set_is_show_settle_tab", payload);
    },
    set_sanjiao_is_bool({ commit }, payload) {
      commit("set_sanjiao_is_bool", payload);
    },
    set_video_zhiding({ commit }, payload) {
      commit("set_video_zhiding", payload);
    },
    set_zhiding_info({ commit }, payload) {
      commit("set_zhiding_info", payload);
    },
    set_zhiding({ commit }, payload) {
      commit("set_zhiding", payload);
    },
    set_is_full_screen({ commit }, payload) {
      commit("set_is_full_screen", payload);
    },
    set_subscript_game_index({ commit }, payload) {
      commit("set_subscript_game_index", payload);
    }
  },
  mutations: {
    set_not_found_target_dom_count(state, v) {
      state.not_found_target_dom_count = v;
    },
    set_details_changing_favorite(state,v){
      state.details_changing_favorite = v;
    },
    set_is_close_info(state) {
      state.is_close_info ++;
    },
    set_is_in_play(state, value) {
      state.is_in_play = value;
    },
    set_play_video(state, value) {
      state.play_video = value;
    },
    set_note_sheet_records_data(state, value) {
      state.note_sheet_records_data = value;
    },
    set_is_show_details_analyse(state, value){
      state.is_show_details_analyse = value;
    },
    set_is_banner_jump(state,value){
      state.is_banner_jump = value;
    },
    set_info_show(state,value){
      state.info_show = value;
    },
    set_hd_sd_show(state,value){
      state.hd_sd_show = value;
    },
    set_hd_sd(state,value){
      state.hd_sd = value;
    },
    set_bet_show(state, value) {
      state.bet_show = value;
    },
    set_analyze_show(state, value) {
      state.analyze_show = value;
    },
    set_fewer(state,value){
      state.fewer = value;
    },
    set_tab_fix(state,value){
      state.tab_fix = value;
    },
    set_flag_get_ol_list(state, value) {
      state.ol_list1_flag = value;
    },
    set_details_tabs_list(state, value) {
      state.details_tabs_list = value;
    },
    set_goto_detail_matchid(state, value) {
      state.goto_detail_matchid = value;
    },
    set_goto_detail_match_info(state, value) {
      let match_info

      if (Object.keys(value).length) {
        match_info = Object.assign({}, state.goto_detail_match_info, value)
      } else {
        match_info = value
      }

      state.goto_detail_match_info = match_info;
    },
    set_details_item(state, payload) {
      state.details_item = payload;
    },
    set_like_item(state, payload) {
      state.like_item = payload;
    },
    set_details_chatroom_data(state, payload) {
      state.details_chatroom_data = payload;
    },
    set_first_details_item(state, payload) {
      state.first_details_item = payload;
    },
    // set_details_scroll(state, payload) {
    //   state.details_scroll = payload;
    // },
    set_detail_msc_changed(state, v) {
      state.detail_msc_changed = v;
    },
    set_detail_data(state, payload) {
      state.detail_data = payload;
    },
    set_detail_data_assign(state,callback){
      if(callback){
        callback(state.detail_data);
      }
    },
    upd_detail_data(state, payload) {
      if (payload.msc) {
        if (payload.msc.length == 1 && payload.msc[0].split("|")[0] == "S1") {
          // 后台数据垃圾
          state.detail_data.msc = _.sortBy(state.detail_data.msc, item => {
            return +item.split("|")[0].substring(1);
          });
          state.detail_data.msc[0] = payload.msc[0];
        } else {
          let obj = {},
              obj_payload = {},
              trans_msc = [];
          _.forEach(state.detail_data.msc, item => {
            let _key = item.split("|")[0],
                _val = item.split("|")[1];
            obj[_key] = _val;
          });
          _.forEach(payload.msc, item => {
            let _key = item.split("|")[0],
                _val = item.split("|")[1];
            obj_payload[_key] = _val;
          });
          Object.assign(obj, obj_payload);

          for (let key in obj) {
            let str = [key, obj[key]].join("|");
            trans_msc.push(str);
          }
          state.detail_data.msc = trans_msc;
        }
      } else {
        state.detail_data = Object.assign(state.detail_data, payload);
      }
    },
    set_show_content(state, payload) {
      state.show_content = payload;
    },
    set_element_height(state, payload) {
      state.element_height = payload;
    },
    set_is_show_settle_tab(state, payload) {
      state.is_show_settle_tab = payload;
    },
    set_sanjiao_is_bool(state, payload) {
      state.sanjiao_is_bool = payload;
    },
    set_video_zhiding(state, payload) {
      state.video_zhiding = payload;
    },
    set_zhiding_info(state, payload) {
      state.zhiding_info = payload;
    },
    set_zhiding(state, payload) {
      state.zhiding = payload;
    },
    set_is_full_screen(state, payload) {
      state.is_full_screen = payload;
    },
    set_subscript_game_index(state,payload){
      state.subscript_game_index = payload;
    },
    set_match_base_info_obj(state,payload){
      const match_base_info_obj = _.cloneDeep(payload)
      state.match_base_info_obj = match_base_info_obj;
    },
    // 设置玩法集对应玩法缓存数据
    set_details_data_cache(state, data) {
      if (!data || !Object.keys(data).length) {
        state.details_data_cache = {}
        return
      }

      const details_data_cache = Object.assign({}, state.details_data_cache, data)
      state.details_data_cache = details_data_cache
    },
    set_hshow_map(state,payload){
      state.hshow_map[payload.key] = payload.value
    },
    set_chpid_obj(state,payload){
      state.chpid_obj = payload
    },
    set_match_real_time(state,payload){
      state.match_real_time = payload
    },
    set_event_list(state,payload){
      state.event_list = payload
    },
    set_curr_tab_info(state,payload){
      state.curr_tab_info = payload
    },
  }

};
