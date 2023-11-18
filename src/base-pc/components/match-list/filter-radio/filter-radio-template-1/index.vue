<template>
  <div class="radio-wrap">
    <div v-for="(item, index) in check_list" class="check-radio" :key="index" @click="check_change(item.value)">
      <div class="check-wrap relative-position" :class="item.value==check_value && 'active'" :style="checkbox_style">
      </div>
      <span class="mr-20">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"

const props = defineProps({
  check_list: {
    type: Array,
    default: () => [],
  },
  //初始化选中
  default_value: {
    type: String,
    default: () => "",
  },
  //赛果单选框样式
  checkbox_style: {
    type: Object,
    default: () => {},
  },
})

// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const check_value = ref('');
check_value.value = props.default_value || '';
// console.error(check_list);
function check_change (value) {
  check_value.value = value
  useMittEmit(MITT_TYPES.EMIT_CHANGE_CHECK, check_value.value)
}


</script>

<style lang="scss" scoped>
/** 选择框样式 -S*/
.radio-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .check-radio {
    display: flex;
    margin-bottom: 5px;
    justify-content: flex-start;
    align-items: center;
    .mr-20 {
      margin-right: 20px;
    }
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
          border-top: 2px solid var(--q-gb-bd-c-3);
          border-right: 2px solid var(--q-gb-bd-c-3);
          transform: rotate(135deg);
        }
      }
    }
  }
}
/** 选择框样式 -E*/
</style>