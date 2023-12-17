<!--
  投注之后的按钮
-->
<script setup>
// import { defineEmits } from "vue"
import { i18n_t } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { format_money2 } from "src/output/index.js"

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
// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_is_finally(true)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_order_status(1)
    BetViewDataClass.set_bet_before_message({})
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}
</script>

<template>
  <div style="display:none">{{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
  
  <!-- <div class="tip component bet-btn-item">
    <div :class="{'bet-success':BetViewDataClass.error_code == 200, 'bet-loading':BetViewDataClass.error_code == '0000000', 'bet-error': ![200,'0000000'].includes(BetViewDataClass.error_code)}">
      <div class="displayflex">
        {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
        <img class="icon_loading" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/icon_loading.gif`" alt=""  v-if="BetViewDataClass.bet_order_status == 2"/>
      </div>
    </div>
    
  </div> -->
  <nav class="betted-button" @click="bindClick">
    <p v-if="BetData.is_bet_single">{{ i18n_t('app_h5.bet.confirm')}}</p>
    <p v-else>
      {{ statusObj[BetViewDataClass.bet_order_status] }}
      <span>合计 {{ format_money2(BetData.bet_amount) }}</span>
    </p>
  </nav>
  <p class="betted-tips" v-if="!BetData.is_bet_single" @click="set_retain_selection">保留选项，继续投注</p>
</template>


<style scoped lang="scss">

.tip{
  color: var(--q-gb-t-c-4);
  text-align: center;
  font-size: 0.14rem;
  width: 100%;
  height: .36rem;
  line-height: 0.36rem;
  .bet-loading {
    color: var(--q-gb-t-c-1);
    display: flex;
    justify-content: center;
  }
  .bet-error {
    color: #FF0000;
    display: flex;
    justify-content: center;
  }

  .bet-success {
    color: var(--q-gb-t-c-2);
    display: flex;
    justify-content: center;
  }
}
.betted-button{
  padding: 0.11rem 0;
  margin-top: 0.08rem;
  width: 100%;
  background-color: var(--q-gb-t-c-1);
  border-radius: 0.12rem;
  margin-bottom: .2rem ;
  height: 0.48rem;
  
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