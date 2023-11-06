<!--
 * @Author: rise
 * @Date: 2023-10-31 19:13:00
 * @LastEditors: rise
 * @LastEditTime: 2023-11-03 14:03:32
 * @Description:  
-->
<template>
  <template v-if="['matchList', 'sport_menu'].includes(route.name)">
    <!--  顶部菜单 -->
    <TopMenu />

    <div v-if="[3,6].includes(MenuData.current_lv_1_menu_mi.value)">
      <DateTab :dataList="dataList[MenuData.current_lv_1_menu_mi.value]"  />
    </div>

    <div v-if="[2000].includes(MenuData.current_lv_2_menu_i)">
        <DateTab :dataList="dataList[MenuData.current_lv_2_menu_i]"  />
    </div>
    <!-- 滑动菜单组件 -->
    <ScrollMenu :scrollDataList="ref_data.scroll_data_list" :current_mi="ref_data.current_mi" />
    <!--  -->
    <!-- <SwitchWap /> -->
    <!--  -->
    <SearchTab />
     <!-- 筛选+搜索  已脱离文档流-->
    <div v-if="select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="select_dialog = false" />
        <setect-league @closedHandle="select_dialog = false"></setect-league>
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
} from "vue";
import { useRoute } from "vue-router";
import lodash_ from "lodash";

import { MenuData,MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/";
import MatchFold from 'src/core/match-fold'
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { useMittOn,MITT_TYPES } from "src/core/mitt/index.js"

import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

import { TopMenu,ScrollMenu,SearchTab,DateTab } from 'src/base-h5/components/menu/app-h5-menu/index'
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { Base } from "licia/Class";

const route = useRoute();
const inner_height = window.innerHeight;  // 视口高度
const select_dialog = ref(false);//暂时筛选窗口

// 监听搜索框状态
useMittOn(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, function (value) {
    select_dialog.value = value
  }).off

  onMounted(()=>{
    set_scroll_data_list(MenuData.current_lv_1_menu_mi.value)
    useMittOn(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE, set_scroll_current)
  })

  onUnmounted(()=>{
    useMittOn(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE).off
  })

  /**
   * 早盘串关日期格式
   */
  const dataList = reactive({
    3: dateTabList(new Date()),
    6: dateTabList(new Date(new Date().getTime()+24*60*60*1000),{name:"今日",val:new Date()}),
    2000: dateTabList(new Date(new Date().getTime()+24*60*60*1000),{name:"今日",val:new Date()})
  });

  const ref_data = reactive({
    // 滑动菜单需要的数据
    scroll_data_list: [],
    // 滑动菜单选中的菜单id
    current_mi: ''
  })

  // 设置滑动菜单的选中id
  const set_scroll_current = val => {
    ref_data.current_mi = val.mi
    // 设置二级菜单 
    MenuData.set_current_lv_2_menu_i(val)
    // 设置菜单属性
    if([300,2000,50000].includes(+val.mi)){
      // 设置vr /收藏 电竞 头信息
      MenuData.set_top_menu_title(val)
      // 清空一级菜单显示 用于后续更新
      MenuData.current_lv_1_menu_mi.value = ''
      // 设置 对应菜单的数据
      switch(+val.mi){
        case 300:
          ref_data.scroll_data_list = MenuData.get_menu_lvmi_special_list(val.mi)
          break

        case 2000:
          ref_data.scroll_data_list = BaseData.dianjing_sublist
          break  
        
        case 50000:
          let menu_list_res = MenuData.get_menu_lvmi_list_only(MenuData.current_lv_1_menu_i)
          console.error('menu_list_res',menu_list_res)
          menu_list_res.unshift({mi:0,btn:1, ct:"",title:"全部"})
          ref_data.scroll_data_list = menu_list_res
          MenuData.set_collect_list(menu_list_res)
          MenuData.set_collect_menu_type(50000)
          break  
      }

      let obj = lodash_.get(ref_data.scroll_data_list,`[0]`,{})
      // 设置选中菜单的id
      ref_data.current_mi = obj.mi
      // 设置二级菜单 
      MenuData.set_current_lv_2_menu_i(obj)
    }
    
    set_menu_mi_change_get_api_data()
  }

  watch(()=> MenuData.current_lv_1_menu_mi.value, new_ => {
    // 今日 滚球 冠军
    if( [1,2,400].includes(1*new_) ){
      set_scroll_data_list(new_)
    }
  })

  // 根据一级菜单 设置滑动菜单数据
  const set_scroll_data_list = mid => {
    ref_data.scroll_data_list = MenuData.get_menu_lvmi_list(mid)
    let index = 0
    // 今日/滚球第一位是收藏 默认选中足球/全部 
    if( [1,2].includes(mid*1) ){
      index = 1
    }
    let obj = lodash_.get(ref_data.scroll_data_list,`[${index}]`,{})
    // 设置二级菜单 
    MenuData.set_current_lv_2_menu_i(obj)
    // 设置选中菜单的id
    ref_data.current_mi = obj.mi

    set_menu_mi_change_get_api_data()
  }

  // 菜单变化页面请求数据
  const set_menu_mi_change_get_api_data = () => {
    // 今日 / 滚球 
    if([1,2].includes(MenuData.current_lv_1_menu_mi.value)){
      handle_match_render_data()
    }
    // 冠军
    if(MenuData.current_lv_1_menu_mi.value == 400){
      MatchMeta.get_champion_match()
    }
    // 电竞
    if(MenuData.top_menu_title.mi == 2000){
      MatchMeta.get_esports_match()
    }
    // 收藏
    if(MenuData.top_menu_title.mi == 50000){
      MatchMeta.get_collect_match()
    }
  }
  /**
   * @description 处理赛事列表渲染数据
   */
  const handle_match_render_data = () => {
    // 清除赛事折叠信息
    MatchDataBaseH5.init()
    MatchFold.clear_fold_info()
    // 冠军拉取旧接口； 待 元数据提供 冠军赛事后 再删除
    if (MenuData.is_kemp()) return MatchMeta.get_champion_match()
    // 赛果不走元数据， 直接拉取接口
    if (MenuData.is_results()) return MatchMeta.get_results_match()
    // 电竞不走元数据， 直接拉取接口
    if (MenuData.is_export()) return MatchMeta.get_esports_match()

    const mi_tid_mids_res = lodash_.get(BaseData, 'mi_tid_mids_res')
    if (lodash_.isEmpty(mi_tid_mids_res)) return

    // 设置菜单对应源数据

    MatchMeta.set_origin_match_data()
  }

</script>
<style lang="scss" scoped>
.select-mask {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  z-index: 2000;
  left: 0
}
</style>