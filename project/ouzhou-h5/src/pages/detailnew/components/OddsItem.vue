<template>
  <div class="component odds-item odds-wrap" v-if="!(data.hl && data.hl.every(item => item.hs == 2))" :style="{ 'order': order }">
    <q-separator color="orange" />
    <div class="odds-hpn" @click="toggleUnfold">
      <span class="odds-hpn-text">{{ data.hotName ? data.hotName : data.hpn }}</span>
      <!-- <template v-if="wsl">
        hpt{{ data.hpt }}
      </template> -->
      <!-- 置顶按钮 -->
      <OddsSetTop :value="data"></OddsSetTop>
      <span class="odds-hpn-icon" :class="unfold ?'down':'up'" @click.stop="toggleUnfold"></span>
    </div>
    <QSlideTransition :duration="200">
      <div v-show="unfold">
        <template v-if="[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,18,51].includes(+data.hpt)">
          <OddTemplateDynamicComponent :data="data"></OddTemplateDynamicComponent>
        </template>
        <!-- 虚拟体育赛马类-热门玩法模板 -->
        <template v-else-if="data.hotName">
          <Tem8 :item_data="data" />
        </template>
      </div>
    </QSlideTransition>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import AllCloseControl, { UnfoldCache } from "./AllCloseControl";
import OddsSetTop from './OddsSetTop.vue';
import { QSlideTransition } from 'quasar'

import OddTemplateDynamicComponent from "./template/OddTemplateDynamicComponent.vue";
import Tem8 from "./template/tem8.vue";

type Props = {
  data: TYPES.OddInfo
}
const props = withDefaults(defineProps<Props>(), {
})
const emit = defineEmits<{
}>()

const state = reactive({
  unfold: true
})

watch(()=> AllCloseControl.unfold,changeUnfold)

;(function init(){
  state.unfold = AllCloseControl.unfold
  if(UnfoldCache[props.data.topKey]!= (void 0)){
    state.unfold = UnfoldCache[props.data.topKey]
  }
})()

// const unfold = computed(()=> state.unfold || props.unfold)
const unfold = computed(()=> state.unfold)
function toggleUnfold(){
  return changeUnfold(!state.unfold)
}
function changeUnfold(unfold:boolean){
  UnfoldCache[props.data.topKey] = state.unfold = unfold
}

const order = computed(() => {
  // order 最小值-2147483648, hton目前长度13, 故substring(4)
  return -Number(props.data?.hton?.substring(4))
  // return props.data.hpt
})


// const wsl = sessionStorage.getItem('TY_SDK_WSL')
</script>

<style scoped lang="scss">
.odds-hpn{
  display: flex;
  align-items: center;
  padding: 15px 13px 15px 20px;
  background-color: #fff;
  .odds-hpn-text {
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    font-size: 16px;
    font-weight: 700;
  }
}
.odds-hpn-icon {
  width: 14px;
  height: 14px;
  margin-left: 14px;
  background: url($SCSSPROJECTPATH+ "/image/detail/down.png") no-repeat center;
  transition: transform .5s cubic-bezier(0, 0.2, 0, 1);
  &.up {
    transform: scaleY(-1);
  }
}
</style>