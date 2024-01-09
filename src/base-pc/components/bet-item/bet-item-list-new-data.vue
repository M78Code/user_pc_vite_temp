<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}{{UserCtr.user_version}}</div>
  <div
    v-if="is_mounted && odds_state != 'close'"
    class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[
      ol_data.class,
      odds_state,
      BetData.bet_oid_list.includes(ol_data.oid) ? 'active' : '',
      `csid${ol_data.csid}`,
      odds_lift,
      { 'show-odds-icon': odds_state != 'seal' },
    ]"
    @click.stop="bet_click_ol"
    :id="`list-${ol_data.oid}`"
  >
    <!-- 盘口 -->
    <div
      :class="[
        'handicap-value',
        {
          'color-highlight': ol_data.handicap_highlight,
          style2: ol_data.onbl && ol_data.csid == 2,
          left_cell: utils_info.is_iframe,
          'injury-time-goal': ol_data.ot === 'ClutchGoal',
          nogoal: ol_data.ot === 'NoGoal',
        },
      ]"
    >
      <span class="handicap-more" v-show="ol_data.onbl"
        >{{ ol_data.onbl }}&nbsp;</span
      >
      <div class="handicap-value-text handicap-value-ranks">{{ score }} {{ ol_data.onb }}</div>
    </div>

    <!-- 赔率 -->
    <div
      class="odds"
      :style="
        [1, 32, 17, 111, 119, 310, 311, 126, 129, 333, 20001, 20013].includes(
          +ol_data._hpid
        ) && utils_info.is_iframe
          ? 'flex:1.5'
          : ''
      "
    >
      <div v-if="odds_state == 'seal'" class="lock" />
      <span v-else>
        {{ ol_data.ov / 100000 }}
      </span>
      <div class="odds-arrows-wrap">
        <!-- 红升、绿降 -->
        <div class="odds-icon" v-if="odds_lift == 'up'" :style="compute_css_obj({ key: 'pc-home-arrow-up' })"></div>
        <div class="odds-icon" v-if="odds_lift == 'down'" :style="compute_css_obj({ key: 'pc-home-arrow-down' })"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import bet_item_mixin  from "src/public/components/bet_item/bet_item_list_new_data_mixin.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, onUnmounted, computed, watch } from "vue";
import lodash from 'lodash'
import {
  get_odds_active,
} from "src/output/index.js";
import { format_odds_value } from 'src/output/index.js';
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { compute_value_by_cur_odd_type, UserCtr } from "src/output/index.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import { compute_css_obj } from 'src/core/server-img/index.js'

const is_mounted = ref(true);
// 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
const odds_state = ref("");
// 赔率值
const match_odds = ref("");
// 赔率升降 up:上升 down:下降
const odds_lift = ref("");

const props = defineProps({
  ol_data: {
    type: [Object, Array],
    default: () => {},
  },
  match_data_type: {
    type: String,
    default: () => 'MatchDataWarehouse_PC_List_Common'
  },
});

//玩法比分
const score = computed(() => {
  let score = "";
  let { _hpid: hpid, ot = "", on } = props.ol_data;
  // 比分玩法的显示
  if ([7, 20, 74, 341, 342].includes(+hpid) && !lodash.isEmpty(ot)) {
    if (ot.includes(":")) {
      score = ot.replace(":", "-");
    } else if (lodash.toLower(ot) == "other") {
      score = on;
    }
  }
  return score;
});

/**
 * 赔率转换
 * @param  {number} ov - 赔率值
 * @param  {number} obv - 断档赔率值
 * @return {undefined} undefined
 */
// const format_odds = () => {
//   let ov = lodash.get(props.ol_data, "ov");
//   let obv = lodash.get(props.ol_data, "obv");
//   // 列表取 hsw
//   let hsw = props.ol_data._hsw;
//   let match_odds_info = compute_value_by_cur_odd_type(
//     ov ,
//     ov.hpid,
//     hsw || '',
//     1
//   );
//   console.log('match_odds_info', props.ol_data);
//   match_odds.value = format_odds_value(match_odds_info,props.ol_data.csid);
// };
let tid;
/**
 * 设置赔率升降
 * @param  {number} cur - 当前赔率值
 * @param  {number} old - 上次赔率值
 * @return {undefined} undefined
 */
const set_odds_lift = (cur, old) => {
  if (!["lock", 'seal'].includes(odds_state.value) && old && !is_odds_seal()
  ) {
    if (cur > old) {
      odds_lift.value = 'up'
    }
    else if (old > cur) {
      odds_lift.value = 'down'
    }
    clearTimeout(tid)
    tid = setTimeout(() => {
      odds_lift.value = "";
    }, 3000);
  }
};

/**
 * 取消赔率升降
 */
const clear_odds_lift = () => {
  clearTimeout(tid)
  odds_lift.value = "";
};

/**
 * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
 * @return {boolean}
 */
const is_odds_seal = () => {
  let ov = lodash.get(props.ol_data, "ov");
  let obv = lodash.get(props.ol_data, "obv");
  let _odds = ov || obv;
  return _odds < 101000;
};

/**
 * @description 获得最新的盘口状态
 * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
 * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
 * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
 * @return {undefined} undefined
 */
// const get_odds_state = (mhs, hs, os) => {
//   let _active = get_odds_active(mhs, hs, os);
//   let id = lodash.get(props.ol_data, "_hn") || lodash.get(props.ol_data, "oid");
//   let state = "";
//   const STATE = {
//     // 封盘
//     2: "seal",
//     // 关盘
//     3: "close",
//   };
//   if (!id) {
//     state = "disable";
//   } else if (STATE[_active]) {
//     state = STATE[_active];
//   } else {
//     let selected_class;
//     state = selected_class ? "active" : "normal";
//   }
//   // 当赔率对应的欧赔小于1.01时 ！！！！！！！！！！！！！！！！并且当前不在关盘状态，强制转换成封盘的状态 对盘口加锁
//   return is_odds_seal() && _active !== 3 ? "seal" : state;
// };

/**
 * @description 投注项点击
 * @return {undefined} undefined  组装投注项的数据
 */
 const bet_click_ol = () => {
  if (!props.ol_data.oid || odds_state.value == "lock" || odds_state.value == "seal") return
  const { oid, _hid, _hn, _mid } = props.ol_data
  let params = {
    oid, // 投注项id ol_obj
    _hid, // hl_obj 
    _hn,  // hn_obj
    _mid,  //赛事id mid_obj
  }
  let other = {
        is_detail: false,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        bet_type: 'common_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        device_type: 2,
        // 数据仓库类型
        match_data_type: props.match_data_type, // h5_detail
        // match_data_type: "h5_list", // h5_detail
    }
  // //点击后再次点击，取消选中状态
  // const current_id = `${_mid}${oid}`;
  // if (props.active_score === current_id) {
  //   emit('update_score', '')
  // } else {
  //   emit('update_score', current_id)
  // }
  set_bet_obj_config(params, other )
  // BetData.set_bet_state_show(true)
};


// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降 
// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降 
watch(() => [props.ol_data._hpid, props.ol_data.oid], (v, o) => {
  if (v[0] != o[0] || v[1] != o[1]){ //地址可能会变  但是oid不一定
    clear_odds_lift()
  }
})
// 监听投注项赔率变化
watch(() => props.ol_data.ov, (cur, old) => {
  if (cur == old) return
  // 红升绿降变化
  set_odds_lift(cur, old);
}, { deep: true })

onUnmounted(() => {
  // 清除定时器
  clearTimeout(tid)
});
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
.handicap-value-ranks{
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
  background: var(--q-gb-bg-c-13);
  color: var(--q-gb-t-c-18) !important;
}
</style>