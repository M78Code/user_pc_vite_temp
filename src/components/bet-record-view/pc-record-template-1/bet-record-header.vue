<template>
    <!-- 投注记录 未结算&已结算$ 预约 tab bar -->
    <div class="full-width bet-type" style="margin-top:0">
      <div >{{ BetRecord.bet_record_version }}</div>
      <div class="row bet-record-item cursor-pointer">
        <!--点选未结算0-->
        <div class="col text-center" :class="{'active': BetRecord.selected==0}" @click.stop="set_record_selected(0)">
          {{$t('common.no_settlement')}}
          <!--未结算-->
        </div>
        <!--点选预约2-->
        <div class="col-auto menu-tab-line" v-if="BetRecord.selected==2">
          <div class="line"></div>
        </div>
        <!--点选已结算1-->
        <div class="col text-center" :class="{'active': BetRecord.selected==1}" @click.stop="set_record_selected(1)">
          {{$t('common.settlement_')}}
          <!--已结算-->
        </div>
        <div class="col-auto menu-tab-line" v-if="BetRecord.selected==0">
          <div class="line"></div>
        </div>
        <div class="col text-center"  :class="{'active': BetRecord.selected==2}"  @click.stop="set_record_selected(2)">
          {{ $t('bet.bet_book2') }}
          <!--预约-->
        </div>
      </div>
      <template v-if="BetRecord.selected==2">
        <div class="row cursor-pointer appoint-order-status">
          <div class="col text-center"
            :class="{'active': BetRecord.appoint_order_status==0}"
            @click.stop="set_record_appoint_order_status(0)">
            {{ $t('bet.bet_process') }}
            <template v-if="BetRecord.appoint_order_status==0">
              <div class="tabs-line"></div>
            </template>
          </div>
          <div class="col-auto menu-tab-line">
            <div class="line"></div>
          </div>
          <div class="col text-center"
            :class="{'active': BetRecord.appoint_order_status==2}"
            @click.stop="set_record_appoint_order_status(2)">
            {{ $t('bet.bet_invalid') }}
            <template v-if="BetRecord.appoint_order_status==2">
              <div class="tabs-line"></div>
            </template>
          </div>
        </div>
        <q-separator class="appoint-separator"></q-separator>
      </template>
    </div>
</template>

<script setup>
import BetRecord from "src/core/bet-record/bet-record.js"

// tab切换 未结算 已结算 预约
const set_record_selected = number => {
  BetRecord.set_selected(number)
}
// tab切换 预约-》 进行中 已失效
const set_record_appoint_order_status = number => {
  BetRecord.set_appoint_order_status(number)
}
</script>

<style scoped lang="scss">
  .active{
    color:#ff0000;
  }
</style>