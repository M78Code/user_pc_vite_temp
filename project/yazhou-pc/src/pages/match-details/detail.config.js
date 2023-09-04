import {
  reactive,
  ref,
  toRefs,
  onUnmounted,
  computed,
  onMounted,
  watch,
} from "vue";
import { is_eports_csid } from 'src/core/index.js'
// api文件
import { api_details } from "src/api/index";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/";
import { useGetGlobal } from "./global_mixin";
import lodash from "lodash";
import details from "src/core/match-detail/match-detail-pc/match-detail";
// console.log(details,);
// 搜索操作相关控制类
import search from "src/core/search-class/search.js";
console.log(search,'search');
// 赛事详情页面信息操作类 这个类暂时不知道从哪里来
// import MatchInfoCtr from "src/core/match-list-pc/data-class-ctr/match-info-ctr";
import store from "src/store-redux/index.js";
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache";
import { useRoute, useRouter } from "vue-router";
import { axios_loop } from "src/core/http/index.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { pre_load_video } from "src/core/pre-load/index";
import { format_plays, format_sort_data } from "src/core/format/index";
import { formatTime } from "src/core/format/index.js"
import {MatchDataWarehouse_PC_Detail_Common} from "src/core/index"; 
import uid from "src/core/uuid/index.js";

export const useGetConfig = () => {
  const route = useRoute();
  const router = useRouter();

  const store_state = store.getState();
  const MatchDataWarehouseInstance = ref(MatchDataWarehouse_PC_Detail_Common)
  const state = reactive({
    // 菜单数据
    // menu_data: $menu.menu_data,
    // MatchDataWarehouseInstance: "",
    mid: "", //赛事id
    sportId: "", //球类id
    match_infoData: {}, //赛事状态比分信息
    category_list: [], //玩法集
    mcid: 0, //默认玩法集id
    plays_list: [], //选中玩法集的盘口玩法集
    match_details: [], //玩法盘口列表
    is_request: false, // 详情接口 是否请求中

    // isInit: false,
    load_data_state: "loading", //整块加载状态
    handicap_state: "loading", //玩法加载状态状态
    background_img: "", // 比分板背景图
    // 是否关闭全部玩法
    close_all_handicap: false,
    socket_name: "details",
    autoset_mid: "", //切换新赛事id
    handicap_this: null, // 传给玩法集 tabs 的数据
    change_mid: true,
    active_detials: {},
    err_time: 0, //玩法详情接口报错次数
    countMatchDetailErr: 0, // 计算详情比分面板接口报错次数
    currentRound: null, // 电竞动态玩法集配置--当前玩法集局数标记
    load_detail_statu: "right_details_loading", // loading 状态
    headerHeight: 0, // 头部高度
    get_match_details_timer: null,
    back_to_timer: null,
    axios_debounce_timer: null,
    details_loading_time_record: [],
    last_tab_data: {},
  });
  const detail_header = ref(null); // 头部组件实例

  const details_params = ref(store_state.matchesReducer.params);
  // 获取当前菜单类型
  const cur_menu_type = ref(store_state.menuReducer.cur_menu_type);
  // 当前所选的玩法集子项id
  const tabs_active_index = ref(store_state.matchesReducer.tabs_active_index);
  // 当前所选的玩法集子项id
  const uuid = ref(uid);
  /** 语言变化 */
  const get_lang_change = ref(store_state.langReducer.lang_change);
  // 获取右侧布局类型
  const cur_expand_layout = ref(store_state.layoutReducer.cur_expand_layout);
  // //播放类型
  const play_media = ref(store_state.matchesReducer.play_media);
  // 玩法集对应玩法缓存数据
  const get_details_data_cache = ref(
    store_state.matchesReducer.details_data_cache
  );
  // 置顶的玩法id
  const get_top_id = ref(store_state.matchesReducer.topId);

  // 监听状态变化
  let un_subscribe = store.subscribe(() => {
    let state_ = store.getState();
    details_params.value = state_.matchesReducer.params;
    cur_menu_type.value = state_.menuReducer.cur_menu_type;
    tabs_active_index.value = state_.matchesReducer.tabs_active_index;
    get_details_data_cache.value = state_.matchesReducer.details_data_cache;
    get_lang_change.value = state_.langReducer.lang_change;
    cur_expand_layout.value = state_.layoutReducer.cur_expand_layout;
    get_top_id.value = state_.matchesReducer.topId;
  });

  const category_list_length = computed(() => {
    return lodash.get(state.category_list, "length", 0);
  });
  const ms = computed(() => {
    return lodash.get(state.match_infoData, "ms", 0);
  });
  const mmp = computed(() => {
    return lodash.get(state.match_infoData, "mmp", 0);
  });

  // ----------------------watch相关----------------------------
  /**
   * @description: 计算各球种背景图片todo
   * @return {undefined} undefined
   */
  watch(
    () => state.sportId,
    (res) => {
      
      let img = details.computed_background(String(res));
      if (img) state.background_img = img;
    }
  );
  // 监听玩法集菜单长度变化
  watch(
    () => category_list_length.value,
    (val) => {
      set_cur_match_plays_list();
    }
  );
  // 监听玩法集菜单id变化
  watch(tabs_active_index, (val) => {
    set_cur_match_plays_list();
  });
  // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
  watch(
    () => ms.value,
    (_new, _old) => {
      console.log(11111111111111)
      let arr_ms = [0, 1, 2, 7, 10, 110];
      // 1.赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
      // 2.ms变更时才调用
      if (arr_ms.includes(Number(_new)) && _old) {
        // 更新右侧详情
        init();
      }
    }
  );
  // 监听赛事状态mmp的值
  watch(
    () => mmp.value,
    (_new, _old) => {
      if (_new !== 999 && _old) {
        console.log(11111111111111)
        // 更新右侧详情
        init();
      }
    }
  );

  // ----------------------methods相关----------------------------

  /**
   * 用于初次进入详情页和站点休眠转激活状态时获取以下数据：
   * 赛事比分面板（get_matchInfo()）
   * 玩法投注项数据（get_match_detail()）
   * 玩法集tab数据（get_category_list()）并且根据当前玩法集状态`change_mid`重新设置玩法集 tab 激活状态
   *
   */
  const init = (param = { is_ws: false }) => {
    
    let { mid, is_ws } = param;
    clearTimeout(state.get_match_details_timer);
    if (mid && mid != -1) {
      state.mid = mid;
    }
    // 对阵比分数据
     get_matchInfo();
    // 获取玩法集
    get_category_list(() => {
      // 设置选中玩法集
      //set_cur_match_plays_list();
      if (param.is_refresh) {
        //   this.get_mattch_details({id: this.mcid, round: this.currentRound});
        // 玩法投注项列表;
        get_match_detail();
      } else {
        // 玩法投注项列表;
        get_match_detail({ is_ws, is_init: true });
      }
    });
  };

  /**
   * @description 返回上一页
   */
  const back_to = (is_back = true) => {
    // 重新请求相应接口
    if (play_media.value.media_type === "topic") {
      video.send_message({
        cmd: "record_play_info",
        val: {
          record_play_time: true,
        },
      });
    }

    clearTimeout(state.back_to_timer);
    state.back_to_timer = setTimeout(() => {
      // 退出页面时清空用户操作状态
      window.sessionStorage.setItem("handle_state", JSON.stringify([]));
      // 如果是从搜索结果进来的
      if (route.query.keyword) {
        search.set_back_keyword({
          keyword: route.query.keyword,
          csid: route.params.csid,
        });
        store.dispatch({
          type: "SET_SEARCH_STATUS",
          data: true,
        });
      }
      let { from_path, from } = cur_menu_type.value;
      from_path = from_path || "/home";
      if (from == "video") {
        from_path = "/home";
      }
      // 告知列表是详情返回：用于是否重新自动拉右侧内容
      store.dispatch({
        type: "SET_IS_BACK_BTN_CLICK",
        data: is_back,
      });
      router.push(from_path);
      if (from_path.includes("search")) {
        store.dispatch({
          type: "set_unfold_multi_column",
          data: false,
        });
      }
    }, 50);
  };

  const { mx_autoset_active_match } = useGetGlobal({ details_params, back_to });
  /**
   * @description 赛事详情比分板数据
   * @param {string} mid 赛事id
   * @param {string} cuid 用户id
   */
  const get_matchInfo = () => {
    
    let params = { mid: state.mid, cuid: state.get_uid };
    let api_ = null;
    // 判断是电竞还是其他赛种，区分接口
    if (is_eports_csid(state.sportId)) {
      api_ = api_details.get_match_detail_ESMatchInfo;
    } else {
      api_ = api_details.get_match_detail_MatchInfo;
    }
    console.log(api_,'api_');
    let send_request = () => {
      state.is_request = true;
      api_(params)
        .then((res) => {
          
          state.is_request = false;
          // 通知列表右侧详情，获取近期关注数据
          useMittEmit(MITT_TYPES.EMIT_GET_HISTORY);
          // useMittEmit("get_history");
          const code = lodash.get(res, "data.code");
          const data = lodash.cloneDeep(lodash.get(res, "data.data"));
          console.log(res,'data');
          if (code == "0400500" || !data || Object.keys(data).length == 0) {
            // 自动切换赛事
            emit_autoset_match(0);
            return;
          }
          const timestap = lodash.get(res, "data.ts");
          if (code === 200 && Object.keys(data).length) {
            // 接口拉取成功，错误次数清 0
            state.countMatchDetailErr = 0;
            state.load_data_state = "data";
            // mmp(比赛阶段)状态修正,
            const mmp_list = [
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
            ];
            if (mmp_list.includes(data.csid)) {
              if (data.ms != 0 && data.mmp == "0") {
                Object.assign(data, {
                  mmp: "8",
                  mct: 1,
                });
              }
            }
            // ms=赛事状态 0未开赛，1 进行中 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断	全量拉取数据
            if ([3, 4, 5, 6, 8, 9].includes(data.ms)) {
              // 赛事移除时右侧赛事自动切换
              useMittEmit(MITT_TYPES.EMIT_GET_HISTORY, data.mid);
              // 通知列表右侧详情，获取近期关注数据
              // 自动判断是否需要切换右侧赛事数据
              mx_autoset_active_match({ mid: data.mid });
            }
            /**
             * @description 格式化msc(比分)数据
             * msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
             */
            data.msc = details.build_msc(data);
            // 设置赛事信息
            console.log(data,'data.msc ');
            MatchDataWarehouseInstance.value.set_list_from_match_details(data )  
            // state.match_infoData = MatchDataWarehouseInstance.value.quick_query_obj.mid_obj;
            state.match_infoData = MatchDataWarehouseInstance.value.quick_query_obj.mid_obj[state.mid+'_'];
            console.log(state.match_infoData,'match_infoData');
          } else {
            // 处理报错，置换替补数据
            countMatchDetail();
          }
        })
        .catch((err) => {
          state.is_request = false;
          // 设置错误信息
          store.dispatch({
            type: "globalReducer/SET_ERROR_DATA",
            data: {
              site: "details--get_matchInfo",
              error: err,
            },
          });
          countMatchDetail();
        });
    };
    const match_details_debounce_cache = axios_debounce_cache.get_match_details;
    if (
      match_details_debounce_cache &&
      match_details_debounce_cache["ENABLED"]
    ) {
      let info = match_details_debounce_cache.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        send_request();
      } else {
        // 记录timer
        // this.current_hash_code = 0;
        clearTimeout(state.axios_debounce_timer);
        state.axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          send_request();
          // this.current_hash_code = 0;
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      send_request();
    }
  };

  /**
   * @description 玩法投注项
   * @param {is_ws} 是否是 ws
   * @param {is_init} 是否需要走初始流程，如第一次进入
   */
  const get_match_detail = ({ is_ws = false, is_init = false } = {}) => {
    let params = {
      // mcid: this.mcid, //玩法集id
      mcid: "0", //玩法集id
      mid: state.mid, //赛事id
      cuid: uuid, //用户id
      newUser: 0,
    };
    let api_ = null;
    // 判断是电竞还是其他赛种玩法
    if (is_eports_csid(state.sportId)) {
      // 动态配置玩法集单局玩法的请求字段
      Object.assign(params, { round: state.currentRound });
      // 电竞赛事详情页玩法投注项
      api_ = api_details.get_match_odds_info_ES;
    } else {
      // 常规赛事详情页玩法投注项
      api_ = api_details.get_match_odds_info;
    }
    state.send_gcuuid = params.gcuuid = uid();
    let obj_ = {
      // axios api对象
      axios_api: api_,
      // axios api对象参数
      params: params,
      // 轮询次数
      max_loop: is_init ? 3 : 1,
      // axios中then回调方法
      fun_then: (res) => {
        set_details_loading_time_record("ok");
        // 检查gcuuid
        if (state.send_gcuuid != res.config.gcuuid) return;
        // 玩法列表数据处理
        get_match_details(res);
      },
      // axios中catch回调方法
      fun_catch: (err) => {
        set_details_loading_time_record("err");
        if (err === "api_cancel") {
          return;
        }

        if (!is_init) {
          // 若当前玩法接口请求错误，则回退到存在盘口信息的玩法
          if (
            detail_header.value["handicap_tabs_bar"].value &&
            detail_header.value["handicap_tabs_bar"].value.tab.value
          ) {
            const { index, item } = state.last_tab_data || {};
            // this.$refs['handicap-tabs-bar'].$refs['tab'].onclick(index, item)
            detail_header.value["handicap_tabs_bar"].value.currentIndex = index;

            const tabs_active_data_cache =
              get_details_data_cache.value[`${this.mid}-${item.id}`];
            if (tabs_active_data_cache) {
              // 处理当前玩法集数据
              handle_match_details_data(tabs_active_data_cache, Date.now());
            } else {
              MatchDataWarehouseInstance.value.init_plays_data([]);
              state.match_details = [];
              set_handicap_state("empty");
            }
          }
        } else if (!is_ws) {
          err_tips(err);
        }
      },
    };
    axios_loop(obj_);
  };

  /**
   * @description 玩法列表数据处理--电竞和其他赛事通用
   */
  const get_match_details = (res) => {
    state.err_time = 0;
    state.match_details = [];
    state.data_loaded = true;
    const code = lodash.get(res, "data.code");
    if (code == "0400500") {
      emit_autoset_match(0);
      return;
    }
    let data = lodash.get(res, "data.data");
    let timestap = lodash.get(res, "data.ts");
    if (code === 200 && data.length && state.match_infoData.mhs != 2) {
      data.forEach((item) => {
        // 筛选--删掉已经关盘的投注项
        item = format_plays(item);
        item.tipstatus = false;
        if (lodash.isArray(item.hl)) {
          item.hl.forEach((hls_array) => {
            if (lodash.isArray(hls_array.ol)) {
              hls_array.ol.forEach((ol_item) => {
                ol_item.csid = state.sportId;
              });
            }
          });
        }
      });

      //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
      let obj = [];
      // 设置玩法个数
      store.dispatch({
        type: "SET_MATCH_DETAIL_COUNT",
        data: data.length,
      });
      // 置顶数据排序
      let arr = []; //暂存本地置顶的数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].hton != "0") {
          // 保存置顶玩法的 id
          store.dispatch({
            type: "SET_TOP_ID",
            data: {
              id: data[i].topKey,
              type: true,
            },
          });
        } else {
          if (get_top_id.value.includes(data[i].topKey)) {
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
      // 电竞的数据不用 format_sort_data() 做排序处理
      let flag = data && is_eports_csid(state.sportId);

      data.forEach((item, index) => {
        if (flag) {
          obj.push(item);
        } else {
          obj.push(format_sort_data(item));
        }
        item.initIndex = index;
        item.index = index;
      });
      // 当前玩法集下数据缓存
      const details_data_cache = {
        [`${state.mid}-${state.mcid}`]: data,
      };
      // 清除玩法集下缓存数据
      store.dispatch({
        type: "SET_DETAILS_DATA_CACHE",
        data: details_data_cache,
      });

      // 处理当前玩法集数据
      handle_match_details_data(data, timestap);
      /** 设置语言变化 */
      store.dispatch({
        type: "SET_DETAILS_DATA_CACHE",
        data: false,
      });
    } else {
      const tabs_active_data_cache =
        get_details_data_cache.value[`${state.mid}-${tabs_active_index.value}`];

      if (tabs_active_data_cache) {
        // 处理当前玩法集数据
        handle_match_details_data(tabs_active_data_cache, timestap);
      } else {
        MatchDataWarehouseInstance.value.init_plays_data([]);
        state.match_details = [];
        set_handicap_state("empty");
      }
    }

    // 将当前玩法盘口信息记为上次玩法数据
    const last_tab_data_index =
      detail_header.value["handicap_tabs_bar"].value.currentIndex || 0;
    state.last_tab_data = {
      index: last_tab_data_index,
      item: state.category_list[last_tab_data_index],
    };
  };

  /**
   * @Description 设置盘口状态
   * @param {undefined} undefined
   */
  const set_handicap_state = (state) => {
    if (state == "empty") {
      state = state.mcid == 0 ? "all_empty" : "new_empty";
    }
    state.handicap_state = state;
  };
  /**
   * @description: 弹出报错提示
   * @param {}
   * @return {}
   */
  const err_tips = (err) => {
    state.match_details = [];
    store.dispatch({
      type: "SET_ERROR_DATA",
      data: {
        site: "details--get_match_detail",
        error: err,
      },
    });
    if (
      lodash.isPlainObject(err) ||
      lodash.get(err, "response.status") == 404
    ) {
      state.handicap_state = "404";
    } else {
      state.handicap_state = "refresh";
    }
  };

  /**
   * 计算进入详情的加载时间
   */
  const set_details_loading_time_record = (status) => {
    if (
      lodash.get(window, "BUILDIN_CONFIG.DOM_ID_SHOW") &&
      lodash.get(state.details_loading_time_record, "[0].start_time") &&
      lodash.get(state.details_loading_time_record, "[0].mid") == state.mid
    ) {
      let end_time = new Date().getTime();
      state.details_loading_time_record[0].duration =
        end_time - state.details_loading_time_record[0].start_time;
      state.details_loading_time_record[0].end_time = end_time;
      state.details_loading_time_record[0].end = formatTime(
        new Date(end_time),
        "yyyy-MM-dd hh:mm:ss"
      );

      state.details_loading_time_record[0].status = status;
      state.details_loading_time_record[0].mid = state.mid;
      sessionStorage.setItem(
        "details_loading_time_record",
        JSON.stringify(state.details_loading_time_record)
      );
      state.details_loading_time_record = null;
    }
  };

  /**
   * @description: 详情比分面板接口报错处理
   * @param {*}
   * @return {*}
   */
  const countMatchDetail = () => {
    state.countMatchDetailErr += 1;
    // 如果接口一直报错，最多拉取5次
    if (state.countMatchDetailErr > 0 && state.countMatchDetailErr < 5) {
      // 延迟3秒 再次调详情接口
      state.get_match_details_timer = setTimeout(() => {
        get_matchInfo();
      }, 3000);
    }
  };

  /**
   * @description 玩法集
   * @param {function} callback 判断是否调玩法列表接口
   */
  const get_category_list = (callback) => {
    //sportId 球类id、mid 赛事id
    let params = { sportId: route.params.csid, mid: route.params.mid };

    const _obj = {
      axios_api: api_details.get_category_list,
      error_codes: ["0401038"],
      params: params,
      fun_then: (res) => {
        if (!MatchDataWarehouseInstance.value) {
          return;
        }
        const code = lodash.get(res, "data.code");
        if (code == "0400500") {
          emit_autoset_match(0);
          return;
        }
        const data = lodash.get(res, "data.data");
        if (code === 200 && data.length) {
          state.category_list = data;
          state.handicap_this['category_list'] = data
          // 初始化玩法列表
          MatchDataWarehouseInstance.value.init_play_menu_list(data);
          if (callback) {
            callback();
          }
        } else {
          state.load_data_state = "empty";
        }
      },
      fun_catch: (err) => {
        // 连续3次请求无响应则返回列表页
        back_to();
      },
    };

    axios_loop(_obj);
  };

  /**
   * 自动切换赛事
   */
  const emit_autoset_match = (mid) => {
    if (state.autoset_mid !== mid) {
      // 设置赛事详情选中赛事
      mx_autoset_active_match({ mid });
      state.autoset_mid = mid;
      state.mid = details_params.value.mid;
    }
  };
  /**
   * @description: 设置选中玩法集 （mcid,plays_list）
   */
  const set_cur_match_plays_list = () => {
    // 获取当前玩法集里第一个子项的
    let { id: mcid, round } = lodash.get(state.category_list, "0", {});
    // 不是首次，如果玩法数据里有选中项的话，设置为当前选中项id
    if (
      lodash.some(
        state.category_list,
        (item) => item.id === tabs_active_index.value
      ) &&
      !state.change_mid
    ) {
      mcid = tabs_active_index.value;
    }
    // 首次进入详情页，默认用玩法集第一个 round 参数
    if (state.change_mid) {
      state.currentRound = round;
    }
    state.mcid = mcid;
    // 获取玩法集里面的玩法集合 plays
    let { plays = [] } = lodash.find(
      state.category_list,
      (item) => item.id === state.mcid,
      { plays: [] }
    ) || { plays: [] };
    state.plays_list = plays;
    // 保存当前选中的玩法集子项id
    store.dispatch({
      type: "SET_TABS_ACTIVE_ID",
      data: state.mcid,
    });
    // 保存当前选中的玩法集子项玩法集合
    store.dispatch({
      type: "SET_TABS_ACTIVE_PLAYS",
      data: state.plays_list,
    });
    state.change_mid = false;
  };

  /**
   * @description 处理当前玩法集数据
   * @param {Array} data 当前玩法集下数据
   * @param {Number} timestap 时间戳
   */
  const handle_match_details_data = (data, timestap) => {
    // 初始化赛事控制类玩法数据
    MatchDataWarehouseInstance.value.init_plays_data(data);
    match_details_data_set(MatchDataWarehouseInstance.value.list);
    state.handicap_state = "data";
    // 同步投注项
    if (!get_lang_change.value) {
      if (
        is_eports_csid(route.params.csid) ||
        menu_config.is_virtual_sport()
      ) {
        this.virtual_common.upd_bet_obj( timestap, this.mid); //TODO
      } else {
        BetCommonHelper.upd_bet_obj( timestap, this.mid); //TODO
      }
    }
  };
  /**
   * 玩法列表渲染
   */
  const match_details_data_set = (list) => {
    let match_details_arr = list;
    // 用户折叠/展开了的玩法
    let handle_state = window.sessionStorage.getItem("handle_state") || "";
    handle_state = handle_state && JSON.parse(handle_state);
    let infoArr = [];
    if (handle_state.length) {
      // 如果本地存有用户折叠或展开的玩法，优先使用用户操作后的状态
      match_details_arr.forEach((item, i) => {
        handle_state.forEach((item1) => {
          if (item1.id == item.topKey) {
            item.hshow = item1.hshow == "Yes" ? "No" : "Yes";
            item.is_show = item1.hshow != "Yes";
          }
        });
        infoArr.push(item);
      });
      state.match_details = infoArr;
    } else {
      state.match_details = match_details_arr;
    }
  };
  /**
   * 传递玩法列表的数据给到玩法集
   */
  const set_handicap_this = (_this) => {
    state.handicap_this = _this;
  };

  /**
   * @description 返回顶部
   * @return {Undefined} Undefined
   */
  const on_go_top = () => {
    useMittEmit(MITT_TYPES.EMIT_SET_SCROLL_POSITION, [0, 0]);
  };

  /**
   * 初始化进入详情的加载时间
   */
  const init_details_loading_time_record = () => {
    let start_time = new Date().getTime();
    state.details_loading_time_record = [
      {
        duration: "",
        start: formatTime(new Date(start_time), "yyyy-MM-dd hh:mm:ss"),
        end: "",
        start_time: start_time,
        end_time: 0,
        mid: state.mid,
      },
    ];
  };
  /**
   * @description: 检查玩法关盘
   * @return {undefined} undefined
   */
  const check_plays_show = () => {
    this.match_details.forEach((item) => {
      item = format_plays(item);
    });
  };
  const emit_site_tab_active = () => {
    let { mid = null } = route.params;
    mid = mid || details_params.value.mid;
    init({ mid });
  };
  /**
   * @description: 隐藏其他tips
   * @param {}
   * @return {}
   */
  const close_tips = (hpid) => {
    state.match_details.forEach((item) => {
      item.tipstatus = item.hpid == hpid;
    });
  };
  /**
   * @description 获取loading状态
   */
  const getLoading = (status) => {
    console.log(11111111111111, status);
    state.load_detail_statu = status;
  };
  /**
   * @description 获取头部高度
   */
  const getHeaderHeight = (height) => {
    state.headerHeight = height || 0;
  };
  /**
   * @description 设置背景图
   */
  const setBg = (img) => {
    state.background_img = img;
  };
  /**
   * @description 子组件玩法切换
   * @param {string} id 玩法集id
   * @param round 电竞赛事需要的动态玩法集局数 id
   * 获取具体的玩法集数据
   */
  const get_mattch_details = ({ id, round, plays }) => {
    state.mcid = id;
    state.currentRound = round;
    state.plays_list = plays || [];
    //   this.get_match_detail();
  };

  /**
   * 详情页手动切换玩法时展示 loading 状态
   * @param n 要展示的 loading 状态
   */
  const change_loading_state = (n) => {
    state.handicap_state = n;
    state.match_details = [];
  };

  onMounted(() => {
    // 加载视频动画资源
    pre_load_video.load_video_resources();
    // 从链接上获取赛事id 赛种 id 联赛id
    // 3531410/1110402/1
    // if (Object.keys(route.params).length) {
    //   let { mid, csid: sportId, tid } = route.params;
    // path: "/details/:mid/:tid/:csid",
    
      state.mid = 3531410; // 赛事id
      state.sportId = 1; // 赛种 id
      // 电竞不用切右侧
      if (!is_eports_csid(1)) {
        // 设置赛事详情的请求参数
        // store.dispatch("SET_MATCH_DETAILS_PARAMS", { mid, sportId, tid });
      }
      // 初始化详情页数据
      // this.init = lodash.debounce(this.init, 2000, { leading: true });
      init();
      // 添加近期访问
      // add_visit_history();
    // }

    // 初始化进入详情的加载时间
    init_details_loading_time_record();
    // 自动选择赛事
    useMittOn(MITT_TYPES.EMIT_AUTOSET_MATCH, emit_autoset_match);

    // 检查玩法关盘
    useMittOn(MITT_TYPES.EMIT_CHECK_PLAYS_SHOW, check_plays_show);

    // 站点 tab 休眠状态转激活
    useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active);

    // 隐藏tips
    useMittOn(MITT_TYPES.EMIT_SET_CLOSE_TIPS, close_tips);
    // 接受 loading 状态
    useMittOn(MITT_TYPES.EMIT_CHANGE_LOADING_STATUS_DETAILS, getLoading);
    // 获取详情页头部高度
    useMittOn(MITT_TYPES.EMIT_GET_DETAILS_HEIGHT_MAIN, getHeaderHeight);

    // 刷新按钮节流
    // this.refresh = this.throttle(this.refresh, 1000, {
    //   leading: true,
    //   trailing: false,
    // });
    // 返回背景图
    useMittOn(MITT_TYPES.EMIT_GET_BACKGROUND_IMG, setBg);
  });

  onUnmounted(() => {
    un_subscribe();
    clearTimeout(state.axios_debounce_timer);
    clearTimeout(state.get_match_details_timer);
    clearTimeout(state.back_to_timer);
    useMittOn(MITT_TYPES.EMIT_AUTOSET_MATCH, emit_autoset_match).off;
    useMittOn(MITT_TYPES.EMIT_CHECK_PLAYS_SHOW, check_plays_show).off;
    useMittOn(MITT_TYPES.EMIT_SET_CLOSE_TIPS, close_tips).off;
    useMittOn(MITT_TYPES.EMIT_CHANGE_LOADING_STATUS_DETAILS, getLoading).off;
    useMittOn(MITT_TYPES.EMIT_GET_DETAILS_HEIGHT_MAIN, getHeaderHeight).off;
    useMittOn(MITT_TYPES.EMIT_GET_BACKGROUND_IMG, setBg).off;
    // this.debounce_throttle_cancel(this.init);
    // this.debounce_throttle_cancel(this.refresh);
    // for (const key in this.ol_obj) {
    //   this.ol_obj[key] = null;
    // }

    // for (const key in this.hl_obj) {
    //   this.hl_obj[key] = null;
    // }

    //玩法列表单双列切换为单列
    store.dispatch({
      type: "SET_LAYOUT_STATU",
      data: 0,
    });
    // 清除玩法集下缓存数据
    store.dispatch({
      type: "SET_DETAILS_DATA_CACHE",
      data: {},
    });

    // 清空选中的玩法集id
    store.dispatch({
      type: "SET_TABS_ACTIVE_ID",
      data: "",
    });
    // 清空选中的玩法集id对应的盘口玩法
    store.dispatch({
      type: "SET_TABS_ACTIVE_PLAYS",
      data: [],
    });

    // 站点 tab 休眠状态转激活
    useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active).off;

    // 销毁前清空数据
    MatchDataWarehouseInstance.value.destroy();
    state.match_infoData = null;
    state.category_list = null;
    state.match_details = null;
    state.active_detials = null;
  });
  return {
    ...toRefs(state),
    detail_header,
    cur_expand_layout,
    init,
    back_to,
    set_handicap_this,
    on_go_top,
    set_handicap_state,
    get_mattch_details,
    change_loading_state,
  };
};
