<script setup name="bevis-beted_status">
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

import { IconWapper } from "src/components/icon/index.js";

// import { defineProps, ref } from "vue"
import { ref } from "vue"

// 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
const filterTitle = function (status){

  const titleObj = {
    1: '投注状态',
    2: '注单确认中',
    3: '注单已确认',
    4: '注单失败',
    5: '注单失败',
  }

  return {
    title: titleObj[status],
    icon: status < 4 ? 'icon-success' : 'icon-failure'
  }
}
</script>

<template>
  <div class="strandHeader">
    <icon-wapper :name="filterTitle(BetViewDataClass.bet_order_status).icon" size="18px" />
    <p>{{ filterTitle(BetViewDataClass.bet_order_status).title }}</p>
  </div>
</template>

<style scoped lang="scss">
.strandHeader{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  flex-wrap: nowrap;

  >p{
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>