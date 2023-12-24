
import { ref, computed, onDeactivated, onMounted, onUnmounted, watch, nextTick } from "vue"
import { useRoute } from 'vue-router'
import { play_title } from 'src/core/utils/common/module/play-title.js'
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt"
import { format_msc } from "src/core/format/common/index.js"
import { project_name,MenuData,compute_css_obj,UserCtr,i18n_t,MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js"
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import { api_common } from "src/api/index.js";
import oddListWrap from './odd-list-wrap.vue';
import MatchFold from 'src/core/match-fold'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";

// TODO: 其他模块得 store  待添加
// mixins:[match_list_mixin],

const props = defineProps({
  main_source: String,   //数据源
  mid: String,      //数据仓库数据
})

const route = useRoute()
const store_state = store.getState()
const emitters = ref({})

const sub_play_scroller = ref(null)
const sub_play_scroll_item = ref(null)

// const match_info = ref({})
const wsl_flag = ref(sessionStorage.getItem('wsl') == 7777)
// 罚牌玩法描述显示
const show_tips = ref(false)
// 次要玩法 整块区域是否展开
const any_unfold = ref(false)
// 当前的次要玩法 item 内容
const current_tab_item = ref({
  hps: [{ hl: [{}] }],
  title: '',
  id: 18,
})
// 玩法 key （如：hpsAdd, hps15Minutes）
const current_hps_key = ref('')
// 玩法标题总内容
const tab_list = ref(play_title())
// 当前打开的玩法名称
const mmp_map_title = ref('')
// 波胆玩法数据
const bold_all_list = ref([{ hl: [{}] }, { hl: [{}] }])
// 5分钟玩法数据
const five_minutes_all_list = ref({ hl: [{}] })
const bold_gaodu_css = ref(3)
const init_tab_timer = ref(null)
const compute_list_dom_time = ref(null)

const get_uid = ref(store_state.get_uid)
const get_standard_odd_status = ref(store_state.get_standard_odd_status)
const get_c303_data_change = ref(store_state.get_c303_data_change)
const get_corner_oc_change = ref(store_state.get_corner_oc_change)
const get_secondary_unfold_map = ref(store_state.get_secondary_unfold_map)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_uid.value = new_state.get_uid
  get_standard_odd_status.value = new_state.get_standard_odd_status
  get_c303_data_change.value = new_state.get_c303_data_change
  get_corner_oc_change.value = new_state.get_corner_oc_change
  get_secondary_unfold_map.value = new_state.get_secondary_unfold_map
}

onMounted(() => {
  if (["virtual_sports", "category"].includes(route.name)) {
    return;
  }
  // mmp映射赛事阶段名，国际化语言
  mmp_map_title.value = matchListClass.match_period_map(match_info.value, 'replace');

  //自动展开次要玩法
  init_unfold_play_way('mounted');
  on_listeners();

  // 足球进行到加时赛及以后阶段不显示加时赛玩法
  not_show_overtime_play()
  //  足球之外调用此方法，通过折叠状态
  change_status_by_any_unfold();
})

// 赛事信息
const match_info = computed(() => {
  return MatchDataBaseH5.get_quick_mid_obj(props.mid)||{}
})

/**
 * 异步初始化次要玩法tab显示1
 */
const init_tab_async_show = () => {
  clearTimeout(init_tab_timer.value);
  init_tab_timer.value = setTimeout(() => {
    init_tab_show();
  }, 200);
}

watch(() => MatchDataBaseH5.data_version.version, () => {
  get_new_match_info()
})

// 滚动列表时,组件赛事变化异步还原赛事次要玩法的显示状态
const get_new_match_info = () => {
  if (match_info.value) {
    init_tab_async_show();
    if (current_hps_key.value) {
      let hps_ = lodash.cloneDeep(match_info.value[current_hps_key.value])
      current_tab_item.value.hps = hps_
      // 如果是波胆 和 5分钟玩法
      if ([18].includes(+ lodash.get(current_tab_item.value, 'id'))) {
        // 波胆玩法 数据加工处理
        bold_all_list.value = corrective_action_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
      } else if ([19].includes(+ lodash.get(current_tab_item.value, 'id'))) {
        // 5分钟 玩法 数据加工处理
        five_minutes_all_list.value = five_minutes_gameplay_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
      }
    }
  }
}

watch(() => match_info.value, (c_m, o_m) => {
  if (c_m.mid == o_m.mid) {
    return;
  }
  init_tab_show(true); // 加载tab
  // 如果当场的赛事位置，换成了其他赛事了，则隐藏（折叠）当前的赛事
  if (typeof get_secondary_unfold_map.value === 'object' && c_m.mid in get_secondary_unfold_map.value) {
    let [id, status, special] = get_secondary_unfold_map.value[c_m.mid] && get_secondary_unfold_map.value[c_m.mid].split('-');
    let unfold_map = {};
    // 如果是波胆玩法 或者 5分钟玩法
    if (special > 0) {
      unfold_map[c_m.mid] = `${id}-0-0`;
    } else {
      unfold_map[c_m.mid] = `${id}-0`;
    }
    store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map })
    // 通知列表页重新计算dom高度
    clearTimeout(compute_list_dom_time.value);
    compute_list_dom_time.value = setTimeout(() => {
      useMittEmit(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE);
    }, 200);
  }
})

watch(() => get_c303_data_change.value, (curr) => {
  if (curr) {
    let splited = curr.split('-');
    let mid = splited[0];
    let hpid = splited[1];
    // 匹配mid
    if (mid && hpid && mid == match_info.mid) {
      // 指定页面屏蔽该功能
      if (['category', 'virtual_sports'].includes(route.name) || 900 == MenuData.get_menu_type()) {
        return;
      }
      // 检测是否有子tab打开状态
      let found = tab_list.value.filter(tab_item => {
        return tab_item && tab_item.unfold;
      });
      let item = lodash.get(found, '[0]');
      if (item) {
        let o_hps_key = get_hps_key_by(item);
        let params = {
          mids: match_info.mid,
          cuid: get_euid,
          pids: item.pids,
          playId: item.play_id,
          device: 'v2_h5_st',
          sort: 1,//排序	 int 类型 1 按热门排序 2 按时间排序
          inner_param: 'is_by_mids'/match-overtime-pen.vue
        };
        params.is_user = 'ws-user';
        let fun_temp = () => {
          api_common.get_match_base_info_by_mids(params).then(res => {
            if (res.data && res.data[0] && res.data[0][o_hps_key]) {
              // 根据业务需求，修改冠军小节玩法  1585 单对应
              Object.assign(match_info.value, res.data[0]);
              MatchMeta.handle_update_match_info(res.data)// 更新赛事盘口数据
              if(operate_type == 'is-user'){
                // 次要玩法展开加载数据  订阅指定玩法赛事(C8)  status 1订阅赛事推送  0退订赛事推送
                useMittEmit(MITT_TYPES.EMIT_SPECIAL_HPS_LOADED,res.data[0],o_hps_key);
              }
              current_tab_item.value.hps = match_info.value[o_hps_key];
              if ([18].includes(+ lodash.get(current_tab_item.value, 'id'))) {
                // 波胆玩法 数据加工处理
                bold_all_list.value = corrective_action_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
              } else if ([19].includes(+ lodash.get(current_tab_item.value, 'id'))) {
                // 5分钟 玩法 数据加工处理
                five_minutes_all_list.value = five_minutes_gameplay_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
              }
              // current_hps_key.value = o_hps_key;
            }
            init_tab_show(); // 获取请求后重新计算tab
            // 波胆玩法，5分钟玩法 其他次要玩法 展开显示， 波胆和5分钟，虚拟滚高度计算
            // save_second_play_mid_map_unfold_status(item, bold_all_list.value, five_minutes_all_list.value);
            //次要玩法展开或者关闭通知列表页重新计算dom高度
            // if(item.id==17){
            //   apply_15min_title(); // 15分钟 次要玩法模块  左下角的 小标题
            // }
            //次要玩法展开或者关闭通知列表页重新计算dom高度
            // useMittEmit(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
          });
        }
        fun_temp();
      }
    }
  }
})
// 是否至少存在一个展开tab状态变化,tab展开 属于唯一有用的方法之一
watch(() => any_unfold.value, () => {
  let any_unfold = 0;
  let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
  if (!unfold_map) return
  if (match_info.mid in unfold_map) {
    let u_status = unfold_map[match_info.mid] && unfold_map[match_info.mid].split('-')[1];
    any_unfold = +u_status;
  } else {
    any_unfold = +any_unfold.value;
  }
  change_status_by_any_unfold(any_unfold);
})
// 次要玩法开关,该事件主要从ws中推送中来
watch(() => get_corner_oc_change.value, (curr) => {
  if (curr) {
    let splited = curr.split('-');
    let mid = splited[0];
    if (mid == match_info.mid) {
      let tab_id = splited[2];
      let f_hps_key = tab_list.value.filter(t => t.id == tab_id)[0].hps_key;
      let displayStatus = splited[1];
      if (displayStatus == 'N') { // 不展示
        if (current_hps_key.value == f_hps_key) {
          any_unfold.value = false;
          let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
          // 如果传进来的是关闭状态 且当前的id 与传进来的id一样 ,则对当前的id进行折叠操作
          if ((match_info.mid in unfold_map) && tab_id == current_tab_item.value.id) {
            // 当前match折叠状态 所有的折叠状态设置为收起
            overtime_tab_handle(current_tab_item.value, 0, 'is-auto');
            tab_list.value.filter(t => t.id == tab_id)[0].unfold = 0;
          }

        }
        tab_list.value.forEach((t, i) => {
          if (t.id == tab_id) {
            tab_list.value[i].show_tab = false;
            tab_list.value[i].unfold = 0;
          }
        });
      } else if (displayStatus == 'Y') { // 展示
        any_unfold.value = true;
        tab_list.value.filter(t => t.id == tab_id)[0].show_tab = true;
      }
      if (!any_unfold.value) {
        let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
        if (match_info.mid in unfold_map) {
          let id = unfold_map[match_info.mid] && unfold_map[match_info.mid].split('-')[0];
          let status = unfold_map[match_info.mid] && unfold_map[match_info.mid].split('-')[1];
          unfold_map[match_info.mid] = `${id}-${status}`;
        }
        store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map })
      }
    }
  }
})

watch(() => match_info.value.mmp, () => {
  //足球进行到加时赛及以后阶段不显示加时赛玩法
  not_show_overtime_play()
  //篮球赛事阶段变化处理
  match_info.value.csid === '2' && basketball_mmp_change();
  mmp_map_title.value = matchListClass.match_period_map(match_info.value, 'replace');
})
// 15分钟 次要玩法模块  左下角的 小标
watch(() => get_standard_odd_status.value, () => {
  apply_15min_title();
})
// 一级菜单切换，次要玩法，默认折叠
watch(MenuData.menu_type, () => {
  tab_list.value.forEach(t => {
    t.unfold = 0;
  });
})
// 二级菜单切换，次要玩法，默认折叠
watch(() => MenuData.current_lv_2_menu, () => {
  tab_list.value.forEach(t => {
    t.unfold = 0;
  });
}, { deep: true })

watch(() => mmp_map_title.value, (value) => {
  tab_list.value = play_title(value)
})

/**
 * @description 判断是否显示tab栏
 */
const show_tab_by_data = computed(() => {
  let flag = false;
  let { cosCorner, cosOvertime, cosBold, cosPenalty, cosPromotion, cosOutright, cosPunish, hpsAdd, cos15Minutes, cos5Minutes } = match_info.value;
  flag = cos15Minutes || cos5Minutes || cosCorner || cosOvertime || cosBold || cosPenalty || cosPromotion || cosOutright || cosPunish || (hpsAdd && hpsAdd.length > 0)
  // const key = MatchFold.get_match_fold_key(match_info.value)
  // const show_tab = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_tab`)
  // 如果没有 玩法时
  if (!flag) {
    let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
    let status_id = '';
    if (unfold_map && match_info.value.mid in unfold_map) {
      status_id = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[0];
      unfold_map[match_info.value.mid] = `${status_id}-0`;
      // 如果没有 玩法时,则隐藏次要玩法整个模块
      store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map })
    }
  } else {  // 如果有 玩法时， 初始化次要玩法tab显示
    init_tab_show(false, 'show-tab-by-data');
  }
  return flag;
})

// 主队角球数或罚牌数
const home_score = computed(() => get_score_second(1))

// 客队角球数或罚牌数
const away_score = computed(() => get_score_second(2))

// 是否进行到加时赛及以后的阶段
const is_overtimeed = computed(() => [32, 33, 34, 41, 42, 50, 80, 90, 100, 110, 120, 999].includes(+match_info.value.mmp))

// 获取赛事次要玩法的让球方
const current_tab_handicap_index = computed(() => {
  let result = 0;
  const hps_add = current_tab_item.value.hps;
  if (match_info.value && hps_add && hps_add[1]) {
    let hp_item = hps_add[1];// 小节 或者角球等玩法 永远取第二个值 是让球数据
    if (hp_item) {
      let hl_item = hp_item.hl[0];
      if (hl_item && hl_item.ol) {
        let found_i = 0;
        hl_item.ol.forEach((ol_item, i) => {
          if (ol_item.on) {
            let on_str = String(ol_item.on);
            if (on_str[0] == '-') {
              found_i = (i + 1);
            }
          }
        });
        result = found_i;
      }
    }
  }
  return result;
})

// 足球进行到加时赛及以后阶段不显示加时赛玩法，折叠起来
const not_show_overtime_play = () => {
  if (is_overtimeed) {
    tab_list.value.filter(t => t.id == 4)[0].show_tab = false;
    if (current_hps_key.value == 'hpsOvertime') {
      any_unfold.value = false;
      let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
      if (unfold_map && match_info.value.mid in unfold_map) {
        let id = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[0];
        let status = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[1];
        unfold_map[match_info.value.mid] = `${id}-${status}`;
      }
      store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map })
      tab_list.value.filter(t => t.id == 4)[0].unfold = false;
    }
  }
}
// c105  盘口和投注项的 ws 更新
const c105_handle = (skt_data) => {
  // console.error(skt_data);
  // hls 判断为undefined 执行下次循环
  if (!skt_data.hls) return;
  if (match_info.value.mid == skt_data.mid) {
    skt_data = lodash.cloneDeep(skt_data)
    skt_data.hls.forEach(hl_ws => {
      // 更新盘口级别hs
      lodash.size(current_tab_item.value.hps) && current_tab_item.value.hps.forEach(match_hp => {
        if (match_hp.hl) {
          match_hp.hl.forEach(hl => {
            if (hl.hid == hl_ws.hid) {
              hl.hs = hl_ws.hs
              if (hl.hv && hl_ws.hv) {
                hl.hv = hl_ws.hv
              }
            }
          });
        }
        else {
          if (match_hp.hid == hl_ws.hid) {
            match_hp.hs = hl_ws.hs
          }
        }
      });

      // 更新投注项级别ol
      if (hl_ws.ol) {
        hl_ws.ol.forEach(ol_ws => {
          lodash.size(current_tab_item.value.hps) && current_tab_item.value.hps.forEach(match_hp => {
            if (match_hp.hl) {
              match_hp.hl.forEach(hl => {
                if (!hl.ol) return;
                hl.ol.forEach(ol_item => {
                  if (ol_ws.oid == ol_item.oid) {
                    if (ol_item.onb && ol_item.on && ol_ws.on && !ol_ws.onb) {  //queryLatestMarketInfo 接口模拟触发需要跟新 on 值
                      ol_ws.onb = ol_item.onb.replace(/\d+\.?\d*/, ol_ws.on)
                      ol_ws.on = ol_item.on.replace(/\d+\.?\d*/, ol_ws.on)
                    }
                    Object.assign(ol_item, ol_ws);
                  }
                });
              });
            }
            else {
              let ol_list = match_hp.hl ? match_hp.hl.ol : match_hp.ol;
              ol_list.forEach(ol_item => {
                if (ol_ws.oid == ol_item.oid) {
                  Object.assign(ol_item, ol_ws);
                }
              });
            }
          });
        });
      }
    });
  }
}
// 罚牌玩法描述显示
const fapai_way_tips_status_change_h = (flag) => {
  wsl_flag.value = flag;
}
// 存储次要玩法  赛事id  展开/折叠  状态
const save_second_play_mid_map_unfold_status = (item, bold_list, five_minutes_list) => {
  let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value) || {};
  unfold_map[match_info.value.mid] = `${item.id}-${item.unfold}`;
  // 如果是波胆玩法开
  if (item.id == 18) {
    // 最终 的波胆列表长度     波胆的高度      默认三行
    let finall = [], bold_gaodu = 3, ol_list = [{ placeholder: 1 }, { placeholder: 1 }, { placeholder: 1 }];
    if (lodash.size(bold_list)) {
      for (let m = 0, hps_length = bold_list.length; m < hps_length; m++) {
        if (lodash.get(bold_list[m], 'hl[0].ol')) {
          ol_list = bold_list[m].hl[0].ol
          finall.push(ol_list.filter(tab => tab.otd == 1).length)
          finall.push(ol_list.filter(tab => tab.otd == 0).length)
          finall.push(ol_list.filter(tab => tab.otd == 2).length)
        }
      }
      if (lodash.size(finall)) {
        // 波胆 动态高度
        bold_gaodu = Math.max(...finall) + 1
      }
    }
    if (bold_gaodu > 3) {
      bold_gaodu_css.value = bold_gaodu
    } else {
      bold_gaodu_css.value = 3
    }
    unfold_map[match_info.value.mid] = `${item.id}-${item.unfold}-${bold_gaodu}`;
  }// 如果是5分钟玩法
  else if (item.id == 19) {
    let five_height = 3, ol_list = [{ placeholder: 1 }];
    if (lodash.get(five_minutes_list, 'hl[0].ol')) {
      const mst = +match_info.value.mst
      /**
       * 25分钟前显示4行，25分钟(包含)后显示3行
       */
      if (mst < 25 * 60) {
        five_height = 4
      }
      else {
        five_height = 3
      }
    }
    unfold_map[match_info.value.mid] = `${item.id}-${item.unfold}-${five_height}`;
  }
  store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map });
}
/**
 * 初始化展开玩法
 * 展开优先级 , 加时赛>点球大战>晋级>角球>罚牌 todo 前面设置为0 都是因为这些没必要自动展开属于垃圾代码,测试一段时间没问题后删除
 */
const init_unfold_play_way = (type_way = 'is-auto') => {
  //足球
  if (match_info.value.csid == 1) {
    let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
    if (unfold_map && match_info.value.mid in unfold_map) {
      let [id, status] = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-');
      unfold_map[match_info.value.mid] = `${id}-${status}`;
      let second_hps = tab_list.value.filter(tab => tab.id == id)[0];
      overtime_tab_handle(second_hps, status, type_way);
    }
  }
  // 非足球展开默认
  if (match_info.value.csid != 1) {
    let tab_id = get_tabid_by_csid(), init_und = 0;
    let quater = tab_list.value.filter(t => t.id == tab_id)[0];
    if (quater && quater.show_tab) {
      overtime_tab_handle(quater, init_und, type_way);
    }
  }
}
// 通过tab id获取赔率属性 key （如：hpsAdd, hps15Minutes）
const get_hps_key_by = (item) => {
  let o_hps_key = '';
  let tab_id_map_hps_key = {
    1: "hpsCorner",
    2: "hpsPenalty",
    3: "hpsPromotion",
    4: "hpsOvertime",
    5: "hpsPunish",
    17: "hps15Minutes",
    19: "hps5Minutes",
    18: "hpsBold",
    30: "hpsOutright",
  };
  o_hps_key = tab_id_map_hps_key[item.id];
  if (!o_hps_key && [6, 7, 8, 9].includes(+item.id)) {
    o_hps_key = 'hpsAdd';
  }
  return o_hps_key;
}
/**
 * @description: 切换tab
 * @param {Object} item 切换的指定tab
 * @param {Number} unfold 展开1或收起0状态
 * @param {String} operate_type
 *  is-auto(自动展开) is-user(用户点击展开) is-mmp-change(赛事阶段变化)
 * @return {Undefined}
 */
const overtime_tab_handle = (item, unfold, operate_type, sub_i) => {
  if (['category', 'virtual_sports'].includes(route.name) || 900 == MenuData.get_menu_type() || !item) {
    return;
  }

  // 滚动次要玩法选中项到屏幕显示区域
  nextTick(() => {
    tab_move(sub_i, sub_play_scroller.value, sub_play_scroll_item.value)
  })

  if (item && item.title && item.id && operate_type !== 'is-auto') {   // 解决bug 24153
    current_tab_item.value.title = item.title
    current_tab_item.value.id = item.id
  }
  //改变折叠tab选项
  tab_list.value.forEach((t, i) => {
    if (item.id != t.id) {
      tab_list.value[i].unfold = 0;
    }
  });
  if (typeof unfold != 'undefined') {
    item.unfold = unfold;
  } else {
    item.unfold = !item.unfold ? 1 : 0;
  }
  //检测到当前赛事无展开的次要玩法时移除vuex中的赛事/展开状态映射key
  any_unfold.value = tab_list.value.filter(t => t.unfold == 1).length;
  //  如果没有展开的选项，则所有都折叠
  if (!any_unfold.value) {
    let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
    if (unfold_map && match_info.value.mid in unfold_map) {
      let id = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[0];
      let status = 0;
      unfold_map[match_info.value.mid] = `${id}-${status}`;
    }
    store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map });
  }
  //隐藏次要玩法描述弹层
  useMittEmit(MITT_TYPES.EMIT_INFO_ICON_CLICK, null);
  //先用本地数据填充次要玩法投注项,避免拉取接口过程中的模板不完整， 获取 key （如：hpsAdd, hps15Minutes）
  let o_hps_key = get_hps_key_by(item);
  // if(! operate_type == 'is-user' ){
  //   set_local_hps_by_key(item,o_hps_key);
  // }
  // 展开次要玩法
  if (item.unfold == 1) {
    let params = {
      mids: match_info.value.mid,
      cuid: get_uid,
      pids: item.pids,
      playId: item.play_id,
      device: 'v2_h5_st',
      sort: 1,//排序	 int 类型 1 按热门排序 2 按时间排序
      inner_param: 'is_by_mids'
    };
    //自动展开次要玩法无需拉取新数据
    if (operate_type == 'is-auto') {
      save_second_play_mid_map_unfold_status(item);
      return;
    }
    //拉接口更新数据
    if (operate_type == 'is-user' || operate_type == 'mounted') {
      params.is_user = operate_type;
      let fun_temp = () => {
        api_common.get_match_base_info_by_mids(params).then(res => {
          if (res.data && res.data[0] && res.data[0][o_hps_key]) {
            // 根据业务需求，修改冠军小节玩法  1585 单对应
            Object.assign(match_info.value, res.data[0]);
            MatchMeta.handle_update_match_info(res.data)
            if (operate_type == 'is-user') {
              // 次要玩法展开加载数据  订阅指定玩法赛事(C8)  status 1订阅赛事推送  0退订赛事推送
              useMittEmit(MITT_TYPES.EMIT_SPECIAL_HPS_LOADED, res.data[0], o_hps_key);
            }
            current_tab_item.value.hps = match_info.value[o_hps_key];
            if ([18].includes(+ lodash.get(current_tab_item.value, 'id'))) {
              // 波胆玩法 数据加工处理
              bold_all_list.value = corrective_action_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
            } else if ([19].includes(+ lodash.get(current_tab_item.value, 'id'))) {
              // 5分钟 玩法 数据加工处理
              five_minutes_all_list.value = five_minutes_gameplay_data_processing(lodash.get(current_tab_item.value, 'hps'), match_info.value)
            }
            current_hps_key.value = o_hps_key;
          }
          init_tab_show(); // 获取请求后重新计算tab
          // 波胆玩法，5分钟玩法 其他次要玩法 展开显示， 波胆和5分钟，虚拟滚高度计算
          save_second_play_mid_map_unfold_status(item, bold_all_list.value, five_minutes_all_list.value);
          //次要玩法展开或者关闭通知列表页重新计算dom高度
          if (item.id == 17) {
            apply_15min_title(); // 15分钟 次要玩法模块  左下角的 小标题
          }
          //次要玩法展开或者关闭通知列表页重新计算dom高度
          useMittEmit(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
        });
      }
      fun_temp();
    }
  }
  // 诸葛埋点
  if (match_info.value.csid == 1 && operate_type == 'is-user') {
    let zhugeObj = {
      "玩法集名称": item.title,
      "玩法集ID": '',
      "区域位置": "主列表"
    }
    send_zhuge_event('TY_H5_足球_玩法分类导航_点击', UserCtr, zhugeObj)
  }
  save_second_play_mid_map_unfold_status(item);
  if (item.id == 17) {
    apply_15min_title();// 15分钟 次要玩法模块  左下角的 小标题
  }
  //次要玩法展开或者关闭通知列表页重新计算dom高度
  useMittEmit(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
}

//玩法说明图标点击
// $event 时间对象 mid 赛事id
const info_icon_click = ($event, mid) => {
  useMittEmit(MITT_TYPES.EMIT_INFO_ICON_CLICK, $event, mid, current_tab_item.value);
}
// 足球之外调用此方法， 获取要展开的tab项  获取次要玩法 id
const get_tabid_auto_unfold = () => {
  //获取vuex中的选中tab对象
  let unfold_map = get_secondary_unfold_map.value;
  let t_itemid = null
  if (unfold_map && match_info.value.mid in unfold_map) {
    let item_status = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-');
    t_itemid = item_status[0];
  }
  //vuex中无tab对象 获取赛事默认要展开的tab对象
  if (!t_itemid) {
    if (match_info.value.csid == 2) {
      t_itemid = 6
    } else if (match_info.value.csid == 5) {
      t_itemid = 7
    } else if (match_info.value.csid == 8) {
      t_itemid = 8
    } else if (match_info.value.csid == 7) {
      t_itemid = 9
    }
  }
  return t_itemid;
}
/**
 * 根据球类csid获取默认展开的tab id,
 * 非足球,因为足球可以显示多个
 */
const get_tabid_by_csid = () => {
  let tab_id = '';
  if (match_info.value.csid == 1) {
    //足球可以展开多个tab
  } else if (match_info.value.csid == 2) {
    tab_id = 6;
  } else if (match_info.value.csid == 5) {
    tab_id = 7;
  } else if (match_info.value.csid == 8) {
    tab_id = 8;
  } else if (match_info.value.csid == 7) {
    tab_id = 9;
  }
  return tab_id;
}

/**
 * 初始化次要玩法tab显示  两个功能
 *  1.标题列表：this.tab_list   tab列表的 （show_tab 是否为true， title 标题名称）
 *  2. any_unfold.value  次要玩法 整块区域是否展开
 * @param {Boolean} is_change_match 有值时， 收起所有tab
 */
const init_tab_show = (is_change_match, show_tab_by_data) => {
  const match = MatchDataBaseH5.get_quick_mid_obj(props.mid)
  if (is_change_match) {
    tab_list.value.forEach(t => {
      t.show_tab = false;
      t.unfold = 0;
    });
    current_tab_item.value.unfold = 0;
    any_unfold.value = 0;
  }
  //找出要显示的次要玩法tab
  //足球
  if (match.csid == 1) {
    let id_show_map = {
      '1': match.cosCorner,
      '2': match.cosPenalty,
      '3': match.cosPromotion,
      '30': match.cosOutright,
      '17': match.cos15Minutes,
      '19': match.cos5Minutes,
      '4': match.cosOvertime,
      '18': match.cosBold,
      '5': match.cosPunish
    };
    tab_list.value.forEach((tab, i) => {
      tab.show_tab = id_show_map[tab.id];
      // 5分钟赛前阶段，小节名称：5分钟
      // 滚球阶段，小节名称：下一个进球
      if (tab.id === 19) {
        if ([1, 2, 7, 10].includes(+match.ms)) {
          tab.title = i18n_t('football_playing_way.hps_next_goal')
        } else {
          tab.title = i18n_t('football_playing_way.hps5Minutes')
        }
      }
    });
  } else if (match.csid == 2) {
    //篮球
    tab_list.value.filter(t => t.id == 6)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
  } else if (match.csid == 5) {
    //网球
    tab_list.value.filter(t => t.id == 7)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
  } else if (match.csid == 8) {
    //乒乓球
    tab_list.value.filter(t => t.id == 8)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
  } else if (match.csid == 7) {
    // 斯诺克
    tab_list.value.filter(t => t.id == 9)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
  }
  mmp_map_title.value = matchListClass.match_period_map(match, 'replace');
  if (match.csid != 1) {
    tab_list.value.forEach(tab => {
      if ([6, 7, 8, 9].includes(+tab.id)) {
        mmp_map_title.value = matchListClass.match_period_map(match, 'replace');
        tab.title = mmp_map_title.value;
      }
    });
  }
  //检测到有一个tab是展开的,就显示次要玩法投注项
  if (!show_tab_by_data) {
    any_unfold.value = tab_list.value.filter(t => t.unfold == 1).length;
  }
}

/**
 * 篮球阶段变化处理
 * 当篮球玩法id为'43,19,18'时, 次要玩法要显示为"上半场"
 * 否则显示为"小节"
 */
const basketball_mmp_change = (mmp) => {
  if (match_info.value.csid == 2) {
    let get_data = false;
    let quater_tab_item = tab_list.value.filter(tab => tab.id == 6)[0];

    //篮球进入上半场,小节显示为半场
    if (mmp == 1 || mmp == 14) {
      get_data = true;
      //上半场
      if (mmp == 1) {
        quater_tab_item.pids = '43,19,18';
        quater_tab_item.play_id = '2001';
      }
      //第二节
      else if (mmp == 14) {
        quater_tab_item.pids = '54,52,51';
        quater_tab_item.play_id = '2004';
      }
      quater_tab_item.show_tab = true;
    }
    //当收到302（第二节休息）时，小节玩法更新为 第三节独赢，第三节让分，第三节大小 玩法赔率
    //变为第三节
    else if (mmp == 302) {
      get_data = true;
      quater_tab_item.pids = '60,58,57';
      quater_tab_item.play_id = '2005';
      // quater_tab_item.title = i18n_t('basketball_playing_way.quarter');
    }
    //当收到16阶段(第四节)时，移除‘小节’玩法TAB以及对应的玩法赔率行，仅展示全场玩法数据
    else if ([31, 16, 100, 1001, 1002].includes(+mmp)) {
      quater_tab_item.show_tab = false;
      any_unfold.value = false;
      let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
      if (unfold_map && match_info.value.mid in unfold_map) {
        let id = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[0];
        unfold_map[match_info.value.mid] = `${id}-0`;
      }
      store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: unfold_map });
    }
    //#region 参数说明
    // 第一节 "48,46,45"
    // 第二节 "54,52,51"
    // 第三节 "60,58,57"
    // 第四节 "66,64,63"
    // 上半场 "43,19,18"
    // 下半场 "142,143,26"
    //篮球大小节玩法  第一节玩法 playId   =   2003
    //篮球大小节玩法  第二节玩法 playId   =   2004
    //篮球大小节玩法  第三节玩法 playId   =   2005
    //篮球大小节玩法  第四节玩法 playId   =   2006
    //篮球大小节玩法  上半场玩法 playId   =   2001
    //篮球大小节玩法  下半场玩法 playId   =   2002
    //#endregion

    //展开次要玩法需要调用接口
    if (get_data) {
      overtime_tab_handle(quater_tab_item, 0, 'is-mmp-change');
    }

  }
}
/**
 * 获取次要玩法比分
 * @param {Number}index 1主队比分2客队比分
 */
const get_score_second = (index) => {
  let r = 0;
  let split = 'S5|';
  if (current_tab_item.value.id == 1) { //角球
    split = 'S5|';
  }
  else if (current_tab_item.value.id == 5) { //罚牌
    split = 'S10102|';
  }
  if (match_info.value.csid == 5) {//网球
    split = ['S23|', 'S39|', 'S55|', 'S71|', 'S87|'];
  }//羽毛球、乒乓球、斯洛克，排球，冰球，棒球，沙滩排球
  else if (match_info.value.csid == 7 || match_info.value.csid == 8) {
    split = [];
    //比分S120到S160(不含)
    for (let min = 120; min < 160; min++) {
      split.push(`S${min}|`);
    }
  }

  if (match_info.value.msc && match_info.value.msc.length) {
    // 网  斯  乒
    if ([5, 7, 8].includes(+match_info.value.csid)) {
      let found_score_list = [];
      match_info.value.msc.forEach(f_score => {
        split.forEach(spl_str => {
          if (f_score.indexOf(spl_str) > -1) {
            let sliced = format_msc(f_score);
            found_score_list.push(sliced);
          }
        });
      });
      if (found_score_list && found_score_list.length) {
        r = found_score_list[found_score_list.length - 1][index];
      }
    }
    else {
      match_info.value.msc.forEach(f_score => {
        if (f_score.indexOf(split) > -1) {
          let sliced = format_msc(f_score);
          r = sliced[index];
        }
      });
    }
  }
  if (current_tab_item.value.id == 5) {
    if (is_overtimeed) {
      r = '';
    }
  }
  return r;
}
//  足球之外调用此方法，通过折叠状态
const change_status_by_any_unfold = (c_v) => {
  let tab_id = get_tabid_by_csid();
  if (!tab_id && match_info.value.csid == 1 || !match_info.value.mid) {
    return;
  }
  if (![2, 5, 7, 8].includes(+match_info.value.csid)) {
    any_unfold.value = 0;
  }
  let quater = tab_list.value.filter(t => t.id == tab_id)[0];
  let hps_list = [];
  if (quater) {
    hps_list = match_info.value[quater.hps_key];
  } else {
    hps_list = null;
  }
  if (!c_v || !hps_list || !hps_list.length) {
    // 获取次要玩法 id
    let tab_id = get_tabid_auto_unfold();
    if (tab_id) {
      let set_dict = {};
      set_dict[match_info.value.mid] = `${tab_id}-0`;
      store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: set_dict })

    } else {
      let v_k = {};
      let unfold_map = lodash.cloneDeep(get_secondary_unfold_map.value);
      if (unfold_map && match_info.value.mid in unfold_map) {
        let id = unfold_map[match_info.value.mid] && unfold_map[match_info.value.mid].split('-')[0];
        v_k[match_info.value.mid] = `${id}-0`;
      }
      store.dispatch({ type: 'matchReducer/set_secondary_unfold_map', payload: v_k })
    }
  }
}
// 15分钟 次要玩法模块  左下角的 小标题
const apply_15min_title = () => {
  if (current_tab_item.value.id == 17) {
    // 如果是15分钟玩法下展示玩法时段 ,如果没有滑动取最小值(因为在更新时已经进行了排序因此第一个为最小值),如果滑动到第二个tab取+1值
    let hSpecial = lodash.get(match_info.value.hps15Minutes, '[0].hSpecial', 1) - 1;
    if (get_standard_odd_status.value == 1 && lodash.get(match_info.value, 'hps15Minutes', []).length == 6) { // 翻转后取第二个值
      hSpecial = lodash.get(match_info.value.hps15Minutes, '[3].hSpecial', 1) - 1;
    }
    if (hSpecial > 4) {
      hSpecial = 4; //容错 下标不能大于4 最大特5
    }
    if (hSpecial < 0) {
      hSpecial = 0
    }
    current_tab_item.value.title = i18n_t(`football_playing_way.hps15_title[${hSpecial}]`)
  }
}
// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [
    init_tab_timer.value,
    compute_list_dom_time.value,
  ]
  for (let timer of timer_arr) {
    clearTimeout(timer)
    timer = null
  }
}

// 波胆玩法 数据加工处理
const corrective_action_data_processing = (data, match_obj) => {
  let arr = []
  if (data && match_obj) {
    arr.push(...data.filter((x, i) => x.hpid == 7))
    // 如果是上半场，就取上半场的数据         先取  341    再取  20
    if (match_obj['mmp'] <= 6) {
      let first_half1 = data.filter((x, i) => x.hpid == 341), first_half = data.filter((x, i) => x.hpid == 20)
      // 如果 玩法id 341 没数据，再取 hpid 20 的
      if (lodash.get(first_half1, '[0].hl[0].ol')) {
        arr.push(...first_half1)
      } else if (lodash.get(first_half, '[0].hl[0].ol')) {
        arr.push(...first_half)
      } else {
        arr.push({ hl: [{}] })
      }
    } else {    // 如果是下半场，就取下半场的数据           先取 342         再取  74
      let second_half1 = data.filter((x, i) => x.hpid == 342), second_half = data.filter((x, i) => x.hpid == 74)
      // 如果 玩法id 341 没数据，再取 hpid 20 的
      if (lodash.get(second_half1, '[0].hl[0].ol')) {
        arr.push(...second_half1)
      } else if (lodash.get(second_half, '[0].hl[0].ol')) {
        arr.push(...second_half)
      } else {
        arr.push({ hl: [{}] })
      }
    }
  }
  if (lodash.size(arr) < 2) {
    arr = [{ hl: [{}] }, { hl: [{}] }]
  }
  return arr
}
// 5分钟玩法 数据加工处理
const five_minutes_gameplay_data_processing = (data, match_obj) => {
  let arr = []
  if (data && match_obj) {
    // 如果是滚球，则取 362
    if ([1, 2, 7, 10].includes(+match_obj['ms'])) {
      arr.push(...data.filter((x, i) => x.hpid == 362))
    } else {  // 如果是早盘 ，则取 361
      arr.push(...data.filter((x, i) => x.hpid == 361))
    }
  }
  if (!lodash.size(arr)) {
    arr = [{ hl: [{}] }]
  }
  return arr[0]
}
const on_listeners = () => {
  //WS 对应事件
  // c105  盘口/投注项
  // c303  滚球新赛事通知
  // c305  赛事订阅(C8)-玩法tab(C305)

  emitters.value = {
    // 封盘事件
    emitter_1: useMittOn(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE, fapai_way_tips_status_change_h).off,
    // c105更新
    emitter_2: useMittOn(MITT_TYPES.EMIT_C105_CMD_NOTICE, c105_handle).off,
  }
}
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x())
}

onUnmounted(() => {
  clear_timer()
  unsubscribe()
  off_listeners()
})

onDeactivated(() => {
  clear_timer()
  off_listeners()
})

