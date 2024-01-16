<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div class="score-list component">
    <template v-if="score_data.length > 0">
      <OddItem 
        v-for="s in score_data" 
        :key="s.oid"
        :hps="hps"
        :odd_item="s"
        :item_hs="item_hs"
        :show_hpn="show_hpn"
        :custom_type="custom_type"
        :match_info="match_info"></OddItem>
    </template>
     <!-- 锁 -->
    <template v-else>
      <span v-for="s, index in score_data.length" :key="index"><img class="lock" :src="odd_lock_ouzhou" alt="lock"></span>
    </template>
  </div>
</template>
 
<script setup>
import { computed, ref } from 'vue'
import OddItem from './odd-item.vue'
import lodash from 'lodash'
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js"
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { use_sports_play_title } from 'src/output/index.js'

const props = defineProps({
  // 容器高度
  height: {
    type: String,
    default: () => '58px'
  },
  // 默认展示个数
  score_length: {
    type: Number,
    default: () => 0
  },
  // 赛事信息
  match_info: {
    type: Object,
    default: () => {}
  },
  // 是否显示 玩法 前缀
  show_hpn: {
    type: Boolean,
    default: () => false
  },
  // 赔率 有的接口去 hpsPn 字段， 有的是 hps字段（默认）
  hps: {
    type: Array,
    default: () => []
  },
  // 是否需要跟随切换玩法变化  15 分  热门 不需要
  is_change: {
    type: Boolean,
    default: () => true
  },
  // 是否使用传过来的赔率 hps 最为渲染数据
  custom_type: {
    type: String,
    default: () => ''
  }
})

const ol_info = ref({})
const item_hs = ref(0)
const active_score = ref('')
const sports_play_title = use_sports_play_title()

// 赔率数据
const score_data = computed(() => {

  // 自定义hps获取
  if (props.custom_type === '15_mintues') return get_time_hps(props.hps)
  
  const hps_length = lodash.get(props.hps, 'length', 0)
  const hps = hps_length > 0 ? props.hps : props.match_info.hps
  const csid = props.match_info.csid
  // 本地 ol
  const plays = sports_play_title[csid]
  const default_hpid = plays && plays[0] && plays[0].hpid ? plays[0].hpid : '1'

  // 真实 ol
  const hpid = !props.is_change ? default_hpid : lodash.get(MatchResponsive.match_hpid_info.value, `csid_${csid}`, default_hpid)
  const ol_length = hpid === '1' ? 3 : 2

  const length = lodash.get(hps, 'length', 0)
  if (length === 0) return Array.from({ length: ol_length }, (i) => { return { } })

  const hps_item = hps.find(t => (t.chpid || t.hpid) == hpid)

  // structureLiveMatches 接口 结构不一样 hl 是对象
  item_hs.value = hps_length > 0 ? lodash.get(hps_item, 'hl.hs', 0) :  lodash.get(hps_item, 'hl[0].hs', 0)
  

  const play_item = plays && plays.find(t => t.hpid === hpid)
 
  // structureLiveMatches 接口 结构不一样 hl 是对象
  const ol_arr = hps_length > 0 ? lodash.get(hps_item, 'hl.ol', []) : lodash.get(hps_item, 'hl[0].ol', [])

  // 最终渲染数据
  const ol_data = lodash.get(play_item, 'ol', [])
  const target = [] 
  if (ol_arr.length > 0) {
    ol_data.forEach(t => {
      const item = ol_arr.find(o => o.ot === t.ot)
      target.push(item ? item : { })
    })
  }
  return target.length > 0 ? target : Array.from({ length: ol_length }, (i) => { return {  oid: i } })
})

// 处理15分赔率

const get_time_hps = (hps) => {
  const length = lodash.get(hps, 'length', 0)
  if (length < 1) return [{}, {}, {}]
  const item = hps.find(t => t.ot === 'X')
  const index = hps.findIndex(t => t.ot === 'X')
  hps.splice(index, 1)
  hps.splice(1, 0, item)
  return hps
}

</script>
 
<style scoped lang="scss">
 .score-list{
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    :deep(.odd-item){
      height: v-bind(height);
    }
    .lock{
      width: 16px;
      height: 16px;
      position: relative;
      top: 2px;
    }
  }
</style>