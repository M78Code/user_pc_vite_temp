<template>
  <div class="component odds-item odds-wrap" v-if="!(data.hl.every(item => item.hs == 2))"
    :style="{'order': -Number(data.hton.substring(3))}"
  >
    <q-separator color="orange" />
    <div class="odds-hpn">
      <!-- 置顶按钮 -->
      <!-- v-if="!item_data.hotName" -->
      <span class="odds-hpn-text">{{ data.hpn }}</span>
      <OddsSetTop :value="data"></OddsSetTop>
      <span class="odds-hpn-icon" :class="unfold ? 'up' : 'down'"></span>
    </div>
    <div v-show="unfold">
      <!-- <OddTemplateDynamicComponent></OddTemplateDynamicComponent> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, markRaw, watch, nextTick, computed } from "vue";
import OddsSetTop from './OddsSetTop.vue'
// import OddTemplateDynamicComponent from "./template/OddTemplateDynamicComponent.vue";

type Props = {
  data: TYPES.OddInfo
  unfold?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  unfold: false
})
const emit = defineEmits({

})

</script>

<style scoped lang="scss">
</style>