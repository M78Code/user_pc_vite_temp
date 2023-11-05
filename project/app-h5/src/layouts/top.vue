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

    <div v-if="[2000].includes(MenuData.current_lv_2_menu_mi)">
        <DateTab :dataList="dataList[MenuData.current_lv_2_menu_mi]"  />
    </div>
    <!-- 滑动菜单组件 -->
    <ScrollMenu :scrollDataList="ref_data.scroll_data_list" :current_mi="ref_data.current_mi" @set_current="set_current" />
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
  reactive,
  ref,
  watch,
} from "vue";
import { useMittOn, MITT_TYPES,MenuData } from "src/core/";
import lodash_ from "lodash";

import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

import { TopMenu,ScrollMenu,SearchTab,SwitchWap,DateTab } from 'src/base-h5/components/menu/app-h5-menu/index'
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { useRoute } from "vue-router";
const route = useRoute();
const inner_height = window.innerHeight;  // 视口高度
const select_dialog = ref(false);//暂时筛选窗口

// 监听搜索框状态
useMittOn(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, function (value) {
    select_dialog.value = value
  }).off

  onMounted(()=>{
    set_scroll_data_list(MenuData.current_lv_1_menu_mi.value)
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
  const set_current = val => {
    ref_data.current_mi = val.mi
  }

  watch(()=> MenuData.current_lv_1_menu_mi.value, new_ => {
    console.error('new_',new_)
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
    MenuData.set_current_lv_2_menu_mi(obj)
    // 设置选中菜单的id
    ref_data.current_mi = obj.mi
    console.error('ref_data.scroll_data_list ',ref_data.scroll_data_list )
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