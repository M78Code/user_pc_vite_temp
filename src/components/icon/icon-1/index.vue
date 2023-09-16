<!--
 * @Description: 可变色和大小的 icon
 *
 * 【示例】
 * 单色（显示不出来需找 UI 处理）
 * <icon name="icon-uniE900" color="#ff0000" size="16px" />
 * 多色（不能设置颜色）
 * <icon name="img:xxx/xx.svg" size="14px"/>
-->
<template>
  <q-icon
    :class="['c-icon', color && 'set-color']"
    :name="name"
    :style="styles"
    @click="emit('click')"
  />
</template>
<script setup>
import { defineComponent, computed } from "vue";
//-------------------- 对接参数 prop 注册  开始  --------------------
import { need_register_props } from "../config/index.js";
const props = defineProps(need_register_props);
//-------------------- 对接参数 prop 注册  结束  --------------------
console.error('icon props', props);
const emit = defineEmits(['click'])

const styles = computed(() => {
  const { color = '', size = '' } = props;
  return {
    color,
    size
  };
})

</script>

<script>
export default defineComponent({
  name: "Icon",
})
</script>

<style lang="scss" scoped>
.c-icon {
  &:before {
    font-size: inherit;
  }

  &.set-color {
    &:before {
      color: inherit;
    }
  }
}
</style>