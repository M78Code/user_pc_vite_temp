<!--
 * @Description:设置弹出框内 滑动组件
-->
<template>
    <div class="setting-filter" :style="bounced_high">设置页面</div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter,useRoute } from "vue-router";

defineOptions({
    name: 'settingFilter' // 设置组件名称
})

const router = useRouter();
let rem_1 = window.innerWidth * 100 / 375;
const bounced_high = { height: window.innerHeight - rem_1 + 50 + 'px !important' }

defineProps({
 
})
</script>
<style scoped lang="scss">
// 组件样式
.setting-filter {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bg-c-15) !important;
  backdrop-filter: blur(5px);
}
</style>