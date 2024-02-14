<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="tip component bet-btn-item" v-if="BetViewDataClass.error_message">
    <div :class="{'bet-success':BetViewDataClass.error_code == 200, 'bet-loading':BetViewDataClass.error_code == '0000000', 'bet-error': ![200,'0000000'].includes(BetViewDataClass.error_code)}">
      <div class="displayflex">
        <img class="icon_success" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/success.svg`" alt=""  v-if="BetViewDataClass.bet_order_status == 7"/>
        {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
        <img class="icon_loading" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/icon_loading.gif`" alt=""  v-if="BetViewDataClass.bet_order_status == 2"/>
      </div>
    </div>
  </div> 
  
  <div v-else class="box-line"></div>

  <div class="bet_content_bottom">
    <p class="bet_cancel"  @click.self="set_retain_selection">{{i18n_t('bet.save')}}</p>
    <p class="place_bet" @click="pack_up">
      <span>{{i18n_t('common.ok')}}</span>
    </p>
  </div>
  <div style="display:none">{{ BetData.bet_data_class_version }}-{{UserCtr.user_version}}</div>
  <div style="display:none">{{ BetViewDataClass.bet_view_version }}</div>
</template>

<script setup>
import { useMittEmit, MITT_TYPES,i18n_t  } from "src/output/index.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { LOCAL_PROJECT_FILE_PREFIX,UserCtr } from "src/output/index.js"

const pack_up = (val) => {
  // TODO: 临时调试用
  BetViewDataClass.set_is_finally(true)
  BetData.set_bet_box_h5_show(false)
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
}
// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_is_finally(true)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_order_status(1)
    BetViewDataClass.set_bet_before_message({})

    if(!BetData.is_bet_single){
      // 清空串关类型 的投注金额
      return BetViewDataClass.set_clear_bet_special()
    }

    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}
</script>

<style lang="scss" scoped>
.icon_loading{
  width: 0.18rem;
  height: 0.18rem;
  margin-top: 0.08rem;
  margin-left: 0.05rem;
}
.icon_success{
  margin-right: .05rem;
}
.displayflex{
  display: flex;
}
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
    color: var(--q-gb-t-c-17);
    display: flex;
    justify-content: center;
  }

  .bet-success {
    color: var(--q-gb-t-c-16);
    display: flex;
    justify-content: center;
  }
}
.bet_content_bottom{
  height: 0.68rem;
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-content: space-between;
  padding: 0 0.12rem .22rem;
    // margin-top: 26px;
   .bet_cancel{
      width: 1rem;
      line-height: 0.46rem;
      border-radius: 0.02rem;
      font-size: 0.16rem;
      font-weight: 400;
      height: 0.46rem;
      letter-spacing: 0px;
      border: 0.5px solid var(--q-gb-t-c-5);
      margin: 0 0.11rem 0 0.12rem;
      line-height: 0.4rem;
    }
    .place_bet{
      height: 0.46rem;
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.46rem;
      width: 2.35rem;
      border-radius: 0.02rem;
      background: var(--q-gb-bg-c-1);
      color:  var(--q-gb-t-c-2);
      .right_amount{
        font-size: 0.2rem;
        margin-left: 6px;
      }
    }
  }
  .box-line{
    width: 100%;
    height: 0.1rem;
  }
</style>
