<template>
  <div class="home-page">
    <!-- tab 切换 -->
    <div class="header_tabs" >
      <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator >
        <!-- <q-tab name="featured" :label="`${i18n_t('ouzhou.match.Outrights')}`" /> -->
        <q-tab name="outrights" :label="`${i18n_t('ouzhou.match.outrights')}`" />
      </q-tabs>
      <span class="sport-bg" :style="compute_css_obj({key:'eu-menu-sport-bg-image', position:format_type(400),size:50,a:1})"></span>
    </div>
    <!-- 主内容区 -->
    <div class="home_content" ref="scrollAreaRef" :visible="false">
      <q-tab-panels v-model="tabValue" animated>
        <q-tab-panel name="outrights">
          <scroll-list menu_type="400" v-if="MenuData.champion_list.length" :current_mi="state.current_mi" :menuList="MenuData.champion_list" @changeMenu="changeMenu"/>
          <!-- 赛事列表 -->
          <section class="match-page-section">
            <MatchContainer />
          </section>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
 
<script setup> 
import { onMounted, ref ,reactive } from "vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import { MenuData, UserCtr,compute_css_obj } from "src/output/index.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { oz_sprite_bg_images_postion } from "src/output/module/constant-utils.js";
import BetData from "src/core/bet/class/bet-data-class.js";
const tabValue = ref('outrights');
const state = reactive({
    current_mi:"101",
})
/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
 const format_type = ( id ) => {
  return oz_sprite_bg_images_postion[id]
}
/**
 * 球种点击
 */
const changeMenu = (item) =>{
    if(state.current_mi == item.mi)return;
    state.current_mi = item.mi;
    MenuData.set_menu_mi(item.mi);
    // MatchMeta.set_origin_match_data()
    MatchMeta.get_champion_match()
}
onMounted(async () => {
  // 冠军设置为欧赔
  UserCtr.set_cur_odds("EU");
  // 冠军设置为单关投注
  BetData.set_is_bet_single('single')
  BetData.set_is_bet_merge()

  MenuData.set_current_lv1_menu(400);
  MenuData.set_menu_mi('101');
//   MatchMeta.set_origin_match_data()
  MatchMeta.get_champion_match()
})
</script>
 
<style scoped lang="scss">
.home-page{
  height: 100%;
  overflow: hidden;
  .header_tabs{
    border-bottom: 1px solid var(--q-gb-bg-c-1);
    // background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
    
    .sport-bg{
      --per:-0.5rem;
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 141.25px;
      height: 50px;
      background-size: 100% auto;
      background-position: right;
    }
    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background-color: var(--q-gb-bg-c-2);
        padding: 0 10px;
        background-repeat: no-repeat;
        // background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
        // background-size: contain;
        // background-position: right;
        .q-tab{
          flex: none;
        }
        .q-ripple{
          display: none;
        }
      }
      .q-tab__label{
       color: var(--q-gb-t-c-3); 
        text-transform: capitalize;
        font-weight: 600;
      }
      .q-tab--active .q-tab__label{
        //color: #FF7000;
        color: var(--q-gb-t-c-1);
      }
      .q-tab__indicator{
        height: 3px;
        //background: #FF7000;
        background-color: var(--q-gb-bg-c-1);
      }
    }
  }
  .home_content{
    height: calc(100% - 56px);
    .q-tab-panels{
      height: 100%;
      .q-tab-panel{
        padding: 0;
        overflow: hidden;
        .section-content{
          height: calc(100% - 0px);
          overflow-y: auto;
          position: relative;
          padding-bottom: 70px;
        }
        .match-page-section{
          height: 100%;
          overflow-y: hidden;
          position: relative;
          .match-list-container{
            height: calc(100% - 66px);
            background-color: var(--q-gb-bg-c-2) !important;
            :deep(.scroll-wrapper){
              // background-color: var(--q-gb-bg-c-2) !important;
              .s-w-item{
                background-color: var(--q-gb-bg-c-2) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>