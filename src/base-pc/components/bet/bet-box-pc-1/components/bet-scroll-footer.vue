<!--
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap" :class="{ 'bet-menu-wrap-mix': !BetData.is_bet_single }">
    <div v-if="!BetData.is_bet_single">
      <hr class="bet-total-hr">
      <div class="bet-total-wrap">
        <div class="row bet-total">
          <div class="col bet-total-left">{{ i18n_t("bet.total_bet")}}</div>
          <div class="col-auto bet-total-right"> {{ format_money2(mathJs.divide(BetViewDataClass.bet_special_pc.bet_total)) }}</div>
        </div>
        <div class="row bet-total">
          <div class="col bet-total-left">{{ i18n_t("bet.total_income") }}</div>
          <div class="col-auto bet-total-right bet-gold-text">{{ format_money2(mathJs.divide(BetViewDataClass.bet_special_pc.bet_win))}}</div>
        </div>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div class="bet-message" >
      <div v-show="BetViewDataClass.error_message" class="w-100 f-c-c bet-title" :class="{'bet-success':BetViewDataClass.error_code == 200, 'bet-loading':BetViewDataClass.error_code == '0000000', 'bet-error': ![200,'0000000'].includes(BetViewDataClass.error_code)}">
          {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
      </div>
    </div>
   
    <div class="bet-btn-wrap">
      <div class="full-width cursor-pointer bet-submit">
     
        <div @click.stop="submit_handle('submit')" v-if="BetViewDataClass.bet_order_status == 1">
          <!-- 投注 -->
          {{ i18n_t('common.betting') }}
        </div>
        <div v-else  @click.stop="cancel_handle()" >
          <!--确定按钮-->
          {{ i18n_t('common.confirm') }}
        </div>
      </div>

      <div class="full-width cursor-pointer bet-delete-all" @click.stop="cancel_handle" v-if="BetViewDataClass.bet_order_status == 1">
        <!-- 取消投注 -->
        {{ i18n_t('bet.bet_cancel') }}
      </div>
      <div class="full-width cursor-pointer bet-delete-all" @click="set_retain_selection" v-else>
        <!-- 保留选项 -->
        {{ i18n_t('bet.save_item') }}
      </div>
    </div>
    
    


    <div class="bet-footer-check" @click="set_bet_is_accept()">
      <span class="check-box" :class="{'p-d-20': !BetData.is_bet_single}">
        <span class="check-wrap relative-position" :class="{'active':!BetData.bet_is_accept}"/>
        <span>{{i18n_t('bet.bet_auto_msg_1')}}</span>
      </span>
    </div>

    <div>
      <span class="check-box" :class="{'p-d-20': BetData.is_bet_single}" v-if="BetData.is_bet_single" @click="BetData.set_regular_amount()">
        <span class="check-wrap relative-position" :class="{'active': BetData.is_checked_regular_amount}" />
        <span>{{ i18n_t('bet.common_amount') }}</span>
      </span>
    </div>


    <div v-show="false">{{ BetData.bet_view_version }}-{{BetData.bet_data_class_version}} - {{ BetViewDataClass.bet_view_version }}</div>

  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { i18n_t,UserCtr,format_money2} from "src/output/index.js"
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
//是否失效
const lock_btn = ref(false)

onMounted(() => {
  useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, set_lock_btn())
})

/*** @description: 设置按钮失效
 * @param {boolean} value 是否锁定
 * @return {undefined} undefined
*/
const set_lock_btn = value => {
  lock_btn.value = value;
}
// 取消投注 返回菜单
const cancel_handle = () => {
  BetViewDataClass.set_is_finally(true)
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
  LayOutMain_pc.set_layout_left_show('menu')
}
// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_before_message({})
    BetViewDataClass.set_is_finally(true)
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}
 
// 自动接受更好的赔率
const set_bet_is_accept = () => {
    let state = !BetData.bet_is_accept
    BetData.set_bet_is_accept(state)
}
</script>

<style scoped lang="scss">
.bet-menu-wrap {
  background: var(--q-gb-bg-c-11);
  border-right: 1px solid var(--q-gb-bg-c-9);
  .bet-total-hr {
      height: 0.5px;
      background: #E4EAFF;;
      border:0;
      margin-top: -10px;
    }
  .bet-total-wrap {
    border-bottom: 0.5px solid #E4EAFF;
    padding: 8px 0;
    margin-bottom: 30px;
  }
  .bet-total {
    line-height: 1;
    padding: 0 15px 5px 15px;
    .bet-total-left {
      font-size: 12px;
      color: var(--q-gb-bg-c-2);
      text-align: left;
    }
    .bet-total-right {
      font-size:16px;
      text-align: center;
    }
    .bet-gold-text {
      color: var(--q-gb-bg-c-18);
    }
  }
  .bet-footer-check{
    margin-top: 20px;
  }

  .bet-submit {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: var(--q-gb-bd-c-13);
    text-align: center;
    font-weight: 600;
    border-radius: 36px;
    background: var(--q-gb-bg-lg-1);
  }

  .bet-delete-all {
    margin-top: 10px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    border-radius: 36px;
    font-weight: 400;
    font-size: 14px;
    border: 0.5px solid var(--q-gb-bd-c-8);
    color: var(--q-gb-t-c-6);
    background: linear-gradient(180deg, #E5EDFE 0%, #F7FAFF 53.65%, #F6F9FF 100%);
    box-shadow: 0px 2px 2px 0px rgba(24, 81, 130, 0.12);
  }
  .bet-message {
    text-align: center;
    color: #ff4040;
    height: 30px;
    line-height: 30px;
    background: transparent;
    font-size: 12px;
    margin:-15px 0 15px 0;
    padding:0 5px;
    .bet-success {
      background: rgba(100,194,88,0.2);
      color: #64c258;
      line-height: 30px;
      font-size: 12px;
      border-radius: 0px 0px 6px 6px;
    }
    // .bet-success-order {
    //   background: rgba(100,194,88,0.2);
    //   color: #64c258;
    //   line-height: 30px;
    //   font-size: 12px;
    //   border-radius: 0px 0px 6px 6px;
    // }
  }
  .bet-btn-wrap {
    padding:0 10px;
  }
}
.check-box {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  color: var(--q-gb-t-c-11);

  .check-wrap {
    padding: 0;
    margin-right: 5px;
  }
}
/** 选择框样式 -S*/
.check-wrap {
  width: 14px;
  min-width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid var(--q-gb-bd-c-7);
  margin-right: 10px;
  position: relative;

  &.active {
    border: none;
    background: var(--q-gb-t-c-16);

    &::before {
      position: absolute;
      content: "";
      left: 4px;
      width: 6px;
      height: 4px;
      top: 4px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      transform: rotate(135deg);
      border-color: var(--q-gb-bd-c-13);
    }
  }
}
.p-d-20 {
  padding-bottom: 20px;
}
/** 选择框样式 -E*/
</style>