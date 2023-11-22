<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div style="display: none;">{{ BetData.bet_data_class_version }}</div>
  <div :class="['odd-item', {active: BetData.bet_oid_list.includes(odd_item.oid) }]" @click="set_old_submit">
    <!-- 锁 -->
    <img v-if="is_lock" class="lock" :src="odd_lock_ouzhou" alt="lock">
    <!-- 是否显示赔率 -->
    <div v-else :class="['odd',  { 'up': is_up,  'down': is_down}]"> 
      <!-- 赔率 -->
        <span v-if="is_show_title" class="title">{{ odd_item.onb }}</span>
        <span>
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
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { odd_lock_ouzhou, ouzhou_hps_up, ouzhou_hps_down, ouzhou_white_up } from 'src/base-h5/core/utils/local-image.js'
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, compute_value_by_cur_odd_type } from "src/core/index.js"

const props = defineProps({
  odd_item: {
    type: Object,
    default: () => {}
  },
  show_hpn: {
    type: Boolean,
    default: () => false
  },
  csid: {
    type: [String, Number],
    default: () => '1'
  },
  match_id: {
    type: Number,
    default: () => 1
  },
  // 盘口状态
  item_hs: {
    type: Number,
    default: () => 0
  },
  // 赛事状态
  mhs: {
    type: Number,
    default: () => 0
  }
})

const is_up = ref(false)
const is_down = ref(false)
const old_ov = ref(0)

const is_show_title = computed(() => {
  const hpid = lodash.get(MatchResponsive.match_hpid_info.value, `csid_${props.csid}`, '1')
  return hpid != 1
})

const is_active = computed(() => {
  return MatchResponsive.active_odd.value === `${props.match_id}_${props.odd_item.oid}`
})

watch(() => props.odd_item?.ov, (a,b) => {
  if ( a != b ) {
    is_up.value = a > b
    is_down.value = a < b
    reset_status()
  }
})

const reset_status = () => {
  let timer = setTimeout(() => {
    is_up.value = false
    is_down.value = false
    clearTimeout(timer)
    timer = null
  }, 5000)
}

// 显示的赔率
const get_odd_os = (s) => {
  return compute_value_by_cur_odd_type(s.ov,'','',props.csid)
}

const get_item_hpn = (s) => {
  return s.ot
}

// 是否锁盘
const is_lock = computed(() => {
  return props.odd_item.os != 1 || props.item_hs == 1 || props.mhs == 1
})

const get_icon = (type) => {
  let img_src = ''
  if (type === 'up'){
    img_src = BetData.bet_oid_list.includes(props.odd_item.oid) ? ouzhou_white_up : ouzhou_hps_up
  } else {
    img_src = BetData.bet_oid_list.includes(props.odd_item.oid) ? ouzhou_white_up : ouzhou_hps_down
  }
  return img_src
}

const set_old_submit = () => {
  console.log(props.odd_item)
  const ol = props.odd_item
  if (is_lock.value) return
  // MatchResponsive.set_active_odd(`${props.match_id}_${ol.oid}`)
  const {oid,_hid,_hn,_mid } = ol
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
    device_type: 1,  
    // 数据仓库类型
    match_data_type: "h5_list", // h5_detail
  }
  console.log('score-list.vue ',params)
  set_bet_obj_config(params,other)
}

onUnmounted(() => {
  MatchResponsive.clear_active_odd()
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
    background: #FF7000;
    border-radius: 2px;
    .odd .title{
      color: #fff;
    }
    .hpn{
      position: relative;
      top: 1px;
    }
    .odd.up{
      color: #fff;
       img {
        transform: rotateX(0deg);
      }
    }
    .odd.down{
      color: #fff;
      img {
        transform: rotateX(180deg);
      }
    }
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
    .title{
      color: #8A8986;
      font-size: 14px;
      margin-bottom: 3px;
    }
    &.up{
      color: #FF4646;
      img {
        transform: rotateX(-180deg);
      }
    }
    &.down{
      color: #17A414;
      img {
        transform: rotateX(-180deg);
      }
    }
    .hps_img{
      width: 6px;
      height: 10px;
    }
  }
  .lock{
    width: 16px;
    height: 16px;
    position: relative;
  }
}
</style>