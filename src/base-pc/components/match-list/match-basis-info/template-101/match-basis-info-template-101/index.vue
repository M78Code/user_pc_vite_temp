<template>
  <div class="basic-wrap" @click.stop="details.on_go_detail(match, null, router, route)">
    <!-- 赛事信息 -->
    <div class="collect-box flex items-center justify-between">
      <div class="left-info-box flex items-center flex-start">
        <!-- 是否收藏 -->
        <div @click.stop="collect" v-if="GlobalAccessConfig.get_collectSwitch()">
          <div class="collect-start"
            :style="compute_css_obj({ key: is_collect ? 'pc-home-star-fill' : 'pc-home-star-empty' })"></div>
        </div>
        <!-- 比赛进程 -->
        <match-process style="cursor:pointer" v-if="match" :match="match" source='match_list' show_page="match-list"
          :rows="1" :date_rows="1" date_show_type="inline" periodColor="gray" />
      </div>
      <!-- 玩法数量 -->
      <div class="right-handle-box flex flex-start items-center" v-if="lodash.get(match, 'mhn')">
        <span>{{ handicap_num }}</span>
        <div class="yb-icon-arrow"></div>
      </div>
    </div>
    <!-- 主队信息 -->
    <div class="row-item">
      <div class="team-logo">
        <img v-if="show_type == 'all' && home_avatar"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_1_letter })"
          v-img="[((lodash.get(match, 'match_logo') || {}) || {}).home_1_logo, (lodash.get(match, 'match_logo') || {}).home_1_letter, null, update_show_default]" />
        <div v-else v-show="lodash.get(match, 'mhn')"
          :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_1_letter })">
        </div>
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{ 'bold': handicap_index == 1 }"
            v-tooltip="{ content: lodash.get(match, 'mhn') + play_name_obj.suffix_name, overflow: 1 }">
            {{ lodash.get(match, 'mhn') }}
          </div>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_home_goal">
            <div class="yb-goal-gif" :style="compute_css_obj({ key: 'goal_image' })">
            </div>
            <div class="gif-text">{{ i18n_t('common.goal') }}</div>
          </div>
          <div class="yb-flex-center" v-if="is_show_home_var" v-tooltip="{ content: var_text, overflow: 1 }">
            <div class="gif-text"> {{ var_text }} </div>
          </div>
          <!-- 红牌数 -->
          <span class="red-ball" v-show="lodash.get(match, 'msc_obj.S11.home', 0) > 0"
            :class="{ flash: is_show_home_red }">{{ lodash.get(match, 'msc_obj.S11.home') }}</span>
          <!-- 黄牌数 -->
          <span class="red-ball yellow"
            v-show="lodash.get(match, 'msc_obj.S12.home', 0) > 0 && lodash.get(match, 'msc_obj.S11.home', 0) < 0"
            :class="{ flash: is_show_home_red }">{{ lodash.get(match, 'msc_obj.S12.home') }}</span>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" v-if="show_type == 'all' && get_match_status(match.ms)"
        v-tooltip="{ content: is_15min ? i18n_t('list.15min_stage') : '', overflow: 1 }">{{ home_score }}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item kedui-item">
      <div class="team-logo">
        <img v-if="show_type == 'all' && away_avatar"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_1_letter })"
          v-img="[(lodash.get(match, 'match_logo') || {}).away_1_logo, (lodash.get(match, 'match_logo') || {}).away_1_letter, null, update_show_default]" />
        <div v-else v-show="lodash.get(match, 'man')"
          :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_1_letter })">
        </div>
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{ 'bold': handicap_index == 2 }">
            {{ lodash.get(match, 'man') }}{{ play_name_obj.suffix_name }}
          </div>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_away_goal">
            <div class="yb-goal-gif" :style="compute_css_obj({ key: 'goal_image' })">
            </div>
            <div class="gif-text">{{ i18n_t('common.goal') }}</div>
          </div>
          <div class="yb-flex-center" v-if="is_show_away_var" v-tooltip="{ content: var_text, overflow: 1 }">
            <div class="gif-text"> {{ var_text }} </div>
          </div>
          <!-- 红牌数 -->
          <span class="red-ball" v-show="lodash.get(match, 'msc_obj.S11.away') > 0" :class="{ flash: is_show_away_red }">{{
            lodash.get(match, 'msc_obj.S11.away') }}</span>
          <!-- 黄牌数 -->
          <span class="red-ball yellow"
            v-show="lodash.get(match, 'msc_obj.S12.away', 0) > 0 && lodash.get(match, 'msc_obj.S11.away', 0) < 0"
            :class="{ flash: is_show_away_red }">{{ lodash.get(match, 'msc_obj.S12.away') }}</span>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" :key="lodash.get(match, 'mid')" v-if="show_type == 'all' && get_match_status(match.ms)"
        v-tooltip="{ content: is_15min ? i18n_t('list.15min_stage') : '', overflow: 1 }">
        {{ away_score }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch, inject, onMounted, onUnmounted } from 'vue';
import lodash from 'lodash'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { get_match_status } from 'src/core/utils/common/index'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { MenuData, MatchDataWarehouse_PC_List_Common, i18n_t, compute_img_url } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { get_remote_time } from "src/output/index.js"
import details from "src/core/match-list-pc/details-class/details.js"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { useRouter, useRoute } from "vue-router";
import { format_mst_data } from 'src/core/utils/matches_list.js'
import { useMittEmit, MITT_TYPES, useMittOn } from 'src/core/mitt/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { get_handicap_index_by, get_match_score } from 'src/core/match-list-pc/match-handle-data.js'
import background from 'src/css-variables/base-h5/global/background';
const router = useRouter()
const route = useRoute()
const match = inject('match');
const props = defineProps({
  show_type: {
    type: String,
    default: () => ''
  },
  is_15min: {
    type: Boolean,
    default: false
  },
  is_show_more: {
    type: Boolean,
    default: false
  }
})
const is_show_home_goal = ref(false) // 是否显示主队进球动画
const is_show_away_goal = ref(false) // 是否显示客队进球动画
const is_show_home_red = ref(false) // 是否显示主队红牌动画
const is_show_away_red = ref(false) // 是否显示客队红牌动画
const is_show_away_var = ref(false) // 客队var事件
const is_show_home_var = ref(false) // 主队var事件
const var_text = ref(false) // var事件名称
const is_collect = ref(false) //赛事是否收藏
const show_default_img = ref(false); //是否显示默认队伍头像
let animation_timer = null;
const update_show_default = (value) => {
  show_default_img.value = value;
}
let mitt_list = []
let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(lodash.get(match.value, 'mid'))
const handicap_num = computed(() => {
  if (GlobalAccessConfig.get_handicapNum()) {
    const mc = lodash.get(match.value, 'mc')
    return mc ? `+${lodash.get(match.value, 'mc')}` : '+0'
  } else {
    return i18n_t('match_info.more')
  }
})
const home_avatar = computed(() => {
  const url = ((lodash.get(match.value, 'match_logo') || {}) || {}).home_1_logo;
  return url
})
const away_avatar = computed(() => {
  const url = (lodash.get(match.value, 'match_logo') || {}).away_1_logo;
  return url
})
const play_name_obj = computed(() => {
  let play_name_obj = {
    key: 'main',
    suffix_name: '',
    score_key: ''
  }
  let { ms, hSpecial } = match.value || {}
  //滚球
  if (get_match_status(ms, [110]) == 1) {
    //角球后缀
    if (MenuData.is_corner_menu()) {
      play_name_obj = {
        key: 'corner',
        suffix_name: ' - ' + i18n_t('list.corner'),
        score_key: 'S5'
      }
      //罚牌后缀
    } else if (match_style_obj.data_tpl_id == 25) {
      play_name_obj = {
        key: 'punish',
        suffix_name: ' - ' + i18n_t('list.punish'),
        score_key: 'S10102'
      }
      // 15分钟比分
    } else if (match_style_obj.data_tpl_id == 24) {
      play_name_obj = {
        key: 'main',
        suffix_name: '',
        score_key: `S100${hSpecial}`
      }
    }
  }
  return play_name_obj
})
const home_score = computed(() => {
  let obj = get_match_score(match.value)
  return obj.home_score
})
const away_score = computed(() => {
  let obj = get_match_score(match.value)
  return obj.away_score
})
let handicap_index = computed(() => {
  return get_handicap_index_by(match.value)
})
onMounted(() => {
  mitt_list = [
    useMittOn(MITT_TYPES.EMIT_VAR_EVENT, handle_var_event).off
  ]
})
/**
 * @Description 赛事收藏 
*/
const collect = () => {
  //前端修改收藏状态
  is_collect.value = !is_collect.value
  useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, match.value)
}
// 监听收藏变化
watch(() => match.value.mf, (n) => {
  is_collect.value = Boolean(n)
}, { immediate: true})
//进球特效防抖
// hide_home_goal = this.debounce(hide_home_goal,5000);
// hide_away_goal = this.debounce(hide_away_goal,5000);
// 监听收藏数量，更新收藏icon 颜色
// watch(get_collect_count, () => {
//   const cur = match.value_list_data.mid_obj
//   is_collect.value = Boolean (cur['mid_'+match.mid].mf)
// })
// 监听主比分变化
watch(home_score, (n, o) => {
  //推送时间是否过期
  let is_time_out = get_remote_time() - MatchDataWarehouse_PC_List_Common.ws_match_key_upd_time_cache_get_time(match.value, 'msc') < 3000
  // 足球 并且已开赛
  if (match.value.csid == 1 && get_match_status(match.value.ms, [110]) == 1 && n != 0 && n > o && is_time_out) {
    reset_event();
    is_show_home_goal.value = true;
  }
}, { deep: true })
// 监听主比分变化
watch(away_score, (n, o) => {
  //推送时间是否过期
  let is_time_out = get_remote_time() - MatchDataWarehouse_PC_List_Common.ws_match_key_upd_time_cache_get_time(match.value, 'msc') < 3000
  // 足球 并且已开赛
  if (match.value.csid == 1 && get_match_status(match.value.ms, [110]) == 1 && n != 0 && n > o && is_time_out) {
    reset_event();
    is_show_away_goal.value = true;
  }
}, { deep: true })
let timer;
/**
 * @description 开赛时间自动加1
 * @param {object} payload 
 */
const use_polling_mst = payload => {
  if (payload.cmec === 'timeout') return payload.mstValue = format_mst_data(payload.mst)
  // mlet 每个阶段的时间
  if ([301, 302, 303].includes(payload.mle)) return payload.mstValue = payload.mlet;
  if (Number(payload.mst) <= 0 || payload.ms !== 1) return
  if (payload.csid === '2') {
    timer = setInterval(() => {
      if (payload.mst <= 0) return
      payload.mst--
      payload.mstValue = format_mst_data(payload.mst)
    }, 1000)
  } else {
    timer = setInterval(() => {
      payload.mst++
      payload.mstValue = format_mst_data(payload.mst)
    }, 1000)
  }
}
// var 事件处理
function handle_var_event(ws_data) {
  const { skt_data: { mat, mid }, var_item } = ws_data
  if (match.value.mid !== mid) return
  if (mat === 'home') {
    is_show_home_var.value = true
  } else if (mat === 'away') {
    is_show_away_var.value = true
  } else {
    // 不确定队伍，则都显示
    is_show_home_var.value = true
    is_show_away_var.value = true
  }
  var_text.value = var_item[UserCtr.lang]
  clear_var_event()
}
/**
 * @description 清除var事件状态
 */
function clear_var_event() {
  let timer = setTimeout(() => {
    is_show_home_var.value = false
    is_show_away_var.value = false
    clearTimeout(timer)
    timer = null
  }, 10000)
}
// 重置事件
function reset_event() {
  clearTimeout(animation_timer)
  animation_timer = null
  is_show_home_goal.value = false
  is_show_away_goal.value = false
  is_show_home_var.value = false
  is_show_away_var.value = false
  is_show_home_red.value = false
  is_show_away_red.value = false
  animation_timer = setTimeout(() => {
    is_show_home_goal.value = false
    is_show_away_goal.value = false
  }, 5000)
}
onUnmounted(() => {
  clearInterval(timer);
  clearTimeout(animation_timer)
  animation_timer = null
  timer = null;
  mitt_list.forEach(i => i());
  // this.debounce_throttle_cancel(hide_home_goal());
  // this.debounce_throttle_cancel(hide_away_goal());
})
</script>
<style lang="scss" scoped>
.basic-wrap {
  padding: 10px 10px;
  .team-logo {
    display: flex;
    align-items: center;
    margin-right: 8px;
    img,
    div {
      width: 16px;
      height: 16px;
      background-size: 100%;
    }
  }
  .collect-box {
    margin-bottom: 7px;
    .collect-start {
      width: 14px;
      height: 14px;
      cursor: pointer;
      margin-right: 11px;
      background-size: 100% 100%;
    }
    .bet-num {
      margin-left: 12px;
      .match_times_hour {
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        color: var(--q-gb-bd-c-4);
        margin-right: 5px;
      }
      .match_times {
        color: var(--q-gb-bg-c-1);
        font-weight: 500;
      }
    }
    .right-handle-box {
      cursor: pointer;
      span {
        font-weight: 500;
        margin-right: 6px;
      }
    }
  }
  .row-item {
    position: relative;
    display: flex;
    height: 16px;
    align-items: center;
    cursor: pointer;
    &+.row-item {
      margin-top: 4px;
    }
    .team-name {
      max-width: 180px;
      &.bold {
        color: var(--q-gb-t-c-2);
      }
    }
    &.kedui-item {
      color: var(--q-gb-t-c-8);
    }
    .score {
      font-weight: 500;
      color: var(--q-gb-t-c-5);
    }
  }
  .red-ball {
    // position: absolute;
    // top: 0px;
    // left:1px;
    height: 14px;
    line-height: 14px;
    color: #fff;
    margin-left: 3px;
    min-width: 10px;
    padding: 0 1px;
    text-align: center;
    border-radius: 1px;
    font-size: 12px;
    background-color: #ff4141;
    &.yellow {
      background-color: #FFA800;
    }
    &.flash {
      animation: 1s text-flash linear infinite normal;
    }
  }
  :deep(.c-match-process) {
    .jingcai,
    .process-name {
      margin-right: 5px;
    }
    .date-wrap {
      padding-left: 0 !important;
    }
  }
}
.gif-text {
  white-space: nowrap;
  padding-left: 3px;
  animation: 1s text-flash linear infinite normal;
  color: #ff7000;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}</style>src/core/utils/common/indexsrc/output/index.js