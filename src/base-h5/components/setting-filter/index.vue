<!--
 * @Description:设置弹出框内 滑动组件
    style中已经计算出最大高度，直接内容撑开即可
-->
<template>
    <div class="setting-filter">
        设置页面
        <div class="closed-btn" @click="closedHandle">
            <span>关闭</span>
        </div>
    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter,useRoute } from "vue-router";

defineOptions({
    name: 'settingFilter' // 设置组件名称
})

const router = useRouter();

defineProps({
 
})

const emit = defineEmits(["closedHandle"]);

const closedHandle = () => {
  emit("closedHandle");
}

</script>
<style scoped lang="scss">
// 组件样式
.setting-filter {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
//   border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bd-c-1);
  backdrop-filter: blur(5px);

  .closed-btn {
    display: flex;
    padding: .13rem;
    align-items: center;
    justify-content: center;
    border-top: .08rem solid var(--q-gb-t-c-8);
    span {
        font-size: .18rem;
    }
  }
}
</style>