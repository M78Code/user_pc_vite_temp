
<template>
  <div class="left-container">
    <!-- 左侧菜单 -->
    <div class="menu-nav-li">
      <ul class="menu-list menu-favouritse">
        <li class="f-s-c" @click="go_to_favouritse">
          <i class="icon-star q-icon c-icon icon"></i>
          {{ i18n_t("ouzhou.menu.collect") }}
        </li>
      </ul>
    </div>

    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.popular") }}</p>
      <ul class="menu-list">
        <li class="f-s-c" :class="{ 'menu_checked': MenuData.lv1_mi == item&&menu_type=='0' }" v-for="item in popular" :key="item"
          @click="jump_func(item,'0')">
          <sport_icon :sport_id="BaseData.compute_sport_id(item)" size="18px" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[item] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.all_sports")}}</p>
      <ul class="menu-list">
        <template v-for="item in (left_menu_list || menu)" :key="item">
          <li class="f-s-c" :class="{ 'menu_checked': MenuData.lv1_mi  == item&&menu_type=='1' }"  @click="jump_func(item,'1')">
            <sport_icon :sport_id="BaseData.compute_sport_id(item)" size="18px" class="icon" />
            {{ (BaseData.menus_i18n_map || {})[item] || "" }}
          </li>
        </template>
      </ul>
    </div>
    <div class="menu-line"></div>
    <div class="menu-nav-line" />

    <!-- <div class="menu-nav-li">
        <ul class="menu-list">
          <li class="f-s-c"> 
            <sport_icon :sport_id="compute_sport_id(300)" size="18px" class="icon" />
            VR Sports
          </li>
        </ul>
      </div> -->

    <div class="menu-line"></div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import BaseData from "src/core/base-data/base-data.js";
import sport_icon from "src/base-pc/components/sport_icon.vue";
// import { use_base_data,useMenuData,useMenuI18n } from "./base_data";
// 菜单配置
import { MenuData, UserCtr,useMittEmit,MITT_TYPES } from "src/core/index.js"

const popular = ([101, 102])
const menu = [
  101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
  114, 104, 106, 118,
]

const left_menu_list = ref(menu)
const menu_type = ref("")
const router = useRouter();

onMounted(() => {
  // init()
  left_menu_list.value = BaseData.left_menu_base_mi_arr;
  // jump_func()
})

// favouritse
const go_to_favouritse = () => {
  
  MenuData.set_is_collect(true)
  MenuData.set_menu_root(301)

  let mid_config = {
    ...MenuData.mid_menu_result,
    filter_tab: 3001, // 滚球 3001 早盘 3002  今日 3003
    current_mi: '101', // 当前选中的赛种id
  }
  MenuData.set_mid_menu_result(mid_config)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE)
  })
}
/**
 * 
 * @param {Object} payload 菜单信息 
 * @description 点击菜单item 存储当前菜单信息
 * @returns {undefind} 无返回值
 */
const jump_func = (payload,type) => {
  let obj = {
    lv1_mi : payload,
    has_mid_menu: true, // 有中间菜单
    lv2_mi: payload +''+ 2, // 二级菜单id
  }
  menu_type.value = type

  //太多了 后续做优化
  MenuData.set_menu_root(202, true)
  MenuData.set_is_collect(false)
  MenuData.set_left_menu_result(obj)
  MenuData.set_menu_current_mi(obj.lv2_mi)

  let mid_config = {
    ...MenuData.mid_menu_result,
    md: ''
  }
  MenuData.set_mid_menu_result(mid_config)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,payload)
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
