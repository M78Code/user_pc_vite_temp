<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <span class="tips" @click="alertTips=true;">
      {{ i18n_t('app_h5.cathectic.cash_rules') }}
      <icon-wapper name="icon-tips" size="0.14rem" />
    </span>
    <!-- 提前兑现规则申明弹框 -->
    <q-dialog v-model="alertTips">
      <div class="tips-main">
        <h2>{{ i18n_t('app_h5.cathectic.cash_rules') }}</h2>
        <p>{{ i18n_t('app_h5.cathectic.explain1') }}</p>
        <!-- <p>{{ i18n_t('app_h5.cathectic.explain2') }}</p> -->
        <span @click="alertTips=false;">{{ i18n_t("ac_rules.understand")}}</span>
      </div>
    </q-dialog>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { IconWapper } from 'src/components/icon'
import { i18n_t } from "src/output/index.js";
import { ref } from 'vue'

// 提前兑现规则申明弹框
let alertTips = ref(false)
</script>

<style lang="scss" scoped>
.tips {
    display: flex;
    justify-content: right;
    align-items: center;
    margin-bottom: 0.08rem;
    color: var(--q-gb-t-c-19);
    font-size: 12px;
    line-height: 2;
    i {
      margin: 0 0.14rem 0 0.04rem;
    }
  }
.tips-main {
  background-color: var(--q-gb-bg-c-23);
  border-radius: 0.1rem;
  width: 90%;
  padding: 0 0.14rem;
  box-shadow: 1px 1px 3px var(--q-gb-bg-c-6);
  h2 {
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 4;
    color: var(--q-gb-t-c-18);
  }
  p {
    font-size: 0.16rem;
    line-height: 1.5;
    margin-bottom: 0.2rem;
    text-align: justify;
    color: var(--q-gb-t-c-24);
  }
  span {
    font-size: 0.20rem;
    color: var(--q-gb-t-c-1);
    line-height: 2.5;
    border-top: 1px solid var(--q-gb-bd-c-20);
    display: block;
    text-align: center;
  }
}
</style>