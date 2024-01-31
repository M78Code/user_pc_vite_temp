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
        <template v-for="item1 in left_menu_base_mi_arr">
          <div :key="`${item1}`" @click="lev_1_click_min(item1)" class="menu-item"
            v-if="!base_data.filterSport_arr.includes('' + base_data.compute_sport_id(item1)) && (item1 == 300 || lv_1_num(item1))">
            <!-- menuType == 3000 电竞 -->
            <sport-icon :data-id="item1" :sport_id="base_data.compute_sport_id(item1)" size="18px" class="icon"
              status="2" />
          </div>
        </template>
        <!-- 你菜单分割线 -->
        <div class="dividing-line"></div>
      </div>
    </v-scroll-area>
  </div>
</template>
<script setup>

import play_match from "/ouzhou-pc/image/png/play-match.png";
import hot_svg from "/ouzhou-pc/image/svg/hot.svg"
import menu_mini_bet_svg from "/ouzhou-pc/image/svg/menu_mini_bet.svg"
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue";
// import icon_success from "src/assets/images/icon_success.png";
// import icon_success from "src/assets/images/icon_success.png";
// import icon_success from "src/assets/images/icon_success.png";
// import { mapActions } from "vuex";
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue"; // 通屏垂直滚动
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
 * 新菜单点击  热门 或者  滚球
 */
const new_menu_click = val => {
  let mid_menu_show = {}

  let lv2_mi = ''
  if (val == 1) {
    mid_menu_show.list_filter = true
    // 滚球 默认全部
    lv2_mi = 1
  } else if (val == 500) {
    mid_menu_show.list_filter_hot = true
    // 热门默认赛事
    let mi_500_obj = base_data.mew_menu_list_res.find((x) => x.mi == 500) || {
      sl: [],
    };
    // 热门赛事有值的
    let { mi } = mi_500_obj['sl'].find(item => item.ct)
    lv2_mi = mi
  }
  // 清除数据 和 重置收藏
  set_route_url()

  let params = {
    root: val,
    lv1_mi: '',
    lv2_mi,
    sports: '',
    guanjun: "",
  };
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);

  menu_config.set_left_menu_result({
    root: val,
    lv1_mi: '',
    lv2_mi,
    sports: '',
    guanjun: "",
    mid_menu_show,
    has_mid_menu: true,
  })
  // 设置mini菜单展开折叠状态
  menu_item_click()
}
const menu_item_click = () => {
  // this.vx_set_main_menu_toggle("mini-normal");
  // this.vx_set_left_menu_toggle(true);
}
/**
 *  球类点击
 * @param {*} mi
 */
const lev_1_click_min = mi => {
  // 设置mini菜单展开折叠状态
  menu_item_click()

  lev_1_click(mi)

}
</script>
<style lang="scss">
/* 迷你菜单字体宽度 */
.c-main-menu-mini {
  font-size: 13px;
  width: 100%;

  /* 迷你菜单分割线 */
  .dividing-line {
    margin: 8px 0;
    width: 16px;
    height: 2px;
    border-radius: 1.5px;
    /* 子菜单高度排列方式 */
  }

  .menu-item {
    cursor: pointer;
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;

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
