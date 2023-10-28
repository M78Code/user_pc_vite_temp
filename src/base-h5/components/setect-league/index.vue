<!--
 * @Description:设置弹出框内 滑动组件
-->
<template>
  <div class="select-league" :style="bounced_high">
    <div class="sl-header">
      <div class="sl-btn" @click="closedHandle">取消</div>
      <div class="sl-title">选择联赛</div>
      <div class="sl-btn" @click="finishHandle">完成</div>
    </div>
    <div class="sl-search">
      <div class="sl-input-content">
        <div class="sl-icon">
          <div class="search-icon"></div>
        </div>
        <input class="sl-input" placeholder="请输入联赛名">
      </div>
    </div>
  </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: 'selectLeague' // 设置组件名称
})

const router = useRouter();
let rem_1 = window.innerWidth * 100 / 375;
const bounced_high = { height: window.innerHeight - rem_1 + 50 + 'px !important' }

const emit = defineEmits(["closedHandle", "finishHandle"]);

const closedHandle = () => {
  emit("closedHandle");
}

const finishHandle = () => {
  emit("finishHandle");
}

defineProps({
})

</script>
<style scoped lang="scss">
// 组件样式
.select-league {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;
  background: var(--q-gb-bg-c-15) !important;
  backdrop-filter: blur(5px);
  .sl-header {
    display: flex;
    justify-content: space-between;
    padding: .18rem .2rem;
    align-items: baseline;
    .sl-title {
      font-size: .18rem;
    }
    .sl-btn {
      font-size: .16rem;
      color: var(--q-gb-t-c-1);
    }
  }
  .sl-search {
    display: flex;
    padding: 0 .14rem;
    .sl-input-content {
      height: .4rem;
      width: 100%;
      background: var(--q-gb-t-c-6);
      border-radius: .4rem;
      padding-left: .42rem;
      padding-right: .2rem;
      display: flex;
      align-items: center;
      position: relative;
      .sl-icon {
        position: absolute;
        left: .16rem;
        .search-icon {
          width: .18rem;
          height: .18rem;
          background: var(--q-gb-t-c-1);
        }
      }
      .sl-input {
        background: var(--q-gb-t-c-6);
        outline:none;
        border: none;
        width: 100%;
        font-size: .14rem;
      }
    }
  }
}
</style>