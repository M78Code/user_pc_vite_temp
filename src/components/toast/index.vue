<template>
  <div class="text-toast" v-if="bool">{{ text }}</div>
</template>
<script setup>
import { GlobalSwitchClass } from "src/output/index.js";
import {watch,ref} from 'vue'
const bool = ref(GlobalSwitchClass.tip_show_state.isShow)
const text = ref(GlobalSwitchClass.tip_show_state.text)
watch(
  () => GlobalSwitchClass.global_switch_version,
  () => {
    bool.value = GlobalSwitchClass.tip_show_state.isShow
    text.value = GlobalSwitchClass.tip_show_state.text
  },
  { deep: true }
);
</script>
<style scoped lang="scss">
.text-toast {
  position:absolute;
  z-index: 10000;
  top: 50%;
  left: 52%;
  transform: translateX(-50%);
  background-color: #949494;
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 20px;
  color: #ffffff;
  padding:0 20px;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;

}
</style>