/*
 * @Description: 虚拟体育数据
*/

import { ref } from "vue";

export default class virtualSportsStore {
  constructor(sport_data, callback) {
    //当前选中的联赛
    current_league: {
    }
    //当前选中的批次
    current_batch: {
    }
    //视频进程接口已获取标志
    video_process_loaded: {
    }
    //当前赛事id
    current_match_mid: "";
    //视频进程数据
    video_process_data: null;
    //正在跳转详情的赛事
    current_gotodetail_match: {
    }
    //上次请求的虚拟赛事列表参数
    prev_v_sports_params: {
    }
    //上次请求的虚拟体育赛事列表
    prev_v_sports: {
    }
    // 是否是用户（顶部按钮）刷新
    is_user_refreshing: false;
  }

  init() {

  }
  get_prev_v_sports(state) {
    return this.prev_v_sports;
  }
  get_prev_v_sports_params(state) {
    return this.prev_v_sports_params;
  }
  get_current_league(state) {
    return this.current_league;
  }
  get_current_batch(state) {
    return this.current_batch;
  }
  get_video_process_loaded(state) {
    return this.video_process_loaded;
  }
  get_current_mid(state) {
    return this.current_match_mid;
  }
  get_video_process_data(state) {
    return this.video_process_data;
  }
  get_current_gotodetail_match(state) {
    return this.current_gotodetail_match;
  }
  get_is_user_refreshing(state) {
    return this.is_user_refreshing;
  }

  set_prev_v_sports(state, value) {
    this.prev_v_sports = value;
  }
  set_prev_v_sports_params(state, value) {
    this.prev_v_sports_params = value;
  }
  // set_c_selected_match_i(state,value){
  //   this.c_selected_match_i = value;
  // };
  set_current_league(state, league) {
    this.current_league = league;
  }
  set_current_batch(state, batch) {
    this.current_batch = batch;
  }
  set_video_process_loaded(state, value) {
    this.video_process_loaded = value;
  }
  set_current_mid(state, value) {
    this.current_match_mid = value;
  }
  set_video_process_data(state, value) {
    this.video_process_data = value;
  }
  set_current_gotodetail_match(state, value) {
    this.current_gotodetail_match = value;
  }
  set_current_match_assign(state, callback) {
    if (callback) {
      callback(this.current_gotodetail_match);
    }
  }
  set_is_user_refreshing(state, value) {
    this.is_user_refreshing = value;
  }
}
