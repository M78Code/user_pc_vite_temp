<template>
  <div class="component odds-item odds-wrap" v-if="!(data.hl.every(item => item.hs == 2))" :style="{ 'order': order }">
    <q-separator color="orange" />
    <div class="odds-hpn" @click="toggleUnfold">
      <span class="odds-hpn-text">{{ data.hpn }}</span>
      <!-- <template v-if="wsl">
        hpt{{ data.hpt }}
      </template> -->
      <!-- 置顶按钮 -->
      <OddsSetTop :value="data"></OddsSetTop>
      <span class="odds-hpn-icon" :class="unfold ?'down':'up'" @click.stop="toggleUnfold"></span>
    </div>
    <QSlideTransition :duration="200">
      <div v-show="unfold">
        <OddTemplateDynamicComponent :data="data"></OddTemplateDynamicComponent>
      </div>
    </QSlideTransition>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import AllCloseControl from "./AllCloseControl";
import OddsSetTop from './OddsSetTop.vue';
import { QSlideTransition } from 'quasar'

import OddTemplateDynamicComponent from "./template/OddTemplateDynamicComponent.vue";

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

watch(()=> AllCloseControl.unfold,(val)=>state.unfold = val,{
  immediate:true,
})

// const unfold = computed(()=> state.unfold || props.unfold)
const unfold = computed(()=> state.unfold)
function toggleUnfold(){
  state.unfold = !state.unfold
}

const order = computed(() => {
  // order 最小值-2147483648, hton目前长度13, 故substring(4)
  return -Number(props.data.hton.substring(4))
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