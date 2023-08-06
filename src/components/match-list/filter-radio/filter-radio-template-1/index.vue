<template>
  <div class="radio-wrap">
    <div v-for="(item, index) in check_list" class="check-radio" :key="index" @click="check_change(item.value)">
      <div class="check-wrap relative-position" :class="item.value==value && 'active'" :style="checkbox_style">
      </div>
      <span class="mr-20">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>

import { ref, defineProps } from 'vue';
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)

const props = defineProps({ ...useProps })
const check_value = ref('');

check_value.value = props.default_value || '';

const check_change = (value) => {
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
          border-top: 2px solid #ffffff;
          border-right: 2px solid #ffffff;
          transform: rotate(135deg);
        }
      }
    }
  }
}
/** 选择框样式 -E*/
</style>