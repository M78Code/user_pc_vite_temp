<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-all-detele">
    <div class="del-info">
      <div class="del-info-icon">删</div>
      <div class="del-info-name">{{i18n_t('bet.bet')}}</div>
        <div class="del-info-name">{{i18n_t('bet.total_win2')}} 0.00</div>
    </div>
    <div class="del-info">
      <div class="del-info-type">{{ i18n_t('app_h5.bet.limit')}}</div>
      <div class="del-info-dui">10-9999</div>
    </div>
  </div>
</template>
<script setup>

</script>

<style lang="scss" scoped>
    .del-info-dui{
      color: var(--q-gb-t-c-2);
      width: 0.15rem;
      height: 0.15rem;
      background: var(--q-gb-t-c-18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.1rem;
      border-radius: 50%;
      margin-left: 0.12rem;
    }
    .del-info-name{
      margin-left: 0.15rem;
      color: var(--q-gb-t-c-18);
    }
    .del-info-icon{
      color: var(--q-gb-t-c-18);
    }
    .del-info{
      display: flex;
      font-size: 0.13rem;
    }
    .bet-all-detele{
      display: flex;
      justify-content: space-between;
      padding: 0.15rem;
      background: var(--q-gb-t-c-6);
    }
</style>
