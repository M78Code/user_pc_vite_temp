

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}-{{bet_total(BetViewDataClass.bet_view_version)}}</div>
  <!-- 最高可赢 -->
  <div class="highest_win row items-center justify-between">
    <div class="left_text">
      <p>{{i18n_t('bet.total_win2')}}</p>
      <p class="money">{{ ref_data.win_money }}</p>
    </div>
    <div class="right_text">
      <p>{{i18n_t('bet.bet_val')}}</p>
      <p class="multiple">{{ ref_data.total_money }}</p>
    </div>
  </div>
  <!-- 展开串关类型 -->
  <div class="open-crosstalk" v-if="BetViewDataClass.bet_order_status == 1" :class="{ 'active': BetData.special_type }" @click="set_special_type()" >
    <span style="white-space: nowrap">{{ i18n_t('bet.expand_the_string_type') }}</span>
    <img class='icon' :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/odds_down.png`" alt=""/>
  </div>
</template>

<script setup> 
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import {  LOCAL_PROJECT_FILE_PREFIX,useMittEmit,MITT_TYPES,format_money2 } from 'src/output/index.js'
import mathJs from 'src/core/bet/common/mathjs.js'
import { reactive,computed } from "vue";

const props = defineProps({
  is_type: {
    type: Boolean,
    default: false
  },
})

const ref_data = reactive({
  total_money: '',
  win_money:''
})

const set_special_type = () => {
  BetData.set_special_type(!BetData.special_type)
  nextTick(() => {
    useMittEmit(MITT_TYPES.EMIT_SET_NOTSINGLE_SHOW_LIST)
  });
}

// status 是响应式的 可以用于重新计算
const bet_total = computed(()=> status => {
  // 获取串关投注的数据
  let bet_total_money = BetViewDataClass.bet_special_series.reduce((pre, cur) => {
    return pre*1 + (cur.bet_amount * cur.count || 0)*1;
  }, 0)

  let bet_total_odds = BetViewDataClass.bet_special_series.reduce((pre, cur) => {
    return pre*1 + (cur.seriesOdds || 0)*1;
  }, 0)
  
  // 计算出合计金额
  ref_data.total_money = format_money2(bet_total_money)

  let money = mathJs.subtract(mathJs.multiply(bet_total_odds,bet_total_money) ,bet_total_money)
  ref_data.win_money = format_money2(money)
})

</script>




<style scoped lang="scss">
  /* ************** 最高可赢 ************** -S */
  .highest_win{
    width: 100%;
    height: 0.62rem;
    padding: 0 0.12rem;
    font-size: 0.14rem;
    color: var(--q-gb-t-c-4);
    font-weight: 400;
    .left_text{
      text-align: left;
      .money{
        font-weight: 500;
        color: var(--q-gb-t-c-1);
        font-size: 0.18rem;
      }
    }
    .right_text{
      text-align: right;
      .multiple{
        font-weight: 500;
        font-size: 0.18rem;
      }
    }
  }
  /* ************** 展开串关类型 ************** -S */
  .open-crosstalk{
    display: flex;
    width: 100%;
    padding: 0.11rem 0.13rem 0.12rem 2.72rem;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #E2E2E2;
    background: #FFF;
    color: var(--q-gb-t-c-3);
    font-size: 0.12rem;
    &.active{
      .icon{
        transform: rotate(180deg);
      }
    }
    .icon{
      margin-left: 0.08rem;
      position: relative;
      transition: .3s;
    }
  }
  
</style>