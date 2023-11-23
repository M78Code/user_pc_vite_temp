/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-07-09 16:21:30
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-11-22 19:07:56
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\detail\index.js
 * @Description: 详情页相关接口数据处理
 */
import { ref, onMounted, watch, onUnmounted } from "vue";
import { api_match_list } from "src/api";
import { useRouter } from "vue-router";
// import store from "src/store-redux-vuex/index.js";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,
  MenuData,
  UserCtr,
} from "src/core/index";
import {
  filter_odds_func,
  handle_course_data,
  format_mst_data,
} from "src/core/utils/matches_list.js";

import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/index.js";
import { LayOutMain_pc } from "src/core/";
import lodash_ from "lodash";

export function usedetailData(route) {
  const router = useRouter();
  const category_list = ref([]); //分类数据
  const detail_list = ref([]); //玩法数据
  const all_list = ref([]); //  所有玩法数据
  let all_list_toggle = {}; //  所有玩法数据展开关闭记录

  const detail_info = ref({}); //详情数据

  const current_key = ref(""); // 当前tab   key

  const detail_loading = ref(true); //loading

  const all_hl_item = ref([]);

  const tabList = ref([]);

  const show_close_thehand = ref(false); // 是否显示无数据图标

  const matchDetailList = ref([]);

  let timer = "";
  let mst_timer = "";
  // let state = store.getState();

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

  // 监听分类切换数据
  watch(current_key, (val) => {
    if(!val) return
    get_match_detail(val);
  });
  // 监听分类切换数据
  // watch(()=>route.query, (val) => {
  //   console.log(11111111,val)
  //   // todo
  //   // sportId = val.sportId
  //   // mid = val.mid
  //   current_id.value = val.mid
  // },
  // {immediate:true}
  // );

  //  根据分类id 过滤数据
  const get_match_detail = (value) => {
    const plays = category_list.value.find(
      (item) => item.orderNo == value
    ).plays;
    if (detail_list.value?.length > 0) {
      for (const i of detail_list.value) {
        all_list_toggle[i.hpid] = i.expanded === undefined ? true : i.expanded;
        if (i.hpid==103) {  //hpid103处理
          i.title = [
            {otd:1},
            {otd:0},
            {otd:2},
          ]
        }
      }
    }
    let list = all_list.value.filter((item) =>
      plays.includes(Number(item.hpid))
    );
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
    detail_list.value = lodash_.get(getMidInfo(route.params.mid), "odds_info") || []

    // console.log(1111111111,detail_list.value)

    



    show_close_thehand.value = list.length == 0;

    setTimeout(() => {
      get_all_hl_item();
    }, 3300);
  };

  const get_all_hl_item = () => {
    all_hl_item.value = [];
    if(!detail_list.value) return
    for (const item of detail_list.value) {
      if (item.hl.length > 0) {
        for (const opt of item.hl) {
          opt.ol.forEach((element) => {
            all_hl_item.value.push(element);
          });
        }
      }
    }
    // console.log(11111111,all_hl_item.value)
  };

  /**
   * 获取数据
   */
  const init = async () => {
    // all_list_toggle = {}
    detail_loading.value = true;
    get_detail();
    await get_category();
  };
  /**
   * 获取赛事详情数据
   */
  const get_detail = async () => {
    try {
      const params = {
        mid: mid,
        cuid: user_info.userId,
        t: new Date().getTime(),
      };
      detail_loading.value = true;
      const res = await get_detail_data(params);
      // 空赛事数据跳转回首页
      if (lodash_.isEmpty(res.data)) {
        router.push({
          name: "home",
        });
        return;
      }
      getMatchDetailList(res.data);
      detail_loading.value = false;
      detail_info.value = { ...detail_info.value, ...res.data };
      detail_info.value["course"] = handle_course_data(detail_info.value);

      LayOutMain_pc.set_oz_show_right(detail_info.value.ms > 0); // 显示右侧
      //存取赛事详情基础信息
      // console.log(detail_info.value,'detail_info.value')
      MatchDataWarehouseInstance.set_match_details(detail_info.value, []);

      // detail_info.value = getMidInfo(mid);
      useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, mid);
      use_polling_mst(detail_info.value);
    } catch (error) {
      console.error("get_detail_data", error);
    }
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
      const res = await getMatchDetailByTournamentId(params);
      matchDetailList.value = res.data;
    } catch (error) {
      console.error("getMatchDetailByTournamentId", error);
    }
  };

  /**
   * @name 开赛时间自动加1
   * @param {*} t
   */
  const use_polling_mst = (payload) => {
    if (Number(payload.mst) <= 0 || payload.ms !== 1) {
      return;
    }
    // payload.mst = Number(payload.mst)+10
    mst_timer = setInterval(() => {
      if (payload.csid == 1) {
        payload.mst++;
      } else if (payload.csid == 2) {
        if (Number(payload.mst) == 1) {
          clearInterval(mst_timer);
        }
        payload.mst--;
      }
      payload.mstValue = format_mst_data(payload.mst);
    }, 1000);
  };
  /**
   * 获取赛事tabs数据
   */
  const get_category = async () => {
    try {
      const params = {
        sportId,
        mid,
        t: new Date().getTime(),
      };
      const res = await get_detail_category(params);
      category_list.value = res.data || [];
      const list = res.data.filter((i) => i.marketName);

      tabList.value = list.map((item) => ({
        label: item.marketName,
        value: item.orderNo,
      }));
      await get_detail_lists();
    } catch (error) {
      console.error("get_detail_category", error);
    }
  };
  /**
   * 获取赛事列表数据
   */
  const get_detail_lists = async () => {
    try {
      const params = {
        mcid: 0,
        cuid: user_info.userId,
        mid,
        newUser: 0,
        t: new Date().getTime(),
      };
      const res = await get_detail_list(params);
      all_list.value = res.data || [];
      res.data.forEach((item) => (item.expanded = true));
      detail_loading.value = false;
      current_key.value = current_key.value
        ? current_key.value
        : tabList.value[0].value;

      get_match_detail(current_key.value);
    } catch (error) {
      console.error("get_detail_list", error);
    }
  };

  /**
   * @description: 通过mid获取从仓库获取最新的数据
   * @param {*} val  mid参数
   * @return {*}
   */
  const update_data = (val) => {
    if (!val) return;
    detail_info.value = getMidInfo(val);
    all_list.value = lodash_.get(getMidInfo(val), "odds_info");
   
  };
  /**
   * @description: 从仓库获取获取赛事信息
   * @param {*} mid
   * @return {*} 赛事详情
   */
  const getMidInfo = (mid) => {
    return MatchDataWarehouseInstance.get_quick_mid_obj(mid);
  };

  /*
   **监听数据仓库版本号
   */
  watch(
    () => MatchDataWarehouseInstance.data_version,
    (val, oldval) => {
      console.log("data_version", val.version);
      if (val.version) {
        update_data(route.params.mid);
      }
    },
    { deep: true }
  );

  onMounted(() => {
    sportId = route.params.csid;
    mid = route.params.mid;
    tid = route.params.tid;
    current_id.value = route.params.mid;
    LayOutMain_pc.set_oz_show_right(true); // 显示右侧
    LayOutMain_pc.set_oz_show_left(true); // 显示菜单
    init();
  });
  //todo mitt 触发ws更新
  const { off } = useMittOn(
    MITT_TYPES.EMIT_DATAWARE_DETAIL_UPDATE,
    (res) => {}
  );
  onUnmounted(() => {
    off();
    clearInterval(timer);
    clearInterval(mst_timer);
  });
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
    all_hl_item,
    init,
    show_close_thehand,
    matchDetailList,
    current_id,
  };
}
