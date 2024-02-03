<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div style="display: none;">{{ BetData.bet_data_class_version }}</div>
  <div :class="['odd-item', {active: BetData?.bet_oid_list?.includes(odd_item.oid), vr_basketball_active: BetData?.bet_oid_list?.includes(odd_item.oid) && VR_CTR.state.virtual_current_sub_menuid == 1004}]" @click="set_old_submit">
    <!-- 显示 - -->
    <template v-if="is_show_template"> <span class="template">-</span> </template>
    <!-- 锁 -->
    <img v-else-if="is_lock" class="lock" :src="odd_lock_ouzhou" alt="lock">
    <!-- 是否显示赔率 -->
    <div v-else :class="['odd',  { 'up': is_up,  'down': is_down}]"> 
      <!-- 赔率 -->
        <span v-if="is_show_title" class="title">{{ odd_item.onb }}</span>
        <!-- 封盘 显示球头 加 锁 -->
        <template v-if="is_close">
          <img class="lock" :src="odd_lock_ouzhou" alt="lock">
        </template>
        <!-- 正常显示 -->
        <span v-else>
          <span class="hpn" v-if="show_hpn">{{ get_item_hpn(odd_item) }}</span> {{ get_odd_os(odd_item) }} 
          <!-- 绿升icon -->
          <img class="hps_img" v-if="is_up" :src="get_icon('up')" alt="">
          <!-- 红降icon -->
          <img class="hps_img" v-if="is_down" :src="get_icon('down')" alt="">
        </span>
    </div>
  </div>
</template>
 
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { odd_lock_ouzhou, ouzhou_hps_up, ouzhou_hps_down } from 'src/base-h5/core/utils/local-image.js'
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, compute_value_by_cur_odd_type, MenuData, use_sports_play_title } from "src/output/index.js"
import { useMittOn, MITT_TYPES } from  "src/core/mitt"
import VR_CTR from 'src/core/vr/vr-sports/virtual-ctr'

const props = defineProps({
  // 赔率 hps
  hps: {
    type: Array,
    default: () => []
  },
  // 单个玩法数据
  odd_item: {
    type: Object,
    default: () => {}
  },
  // 是否显示 左侧 hpn
  show_hpn: {
    type: Boolean,
    default: () => false
  },
  // 盘口状态
  item_hs: {
    type: Number,
    default: () => 0
  },
  // 赛事信息
  match_info: {
    type: Object,
    default: () => {}
  },
  // 是否使用传过来的赔率 hps 最为渲染数据
  custom_type: {
    type: String,
    default: () => ''
  }
})

const is_up = ref(false)
const is_down = ref(false)
const emitters = ref({})
const sports_play_title = use_sports_play_title()
//虚拟体育开0 封1
const virtual_odds_state = ref(0)

// 是否显示标题
const is_show_title = computed(() => {
  return get_current_hpid() != 1 && !props.show_hpn
})

// 是否锁盘  mhs： 0 开,  1 封,  2 关,  11 锁
const is_lock = computed(() => {
  return props.odd_item.os != 1 || +props.item_hs == 2 || props.match_info.mhs == 2 || virtual_odds_state.value == 1
  // return props.odd_item.os != 1 || [2,11].includes(+props.item_hs) || [2,11].includes(+props.match_info.mhs) || virtual_odds_state.value == 1
  // return props.odd_item.os != 1 || props.item_hs !== 0 || props.match_info.mhs !== 0 || virtual_odds_state.value == 1
})

// 是否封盘
const is_close = computed(() => {
  return props.match_info.mhs == 1 || props.item_hs == 1
})

// 是否显示 -
const is_show_template = computed(() => {
  const ol = get_current_ol()
  return lodash.isEmpty(ol)
})

/**
 * @description 获取当前玩法赔率
 */
const get_current_ol = () => {
  const hpid = get_current_hpid()
  const hps = is_custom_type() ? props.hps : props.match_info.hps
  const item = lodash.find(hps, (t) => t.hpid === hpid)
  // 有的接口 hl 是对象 （15分， 热门赛事）  有的是 数组
  const ol = is_custom_type() ? lodash.get(item, 'hl.ol', "") : lodash.get(item, 'hl[0].ol', "")
  return ol
}

// 获取 hpid
const get_current_hpid = () => {
  const { csid = '1' } = props.match_info
  const plays = sports_play_title[csid]
  const default_hpid = plays && plays[0] && plays[0].hpid ? plays[0].hpid : '1'
  const hpid = lodash.get(MatchResponsive.match_hpid_info.value, `csid_${csid}`, default_hpid)
  return hpid
}

/**
 * @description 是否自定义 hps
 */
 const is_custom_type = () => {
  return ['hots'].includes(props.custom_type)
}

onMounted(()=>{
  emitters.value = {
    // 封盘事件
    emitter_1: useMittOn(MITT_TYPES.EMIT_ARRIVED10, arrived10_handle).off,
  }
})

watch(() => props.odd_item?.ov, (a,b) => {
  if ( a != b ) {
    is_up.value = a > b
    is_down.value = a < b
    reset_status()
  }
})

//提前10秒通知锁盘
const arrived10_handle = () => {
  virtual_odds_state.value = 1
}

// 重置红升绿降
const reset_status = () => {
  let timer = setTimeout(() => {
    is_up.value = false
    is_down.value = false
    clearTimeout(timer)
    timer = null
  }, 3000)
}

// 显示的赔率
const get_odd_os = (s) => {
  return compute_value_by_cur_odd_type(s.ov,s._hpid,s._hsw,props.match_info.csid)
}

// 15分 hot 玩法标题
const get_item_hpn = (s) => {
  const { csid = '1' } = props.match_info
  let result = s.ot
  if (['hots', '15_mintues'].includes(props.custom_type)) {
    const plays = sports_play_title[csid] && sports_play_title[csid][0].ol
    const item = plays.find(t => t.ot === s.ot)
    if (item) result = item.title.substring(0,1)
  }
  return result
}

const get_icon = (type) => {
  let img_src = ''
  if (type === 'up'){
    img_src = ouzhou_hps_up
  } else {
    img_src = ouzhou_hps_down
  }
  return img_src
}

const set_old_submit = () => {
  const ol = props.odd_item
  const { match_data_type = 'h5_list' } = props.match_info
  if (is_lock.value || is_close.value) return
  // MatchResponsive.set_active_odd(`${props.match_id}_${ol.oid}`)
  const {oid,_hid,_hn,_mid } = ol
  let params = {
    oid, // 投注项id ol_obj
    _hid, // hl_obj 
    _hn,  // hn_obj
    _mid,  //赛事id mid_obj
  }

  let bet_type = 'common_bet'
  if (MenuData.is_esports()) {
    bet_type = 'esports_bet'
  } else if (MenuData.is_kemp()) {
    bet_type = 'guanjun_bet'
  } else if (MenuData.is_vr()) {
    bet_type = 'vr_bet'
  }
  let other = {
    is_detail: false,
    // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
    // 根据赛事纬度判断当前赛事属于 那种投注类型
    bet_type,
    // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
    device_type: 1,  
    // 数据仓库类型
    match_data_type: match_data_type, // h5_detail
  }
  console.log('score-list.vue ',params)
  set_bet_obj_config(params,other)
}

onUnmounted(() => {
  MatchResponsive.clear_active_odd()
  Object.values(emitters.value).map((x) => x())
})

</script>
 
<style scoped lang="scss">
.odd-item {
  flex: 1;
  font-size: 15px;
  color: var(--q-gb-t-c-1);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  &.active{
    color: var(--q-gb-t-c-2);
    border-radius: 2px;
    .odd {
      background: linear-gradient(0deg, rgba(255, 112, 0, 0.10) 0%, rgba(255, 112, 0, 0.10) 100%), #FFF;
    }
    .hpn{
      position: relative;
      top: 0px;
      color: #1A1A1A;
    }
  }

  &.vr_basketball_active{
    color: var(--q-gb-t-c-2);
    border-radius: 2px;
    .odd {
      // height: 100%;
      background: linear-gradient(0deg, rgba(255, 112, 0, 0.10) 0%, rgba(255, 112, 0, 0.10) 100%), #FFF;
      // background-color: orange;
    }
    .hpn{
      position: relative;
      top: 0px;
      color: #1A1A1A;
    }
  }

  .template{
    color: #8A8986
  }
  .hpn{
    color: #8A8986
  }
  .odd{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: var(--q-gb-t-c-1);
    .title{
      color: #8A8986;
      font-size: 14px;
      margin-bottom: 3px;
    }
    &.up{
      color: #FF4646;
    }
    &.down{
      color: #17A414;
    }
    .hps_img{
      width: 6px;
      height: 10px;
      position: absolute;
      margin: 3.5px 0 0 2px;
    }
  }
  .lock{
    width: 16px;
    height: 16px;
    position: relative;
  }
}
</style>