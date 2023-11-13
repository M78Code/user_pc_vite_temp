
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
        <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_mi.value == item }" v-for="item in popular" :key="item"
          @click="jump_func(item)">
          <sport_icon :sport_id="BaseData.compute_sport_id(item)" size="18px" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[item] || "" }}
        </li>
      </ul>
    </div>

    <div class="menu-nav-line" />

    <div class="menu-nav-li">
      <p>{{ i18n_t("ouzhou.menu.all_sports")}}</p>
      <ul class="menu-list">
        <li class="f-s-c" :class="{ 'menu_checked': MenuData.left_menu_mi.value == item }" v-for="item in (left_menu_list || menu)"
          :key="item" @click="jump_func(item)">
          <sport_icon :sport_id="BaseData.compute_sport_id(item)" size="18px" class="icon" />
          {{ (BaseData.menus_i18n_map || {})[item] || "" }}
        </li>
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

const popular = ([101, 102, 105])
const menu = [
  101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
  114, 104, 106, 118,
]

const left_menu_list = ref(menu)

const router = useRouter();

onMounted(() => {
  // init()
  left_menu_list.value = BaseData.left_menu_base_mi_arr;
  // jump_func()
})


const go_to_favouritse = () => {
  router.push({
    path: '/conming_soon',
    query: {}
  })

}
/**
 * 
 * @param {Object} payload 菜单信息 
 * @description 点击菜单item 存储当前菜单信息
 * @returns {undefind} 无返回值
 */
const jump_func = payload => {
  let obj = {
    lv1_mi : payload,
    root: 2, // 左侧菜单 默认今日
    has_mid_menu: true, // 有中间菜单
    mid_menu_show:{
      list_filter: true
    }
  }
  //太多了 后续做优化
  MenuData.set_router_root_lv_1(4)
  MenuData.set_left_menu_mi(payload)
  MenuData.set_left_menu_result(obj)
  MenuData.set_router_root_lv_2(4001)

  nextTick(()=>{
    useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE)
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
