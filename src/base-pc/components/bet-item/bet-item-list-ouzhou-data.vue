<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div v-if="is_mounted && odds_state != 'close'" class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[
      ol_data.class,
      `csid${ol_data.csid}`,
      odds_lift,
      BetData.bet_oid_list.includes(ol_data.oid) ? 'active' : '',
      odds_state != 'seal' && odds_state !== 'lock' && (ol_data.ov || score) && 'can-hover'
    ]" @click.stop="bet_click_ol" :id="`list-${ol_data.oid}`">
    <!-- 盘口 -->
    <div v-if="odds_state != 'seal'" :class="[
      'handicap-value',
      {
        'color-highlight': ol_data.handicap_highlight,
        style2: ol_data.onbl && ol_data.csid == 2,
        left_cell: utils.is_iframe,
        'injury-time-goal': ol_data.ot === 'ClutchGoal',
        nogoal: ol_data.ot === 'NoGoal',
      },
    ]">
      <span class="handicap-more" v-show="ol_data.onbl">{{ ol_data.onbl }}&nbsp;</span>
      <div class="handicap-value-text">{{ score }} <span v-show="ol_data._hpid != 1">{{ ol_data.onb }}</span></div>
    </div>
    <!-- 赔率 -->
    <div class="odds" :class="[odds_lift]" :style="[1, 32, 17, 111, 119, 310, 311, 126, 129, 333, 20001, 20013].includes(
      +ol_data._hpid
    ) && utils.is_iframe
      ? 'flex:1.5'
      : ''
      ">
      <div v-if="['seal'].includes(odds_state)" class="lock" :style="compute_css_obj({ key: 'pc-home-lock' })">
      </div>
      <span v-else-if="ol_data.ov">
        {{ match_odds }}
      </span>
      <div>

      </div>
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
import { onMounted, ref, onUnmounted, computed, watch } from "vue";
import lodash from 'lodash'
import {
  get_odds_active,
  utils,
} from "src/core/index.js";
import { format_odds_value } from 'src/core/format/module/format-odds.js';
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { compute_value_by_cur_odd_type } from "src/core/format/module/format-odds-conversion-mixin.js";
import { useGetItem } from "./bet_item_hooks.js";
import BetData from "src/core/bet/class/bet-data-class.js";// project/yazhou-h5/src/components/common/toast.vue
import { compute_css_obj } from 'src/core/server-img/index.js'

// 定时器对象
let timer_obj = {};
const props = defineProps({
  ol_data: {
    type: [Object, Array],
    default: () => { },
  },
  active_score: {
    type: String,
    default: () => { }
  },
  warehouse_name: {
    type: String,
    default: () => 'MatchDataWarehouse_PC_List_Common'
  }
});
const is_mounted = ref(true);
// 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
const odds_state = computed(() => {
  let { _mhs, _hs, os } = props.ol_data || {};
  return get_odds_state(_mhs, _hs, os);
});

// 赔率升降 up:上升 down:下降
const odds_lift = ref("");


const emit = defineEmits(['update_score'])





const {
  bet_click
} = useGetItem({ props });


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

onMounted(() => {
  // 异步设置组件是否挂载完成
  // setTimeout(() => {
  //   is_mounted.value = true;
  // });
});

// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降 
watch(() => [props.ol_data._hpid, props.ol_data.oid], () => {
  clear_odds_lift()
})


// 监听投注项赔率变化
watch(() => props.ol_data.ov, (cur, old) => {
  if (cur == old) return
  // 红升绿降变化
  set_odds_lift(cur, old);
}, { deep: true })

/**
 * 赔率转换
 * @param  {number} ov - 赔率值
 * @param  {number} obv - 断档赔率值
 * @return {undefined} undefined
 */
// 赔率值
const match_odds = computed(() => {
  let csid = lodash.get(props.ol_data, "csid");
  let ov = lodash.get(props.ol_data, "ov");
  // 列表取 hsw
  let hsw = props.ol_data._hsw.split(',');
  let match_odds_info = compute_value_by_cur_odd_type(
    ov,
    1 / 100000,
    hsw,
    csid
  );
  return format_odds_value(match_odds_info, csid);
})


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
function is_odds_seal() {
  let ov = lodash.get(props.ol_data, "ov");
  let obv = lodash.get(props.ol_data, "obv");
  let _odds = ov || obv;
  return _odds < 101000;
};

/**
   * @description: 检查是否选中
   * @param {String} 对象id
   * @return {Boolean} 是否包含
   */
function bet_item_select(id) {
  if (BetData.is_bet_single) {
    // 检查单关是否选中
    return BetData.bet_single_list.includes(id);
  } else {
    // 检查串关是否选中
    return BetData.bet_list.includes(id);
  }
};

/**
 * @description 获得最新的盘口状态
 * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
 * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
 * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
 * @return {undefined} undefined
 */
function get_odds_state(mhs, hs, os) {
  let _active = get_odds_active(mhs, hs, os);
  let id = lodash.get(props.ol_data, "_hn") || lodash.get(props.ol_data, "oid");
  let state = "";
  const STATE = {
    // 封盘
    2: "seal",
    // 关盘
    3: "close",
  };
  if (!id) {
    state = "disable";
  } else if (STATE[_active]) {
    state = STATE[_active];
  } else {
    let selected_class;
    selected_class = bet_item_select(id);
    state = selected_class ? "active" : "normal";
  }
  // 当赔率对应的欧赔小于1.01时 ！！！！！！！！！！！！！！！！并且当前不在关盘状态，强制转换成封盘的状态 对盘口加锁
  return is_odds_seal() && _active !== 3 ? "seal" : state;
};

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

  //点击后再次点击，取消选中状态
  const current_id = `${_mid}${oid}`;
  if (props.active_score === current_id) {
    emit('update_score', '')
  } else {
    emit('update_score', current_id)
  }
  set_bet_obj_config(params, {warehouse_name: props.warehouse_name})
  BetData.set_bet_state_show(true)
};

onUnmounted(() => {
  // 清除定时器
  clearTimeout(tid)
});
</script>

<style lang="scss" scoped>
.odds-arrows-wrap {
  position: relative;
}

.odds-icon {
  width: 6px;
  height: 10px;
  margin-left: 4px;
  overflow: hidden;
  background-size: 100% 100%;
  position: absolute;
  left: 0px;
  top: -5px;
}

.lock {
  width: 14px;
  height: 14px;
  background-size: 100%;
}

.has-hv {
  .handicap-value {
    display: none !important;
  }
}

/*  盘口样式 */
.handicap-value {
  line-height: 34px;
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
  height: 34px;
  line-height: 34px;
  justify-content: center;
  display: flex;
  align-items: center;
}

.c-bet-item {
  justify-content: center !important;
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
</style>
