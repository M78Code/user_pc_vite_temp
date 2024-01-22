import {  api_common } from "src/api/index.js";
import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
import { onMounted, ref, watch, onUnmounted, toRaw } from "vue";
import {
  MatchDetailCalss,
  MatchDataWarehouse_H5_Detail_Common,
  useMittOn,
  useMitt,
  MITT_TYPES,
  axios_loop as axios_api_loop,
  MenuData,
  SearchData,
  MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,
  LocalStorage
} from "src/output/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import * as ws_message_listener from "src/core/utils/common/module/ws-message.js";
import { details_ws } from "src/core/match-detail/details-ws.js";
export const details_main = (router, route) => {
  const mid= ref(route.params.mid);
  const csid= ref(route.params.csid);
  const detail_store = ref(MatchDetailCalss); //todo
  const match_odds_info = ref([]);
  /** @type {Ref<TYPES.MatchDetail>} */
  const match_detail = ref({});
  const category_list = ref([]);
  const tab = ref("betting");
  const cuid = ref(UserCtr.get_uid());
  const scroller_height = ref(0);
  const loading = ref(false);
  const detail_event_tabs_value = ref({ label: "Match", id: 1 });
  const timer = ref(null);
  /** @type {Ref<NodeJS.Timeout>} */
  const mst_timer = ref(null);
  const tab_selected_obj = ref({});
  const change_header_fix = ref(null);
  const header_fix = ref(null);
  const fixedHeight = ref(null);
  const MatchDataWarehouseInstance = ref(MatchDataWarehouse_H5_Detail_Common);

  /* 引入ws处理指令 */
  const { handler_ws_cmd } = details_ws(router, route);
  //初次加载
  const init = ref(false);
  // 切换tab
  const tabChange = (item) => {
    tab.value = item;
    detail_event_tabs_value.value = { label: "Match", id: 1 };
  };
  const detail_event_tabs_change = (item) => {
    detail_event_tabs_value.value = item;
  };
  /**
   * @name 开赛时间自动加1
   * @param {*} t
   */
  const use_polling_mst = (t) => {
    // console.log("detail", t)
    if (Number(t.mst) <= 0 || t.ms !== 1) {
      if (mst_timer.value) {
        clearInterval(mst_timer.value);
      }
      return;
    }
    mst_timer.value = setInterval(() => {
      if (t.csid == 2) {
        t.mst--;
        if (t.mst < 0) {
          t.mst = 0;
          clearInterval(mst_timer.value);
        }
      } else {
        t.mst++;
      }

      t.mstValueTime = format_mst_data(t);
      t.mstValue;
    }, 1000);
  };
  // 获取格式化时间对象
  const format_date_time = (value) => {
    const time = new Date(parseInt(value));
    const y = time.getFullYear();
    const m = (time.getMonth() + 1 + "").padStart(2, 0);
    const d = (time.getDate() + "").padStart(2, 0);
    const h = (time.getHours() + "").padStart(2, 0);
    const mm = (time.getMinutes() + "").padStart(2, 0);
    const s = (time.getSeconds() + "").padStart(2, 0);
    const w = time.getDay();
    return { y, m, d, h, mm, s, w };
  };
  /**
   *@description 开赛时间转换 分：秒
   *@param {mst} 时间
   *@return {*}
   */
  const format_mst_data = (t) => {
    const { ms, mst, mgt } = t;
    if (ms === 1) {
      const m = String(Math.floor(mst / 60)).padStart(2, "0");
      const s = String(Math.floor(mst % 60)).padStart(2, "0");
      return `${m}:${s}`;
    } else {
      const { m, d, h, mm, s } = format_date_time(mgt);
      return `${d}/${m} ${h}:${mm}`;
    }
  };
  const get_match_odds_info = ref([]);
  /**
   *@description // 触发切换玩法tab
   *@param {obj} tab_item 请求参数
   *@return {obj}
   */
  const detail_tabs_change = (tab_item) => {
    tab_selected_obj.value = tab_item;
    const { plays } = tab_item;
    const m_plays = [];
    //取缓存中盘口的数据 后续ws推送数据 存数据到缓存 todo
    let arr = JSON.parse(sessionStorage.getItem("match_oddinfo"));
    if (arr?.length == 0) return;
    const list = arr?.filter((item) => {
      let play = item.topKey;
      let topKeyArr = item.topKey.split("-");
      if (topKeyArr.length > 0) {
        play = topKeyArr[0];
      }
      m_plays.push(Number(play));
      return plays && plays.includes(Number(play));
    });
    if (!lodash.isEmpty(list)) {
      MatchDataWarehouseInstance.value.set_match_details(
        getMidInfo(route.params.mid),
        [...list]
      );
    }
  };
  const startY = ref(0);
  const scroller_scroll_top = ref(0);
  const changeHeader = ref(false);
  function touchIf(){
    return match_detail.value.mvs <= -1 || match_detail.value.mms <= -1
  }
  /**
   *@description 监听页面触摸
   *@param {e} e 请求参数
   *@return {*}
   */
  const touchstart = (e) => {
    startY.value = e.targetTouches[0].pageY;
  };
  const touchend = (e) => {
    if (touchIf()) {
      if (header_fix.value && change_header_fix.value) {
        let px160 =
          header_fix.value.clientHeight - change_header_fix.value.clientHeight;
        // console.log("touchend", px160, scroller_scroll_top.value);
        if (scroller_scroll_top.value >= px160) {
          changeHeader.value = true;
        } else {
          changeHeader.value = false;
        }
      }
    }
  };
  /**
   *@description 监听页面触摸移动
   *@param {e} e 请求参数
   *@return {*}
   */
  const touchmove = (e) => {
    if (touchIf()) {
      if (header_fix.value && change_header_fix.value) {
        let px160 =
          header_fix.value.clientHeight - change_header_fix.value.clientHeight;
        // console.log("touchmove", px160, scroller_scroll_top.value);
        let dom_ = document,
          dom_ele = dom_.documentElement;
        let osTop = dom_ele.scrollTop || dom_.body.scrollTop;
        if (
          scroller_scroll_top.value >= px160 &&
          ((!!osTop && osTop > px160) ||
            startY.value - e.targetTouches[0].pageY > px160)
        ) {
          changeHeader.value = true;
          startY.value = e.targetTouches[0].pageY;
        } else if (
          scroller_scroll_top.value <= px160 &&
          e.targetTouches[0].pageY - startY.value >= 0
        ) {
          changeHeader.value = false;
          startY.value = e.targetTouches[0].pageY;
        }
      }
    }
  };
  const detail_scrolling = (event) => {
    scroller_scroll_top.value = event.target.scrollTop;
    if (header_fix.value && change_header_fix.value) {
      let px160 =
        header_fix.value.clientHeight - change_header_fix.value.clientHeight;
      if (scroller_scroll_top.value >= px160) {
        changeHeader.value = true;
      } else if (scroller_scroll_top.value <= px160) {
        changeHeader.value = false;
      }
    }
  };

  /**
   *@description // 调用: /v1/m/matchDetail/getMatchOddsInfoPB接口 //赛果页面调用赛果玩法详情接口
   *@param {obj} params 请求参数
   *@return {obj}
   */
  const get_matchDetail_getMatchOddsInfo = (params) => {
    //赛果页面调用赛果玩法详情接口
    //接口调用
    let obj_ = {
      // axios api对象
      axios_api:  MenuData.is_esports ? api_common.get_DJ_matchDetail_getMatchOddsInfo  :  api_common.get_matchDetail_getMatchOddsInfo,
      // axios api对象参数
      params: params,
      // 唯一key值
      key: "details",
      error_codes: ["0401038"],
      // axios中then回调方法
      fun_then: (res) => {
       
        console.log(tab_selected_obj.value.marketName,"tab_selected_obj.value.marketName");
        sessionStorage.setItem("match_oddinfo", JSON.stringify(res.data));
        // if (tab_selected_obj.value.marketName) {
          detail_tabs_change(tab_selected_obj.value);
        // } else {
          get_match_odds_info.value = res.data;
        // }
   
        // MatchDataWarehouseInstance.value.set_match_details(
        //   getMidInfo(params.mid),
        //   res.data
        // );
        // 第一次加载显示进度条
        loading.value = false;
      },
      // axios中catch回调方法
      fun_catch: (e) => {
        console.log(e);
      },
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop: init.value ? 3 : 1,
      // 异常调用时延时时间,毫秒数,默认1000
      timers: 1100,
    };
    axios_api_loop(obj_);
  };
  /*
   **监听数据仓库版本号
   */
  watch(
    () => MatchDataWarehouseInstance.value.data_version,
    (val, oldval) => {
      if (val.version) {
        update_data(route.params.mid);
      }
    },
    { deep: true }
  );
  /**
   * @description: 通过mid获取从仓库获取最新的数据
   * @param {*} val  mid参数
   * @return {*}
   */
  function update_data(val) {
    if (!val) return;
    match_detail.value = getMidInfo(val);
    match_odds_info.value = lodash.get(getMidInfo(val), "odds_info",[]);
  }
  /**
   * @description: 从仓库获取获取赛事信息
   * @param {*} mid
   * @return {*} 赛事详情
   */
  const getMidInfo = (mid) => {
    return MatchDataWarehouseInstance.value.get_quick_mid_obj(mid);
  };
  /**
   *@description 获取详情页面玩法集接口(/v1/m/category/getCategoryList)
   *@param {obj} params 请求参数
   *@return {obj}
   */
  const get_category_list_info = (params) => {
    // category_list.value = get_category_list.value;
    api_common
      .get_category_list(params)
      .then((res) => {
        // console.log("get_category_list", res);
        category_list.value = res.data;
        if (!tab_selected_obj.value.id) {
          tab_selected_obj.value = lodash.get(res, "data[0]", {});
        }
        get_matchDetail_getMatchOddsInfo({
          mcid: 0,
          cuid: cuid.value,
          mid: params.mid,
          newUser: 0,
        });
      })
      .catch((err) => console.log(err));
  };
  /**
   *@description 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
   *@param {{mid,cuid}} params 请求参数
   *@return {obj}
   */
  let get_matchDetail_MatchInfo = (params) => {
    /** 节流思路或许应该换成立即发送, 而后一定时间内忽略请求意图 */
    get_matchDetail_MatchInfo = lodash.debounce(getMatchDetailMatchInfo, 450);
    getMatchDetailMatchInfo(params);
  };
  function getMatchDetailMatchInfo(params) {
    let obj_ = {
      // axios api对象
      axios_api:MenuData.is_esports ? api_common.get_DJ_matchDetail_MatchInfo  :  api_common.get_matchDetail_MatchInfo,
      // axios api对象参数
      params: params,
      // 唯一key值
      key: "details",
      error_codes: ["0401038"],
      // axios中then回调方法
      fun_then: (res) => {
        const res_data = lodash.get(res, "data");
        if (res_data && res_data.mhid) {
          match_detail.value = res_data;
          match_detail.value.mstValueTime = format_mst_data(match_detail.value);
          use_polling_mst(match_detail.value);
        } else {
          clear_all_timer();
          router.replace("/");
        }
        // detail_store.get_detail_params
        MatchDataWarehouseInstance.value.set_match_details(
          toRaw(match_detail.value),
          get_match_odds_info.value
        );
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
    //初次调用成功后 赋值init未false
    get_category_list_info({
      sportId: csid.value,
      mid:mid.value,
    });
  }
  /**
   * @var mid 用于detail_init函数初始化的赛事id
   * @var csid 用于detail_init函数初始化的csid
   */
  /**
   *@description 初始化
   *@param {*}
   *@return {*}
   */
  const detail_init = () => {
    get_matchDetail_MatchInfo({
      mid:mid.value,
      cuid: cuid.value,
    });
  };
  detail_init();
  /** 监听顶部刷新功能 */
  useMitt(MITT_TYPES.EMIT_REFRESH_DETAILS, (params) => {
    mid.value = params.mid;
    csid.value = params.csid;
    loading.value = true;
    detail_init();
  });

  const clear_all_timer = () => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
    if (mst_timer.value) {
      clearInterval(mst_timer.value);
      mst_timer.value = null;
    }
  };
  /**
   *@description 获取详情页面oddinfo
   *@param {obj} params 请求参数
   *@return {obj}
   */
   const socketOddinfo = lodash.throttle((params) => {
    //赛果页面调用赛果玩法详情接口
    //接口调用
    let obj_ = {
      // axios api对象
      axios_api: api_common.get_matchDetail_getMatchOddsInfo,
      // axios api对象参数
      params: params,
      // 唯一key值
      key: "details",
      error_codes: ["0401038"],
      // axios中then回调方法
      fun_then: (res) => {
        get_match_odds_info.value = res.data;
        if (tab_selected_obj.value.marketName) {
          detail_tabs_change(tab_selected_obj.value);
        } else {
          match_odds_info.value = res.data;
        }
        sessionStorage.setItem("match_oddinfo", JSON.stringify(res.data));
        MatchDataWarehouseInstance.value.set_match_details(
          getMidInfo(params.mid),
          res.data
        );
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
  }, 2000);
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
    get_category_list_info({
      sportId: csid.value,
      mid:mid.value,
    });
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
      get_category_list_info({
        sportId: csid.value,
        mid:mid.value,
      });
    } else if (skt_data.mhs == 1) {
      // 设置盘口状态
    } else if (skt_data.mhs == 2) {
      match_odds_info.value = [];
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
      event_switch()
    }  
  }
 //赛事玩法数量
 /**
  * @description: RCMD_C110 锁盘 mc==0
  * @param {*} obj
  * @return {*}
  */
 function RCMD_C110(obj){
  if(obj.cd.mc == 0){
    //锁盘展示
    
    match_odds_info.value = [];
    //清除玩法缓存
    sessionStorage.removeItem("match_oddinfo")
  }
  }
 /**
  * @description:  // 视频/动画状态推送（C107  暂时不单独处理
  * @param {*} obj
  * @return {*}
  */
 function RCMD_C107(obj) {
    if (!obj || this.matchid != obj.cd.mid) {
      return;
    }
    let skt_data = obj.cd;
    /**
     * mvs - 赛事动画状态   0:不可用 1:可用，暂未播放 2：可用，播放中
     * mms - 赛事视频动态   0:不可用 1:可用，暂未播放 2：可用，播放中
     */
    this.updata_detail_data(skt_data);
  }
  let message_fun = null;
  onMounted(() => {
    // MatchDataWarehouseInstance.value.set_match_details(LocalStorage.get("YUAN_MATCH_DETAIL_DATA"),[])
    // match_detail.value = MatchDataWarehouseInstance.value.get_quick_mid_obj(mid.value);
    // match_odds_info.value = lodash.get(MatchDataBaseH5.get_quick_mid_obj(mid.value),"hps","[]")
    // match_detail.value = MatchDataBaseH5.get_quick_mid_obj(mid.value) || []
    loading.value = true;
    init.value = true;
    // 增加监听接受返回的监听函数
    //C105移除玩法集 从数据仓库移除
    message_fun = ws_message_listener.ws_add_message_listener((cmd, data) => {
      if (lodash.get(data, "cd.mid") != mid.value || cmd == "C105") return;
      // handler_ws_cmd(cmd, data);
      // let flag =  MatchDetailCalss.handler_details_ws_cmd(cmd)
      // console.error(flag,'flag','cmd:',cmd,data);
      //如果ms mmp变更了 就手动调用ws
      init.value = false;
      switch (cmd) {
        // 赛事订阅(C8)-新增玩法/新增盘口(C303)
        case "C303":
          socketOddinfo({
            mcid: 0,
            cuid: cuid.value,
            mid: mid.value,
            newUser: 0,
          })
          break;
         // 赛事开赛状态(C302)  
        case "C302":
          // 赛事状态变化
          detail_init()
          break;
        case "C104":
          RCMD_C104(data);
          break;
        case "C109":
          RCMD_C109(data);
          break;
         //  玩法集变更(C112)    
        case "C112":
          socketOddinfo({
            mcid: 0,
            cuid: cuid.value,
            mid: mid.value,
            newUser: 0,
          })
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
    });
  });
  // 监听ws断连
  const {off} = useMittOn(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT,(ws_status)=>{
    // ws_status 链接状态变化 (0-断开,1-连接,2-断网续连状态)
    if(ws_status.ws_status != 1){
      MatchDataWarehouseInstance.value.scmd_c8_ws_reconnect()
      socketOddinfo({
        mcid: 0,
        cuid: cuid.value,
        mid: mid.value,
        newUser: 0,
      })
    }
  });
  const  get_info_show = ref(false)
  // 控制视频说明弹窗
  const video_description_show = (is_show) => {
      get_info_show.value = is_show
  }
  const {off:off_video_show} = useMittOn(MITT_TYPES.EMIT_VIDEO_DESCRIPTION_SHOW, video_description_show)
  onUnmounted(()=>{
    //关闭监听
    off()
    //关闭视频信息订阅
    off_video_show()
    // 关闭详情订阅
    MatchDataWarehouseInstance.value.set_active_mids([])
    LocalStorage.remove("YUAN_MATCH_DETAIL_DATA")
  })
  // 监听赛事状态mmp的值
  watch(
    () => match_detail.value?.mmp,
    (_new, _old) => {
      // 如果是999赛事结束即调接口切换赛事
      if (_new == "999") {
        // event_switch();
      }
      // 否则更新玩法集
      else {
        if (_old != undefined) {
          const { mid, csid } = route.params;
          get_category_list_info({
            sportId: csid,
            mid,
          });
        }
      }
    },
    { deep: true }
  );
  // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
  watch(
    () => match_detail.value?.ms,
    (_new, _old) => {
      let arr_ms = [0, 1, 2, 7, 10, 110];
      if (!arr_ms.includes(Number(_new)) && !_new) {
        event_switch();
      }
      // 赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
      else {
        // ms变更时才调用
        if (_new != _old && _old) {
          // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
          detail_init();
        }
      }
    },
    { deep: true }
  );
  /**
   *@description 详情页赛事结束自动切换赛事 todo
   *@param {Undefined}
   *@return {Object} 返回赛事各项id(球类id:csid/赛事id:mid/联赛id:tid)
   */
  let get_godetailpage = ref(true);
  function event_switch() {
    let { mid, csid, tid } = match_detail.value || route.params;
    let params = {
      // 查找参数 1:赛事列表(非滚球:今日 早盘...) 2:赛事详情(滚球) 3:赛事筛选 4:赛事搜索(int) 如果不传默认 1:赛事列表
      sm: 2,
      // 菜单ID 多个用逗号分割(字符串)
      euid: MenuData.get_euid(MenuData.current_lv_2_menu_i),
      // 早盘日期的参数 早盘 和 串关都要加 (字符串)
      md: -1,
      // 赛事种类id
      csid,
      // 联赛id
      tid,
      // 排序 int 类型 1按热门排序 2按时间排序(整型)
      sort: 1,
      // 搜索关键词 赛事搜索(字符串)
      keyword: lodash.trim(SearchData.search_txt) || "",
      // 用户id或者uuid
      cuid: cuid.value,
      // 赛事id
      mid,
    };

    api_common.get_detail_video(params).then((res) => {
      let event_data = lodash.get(res, "data", {});
   
  
    
      if (event_data && event_data.mid) {
        // 普通赛事跳电竞赛事，或者电竞赛事跳普通赛事，就需要重置菜单类型
        let flag1 = [100, 101, 103].includes(+event_data.csid);
        let flag2 = [100, 101, 103].includes(+params.csid);
        if (!get_godetailpage) {
          // 如果是从app直接进详情页
          if (flag1) {
            MenuData.set_menu_type(3000);
          } else {
            MenuData.set_menu_type("");
          }
        } else {
          // 如果是正常情况下触发了自动跳转
          if (flag1 !== flag2) {
            if (flag1) {
              MenuData.set_menu_type(3000);
            } else {
              MenuData.set_menu_type("");
            }
          }
        }
        router.replace( { name: "category", params: { mid: event_data.mid,csid:event_data.csid ,tid:event_data.tid} })
        // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
        get_matchDetail_MatchInfo({ mid: event_data.mid, cuid: event_data.csid  });
        // this.get_match_details({ mid: event_data.mid, cuid: this.get_uid });
        // 重新调用 详情页面玩法集接口(/v1/m/category/getCategoryList)
        // this.get_odds_list({ sportId: event_data.csid, mid: event_data.mid });
        // 存储设置新的赛事id
        MatchDetailCalss.set_match_details_params({ mid: event_data.mid,csid:event_data.csid ,tid:event_data.tid})
        // this.set_goto_detail_matchid(event_data.mid);
      } else {
        console.error('切换赛事');
        // 如果不是演播厅的，才有退出回到 列表
        // if (lodash.get(this.get_video_url, "active") != "lvs") {
        // 没有返回赛事数据就跳转到列表页
        router.go("-1");
        // }
      }
    });
  }
  watch(()=>route.params,(params)=>{
    mid.value = params.mid
    csid.value = params.csid
  })
  onUnmounted(() => {
    clear_all_timer();
    // 组件销毁时销毁监听函数
    ws_message_listener.ws_remove_message_listener(message_fun);
    message_fun = null;
    sessionStorage.removeItem("match_oddinfo")
  });
  return {
    detail_store,
    match_odds_info,
    match_detail,
    category_list,
    tab,
    cuid,
    scroller_height,
    loading,
    detail_event_tabs_value,
    timer,
    mst_timer,
    tab_selected_obj,
    change_header_fix,
    header_fix,
    fixedHeight,
    changeHeader,
    MatchDataWarehouseInstance,
    tabChange,
    detail_event_tabs_change,
    detail_scrolling,
    touchmove,
    touchend,
    touchstart,
    detail_tabs_change,
    get_info_show
  };
};
