<!--
* @Author: Malick
* @Description: 底部悬浮菜单
-->
<template>
  <div class="footer_menu" v-if="is_rule_page">
    <!-- 中间弧形 -->
    <!-- <span class="arc"></span> -->
    <!-- 底部菜单 -->
    <div v-for="( item, index ) in tab_list" :key="index" class="footer_menu_item"
      :class="tab_active == item.route ? 'active' : ''" @click="jump_page(item)">
      <!-- 图标 -->
      <div class="item_img" :class="item.value" />
      <!-- 菜单名 -->
      <div class="name">
        {{ item.value !== 'home_page' ? i18n_t(`${item.label}`) : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive, watch,computed  } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MenuData } from "src/output/index.js"
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import UserCtr from "src/core/user-config/user-ctr.js";
import { i18n_t } from "src/output/index.js"
const router = useRouter();
// 底部菜单集合
const tab_list = ref([
  { label: "menu_itme_name.inplay", value: 'rollball', route: '/inPlay', type: 1 },
  { label: "ouzhou.menu.my_bets", value: 'bet', route: '/betting_history' },
  { label: 'Home-Page', value: 'home_page', route: '/home', type: 1 },
  { label: "menu_itme_name.results", value: 'results', route: '/matchResults', type: 28 },
  { label: "ouzhou.match.favorites", value: 'favorites', route: '/collect', type: 50000 },
])
const get_route_path = computed(() => {
  return  router.currentRoute.value.path;
})
const tab_active = ref(get_route_path);

const jump_page = (item) => {

  if (tab_active.value === item.route) return

  tab_active.value = item.route
  
  // 设置一级菜单 注： 普通赛果是28, 投注赛果是29， 欧洲版不考虑投注
  VirtualList.set_is_show_ball(item.route === '/matchResults' ? false : true)
  item.type && MenuData.set_current_lv1_menu(item.type)
  BaseData.set_is_emit(true)

  MatchMeta.clear_match_info()
  
  router.push(item.route)
}
/**
 * 公告
 */
 const is_rule_page = computed(() => {
  return !['/announcement','/rules'].includes(router.currentRoute.value.path)
})

</script>

<style lang="scss" scoped>
.footer_menu {
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  height: 56px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 10000;

  // 半弧样式
  .arc {
    display: inline-block;
    position: absolute;
    width: 62px;
    height: 62px;
    top: -17px;
    left: 50%;
    margin-left: -31px;
    z-index: 0;
    background: #ffffff;
    overflow: hidden;
    border-radius: 50%;
  }

  .footer_menu_item {
    flex: 1;
    height: 54px;
    padding: 9px 0 13px 0;
    position: relative;
    // 图标样式
    .item_img {
      width: 20px;
      height: 20px;
      background-size: 20px 20px;
      margin: auto;
      margin-bottom: 2px;
    }

    // 中间大图标样式
    .item_img.home_page {
      position: absolute;
      top: -14px;
      left: 50%;
      margin-left: -28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
      background-size: 56px 56px !important;
      background-image: url($SCSSPROJECTPATH+"/image/footer/unselect_home_page.png");
      // &:after{
      //   content:"";
      //   display: inline-block;
      //   width: 52px;
      //   height: 14px;
      //   margin-left: 2px;
      //   box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
      //   border-radius:50%/100% 100%  0 0;
      //   // border-radius: 50% / 100% 100% 0 0;
      // }
    }


    .item_img.rollball {
      background-image: url($SCSSPROJECTPATH+'/image/footer/unselect_rollball.png');
    }

    .item_img.bet {
      background-image: url($SCSSPROJECTPATH+'/image/footer/unselect_bet.png');
    }

    .item_img.results {
      background-image: url($SCSSPROJECTPATH+'/image/footer/unselect_results.png');
    }

    .item_img.favorites {
      background-image: url($SCSSPROJECTPATH+'/image/footer/unselect_favorites.png');
    }

    // 文字样式
    .name {
      height: 12px;
    }
  }

  .footer_menu_item.active {
    .item_img.home_page {
      width: 56px !important;
      height: 56px !important;
      left: 50%;
      margin-left: -28px;
      background-size: 56px 56px !important;
      background-image: url($SCSSPROJECTPATH+'/image/footer/home_page.png');
    }

    .item_img.favorites {
      background-image: url($SCSSPROJECTPATH+'/image/footer/favorites.png');
    }

    .item_img.bet {
      background-image: url($SCSSPROJECTPATH+'/image/footer/bet.png');
    }

    .item_img.results {
      background-image: url($SCSSPROJECTPATH+'/image/footer/results.png');
    }

    .item_img.rollball {
      background-image: url($SCSSPROJECTPATH+'/image/footer/rollball.png');
    }
  }

  // 选中时文字样式
  .footer_menu_item.active .name {
    color: rgba(255, 112, 0, 1);
  }
}
</style>