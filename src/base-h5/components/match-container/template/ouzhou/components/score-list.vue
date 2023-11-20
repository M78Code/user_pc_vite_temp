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
  },
  show_hpn: {
    type: Boolean,
    default: () => false
  }
})

const ol_info = ref({})
const mhs = ref(0)
const item_hs = ref(0)
const active_score = ref('')

// 赔率数据
const score_data = computed(() => {
  const hps = props.match_info.hps
  const hpid = MatchResponsive.match_hpid.value
  const hps_item = hps && hps.find(t => t.hpid == hpid)
  mhs.value = lodash.get(props.match_info, 'mhs', 1)
  item_hs.value = lodash.get(hps_item, 'hl[0].hs', 1)
  const ol = lodash.get(hps_item, 'hl[0].ol', Array.from({ length: props.score_length }, (i) => { return {  oid: i } }))
  return ol.sort((a, b) => a.otd - b.otd)
})

</script>
 
<style scoped lang="scss">
 .score-list{
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    span.active{
      //color: #fff;
      color: var(--q-gb-t-c-2);
      background: #FF7000;
      border-radius: 2px;
      .hpn{
        position: relative;
        top: 1px;
      }
    }
    > span {
      flex: 1;
      font-size: 15px;
      //color: #FF7000;
      color: var(--q-gb-t-c-1);
      text-align: center;
      font-weight: 500;
      height: v-bind(height);
      line-height: v-bind(height);
      .hpn{
        color: #8A8986
      }
    }
    .lock{
      width: 16px;
      height: 16px;
      position: relative;
      top: 2px;
    }
    .item{
      &.up{
        color: #FF4646;
      }
      &.down{
        color: #17A414;
      }
      .hps_img{
        width: 6px;
        height: 10px;
      }
    }
  }
</style>