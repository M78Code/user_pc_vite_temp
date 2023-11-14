import { api_match_list } from "src/api/index.js";
import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
import { onMounted, ref, watch, onUnmounted } from "vue";
import {
  MatchDetailCalss,
  MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,
  useMittOn,
  MITT_TYPES,
} from "src/core";
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
  const get_matchDetail_getMatchOddsInfo = (params,init=false) => {
    //赛果页面调用赛果玩法详情接口
    // match_odds_info.value = get_match_odds_info.value;
    api_match_list.get_detail_list(params).then((res) => {
      // setTimeout(() => {
        
      // }, 1000);
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
       loading.value = !init;
    }).catch((err)=>console.log(err))

    // get_match_odds_info.value = get_match_odds_info_mock.data;
    // match_odds_info.value = get_match_odds_info_mock.data
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
      },true);
    }).catch((err)=>console.log(err))
  };
  /**
   *@description 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
   *@param {obj} params 请求参数
   *@return {obj}
   */
  const get_matchDetail_MatchInfo = (params) => {
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
      // console.log("get_matchDetail_MatchInfo", res);
      const { mid, csid } = route.params;
      get_category_list_info({
        sportId: csid,
        mid,
      });
    });

    // mock Start
    // match_detail.value = get_match_detail_mock.data;
    // match_detail.value.course = (get_match_detail_mock.data.ms === 110) ? 'Soon' : courseData[match_detail.value.csid][match_detail.value.mmp];
    // match_detail.value.mstValue = format_mst_data(match_detail.value.mst);
    // use_polling_mst(match_detail.value)
    // mock end
  };
  /**
   *@description 初始化
   *@param {*}
   *@return {*}
   */
  const detail_init = () => {
    const { mid, csid } = route.params;
    get_matchDetail_MatchInfo({
      mid,
      cuid: cuid.value,
    });

  
  
  };
  const timer_s_interval = (time = 4000) => {
    clear_all_timer();
    timer.value = setTimeout(() => {
      detail_init();
      timer_s_interval();
    }, time);
  };
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
  onMounted(() => {
    loading.value = true;
      detail_init();
      // timer_s_interval(4000);
  });
  // // 监听顶部刷新功能
  const { off } = useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, detail_init);
    //todo mitt 触发ws更新
  const {off:off_ws} = useMittOn(MITT_TYPES.EMIT_DATAWARE_DETAIL_UPDATE,(params)=>{
    switch (params.type) {
      case "oddinfo":
      const { mid, csid } = route.params;
       get_matchDetail_getMatchOddsInfo({
        mcid: 0,
        cuid: cuid.value,
        mid,
        newUser: 0,
      },true);
        break;
    
      default:
        break;
    }
  })
  onUnmounted(() => {
    clear_all_timer();
    off();
    off_ws()
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
