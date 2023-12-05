<template>
  <div class="component odds-item odds-wrap" v-if="!(data.hl.every(item => item.hs == 2))" :style="{ 'order': order }">
    <q-separator color="orange" />
    <div class="odds-hpn" @click="toggleUnfold">
      <span class="odds-hpn-text">{{ data.hpn }}</span>
      <!-- 置顶按钮 -->
      <OddsSetTop :value="data"></OddsSetTop>
      <span class="odds-hpn-icon" :class="unfold ? 'up' : 'down'"></span>
    </div>
    <div v-show="unfold">
      <!-- <OddTemplateDynamicComponent></OddTemplateDynamicComponent> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import OddsSetTop from './OddsSetTop.vue'
// import OddTemplateDynamicComponent from "./template/OddTemplateDynamicComponent.vue";

type Props = {
  data: TYPES.OddInfo
  unfold?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  unfold: false
})
const emit = defineEmits<{
  (e:'update:unfold',param:boolean):void;
}>()


function toggleUnfold(){

}

const order = computed(() => {
  // order 最小值-2147483648, hton目前长度13, 故substring(4)
  return -Number(props.data.hton.substring(4))
})

</script>

<style scoped lang="scss">
.odds-hpn{
  display: flex;
  align-items: center;
  padding: 15px 20px;
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
  background: url($SCSSPROJECTPATH+ "/image/detail/down.png") no-repeat center;
  transition: transform .5s cubic-bezier(0, 0.2, 0, 1);
  &.up {
    transform: scaleY(-1);
  }
}
</style>