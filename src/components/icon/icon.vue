<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:54
 * @Description: 可变色和大小的 icon
 *
 * 【示例】
 * 单色（显示不出来需找 UI 处理）
 * <icon name="icon-uniE900" color="#ff0000" size="16px" />
 * 多色（不能设置颜色）
 * <icon name="img:xxx/xx.svg" size="14px"/>
-->
<template>
  <q-icon :class="['c-icon',color && 'set-color']" :name="name" :style="styles" @click="on_click" />
</template>

<script>
export default {
  name: "Icon",

  props: {
    name: String,
    color: String,
    size: String
  },

  computed: {
    styles() {
      let styles = {};
      let { color, size } = this;

      color && (styles.color = color);
      size && (styles.fontSize = size);

      return styles;
    }
  },

  methods: {
    on_click() {
      this.$emit("click");
    }
  }
};
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
