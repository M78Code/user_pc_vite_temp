<template>
  <div class="check-wrap relative-position" 
  :class="{'active':checked}" 
  :style="results_checkbox_style">
  </div>
</template>

<script setup>

import { watch, watchEffect } from 'vue';
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
const props = defineProps({
  checked: {
    type: Boolean,
    default: () => false,
  },
  results_checkbox_style: {
    type: Object,
    default: () => {},
  }
})

// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));



</script>

<style lang="scss" scoped>
/** 选择框样式 -S*/
.check-wrap {
  width: 14px;
  min-width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 10px;
  position: relative;
  &.active {
    border: none;
    &::before {
      position: absolute;
      content: "";
      left: 4px;
      width: 6px;
      height: 4px;
      top: 4px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      transform: rotate(135deg);
    }
  }
}
/** 选择框样式 -E*/
</style>