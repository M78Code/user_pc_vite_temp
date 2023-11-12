<!--
* @Author: Malick
* @Description: 底部悬浮菜单
-->
<template>
  <div class="footer_menu">
    <!-- 中间弧形 -->
    <span class="arc"></span>
    <!-- 底部菜单 -->
    <div v-for="( item, index ) in tab_list" :key="index" class="footer_menu_item"
      :class="tab_active == item.route ? 'active' : ''" @click="jump_page(item)">
      <!-- 图标 -->
      <div class="item_img" :class="item.value" />
      <!-- 菜单名 -->
      <div class="name">
        {{ item.value !== 'home_page' ? item.label : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive, watch,computed  } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MenuData } from 'src/core/'
const router = useRouter();
// 底部菜单集合
const tab_list = reactive([
  { label: 'In-Play', value: 'rollball', route: '/inPlay', type: 1 },
  { label: 'MyBets', value: 'bet', route: '/betting_history' },
  { label: 'Home-Page', value: 'home_page', route: '/home', type: 1 },
  { label: 'Results', value: 'results', route: '/matchResults', type: 28 },
  { label: 'Favorites', value: 'favorites', route: '/collect', type: 50000 },
])
const get_route_path = computed(() => {
  return  router.currentRoute.value.path;
})
const tab_active = ref(get_route_path);

const jump_page = (item) => {
  tab_active.value = item.route
  router.push(item.route)
  // 设置一级菜单 注： 普通赛果是28, 投注赛果是29， 欧洲版不考虑投注
  item.type && MenuData.set_current_lv1_menu(item.type)
}

</script>

<style lang="scss" scoped>
.footer_menu {
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  height: 56px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1000;

  // 半弧样式
  .arc {
    display: inline-block;
    position: absolute;
    width: 52px;
    height: 18px;
    top: -17px;
    left: 160px;
    background-image: url($SCSSPROJECTPATH+'/image/footer/arc.png');
    background-size: 54px 18px;
    z-index: 0;
  }

  .footer_menu_item {
    flex: 1;
    height: 54px;
    padding: 9px 0 13px 0;

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
      top: -9px;
      left: 156px;
      width: 64px;
      height: 64px;
      background-size: 64px 64px !important;
      background-image: url($SCSSPROJECTPATH+"/image/footer/unselect_home_page.png");
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
      width: 54px !important;
      height: 54px !important;
      left: 160px !important;
      background-size: 54px 54px !important;
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
