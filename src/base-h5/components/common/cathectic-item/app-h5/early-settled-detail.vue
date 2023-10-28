<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <early-settle-tips />
  <div class="warp">
    <div>{{ BetRecordClass.bet_record_version }}</div>
    <!-- 滑块 -->
    <q-slide-transition>
      <div v-show="detail_show" class="slider-wrap">
        <p>全部提前兑现成功</p>
        <div class="body-main">
          <p><label>提前兑现本金：</label> <span>300.00元</span></p>
          <p><label>输/赢：</label> <span>-290.00元</span></p>
          <p><label>提前兑现返还：</label> <span>300.00元</span></p>
        </div>
      </div>
    </q-slide-transition>
    <div class="settle-btn" :class="detail_show ? 'up' : 'down'" @click="detail_show=!detail_show">
      <span>提前兑现详情</span>
      <img src="/public/app-h5/image/gif/change.gif">
    </div>
  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/bet-record.js";
import earlySettleTips from "src/base-h5/components/common/cathectic-item/app-h5/early-settle-tips.vue";
import { ref } from 'vue'
const props = defineProps({
  item_data: {
    type: Object
  }
})
// 提前兑现详情
let detail_show = ref(false)
</script>

<style lang="scss" scoped>
.warp {
  margin: 0 0.14rem;
  border-top: 1px solid #ebebeb;
}
.slider-wrap {
  font-size: 0.14rem;
  border-bottom: 1px solid #ebebeb;
  & > p {
    line-height: 3;
  }
}
.body-main {
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      label {
        color: var(--q-gb-bg-c-6);
      }
    }
  }
  .settle-btn {
    font-size: 0.14rem;
    padding-top: 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      margin-right: 0.1rem;
    }
    img {
      width: 0.2rem;
    }
    &.down span {
      padding-top: 0.04rem;
    }
    &.down img {
        transform: rotate(-90deg);
      }
    &.up img {
      transform: rotate(90deg);
    }
  }
</style>
