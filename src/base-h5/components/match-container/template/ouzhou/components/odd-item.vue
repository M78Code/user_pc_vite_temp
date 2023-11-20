<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
  <span :class="['odd-item', {active: active_score === `${match_id}_${odd_item.oid}` }]" @click="set_old_submit">
    <!-- 锁 -->
    <img v-if="is_lock" class="lock" :src="odd_lock_ouzhou" alt="lock">
    <!-- 是否显示赔率 -->
    <span v-else :class="['item',  { 'up': is_up,  'down': is_down}]"> 
      <!-- 赔率 -->
      <span class="hpn" v-if="show_hpn">{{ get_item_hpn(odd_item) }}</span> {{ get_odd_os(odd_item) }} 
      <!-- 红升icon -->
      <img class="hps_img" v-if="is_up" :src="ouzhou_hps_up" alt="">
      <!-- 绿降icon -->
      <img class="hps_img" v-if="is_down" :src="ouzhou_hps_down" alt="">
    </span>
  </span>
</template>
 
<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { odd_lock_ouzhou, ouzhou_hps_up, ouzhou_hps_down } from 'src/base-h5/core/utils/local-image.js'
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
    type: String,
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
const active_score = ref('')

watch(() => props.odd_item?.ov, (a,b) => {
  is_up.value = a > b
  is_down.value = a < b
  reset_status()
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

const set_old_submit = () => {
  const ol = props.odd_item
  if (ol.os !== 1) return
  active_score.value = `${props.match_id}_${ol.oid}`
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

</script>
 
<style scoped lang="scss">
.odd-item {
  flex: 1;
  font-size: 15px;
  //color: #FF7000;
  color: var(--q-gb-t-c-1);
  text-align: center;
  font-weight: 500;
  height: v-bind(height);
  line-height: v-bind(height);
  &.active{
    color: var(--q-gb-t-c-2);
    background: #FF7000;
    border-radius: 2px;
    .hpn{
      position: relative;
      top: 1px;
    }
  }
  .hpn{
    color: #8A8986
  }
  .item{
    &.up{
      color: #FF4646;
      > img {
        transform: rotateX(-180deg);
      }
    }
    &.down{
      color: #17A414;
      > img {
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
    top: 2px;
  }
}
</style>