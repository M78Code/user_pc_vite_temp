<!--
 * @Description: ouzhou-h5 投注项
-->

<template>
  <div class="score-list">
    <template v-if="score_data.length > 0">
      <span v-for="s in score_data" :key="s" :class="{active: active_score === `${match_info.id}${s.oid}` }">
        <span v-if="s.os === 1">{{ get_odd_os(s.ov) }}</span>
        <img v-else class="lock" :src="odd_lock_ouzhou" alt="lock">
      </span>
    </template>
    <template v-else>
      <span v-for="s in score_data.length" :key="s"><img class="lock" :src="odd_lock_ouzhou" alt="lock"></span>
    </template>
  </div>
</template>
 
<script setup>
import { computed, ref } from 'vue'
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'

const props = defineProps({
  hpid: {
    type: String,
    default: () => '1'
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
  const hps_item = hps.find(t => t.hpid == props.hpid)
  const ol = lodash.get(hps_item, 'hl[0].ol', [{}, {}, {}])
  console.log(ol)
  return ol
})

// 显示的赔率
const get_odd_os = (ov) => {
  return ov && (ov / 100000).toFixed(2)
}

</script>
 
<style scoped lang="scss">
 .score-list{
    display: flex;
    align-items: center;
    justify-items: center;
    padding-left: 5px;
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
      height: 58px;
      line-height: 58px;
    }
    .lock{
      width: 16px;
      height: 16px;
      position: relative;
    top: 2px;
  }
}
</style>