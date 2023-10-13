<!--
 * @Description: 联赛筛选选择框组件
-->
<template>
  <div class="check-wrap relative-position" 
  :class="{'active':checked}" 
  :style="results_checkbox_style">
  </div>
</template>

<script setup>

const props = defineProps({
  //是否选中
  checked: Boolean,
    //赛果单选框样式
    results_checkbox_style: {
      type: Object,
      default: () => {
        return {};
      },
    },
})

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
