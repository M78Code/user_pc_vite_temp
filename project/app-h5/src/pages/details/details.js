import { api_common, api_analysis } from "src/api/index.js";  // API 公共入口
import { useRouter, useRoute } from "vue-router";
import axios_debounce_cache from "src/core/http/debounce-module/index.js";
// import { Level_one_category_list, Level_one_detail_data } from "./category-list.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, nextTick, ref, onBeforeMount } from "vue";
import {SessionStorage,
   MatchDataWarehouse_H5_Detail_Common,
   MatchDetailCalss, LOCAL_PROJECT_FILE_PREFIX,
   MenuData,
   MatchDataWarehouse_H5_List_Common,
   GlobalAccessConfig,
   useMittOn, useMittEmit,
   useMittEmitterGenerator,
   MITT_TYPES,
   UserCtr,
   SearchData,
   axios_loop as axios_api_loop
  } from "src/output/index.js";
  import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import matchDetailClass from "src/core/match-detail/match-detail-class";
export const details_main = () => {
  const router = useRouter();
  const route = useRoute();
  // 详情初始化接口数据处理

  const MatchDataWarehouseInstance = reactive(MatchDataWarehouse_H5_Detail_Common)
  // console.log("Store", store)
  // const state = store.getState()
  // 球类id
  const  MatchDataBaseH5 = ref(MatchDataWarehouse_H5_List_Common)
  const sport_id = ref(route.params.csid)
  const matchDetailCtr = ref(MatchDetailCalss)
  // 控制视频说明弹窗
  const get_bet_show = ref(false)
  const get_info_show = ref(false)
  let state_data = reactive({
    //切换浏览器页面 获取最新的盘口数据
    refresh: false,
    // 切换赛事时，重置玩法集请求次数计数
    get_category_list_req_count: 0,
    // refs['fixedHeight']
    fixedHeight: null,
    // refs['details_box']
    details_box: null,
    // refs['category']
    category: null,
    // emit 数据集合
    emitters: [],
    // 默认不刷新
    refreshing: false,
    // 固定的状态
    fixed_status: false,
    /** @type {TYPES.MatchDetail} 默认接口数据 */
    detail_data: null,
    // 固定高度
    fixedHeight: "",
    // 赛事列表数据
    math_list_data: [],
    // 数据列表
    data_list: [
      {id: "0",
      marketName: "所有投注",
      orderNo: -2147483648}],
    // 控制详情头部显示
    is_show_detail_header_data: false,
    // 控制下拉列表显示
    is_dialog_details: false,
    // 列表样式
    // a_list_style: false,
    //视频说明是否展示
    tips: false,
    // 默认详情头部高度
    detailsTableHeight: 0,
    // 触点坐标选取
    startY: "",
    // 详情头部高
    scroller_height: 0,
    // 滚动条的距离
    scroller_scroll_top: 0,
    // 玩法集传参赛事id
    params1: null,
    // 是否显示分析页面
    analysis_show: {
      football: false,
      basketball: false,
    },
    // 是否从首页轮播区域跳转到详情
    is_banner_jump: false,
    //加载骨架状态
    skeleton: {
      details: false,
      list: false,
    },
    is_creating: false,
    // 随机数props传参是否显示视频对阵信息，还可以控制动画显示返回按钮
    is_show_text: "",
    // 盘口数据请求次数
    requestCount: 0,
    // 当前tab选项卡
    viewTab: "bet",
    // 控制视频是否展示返回按钮
    show_go_back: false,
    init_event_timer_count: 0,
    timer1_: null,
    timer2_: null,
    get_match_detail_timer: null,
    back_main_list_timer: null,
    axios_debounce_timer: null,
    init_event_timer: null,


    // #TODO vuex
    get_details_chatroom_data: "",
    // 视频url信息
    get_video_url: "get_video_url",
    // "get_bet_list",
    // 当前选中的一级菜单, 二级菜单, 三级菜单对象
    get_current_menu: "get_current_menu",
    // 是否展示视频
    get_show_video: false,

    // 玩法集置顶效果
    get_zhiding_info: "get_zhiding_info",
    // 视频置顶
    // "get_video_zhiding",
    // 玩法tab
    get_details_item: MatchDetailCalss,
    // 登录用户Id
    get_uid: "505915677417900030",
    // 早盘或者串关日期参数
    get_md:MenuData.current_lv_3_menu, // TODO: 待处理
    // 菜单
    get_current_sub_menuid: "get_current_sub_menuid",// TODO: 待处理
    // 排序
    get_sort_type: "get_sort_type",// TODO: 待处理
    // 搜素关键字
    get_search_txt: "get_search_txt",// TODO: 待处理

    // 设置玩法集固定
    get_tab_fix: "get_tab_fix",// TODO: 待处理
    // 赛果标识
    get_menu_type: MenuData.is_esports(),
    // 获取列表页当前选中时间
    get_current_menu: "get_current_menu",// TODO: 待处理
    // 是否从直播进入详情
    get_play_video: "get_play_video",// TODO: 待处理
    // 视频是否全屏
    get_is_full_screen: false,// TODO: 待处理
    // 商户是否需要直接跳到列表页（url地址有label参数）
    get_golistpage: "get_golistpage",// TODO: 待处理
    get_godetailpage: "get_godetailpage",// TODO: 待处理
    get_betbar_show: true,
    /** 是否横屏 */
    get_is_hengping: false,
    get_is_dp_video_full_screen: false,// TODO: 待处理
    get_match_base_info_obj: "get_match_base_info_obj",// TODO: 待处理
    // 'get_analyze_show',
    // 'get_goto_detail_matchid',
    get_access_config: GlobalAccessConfig.config,
    // 聊天室ID
    // 'get_chatroom_id',
    // 获取语言
    get_lang: UserCtr.lang,
    get_event_list: [],
    get_curr_tab_info: "get_curr_tab_info",// TODO: 待处理
  });


  const is_highlights = computed(() => {
    return lodash.get(state_data.get_curr_tab_info, "component") === "highlights";
  });
  // 足篮赛种和后台开关开了才显示显示赛事分析tab
  const show_match_analysis_tab = computed(() => {
    return (
      [1, 2].includes(+sport_id.value) && GlobalAccessConfig.get_statisticsSwitch()
    );
  });
  // 是否显示聊天室tab
  const show_chatroom_tab = computed(() => {
    // 中文，繁体并且聊天室ID不为空才显示聊天室Tab, crs 0关闭1打开
    const { crs } = state_data.get_details_chatroom_data || {};
    const { chatRoomSwitch } = UserCtr.user_info || {};
    return (
      ["zh", "tw"].includes(state_data.get_lang) && crs == 1 && chatRoomSwitch == 1
    );
  });
  // 判断页面滑动的高度 是否显示置顶change-header
  const scroll_visible = computed(() => {
    return state_data.scroller_scroll_top >= rem(1.65);
    // return state_data.scroller_scroll_top >= 100;
  });
  //接口请求是否全部完成
  const skeleton_finish = computed(() => {
    if (state_data.skeleton.details && state_data.skeleton.list) {
      return false;
    } else {
      return true;
    }
  });
  // mid 
  const matchid = computed(() => {
    return state_data.detail_data?.mid || route.params.mid ||  route.query.mid
  });
  // 当前tab
  const curr_active_tab = computed(() => {
    const tab_name = state_data.viewTab.replace("_", "-");
    return `tab-${tab_name}-wrapper`;
  });
  // 重播图标
  const icon_replay = computed(() => {
    const { configValue, eventSwitch } = lodash.get(
      UserCtr,
      "user_info.merchantEventSwitchVO",
      {}
    );
    if (configValue != 1 || eventSwitch != 1 || !state_data.get_event_list.length) {
      return "";
    }


    // 主题后缀
    const suffix_theme = UserCtr.theme.includes("night") ? "2" : "";
    // y0后缀
    const suffix_y0 = UserCtr.theme.includes("_y0") ? "_y0" : "";

    return `img:${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details/replay${suffix_theme}.svg`;
  });

  // 监听数据仓库版本号变更后更新数据
  watch(() => MatchDataWarehouseInstance.data_version.version, () => {
    state_data.detail_data = MatchDataWarehouseInstance.get_quick_mid_obj(matchid.value);
  })

  const change_fullscreen = (value) => {
    state_data.get_is_dp_video_full_screen = value;
  }
  
  // // 刷新页面时获取当前玩法集ID
  onMounted(() => {
    // useMittOn(MITT_TYPES.EMIT_SET_SHOW_VIDEO, full_screen_callback),
    // LocalStorage.get("YUAN_MATCH_DETAIL_DATA")
    MatchDataWarehouseInstance.set_match_details(LocalStorage.get("YUAN_MATCH_DETAIL_DATA"),[])
    state_data.detail_data = MatchDataWarehouseInstance.get_quick_mid_obj(matchid.value);
  })
  /**
   *@description: 点击详情任意地方显示视频对阵信息
   *@param {Undefined}
   *@return {Undefined} undefined
   */
  const details_click = () => {
    // 生成一个随机数
    state_data.is_show_text = Math.random();
    state_data.show_go_back = true;
  };
  /**
   * 子组件触发父组件方法
   */
  const change_go_back = (state) => {
    state_data.show_go_back = state;
  };
  /**
   *@description: 详情页刷新
   *@param {Undefined}
   *@return {Undefined} undefined
   */
  const details_refresh = () => {
    if (state_data.refreshing) return;
    const curr_tab = state_data.viewTab;
    if (curr_tab === "bet") {
      // 刷新 盘口赔率信息
      api_interface();
    } else if (curr_tab === "match_analysis") {
      // 刷新 赛事分析信息
      // #TODO IMIT
      // useMittEmit(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS);
      // useMittEmit(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS)
    } else {
    }

    state_data.refreshing = true;
    if (state_data.timer2_) {
      clearTimeout(state_data.timer2_);
    }
    state_data.timer2_ = setTimeout(() => {
      // 取消刷新 已做节流
      cancel_ref();
    }, 700);
  };
  /**
   * @description: 取消刷新
   * @param {undefined} undefined
   * @returns {undefined} undefined
   */
  const cancel_ref = () => {
    state_data.refreshing = false;
  };
  const api_interface = () => {
    // useMittEmit(MITT_TYPES.EMIT_REF_API)
    get_odds_list()
    // useMittEmit(MITT_TYPES.EMIT_REF_API)
  };
  /**
   *@description 0号模板点击收起的时候，要调整滚动距离
   *@param {Number} val 要调整的距离
   *@return {Undefined} undefined
   */
  const set_details_scroll = (val) => {
    let dom_box = state_data.details_box;
    if (!dom_box) return;
    dom_box.scrollTop = dom_box.scrollTop - val;
  };
  /**
   *@description 骨架屏加载
   *@param {Undefined} undefined
   *@return {Undefined} undefined
   */
  const loading_list = () => {
    state_data.skeleton.list = true;
  };
  /**
   *@description: 足篮显示分析页
   *@param {Boolean} Boolean
   *@return {Undefined} undefined
   */
  const ana_show = (val) => {
    if (val == 1) {
      // 足球
      analysis_show.football = true;
      return;
    } else if (val == 2) {
      // 篮球
      analysis_show.basketball = true;
      return;
    } else {
      Object.getOwnPropertyNames(analysis_show).forEach((key) => {
        analysis_show[key] = false;
      });
    }
  };
  /**
   *@description 切换玩法集时候的动作
   *@param {Undefined} undefined
   *@return {Undefined} undefined
   */
  const tab_changed_handle = () => {
    nextTick(() => {
      let dom_box = state_data.details_box;
      // 视频和动画播放的时候，点击玩法集要重置滚动距离
      if (state_data.get_show_video && state_data.scroller_scroll_top > 0) {
        dom_box.scrollTop = 0;
      }
      // 切换玩法集后滚动至首个玩法名称处
      else if (state_data.scroller_scroll_top > rem(1.65)) {
        dom_box.scrollTop = rem(1.67);
      }
      // 当点开视频或者动画时,设置玩法区域的高度
      if (state_data.get_tab_fix) {
        dom_box.scrollTop = rem(0);
      }
    });
  };

  /**
   *@description 实时获取页面滚动的高度
   *@param {event} event 事件
   *@return {Undefined} undefined
   */
  const detail_scrolling = (event) => {
    state_data.scroller_scroll_top = event.target.scrollTop;

    // 滚动时隐藏罚牌/角球等说明弹窗
    // #TODO IMIT
    //   useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false);
    // useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false)
  };
  /**
   *@description 横屏投注下滚动
   *@param {e} e 事件
   *@return {undefined} undefined
   */
  const full_screen_detail_scrolling = (e) => {
    // 滚动时隐藏罚牌/角球等说明弹窗
    // #TODO IMIT
    //   useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false);
    // useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false)
  };
  /**
   *@description 获取当前手指第一次触摸的高度
   *@param {e} e 事件
   *@return {undefined} undefined
   */
  const start = (e) => {
    state_data.startY = e.targetTouches[0].pageY;
  };
  /**
   * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
   * @param {Number} value 需要转换的值
   * @return {Number}
   */
  const rem = (value) => {
    let font_size = (innerWidth * 100) / 375;
    return Math.ceil(value * font_size);
  };
  /**
   *@description 监听touchmove
   *@param {e} e 事件
   *@return {undefined} undefined
   */
  const moved = (e) => {
    let dom_ = document,
      dom_ele = dom_.documentElement;
    var osTop = dom_ele.scrollTop || dom_.body.scrollTop;
    let px160 = rem(1.6);
    if (
      (!!osTop && osTop + 12 >= px160) ||
      (state_data.startY - e.targetTouches[0].pageY) * 1.55 >= px160
    ) {
      state_data.fixed_status = true;
    } else if (
      state_data.fixedHeight.scrollTop == 0 &&
      (e.targetTouches[0].pageY - state_data.startY) * 1.5 >= px160
    ) {
      state_data.fixed_status = false;
    }
  };
  // 监听reset_set_hton事件(详情页投注项点击置顶),设置详情页玩法集合区域的高度为0
  const scrollMethod = () => {
    let el_dom = state_data.fixedHeight;
    if (el_dom && el_dom.scrollTop != 0) {
      el_dom.scrollTop = 0;
    }
  };
  // 监听is_bool_dialog_details事件，控制是否显示下拉联赛列表
  const change_bool = (bool) => {
    // bool 的值为true或者是false
    state_data.is_dialog_details = bool;
  };


  /** 赛事详情页面接口(/v1/m/matchDetail/getMatchDetail)
   * refresh为刷新页面 切换网页页面触发获取最新盘口信息
   * 
   * @example
   * useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, initEvent),
   * @description
   * 欧洲版改造MITT_TYPES.EMIT_REFRESH_DETAILS事件param传递了赛事信息, 与refresh参数冲突
   * 进行兼容性改动 (refresh=false) => ({refresh = false})
   * @type {MITT.RefreshDetailsCallback}
   */
  const initEvent = (param) => {
    state_data.refresh = param?.refresh || false
    // get_uid为空时循环检测进行拉取逻辑处理
    if (UserCtr.uid || state_data.init_event_timer_count > 30) {
      // 请求接口数据
      get_match_details({
        // 赛事id
        // mid: '33522226000129832', // matchid,
        mid: matchDetailCtr.value.mid || matchid.value,
        // 用户id
        cuid: UserCtr.uid,
        init: 'init'
      });
      state_data.init_event_timer_count = 0;
    } else {
      state_data.init_event_timer_count++;
      clearTimeout(state_data.init_event_timer);
      state_data.init_event_timer = setTimeout(() => {
        initEvent();
      }, 500);
    }
  };
  /**
   * 聊天室接口
   */
  const get_chatroom_info = () => {
    api_common
      .getliveVideoUrl({ mid: matchid.value, device: "H5" })
      .then(({ data }) => {
        if (data) {
          // set_details_chatroom_data(data);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  /**
   * 获取精彩回放事件
   * @param {String} event_code 事件code
   */
  const get_football_replay = (event_code) => {
    if ([sport_id.value, lodash.get(state_data.detail_data, 'csid')].includes('1')) {
      const params = {
        mid: route.params.mid,
        device: 'H5',
        eventCode: event_code
      }
      api_analysis.post_playback_video_url(params)
        .then(res => {
          if (res.code == 200 && lodash.get(res.data, 'eventList.length')) {
            state_data.get_event_list = res.data.eventList
            // 场景1: 头部刷新按钮触发时调接口返回数据存操作类
            matchDetailCtr.value.set_playback_video_list(res.data.eventList)
          }
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
        })
    }
  };
  /**
   * 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
   */
  const get_match_details = (params) => {
    let api =
      state_data.get_menu_type
        ? api_common.get_DJ_matchDetail_MatchInfo
        : api_common.get_matchDetail_MatchInfo;
    api(params)
      .then((res) => {
        let { data: res_data, ts, code } = res
        // #TODO
        
        // 当状态码为0400500, data:null,data:{} 去到列表中的早盘
        if (code == "0400500" || !res_data || Object.keys(res_data).length === 0) {
          router.push({ name: "matchList" });
        } else if (code == 200) {
          if (res_data && Object.keys(res_data).length) {
            match_detail_data_handle(res_data)
            // 数据传入数据仓库
            //lodash.get(MatchDataWarehouseInstance.get_quick_mid_obj(matchid.value),"odds_info",[]) 防止oddinfo接口先获取到数据（matchdetail接口限频导致可能会失败）
            MatchDataWarehouseInstance.set_match_details(res_data,lodash.get(MatchDataWarehouseInstance.get_quick_mid_obj(matchid.value),"odds_info",[]))
            //如果是切换tab页
            //切换tab页 应该不需要重新get_match_detials吧?
            if (state_data.refresh) {
              //获取玩法集 mitt触发盘口回调oddinfo接口 保证执行顺序
              get_odds_list({ sportId: sport_id.value, mid: matchDetailCtr.value.mid || matchid.value }, ()=>{useMittEmit(MITT_TYPES.EMIT_REF_API, (true))})
             
            }
            // 球种ID
            sport_id.value = res_data.csid
            if (params.init) { get_football_replay(0) }
          } else {
            // 赛事下发999后, 显示空空如也
            state_data.skeleton.details = true
            state_data.skeleton.list = true
            state_data.is_show_detail_header_data = false

            // 赛事结束后，1.5s后返回主列表页面——bug35360
            clearTimeout(state_data.back_main_list_timer)
            state_data.back_main_list_timer = setTimeout(() => {
              // 如果不是演播厅的，才有退出回到 列表
              if (lodash.get(state_data.get_video_url, 'active') != 'lvs') {
                // $common.go_where({back_to: 'go_to_back'})
              
              }
            }, 1500)
          }
        }else{
          router.go("-1");
        }
      })
      .catch((err) => {
        console.error(err);
        state_data.requestCount++;
        // 兜底处理，若连续5次拉取接口数据失败，则从仓库取基本数据
        // 间隔3s拉取（服务端节流限制）
        if (state_data.requestCount < 5) {
          clearTimeout(state_data.get_match_detail_timer);
          state_data.get_match_detail_timer = setTimeout(() => {
            initEvent();
          }, 3000);
        } else {
          const match_base_info_obj = lodash.cloneDeep(state_data.get_match_base_info_obj);
          match_detail_data_handle(match_base_info_obj);
        }
      });
  };
  // 当前赛事数据后续处理
  const match_detail_data_handle = (res_data) => {
    if (state_data.skeleton) {
      state_data.skeleton.details = true;
      state_data.skeleton.list = true;
      if (!res_data || Object.keys(res_data).length <= 0) {
        router.replace({ name: "category", params: { mid: matchid.value } });
        return false;
      }

      state_data.requestCount = 0;
      state_data.is_show_detail_header_data = true;

      // #TODO 暂时使用假数据
      // state_data.detail_data = Level_one_detail_data();
      if(!getMatchListCache()){
        state_data.math_list_data = [res_data];
      }
      // updateHotReqTime(Date.now())

      // 克隆一份;
      let cloneData = lodash.cloneDeep(res_data);
      // set_detail_data(cloneData);
      // store.dispatch({ type: 'detailsReducer/set_detail_data',  payload: cloneData })

      state_data.detail_data = cloneData;
      // 设置赛事盘口状态 赛事关盘状态  0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
      // let params1 = { sportId: res_data.csid, mid: matchid.value };
      // params1 = params1; // get_odds_list
      // 关联联赛下的赛事项查询,是否存在
      // params1 && get_odds_list(params1, "init_req");
      // sendSocketInitCmd();
    }
  };
  function getMatchListCache(){
    let sessiong_store = sessionStorage.getItem("match_list_ofdetails");
    if (sessiong_store) {
      let store_data = JSON.parse(sessiong_store);
      if (store_data.tId == lodash.get(state_data,"detail_data.tid")) {
        state_data.math_list_data = store_data.list;
        return store_data.list
      }
    }
  }
  /**
   * 联赛下拉选择组件展开时的联赛列表获取
   */
  const get_match_list = async (params) => {
    let sessiong_store = sessionStorage.getItem("match_list_ofdetails");
    if (sessiong_store) {
      let store_data = JSON.parse(sessiong_store);
      if (store_data.tId == params.tId) {
        state_data.math_list_data = store_data.list;
      }
    }
    if (state_data.get_menu_type) {
      Object.assign(params, { isESport: 1 });
    }
    /**
     *@description 详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
     *@param {obj}
     *@return {obj}
     */
    api_common
      .get_matchDetail_getMatchDetailByTournamentId(params)
      .then(({ data }) => {
        if (!data || data.length == 0) {
          // set_toast({
          // #TODO IMIT
          // txt: i18n_t("bet_record.bet_match_tishi"),
          // });

          sessionStorage.setItem("match_list_ofdetails", "");
          /* 这不对吧, 怎么想都不对吧
          data.math_list_data = [];
          */
         state_data.math_list_data = [];
          // // 设置详情下拉三角是否显示
          // set_sanjiao_is_bool(false);
        } else {
          let store_data = {
            // tid:联赛id
            tId: params.tId,
            list: data,
          };
          // 将store_data对象转换为 JSON 字符串
          let sessiong_store = JSON.stringify(store_data);
          // 将sessiong_store的值存在sessionStorage里面
          sessionStorage.setItem("match_list_ofdetails", sessiong_store);
          state_data.math_list_data = data;
          // // 设置详情下拉三角是否显示
          // set_sanjiao_is_bool(true);
        }
      });
  };
  /**
   *@description 获取详情页面玩法集接口(/v1/m/category/getCategoryList)
   *@param {obj} params 请求参数
   *@return {obj} init_req 是否是初次进入详情
   */
  const get_odds_list =  (
    params = { sportId: sport_id.value, mid: matchDetailCtr.value.mid || matchid.value }, callback=null) => {
    // state_data.data_list = Level_one_category_list();
    const get_details_category_list = () => {
         //接口调用
      let obj_ = {
        // axios api对象
        axios_api:api_common.get_category_list,
        // axios api对象参数
        params: params,
        // 唯一key值
        key: "getCategoryList",
        error_codes: ["0401038"],
        // axios中then回调方法
        fun_then: (res) => {
          const res_data = lodash.get(res, "data",[]);
          if (res.code=='0401038') {  //限频
            return  setTimeout(() => {
              get_odds_list()
            }, 800);
          }
          callback && callback()
          state_data.data_list = res_data;
          // set_details_tabs_list(res_data);
          matchDetailCtr.value.compute_category_refer(res_data)
          // 当玩法集存在激活得项，循环找到对用得id，找得到就不管，找不到就赋值为玩法集第一项
          if (state_data.get_details_item && res_data?.length) {
            const set_details_item_flag = res_data.some(
              (item) => item.id == SessionStorage.get("DETAIL_TAB_ID")
            );
            // 找不到就赋值为玩法集第一项
            if (!set_details_item_flag&&res_data.length) {
              matchDetailCtr.value.category_tab_click(res_data[0]);
            }
            // useMittEmit( MITT_TYPES.EMIT_REF_API)
          } else {
            // 当第一次进来就会走这里默认赋值第一项
            // res_data && set_details_item(res_data[0]["id"]);
            res_data.length&&matchDetailCtr.value.category_tab_click(res_data[0])
          
          }
          let search_term = route.query && route.query.search_term;
          if (search_term) {
            router.replace({
              name: "category",
              params: { mid: matchid.value, mcid: state_data.data_list[0]["id"] },
              query: { search_term: search_term },
            });
          }
          // else{
          // router.replace({name:'category', params:{mcid: data_list[0]['id']}})
          // }
        },
        // axios中catch回调方法
        fun_catch: (e) => {
          console.log(e);
        },
        fun_finally:()=>{
          // 玩法集接口请求结果返回后，再请求盘口信息接口
          let get_category_list_req_count = ''
          if (state_data.category) {
            // 初次进入详情，请求赔率信息需显示loading，其他情况触发玩法集更新，走到这里，请求赔率信息则不显示loading
            const flag = state_data.get_category_list_req_count ? "hide_loading" : "";
            // $refs['category'].initEvent(flag, init_req).then(() => {
            //   state_data.category.initEvent(flag, init_req).then((res) => {
            //   if (!data.get_category_list_req_count) {
            //     state_data.get_category_list_req_count = 1;
            //   } else {
            //     state_data.get_category_list_req_count++;
            //   }
            //   // 获取赛果数据后，滑动到顶部
            //   if (state_data.get_menu_type === 28 && route.name === "match_result") {
            //     document.querySelector(".match-header-result").scrollTop = 0;
            //   }
            // }).catch(err=> console.error(err));
          }
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop: 3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers: 1100,
      };
      axios_api_loop(obj_);
    }
    const get_category_list_debounce = axios_debounce_cache.get_category_list
    if (get_category_list_debounce && get_category_list_debounce['ENABLED']) {
      let info = get_category_list_debounce.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        get_details_category_list();
      } else {

        // 记录timer
        clearTimeout(state_data.axios_debounce_timer)
        state_data.axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          get_details_category_list();
        }, info.delay_time || 1000);
      }
    } else {
      // 直接发请求    多 次数  循环请求 的方法
      get_details_category_list();
    }
  };
  /**
   *@description 响应WS推送C101, C102, C103, C104, C107(参看:src\public\mixins\websocket\data\skt_data_info_header.js)
   *@param {obj}
   *@return {obj}
   */
  const updata_detail_data = (payload, flag) => {
    // 只需要单独对C103的命令单独处理一下，因为msc是个数组，合并需要转化处理;
    if (payload.msc) {
      let obj = {},
        obj_payload = {},
        trans_msc = [];
      lodash.forEach(lodash.get(state_data.detail_data, "msc"), (item) => {
        let _key = item.split("|")[0],
          _val = item.split("|")[1];
        obj[_key] = _val;
      });
      lodash.forEach(payload.msc, (item) => {
        let _key = item.split("|")[0],
          _val = item.split("|")[1];
        obj_payload[_key] = _val;
      });
      // 合并转化的对象；
      Object.assign(obj, obj_payload);
      // 遍历对象
      for (let key in obj) {
        trans_msc.push([key, obj[key]].join("|"));
      }
      // 有赛事比分存在的情况；
      state_data.detail_data.msc = trans_msc;
      if (flag == "c801") {
        //c801有比分，但是也要合并其他数据
        Object.assign(state_data.detail_data, payload);
      }
    } else {
      // 合并数据对象
      Object.assign(state_data.detail_data, payload);
    }
    // 克隆解决问题
    let cloneData = lodash.cloneDeep(state_data.detail_data);
    // set_detail_data(cloneData);
    // store.dispatch({
    //   type: 'SET_DETAIL_DATA',
    //   data: cloneData
    // });
  };
  const set_native_detail_data = (str) => {
    // 判断是否有相对应的赛事
    let arr_msc = [];
    lodash.forEach(lodash.get(state_data.detail_data, "msc"), (item) => {
      arr_msc.push(item.split("|")[0]);
    });
    if (!arr_msc.includes(str.split("|")[0])) {
      state_data.detail_data.msc.push(str);
    }
  };
  /**
   *@description WSC112推送过来的玩法删除||新增
   *@param {Object} 推送过来的数据集合
   *@return {Array} 返回新的玩法集
   */
  const change_data_list = (playing) => {
    // mcms = 3 删除玩法集
    // mcms = 2 新增玩法集
    // 无论增减 都重新调用玩法集接口：category/getCategoryList
    let n_params = { sportId: state_data.detail_data.csid, mid: matchid.value };
    get_odds_list(n_params);
  };
  /**
   *@description 详情页赛事结束自动切换赛事
   *@param {Undefined}
   *@return {Object} 返回赛事各项id(球类id:csid/赛事id:mid/联赛id:tid)
   */
  const event_switch = () => {
    let params = {
      // 查找参数 1:赛事列表(非滚球:今日 早盘...) 2:赛事详情(滚球) 3:赛事筛选 4:赛事搜索(int) 如果不传默认 1:赛事列表
      sm: 2,
      // 菜单ID 多个用逗号分割(字符串)
      euid: MenuData.get_euid(MenuData.current_lv_2_menu_i),
      // 早盘日期的参数 早盘 和 串关都要加 (字符串)
      // md: state_data.get_md != -1 ? state_data.get_md : "",
      // 赛事种类id
      csid: state_data.detail_data.csid,
      // 联赛id
      tid: state_data.detail_data.tid,
      // 排序 int 类型 1按热门排序 2按时间排序(整型)
      sort: 1,
      // 搜索关键词 赛事搜索(字符串)
      keyword: lodash.trim(SearchData.search_txt) || "",
      // 用户id或者uuid
      cuid: UserCtr.get_uid(),
      // 赛事id
      mid: matchid.value,
    };

    api_common.get_detail_video(params).then((res) => {
      let event_data = lodash.get(res, "data", {});
      if (event_data && event_data.mid) {
        // 普通赛事跳电竞赛事，或者电竞赛事跳普通赛事，就需要重置菜单类型
        let flag1 = [100, 101, 103].includes(+event_data.csid);
        let flag2 = [100, 101, 103].includes(+params.csid);
        if (!state_data.get_godetailpage) {
          // 如果是从app直接进详情页
          if (flag1) {
            set_menu_type(3000);
          } else {
            set_menu_type("");
          }
        } else {
          // 如果是正常情况下触发了自动跳转
          if (flag1 !== flag2) {
            if (flag1) {
              set_menu_type(3000);
            } else {
              set_menu_type("");
            }
          }
        }
        // 赛事跳转应关闭视频
        state_data.get_show_video = false
        router.replace({name:"category",params:{mid:event_data.mid,tid:event_data.tid,csid:event_data.csid}})
        // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
        get_match_details({ mid: event_data.mid, cuid: event_data.get_uid });
        // 重新调用 详情页面玩法集接口(/v1/m/category/getCategoryList)
        get_odds_list({ sportId: event_data.csid, mid: event_data.mid });
        // 存储设置新的赛事id
        matchDetailClass.set_match_details_params({mid:event_data.mid,sport_id:event_data.csid})
        useMittEmit( MITT_TYPES.EMIT_REF_API)
        // set_goto_detail_matchid(event_data.mid);
      } else {
        // 如果不是演播厅的，才有退出回到 列表
        // if (lodash.get(state_data.get_video_url, "active") != "lvs") {
          // 没有返回赛事数据就跳转到列表页
          router.go("-1");
        // }
      }
    });
  };
  /**
   *@description 监听页面的高度的变化 及时更新页面的高度
   *@param {Undefined}
   *@return {Undefined} undefined
   */
  const detail_scroller_height = () => {
    // 投注栏收起后的底部条预留空间
    if (state_data.get_betbar_show) {
      state_data.scroller_height = window.innerHeight - rem(0.5);
      // state_data.scroller_height = window.innerHeight - 100;
    } else {
      state_data.scroller_height = window.innerHeight;
    }
  };
  const { emitters_off } = useMittEmitterGenerator([
    /** 详情赛事下拉三角形, dialog展示 */
    { type: MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, callback: change_bool },
  ])
  // 是否开启视频video组件
  const set_show_video = (params) => {
    state_data.get_show_video = params
  }
  // 控制视频说明弹窗
  const video_description_show = (is_show) => {
    get_info_show.value = is_show
  }
  /**
   * TODO: 下面的mitt根据业务场景移到上面来 批量注册 销毁
   * ! on_listeners 不需要再onMounted调用，setup = vue2的created()
   * 后面可以删除 on_listeners
   */
  onUnmounted(() => {
    emitters_off()
    SessionStorage.remove('DETAIL_TAB_ID')
    SessionStorage.remove('DETAILS_DATA_CACHE')
    state_data.detail_data = null
    // 清空操作类的mid
    MatchDataWarehouseInstance.remove_match(lodash.get(route, 'params.mid'))
    MatchDetailCalss.set_match_details_params({})
    LocalStorage.remove("YUAN_MATCH_DETAIL_DATA")
  })
  const on_listeners = () => {
    // #TODO: IMIT
    state_data.emitters = [
      useMittOn(MITT_TYPES.EMIT_RESET_SET_HTON, scrollMethod),
      // 刷新详情页头部信息;
      useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, ()=>{
        initEvent({refresh:true})}),
      // 调odds_info接口
      useMittOn(MITT_TYPES.EMIT_GET_ODDS_LIST, get_odds_list),
      useMittOn(MITT_TYPES.EMIT_SET_SHOW_VIDEO, set_show_video),
      useMittOn(MITT_TYPES.EMIT_VIDEO_DESCRIPTION_SHOW, video_description_show),
      // useMittOn(MITT_TYPES.EMIT_REF_API, details_refresh),
      // // 拳击赛事级别关盘+当前时间(服务器时间)>=赛事开赛时间(mgt) 此时详情页拳击赛事切换下一场
      useMittOn(MITT_TYPES.EMIT_CHANGE_DETAILS_MATCH, event_switch),
      // TODO: ws相关
      // useMittOn(MITT_TYPES.EMIT_DETAILS_SKT, info_icon_click_h),
      useMittOn(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, set_native_detail_data),
      useMittOn(MITT_TYPES.EMIT_ANA_SHOW, ana_show),
      // // 0号模板点击收起的时候，要调整滚动距离
      useMittOn(MITT_TYPES.EMIT_SET_DETAILDS_SCROLL, set_details_scroll),
      useMittOn(MITT_TYPES.EMIT_MATCHINFO_LOADING, loading_list),
      useMittOn(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED, tab_changed_handle),
      useMittOn(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE,()=>{
        sport_id.value = route.params.csid
        get_odds_list()
      }),
      // // 监听页面高度的变化 及时动态更新最新的页面高度
      useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, detail_scroller_height),

    ];
  };
  const off_listeners = () => {
    // #TODO IMIT
    state_data.emitters.map((x) => x && x.off());
  };
  // 清除当前组件所有定时器
  const clear_timer = () => {
    // timeout定时器列表
    const timeout_timer_arr = [
      "timer1_",
      "timer2_",
      "get_match_detail_timer",
      "back_main_list_timer",
      "axios_debounce_timer",
      "init_event_timer",
    ];

    // interval定时器列表
    const interval_timer_arr = [];

    // 批量清除timeout定时器
    for (const timer of timeout_timer_arr) {
      clearTimeout(state_data[timer]);
      state_data[timer] = null;
    }

    // 批量清除interval定时器
    for (const timer of interval_timer_arr) {
      clearInterval(interval_timer_arr[timer]);
      state_data[timer] = null;
    }
  };
  return {
    state_data,
    is_highlights,
    show_match_analysis_tab,
    show_chatroom_tab,
    scroll_visible,
    skeleton_finish,
    matchid,
    curr_active_tab,
    icon_replay,
    matchDetailCtr,
    get_info_show,
    get_bet_show,
    MatchDataBaseH5,
    details_click,
    change_go_back,
    details_refresh,
    cancel_ref,
    api_interface,
    set_details_scroll,
    loading_list,
    ana_show,
    tab_changed_handle,
    detail_scrolling,
    full_screen_detail_scrolling,
    start,
    moved,
    rem,
    scrollMethod,
    change_bool,
    initEvent,
    get_chatroom_info,
    get_football_replay,
    get_match_details,
    match_detail_data_handle,
    get_match_list,
    get_odds_list,
    updata_detail_data,
    set_native_detail_data,
    change_data_list,
    event_switch,
    detail_scroller_height,
    on_listeners,
    off_listeners,
    clear_timer,
    LOCAL_PROJECT_FILE_PREFIX,
    change_fullscreen
  };
};

/** 统一从数据参数获取详情数据Hook */
export const useDetailsDataFromDataWarehouse = () => {
  const route = useRoute()
  const mid = lodash.get(route, 'params.mid')
  const details_data = lodash.get(MatchDataWarehouse_H5_Detail_Common, `list_to_obj.mid_obj.${mid}_`)
  return {
    details_data
  }
}