<template>
  <div class="component odd-ol-item" v-if="vif"
    :class="[{ 'active': active }, status, type]"
  >
    <div class="icontainer" @click="common.betClick(value)">
      <template v-if="isLock">
        <div class="ol-lock">
          <img :src="odd_lock_ouzhou" alt="lock" class="ol-lock-img">
        </div>
      </template>
      <template v-else>
        <div class="item ol-name" :alt="olName"> {{ olName }} </div>
        <div class="separate"></div>
        <div class="item ol-content">
          <span>{{ ov }}</span>
          <img class="odd-image" :src="oddUp ? ouzhou_hps_up : ouzhou_hps_down" />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { compute_value_by_cur_odd_type, MatchDetailCalss } from "src/core/index.js"
import common, { state } from './common.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import {
  odd_lock_ouzhou,
  ouzhou_hps_up,
  ouzhou_hps_down,
  ouzhou_white_down,
  ouzhou_white_up
} from "src/base-h5/core/utils/local-image.js";

const props = withDefaults(defineProps<{
  value: TYPES.Ol,
  type?: TYPES.OlItemType
}>(), {
  type: 'default'
})
const sportId = MatchDetailCalss.params.sportId
// @ts-ignore
const vif =computed(()=>props.value._mhs == 0||props.value._mhs == 11)
const olName = (function(){
  if(props.type == 'fill'){
    // @ts-ignore
    return props.value.otv || props.value.on || props.value.ott
  }
  return props.value.on || props.value.ott
})()
// const active = computed(()=> BetData.bet_oid_list.includes(props.value.oid))
const active = computed(() => state.active == props.value.oid)
const status: Ref<'up' | 'down' | 'none'> = ref('none')
const oddUp = ref(false)

watch(() => props.value?.ov, (newVal, oldVal) => {
  status.value = (oddUp.value = newVal > oldVal) ? 'up' : 'down'
  resetStatus()
});

const ov = computed(() => {
  // @ts-ignore
  return compute_value_by_cur_odd_type(props.value.ov, props.value._hpid, '', sportId)
})
const isLock = computed(() => {
  if (props.value) {
    // @ts-ignore
    return props.value.os == 2 || ov.value == 0 || props.value._hs == 1
  } else {
    return true
  }
})

let timer = 0
function resetStatus() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    status.value = 'none'
  }, 3000)
}
</script>

<style scoped lang="scss">
.overflow {
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.component {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  box-shadow: 0 0 1px 1px #F5F5F5;
  flex-grow: 1;
  flex-basis: 25%;

  --private-ol-content-color: #FF7000;

  &.active {
    background-color: #FF70001A;
  }

  &.none {}

  &.up,
  &.down {
    .odd-image {
      visibility: visible;
    }
  }

  &.up {
    --private-ol-content-color: #FF4646;
  }

  &.down {
    --private-ol-content-color: #17A414;
  }
}

.icontainer {
  display: flex;
  width: 100%;
}

.separate {
  width: 10px;
}

.item {
  flex-basis: 25%;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.ol-name {
  text-align: right;
  justify-content: end;
}

.ol-content {
  color: var(--private-ol-content-color);
  display: flex;
  align-items: center;
  vertical-align: middle;
}

.odd-image {
  display: flex;
  --private-local-odd-image-size: 14px;
  width: var(--private-local-odd-image-size);
  height: var(--private-local-odd-image-size);
  object-fit: contain;
  visibility: hidden;
}

.ol-lock {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ol-lock-img {
  width: 16px;
  height: 16px;
}
.component.fill{
  .icontainer{
    padding: 0 20px;
  }
  .ol-name{
    text-align: left;
    justify-content: start;
  }
  .ol-content{
    flex: none;
    justify-content: end;
    .odd-image{
      position: absolute;
      transform: translateX(100%);
    }
  }
}
</style>