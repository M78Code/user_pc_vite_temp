<script setup>
import { defineProps } from "vue"

const props = defineProps({
  money:{
    type: [String,Number],
    default: '600,256.00'
  },
  amount:{
    type: [String,Number],
    default: '3,958,256.00'
  },
  orderNumber:{
    type: String,
    default: 'LX21351531351311321'
  }
})
</script>

<template>
  <ul class="bet-info-list">
    <li>
      <p class="grey">投注金额</p>
      <p class="black lineRight fontbold"> {{ props.money }} </p>
    </li>
    <li>
      <p class="grey">可赢金额</p>
      <p class="black lineRight fontbold">{{ props.amount }}</p>
    </li>
    <li>
      <p class="grey">注单号</p>
      <p class="grey lineRight">{{ props.orderNumber }}</p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.bet-info-list{
  width: 100%;
  padding: 24px 10px;
  box-sizing: border-box;
  >li{
    display: grid;
    grid-template-columns: 2rem auto;
    margin: 4px 0;
    font-size: 12px;
    .black{
      color: #303442;
    }
    .grey{
      color: #7981A4;
    }
    .lineRight{
      text-align: right ;
    }
    .fontbold{
      font-weight: bold;
    }
  }
}
</style>