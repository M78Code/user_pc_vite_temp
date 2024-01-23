<!--
 * @Description: 虚拟体育列表页批次tab切换组件
-->
<template>
  <div class="match-tab row justify-end">
    <!-- 足球联赛league_type 0 -->
    <div class="row items-center part-nav" ref="scrollBox" :class="{'part-nav-full': lodash.get(get_access_config, 'statisticsSwitch') && sub_menu_type != 1004}">
      <div ref="scrollItem" v-for="(item,i) in no_list" class="row sub-nav-item" @click="sub_nav_click_handle(item.batchNo, true)"
        :class="{focus:item.batchNo === sub_focus_batch_no,footbal:[1001,1004].includes(sub_menu_type)}"
        v-show="sub_menu_type != '1004' || item.mmp != 'PREGAME' || !pre_to_playing || i != 0"
        :key="i">
        {{item.no}}
      </div>
    </div>
    <!-- 分析icon显示 -->
    <div class="sr-icon-wrapper row justify-center items-center" @click.stop="trend_event"  v-if="lodash.get(get_access_config,'statisticsSwitch') && sub_menu_type != 1004">
      <img class="sub-item-trend-icon2" v-if="[1002, 1011, 1010, 1009].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-trend-icon1" v-if="[1001,1004].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-close-icon" v-if="!trend_is_show"
            src="image/wwwassets/bw3/common/sub_item_list_close.svg" alt="">
    </div>
  </div>
</template>
<script>
import match_tab_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/match-tab-mixin.js";
export default {
  mixins:[match_tab_mixin],
  name:'match_tab',
}
</script>

<style lang="scss" scoped>
.match-tab {
  width: 100%;
  height: 0.4rem;
  position: sticky;
  top: 1.08rem;
  z-index: 99;
  display: flex;
  align-items: center;
}

.part-nav {
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  height: 0.4rem;
  line-height: 0.4rem;
  padding-right: 0.2rem;
  padding-left: 0.08rem;
  flex-wrap: nowrap;
  
  &.part-nav-full {
    width: 3.25rem;
  }
  
  &:after {
    content: ' ';
    display: block;
    width: 0.16rem;
    height: 0.1rem;
    flex-shrink: 0;
  }

  .sub-nav-item {
    min-width: fit-content;
    font-size: 0.14rem;
    margin-right: 0.19rem;
    letter-spacing: -0.01rem;
    height: 100%;
    position: relative;
    padding-left: 0.08rem;

    &.focus {
      &:after {
        display: block;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    &.footbal {
      font-size: 0.13rem;
      line-height: 0.41rem;
    }

    &:after {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-2px);
      display: none;
    }
  }
}

.sr-icon-wrapper {
  flex: 1;
  height: 0.4rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0.1rem;
    height: 0.2rem;
    width: 1px;
  }

  .sub-item-trend-icon1 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-trend-icon2 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-close-icon {
    width: 0.2rem;
    height: 0.2rem;
    display: block;
  }
}
</style>