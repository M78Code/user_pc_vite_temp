<!--
 * @Description: 可变色和大小的 icon
 *
 * 【示例】
 * 单色（显示不出来需找 UI 处理）
 * <icon-wapper name="icon-uniE900" color="#ff0000" size="16px" />
 * 多色（不能设置颜色）
 * <icon-wapper name="img:xxx/xx.svg" size="14px"/>
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
// import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
// import { component_symbol, need_register_props } from "src/components/search/config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
  name: String,
  color: String,
  size: String
})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
const emit = defineEmits(['click'])

const styles = computed(() => {
  const { color = '', size = '' } = props;
  return {
    color,
    'font-size':size
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