<template>
  <div class="ty-bet-after-status">
    <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
    <img :src="set_bet_order_status" alt="" />
    <div class="ty-bet-after-status-title">{{title}}</div>
  </div>
</template>

<script setup>
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { ref,computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core/";

let title = ref('')

const set_bet_order_status = computed(()=>{
  // 2-投注中状态,
  if(BetViewDataClass.bet_order_status == 2){
    title.value = '注单确认中'
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_loading.png`
  }
  //3-投注成功状态(主要控制完成按钮)
  if(BetViewDataClass.bet_order_status == 3){
    title.value = '注单已确认'
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_success.png`
  }
  // ,4-投注失败状态,5-投注项失效
  if([4,5].includes(BetViewDataClass.bet_order_status)){
    title.value = '注单失败'
    return `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/icon_order_error.png`
  }
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
    font-weight: 500;
    line-height: .24rem;
    letter-spacing: 0;
    width: 100%;
    padding: 0.08rem 0;
  }
}
</style>