<!--
 * @Description: 冠军赛事投注项组件
-->
<template>
  <div :class="['ol-li-item flex items-center justify-between', {active: BetData.bet_oid_list.includes(ol_item.oid) }]" :data-oid="ol_item.oid"
    :id="DOM_ID_SHOW && `list-${lodash.get(ol_item, 'oid')}`"
    v-if="odd_status !== 3"> <!--关盘 odd_status === 3 移除-->
    <div class="on">
      {{ol_item.on || ol_item.ot}}
    </div>

    <!--封盘-->
    <div class="icon-lock-wrapper" v-if="odd_status === 2">
      <img class="icon-lock" :src="compute_img_url('icon-lock')" />
    </div>
    <!--开盘|锁盘-->
    <div v-else class="odds" :class="{red:red_green_status === 1,green:red_green_status === -1,}">
      <span v-show="red_green_status"
        :class="['change-icon', {'icon-red':red_green_status === 1,'icon-green':red_green_status === -1}]">
      </span>
      {{ compute_value_by_cur_odd_type(ol_item.ov,ol_item._hpid,ol_item._hsw,csid) }}
    </div>
    <div style="display: none;">{{ BetData.bet_data_class_version }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch} from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import lodash from 'lodash'
import { compute_value_by_cur_odd_type } from "src/output/index.js"
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

const props = defineProps({
  ol_item:Object,
  // 0:开, 1:封, 2:关, 11:锁
  hs:Number,        
  csid:String|Number,
})

const timer_ = ref(null)
const red_green_status = ref(0)
const DOM_ID_SHOW = ref(null)

onMounted(() => {
  // 设置是否显示投注项dom的id属性值
  DOM_ID_SHOW.value =  window?.BUILDIN_CONFIG?.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
})

watch(() => props.ol_item.ov, (v1,v0) => {
  let curr = Number(v1);
  let old = Number(v0);

  clearTimeout(timer_.value);
  if(curr > old){
    red_green_status.value = 1;
  }else if(curr < old){
    red_green_status.value = -1;
  }
 timer_.value = setTimeout(() => {
    red_green_status.value = 0;
  },3000);
})

const odd_status = computed(() => {
  if(!props.ol_item) return 3;
  //return $common.odds.get_odds_active(ol_item.ms,hs,ol_item.os);
  return props.ol_item;
})


</script>

<style lang="scss" scoped>

.ol-li-item {
  width: 49%;
  height: 0.4rem;
  padding: 0 0.1rem;
  margin-bottom: 0.02rem;
  border-radius: 0.04rem;
  overflow: hidden;

  &.active {
    background-color: var(--q-gb-bg-c-22) !important;
    .odds {
      color: var(--q-gb-t-c-20)!important;
    }
    .on {
      color: var(--q-gb-t-c-20)!important;
    }
  }

  &:nth-child(2n-1) {
    width: 48%;
    margin-right: 0.06rem;
    margin-bottom: 0.06rem;
  }

  .on {
    color: var(--q-gb-t-c-18);
    max-width: 1.06rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .icon-lock-wrapper {
    line-height: 1;

    .icon-lock {
      width: 0.12rem;
    }
  }

  .odds {
    color: var(--q-gb-t-c-18);
    position: relative;
    font-weight: 600;

    &.red {
      color: var(--q-color-com-fs-color-9) !important;
    }

    &.green {
      color: var(--q-color-com-fs-color-10) !important;
    }

    .change-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -0.09rem;
      width: 0.06rem;
      height: 0.05rem;
      display: inline-block;
      margin-right: 0.03rem;
      background-repeat: no-repeat;
      background-size: contain;

      &.icon-green {
        background-image: var(--q-color-com-img-bg-18);
      }

      &.icon-red {
        background-image: var(--q-color-com-img-bg-19);
      }
    }
  }
}
</style>
src/core/format/common/module/format-odds-conversion-mixin.js