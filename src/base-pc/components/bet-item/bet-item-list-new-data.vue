<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}{{ UserCtr.user_version }}</div>
  <div v-if="is_mounted && odds_state != 'close'" class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[
      ol_data.class,
      odds_state,
      BetData.bet_oid_list.includes(ol_data.oid) ? 'active' : '',
      `csid${ol_data.csid}`,
      odds_lift,
      { 'show-odds-icon': odds_state != 'seal' },
      { 'oddsup': odds_lift == 'up' },
      { 'oddsdown': odds_lift == 'down' }
    ]" @click.stop="bet_click_ol" :id="`list-${ol_data.oid}`">
    <!-- 盘口 -->
    <div :class="[
      'handicap-value',
      {
        'color-highlight': ol_data.handicap_highlight,
        style2: ol_data.onbl && ol_data.csid == 2,
        left_cell: utils_info.is_iframe,
        'injury-time-goal': ol_data.ot === 'ClutchGoal',
        nogoal: ol_data.ot === 'NoGoal',
      },
    ]" v-if="ol_data.onbl || score || ol_data.onb">
      <span class="handicap-more" v-show="ol_data.onbl">{{ ol_data.onbl }}&nbsp;</span>
      <div class="handicap-value-text handicap-value-ranks">{{ score }} {{ ol_data.onb }}</div>
    </div>
    <!-- 赔率 -->
    <div class="odds" :style="[1, 32, 17, 111, 119, 310, 311, 126, 129, 333, 20001, 20013].includes(
      +ol_data._hpid
    ) && utils_info.is_iframe
      ? 'flex:1.5'
      : !(ol_data.onbl || score || ol_data.onb) ? 'flex:0' : ''
      " v-if="ol_data.oid">
      <div v-if="odds_state == 'seal'" class="lock" />
      <span v-else>
        {{ compute_value_by_cur_odd_type(
          ol_data.ov,
          ol_data._hpid,
          ol_data._hsw,
          ol_data.csid || match?.csid
        ) }}
      </span>
      <div class="odds-arrows-wrap">
        <!-- 红升、绿降 -->
        <div class="odds-icon" v-if="odds_lift == 'up'" :style="compute_css_obj({ key: 'pc-home-arrow-up' })"></div>
        <div class="odds-icon" v-if="odds_lift == 'down'" :style="compute_css_obj({ key: 'pc-home-arrow-down' })"></div>
      </div>
    </div>
    <div class="no-odds" v-else>-</div>
  </div>
</template>

<script setup>
import { compute_css_obj } from 'src/core/server-img/index.js'
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { compute_value_by_cur_odd_type } from "src/output/index.js";
import { use_bet_item } from 'src/base-pc/mixin/bet-item.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { inject } from "vue";
import { onMounted } from 'vue';

const props = defineProps({
  ol_data: {
    type: [Object, Array],
    default: () => { },
  },
  active_score: {
    type: String,
    default: () => ''
  },
  match_data_type: {
    type: String,
    default: () => 'MatchDataWarehouse_PC_List_Common'
  },
  is_scroll_ball: {
    type: Boolean,
    default: () => false
  },
  csid: {
    type: String,
    default: () => ''
  }
});
const match = inject('match', null)
const {
  bet_click_ol, disk_text_replace, bet_item_select, score, odds_state, odds_lift, is_mounted
} = use_bet_item(props)
const emit = defineEmits(['oddsChange', 'stateChage'])

onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(()=>{
    // 冒泡初始化时的选中状态
    emit('stateChage', odds_state)
  })
})

</script>

<style lang="scss" scoped>
.no-odds {
  font-weight: 600;
  font-size: 12px;
  color: var(--q-gb-t-c-3);
}
.c-bet-item {
  border-radius: 4px;
  background-color: var(--q-gb-bg-c-27);
  justify-content: center;
}

.oddsup {
  background-color: var(--q-gb-bg-c-28) !important;
}

.oddsdown {
  background-color: var(--q-gb-bg-c-29) !important;
}

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
  left: 2px;
  top: -6px;
  overflow: hidden;
}

.odds-up {
  background: url($SCSSPROJECTPATH+"/image/svg/up.svg") no-repeat 100%;
}

.odds-down {
  background: url($SCSSPROJECTPATH+"/image/svg/down.svg") no-repeat 100%;
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
  white-space: nowrap;

  &.style2 {
    min-width: 57%;

    .handicap-value-text {
      min-width: 30px;
    }
  }

  &.left_cell.nogoal {
    flex: 1.5;
  }

  &.injury-time-goal {
    flex: 1.7;

    &.left_cell {
      flex: 2.3;
    }
  }
}

/*  赔率样式 */
.odds {
  flex: 1;
  font-weight: 600;
  color: var(--q-gb-t-c-3);
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
  color: var(--q-gb-t-c-16);
}

.handicap-value-ranks {
  -color: var(--q-gb-t-c-20);
}

.vertical {
  flex-direction: column;

  .handicap-value {
    line-height: 30px;
    height: 26px;
  }

  .odds {
    margin: 0;
  }
}

.left_cell {
  text-align: left !important;
}

.active {
  background: var(--q-gb-t-c-16);
  color: var(--q-gb-t-c-18) !important;
}
</style>