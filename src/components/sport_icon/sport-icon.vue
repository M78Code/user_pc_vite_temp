<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 球种对应的 icon
-->
<template>
  <span v-if="sport_id != -1" class="q-icon icon c-icon sport-img"
  :style="[compute_css_obj({key: key_name, position: `item_${sport_id}`,size}),`width:${size}px;height:${size}px`]"
  :class="{'sport-img-new': isVideoIcon}" >
  </span>
</template>

<script>
import {compute_css_obj} from "src/output/index.js"

export default {
  name: "SportIcon",
  data() {
    return {
      compute_css_obj 
    };
  },
  props: {
    key_name: {
      type: String,
      default: '',
    },
    // 球种 ID
    sport_id: [Number, String],
    // 选中状态
    status: {
      type:[Number, String],
      default: 2,
    },
    // 图标大小
    size: {
      type: String,
      default: "20",
    },
    // 图标色调
    color: {
      type: String,
      default: "",
    },
    // 是否电竞
    is_esports:{
      type: Boolean,
      default: false,
    },

    is_union_match:{
      type: Boolean,
      default: false,
    },

    isVideoIcon:{
      type: Boolean,
      default: false,
    }
  },
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
.sport-img {
  background-size: 100% auto;
}
</style>