
<template>
  <div v-show="false"> {{ MenuData.menu_data_version }}-{{ BaseData.base_data_version }} </div>
  <div class="left-container">
    <!-- 左侧菜单 -->
    <div class="menu-nav-li">
      <ul class="menu-list menu-favouritse">
        <li class="f-s-c" @click="go_to_favouritse" :class="MenuData.is_collect ?'active':''">
          <i class="icon-star q-icon c-icon icon"></i>
          {{ i18n_t("ouzhou.menu.collect") }}
        </li>
      </ul>
    </div>
    <div v-show="false">{{ BaseData.base_data_version }}-{{MenuData.menu_data_version}}-{{MenuData.left_menu_result.lv1_mi}}</div>
    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.popular") }}</p>
      <ul class="menu-list">
        <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_result.lv1_mi == item.mi && MenuData.left_menu_result.menu_type==0 }" v-for="item in ref_data.popular" :key="item.mi"
          @click="jump_func(item,'0')">
          <sport-icon :sport_id="BaseData.compute_sport_id(item.mi)" key_name="pc-left-menu-bg-active-image" size="18" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[item.mi] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.all_sports")}}</p>
      <ul class="menu-list">
        <template v-for="item in MenuData.left_menu_list" :key="item">
          <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_result.lv1_mi  == item.mi && MenuData.left_menu_result.menu_type==1 }"
           v-if="item.ct" @click="jump_func(item,'1')">
            <sport-icon :sport_id="BaseData.compute_sport_id(item.mi)" key_name="pc-left-menu-bg-active-image"  size="18" class="icon" />
            {{ (BaseData.menus_i18n_map || {})[item.mi] || "" }}
          </li>
        </template>
      </ul>
    </div>
    <div class="menu-nav-line" />
    <div class="menu-nav-li" >
      <ul class="menu-list">
        <li class="f-s-c" @click="outrights" :class="{ 'menu_checked': MenuData.is_kemp() && !MenuData.is_common_kemp() && !MenuData.is_collect_kemp() }">
          <sport-icon :sport_id="BaseData.compute_sport_id(400)" key_name="pc-left-menu-bg-active-image" size="18" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[400] || "" }}
        </li>
        <li class="f-s-c" @click="vrClick()" :class="{ 'menu_checked': MenuData.is_vr()}">
          <sport-icon :sport_id="BaseData.compute_sport_id(300)" key_name="pc-left-menu-bg-active-image" size="18" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[300] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-line"></div>

  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, nextTick, reactive } from "vue";
import { useRouter,useRoute } from "vue-router";
import BaseData from "src/core/base-data/base-data.js";
import sportIcon from "src/components/sport_icon/sport-icon.vue";
// 菜单配置
import { MenuData,useMittEmit,MITT_TYPES,useMittOn } from "src/output/index.js"
import { get_visit_sports_list,set_visit_count_list } from "src/core/menu_config/visit_count.js"
import lodash_ from "lodash"
import BetData from "src/core/bet/class/bet-data-class.js"

const ref_data = reactive({
  popular: [],
  emit_lsit: {}
})
// 默认值
let popular_list = [{mi:101,ct:1},{mi:102,ct:1},{mi:105,ct:1}]

const router = useRouter();
const route = useRoute();

onMounted(()=>{
  get_visit_sports_list()

  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SET_VISIT_SPORTS_LIST, set_get_visit_sports_list).off,
  }
})

// 获取最近访问信息
const set_get_visit_sports_list = (data = []) =>{
    
    let map_data = data.map(item => {
      return {
        mi: item*1 + 100,
        ct: 1
      }
    })
    // 默认值和 数据结合 
    let popular = lodash_.concat(map_data,popular_list)
    // 去重
    popular = lodash_.uniqWith(popular, lodash_.isEqual)
    // 显示前三
    ref_data.popular = lodash_.slice(popular,0,3)
}

// favouritse
const go_to_favouritse = () => {
  // 点击收藏时清除其他球种选中状态
  // if(MenuData.is_collect)return
  MenuData.left_menu_result.lv1_mi = ''
  // 点击菜单的时候如果在详情页应跳转出来先
  if (['league','details'].includes(route.name)) {
    router.push('/home')
  }
  MenuData.set_is_collect(true)
  MenuData.set_menu_root(301)

  let mid_config = {
    ...MenuData.mid_menu_result,
    filter_tab: 3001, // 滚球 3001 早盘 3002  今日 3003
    current_mi: 1011, // 当前选中的赛种id
  }
  MenuData.set_menu_current_mi(1011)
  MenuData.set_mid_menu_result(mid_config)
  MenuData.set_current_ball_type(1)

  // nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE_FAVOURITES)
  // })
}
/**
 * 
 * @param {Object} payload 菜单信息 
 * @description 点击菜单item 存储当前菜单信息
 * @returns {undefind} 无返回值
 */
const jump_func = (payload ={},type) => {
  // if(MenuData.left_menu_result.lv1_mi  == payload.mi && MenuData.left_menu_result.menu_type==type ){
  //   return
  // }
  // 电竞
  if(payload.mi == 2000){
    return esportsClick()
  }
  // 点击菜单的时候如果在详情页应跳转出来先
  if (['league','details','search'].includes(route.name)) {
    router.push('/home')
  }
  let obj = {
    lv1_mi : payload.mi,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: payload.mi +''+ 2, // 二级菜单id
    menu_type: type, // 左侧热门或者赛种
  }
  //太多了 后续做优化
  MenuData.set_menu_root(202, true)
  MenuData.set_is_collect(false)
  MenuData.set_left_menu_result(obj)
  MenuData.set_menu_current_mi(obj.lv2_mi)
  MenuData.set_current_ball_type(payload.mi*1 - 100)

  let mid_config = {
    ...MenuData.mid_menu_result,
    md: '',
    filter_tab: 4001
  }
  MenuData.set_mid_menu_result(mid_config)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,payload.mi)

    set_visit_count_list()
  })
  
}
/**
 * 电竞
 */
const esportsClick = ()=>{
   // 点击菜单的时候如果在详情页应跳转出来先
  if (['league','details','search'].includes(route.name)) {
    router.push('/home')
  }
  let obj = {
    lv1_mi : 2000,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: 2100, // 二级菜单id
    menu_type: 1, // 左侧热门或者赛种
  }
  //太多了 后续做优化
  MenuData.set_menu_root(2000, true)
  MenuData.set_is_collect(false)
  MenuData.set_left_menu_result(obj)
  MenuData.set_menu_current_mi(obj.lv2_mi)
  MenuData.set_current_ball_type(2100)

  let mid_config = {
    ...MenuData.mid_menu_result,
    md: '',
    filter_tab: 2100
  }
  MenuData.set_mid_menu_result(mid_config)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE, 2100)
  })
}
/**
 * 电竞
 */
 const vrClick = ()=>{
   // 点击菜单的时候如果在详情页应跳转出来先
  if (['league','details','search'].includes(route.name)) {
    router.push('/home')
  }
  let obj = {
    lv1_mi : 300,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: 31001, // 二级菜单id
    menu_type: 1, // 左侧热门或者赛种
  }
  //太多了 后续做优化
  MenuData.set_menu_root(300, true)
  MenuData.set_is_collect(false)
  MenuData.set_left_menu_result(obj)
  MenuData.set_menu_current_mi(obj.lv2_mi)
  MenuData.set_current_ball_type(31001)

  let mid_config = {
    ...MenuData.mid_menu_result,
    md: '',
    filter_tab: 31001
  }
  MenuData.set_mid_menu_result(mid_config)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE, 31001)
  })
}
// 冠军
const outrights = () => {
  // if(!MenuData.is_common_kemp() && !MenuData.is_collect_kemp() && MenuData.is_kemp())return
 // 点击菜单的时候如果在详情页应跳转出来先
 if (['league','details'].includes(route.name)) {
    router.push('/home')
  }
  let obj = {
    lv1_mi : 400,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: 401, // 二级菜单id
    menu_type: 1, // 左侧热门或者赛种
  }
  //太多了 后续做优化
  MenuData.set_menu_root(400, true)
  MenuData.set_is_collect(false)
  MenuData.set_left_menu_result(obj)
  MenuData.set_menu_current_mi(obj.lv2_mi)
  MenuData.set_current_ball_type(1)


  let mid_config = {
    ...MenuData.mid_menu_result,
    filter_tab: '',
    current_mi: '401'
  }
  MenuData.set_mid_menu_result(mid_config)


  BetData.set_is_bet_single('single')

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE_OUTRIGHTS,401)
  })
}

</script>

<style lang="scss" scoped>
@import "./menu.scss";
</style>


  <!-- <style scoped lang="scss">
    @import "src/components/bet-box/bet/bet.scss";
  </style>
 -->
src/output/index.js