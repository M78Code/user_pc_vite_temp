<template>
  <div class="container-menu-w black2" >
    <div class="floating-menu">
      <div class="footer-menu-item" @click="menu_item_click(item)" v-for="(item, k) of footer_menu_list" :key="k">
        <div class="m-item-inner">
          <div class="item-img-wrapper">
            <img class="menu-item-img" :src="item.icon" alt="" />
          </div>
          <div class="menu-item-title" >
            <span class="title-p1">  {{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LOCAL_PROJECT_FILE_PREFIX,i18n_t,useMittEmit,MITT_TYPES } from "src/core/index.js";
// 路由
const router = useRouter();

const footer_list = [
  {
    title: i18n_t('menu_itme_name.results'), 
    path_name: "result_details",
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_01_nor.png`,
    id: 1
  },
  {
    title: i18n_t('footer_menu.set_menu'),
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_02_nor.png`,
    id: 2,
   
  },
  {
    title: i18n_t('footer_menu.open_bets'),
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_03_nor.png`,
    settle: false,
    id: 3
  },
  {
    title: i18n_t('footer_menu.closed_bets'),
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_04_nor.png`,
    settle: true,
    id: 4
  },{
    title: i18n_t('footer_menu.refresh'),
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_05_nor.png`,
    id: 5
  }
]
const footer_menu_list = ref(footer_list)


const menu_item_click = (item = {}) => {
 
  switch(item.id){

    // 赛果
    case 1:
      router.push( {name: item.path_name } );
      break;

    // 菜单设置
    case 2:
      // 派发首页设置菜单展开事件
      useMittEmit(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, {
        open: true,
      });
      break;

    // 已结算 未结算
    case 3:
    case 4:
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, {
        open: true,
        settle: item.settle
      });
      break;

    // 刷新
    case 5:
      useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
        text: "footer-refresh",
      });
      break;
  }
}


</script>
<style lang="scss" scoped>
@import url(./footer.scss);
@import url(./footer_menu.scss);
</style>