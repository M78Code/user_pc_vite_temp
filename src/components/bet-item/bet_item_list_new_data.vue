<!--
 * @Author: Amor
 * @Date: 2021-08-04 17:14:23
 * @Description: 投注项优化
-->
<template>
  <div
    v-if="is_mounted && odds_state != 'close'"
    class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[ol_data.class, odds_state, `csid${ol_data.csid}`, odds_lift, {'show-odds-icon':odds_state !='seal'}]"
    @click.stop="bet_click"
    :id="DOM_ID_SHOW && `list-${ol_data.oid}`"
  >
    <!-- 盘口 -->
    <div
      :class="['handicap-value',{
      'color-highlight':ol_data.handicap_highlight, 
      'style2':ol_data.onbl && ol_data.csid == 2,
      'left_cell':$utils.is_iframe,
      'injury-time-goal':ol_data.ot === 'ClutchGoal',
      'nogoal':ol_data.ot === 'NoGoal',
       }]"
    >
      <span class="handicap-more" v-show="ol_data.onbl">{{ol_data.onbl}}&nbsp;</span>
      <div class="handicap-value-text">
        {{score}} {{ol_data.onb}}
      </div>
    </div>

    <!-- 赔率 -->
    <div class="odds" :style="([1,32,17,111,119,310,311,126,129,333,20001,20013].includes(+ol_data._hpid) && $utils.is_iframe) ? 'flex:1.5' : '' ">
      <div v-if="odds_state=='seal'" class="lock" />
      <span v-else>
        {{match_odds}}
      </span>
      <div class="odds-arrows-wrap" v-if="odds_state!='seal' && !menu_data.is_virtual_sport">
         <!-- 红升、绿降 -->
        <div class="odds-icon odds-up"></div>
        <div class="odds-icon odds-down"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import bet_item_mixin  from "src/public/components/bet_item/bet_item_list_new_data_mixin.js";

export default {
  name: "BetItem",
  // mixins: [bet_item_mixin],
};

</script>

<style lang="scss" scoped>
.show-odds-icon {
  &.up {
    .odds-up {
      display: block;
    }
  }
}
.show-odds-icon {
  &.down {
    .odds-down {
      display: block;
    }
  }
}
.odds-arrows-wrap {
  position: relative;
}
.odds-icon {
  width: 10px;
  height: 10px;
  position: absolute;
  left: -1px;
  top: -6px;
  overflow: hidden;
  display: none;
}
.odds-up {
  background: url("~public/image/wwwassets/yabo/svg/up.svg") no-repeat 100%;
}
.odds-down {
  background: url("~public/image/wwwassets/yabo/svg/down.svg") no-repeat 100%;
}
.lock {
  width: 12px;
  height: 12px;
}
.has-hv {
  .handicap-value {
    display: none !important;
  }
}

/*  盘口样式 */
.handicap-value {
  line-height: 34px;
  flex: 1;
  text-align: right;
  height: 34px;
  white-space:nowrap;
  &.style2 {
    min-width: 57%;
    .handicap-value-text {
      min-width: 30px;
    }
  }
  &.left_cell.nogoal{
    flex: 1.5;
  }
  &.injury-time-goal{
    flex: 1.7;
    &.left_cell{
      flex: 2.3;
    }
  }
}

/*  赔率样式 */
.odds {
  flex: 1;
}
.odds.hv {
  justify-content: flex-start !important;
}
.no-handicap,
.no-handi,
.null-handicap {
  .handicap-value {
    display: none;
  }
  .odds {
    justify-content: center;
    margin-left: 0;
  }
}
.null-handicap {
  .handicap-value {
    display: none;
  }
  .odds {
    margin-left: 0;
    justify-content: center;
  }
}
.handicap-value-text {
  font-weight: 500;
  white-space: nowrap;
}
.vertical{
  flex-direction: column;
  .handicap-value{
    line-height: 30px;
    height: 26px;
  }
  .odds{
    margin: 0;
  }
}
.left_cell{text-align: left!important}
</style>
