<!--
* @Description: 合并单关 常用金额
-->
<template>
  <div class="bet-all-detele">
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
    
    <!-- 合并单关 -->
    <div class="del-info-select" @click.stop="set_is_bet_merge()">
      <img class="" v-if="BetData.is_bet_merge" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_a.svg`" alt="" />
      <img class="" v-else :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_b.svg`" alt="" />
      <span class="del-info-name">{{ i18n_t('bet.bet_merge') }}</span>
    </div>
    
    <!-- 常用金额 -->
    <div class="del-info-select" @click.stop="set_is_regular_amount()" v-if="BetData.bet_single_list.length == 1">
      <span class="del-info-name">{{ i18n_t('bet.used_money2') }}</span>
      <img class="" v-if="BetData.is_regular_amount" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_a.svg`" alt="" />
      <img class="" v-else :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_b.svg`" alt="" />
    </div>

  </div>
</template>
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

// 常用金额
const set_is_regular_amount = () => {
  BetData.set_is_regular_amount()
}

// 合并单关
const set_is_bet_merge = () => {
  BetData.set_is_bet_merge()
  // 如果是合并单关模式默认选中多项单注部分
  if (BetData.is_bet_merge){
    BetData.set_active_index(BetData.bet_single_list.length)
  }else {
    BetData.set_active_index(0)
  }
}

</script>

<style lang="scss" scoped>

.del-info-name {
  margin-left: 0.1rem;
  color: var(--q-gb-bg-c-4);
  // margin-top: -.03rem;
  font-size: .14rem;
}

.del-info-icon {
  color: var(--q-gb-bg-c-4);
  // width: 0.12rem;
  // height: 0.12rem;
}

.del-info {
  display: flex;
  font-size: 0.14rem;
  align-items: baseline;
}

.bet-type {
  font-weight: 500;
  font-size: .14rem;
  margin-top: -.03rem;
}

.bet-all-detele {
  display: flex;
  justify-content: space-between;
  padding: 0 0.15rem;
  background: var(--q-gb-bd-c-2);
  height: 0.4rem;
  align-items: center;
  border-top: 1px solid  var(--q-gb-bd-c-1);

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    right: 0;
    bottom: 0;
    z-index: 8;
  }
}

.icon-arrow-merge {
  background: var(--q-gb-bg-c-1);
  width: 20px;
  height: 20px;
  border-radius: 20px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  color: var(--q-gb-t-c-2);
  transition: 0.3s;
  transform: rotate(180deg);
  margin-left: 8px;

  &.arrow {
    transform: rotate(0deg);
  }
}
.icon-arrow:before {
  color: var(--q-gb-t-c-2) !important;
}

.f-a-c {
  display: flex;
  // align-items: center;
}

.del-info-select{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img{
    margin-left: .1rem;
  }
}
</style>