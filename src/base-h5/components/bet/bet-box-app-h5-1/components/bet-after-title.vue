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
import { ref,computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX, i18n_t } from "src/output/index.js";
import { IconWapper } from 'src/components/icon/index.js'

let title = ref('')

const set_bet_order_status = computed(()=> status => {
  // 2-投注中状态,
  if(status == 2){
    title.value = i18n_t('bet.bet_loading')
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_loading.png`
  }
  //3-投注成功状态(主要控制完成按钮)
  if(status == 3){
    title.value = i18n_t('app_h5.bet.bet_confirm')
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_success.png`
  }
  // ,4-投注失败状态,5-投注项失效
  if([4,5].includes(+status)){
    title.value = i18n_t('app_h5.bet.bet_error')
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_error.png`
  }
})
const bet_order_status_active = computed(()=>{
  return [2, 3].includes(+BetViewDataClass.bet_order_status);
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
  .ty-bet-after-status-title{
    font-size: .16rem;
    font-weight: 600;
    line-height: .24rem;
    letter-spacing: 0;
    width: 100%;
    padding: 0.08rem 0;
    // 注单失败颜色样式
    color: var(--q-gb-t-c-4);
    font-family: PingFang SC;
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
  .icon-success {
    margin-right: .12rem;
  }
}
</style>