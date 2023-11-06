<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      <div class="bet-info">
        <div class="bet-info-view">
          <div>Higgest Win</div>
          <div>Total Stske</div>
        </div>
        <div class="bet-info-view">
          <div class="bet-info-left">72.40</div>
          <div class="bet-info-right">10.00</div>
        </div>
      </div>
    </div>
  </template>
<script setup>
</script>
  
<style lang="scss" scoped>
  .bet-info{
    padding: 0.1rem 0.15rem;
    background: var(--q-gb-t-c-14);
    font-size: 0.13rem;
  }
  .bet-info-view{
    display: flex;
    justify-content: space-between;
  }
  .bet-info-left{
    font-size: 0.16rem;
    color: var(--q-gb-bg-c-12);
    font-weight: bold;
    margin-top: 0.05rem;
  }
  .bet-info-right{
    font-size: 0.16rem;
    font-weight: bold;
    margin-top: 0.05rem;
  }
</style>
  