/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-07-09 16:21:30
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-17 14:25:41
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\detail\index.js
 * @Description: 详情页相关接口数据处理
 */
import { ref, onMounted, watch, onUnmounted } from "vue";
import { api_match_list } from "src/api";
import { useRoute } from "vue-router";
import {match_info,categoryList,matchDetail} from './mock'
// import store from "src/store-redux-vuex/index.js";

import { filter_odds_func, handle_course_data, format_mst_data } from './matches_list'

export function usedetailData() {
  const route = useRoute();
  const category_list = ref([]); //分类数据
  const detail_list = ref([]); //玩法数据
  const all_list = ref([]); //  所有玩法数据
  let all_list_toggle = {}; //  所有玩法数据展开关闭记录

  const detail_info = ref({}); //详情数据

  const current_key = ref(""); // 当前tab   key

  const detail_loading = ref(true); //loading

  const all_hl_item = ref([]);

  const tabList = ref([]);

  const show_close_thehand = ref(false)  // 是否显示无数据图标

 const matchDetailList = ref([])

  let timer = "";
  let mst_timer = "";
  // let state = store.getState();

  const { get_detail_category, get_detail_list, get_detail_data ,getMatchDetailByTournamentId} =
    api_match_list; // 接口

  //const userInfo = state.userReducer.userInfo; // 用户数据
  const userInfo = {}; // 用户数据

  const current_id = ref()

  let sportId, mid

  // 监听分类切换数据
  watch(current_key, (val) => {
    getDetailData(val);
  });
    // 监听分类切换数据
    watch(()=>route.query, (val) => {
    
      sportId = val.sportId
      mid = val.mid
      current_id.value = val.mid
    },
    {immediate:true}
    );

  //  根据分类id 过滤数据
  const getDetailData = (value) => {
    const plays = category_list.value.find(
      (item) => item.orderNo == value
    ).plays;
    if (detail_list.value.length > 0) {
      for (const i of detail_list.value) {
        all_list_toggle[i.hpid] = i.expanded === undefined ? true : i.expanded;
      }
      
    }
    let list = all_list.value.filter((item) =>
      plays.includes(Number(item.hpid))
    );
    if (list.length > 0) {
      for (const item of list) {
        item.expanded = all_list_toggle[item.hpid]
      }
      list = list.filter(i=>i.hpn)
    }
    detail_list.value = list ||[];
   
    show_close_thehand.value = list.length==0


    setTimeout(() => {
      get_all_hl_item();
    }, 3300);
  };

  const get_all_hl_item = () => {
    all_hl_item.value = [];
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
    // detail_loading.value = true;
    await get_category();
    get_detail();
    await get_detail_lists();
  };
  /**
   * 获取赛事详情数据
   */
  const get_detail = async () => {
    try {
      const params = {
        mid,
        cuid: userInfo.userId,
        t: new Date().getTime(),
      };
      detail_loading.value = true;
      console.log(1111111111111,match_info)
      // const res = await get_detail_data(params);

     
      getMatchDetailList(match_info.data)
      detail_loading.value = false;
      detail_info.value ={...detail_info.value,...match_info.data}
      detail_info.value['course'] = handle_course_data(detail_info.value);
      use_polling_mst(detail_info.value);
    } catch (error) {}
  };

    /**
   * 获取联赛赛事列表
   */
    const getMatchDetailList = async (data) => {
      try {
        // const params = {
        //   tId: data.tid,
        //   t: new Date().getTime(),
        // };
        // const res = await getMatchDetailByTournamentId(params);
        matchDetailList.value = matchDetail.data
      //  console.log(1111111111111,res)
      } catch (error) {}
    };

  
  /**
   * @name 开赛时间自动加1
   * @param {*} t 
   */
  const use_polling_mst = payload => {
    if (Number(payload.mst) <= 0 || payload.ms !== 1) {
    
      return 
    }
    // payload.mst = Number(payload.mst)+10
    mst_timer = setInterval(() => {
      
      if (payload.csid==1) {
        payload.mst++
      }else if (payload.csid==2) {
        if (Number(payload.mst) == 1) {
          clearInterval(mst_timer);
        }
        payload.mst--
      }
      payload.mstValue = format_mst_data(payload.mst)
    }, 1000)
  }
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
      // const res = await get_detail_category(params);
      category_list.value =categoryList.data || [];
      const list = categoryList.data.filter((i) => i.marketName);

      tabList.value = list.map((item) => ({
        label: item.marketName,
        value: item.orderNo,
      }));
    } catch (error) {}
  };
  /**
   * 获取赛事列表数据
   */
  const get_detail_lists = async () => {
    try {
      const params = {
        mcid: 0,
        cuid: userInfo.userId,
        mid,
        newUser: 0,
        t: new Date().getTime(),
      };
      // const res = await get_detail_list(params);
      all_list.value = matchDetail.data || [];
       all_list.value.forEach(item=>item.expanded = true)
      // detail_loading.value = false;
      current_key.value = current_key.value
        ? current_key.value
        : tabList.value[0].value;
      getDetailData(current_key.value);
    } catch (error) {}
  };

  onMounted(() => {
    init();
    timer = setInterval(async () => {
      await get_category();
      await get_detail_lists();
    }, 5000);
  });
  onUnmounted(() => {
    clearInterval(timer);
    clearInterval(mst_timer);
  });

  const refresh = ({sportId,mid})=>{
    all_list_toggle = {}
    detail_list.value = []
   sportId = sportId
   mid = mid
   current_id.value = mid
   init();
  }

  return {
    tabList,
    category_list,
    detail_list,
    current_key,
    detail_loading,
    detail_info,

    sportId,
    all_hl_item,
    init,
    show_close_thehand,
    matchDetailList,
    current_id,
    refresh
  };
}
