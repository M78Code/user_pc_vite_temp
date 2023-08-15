<!--
 * @Description: 刷新动画
-->
<template>
  <div class="c-refresh fit yb-flex-center cursor-pointer" @click="on_click">
    <div :class="['icon-wrap', { 'loading-static-animation': cur_active }]">
      <icon v-if="!other_icon" :name="icon_name" size="13px" />
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

<script setup>
import { ref, onUnmounted } from "vue"
const props = defineProps({
  // 是否加载完成
  loaded: true,
  // 是否可用
  disable: {
    type: Boolean,
    default: false
  },
  icon_name: {
    type: String,
    default: "icon-refresh"
  },
  other_icon: {
    type: Boolean,
    default: false
  }
})


const cur_active = ref(false)
const time_out = ref(false)
//定时器
const timer = ref(null)



const on_click = e => {
  this.$emit("click", e);
  if (!props.disable) {
    cur_active.value = true;

    // 当请求时间少于1m 时 1m 后停止
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    };
    timer.value = setTimeout(() => {
      if (loaded.value) {
        cur_active.value = false;
      } else {
        time_out.value = true;
      }
    }, 300);
  }
}

onUnmounted(() => {
  /**清除定时器 */
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
})

    // loaded: {
    //   handler(loaded) {
    //     if (loaded && this.time_out) {
    //       this.cur_active = false;
    //       this.time_out = false;
    //     }
    //   },
    //   immediate: true
    // }
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
  animation: 10s loading-ring-animate infinite cubic-bezier(0.38, 0.39, 0.71, 0.71);
}
</style>
