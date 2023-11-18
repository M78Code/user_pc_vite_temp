import { api_match_list } from "src/api/index.js";
import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
import { onMounted, ref, watch, onUnmounted } from "vue";
import {
  MatchDetailCalss,
  MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,
  useMittOn,
  useMitt,
  MITT_TYPES,
  utils
} from "src/core/index";
import * as ws_message_listener from "src/core/utils/module/ws-message.js";

export const details_main = (router,route) => {
  const detail_store = ref(MatchDetailCalss); //todo
  const match_odds_info = ref([]);
  const match_detail = ref({});
  const category_list = ref([]);
  const tab = ref("betting");
  const cuid = ref("");
  const scroller_height = ref(0);
  const loading = ref(false);
  const detail_event_tabs_value = ref({ label: "Match", id: 1 });
  const timer = ref(null);
  const mst_timer = ref(null);
  const tab_selected_obj = ref({});
  const change_header_fix = ref(null);
  const header_fix = ref(null);
  const fixedHeight = ref(null);
  
  //初次加载
  const  init = ref(false)
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
    let arr = lodash.cloneDeep(get_match_odds_info.value);
    console.log(arr, "arr");
    const list = arr?.filter((item) => {
      let play = item.topKey;
      let topKeyArr = item.topKey.split("-");
      if (topKeyArr.length > 0) {
        play = topKeyArr[0];
      }
      m_plays.push(Number(play));
      return plays.includes(Number(play));
    });
    match_odds_info.value = [...list];
  };
  const startY = ref(0);
  const scroller_scroll_top = ref(0);
  const changeHeader = ref(false);
  /**
   *@description 监听页面触摸
   *@param {e} e 请求参数
   *@return {*}
   */
  const touchstart = (e) => {
    startY.value = e.targetTouches[0].pageY;
  };
  const touchend = (e) => {
    if (match_detail.value.mvs <= -1) {
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
    if (match_detail.value.mvs <= -1) {
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
    // match_odds_info.value = get_match_odds_info.value;
       //接口调用
       let obj_ = {
        // axios api对象
        axios_api: api_match_list.get_detail_list,
        // axios api对象参数
        params: params,
        // 唯一key值
        key: 'details',
        error_codes: ['0401038'],
        // axios中then回调方法
        fun_then: res => {
          get_match_odds_info.value = res.data;
          if (tab_selected_obj.value.marketName) {
            detail_tabs_change(tab_selected_obj.value);
          } else {
            match_odds_info.value = res.data;
          }
          MatchDataWarehouseInstance.set_match_details(
            MatchDataWarehouseInstance.get_quick_mid_obj(params.mid),
            match_odds_info.value
          );
          // 第一次加载显示进度条
           loading.value = false;
  
        },
        // axios中catch回调方法
        fun_catch: e => {
          console.log(e)
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop: init.value ? 3 : 1,
        // 异常调用时延时时间,毫秒数,默认1000
        timers: 1100
      }
      utils.axios_api_loop(obj_) 
  };

  /**
   *@description 获取详情页面玩法集接口(/v1/m/category/getCategoryList)
   *@param {obj} params 请求参数
   *@return {obj}
   */
  const get_category_list_info = (params) => {
    // category_list.value = get_category_list.value;
    api_match_list.get_detail_category(params).then((res) => {
      // console.log("get_category_list", res);
      category_list.value = res.data;
      if (!tab_selected_obj.value.id) {
        tab_selected_obj.value = lodash.get(res, "data[0]", {});
      }
      get_matchDetail_getMatchOddsInfo({
        mcid: 0,
        cuid: cuid.value,
        mid:params.mid,
        newUser: 0,
      });
    }).catch((err)=>console.log(err))
  };
  /**
   *@description 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
   *@param {obj} params 请求参数
   *@return {obj}
   */
  const get_matchDetail_MatchInfo = lodash.debounce((params) => {
      api_match_list.get_detail_data(params).then((res) => {
        const res_data = lodash.get(res, "data");
        if (res_data && res_data.mhid) {
          match_detail.value = res_data;
          match_detail.value.course =
            lodash.get(res_data, "ms") == 110
              ? "Soon"
              : courseData[lodash.get(res_data, "csid")][
                  lodash.get(res_data, "mmp")
                ] || "";
          match_detail.value.mstValueTime = format_mst_data(match_detail.value);
          use_polling_mst(match_detail.value);
        } else {
          clear_all_timer();
          router.replace("/");
        }
        // detail_store.get_detail_params
        MatchDataWarehouseInstance.set_match_details(match_detail.value, []);
        //初次调用成功后 赋值init未false
        // console.log("get_matchDetail_MatchInfo", res);
        const { mid, csid } = route.params;
        get_category_list_info({
          sportId: csid,
          mid,
        });
      })
    } ,1000) 
  /** 
   * @var mid 用于detail_init函数初始化的赛事id 
   * @var csid 用于detail_init函数初始化的csid 
   */
  let {mid, csid} = route.params;
  /**
   *@description 初始化
   *@param {*}
   *@return {*}
   */
  const detail_init = () => {
    get_matchDetail_MatchInfo({
      mid,
      cuid: cuid.value,
    });
  };
  /** 监听顶部刷新功能 */
  useMitt(MITT_TYPES.EMIT_REFRESH_DETAILS, (params)=>{
    mid = params.mid
    csid = params.csid
    detail_init()
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
  let message_fun = null
  onMounted(() => {
    loading.value = true;
    init.value = true;
    detail_init();
    const { mid, csid } = route.params;
    // 增加监听接受返回的监听函数 
    message_fun = ws_message_listener.ws_add_message_listener((cmd,data)=>{
    let flag =  MatchDetailCalss.handler_details_ws_cmd(cmd)
    console.error(flag,'flag','cmd:',cmd,data);
    //如果ms mmp变更了 就手动调用ws
    if(flag){
      init.value = false
      detail_init();
    }   
    })  
  });
  onUnmounted(() => {
    clear_all_timer();
    // 组件销毁时销毁监听函数
    ws_message_listener.ws_remove_message_listener(message_fun)
    message_fun = null
  });
  return {
     detail_store,
     match_odds_info,
     match_detail,
     category_list,
     tab,
     cuid,
     scroller_height,
     loading ,
     detail_event_tabs_value,
     timer ,
     mst_timer ,
     tab_selected_obj ,
     change_header_fix ,
     header_fix,
     fixedHeight,
     changeHeader,
     tabChange,
     detail_event_tabs_change,
     detail_scrolling,
     touchmove,
     touchend,
     touchstart,
     detail_tabs_change,
  }
};
