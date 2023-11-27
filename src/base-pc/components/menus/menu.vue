
<template>
  <div v-show="false"> {{ MenuData.menu_data_version }} </div>
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
        <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_result.lv1_mi == item.mi && MenuData.left_menu_result.menu_type==0 }" v-for="item in popular" :key="item.mi"
          @click="jump_func(item,'0')">
          <sport_icon :sport_id="BaseData.compute_sport_id(item.mi)" size="18px" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[item.mi] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.all_sports")}}</p>
      <ul class="menu-list">
        <template v-for="item in BaseData.left_menu_base_mi" :key="item">
          <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_result.lv1_mi  == item.mi && MenuData.left_menu_result.menu_type==1 }"
           v-if="item.ct" @click="jump_func(item,'1')">
            <sport_icon :sport_id="BaseData.compute_sport_id(item.mi)" size="18px" class="icon" />
            {{ (BaseData.menus_i18n_map || {})[item.mi] || "" }}
          </li>
        </template>
      </ul>
    </div>
    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <ul class="menu-list">
        <li class="f-s-c" @click="outrights" :class="{ 'menu_checked': MenuData.is_kemp() && !MenuData.is_common_kemp() && !MenuData.is_collect_kemp() }">
          <sport_icon :sport_id="BaseData.compute_sport_id(400)" size="18px" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[400] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-line"></div>

  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter,useRoute } from "vue-router";
import BaseData from "src/core/base-data/base-data.js";
import sport_icon from "src/base-pc/components/sport_icon.vue";
// import { use_base_data,useMenuData,useMenuI18n } from "./base_data";
// 菜单配置
import { MenuData, UserCtr,useMittEmit,MITT_TYPES } from "src/core/index.js"

const popular = ([{mi:101},{mi:102}])

const router = useRouter();
const route = useRoute();

// favouritse
const go_to_favouritse = () => {
  // 点击收藏时清除其他球种选中状态
  if(MenuData.is_collect)return
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
  MenuData.set_mid_menu_result(mid_config)
  MenuData.set_current_ball_type(1)

  // nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE)
  // })
}
/**
 * 
 * @param {Object} payload 菜单信息 
 * @description 点击菜单item 存储当前菜单信息
 * @returns {undefind} 无返回值
 */
const jump_func = (payload ={},type) => {
  if(MenuData.left_menu_result.lv1_mi  == payload.mi && MenuData.left_menu_result.menu_type==type ){
    return
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
  })
  
}

// 冠军
const outrights = () => {
  if(MenuData.menu_root == 400)return
 // 点击菜单的时候如果在详情页应跳转出来先
 if (['league','details'].includes(route.name)) {
    router.push('/home')
  }
  let obj = {
    lv1_mi : 400,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: 101 +''+ 4, // 二级菜单id
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

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,1014)
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
