<template>
  <div class="ty-bet-after-status" v-if="BetData.is_bet_single">
    <div v-show="false">{{BetViewDataClass.bet_view_version}} - {{ BetData.bet_data_class_version }} </div>
    <img :src="set_bet_order_status(BetViewDataClass.bet_order_status)" alt="" />
    <div class="ty-bet-after-status-title" :class="{active: bet_order_status_active}">{{title}}</div>
  </div>

  <div v-else class="order-title f-c-c font16">
    <icon-wapper name="icon-success" size="16px" color="#77C48F" /> <span style="margin-left: 0.05rem">注单已确认</span>
  </div>
</template>

<script setup>
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX, i18n_t, LocalStorage } from "src/output/index.js";
import { IconWapper } from 'src/components/icon/index.js';

const theme = LocalStorage.get('theme');
let title = ''
// 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效 6-预约中 7-预约成功  8-预约取消
const set_bet_order_status = computed(() => status => {
  // 2-投注中状态,
  if([2,6].includes(status*1)){
    title = i18n_t('bet.bet_loading')
    // 6-预约中 
    if(status == 6){
      title = i18n_t('pre_record.booking')
    }
    if(theme === 'theme-1') {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_loading_night.png`
    } else {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_loading.png`
    }
  }
  //3-投注成功状态(主要控制完成按钮)
  if([3,7].includes(status*1)){
    title = i18n_t('app_h5.bet.bet_confirm')
    // 7-预约成功
    if(status == 7){
      title = i18n_t('pre_record.booked')
    }
    if(theme === 'theme-1') {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_success_night.png`
    } else {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_success.png`
    }
  }
  // ,4-投注失败状态,5-投注项失效
  if([4,5,8].includes(+status)){
    title = i18n_t('app_h5.bet.bet_error')
    //  8-预约取消
    if(status == 8){
      title = i18n_t('pre_record.booked_fail')
    }
    if(theme === 'theme-1') {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_error_nigth.png`
    } else {
      return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/img_order_error.png`
    }
  }
})
const bet_order_status_active = computed(()=>{
  return [2, 3, 6, 7].includes(+BetViewDataClass.bet_order_status);
})


</script> 

<style lang="scss" scoped>
.ty-bet-after-status{
  padding: 0.12rem 0 0;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  img {
    width: 1.4rem;
    height: 1.4rem;
  }
  .ty-bet-after-status-title{
    font-size: .16rem;
    font-weight: 500;
    line-height: .24rem;
    letter-spacing: 0;
    width: 100%;
    padding: 0.08rem 0;
    // 注单失败颜色样式
    color: var(--q-gb-t-c-19);
    
    &.active{
      color: var(--q-gb-t-c-1);
    }
  }
}
.order-title {
  padding-top: .12rem;
  height: 0.28rem;
  line-height: .28rem;
  margin-bottom: .08rem;
  color: var(--q-gb-t-c-17);
  .icon-success {
    margin-right: .12rem;
  }
}
</style>