<template>
  <div v-show="false">
    {{ BetData.bet_data_class_version }} {{ UserCtr.user_version }}
  </div>
  <div
    v-if="is_mounted"
    class="c-bet-item yb-flex-center relative-position yb-family-odds"
    :class="[
      ol_data.class,
      odds_state,
      `csid${route.params.csid}`,
      odds_lift,
      {
        'show-odds-icon': odds_state != 'seal',
        'active-odds-icon': BetData.bet_oid_list.includes(ol_data.oid),
      },
    ]"
    :id="`list-${ol_data.oid}`"
  >
    <!-- 盘口 -->
    <!-- <div
      :class="[
        'handicap-value',
        {
          'color-highlight': ol_data.handicap_highlight,
          style2: ol_data.onbl && ol_data.csid == 2,
          left_cell: utils_infois_iframe,
          'injury-time-goal': ol_data.ot === 'ClutchGoal',
          nogoal: ol_data.ot === 'NoGoal',
        },
      ]"
    >
      <span class="handicap-more" v-show="ol_data.onbl"
        >{{ ol_data.onbl }}&nbsp;</span
      >
      <div class="handicap-value-text">{{ score }} {{ ol_data.onb }}</div>
    </div> -->

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
      <!-- <div v-if="['seal'].includes(odds_state)" class="lock" /> -->

      <!-- <div
        style="text-align: center; width: 100%"
        v-if="['seal','close'].includes(odds_state)"
      >
        <img
          class="vector"
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
          alt=""
        />
      </div> -->
      <div class="odds-arrows-wrap">
        <span
          :class="{
            default: true,
            up: odds_lift == 'up',
            down: odds_lift == 'down',
          }"
        >
       <!-- 挂锁 -->
          <div
            style="text-align: center; width: 100%"
            v-if="['seal', 'close'].includes(odds_state)"
          >
            <img
              class="vector"
              :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
              alt=""
            />
          </div>
          <!-- 赔率 -->
          <span v-else>
            {{
              compute_value_by_cur_odd_type(
                ol_data.ov,
                ol_data._hpid,
                ol_data._hsw,
                ol_data.csid
              )
            }}</span
          >
        </span>
        <span class="default-point" v-if="!odds_lift"></span>
        <div v-if="odds_state != 'seal'">
          <!-- 红升、绿降 -->
          <div class="odds-icon odds-up"></div>
          <div class="odds-icon odds-down"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
// import bet_item_mixin  from "src/public/components/bet_item/bet_item_list_new_data_mixin.js";
import { onMounted, ref, onUnmounted, computed, watch } from "vue";
// import lodash from "lodash";
import {
  LOCAL_PROJECT_FILE_PREFIX,
  get_odds_active,
  format_odds_value,
  compute_value_by_cur_odd_type,
} from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useRoute } from "vue-router";
import { utils_info } from "src/core/utils/common/module/match-list-utils.js";

const is_mounted = ref(true);

// 赔率值
// const match_odds = ref("");
// 赔率升降 up:上升 down:下降
const odds_lift = ref("");
// 是否红升绿降中
const odds_lift_show = ref(false);

const route = useRoute();

// 定时器对象
let timer_obj = {};

const props = defineProps({
  ol_data: {
    type: [Object, Array],
    default: () => {},
  },
  current_ol: {
    // 当前选中的数据
    type: [Object, Array],
    default: () => {},
  },
});

// 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
const odds_state = computed(() => {
  let { _mhs, _hs, os } = props.ol_data || {};
  return get_odds_state(_mhs, _hs, os);
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
const match_odds = computed(() => {
  let ov = lodash.get(props.ol_data, "ov");
  let obv = lodash.get(props.ol_data, "_hpid");
  // 列表取 hsw
  let hsw = props.ol_data._hsw;
  let match_odds_info = compute_value_by_cur_odd_type(
    ov,
    obv || "",
    hsw || "",
    1,
    UserCtr.user_version.value
  );

  return format_odds_value(match_odds_info, props.ol_data.csid);
});

/**
 * @description 获得最新的盘口状态
 * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
 * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
 * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
 * @return {undefined} undefined
 */
const get_odds_state = (mhs, hs, os) => {
  let _active = get_odds_active(mhs, hs, os);
  // console.log(1111111111111,_active)
  let id = lodash.get(props.ol_data, "_hn") || lodash.get(props.ol_data, "oid");
  let state = "";
  const STATE = {
    // 封盘
    2: "seal",
    // 关盘
    3: "close",
    // 封盘
    // 4: "seal",
  };
  if (!id) {
    state = "disable";
  } else if (STATE[_active]) {
    state = STATE[_active];
  } else {
    let selected_class;
    state = selected_class ? "active" : "normal";
  }
  // 当赔率对应的欧赔小于1.01时 ！！！！！！！！！！！！！！！！并且当前不在关盘状态，强制转换成封盘的状态 对盘口加锁
  return is_odds_seal() && _active !== 3 ? "seal" : state;
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
 * 设置赔率升降
 * @param  {number} cur - 当前赔率值
 * @param  {number} old - 上次赔率值
 * @return {undefined} undefined
 */
let tid;
/**
 * 设置赔率升降
 * @param  {number} cur - 当前赔率值
 * @param  {number} old - 上次赔率值
 * @return {undefined} undefined
 */
const set_odds_lift = (cur, old) => {
  if (!["lock", "seal"].includes(odds_state.value) && old && !is_odds_seal()) {
    odds_lift.value = cur > old ? "up" : "down";
    // props.ol_data.odds_lift =  odds_lift.value
    clearTimeout(tid);
    tid = setTimeout(() => {
      odds_lift.value = "";
      // props.ol_data.odds_lift = ''
    }, 3000);
  }
};

onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(() => {
    is_mounted.value = true;
  });
});

// 监听oid 取消赔率升降
// 监听玩法ID变化 取消赔率升降
watch(
  () => [props.ol_data._hpid, props.ol_data.oid],
  () => {
    clear_odds_lift();
  }
);

// 监听投注项赔率变化
watch(
  () => props.ol_data.ov,
  (cur, old) => {
    if (cur == old) return;
    // 红升绿降变化
    set_odds_lift(cur, old);
  },
  { immediate: true }
);

/**
 * 取消赔率升降
 */
function clear_odds_lift() {
  clearTimeout(tid);
  odds_lift.value = "";
}

onUnmounted(() => {
  // 清除定时器
  for (const key in timer_obj) {
    clearTimeout(timer_obj[key]);
    timer_obj[key] = null;
  }
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
.active-odds-icon {
  // .odds-up {
  //   background: url($SCSSPROJECTPATH + "/image/svg/active_arrow.svg") no-repeat
  //     100% !important;
  //   transform: rotate(180deg);
  // }
  // .odds-down {
  //   background: url($SCSSPROJECTPATH + "/image/svg/active_arrow.svg") no-repeat
  //     100% !important;
  // }
}
.odds-arrows-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 10px;
  // min-width: 150px;
  .up {
    color: var(--q-gb-t-c-7) !important;
  }
  .down {
    color: var(--q-gb-t-c-6) !important;
  }
  .default {
    color: var(--q-gb-t-c-2);
  }
  .active {
    color: var(--q-gb-t-c-1);
  }
}
.default-point {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  display: inline-block;
}
.odds-icon {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  // position: absolute;
  // right: -12px;
  // top: 18px;
  overflow: hidden;
  display: none;
}
.odds-up {
  background: url($SCSSPROJECTPATH + "/image/svg/down.svg") no-repeat 100%;
  transform: rotate(180deg);
}
.odds-down {
  background: url($SCSSPROJECTPATH + "/image/svg/up.svg") no-repeat 100%;
  transform: rotate(180deg);
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
  // flex: 1;
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
.vector {
  width: 16px;
  height: 16px;
}
</style>
