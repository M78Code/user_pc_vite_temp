<!--
 * @Author: Amor
 * @Date: 2021-08-04 17:14:23
 * @Description: 投注项优化
-->
<template>
  <div
    v-if="is_mounted && odds_state != 'close'"
    class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[ol_data.class, odds_state, `csid${ol_data.csid}`, odds_lift, {'show-odds-icon':odds_state !='seal'},is_deep?'new-bg':'new-s-bg',direction,{
       pro : get_version==1
    }]"
    @click.stop="bet_click"
    :id="DOM_ID_SHOW && `list-${ol_data.oid}`"
  >
    <!-- 盘口 -->
    <div
      v-if="get_version==1||menu_data.match_tpl_number==18"
      :class="['handicap-value',{
      'color-highlight':ol_data.handicap_highlight, 
      'style2':ol_data.onbl && ol_data.csid == 2,
      'left_cell':$utils.is_iframe,
      'injury-time-goal':ol_data.ot === 'ClutchGoal',
      'nogoal':ol_data.ot === 'NoGoal',
       }]"
    >
      <span class="handicap-more" v-show="ol_data.onbl">{{ol_data.onbl}}&nbsp;</span>
      <div :class="[menu_data.match_tpl_number!=18?'handicap-value-text':'sizecolor']">
        {{score}} {{ ol_data.onb }}
      </div>
    </div>
    <!-- 赔率 -->
    <div class="odds" :style="([1,32,17,111,119,310,311,126,129,333,20001,20013].includes(+ol_data._hpid) && $utils.is_iframe) ? 'flex:1.5' : '' ">
      <div v-if="odds_state=='seal'" class="lock" />
      <span v-else>
        {{match_odds}}
      </span>
      <div class="odds-arrows-wrap" :class="get_version==1?'odd-old-arrows-wrap':'odd-new-arrows-wrap'" v-if="odds_state!='seal' && odds_state!='disable' && !menu_data.is_virtual_sport">
         <!-- 红升、绿降 -->
        <div class="odds-icon odds-up"></div>
        <div class="odds-icon odds-down"></div>
      </div>
    </div>
  </div>
</template>

<script>
import bet_item_mixin  from "src/public/components/bet_item/bet_item_list_new_data_mixin.js";
import { mapGetters } from "vuex"
export default {
  /** props: 
   * //定义赔率上升下降的icon图相对赔率的方向, 默认:right icon位于赔率的右方
   * direction:'left'|'right' default:'right' 
   */
  name: "BetItem",
  mixins: [bet_item_mixin],
  computed: {
    ...mapGetters({
       //获取当前版本状态  // 1专业  2 新手
       get_version: "get_version",
      }),
  },
  watch: {
    odds_state(val){
      this.$emit('stateChage',val)
    }
  },
  emits:[]
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


.right .odd-new-arrows-wrap .odds-icon{
  right: 0;
}
.left .odd-new-arrows-wrap .odds-icon{
  left: 0;
}
// 解决赔率升降图标未对齐居中的问题
.odd-new-arrows-wrap .odds-icon{
  background-position: center;
}
.odds-arrows-wrap {
  &.odd-new-arrows-wrap{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 8px;
    box-sizing: content-box;
  }
  &.odd-old-arrows-wrap{
    position: relative;
    .odds-icon {
      left: -1px;
      top: -6px;
    }
  }
}
.odds-icon {
  width: 10px;
  height: 10px;
  position: absolute;
  overflow: hidden;
  display: none; //debug 调试
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
  display: flex;
  justify-content: center;
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
.compose_handicap {
  .handicap-value {
    justify-content: flex-start;
    padding-left: 12px;
    box-sizing: border-box;
    .handicap-value-text {
      width: auto;
    }
  }
  .odds {
    justify-content: flex-end;
    padding-right: 12px;
    box-sizing: border-box;
  }
}
.handicap-value-text {
  white-space: nowrap;
  color: var(--qq--match-text-color3);
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


.c-bet-item{
  // background-color: #FAFCFF;
  border-bottom: 4px;
  // 解决内嵌版内容区域不够, 赔率升降图标超出容器的问题, 使用padding-right撑宽容器
  padding-right: 2px;
  &.pro{
    &.up{
      background-color: var(--qq--odd-up-bg-color) !important;
    }
    &.down{
      background-color: var(--qq--odd-down-bg-color) !important;
    }
  }
}
.new-bg{
  background-color: var(--qq--yb-bg-color23);
  border-radius: 4px;
}
.new-s-bg{
  // 取消[赔率]组件的背景色 from: fix bug:45670
  // background-color:  var(--qq--list-data-bg-color);
}

.sizecolor{
  color:var(--qq--color-results-size)
}
</style>
