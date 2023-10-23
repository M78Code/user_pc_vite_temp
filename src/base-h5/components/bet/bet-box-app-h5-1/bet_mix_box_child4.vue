<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
    <div class="nonebox4-result">
        <div class="nonebox4-content-result nonebox4-content-top0">
            <div class="nonebox4-content-result-left">投注金额</div>
            <div class="nonebox4-content-result-right">600,256.00</div>
        </div>
        <div class="nonebox4-content-result">
            <div class="nonebox4-content-result-left">可盈金额</div>
            <div class="nonebox4-content-result-right">600,256.00</div>
        </div>
        <div class="nonebox4-content-result">
            <div class="nonebox4-content-result-left">注单号</div>
            <div class="nonebox4-content-result-left">LX1234567891</div>
        </div>
    </div>
  </div>
</template>
<script setup></script>

<style lang="scss" scoped>
.nonebox4-result{
    width: 100%;
    margin-top: 10px;
}
.nonebox4-content-top0{
    margin-top: 0 !important;
}
.nonebox4-content-result{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.nonebox4-content-result-left{
    font-size: 12px;
    color: var(--q-gb-t-c-3);
}
.nonebox4-content-result-right{
    font-size: 14px;
}
.nonebox4-sub{
    padding: 8px 0;
    width: 96%;
    margin-left: 2%;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
    background-color: #2394fc;
    border-radius: 6px;
}

</style>
