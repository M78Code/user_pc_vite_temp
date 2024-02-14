<!--
* @Description: 合并单关 常用金额
-->
<template>
  <div class="bet-all-detele">
    <div v-show="false">{{ BetData.bet_data_class_version }}-{{MenuData.menu_data_version}}</div>
    <!-- 合并单关 -->
    <div class="del-info-select" @click.stop="set_is_bet_merge()" v-if="!MenuData.is_esports() && !MenuData.is_vr()">
      <img class="" v-if="BetData.is_bet_merge" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_a.svg`" alt="" />
      <img class="" v-else :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_b.svg`" alt="" />
      <span class="del-info-name">{{ i18n_t('bet.bet_merge') }}</span>
      <img @click.stop="open_toast()" class="" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/rules3.svg`" alt="" />
    </div>
    <div class="del-info-select" v-else></div>
    
    <!-- 常用金额 -->
    <div class="del-info-select" @click.stop="set_is_regular_amount()" v-if="BetData.bet_single_list.length == 1">
      <span class="del-info-name">{{ i18n_t('bet.used_money2') }}</span>
      <img class="" v-if="BetData.is_regular_amount" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_a.svg`" alt="" />
      <img class="" v-else :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_b.svg`" alt="" />
    </div>
  </div>
  <!-- 合并投注toast 提示语 -->
  <div class="text-confirm" v-if="alert">
    <q-dialog v-model="alert" persistent>
      <div class="toast">
        <div class="prompt_boby">
          <div class="cue_head">{{i18n_t('tips.msg1')}}</div>
          <div class="prompt">{{i18n_t('tips.msg2')}}</div>
        </div>
        <div class="verify" @click="alert = false">{{i18n_t('ac_rules.understand')}}</div>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { LOCAL_PROJECT_FILE_PREFIX, MenuData } from "src/output/index.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { ref } from "vue"

const alert = ref(false)
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

const open_toast = () => {
  // useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `<div>${i18n_t('tips.msg1')}</div><div>${i18n_t('tips.msg2')}</div>`)
  alert.value = true;
}

</script>

<style lang="scss" scoped>
.text-confirm {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.2);
}
.toast{
  background: #ffffff;
  width: 320px;
  height: 228px;
  padding: 30px, auto, 16px, auto;

  .prompt_boby{
    width: 280px;
    height: 110px;
    margin: 30px auto;

    .cue_head{
      font-size: 16px;
      font-weight: 500;
      line-height: 16px;
      text-align: center;
      padding-bottom: 20px;
      color: #1A1A1A;
    }
    .prompt{
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: #8a8986;
      &:before{
        content: "\00a0\00a0\00a0\00a0\00a0";
      }
    }

  }
  .verify{
    width: 300px;
    height: 42px;
    background-color: #FF7000;
    justify-content: center;
    align-items: center;
    display: flex;
    margin: 0 auto;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
  }
}
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