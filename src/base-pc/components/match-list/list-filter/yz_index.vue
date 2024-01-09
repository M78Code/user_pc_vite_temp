<template>
  <div
    class="c-match-list-filter"
    :class="{
      'date-filter': MenuData.menu_root == 3,
      early: MenuData.menu_root == 3,
    }"
  >
    <!-- 滚球 -->
    <drag-scroll
      v-if="MenuData.menu_root == 1"
      class="item-wrap filter-sports"
      :class="$q.platform.is.ie && 'ie-browser'"
      ref="drag_scroll"
      :data-versin="BaseData.menu_version"
    >
      <!-- 全部 -->
      <div
        @click="
          handle_click_menu_mi_1({
            mi: '0',
            root: '1',
            sports: 'quanbu-gunqiu',
            guanjun: '',
          })
        "
        :class="current_menu == '0' ? 'active' : 'no-active'"
        v-if="GlobalAccessConfig.get_playAllShow()"
        class="item yb-flex-center"
      >
        <div class="icon-wrap list-filter menu-inline">
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_0` })"></span>
          <!-- 是否新上玩法 -->
        </div>
        <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content:  '全部',
              overflow: 1,
            }"
          >
            <span> 全部 </span>
            <span class="count-text"> {{ compute_quanbu_num_mi_1() }}</span>
          </div>
      </div>
      <!-- 常规球类 -->
      <!-- <template v-for="item in mi_100_arr"> -->
      <template v-for="item in MenuData.in_play_list">
        <div
          :key="`mi_100_arr_${item.mif}`"
          v-if="
            item.ct &&
            !BaseData.filterSport_arr.includes(
              '' + BaseData.compute_sport_id(item.mif)
            )
          "
          @click="
            handle_click_menu_mi_1({
              mi: item.mi,
              root: '1',
              mif: item.mif,
              sports: 'common',
              guanjun: '',
            })
          "
          :class="current_menu == item.mi ? 'active' : 'no-active'"
          class="item yb-flex-center"
        >
          <div class="icon-wrap list-filter menu-inline">
            <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.mif|| item.mi)}` })"></span>
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content: BaseData.menus_i18n_map[item.mif] || '',
              overflow: 1,
            }"
          >
            <span> {{ BaseData.menus_i18n_map[item.mif] || "" }} </span>
            <span class="count-text"> {{ item.ct }}</span>
          </div>
        </div>
      </template>
    </drag-scroll>
    <!-- 冠军-球种  -->
    <drag-scroll
      v-if="MenuData.menu_root == 400"
      :data-id="MenuData.menu_root"
      class="item-wrap filter-sports"
      :class="$q.platform.is.ie && 'ie-browser'"
      ref="drag_scroll"
      :data-versin="BaseData.menu_version"
    >
      <!-- 全部 -->
      <div
        @click="
          handle_click_menu_mi_400({
            mi: '400',
            root: '400',
            sports: 'quanbu-guanjun',
            guanjun: 'guanjun-common',
          })
        "
        class="item yb-flex-center"
        :class="current_menu == '400' ? 'active' : 'no-active'"
      >
        <div class="icon-wrap list-filter menu-inline">
          <!-- <sport-icon :sport_id="0" size="20px" class="icon" /> -->
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_0` })"></span>
        </div>
        <div
          class="name menu-inline name-margin-left"
          v-tooltip="{ content: i18n_t('common.all'), overflow: 1 }"
        >
          <span>{{ i18n_t("common.all") }}</span>
          <span class="count-text">{{ compute_quanbu_num_mi_400() }}</span>
        </div>
      </div>
      <template v-for="item in MenuData.kemp_list">
        <!--   no-active  active -->
        <div
          :key="item.mi"
          v-if="
            !BaseData.filterSport_arr.includes(
              '' + compute_mi_400_sl_mi_csid(item.mi)
            )
          "
          @click="
            handle_click_menu_mi_400({
              mi: item.mi,
              root: '400',
              sports: 'common',
              guanjun: 'guanjun-common',
            })
          "
          class="item yb-flex-center"
          :class="current_menu == item.mi ? 'active' : 'no-active'"
        >
          <div class="icon-wrap list-filter menu-inline">
            <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${compute_mi_400_sl_mi_csid(item.mi)}` })"></span>
            <!-- <sport-icon
              :sport_id="compute_mi_400_sl_mi_csid(item.mi)"
              size="20px"
              class="icon"
              :is_esports="true"
            /> -->
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content: BaseData.menus_i18n_map[item.mi] || '',
              overflow: 1,
            }"
          >
            <span>{{ BaseData.menus_i18n_map[item.mi] || "" }}</span>
            <span class="count-text"> {{ item.ct }}</span>
          </div>
        </div>
      </template>
    </drag-scroll>
  </div>
</template>
<script setup>
import { ref, watch,reactive,onMounted, onUnmounted,computed,nextTick } from "vue";
import BaseData from "src/core/base-data/base-data.js";
import MenuData from "src/core/menu-pc-yazhou/menu-data-class.js";
import DragScroll from "src/base-pc/components/cus-scroll/drag_scroll.vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { compute_css_obj } from "src/output/index.js";
  import {
    current_menu,
     compute_quanbu_num_mi_1,
    handle_click_menu_mi_400, handle_click_menu_mi_1, compute_mi_400_sl_mi_csid, compute_quanbu_num_mi_400, 
  } from './yz_index.js'
  onMounted(()=>{
    if(MenuData.is_scroll_ball()){
      if(GlobalAccessConfig.get_playAllShow()){
        handle_click_menu_mi_1({
          mi: '0',
          root: '1',
          sports: 'quanbu-gunqiu',
          guanjun: '',
        })
      }else{
        handle_click_menu_mi_1({
          mi: MenuData.in_play_list?.[0]?.mi,
          root: '1',
          mif: MenuData.in_play_list?.[0]?.mif,
          sports: 'common',
          guanjun: '',
        })
      }
        
    }
    if(MenuData.is_kemp()){
      handle_click_menu_mi_400({
        mi: '400',
        root: '400',
        sports: 'quanbu-guanjun',
        guanjun: 'guanjun-common',
      })
    }
   
  })
</script>
<style lang="scss" scoped>
.c-match-list-filter {
  width: 100%;
  height: 48px;
  padding-bottom: 1px;
  .more-btn {
    z-index: 10;
    width: 30px;
    height: 100%;
    cursor: pointer;
  }
  .filter-sports {
    overflow: hidden;
    .item {
      max-width: 140px;
      min-width: 80px;
      height: 30px;
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px 3px;
      .icon-wrap {
        position: relative;
        .menu-new-icon {
          position: absolute;
          top: 0;
          left: 30px;
        }
        .icon-select {
          visibility: hidden;
          bottom: -6px;
          right: -5px;
        }
      }
      .count-text {
        padding-left: 2px;
        padding-right: 3px;
      }
      .text-active {
        color: var(--q-gb-t-c-1);
      }
      .menu-inline {
        display: inline-block;
        .soprts_id_icon{
          width: 18px;
          height:18px;
          display: inline-block;
          background-size: cover;
        }
      }
      .name-margin-left {
        margin-left: 5px;
      }
      .name {
        margin-top: 1px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 13px;
        .count {
          display: inline-block;
        }
      }
      &.active {
        .icon-select {
          visibility: visible;
        }
      }
    }
  }
  &.date-filter {
    height: 50px;
    font-size: 14px;
  }
}
</style>