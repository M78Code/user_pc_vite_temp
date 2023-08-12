import { reactive, toRefs, onUnmounted } from "vue";
import { is_eports_csid } from "src/core/utils/utils";
// api文件
import { api_details } from "src/api/index";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { useGetGlobal } from "./global_mixin";
import lodash from "lodash";
import details from "src/core/match-detail/match-detail";
// 搜索操作相关控制类
import search from "src/core/search-class/search.js";
import store from "src/store-redux/index.js";
export const useGetConfig = () => {
  const { mx_autoset_active_match } = useGetGlobal({ details_params, back_to });
  const store_state = store.getState();
  const state = reactive({
    // 菜单数据
    menu_data: $menu.menu_data,
    match_info_ctr: new MatchInfoCtr(this),
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
  });

  const details_params = ref(store_state.matchesReducer.params);
  // 获取当前菜单类型
  const cur_menu_type = ref(store_state.menusReducer.cur_menu_type);

  // 监听状态变化
  let un_subscribe = store.subscribe(() => {
    state = store.getState();
    details_params.value = state.matchesReduce.params;
    cur_menu_type.value = state.menusReducer.cur_menu_type;
  });

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
    this.get_category_list(() => {
      // 设置选中玩法集
      this.set_cur_match_plays_list();
      if (param.is_refresh) {
        //   this.get_mattch_details({id: this.mcid, round: this.currentRound});
        // 玩法投注项列表;
        this.get_match_detail();
      } else {
        // 玩法投注项列表;
        this.get_match_detail({ is_ws, is_init: true });
      }
    });
  };
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
    let send_request = () => {
      state.is_request = true;
      api_(params)
        .then((res) => {
          state.is_request = false;
          // 通知列表右侧详情，获取近期关注数据
          useMittEmit(MITT_TYPES.EMIT_GET_HISTORY);
          // this.$root.$emit("get_history");
          const code = lodash.get(res, "data.code");
          const data = lodash.cloneDeep(lodash.get(res, "data.data"));
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
            data.msc = this.build_msc(data);
            // 设置赛事信息
            this.match_info_ctr.init_match_obj(data, timestap);
            this.match_infoData = this.match_info_ctr.match_obj;
          } else {
            // 处理报错，置换替补数据
            this.countMatchDetail();
          }
        })
        .catch((err) => {
          this.is_request = false;
          // 设置错误信息
          this.set_error_data({
            site: "details--get_matchInfo",
            error: err,
          });
          this.countMatchDetail();
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
        this.current_hash_code = 0;
        clearTimeout(this.axios_debounce_timer);
        this.axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          send_request();
          this.current_hash_code = 0;
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      send_request();
    }
  };

   /**
     * @description 玩法集
     * @param {function} callback 判断是否调玩法列表接口
     */
  const get_category_list=(callback)=> {
    //sportId 球类id、mid 赛事id
    let params = { sportId: this.sportId, mid: this.$route.params.mid };
    
    const _obj = {
      axios_api: api_details.get_category_list,
      error_codes:['0401038'],
      params: params,
      fun_then: res => {
        if(!this.match_info_ctr){
          return
        }
        const code = _.get(res, "data.code");
        if(code == '0400500'){
          this.emit_autoset_match(0);
          return;
        }
        const data = _.get(res, "data.data");
        if (code === 200 && data.length) {
          this.category_list = data;
          // 初始化玩法列表
          this.match_info_ctr.init_play_menu_list(data);
          if (callback) {
            callback();
          }
        }else{
          this.load_data_state = "empty";
        }
      },
      fun_catch: err => {
        // 连续3次请求无响应则返回列表页
        this.back_to();
      }
    }

    this.$utils.axios_api_loop(_obj);
  }

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
   * @description 返回上一页
   */
  const back_to = (is_back = true) => {
    // 重新请求相应接口
    if (this.vx_play_media.media_type === "topic") {
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
      if (useRoute.query.keyword) {
        search.set_back_keyword({
          keyword: useRoute.query.keyword,
          csid: useRoute.params.csid,
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
      useRouter.push(from_path);
      if (from_path.includes("search")) {
        store.dispatch({
          type: "set_unfold_multi_column",
          data: false,
        });
      }
    }, 50);
  };

  //   computed: {    //TODO

  //     ...mapGetters({
  //       vx_get_user: "get_user",
  //       // 获取右侧布局类型
  //       vx_cur_expand_layout: "get_cur_expand_layout",
  //       // 赛事详情请求参数
  //       vx_details_params: "get_match_details_params",
  //       // 获取 uid
  //       get_uid: "get_uid",
  //       // 获取当前菜单类型
  //       vx_cur_menu_type: "get_cur_menu_type",
  //       // 获取当前页面从哪个页面跳转来的
  //       get_layout_cur_page: "get_layout_cur_page",
  //       // 获取置顶的玩法id
  //       get_top_id: "get_top_id",
  //       // 当前所选的玩法集子项id
  //       get_tabs_active_id: "get_tabs_active_id",
  //       // 当前所选的玩法集子项id对应的盘口玩法
  //       get_tabs_active_plays: "get_tabs_active_plays",
  //       // 详情比分板备用数据
  //       get_active_detail: "get_active_detail",
  //       vx_get_lang_change: "get_lang_change",
  //       // 玩法集对应玩法缓存数据
  //       get_details_data_cache: "get_details_data_cache",
  //       // 聊天室id
  //       get_chatroom_id: "get_chatroom_id",
  //       // 获取右侧赛事详情视频信息
  //       vx_play_media: "get_play_media",
  //     }),
  //     // 是否为电竞
  //     is_esports() {
  //       return this.$utils.is_eports_csid(this.$route.params.csid)
  //     },
  //     // 获取玩法集菜单长度
  //     category_list_length(){
  //       return _.get(this.category_list,'length',0);
  //     }
  //   },
  onUnmounted(() => {
    un_subscribe();
  });
  return {
    ...toRefs(state),
    init,
    back_to,
  };
};
