<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div class="score-list">
    <template v-if="score_data.length > 0">
      <OddItem 
        v-for="s in score_data" 
        :key="s.oid"
        :odd_item="s"
        :mhs="mhs"
        :item_hs="item_hs"
        :match_id="match_info.id"
        :csid="match_info.csid"
        :show_hpn="show_hpn"></OddItem>
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
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js"
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { sports_play_title } from 'src/core/constant/index.js'

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
  // 是否需要跟随切换玩法变化  15 分  热门 不需要
  is_change: {
    type: Boolean,
    default: () => true
  }
})

const ol_info = ref({})
const mhs = ref(0)
const item_hs = ref(0)
const active_score = ref('')

// 赔率数据
const score_data = computed(() => {
  
  const hps = props.match_info.hps
  const csid = props.match_info.csid

  const length = lodash.get(hps, 'length', 0)
  if (length === 0) return [{}, {}, {}]

  // 真实 ol
  const hpid = !props.is_change ? '1' : lodash.get(MatchResponsive.match_hpid_info.value, `csid_${csid}`, '1')
  const hps_item = hps.find(t => t.chpid == hpid)
  mhs.value = lodash.get(props.match_info, 'mhs', 1)
  item_hs.value = lodash.get(hps_item, 'hl[0].hs', 1)
  
  // 本地 ol
  const plays = sports_play_title[csid]
  const play_item = plays.find(t => t.hpid === hpid)
  
  const ol_length = hpid === '1' ? 3 : 2
  const ol_arr = lodash.get(hps_item, 'hl[0].ol', [])

  
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