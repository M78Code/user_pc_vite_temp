<template>
  <div class="component odd-ol-item"
    :class="[{ 'active': active }, status, type, calcOlResult(value['result'])]"
  >
    <div class="icontainer" v-if="vif"
      :class="{'ol-v-hide': isLock}"
      @click="onClick"
    >
      <template v-if="isLock" @click.stop>
        <div class="ol-lock" :class="{'ol-v-show': isLock}">
          <img :src="odd_lock_ouzhou" alt="lock" class="ol-lock-img">
        </div>
      </template>
      <div class="item ol-name" :alt="olName">
        <span class="ol-name-span">{{ olName }}</span>
      </div>
      <div class="separate"></div>
      <div class="item ol-content">
        <div class="ol-content-ov">
          <span v-if="isLock">0.xx</span>
          <span v-else>{{ ov }}</span>
          <img class="odd-image" v-show="status != 'none'"
            :src="oddUp ? ouzhou_hps_up : ouzhou_hps_down" />
        </div>
      </div>
    </div>
    <!-- 赛果 -->
    <div class="icontainer ol-result" v-else
    >
      <div class="item ol-name" :alt="olName">
        <span class="ol-name-span">{{ olName }}</span>
      </div>
      <div class="separate"></div>
      <div class="item ol-content or-state">
        <div class="ol-content-ov">
          {{ i18n_t('bet_record.bet_no_status0'+value['result']) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { compute_value_by_cur_odd_type, MatchDetailCalss } from "src/output/index.js"
import common, { state } from './common.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import {
  odd_lock_ouzhou,
  ouzhou_hps_up,
  ouzhou_hps_down,
  ouzhou_white_down,
  ouzhou_white_up
} from "src/base-h5/core/utils/local-image.js";
import ResultOlItem from '../../result/ResultOlItem.vue';
import { calcOlResult } from 'src/output/index'

const props = withDefaults(defineProps<{
  value: TYPES.OlResult|TYPES.Ol,
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
const placeholder = olName.slice(0,1)
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
    return props.value.os == 2 || ov.value == 0 || props.value._hs == 1 || props.value._ms == 1
  } else {
    return true
  }
})
function onClick(){
  if(isLock.value){
    return
  }
  common.betClick(props.value)
}

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
.ol-v-hide{
  visibility: hidden;
}
.ol-v-show{
  visibility: visible;
}

.component.odd-ol-item{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  box-shadow: 0 0 1px 1px #F5F5F5;
  flex-grow: 1;
  flex-basis: 25%;

  --private-ol-content-color: #FF7000;
  &.r-win,&.r-win-half{
    background-color: #FFC8C8; //#TODO: css var
    .ol-result{
      --private-ol-content-color: #FF4646; //#TODO: css var
    }
  }
  &.active {
    background-color: #FF70001A;
  }
  &.none {}

  &.up,
  &.down {

  }

  &.up {
    --private-ol-content-color: #FF4646;
  }

  &.down {
    --private-ol-content-color: #17A414;
  }
}

.icontainer {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  &.ol-result{
    --private-ol-content-color: #8A8986; //#TODO: css var
  }
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
  position: relative;
  display: flex;
  align-items: center;
  vertical-align: middle;
}
.ol-content-ov{
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
.odd-image {
  display: flex;
  --private-local-odd-image-size: 14px;
  width: var(--private-local-odd-image-size);
  height: var(--private-local-odd-image-size);
  position: absolute;
  object-fit: contain;
  left: 100%;
}

.ol-lock {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ol-lock-img {
  width: 16px;
  // height: 1rem;
  line-height: 100%;
}
.component{
  &.fill{
    .icontainer{
      padding: 0 20px;
    }
    .ol-name{
      text-align: left;
      justify-content: start;
      @extend .overflow;
      .ol-name-span{
        @extend .overflow;
      }
    }
    .ol-content{
      flex: none;
      justify-content: end;
    }
  }
  &.column{
    padding: 10px 0;
    .icontainer{
      width: 100%;
      flex-direction: column;
      justify-content: center;
    }
    .separate{
      display: none;
    }
    .item{
      margin: 2px 5px;
      justify-content: center;
    }
    .ol-name{
      @extend .overflow;
      width: 100%;
      text-align: center;
      .ol-name-span{
        @extend .overflow;
      }
    }
  }
  &.auto{
    padding: 10px 0;
    .icontainer{
      margin-top: 10px;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
    }
    .separate{
      display: none;
    }
    .item,.ol-lock-img{
      margin: 2px 5px;
    }
    .item{
      flex: 1;
      justify-content: center;
    }
    .ol-name{
      flex-basis: 50%;
    }
    .ol-content{
      flex-basis: 30%;
    }
  }
}
</style>