<!--
  投注之后的按钮
-->
<script setup>
import { defineEmits } from "vue"
import { i18n_t } from "src/core"
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { format_money2 } from "src/core/format/index.js"

const statusObj = {
  1: '投注状态',
  2: '注单确认中',
  3: '注单已确认',
  4: '注单失败',
  5: '注单失败',
}

const emits = defineEmits(["bindClick"]);

console.log(BetViewDataClass,"BetViewDataClass")
console.log(BetData,"BetData")

const bindClick = () =>{
  emits('bindClick')
}
</script>

<template>
  <nav class="betted-button" @click="bindClick">
    <p v-if="!!BetData.is_bet_single">{{ i18n_t('app_h5.bet.confirm')}}</p>
    <p v-else>
      {{ statusObj[BetViewDataClass.bet_order_status] }}
      <span>合计 {{ format_money2(BetData.bet_amount) }}</span>
    </p>
  </nav>
  <p class="betted-tips" v-if="!BetData.is_bet_single" @click="">保留选项，继续投注</p>
</template>


<style scoped lang="scss">
.betted-button{
  padding: 0.08rem 0;
  margin-top: 0.08rem;
  width: 100%;
  background-color: var(--q-gb-t-c-1);
  border-radius: 12px;
  margin-bottom: .2rem ;
  >p{
    font-size: 16px;
    color: #fff;
    text-align: center;
    font-weight: 600;
    >span{
      color: rgba(255,255,255,.9);
      font-size: 16px;
      font-weight: normal;
      font-family: Akrobat;
      vertical-align: bottom;
    }
  }
}
.betted-tips{
  color: #179CFF;
  font:{
    size: 16px;
    weight: 500;
  }
  text-align: center;
}
</style>