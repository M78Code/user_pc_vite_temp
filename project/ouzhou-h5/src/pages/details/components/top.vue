<template>
  <div class="wrapper">
    <div class="time-box">
      <div class="left">
        <span class="time">26/04 15:30</span>
        <span class="sign">N</span>
      </div>
      <img class="star" src="../svg/star.svg" />
    </div>
    <div class="title-box">
      Athletic Club
    </div>
    <div class="subTit-box">
      Real Club
    </div>
  </div>
  <div class="tab-box">
    <div v-for="(item, index) in tabs" :key="value" class="tab" :class="{
      active: tabIndex === index
    }" @click="tabChange(item, index)">{{ item.text }}</div>
  </div>
  <div class="bg"></div>
</template>
<script setup>
import { ref } from 'vue'
const tabIndex = ref(0)
const tabs = [
  {
    text: 'Betting',
    value: 0,
  },
  {
    text: 'Evevt Analysis',
    value: 1,
  }
]
const tabChange = (item, index) => {
  tabIndex.value = index
}
</script>

<style scoped lang="scss">
.wrapper{
  padding: 12px 20px 14px 20px;
  border-bottom: 1px solid #E2E2E2;
}
.time-box{
  display: flex;
  justify-content: space-between;
  .left{
    display: flex;
    align-items: center;
    color: #8A8986;
    font-size: 16px;
    .sign{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      width: 14px;
      height: 14px;
      margin-left: 10px;
      background-color: #0CBEB9;
      color: #fff;
    }
  }
}
.title-box,.subTit-box{
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  color: #1A1A1A;
  margin-top: 14px;
}
.title-box{
}
.tab-box{
  display: flex;
  padding: 13px 0;
  color: #1A1A1A;
  font-size: 16px;
  padding-bottom: 12px;
  .tab{
    width: 50%;
    text-align: center;
    &:not(:last-child){
      border-right: 1px solid #E2E2E2;
    }
    &.active{
      position: relative;
      color: #FF7000;
      &:after{
        position: absolute;
        left: 50%;
        bottom: -12px;
        transform: translateX(-50%);
        content: '';
        width: 52px;
        height: 3px;
        background-color: #FF7000;
      }
    }
  }
}
.bg{
  height: 10px;
  background-color: #e2e2e2;
}
</style>