import { ref, onMounted, watch, onUnmounted } from "vue";
import { api_match_list, api_common, api_details } from "src/api";
import { useRouter } from "vue-router";
// import store from "src/store-redux-vuex/index.js";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,
  MenuData,
  MatchDetailCalss,
  SearchPCClass,
  // utils
} from "src/output/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import {
  filter_odds_func,
  handle_course_data,
  format_mst_data,
} from "src/core/utils/matches_list.js";
import { useGetGlobal } from "src/core/global/mixin/global_mixin.js";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/index.js";
import { LayOutMain_pc } from "src/output";
// import lodash. from "lodash";
// 搜索操作相关控制类
import search from "src/core/search-class/search.js";
import { addWsMessageListener } from "src/core/utils/common/module/ws-message.js";
import axios_api_loop from "src/core/http/axios-loop.js"
export function usedetailData(route) {
  const router = useRouter();
  /** @type {Ref<Array<TYPES.DetailCategory>>} */
  const category_list = ref([]); //分类数据
  /** @type {Ref<Array<TYPES.OddInfo>>} */
  const detail_list = ref([]); //玩法数据
  /** @type {Ref<Array<TYPES.OddInfo>>} */
  const all_list = ref([]); //  所有玩法数据
  let all_list_toggle = {}; //  所有玩法数据展开关闭记录

  const detail_info = ref({}); //详情数据

  const current_key = ref(""); // 当前tab   key

  const detail_loading = ref(true); //loading
  const tabList = ref([]);

  const show_close_thehand = ref(false); // 是否显示无数据图标

  const matchDetailList = ref([]);
  const {
    get_detail_category,
    get_detail_list,
    get_detail_data,
    getMatchDetailByTournamentId,
  } = api_match_list; // 接口

  //const userInfo = state.userReducer.userInfo; // 用户数据
  const { user_info } = UserCtr; // 用户数据

  const current_id = ref(); // 赛事id

  let sportId = 1,
    mid = 2858623,
    tid;
  let route_parmas = ref(route.params);
  watch(
    () => route.params,
    (val) => {
      
      if (val && val.mid && detail_info.value?.mmp != '999' ) {
        route_parmas.value = val;
        init();
      }
    },
    { deep: true }
  );

  // 监听分类切换数据
  watch(current_key, (val) => {
    if (!val) return;
    get_match_detail(val);
  });


  //  根据分类id 过滤数据
  const get_match_detail = (value) => {
    const plays = category_list.value.find(
      (item) => item.orderNo == value
    )?.plays;
    /** @type {TYPES.DetailCategory} */ const category = category_list.value.find(
      (item) => item.orderNo == value
    )
    if (detail_list.value?.length > 0) {
      for (const i of detail_list.value) {
        all_list_toggle[i.hpid] = i.expanded === undefined ? true : i.expanded;
        if (i.hpid == 103) {
          //hpid103处理
          i.title = [{ otd: 1 }, { otd: 0 }, { otd: 2 }];
        }
      }
    }
    let list;
    if (plays) {
      list = all_list.value.filter((item) =>{
        if(category.round){
          if(plays.includes(Number(item.hpid))){
            let [hpid, round] = item.chpid.split("-")
            if(round == category.round){
              return true
            }else {
              return false
            }
          }
        }else{
          return plays.includes(Number(item.hpid))
        }
      });
    } else {
      list = all_list.value;
    }

    if (list.length > 0) {
      for (const item of list) {
        item.expanded = all_list_toggle[item.hpid];
      }
      list = list.filter((i) => i.hpn);
    }
    //存取玩法集数据到数据仓库 MatchDataWarehouseInstance.get_quick_mid_obj(mid)获取存到数据仓库的基础详情数据
    MatchDataWarehouseInstance.set_match_details(
      MatchDataWarehouseInstance.get_quick_mid_obj(route.params.mid),
      list || []
    );
    detail_list.value =
      lodash.get(getMidInfo(route.params.mid), "odds_info") || [];


    show_close_thehand.value = list.length == 0;
  };

  /**
   * 获取数据
   */
  const is_fresh = ref(false);
  const init = async (params) => {
    const { isNeedLoading = true } = params || {};
    // all_list_toggle = {}
    is_fresh.value = isNeedLoading;
    detail_loading.value = isNeedLoading;
    get_detail(params);
    await get_category();
  };
  /**
   * 获取赛事详情数据
   */
  const get_detail = async (par) => {
    //赛果页面调用赛果玩法详情接口
    // match_odds_info.value = get_match_odds_info.value;
    //接口调用
    const { isNeedLoading = true } = par || {};
    detail_loading.value = isNeedLoading;
    const params = {
      mid: route_parmas.value.mid,
      cuid: user_info.userId,
      t: new Date().getTime(),
    };
    console.log(MenuData.is_esports() ,'MenuData.is_esports ');
    //api_details
    let obj_ = {
      // axios api对象
      axios_api:MenuData.is_esports() ? api_details.get_match_detail_ESMatchInfo  :  get_detail_data ,
      // axios api对象参数
      params: params,
      // 唯一key值
      key: "details",
      error_codes: ["0401038"],
      // axios中then回调方法
      fun_then: (res) => {
          // 空赛事数据跳转回首页
          if (lodash.isEmpty(res.data)) {
            router.push({
              name: "home",
            });
            return;
          }
          getMatchDetailList(res.data);
          // detail_loading.value = false;
          detail_info.value = { ...detail_info.value, ...res.data };
          detail_info.value["course"] = handle_course_data(detail_info.value);
          setTimeout(() => {
             if (!route.query.ms) {
              LayOutMain_pc.set_oz_show_right(detail_info.value.ms > 0); // 显示右侧
                }
           
          }, 200);
  
          MatchDataWarehouseInstance.set_match_details(detail_info.value, []);
          if (is_fresh.value) {
            useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, route_parmas.value.mid);
          }
      },
      // axios中catch回调方法
      fun_catch: (e) => {
        console.log(e);
      },
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop: 3,
      // 异常调用时延时时间,毫秒数,默认1000
      timers: 1100,
    };
    axios_api_loop(obj_);
  };

  /**
   * 获取联赛赛事列表
   */
  const getMatchDetailList = async (data) => {
    try {
      const params = {
        tId: data.tid,
        t: new Date().getTime(),
      };
  //  电竞需加isESport参数
      if (MenuData.is_esports()) {
        params.isESport = 1
        
      }

      const res = await getMatchDetailByTournamentId(params)
      if (res.code=='0401038') {
        setTimeout(() => {
          getMatchDetailList(data)
        }, 1000);
        
      }else{
        matchDetailList.value = res.data;
      }
    }
    catch (error) {
     
      console.error("details-list", error);
    }

     
  };

  /**
   * 获取赛事tabs数据
   */
  const get_category = async () => {
    try {
      const params = {
        sportId: route_parmas.value.csid,
        mid: route_parmas.value.mid,
        t: new Date().getTime(),
      };
      const res = await get_detail_category(params);
      category_list.value = res.data || [];
      const list = res.data?.filter((i) => i.marketName);
      if (list) {
        tabList.value = list.map((item) => ({
          ...item,
          label: item.marketName,
          value: item.orderNo,
        }));
      }

      await get_detail_lists();
    } catch (error) {
      console.error("get_detail_category", error);
    }
  };
  /**
   * 获取赛事列表数据
   */
  const get_detail_lists = async () => {
  
      const params = {
        mcid: 0,
        cuid: user_info.userId,
        mid: route_parmas.value.mid,
        newUser: 0,
        t: new Date().getTime(),
      };
    let obj_ = {
      // axios api对象
      axios_api: MenuData.is_esports() ? api_details.get_match_odds_info_ES : get_detail_list ,
      // axios api对象参数
      params: params,
      // 唯一key值
      key: "details",
      error_codes: ["0401038"],
      // axios中then回调方法
      fun_then: (res) => {
        all_list.value = res.data || [];
        res.data && res.data.forEach((item) => (item.expanded = true));
        detail_loading.value = false;
        current_key.value = current_key.value
          ? current_key.value
          : tabList.value.length > 0
          ? tabList.value[0].value
          : null;
  
        current_key.value && get_match_detail(current_key.value);
      },
      // axios中catch回调方法
      fun_catch: (e) => {
        console.log(e);
      },
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop: 1,
      // 异常调用时延时时间,毫秒数,默认1000
      timers: 1100,
    };
    axios_api_loop(obj_);

  };
    /**
   * 获取赛事列表数据
   */
    const socketOddinfo = lodash.throttle(async()=>{
      try {
        const params = {
          mcid: 0,
          cuid: user_info.userId,
          mid: route_parmas.value.mid,
          newUser: 0,
          t: new Date().getTime(),
        };
        let api = MenuData.is_esports() ? api_details.get_match_odds_info_ES : get_detail_list 
        const res = await api(params);
        all_list.value = res.data || [];
        res.data && res.data.forEach((item) => (item.expanded = true));
        detail_loading.value = false;
        current_key.value = current_key.value
          ? current_key.value
          : tabList.value.length > 0
          ? tabList.value[0].value
          : null;
  
        current_key.value && get_match_detail(current_key.value);
      } catch (error) {
        console.error("get_detail_list", error);
      }
    },2000)
  /**
   * @description: 通过mid获取从仓库获取最新的数据
   * @param {*} val  mid参数
   * @return {*}
   */
  const update_data = (val) => {
    if (!val) return;
    detail_info.value = getMidInfo(val);
    all_list.value = lodash.get(getMidInfo(val), "odds_info");
  };
  /**
   * @description: 从仓库获取获取赛事信息
   * @param {*} mid
   * @return {*} 赛事详情
   */
  const getMidInfo = (mid) => {
    return MatchDataWarehouseInstance.get_quick_mid_obj(mid);
  };
  /**
   * @description: 一键折叠
   * @param {*} mid
   * @return {*} 赛事详情
   */
  const set_odds_fold = (val) => {
    for (const item of all_list.value) {
      item.expanded = !val;
    }
  };

  /**
   * @description: 一键置顶
   * @param {*} mid
   * @return {*} 赛事详情
   */
  const set_top = (val) => {
    let params = {
      cuid: user_info.userId,
      playId: val.hpid,
      matchId: val.mid,
      topKey: val.topKey,
      status: val.hton == "0" ? 0 : 1, //0置顶，1取消置顶
    };

    api_details.set_playTop(params).then((res) => {
      const code = lodash.get(res, "code");
      if (code == 200) {
        if (!params.status) {
          //置顶
          if (val.hton == "0") {
            val.hton = new Date().getTime() + "";
          }
          all_list.value = all_list.value.filter(
            (item) => item.hpid != val.hpid
          );
          all_list.value.unshift(val);
          get_match_detail(current_key.value);
        } else {
          //取消置顶
          val.hton = "0";
          let arr = []; //暂存置顶的数据
          for (var i = 0; i < all_list.value.length; i++) {
            if (all_list.value[i].hton != "0") {
              arr.unshift(all_list.value.splice(i, 1)[0]);
              i--;
            }
          }
          //根据hpon排序
          all_list.value.sort(function (a, b) {
            return a.hpon - b.hpon;
          });
          //插入置顶的数据
          for (var i in arr) {
            all_list.value.unshift(arr[i]);
          }
          get_match_detail(current_key.value);
        }
        // // 保存置顶玩法的 id
        // this.set_top_id({
        //   id: params.topKey,
        //   type: !params.status,
        // });
        // this.set_current_index(handicap);
        // // 计算单双列玩法
        // this.set_waterfall(handicap);
      }
    });
  };

  /*
   **监听数据仓库版本号
   */
  watch(
    () => MatchDataWarehouseInstance.data_version,
    (val, oldval) => {
      if (val.version) {
        update_data(route.params.mid);
      }
    },
    { deep: true }
  );
  let message_fun = [];
  onMounted(() => {
    sportId = route.params.csid;
    mid = route.params.mid;
    tid = route.params.tid;
    current_id.value = route.params.mid;
     // 有ms 字段优先判断是否显示右侧
    if (route.query.ms) {
      LayOutMain_pc.set_oz_show_right(Number(route.query.ms)>0); // 显示右侧
    }else{
      LayOutMain_pc.set_oz_show_right(true); // 显示右侧
    }
    LayOutMain_pc.set_oz_show_left(true); // 显示菜单
    init();
    // 一键折叠监听
    message_fun.push(useMittOn(MITT_TYPES.EMIT_SHOW_FOLD, set_odds_fold).off);
    // 一键置顶监听
    message_fun.push(useMittOn(MITT_TYPES.EMIT_SET_PLAT_TOP, set_top).off);
    // 增加监听接受返回的监听函数
    message_fun.push(
      addWsMessageListener((cmd, data) => {
        if (lodash.get(data, "cd.mid") != mid || cmd == "C105") return;
        // handler_ws_cmd(cmd, data);
        // let flag =  MatchDetailCalss.handler_details_ws_cmd(cmd)
        // console.error(flag,'flag','cmd:',cmd,data);
        //如果ms mmp变更了 就手动调用ws
        init.value = false;
        switch (cmd) {
          case "C303":
            socketOddinfo();
            break;
          case "C302":
            // 赛事状态发现变更  ms
            init();
            break;
          case "C104":
            RCMD_C104(data);
            break;
          case "C109":
            RCMD_C109(data);
          //  玩法集变更(C112)
          case "C112":
            socketOddinfo();
            break;
          case "C102":
            RCMD_C102(data);
            break;
          case "C110":
           RCMD_C110(data);
           break;       
          default:
            break;
        }
      })
    );
  });
   //赛事玩法数量
 /**
  * @description: RCMD_C110 锁盘 mc==0
  * @param {*} obj
  * @return {*}
  */
 function RCMD_C110(obj){
    if(obj.cd.mc == 0){
      //锁盘展示
      detail_list.value = [];
    }
  }
  /**
   * @description: RCMD_C109
   * @return {*}
   */
  function RCMD_C109(obj) {
    if (!obj) {
      return;
    }
    let skt_data = obj.cd;
    if (!skt_data || skt_data.length < 1) return;
    // 重新拉取数据;
    get_category();
  }
  /**
   * @description: 赛事级别盘口状态(C104)  hs: 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
   * @param {*} obj
   * @return {*}
   */
  function RCMD_C104(obj) {
    let skt_data = obj.cd;
    // 赛事级别盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    if (skt_data.mhs == 0 || skt_data.mhs == 11) {
      // 重新拉取数据;
      get_category();
    } else if (skt_data.mhs == 1) {
      // 设置盘口状态
    } else if (skt_data.mhs == 2) {
      show_close_thehand.value = true;
    }
  }
  /**
   * @description: 赛事事件C102)
   * @param {*} obj
   * @return {*}
   */
  function RCMD_C102(obj) {
    let skt_data = obj.cd;
    if (skt_data.mmp == 999) {
      //切换赛事
      // mx_autoset_active_match({ mid: route.params.mid });
    }
  }
  // setTimeout(() => {
  //   back_to(false);
  // }, 10000);
  //todo mitt 触发ws更新
  const { off } = useMittOn(
    MITT_TYPES.EMIT_DATAWARE_DETAIL_UPDATE,
    (res) => {}
  );
  //  赛事切换刷新数据
  const refresh = () => {
  
    all_list_toggle = {};
    detail_list.value = [];
    sportId = route.params.csid;
    mid = route.params.mid;
    tid = route.params.tid;
    current_id.value = route.params.mid;
    current_id.value = mid;
    LayOutMain_pc.set_oz_show_right(true); // 显示右侧
    LayOutMain_pc.set_oz_show_left(true); // 显示菜单
    init();
  };
  /* 赛事结束之后调取详情接口 */
  message_fun.push(
    useMittOn(MITT_TYPES.EMIT_SWITCH_MATCH, (parmas) => {
    }).off
  );
    // 监听ws断连
  message_fun.push(useMittOn(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT,(ws_status, ws_status_old)=>{
      // ws_status 链接状态变化 (0-断开,1-连接,2-断网续连状态)
      if(ws_status.ws_status != 1){
        MatchDataWarehouseInstance.scmd_c8_ws_reconnect()
        socketOddinfo();
      }
  }).off)
  onUnmounted(() => {
    off();
    message_fun.forEach((i) => i());
    // off_init()
    clearTimeout(back_to_timer);
     // 关闭详情订阅
     MatchDataWarehouseInstance.set_active_mids([])
  });

  /**
   *@description 详情页赛事结束自动切换赛事 todo
   *@param {Undefined}
   *@return {Object} 返回赛事各项id(球类id:csid/赛事id:mid/联赛id:tid)
   */
  /**
   * @description 返回上一页
   */
  const cur_menu_type = ref(LayOutMain_pc.layout_current_path);
  let back_to_timer = null;
  const back_to = (is_back = true) => {
    // 重新请求相应接口
    // if (play_media.value.media_type === "topic") {
    //   video.send_message({
    //     cmd: "record_play_info",
    //     val: {
    //       record_play_time: true,
    //     },
    //   });
    // }

    clearTimeout(back_to_timer);
    back_to_timer = setTimeout(() => {
      // 退出页面时清空用户操作状态
      window.sessionStorage.setItem("handle_state", JSON.stringify([]));
      // 如果是从搜索结果进来的
      if (route.query.keyword) {
        search.set_back_keyword({
          keyword: route.query.keyword,
          csid: route.params.csid,
        });
        SearchPCClass.set_search_isShow(true);
      }
      let { from_path, from } = cur_menu_type.value;
      from_path = from_path || "/home";
      if (from == "video") {
        from_path = "/home";
      }
      // 告知列表是详情返回：用于是否重新自动拉右侧内容
      MatchDetailCalss.set_is_back_btn_click(is_back);
      router.push({ path: from_path });
      if (from_path.includes("search")) {
        LayOutMain_pc.set_unfold_multi_column(false);
      }
    }, 50);
  };
  const { mx_autoset_active_match } = useGetGlobal({ back_to });
  // 监听赛事状态mmp的值
  watch(
    () => detail_info.value?.mmp,
    (_new, _old) => {
   
      // 如果是999赛事结束即调接口切换赛事
      if (_new == "999") {
        console.log('mmp',3333);
        mx_autoset_active_match({ mid: route.params.mid });
      }
      // 否则更新玩法集
      else {
        if (_old != undefined && _new!=_old) {
          console.log('mmp',1111);
          get_category();
        }
      }
    },
    { deep: true }
  );
  // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
  watch(
    () => detail_info.value?.ms,
    (_new, _old) => {
     
      let arr_ms = [0, 1, 2, 7, 10, 110];
      if (!arr_ms.includes(Number(_new)) && _new != undefined) {
        console.log('mmp',4444);
        mx_autoset_active_match({ mid: route.params.mid });
      }
      // 赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
      else {
        console.log('mmp',222);
        // ms变更时才调用
        if (_new != _old && _old) {
          // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
          // refresh();
        }
      }
    },
    { deep: true }
  );

  return {
    tabList,
    category_list,
    detail_list,
    current_key,
    detail_loading,
    detail_info,
    refresh,
    get_match_detail,
    sportId,
    init,
    show_close_thehand,
    matchDetailList,
    current_id,
  };
}
