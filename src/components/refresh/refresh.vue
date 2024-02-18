<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 刷新动画
-->
<template>
  <div class="c-refresh fit yb-flex-center cursor-pointer" @click="on_click">
    <div :class="['icon-wrap', { 'loading-static-animation': cur_active }]">
      <icon-wapper v-if="!other_icon" :name="icon_name" size="13px" />
      <template v-else>
        <span :class="[icon_name]">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { IconWapper } from "src/components/icon/index.js";
export default {
  name: "Refresh",
  components: {
    IconWapper,
  },
  props: {
    // 是否加载完成
    loaded: true,
    // 是否可用
    disable: {
      type: Boolean,
      default: false,
    },
    icon_name: {
      type: [ String, Number],
      default: "icon-refresh",
    },
    other_icon: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cur_active: false,
      time_out: false,
      timer: null, //定时器
    };
  },

  watch: {
    loaded: {
      handler(loaded) {
        if (loaded && this.time_out) {
          this.cur_active = false;
          this.time_out = false;
        }
      },
      immediate: true,
    },
  },

  methods: {
    on_click(e) {
      if (!this.disable) {
        this.cur_active = true;

        // 当请求时间少于1m 时 1m 后停止
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          if (this.loaded) {
            this.cur_active = false;
          } else {
            this.time_out = true;
          }
        }, 300);
      }
    },
  },
  beforeUnmount() {
    /**清除定时器 */
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.c-refresh {
  @keyframes loading-ring-animate {
    0% {
      transform: rotateZ(1deg);
    }
    100% {
      transform: rotateZ(7200deg);
    }
  }
}
.loading-static-animation {
  animation: 10s loading-ring-animate infinite
    cubic-bezier(0.38, 0.39, 0.71, 0.71);
}
</style>
