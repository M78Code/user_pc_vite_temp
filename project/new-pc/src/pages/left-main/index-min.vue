<!--
 * @Description: 主菜单——收缩时候的组件 mini
-->
<template>
  <div class="c-main-menu-mini column col">
    <v-scroll-area ref="ref_bet_scroll_area" position="menu">
      <div class="item-wrap column items-center yb-padding-t5">
        <!-- 投注记录 -->
        <div @click.stop="menu_item_click('bet_history')" class="menu-item">
          <img class="menu_mini-bet" :src="menu_mini_bet_svg" />
        </div>
        <!-- 现场滚球 -->
        <div @click.stop="new_menu_click(1)" class="menu-item">
          <img width="22" :src="play_match" />
        </div>
        <!-- 热门赛事 -->
        <div @click.stop="new_menu_click(500)" class="menu-item">
          <img width="18" :src="hot_svg" />
        </div>
        <!-- 迷你菜单分割线 -->
        <div class="dividing-line"></div>
        <!-- 体育菜单 -->
        <template v-for="item in (MenuData.left_menu_list || [] )">
          <div :key="`${item}`"  class="menu-item"
          @click="lev_1_click(item)" v-if="item.ct">
            <!-- menuType == 3000 电竞 -->
            <!-- <sport-icon :data-id="item1" :sport_id="base_data.compute_sport_id(item1)" size="18px" class="icon"
              status="2" /> -->
             <!--:style="compute_css_obj({key:current_lv_1_mi == item.mi && is_zaopan_today?'pc-left-menu-bg-active-image':'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.mif|| item.mi)}` })"-->
            <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.mif|| item.mi)}` })"
            :alt="BaseData.menus_i18n_map[item.mif || item.mi]"></span>
          </div>
        </template>
        <!-- 你菜单分割线 -->
        <div class="dividing-line"></div>
      </div>
    </v-scroll-area>
  </div>
</template>
<script setup>

import play_match from "/yazhou-pc/image/png/play-match.png";
import hot_svg from "/yazhou-pc/image/svg/hot.svg"
import menu_mini_bet_svg from "/yazhou-pc/image/svg/menu_mini_bet.svg"
import { MenuData,LayOutMain_pc } from "src/output/index.js"
import { compute_css_obj } from 'src/core/server-img/index.js'
import BaseData from "src/core/base-data/base-data.js"
import { useMittEmit,MITT_TYPES,} from "src/core/mitt/index.js";
// import icon_success from "src/assets/images/icon_success.png";
// import icon_success from "src/assets/images/icon_success.png";
// import icon_success from "src/assets/images/icon_success.png";
// import { mapActions } from "vuex";
// import vScrollArea from "src/public/components/v_scroll_area/v_scroll_area.vue"; // 通屏垂直滚动
// import sports_menu_mixin from  "src/public/components/main_menu/sports-menu.mixin.js"

// export default {
//   name: "MainMenuMini",
//   mixins: [sports_menu_mixin],
//   components: {
//     vScrollArea,
//   },
//   created() {

//   },
// methods: {
//   ...mapActions({
//     vx_set_main_menu_toggle: "set_main_menu_toggle", //设置左侧列表显示状态
//     vx_set_left_menu_toggle: "set_left_menu_toggle", //左侧菜单切换
//   }),

const props = defineProps({
    // 元数据配置
    base_data: {
    type: Object,
    default: () => {},
  },
   // 菜单配置
   menu_config: {
    type: Object,
    default: () => {},
  },
})
/**
 * @description: 一级菜单 点击 找到第一个有数的 菜单
 * @param {*} obj 一级菜单id
 * @return {*}
 */
 const lev_1_click = (obj) => {
  LayOutMain_pc.set_layout_left_menu_status("normal")
  useMittEmit(MITT_TYPES.EMIT_SET_BESE_MENU_CHANGE,{type:1,data:obj})
};
/**
 * 新菜单点击  热门 或者  滚球
 */
const new_menu_click = val => {
  LayOutMain_pc.set_layout_left_menu_status("normal")
  useMittEmit(MITT_TYPES.EMIT_SET_BESE_MENU_CHANGE,{type:0,data:val})
}
const menu_item_click = (page) => {
  LayOutMain_pc.set_layout_left_menu_status("normal")
  LayOutMain_pc.set_layout_left_show(page)
}
</script>
<style lang="scss">
/* 迷你菜单字体宽度 */
.c-main-menu-mini {
  font-size: 13px;
  width: 100%;
  height: 100%;
  .item-wrap{
    width: 49px;
    height: 100%;
    background-color: var(--q-gb-bg-c-11);
    border-top: 1px solid var(--q-gb-bd-c-8);
    border-right: 1px solid var(--q-gb-bd-c-8);
    border-radius: 0 6px 0 0;
  }
  .yb-padding-t5 {
    padding-top: 5px;
  }
  /* 迷你菜单分割线 */
  .dividing-line {
    margin: 8px 0;
    width: 16px;
    height: 2px;
    border-radius: 1.5px;
    background-color: var(--q-gb-bd-c-6);
    /* 子菜单高度排列方式 */
  }

  .menu-item {
    cursor: pointer;
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    .soprts_id_icon {
      width: 18px;
      height: 18px;
      background-size: 100% auto;
    }
    .league-logo {
      width: 18px;
      height: 18px;
    }
  }

  .menu-mini-fixed-footer {
    cursor: pointer;
    height: 40px;
  }
}
</style>
