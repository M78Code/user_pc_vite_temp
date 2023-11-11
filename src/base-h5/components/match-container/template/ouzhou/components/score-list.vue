<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div class="score-list">
    <template v-if="score_data.length > 0">
      <span v-for="s in score_data" :key="s" @click="set_old_submit(s)" :class="{active: active_score === `${match_info.id}${s.oid}` }">
        <span v-if="s.os === 1">{{ get_odd_os(s.ov) }}</span>
        <img v-else class="lock" :src="odd_lock_ouzhou" alt="lock">
      </span>
    </template>
    <template v-else>
      <span v-for="s, index in score_data.length" :key="index"><img class="lock" :src="odd_lock_ouzhou" alt="lock"></span>
    </template>
  </div>
</template>
 
<script setup>
import { computed, ref } from 'vue'
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
import { compute_value_by_cur_odd_type } from "src/core/index.js"
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

const props = defineProps({
  height: {
    type: String,
    default: () => '58px'
  },
  score_length: {
    type: Number,
    default: () => 3
  },
  match_info: {
    type: Object,
    default: () => {}
  }
})

const active_score = ref('')

// 赔率数据
const score_data = computed(() => {
  const hps = props.match_info.hps
  const hpid = MatchResponsive.match_hpid.value
  const hps_item = hps && hps.find(t => t.hpid == hpid)
  const ol = lodash.get(hps_item, 'hl[0].ol', Array.from({ length: props.score_length }, (i) => { return {  oid: i } }))
  return ol
})

// 显示的赔率
const get_odd_os = (ov) => {
  return  compute_value_by_cur_odd_type(ov,'','',props.match_info.csid)
}

const set_old_submit = (ol) => {
  if (ol.os !== 1) return
  active_score.value = `${props.match_info.id}${ol.oid}`
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
 .score-list{
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    span.active{
      color: #fff;
      background: #FF7000;
      border-radius: 2px;
    }
    > span {
      flex: 1;
      font-size: 15px;
      color: #FF7000;
      text-align: center;
      font-weight: 500;
      height: v-bind(height);
      line-height: v-bind(height)
    }
    .lock{
      width: 16px;
      height: 16px;
      position: relative;
      top: 2px;
  }
}
</style>