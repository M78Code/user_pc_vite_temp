<!--
 * @Author: Cooper
 * @Date: 2021-08-04 17:14:23
 * @Description: 投注项优化
-->
<template>
  <div
    v-if="ol_data_item && odds_state!='close' && _.get(ol_data_item,'_hs') != 2"
    class="c-bet-item yb-flex-center  relative-position"
    :class="[bet_source=='match_list' && 'list-show',bet_tpl, odds_lift, version_name,
    `csid${match.csid}`,![367,368,369,7,20,74,103,241,341,342,343,236,344].includes(_.get(play_data, 'hpid')*1)||(odds_state!=='seal'&&[367,368,369,7,20,74,103,241,341,342,343,236,344].includes(_.get(play_data, 'hpid')*1)) ? odds_state:'odds_state']"
    @click.stop="bet_click"
    :id="DOM_ID_SHOW && `${bet_source}-${ol_data_item.oid}`"
  >
    <div class="bet-inner yb-flex-center fit"
    :class="odds_state=='seal' && [367,368,369,7,20,74,103,241,341,342,343,236,344].includes(_.get(play_data, 'hpid')*1)? 'seal_on' :''"
    >
      <!-- 盘口 -->
      <div class="handicap-wrap" :class="bet_tpl">
        <slot>
          <div class="handicap-value" v-if="handicap_value">{{handicap_value}}</div>
          <div
            class="handicap-value yb-number-font yb-family-odds "
            :class="handicap_highlight && 'color-highlight'"
            v-else
          >
            <span v-show="ol_data_item.onbl" class="handicap-more">{{ol_data_item.onbl}}</span>
            <div class="ellipsis">
             {{score}} {{ol_data_item.onb}}
            </div>            
          </div>
        </slot>
      </div>
      <!-- 赔率 -->
      <div :class="['odds yb-number-font',odds_lift]" @click.stop="bet_click">
          <div v-if="odds_state=='seal' " class="lock"  :class="[367,368,369,7,20,74,103,241,341,342,343,236,344].includes(_.get(play_data, 'hpid')*1) ? 'seal_lock' : ''"> </div>
        <div 
          v-show="odds_state!='seal'" 
          :class="is_odds_value_red && 'color-red'"
        >
        <!-- ['match_details', 'hot','recent', 'match_list'].includes(bet_source)?  -->
          <span class="yb-family-odds yb-number-bold" :class="bet_source">{{match_odds | format_odds_value}}</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import bet_item_mixin  from "src/public/components/bet_item/bet_item_mixin.js";  

export default {
    name: "BetItem",
    mixins: [bet_item_mixin],
  };

</script>

<style lang="scss" scoped>
.lock {
  width: 12px;
  height: 12px;
}
.has-hv {
  .handicap-value {
    display: none !important;
  }
}
.handicap-value,
.yb-family-odds {
  line-height: 34px;
}
.odds.hv {
  justify-content: flex-start !important;
}
.no-handicap,
.no-handi,
.null-handicap {
  .handicap-wrap {
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
.seal_on{
justify-content: space-around;
 
}
.seal_lock{
  margin-left:-20px ;
}
.bet-front{
  color: var(--qq--theme-color-handicap-item-title);
  font-size: 12px;
}
</style>
