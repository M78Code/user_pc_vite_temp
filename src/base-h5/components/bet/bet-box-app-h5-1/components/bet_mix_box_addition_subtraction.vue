<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
    <div @click="reduce_btn">-</div>
    <div class="bet-mix-show-value font700 number_family"><span class="bet-mix-show-box">@</span>{{ format_odds(ref_custom.oddFinally, item.sportId) }}</div>
    <div @click="add_btn">+</div>
  </div>
</template>
<script setup>
import { format_odds } from 'src/output/index.js'
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, reactive } from 'vue';
import mathJs from 'src/core/bet/common/mathjs.js'
import lodash_ from "lodash"
const props = defineProps({
  item: {}
})

const ref_data = reactive({
  min_odd:'', // 最小赔率
  max_odd: 355, // 最大赔率
})

const ref_custom = reactive({
  marketValue: '', // 盘口值
  oddFinally: '', // 当前赔率
  custom_id: '', // 投注项id
  odds: "", // 投注项赔率
})

onMounted(()=>{
  // 初始化数据
  ref_custom.oddFinally = lodash_.get(props.item,'oddFinally') 
  ref_custom.marketValue = lodash_.get(props.item,'marketValue') 
  ref_custom.custom_id = lodash_.get(props.item,'playOptionsId') 
  ref_custom.odds = lodash_.get(props.item,'odds')

  ref_data.min_odd = lodash_.get(props.item,'oddFinally') 
 
})

// 预约赔率 减
const reduce_btn = () => {
  // 已经是最小赔率 不做处理
  if(ref_custom.oddFinally <= props.item.oddFinally){
    return
  }else{
    ref_custom.oddFinally = mathJs.subtract( ref_custom.oddFinally,0.01)
    set_bet_obj_config()
  }
}

// 预约 赔率 加
const add_btn = () => {
  // 最大赔率 不做处理
  if(ref_data.max_odd <= ref_custom.oddFinally){
    return
  }else{
    ref_custom.oddFinally = mathJs.add( ref_custom.oddFinally,0.01)
    set_bet_obj_config()
  }
}

// 设置投注信息
const set_bet_obj_config = () => { 
  ref_custom.odds = mathJs.multiply(ref_custom.oddFinally,100000)
  BetData.set_bet_pre_obj(ref_custom)
}

</script>

<style lang="scss" scoped>
    .bet-mix-show{
        height: 0.4rem;
        overflow: hidden;
        padding-left: .24rem;
        padding-right: .24rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: var(--q-gb-bg-c-22);
        border-radius: .12rem;
        margin: 0.1rem 0;
        color: var(--q-gb-t-c-11);
        font-size: .2rem;
    }
    .bet-mix-show-value{
        color: var(--q-gb-t-c-17);
        display: flex;
        align-items: center;
    }
    .bet-mix-show-box{
        font-size: 0.12rem;
        margin-right: 0.02rem;
        margin-top: -0.01rem;
    }
</style>