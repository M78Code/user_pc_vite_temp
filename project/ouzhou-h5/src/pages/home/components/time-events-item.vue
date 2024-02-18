<!--
* @Description: 15分 玩法
-->

<template>
  <!-- 卡片区 -->
  <div class="card" @click="toDetails">
    <!-- 标题 -->
    <div class="title">
      <SportIcon size="13" :sport_id="item.icon" />
      <span class="span">{{ item.title }}</span>
    </div>
    <!-- 赛事名称 -->
    <div class="game-name">
      <div :class="{'is-handicap': item.handicap_index == 1}">{{ item.mhn }}</div>
      <div :class="{'is-handicap': item.handicap_index == 2}">{{ item.man}}</div>
    </div>
  </div>
  <template v-if="item">
    <ScoreList :match_info="item" :score_length="3" height="39px" :show_hpn="true" :is_change="false" :hps="get_item_hps" custom_type="15_mintues" />
  </template>
</template>
<script setup>
import lodash from 'lodash'
import { computed, watch, inject } from 'vue'
import { useRouter } from "vue-router";
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';
import SportIcon from "src/base-h5/components/top-menu/top-menu-ouzhou-1/components/left-menu/sport-icon.vue"

/** @type {{time_events:Array<TYPES.MatchDetail>}} */
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

const get_hots_data = inject('get_hots_data')

const get_item_hps = computed(() => {
  const hps15Minutes = lodash.get(props.item, 'hps15Minutes', [])
  const length = lodash.get(hps15Minutes, 'length', 0)
  if (length < 1) return []
  const hps_item = hps15Minutes.find(t => t.hpid === '32')
  const hps = lodash.get(hps_item, 'hl[0].ol', [])
  return hps
})

const hSpecial = computed(() => {
  const hSpecial = lodash.get(props.item, 'hps15Minutes[0].hSpecial', '1')
  return hSpecial
})

watch(() => hSpecial.value, () => {
  get_hots_data()
})


/** 跳转赛事详情
 */
const router = useRouter()

const toDetails = () => {
  const { mid, tid, csid } = props.item
  router.push({
    name: "category",
    params: {
      mid: mid,
      tid: tid,
      csid: csid
    }
  })
}

</script>

<style scoped lang="scss">

.is-handicap{
  color: #FF7000;
}

</style>
