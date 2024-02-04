/*
 *封装赛事详情api接口数据，给赛事详情仓库设置数据   暂未使用 后续维护
 */
import { ref, computed, onUnmounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";
import  { computed_background } from  "src/output/module/constant-utils.js"
//  // api详情
import { api_details } from "src/api";
import axios_debounce_cache from "src/core/http/debounce-module/";
import { update_match_time } from "src/core/bet/common-helper/module/common-sport.js";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDetailsData,
} from "src/output/module/match-data-base.js";
import { is_eports_csid } from 'src/output/module/constant-utils.js'
import { GlobalSwitchClass } from 'src/core/global/global.js'
import PageSourceData from "src/core/page-source/page-source.js";
import detailUtils from "src/core/match-detail/match-detail-pc/match-detail.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListScrollClass from "src/core/match-list-pc/match-scroll.js";
import { MenuData} from "src/output/project/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import filterHeader from 'src/core/filter-header/filter-header.js'
import * as api_websocket from "src/api/module/socket/socket_api.js";
const route = useRoute()
const background_img = ref(null); //详情背景图片
const countMatchDetailErr = ref(0); //错误接口次数统计
const handicap_state = ref("loading"); //玩法加载状态状态
const load_data_state = ref("loading"); //整块加载状态
const is_go_match_list = ref(true); // 判断是不是从详情页返回列表
//暂时不知道数据是从哪里定义的  todo
const details_params = ref({
  //赛事参数
  media_type: "info",
  mid: "2776470",
  sportId: "1",
  tid: "1188757",
  time: 1695546310766,
});
const cur_menu_type = { pre_name: "", type_name: "today" }; //todo
const last_by_mids_uuid = ref(null); //暂时不知道数据是从哪里定义的  todo
const { page_source } = PageSourceData;


// 自动化测试页面加载时间时使用
const set_home_loading_time_record = (status) => {
  if (
    window.init_loading_time_obj &&
    lodash.get(window, "env.config.DOM_ID_SHOW")
  ) {
    if (!window.init_loading_time_obj.right_details_end_time) {
      window.init_loading_time_obj.right_details_end_time =
        new Date().getTime();
    }
    let time_obj = window.init_loading_time_obj;
    if (!time_obj.start) {
      time_obj.start = new Date(time_obj.start_time).Format(
        "yyyy-MM-dd hh:mm:ss"
      );
    }
    if (time_obj.list_end_time && time_obj.right_details_end_time) {
      let end_time =
        time_obj.list_end_time > time_obj.right_details_end_time
          ? time_obj.list_end_time
          : time_obj.right_details_end_time;
      (time_obj.end = new Date(end_time).Format("yyyy-MM-dd hh:mm:ss")),
        (time_obj.end_time = end_time);
      time_obj.status = status;
      time_obj.duration = time_obj.end_time - time_obj.start_time;
      sessionStorage.setItem(
        "home_loading_time_record",
        JSON.stringify(time_obj)
      );
      window.init_loading_time_obj = null;
    }
  }
};

let get_match_details_timer2 = null;
let axios_debounce_timer = null;
let axios_debounce_timer2 = null;
/**
 * @description: 赛事详情比分板数据
 * @param {number} loop_count 循环调用次数
 * @param {string} mid 赛事id
 * @param {boolean} is_esports 是否为电子赛事
 */
const get_matchInfo_fun = (loop_count, mid) => {
  ;
  let params = {
    mid: mid || 0, //赛事id
  };
  if (params.mid == -1) {
    // handicap_state.value = "all_empty";
    return;
  }
  let api;
  // 如果是电竞就用电竞的请求配置

  if (is_esports.value) {
    api = api_details.get_match_detail_ESMatchInfo;
    // 非电竞就用通用的请求配置
  } else {
    api = api_details.get_match_detail_MatchInfo;
  }
  let send_request = () => {
    api(params)
      .then((res) => {
        const code = lodash.get(res, "code");
        const data = lodash.cloneDeep(lodash.get(res, "data"));
        const timestap = lodash.get(res, "ts");
        if (code == "0400500") {
          // 跳转赛事
          // emit_autoset_match(0);
          return;
        }

        if (code == 200 && data && Object.keys(data).length) {
          // 请求成功就清零错误次数
          countMatchDetailErr.value = 0;
          // 设置当前赛种的背景图
          background_img.value = computed_background(data.csid);
          // mmp状态修正
          if (
            [
              "4",
              "5",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "16",
              "15",
              "14",
            ].includes(data.csid)
          ) {
            if (data.ms != 0 && data.mmp == "0") {
              Object.assign(data, {
                mmp: "8",
                mct: 1,
              });
            }
          }
          MatchDetailsData.set_list_from_match_details(data);
          let str = mid + "_";
          let midval = lodash.get(data, "mid");
          let mst = lodash.get(data, "mst");
          let mstst = lodash.get(data, "mstst");
          let mststs = lodash.get(data, "mststs");
          //获取赔率
          get_match_detail_base({ isWs: false, midval, is_bymids: false });
          //同步赛事时间
          update_match_time({ mid, mst, mstst, mststs });
          let { media_type, play_id } = details_params.value;
          MatchDetailCalss.set_play_media({
              mid: data.mid,
              media_type,
              play_id,
              time: new Date() * 1,
            
          });
          load_data_state.value = "data";
  
          // 保存数据,用于接口报错时填充
        MatchDetailCalss.set_active_detail((MatchDetailsData.list_to_obj.mid_obj, str))
        } else {
          // countMatchDetail();
        }
        sessionStorage.setItem("currentIndex", 0);
      })
      .catch((err) => {
        console.error(err);
        //todo
        
           //设置错误数据
        GlobalSwitchClass.set_error_data({
          site: "details--get_match_detail",
          error: err,
        })
        // countMatchDetail();
      })
      .finally(() => {
        // 循环调用 赛事详情页比分板接口，固定间隔3s
        if (loop_count) {
          // clearTimeout(get_match_details_timer2);
          // get_match_details_timer2 = setTimeout(() => {
          //   loop_count--;
          //   get_matchInfo_fun(loop_count);
          // }, 3000);
        } else {
        }
      });
  };
  const match_details_debounce_cache = axios_debounce_cache.get_match_details;
  if (match_details_debounce_cache && match_details_debounce_cache["ENABLED"]) {
    let info = match_details_debounce_cache.can_send_request(params);
    if (info.can_send) {
      //直接发请求    单次数 请求的方法
      send_request();
    } else {
      // 记录timer

      clearTimeout(axios_debounce_timer);
      axios_debounce_timer = setTimeout(() => {
        //直接发请求    单次数 请求的方法
        send_request();
      }, info.delay_time || 1000);
    }
  } else {
    //直接发请求    多 次数  循环请求 的方法
    send_request();
  }
};
/**
 * @description: 玩法投注项列表
 * @param {boolean} is_bymids 是否bymids触发
 * @param {boolean} isWs 是否是 ws 触发
 */
const get_match_detail_base = (
  obj = { isWs: false, mid: "", is_bymids: false }
) => {
  
  // 如果当前是电竞页，就不请求右侧玩法列表
  if (is_esports.value && route.name != "video") {
    return false;
  }
  // 如果当前在详情页或者接收数据的 mid 和当前 mid 不一样也不展示玩法列表
  // if (route.name == "details" || (obj.mid && obj.mid != obj.mid)) {
  //   return false;
  // }
  // 非ws拉取的情况下，展示 loading
  if (!obj.isWs && handicap_state.value != "loading") {
    handicap_state.value = "loading";
  }
  // let euid = MenuData.match_list_api_params.euid;todo
  let euid = 11;

  // 获得当前的模板ID
  let orpt = 0; //todo
  let { play_id } = details_params.value;
  let baseParam = {
    cuid: UserCtr.get_uid(),
    euid,
    orpt,
    sort: 1,
  };
  let params = {
    baseParam,
    mcid: "0", //玩法集id
    mid: obj.mid, //赛事id
    cuid: UserCtr.get_uid(), //用户id
  };
  let type_name = cur_menu_type.type_name;
  //today：今日  early：早盘
  if (["today", "early"].includes(type_name)) {
    params.baseParam.cos = MenuData.is_corner_menu() || orpt == 25 ? 1 : 0;
  } else {
    params.baseParam.cos = 0;
  }
  // 非滚球传 玩法ID
  if (type_name != "play") {
    // params.baseParam.pids = MenuData.match_list_api_params.pids;
    params.baseParam.pids = "";
  }
  // 竟足
  if (euid == 30101) {
    play_id = 1001;
    params.baseParam.orpt = 12;
    params.baseParam.pids = -999;
  }
  // 如果有角球 罚牌玩法
  else if (play_id) {
    baseParam.tabs = [{ mid: obj.mid, playId: play_id }];
  }

  let fun_temp = async () => {
    // 记录当前请求gcuuid
    last_by_mids_uuid.value = params.gcuuid = UserCtr.uid;

    // // 如果当前是电竞
    if (is_esports.value) {
      params.newUser = 0;
      // 电竞接口无用的参数删除
      delete params.baseParam;
      // 电竞接口参数补全，round 是电竞赛事才有的动态玩法id
      params.round = null;
      await api_details
        .get_match_odds_info_ES(params)
        .then((res) => {
          set_home_loading_time_record("ok");
          // 检查gcuuid
          if (last_by_mids_uuid.value != res.config.gcuuid) return;
          const code = lodash.get(res, "data.code");
          let timestap = lodash.get(res, "data.ts");
          // 获取详情下所有玩法集数据
          let data = lodash.get(res, "data.data", []);
          //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
          if (
            code === 200 &&
            data.length &&
            lodash.get(MatchDetailsData.list_to_obj.mid_obj, str).mhs != 2
          ) {
            data.forEach((item) => {
              item = format_plays(item);
              item.tipstatus = false;
            });

            let obj = [];
            // 置顶数据排序
            let arr = []; //暂存本地置顶的数据
            for (var i = 0; i < data.length; i++) {
              if (data[i].hton != "0") {
                // this.set_top_id({ id: data[i].topKey, type: true });
              } else {
                if (this.get_top_id.includes(data[i].topKey)) {
                  data[i].hton = new Date().getTime() + "";
                  arr.unshift(data.splice(i, 1)[0]);
                  i--;
                }
              }
            }
            if (arr.length) {
              //插入置顶的数据
              for (var i in arr) {
                data.unshift(arr[i]);
              }
            }
            data.forEach((item, index) => {
              obj.push(item);
              item.initIndex = index;
              item.index = index;
            });

            // 初始化控制类中的玩法数据
            // MatchDetailsData.init_plays_data(data);

            MatchDetailsData.set_quick_query_list_from_match_details(data);
            // 玩法列表loading状态值
            handicap_state.value = "data";
            // 同步投注项 todo
            // if (!this.vx_get_lang_change) {
            //   this.yabo_common.upd_bet_obj(this, timestap, obj.mid);
            // }
            // this.vx_set_lang_change(false);
          } else {
            handicap_state.value = params.mcid == 0 ? "all_empty" : "new_empty";
          }
        })
        .catch((err) => {
          set_home_loading_time_record("err");
          console.error(err);
          if (!obj.isWs) {
            err_tips(err);
          }
        });
      // 常规赛事
    } else {
      await api_details
        .get_match_detail2(params)
        .then((res) => {
          set_home_loading_time_record("ok");
          // 检查gcuuid
          if (last_by_mids_uuid.value != res.gcuuid) return;
          const code = lodash.get(res, "code");
          // 获取赛事数据
          let match_info = lodash.get(res, "data.baseData[0]", {});
          // 获取详情下所有玩法集数据
          let data = lodash.get(res, "data.plays", []);
          let timestap = lodash.get(res, "ts");
          if (code == "0400500") {
            // 跳转赛事
            // emit_autoset_match(0);
            return;
          }
          if (!lodash.isEmpty(match_info) && !obj.is_bymids) {
            // 同步列表的赛事数据
            useMittEmit(MITT_TYPES.EMIT_SYNCH_FROM_DETAIL, res);
            if (is_go_match_list.value) {
              let match_obj = {};
              for (let [key, value] of Object.entries(match_info)) {
                if (
                  !lodash.isUndefined(
                    lodash.get(MatchDetailsData.list_to_obj.mid_obj, str)
                  )
                ) {
                  match_obj[key] = value;
                } else {
                  delete match_obj[key];
                }
              }
              // 同步数据到详情
              let msc = detailbuild_msc(match_obj);
              match_obj.msc = msc;
              Object.assign(MatchDetailsData.match_obj, match_obj);
            }
            // 是否是从详情页返回列表页
            is_go_match_list.value = true;
          }
          //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
          if (
            code == 200 &&
            data.length &&
            lodash.get(MatchDetailsData.list_to_obj.mid_obj, str).mhs != 2
          ) {
            data.forEach((item) => {
              item = format_plays(item);
              item.tipstatus = false;
            });

            let obj = [];
            // 保存详情玩法个数
            // 置顶数据排序
            let arr = []; //暂存本地置顶的数据
            for (var i = 0; i < data.length; i++) {
              if (data[i].hton != "0") {
                // this.set_top_id({ id: data[i].topKey, type: true });
              } else {
                // if (this.get_top_id.includes(data[i].topKey)) {
                data[i].hton = new Date().getTime() + "";
                arr.unshift(data.splice(i, 1)[0]);
                i--;
                // }
              }
            }
            if (arr.length) {
              //插入置顶的数据
              for (var i in arr) {
                data.unshift(arr[i]);
              }
            }
            data.forEach((item, index) => {
              //投注项ol排序
              obj.push(format_sort_data(item));
              item.initIndex = index;
              item.index = index;
            });

            // 初始化控制类中的玩法数据
            MatchDetailsData.set_quick_query_list_from_match_details(data);
            // 玩法列表loading状态值
            handicap_state.value = "data";
            // 同步投注项
            // if (!this.vx_get_lang_change) {
            //   this.yabo_common.upd_bet_obj(this, timestap, obj.mid);
            // }
            // this.vx_set_lang_change(false);
          } else {
            if (code == "0401038") {
              handicap_state.value = "api_limited";
              return;
            }
            handicap_state.value = params.mcid == 0 ? "all_empty" : "new_empty";
          }
        })
        .catch((err) => {
          set_home_loading_time_record("err");
          if (!obj.isWs) {
            err_tips(err);
          }
        });
    }MITT_TYPES.EMIT_GET_HISTORY
    ["new_empty", "all_empty"].includes(handicap_state.value) &&
    useMittEmit(MITT_TYPES.EMIT_GET_HISTORY);
  };
  let api_axios_flg = "match_odds_Info2";
  if (
    axios_debounce_cache &&
    axios_debounce_cache[api_axios_flg] &&
    axios_debounce_cache[api_axios_flg]["ENABLED"]
  ) {
    let instance = axios_debounce_cache[api_axios_flg];
    let info = instance.can_send_request(params);
    if (info.can_send) {
      //直接发请求    单次数 请求的方法
      fun_temp();
    } else {
      // 记录timer

      clearTimeout(axios_debounce_timer2);
      axios_debounce_timer2 = setTimeout(() => {
        //直接发请求    单次数 请求的方法
        fun_temp();
      }, info.delay_time || 1000);
    }
  } else {
    //直接发请求    多 次数  循环请求 的方法
    fun_temp();
  }
};

 /**
   * @description: 弹出报错提示
   * @param {}
   * @return {}
   */
 const err_tips = (err) => {
  console.log(err,'err');
 //设置错误数据
  GlobalSwitchClass.set_error_data({
   site: "details--get_match_detail",
   error: err,
 })
  if (
    lodash.isPlainObject(err) ||
    lodash.get(err, "response.status") == 404
  ) {
   handicap_state.value = "404";
  } else {
   handicap_state.value = "refresh";
  }
};
//    // 是否为电竞
const is_esports = computed(() => {
  let is_esports_val;
  // 详情页判断球种ID  其他页面取菜单
  if (route.name == "details" || route.name == "video") {
    is_esports_val = is_eports_csid(route.params.csid);
  } else if (route.name == "search") {
    is_esports_val = false;
  } else {
    is_esports_val = false;
  }
  return is_esports_val;
});

/**
 * @description: 详情比分面板接口报错处理
 * @param {*}
 * @return {*}
 */
let get_match_details_timer = null;
const countMatchDetail = () => {
  
  // 计算错误次数
  countMatchDetailErr.value += 1;
  // 如果接口一直报错，最多拉取5次
  if (countMatchDetailErr.value < 5) {
    // 延迟3秒 再次调详情接口
    get_match_details_timer = setTimeout(() => {
      get_matchInfo_fun();
    }, 3000);
  } else {
    handicap_state.value = "all_empty";
  }
};
// onUnmounted(() => {
//   clearTimeout(get_match_details_timer2);
//   clearTimeout(axios_debounce_timer);
//   clearTimeout(axios_debounce_timer2);
//   clearTimeout(get_match_details_timer);
// });
const use_featch_fn = () => {
  
  return {
    get_matchInfo_fun,
  };
};

export default use_featch_fn;
