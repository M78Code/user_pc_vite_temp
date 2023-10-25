<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
    <span class="tips" @click="alertTips=true;">提前兑现规则申明</span>
    <!-- 提前兑现规则申明弹框 -->
    <q-dialog v-model="alertTips">
      <div class="tips-main">
        <h2>提前兑现规则申明</h2>
        <p>开云体育提前兑现只适用于指定赛事和盘口，如遇到赛事或盘口取消，提前兑现注单将会被收回重新结算。开云体育保留赛果最终解释权。</p>
        <p>具体兑现规则请查看【帮助中心】-【开云体育提前兑现规则】</p>
        <span @click="alertTips=false;">我知道了</span>
      </div>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
// 提前兑现规则申明弹框
let alertTips = ref(false)
</script>

<style lang="scss" scoped>
.tips {
    display: block;
    text-align: right;
    padding-right: 0.14rem;
    margin-bottom: 0.08rem;
    color: var(--q-gb-bg-c-6);
    font-size: 0.12rem;
    line-height: 2;
  }
.tips-main {
  background-color: #fff;
  border-radius: 0.1rem;
  width: 90%;
  padding: 0 0.14rem;
  h2 {
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 4;
  }
  p {
    font-size: 0.16rem;
    line-height: 1.5;
    margin-bottom: 0.2rem;
    text-align: justify;
  }
  span {
    font-size: 0.20rem;
    color: var(--q-info);
    line-height: 2.5;
    border-top: 1px solid #e5e5e5;
    display: block;
    text-align: center;
  }
}
</style>
