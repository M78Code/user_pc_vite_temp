<!--
 * @Author: rise
 * @Date: 2023-10-31 19:13:00
 * @LastEditors: rise
 * @LastEditTime: 2023-11-03 14:03:32
 * @Description:  
-->
<template>
  <template v-if="['matchList', 'sport_menu', 'esports_sports'].includes(route.name)">
    <!--  顶部菜单 -->
    <div class="long3_icon">

      <!-- 主题换肤 龙年元素 日间：theme-2   夜间：theme-1  -->
      <img v-if="UserCtr.theme == 'theme-2'" :src="h5_long_bg"  alt="">
      <img v-if="UserCtr.theme == 'theme-1'" :src="h5_long_gb2"  alt="">

      <TopMenu />
      <div v-show="[3, 6].includes(MenuData.current_lv_1_menu_mi.value)">
        <DateTab @changeDate="setDate" ref="dateTabMenu" :dataList="dataList[MenuData.current_lv_1_menu_i]" />
      </div>

      <!-- <div v-if="+MenuData.get_menu_type_special() == 2000"> -->
      <div v-show="[2000].includes(MenuData.top_menu_title?.mi)">
        <!-- dataList[2000] -->
        <DateTab @changeDate="setDate" ref="dJdateTabMenu" :dataList="dataListEsports" />
      </div>
      <!-- 滑动菜单组件 -->
      <ScrollMenu ref="scrollTabMenu" :is_kemp_esports="is_kemp_esports" :scrollDataList="ref_data.scroll_data_list"
        @changeList="changeList" @changeMenu="set_scroll_current" :current_mi="ref_data.current_mi" />
    </div>

    <!--  -->
    <SwitchWap v-if="is_show_switch_wap" />
    <!--  -->
    <!-- v-if="MenuData.current_lv_1_menu_i =='2'" -->
    <SearchTab ref="searchTabMenu" v-if="MenuData.menu_csid === 1 && MenuData.current_lv_1_menu_mi.value != 400" />
    <!-- 筛选+搜索  已脱离文档流-->
    <div v-if="select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
      <div style="height:100%;width: 100%" @click="select_dialog = false" />
      <setect-league @closedHandle="setect_league_chose"></setect-league>
    </div>
  </template>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  computed,
  nextTick
} from "vue";
import { useRoute, useRouter } from "vue-router";
import lodash_ from "lodash";
import { MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, UserCtr } from "src/output/index.js";
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

import { TopMenu, ScrollMenu, SearchTab, DateTab, SwitchWap } from 'src/base-h5/components/menu/app-h5-menu/index'
import { h5_long_bg, h5_long_gb2 } from 'src/base-h5/core/utils/local-image.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

import setectLeague from 'src/base-h5/components/setect-league/index.vue'

import { is_esports, is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import { get_collect_count } from 'src/core/collect/collect-class.js'
const route = useRoute();
const router = useRouter()
const inner_height = window.innerHeight;  // 视口高度
const select_dialog = ref(false);//暂时筛选窗口dJ
const dateTabMenu = ref(null);//时间dom
const dJdateTabMenu = ref(null);//电竞时间dom
const is_kemp_esports = ref(false);//电竞冠军
const scrollTabMenu = ref(null);//滚球dom
const searchTabMenu = ref(null);//足球tab dom
// const mitt_list=[
//   useMittOn(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, function (value) {
//     select_dialog.value = value
//   }).off
// ]
const emitters = ref({});
/**
 * 早盘串关日期格式
 */
const dataList = reactive({
  3: dateTabList(new Date().getHours()<12?new Date(new Date().getTime()):new Date(new Date().getTime() + 24 * 60 * 60 * 1000)), //早盘下一天开始
  6: dateTabList(new Date().getHours()<12?new Date(new Date().getTime()):new Date(new Date().getTime() + 24 * 60 * 60 * 1000), [{ name: "今日", val: '0' }]),
  // 2000: dateTabList(new Date(new Date().getTime()+24*60*60*1000),[{name:"所有日期",val:''},{name:"今日",val:new Date().getTime()}])
});
const dataListEsports = ref([]);
const ref_data = reactive({
  // 滑动菜单需要的数据
  scroll_data_list: [],
  // 滑动菜单选中的菜单id
  current_mi: '',
})
onMounted(() => {
  // set_scroll_data_list(MenuData.current_lv_1_menu_mi.value,1)
  init_data(MenuData.current_lv_1_menu_mi.value, 1)
  // mitt_list.push(useMittOn(MITT_TYPES.EMIT_MENU_GO_BACK, menu_go_back).off)
  // useMittOn(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE, set_scroll_current)
  // useMittOn(MITT_TYPES.EMIT_SCROLL_DATE_TIME_CHANGE, set_scroll_early_single)
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SELECT_LEAGUE_COMPLETE, lodash_.debounce((val) => {
      searchTabMenu.value?.searchTabMenu(0);//设置联赛未0
      MenuData.search_data_tab_index(0, val?.select_list?.map(n => { return n.tournamentId })?.join(), val?.select_list?.length?val?.select_list:"");
    }, 100)).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MENU_GO_BACK, menu_go_back).off,
    emitter_3: useMittOn(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, function (value) {
      select_dialog.value = value
    }).off
  };
})
onUnmounted(() => {
  // useMittOn(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE).off
  // useMittOn(MITT_TYPES.EMIT_SCROLL_DATE_TIME_CHANGE).off
  // mitt_list.forEach(fun=>fun())
  Object.values(emitters.value).map((x) => x());
})


/**
 * @description 左侧菜单回退
 */
const menu_go_back = (val) => {
  nextTick(() => {
    dJdateTabMenu.value.set_active_val();
  })
}
// 参考开云 冠军 赛果 电竞 不显示
const is_show_switch_wap = computed(() => {
  return !is_esports.value && !is_results.value && !is_kemp.value
})
/**
 * 联赛筛选处理-关闭
 */
const setect_league_chose = () => {
  select_dialog.value = false;
}
const changeList = (list) => {
  ref_data.scroll_data_list = list;
}
// 设置滑动菜单的选中id
const set_scroll_current = async (val, type) => {
  try{
  handler_go_to_top()
  if (MenuData.is_esports() && !type) {
    const data_list_esports = await MenuData.getDateList(val?.csid);
    dataListEsports.value = data_list_esports;
    ref_data.current_mi = val.mi;
    val.old_csid = val.csid || MenuData.current_lv_2_menu?.csid;
    MenuData.set_current_lv_2_menu_i(val);
    nextTick(() => {
      dJdateTabMenu.value.set_active_val();
      dJdateTabMenu.value?.changeTabMenu({}, 0, '', type);
    })
    return;
  }
  switch (+val.mi) {
    case 2000:
      const is_session = type && MenuData.current_lv_2_menu?.mi;
      //电竞重新设置单关
      BetData.set_is_bet_single('single')
      UserCtr.sort_type == 1 && UserCtr.set_sort_type(2) //电竞没有热门排序 只有时间
      // ref_data.scroll_data_list = [];
      MenuData.set_current_lv1_menu(val.mi);
      !type && MenuData.set_date_time(0, '');
      ref_data.scroll_data_list = BaseData.dianjing_sublist;
      // 设置vr /收藏 电竞 头信息
      MenuData.set_top_menu_title(val)
      let obj = lodash_.get(ref_data.scroll_data_list, `[0]`, {})
      // 设置选中菜单的id
      ref_data.current_mi = is_session ? MenuData.current_lv_2_menu_i : obj.mi
      // 设置二级菜单 
      !type && MenuData.set_current_lv_2_menu_i(type && MenuData.current_lv_2_menu_i ? MenuData.current_lv_2_menu : obj)
      const data_list_esports = await MenuData.getDateList(val?.csid || MenuData.current_lv_2_menu?.old_csid || BaseData.dianjing_sublist[0].csid);
      dataListEsports.value = data_list_esports;
      get_collect_count();
      nextTick(() => {
        dJdateTabMenu.value.set_active_val();
        dJdateTabMenu.value?.changeTabMenu({}, MenuData.data_tab_index||0, '', type);
      })
      // handle_match_render_data(type)
      break;
    case 300:
      //vr重新设置单关
      BetData.set_is_bet_single('single')
      // ref_data.scroll_data_list = MenuData.get_menu_lvmi_special_list(val.mi)
      router.push('/virtual');
      break;
    case 50000: //收藏
      ////////////////////////////////////
      // val.title = '我的收藏'
      // let menu_list_res = MenuData.get_menu_lvmi_list_only(MenuData.current_lv_1_menu_i)
      // const all_ct = menu_list_res.map((item)=>{return item.ct||0}).reduce((n1,n2)=>{return n1+n2}) || 0;//全部
      // menu_list_res.unshift({mi:0,btn:1, ct:all_ct,title:"全部"})
      // ref_data.scroll_data_list = menu_list_res

      // MenuData.set_collect_list(menu_list_res)
      // MenuData.set_collect_menu_type(50000)
      ref_data.current_mi = val.mi;
      MenuData.set_current_lv_2_menu_i(val);
      handle_match_render_data()
      break
    default:
      ref_data.current_mi = val.mi
      !type && MenuData.search_data_tab_index();//清除联赛缓存
      // 设置二级菜单 
      MenuData.set_current_lv_2_menu_i(val)
      handle_match_render_data()
      break;
  }
} catch (err){
  console.error('二级菜单切换错误：'+err)
}
}
/**
 * 时间切换
 * @param {*} type 
 */
const setDate = (type) => {
  handler_go_to_top()
  !type && MenuData.search_data_tab_index();//清除联赛缓存
  if ([3, 6].includes(MenuData.current_lv_1_menu_mi.value)) {
    set_scroll_data_list(MenuData.current_lv_1_menu_mi.value, type)
  } else {
    is_kemp_esports.value = MenuData.get_mm_is_champion()
    handle_match_render_data();
  }
}

// 通知回到顶部
const handler_go_to_top = () => {
  try {
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
  } catch (err){
    console.error('通知回到顶部错误：'+err)
  }
  
}
/**
 * 
 * @param {*} new_ 
 */
const init_data = (new_, type) => {
  if (new_ == 300) return;
  if (!MenuData.top_menu_title?.mi) {
    ref_data.scroll_data_list = [];
    if ([3, 6].includes(1 * new_)) {
      nextTick(() => {
        const index = type && MenuData.data_tab_index ? MenuData.data_tab_index : 0;
        dateTabMenu.value?.set_active_val()
        dateTabMenu.value?.changeTabMenu(dataList[MenuData.current_lv_1_menu_i]?.[index], index, '', type)
      })
    } else {
      set_scroll_data_list(new_, type)
    }
  }
  //300,
  if (type && [2000].includes(MenuData.top_menu_title?.mi)) {
    set_scroll_current(MenuData.top_menu_title, type)
  }
  //球种滚动初始化
  nextTick(() => {
    try {
      scrollTabMenu.value?.scrollTabMenu();
      searchTabMenu.value?.searchTabMenu(0);//设置联赛未0
      //缓存存在 并且为足球  调用筛选接口
      if (MenuData.menu_csid === 1 && MenuData.current_lv_1_menu_mi.value != 400 && MenuData.search_tab_index) {
        searchTabMenu.value?.changeTab(MenuData.search_tab_index)
      }
    } catch (_ee) { 
      console.error('球种滚动初始化错误：'+_ee)
    }
  })
}
watch(() => MenuData.current_lv_1_menu_mi.value, (new_, old_) => {
  MenuData.set_old_current_lv_1_menu_i([2000, 300].includes(new_) ? old_ : '');//电竞vr记录旧菜单id
  MenuData.search_data_tab_index();//清除足球联赛缓存
  init_data(new_, old_ == 28 ? 1 : 0)
  // 重置热门联赛
  MatchResponsive.set_popular_league({})
})
// 早盘 串关  电竞
// const set_scroll_early_single = (params) => {
//   const {val={},type=0} = params;
//   const is_lv_1 = [3,6].includes(+MenuData.current_lv_1_menu_i);
//   const menu_list = is_lv_1?MenuData.get_menu_lvmi_list_only(MenuData.current_lv_1_menu_i):BaseData.dianjing_sublist;
//   let early_single = []
//   if(Object.keys(val).length){
//     for(let item in val){
//       let mi = is_lv_1?100+ item*1 +''+ MenuData.current_lv_1_menu_i:2000+ item*1 +'';
//       let mif = is_lv_1?100+ item*1 +'':2000+ item*1 +'';
//       let obj = menu_list.find(page => page.mi == mi) || {}
//       if(obj.mi){
//         obj.ct = val[item]
//         obj.mif = mif;
//         early_single.push(obj)
//       }
//     }
//   }
//   ref_data.scroll_data_list = early_single
//   if(early_single.length){
//     let obj_ = lodash_.get(ref_data.scroll_data_list,`[0]`,{})
//     // 设置选中菜单的id
//     ref_data.current_mi = type && MenuData.current_lv_2_menu_i?MenuData.current_lv_2_menu_i:obj_.mi
//     // 设置二级菜单 
//     !type && MenuData.set_current_lv_2_menu_i(type && MenuData.current_lv_2_menu_i?MenuData.current_lv_2_menu:obj_)

//     handle_match_render_data()
//   } else {
//     useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, { state: true, type: 'noMatch' });
//   }
// }

// 根据一级菜单 设置滑动菜单数据
const set_scroll_data_list = (mid, type) => {
  handler_go_to_top()
  ref_data.scroll_data_list = MenuData.get_menu_lvmi_list(mid);
  const is_sport_id = ref_data.scroll_data_list.some(n => { return MenuData.current_lv_2_menu_i && MenuData.recombine_menu_desc(n.mi) == MenuData.recombine_menu_desc(MenuData.current_lv_2_menu_i) });
  // let index = 0
  // 今日/滚球第一位是收藏 默认选中足球/全部 
  // if( [1,2].includes(mid*1) ){
  //   index = 1
  // }
  if (MenuData.is_collect() && [3, 6].includes(MenuData.current_lv_1_menu_mi.value)) {
    ref_data.current_mi = MenuData.current_lv_2_menu_i;
  } else if (is_sport_id && [1, 2, 3, 6].includes(MenuData.current_lv_1_menu_mi.value)) {
    const current_mi = `${MenuData.recombine_menu_desc(MenuData.current_lv_2_menu_i)}${MenuData.current_lv_1_menu_mi.value}`;
    ref_data.current_mi = current_mi;
    MenuData.set_current_lv_2_menu_i(ref_data.scroll_data_list.find(n => { return n.mi == current_mi }))
  } else {
    let obj = lodash_.get(ref_data.scroll_data_list, `[${0}]`, {})
    // 设置二级菜单 
    MenuData.set_current_lv_2_menu_i(obj, type)
    // 设置选中菜单的id
    ref_data.current_mi = type && MenuData.current_lv_2_menu_i ? MenuData.current_lv_2_menu_i : obj.mi
  }

  // !type && handle_match_render_data()
  handle_match_render_data()
}

// 菜单变化页面请求数据
// const set_menu_mi_change_get_api_data = (type) => {
//   // 收藏
//   if(MenuData.is_collect()){
//     // 电竞收藏
//     if (MenuData.is_esports()) {
//       MatchMeta.get_esports_collect_match()
//     } else {
//       MatchMeta.get_collect_match()
//     }
//     return 
//   }
//   // 今日 / 滚球 早盘 串关 
//   if([1,2,3,6].includes(MenuData.current_lv_1_menu_mi.value)){
//     if (MenuData.top_menu_title.mi !== 2000) handle_match_render_data()
//     return;
//   }
//   // 冠军
//   if(MenuData.is_kemp_mi()){
//     return MatchMeta.get_champion_match();
//   }
//   // 电竞
//   if(MenuData.is_esports() && !type)return MatchMeta.get_esports_match();

// }
/**
 * @description 处理赛事列表渲染数据
 */
const handle_match_render_data = (type) => {
  // 清除赛事折叠信息
  MatchDataBaseH5.init()
  // MatchFold.clear_fold_info()
  if (MenuData.is_collect()) {
    // 电竞收藏
    if (MenuData.is_esports()) {
      MatchMeta.get_esports_collect_match()
    } else {
      MatchMeta.get_collect_match()
    }
    return
  }
  // 冠军拉取旧接口； 待 元数据提供 冠军赛事后 再删除
  if (MenuData.is_kemp()) return MatchMeta.get_champion_match()
  // 赛果不走元数据， 直接拉取接口
  // if (MenuData.is_results()) return MatchMeta.get_results_match()
  // 电竞不走元数据， 直接拉取接口
  if (MenuData.is_esports()) return MatchMeta.get_esports_match()

  const mi_tid_mids_res = lodash_.get(BaseData, 'mi_tid_mids_res')
  if (lodash_.isEmpty(mi_tid_mids_res)) return
  // // 设置菜单对应源数据 以及 获取数据
  // if (MenuData.top_menu_title.mi === 50000) return
  MatchMeta.set_origin_match_data({ md: MenuData.data_time })
  // 今日 下 得足球  提前设置 热门联赛
  // if (MenuData.current_lv_2_menu_i === '1012') MatchMeta.set_tid_map_mids()
}

</script>
<style lang="scss" scoped>
.long3_icon{
  // background-image: url($SCSSPROJECTPATH+"/image/home/h5_long3.png") !important;
  > img{
    position: absolute;
  }
}
.select-mask {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  z-index: 2000;
  left: 0
}
</style>