<template>
  <div class="component container-menu-w black2" >
    <div class="floating-menu">
      <div class="footer-menu-item" @click="menu_item_click(item)" v-for="(item, k) of footer_menu_list" :key="`${k}_${item.title}`">
        <template  v-if="item.title">
          <div class="m-item-inner">
            <div class="item-img-wrapper c-refresh">
              <!-- <img class="menu-item-img" :class="{'loading-animation':item.id === 5 && loading,'not_title':!item.title}" :src="item.icon" alt="" /> -->
              <template v-if="item.id === 3" class="long3">
                <img :src="item.icon" alt="" style="width: 34px; height: 24px;">
              </template>
              <template v-else>
                <div class="menu-item-img" :class="{'loading-animation':item.id === 5 && loading,'not_title':!item.title}" :style="item.icon_ ? item.icon : compute_css_obj({key: item.icon}) "></div>
              </template>
            </div>
            <div class="menu-item-title">
              <span class="title-p1">  {{ item.title }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="m-item-inner">
            <img class="menu-item-img not_title activity-img" :src="item.icon" alt="" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch,computed } from "vue";
import { useRouter } from "vue-router";
import { LOCAL_PROJECT_FILE_PREFIX,useMittEmit,MITT_TYPES , compute_css_obj } from "src/output/index.js";
import { i18n_t } from "src/boot/i18n.js";;
import { UserCtr,MenuData } from "src/output/index.js";

// 路由
const router = useRouter();
//刷新加载中
const loading = ref(false)
//是否每日活动
let is_activities = ref(UserCtr.daily_activities)
const footer_list = ref([
  {
    title: i18n_t('menu_itme_name.results'), 
    path_name: "matchResults",
    icon: 'h5-footer-sg',
    id: 1
  },
  {
    title: i18n_t('footer_menu.set_menu'),
    icon: 'h5-footer-szcd',
    id: 2,
   
  },
  {
    title: i18n_t('footer_menu.open_bets'),
    // icon: 'h5-footer-wjzd', // 暂时换成下面的皮肤
    // icon: 'h5-footer-yjzd', // 暂时换成下面的皮肤
    icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/h5_long_4.png`,
    settle: false,
    id: 3
  },
  {
    title: i18n_t('footer_menu.closed_bets'),
    // icon: 'h5-footer-wjzd' ,
    icon: 'h5-footer-yjzd' ,
    settle: true,
    id: 4
  },{
    title: i18n_t('footer_menu.refresh'),
    icon: 'h5-footer-sx',
    id: 5,
  }
])
// const footer_menu_list = ref(footer_list)
const footer_menu_list = computed(()=>{
  let new_footer_list = footer_list.value;
  if(UserCtr.daily_activities){
    // new_footer_list[4].title = i18n_t('footer_menu.daily_activities');
    new_footer_list[4].title = '';
    new_footer_list[4].icon_ = 'activity'
    new_footer_list[4].icon = `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/activity.png`;
  }else{
    new_footer_list[4].title = i18n_t('footer_menu.refresh');
    new_footer_list[4].icon_ = ''
    new_footer_list[4].icon = 'h5-footer-sx'
  }
  return new_footer_list;
})

/**
 * 监听用户信息版本号
*/
// watch(() => UserCtr.user_version, () => {
//   footer_menu_list.value.forEach(item=>{
//     // 展示每日活动
//     if (item.id === 5 && UserCtr.daily_activities){
//       item.title = i18n_t('footer_menu.daily_activities')
//       item.icon = `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/activity.png`
//     }
//     // 展示刷新
//     if (item.id === 5 && !UserCtr.daily_activities){
//       item.title = i18n_t('footer_menu.refresh')
//       item.icon = `${LOCAL_PROJECT_FILE_PREFIX}/image/footer/tabbar_05_nor.png`
//     }
//   })
// }, { immediate: true })
const menu_item_click = (item = {}) => {
  switch(item.id){

    // 赛果
    case 1:
      MenuData.set_current_lv_2_menu_i({});
      MenuData.set_date_time(0,'');
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
    case 5:
      //每日活动
      
      if (UserCtr.daily_activities){
      useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
          text: "activities",
        });
        router.push( {name: 'activity' } );
      }else {
        // 刷新
        //加载中
        loading.value = true;
        const timer = setTimeout(() => {
          loading.value = false
          clearTimeout(timer);
        }, 500);
        useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
          text: "footer-refresh",
        });
      }
      break;
  }
}


</script>
<style lang="scss" scoped>
@import url(./footer.scss);
@import url(./footer_menu.scss);
</style>