/*
 * @Author: COOPer
 * @Date: 2023-08-20 17:14:23
 * @Description: 赛列表列
 */
import {
  reactive,
  toRefs,
  ref,
  nextTick,
  onUnmounted,
  computed,
  watch,
  onBeforeMount,
} from "vue";
// import store from "src/store-redux/index.js";
import lodash from "lodash";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { i18n_t, is_eports_csid,compute_value_by_cur_odd_type, get_odds_active } from "src/output/index.js";
import math  from "src/core/bet/common/mathjs.js"

import ZHUGE from "src/core/http/zhuge-tag";
// import { useGetStore } from "src/core/match-detail-pc/use_get_store.js";
import { useRoute, useRouter } from "vue-router";
// import {get_odds_active}from 'src/core/bet/module/status.js'

import BetData from "src/core/bet/class/bet-data-class.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
export const useGetItem = ({ props }) => {
  const route = useRoute();
  const state = reactive({
    // 赔率值
    match_odds: "",
    // 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
    odds_state: "",
    // 赔率升降 up:上升 down:下降
    odds_lift: "",
    // 是否红升绿降中
    odds_lift_show: false,
    // 马来和印尼盘负数显示红色
    is_odds_value_red: false,
    version_name: "",
    // 赛事信息
    match: {},
    // 玩法比分
    score: "",
    timer_obj: {}, //定时器
    // 用于显示的盘口信息对象
    ol_data_item: {
      ov: "",
      onb: "",
      onbl: "",
      _hs: 0,
      _mhs: 0,
      os: 1,
    },
    DOM_ID_SHOW:''
  });

  // const format_odds_value=(val)=> {
  //   if(val=='' || val == undefined){
  //     return '';
  //   }
  //   val = (val || '0').toString();
  //   let ret = val;
  //   console.log(state.ol_data_item,'ol_data');
  //   if (!is_eports_csid(state.ol_data_item.csid) && val.includes('.')){
  //     if (val >= 100) {
  //       if (val.split('.')[1] == '00') {
  //         ret = val.split('.')[0];
  //       } else {
  //         let len = val.length;
  //         if(val.indexOf('.0') == (len-2)){
  //           ret = val.substring(0,len-2);
  //         } else {
  //           ret = val;
  //         }
  //       }
  //     } else if (val >= 10) {
  //       if (val.split('.')[1][1] == '0') {
  //         ret = val.slice(0,val.length-1);
  //       } else {
  //         ret = val;
  //       }
  //     }
  //   }
  //   return ret;
  // };

  const format_odds_value=(val)=> {
    if(val=='' || val == undefined){
      return '';
    }
    val = (val || '0').toString();
    let ret = val;
    if (val.includes('.')){
      if (val >= 100) {
        if (val.split('.')[1] == '00') {
          ret = val.split('.')[0];
            } else {
          let len = val.length;
          if(val.indexOf('.0') == (len-2)){
            ret = val.substring(0,len-2);
              } else {
            ret = val;
              }
            }
          } else if (val >= 10) {
        if (val.split('.')[1][1] == '0') {
          ret = val.slice(0,val.length-1);
            } else {
          ret = val;
            }
          }
        }
    return ret;
  }

  // ===========================computed===================================
  // 投注项信息 ++
  const ol_data = computed(() => {
    let { bet_source, ol_index, play_data, bet_info } = props;
    // 详情
    let ol_data = props.bet_data;

    // 主列表
    if (bet_source === "match_list") {
      // tpl99
      if (ol_index !== -1) {
        ol_data = lodash.get(play_data, `hl.ol.${ol_index}`);
        // 非 tpl99
      } else {
        ol_data = bet_info.ol_obj;
      }
      // 热门推荐 || 近期关注
    } else if (bet_source === "hot" || bet_source === "recent") {
      let item_bet = lodash.get(bet_info,`mid_obj.hps[0].hl[0].ol`)
      let {
        bet_ids: { oid },
      } = props;
      ol_data = item_bet?.find((i)=>i.oid == oid);
    }
    return ol_data;
  });
  /**
   * @Description 取消悬浮气泡
   * @param {boolean}
   */
  const tooltip_cancel = computed(() => {
    // 如果是 锁盘状态  或者是虚拟体育  不显示悬浮气泡
    return (
      ["seal", "disable"].includes(state.odds_state) ||
      MenuData.cur_menu_type.type_name == "virtual_sport"
    );
  });

  // 是否需要选中
  const computed_bet_select = computed(() => {
    // 热门推荐模块是否有投注项选中
    if (props.bet_source == "hot") {
      let id =
        lodash.get(props.bet_data, "_hn") || lodash.get(props.bet_data, "oid");
      let selected;
      if (BetData.is_virtual_bet) {
        selected = virtual_bet_item_select(id);
      } else {
        selected = bet_item_select(id);
      }
      return selected;
    }
    return false;
  });
  // 监听赛事ID变化 取消赔率升降
  const mid_ = computed(() => {
    return props.match_info?.mid;
  });
  // 监听投注项赔率变化
  const ol_data_item_ov = computed(() => {
    return state.ol_data_item.ov;
  });


  // ========================================methods==============================
  /**
   * @description: 检查是否选中
   * @param {String} 对象id
   * @return {Boolean}
   */
  const virtual_bet_item_select = (id) => {
    // 检查是否存在投注列表中
    return BetData.virtual_bet_list.includes(id);
  };

  /**
   * @description: 检查是否选中
   * @param {String} 对象id
   * @return {Boolean} 是否包含
   */
  const bet_item_select = (id) => {
    return BetData.bet_oid_list.includes(id);
  };


  /**
   * @Description 合并用于显示的盘口信息对象
   * @param {undefined} undefined
   */
  const assign_ol_data_item = () => {
    // console.log(111111111,lodash.get(ol_data.value, "oid"))
    if (lodash.get(ol_data.value, "oid")) {
      Object.assign(state.ol_data_item, ol_data.value);
      // console.log(111111111,state.ol_data_item)
    } else {
      Object.assign(state.ol_data_item, { _hs: 2, os: 3 });
    }
  };
  /**
   * @Description 设置赛事
   * @param {undefined} undefined
   */
  const set_match = () => {
    if (lodash.get(props.bet_info,"mid_obj.mid")) {
      state.match = props.bet_info.mid_obj;
    } else {
      state.match = props.match_info;
    }
  };
  /**
   * 赔率转换
   * @param  {number} ov - 赔率值
   * @param  {number} obv - 断档赔率值
   * @return {undefined} undefined
   */
  const format_odds = (ov, obv) => {
    // console.log(ov, obv,'ov, obv',props.play_data);
    // 列表取 hsw
    let hsw = lodash.get(props.play_data, `hl._play.hsw`) || "";
    // 非列表
    if (props.bet_source !== "match_list") {
      hsw = lodash.get(props.play_data, `hsw`) || "";
    }
    let sport_id = lodash.get(state.ol_data_item, "csid");
    // 电竞赔率精度处理
    if (lodash.isUndefined(sport_id) && menu_config.is_esports()) {
      sport_id = "101";
    }
    state.match_odds = compute_value_by_cur_odd_type(
      ov,
     ov._hpid,  //todo
      hsw,
      sport_id
    );
  };

  /**
   * 设置赔率升降
   * @param  {number} cur - 当前赔率值
   * @param  {number} old - 上次赔率值
   * @return {undefined} undefined
   */
  const set_odds_lift = (cur, old) => {
    
    if (menu_config.is_vr()) {
      return;
    }
    let _odds_lift = "";

    if (
      state.odds_state != "lock" &&
      state.odds_state != "seal" &&
      old &&
      !is_odds_seal()
    ) {
      if (cur > old) {
        _odds_lift = "up";
      } else if (cur < old) {
        _odds_lift = "down";
      }

      if (_odds_lift && !state.odds_lift_show) {
        /**清除定时器 */
        if (state.timer_obj["odds_lift"]) {
          clearTimeout(state.timer_obj["odds_lift"]);
          state.timer_obj["odds_lift"] = null;
        }
        state.odds_lift_show = true;
        state.odds_lift = _odds_lift;

        state.timer_obj["odds_lift"] = setTimeout(() => {
          state.odds_lift = "";
          state.odds_lift_show = false;
        }, 5000);
      }
    }
  };

  /**
   * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
   * @return {boolean}
   */
  const is_odds_seal = () => {
    let ov = lodash.get(state.ol_data_item, "ov");
    let obv = lodash.get(state.ol_data_item, "obv");
    let _odds = ov || obv;
    return _odds < 101000;
  };

  /**
   * @description 获得最新的盘口状态
   * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
   * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
   * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
   * @return {undefined} undefined
   */
  const get_odds_state = (mhs, hs, os) => {
    let _active = get_odds_active(mhs, hs, os);
    let id =
      lodash.get(state.ol_data_item, "_hn") ||
      lodash.get(state.ol_data_item, "oid");
    let state_ = "";
    const STATE = {
      // 封盘
      2: "seal",
      // 关盘
      3: "close",
    };
    if (!id) {
      state_ = "disable";
    } else if (STATE[_active]) {
      state_ = STATE[_active];
    } else {
      let selected_class;
      if (BetData.is_virtual_bet) {
        selected_class = virtual_bet_item_select(id);
      } else {
        selected_class = bet_item_select(id);
      }
      state_ = selected_class ? "active" : "normal";
    }
    // 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁

    return is_odds_seal() && _active !== 3 ? "seal" : state_;
  };

  /**
   * @description 投注项点击   //TODO
   * @return {undefined} undefined
   */
  const bet_click = (
    value = null,
    bet_item_info = null,
    is_chat_room = false
  ) => {
    console.log("value=", value);
    console.log("chat_match_info", bet_item_info);
    // 新的投注流程确认中时不让点击
    if (
      !BetData.is_virtual_bet &&
      BetData.bet_mode === 1 &&
      BetData.bet_item_lock &&
      !is_chat_room
    ) {
      return;
    }
    // if (this.show_fail_alert()) {    // todo
    //   return;
    // }
    // 封盘状态不让选择
    if (
      ["seal", "close", "disable"].includes(state.odds_state) &&
      is_chat_room == false
    ) {
      return;
    }
    let _oid =
      lodash.get(state.ol_data_item, "_hn") ||
      lodash.get(state.ol_data_item, "oid");

    if (props.bet_source === "match_list" && !is_chat_room) {
      _oid = props.oid;
    } else if (is_chat_room) {
      _oid = bet_item_info[0].oid;
    }
    if (_oid) {
      // let match_info = lodash.cloneDeep(this.match_info);
      //点击来源是赛事详情
      if (props.bet_source === "match_details" && !is_chat_room) {
        props.match_info.hps = [props.play_data];
        props.bet_path.hps_index = 0;
      }

      let id =
        lodash.get(state.ol_data_item, "_hn") ||
        lodash.get(state.ol_data_item, "oid");
      if (is_chat_room) {
        id = bet_item_info[0].oid;
      }

      if (route.name == "home") {
        ZHUGE.send_zhuge_event("PC_首页_投注点击分类", {
          详情区域: "右侧列表",
        });
      } else if (route.name == "details") {
        // 获取父类组件tag名称,用于区分指定模块
        let parent_component_tag = lodash.get(
          this,
          "$options.parent.$options._componentTag"
        );
        if (parent_component_tag == "q-carousel-slide") {
         send_zhuge_event("PC_首页_投注点击分类", {
            详情区域: "列表详情",
          });
        } else if (parent_component_tag == "recents") {
         send_zhuge_event("PC_首页_投注点击分类", {
            详情区域: "列表详情",
          });
        } else {
         send_zhuge_event("PC_首页_投注点击分类", {
            详情区域: "中间详情",
          });
        }
      } else if (this.$route.name == "video") {
       send_zhuge_event("PC_首页_投注点击分类", {
          详情区域: "大视频",
        });
      }
      if (!is_chat_room) {
        props.match_info.ispo = props.match_info.hps[0].ispo;
      }
      if (props.bet_source === "hot") {
        // 热门推荐
        hand_click_event("PC_热门推荐_投注项点击");
      }
      if (props.bet_source === "recent") {
        // 近期关注
        hand_click_event("PC_近期关注_投注项点击");
      }
      let obj_info = this.bet_info;
      if (is_chat_room) {
        obj_info = bet_item_info[0];
      }
      console.log("obj_info1----1===", obj_info);
      console.log("bet_source :>>>>>>>>>>>>>>>>>> ", props.bet_source);
      let obj = {
        id,
        match_info: is_chat_room ? value : props.match_info, //赛事信息
        bet_ids: props.bet_ids, // 投注项id集合
        bet_path: props.bet_path, // 选中的投注项路径
        ...obj_info, //投注项信息
        bet_source: is_chat_room ? "is_chat_room" : props.bet_source, // 投注项来源
        row_index: props.row_index, // tpl2 行 index
      };
      if (BetData.is_virtual_bet) {
        //点击押注按钮操作 (虚拟体育)
        // virtual_bat_click(obj); //todo
      } else {
        //点击押注按钮操作
        bat_click(obj, is_chat_room);
      }
    }
  };
  const hand_click_event = (name) => {
    let info = {};
    if (state.odds_state == "active") {
      info["点击状态"] = "取消";
    } else {
      info["点击状态"] = "选中";
    }
    ZHUGE.send_zhuge_event(name, info);
  };
  const score_format = () => {
    let score = "";
    if (props.bet_source == "match_list") {
      let hpid = lodash.get(props.play_data, "hl._play.hpid");
      // 比分玩法的显示
      if (
        ["7", "20", "74"].includes(hpid) &&
        !lodash.isEmpty(state.ol_data_item.ot)
      ) {
        if (state.ol_data_item.ot.includes(":")) {
          score = state.ol_data_item.ot.replace(":", "-");
        } else if (lodash.toLower(state.ol_data_item.ot) == "other") {
          score = i18n_t("list.other");
        }
      }
    }
    state.score = score;
  };

   // =============================watch============================
  /**
   * 监听状态变化
   */

  watch(
    () => ol_data,
    (cur) => {
      if (cur) {
        let { _mhs, _hs, os } = cur;
        state.odds_state = get_odds_state(_mhs, _hs, os);
      }
      assign_ol_data_item();
    },
    { deep: true }
  );

  watch(
    ()=>BetData.cur_odd,
    (cur) => {
      // 投注项赔率值处理
      let ov = lodash.get(state.ol_data_item, "ov");
      let obv = lodash.get(state.ol_data_item, "obv");
      format_odds(ov, obv);

      // 马来和印尼盘负数显示红色
      state.is_odds_value_red =
        state.match_odds < 0 && ["MY", "ID"].includes(cur);
    },
    { immediate: true }
  );
  // 监听赛事ID变化 取消赔率升降
  watch(
    () => mid_,
    () => {
      nextTick(() => {
        state.odds_lift = "";
      });
    }
  );

  // 监听投注项赔率变化
  watch(
    () => ol_data_item_ov.value,
    (cur, old) => {

      // 赔率值处理
      format_odds(cur, 1);
      if (state.ol_data_item) {
        let { _mhs, _hs, os } = state.ol_data_item;
        state.odds_state = get_odds_state(_mhs, _hs, os);
      }
      // 红升绿降变化
      set_odds_lift(cur, old);
    }
  );

  // 计算是否需要选中,用来控制热门推荐轮播是否需要继续
  watch(
    () => computed_bet_select,
    (new_) => {
      // 热门推荐模块是否有投注项选中选中则停止轮播,没有选中则继续轮播
      if (props.bet_source == "hot") {
        // 热门推荐轮播控制
        if (new_) {
          useMittEmit(MITT_TYPES.EMIT_HOT_STOP_PLAY);
        } else {
          useMittEmit(MITT_TYPES.EMIT_HOT_START_PLAY);
        }
      }
    },
    { immediate: true }
  );
  // 监控串关切换时设置投注项的选中
  watch(
    ()=>BetData.bet_list,
    (val) => {
      if (state.ol_data_item) {
        let { _mhs, _hs, os } = state.ol_data_item;
        state.odds_state = get_odds_state(_mhs, _hs, os);
      }
    },
    { immediate: true }
  );

  // 监控串关切换时设置投注项的选中
  watch(()=>BetData.is_bet_single, (val) => {
    if (state.ol_data_item) {
      let { _mhs, _hs, os } = state.ol_data_item;
      state.odds_state = get_odds_state(_mhs, _hs, os);
    }
  });

  // 监控单关列表的投注项选中
  watch(
   ()=>BetData.bet_single_list,
    (val) => {
      if (state.ol_data_item) {
        let { _mhs, _hs, os } = state.ol_data_item;
        state.odds_state = get_odds_state(_mhs, _hs, os);
      }
    },
    { immediate: true }
  );

  // 监控串关切换时设置投注项的选中
  watch(
    ()=>BetData.virtual_bet_list,
    (val) => {
      if (state.ol_data_item) {
        let { _mhs, _hs, os } = state.ol_data_item;
        state.odds_state = get_odds_state(_mhs, _hs, os);
      }
    },
    { immediate: true }
  );

  //  投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
  watch(()=>BetData.bet_category, (new_) => {
    if ([2, 3].includes(new_ * 1)) {
      // store.dispatch({
      //   type: "set_is_virtual_bet",
      //   data: true,
      // });
    } else {
      // store.dispatch({
      //   type: "set_is_virtual_bet",
      //   data: false,
      // });
    }
    // BetData.bet_clear();  //TODO
  });

  /**
   * 监听预约投注计算球头字段
   */
  // "BetData.bet_appoint_obj.computed_appoint_ball_head"() {
  //   return;
  //   let { _mhs, _hs, os } = this.ol_data_item;
  //   this.odds_state = this.get_odds_state(_mhs, _hs, os);
  //   // 如果为单关
  //   if (BetData.is_bet_single) {
  //     // 获取球头是否与盘口相等字段
  //     let is_head_eq_hadicap = lodash.get(
  //       BetData.bet_appoint_obj,
  //       "is_head_eq_hadicap"
  //     );
  //     // 当预约投注的球头与盘口值不相等并且此时投注项处于选中状态则取消选中
  //     if (!is_head_eq_hadicap && this.odds_state == "active") {
  //       this.odds_state = "";
  //     }
  //   }
  // },

  watch(
    () => state.odds_state,
    (_new, _old) => {
      if (props.bet_source === "hot" || props.bet_source === "recent") {
        if (_old == "active") {
          window.sessionStorage.removeItem("_bet_source");
        }
        if (_new == "active") {
          window.sessionStorage.setItem("_bet_source", props.bet_source);
        }
      }
    }
  );

  onUnmounted(() => {
    // un_subscribe();
    /**清除定时器 */
    for (const key in state.timer_obj) {
      clearTimeout(state.timer_obj[key]);
      state.timer_obj[key] = null;
    }
  });

  onBeforeMount(()=>{
    assign_ol_data_item();
    set_match();
    score_format();
    format_odds(state.ol_data_item.ov, 1);
    state .DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
    // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW
    // this.version_name = window.BUILDIN_CONFIG.DEFAULT_VERSION_NAME
    // this.DOM_ID_SHOW = lodash.get(window, "env.config.DOM_ID_SHOW", false);
    state.version_name = lodash.get(
      window,
      "BUILDIN_CONFIG.DEFAULT_VERSION_NAME",
      "zhuanye"
    );
  })

  return {
    ...toRefs(state),
    bet_click,
    format_odds_value  
  };
};
