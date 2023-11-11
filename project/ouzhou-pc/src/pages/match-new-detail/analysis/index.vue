
<!--
 * @Author: cooper
 * @Date: 2023-06-06 14:13:55
 * @Description: 赛事详情分析页
-->
<template>
  <div>
    <div class="analysis-body">
      <!-- 动画比分榜 -->
      <venue_box v-show="detail_info.ms>0" :score_list="score_list" :detail_info="detail_info"  />
  
      <!-- <div class="analysis-top">
        <div class="analysis-top-l">
          <div class="v-icon switch-icon"></div>
          <span class="analysis-top-txt">Liga de primera división</span>
        </div>
        <div class="analysis-top-right">
          <div class="switch-icon-score"><img src="../../../../assets/images/switch_active.png" alt=""></div>
          <div class="switch-icon-score"><img src="../../../../assets/images/score.png" alt=""></div>
        </div>
      </div> -->
      <!-- 分析页动画 -->
      <!-- <venue_box /> -->
      <!-- <score_info :score_list="score_list" :detail_info="detail_info" /> -->
       <!-- 足球分析页图表 -->
      <foot-ball-stats v-if="detail_info.csid==1 &&detail_info.ms>0" :detail_info="detail_info" :score_list="score_list" />
       <!-- 篮球分析页图表 -->
       <basket-ball-stats  v-if="detail_info.csid==2 &&detail_info.ms>0" :detail_info="detail_info" :score_list="score_list" />
      <!-- 选择哪队会赢组件 -->
      <switch_team />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref,computed,watch } from "vue";
// import {LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js';

 import FootBallStats from './compoments/football_stats.vue'
// import BasketBallStats from './compoments/basketball_stats.vue'
import switch_team from './compoments/switch_team.vue'

import venue_box from './compoments/venue_box/index.vue'
import _ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt"
import { MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,MenuData,UserCtr } from "src/core/index"; 

// const props =  defineProps({
//   detail_info: {  // 赛事详情
//     type: Object,
//     default: () => {}
//   },
// })

let detail_info = ref({})

onMounted(()=>{
  useMittOn(MITT_TYPES.EMIT_SHOW_DETAILS,get_detail_info)
})

// 获取数据
const get_detail_info = (mid)=>{
  console.log(111111, MatchDataWarehouseInstance.get_quick_mid_obj(mid))
  detail_info.value = MatchDataWarehouseInstance.get_quick_mid_obj(mid)
  console.log(11111133, detail_info.value)
}
// const show_page = ref(false)
// watch(()=>props.detail_info,val=>{
//   if (!_.isEmpty(val)) {
//     show_page.value = true
//   }
// },
// {immediate:true}
// )



  // 详情数据msc处理
  const score_list = computed(()=>{
  const obj = detail_info.value || {}
  let result = {}
 
  if (obj.msc&&obj.msc.length>0 ) {
    for (const item of obj.msc) {
      const list = item.split('|')
      const score_list = list[1].split(':')
      // console.log(list)
      result[list[0]] = {
        home:score_list[0],
        away:score_list[1],
        percentage:(Number (score_list[0]) / (Number (score_list[0]) + Number (score_list[1])).toFixed(2)) * 100||0,
        away_percentage:(Number (score_list[1]) / (Number (score_list[0]) + Number (score_list[1])).toFixed(2)) * 100||0,
      }
    }
  }else{
    for (const key in obj.msc) {
      const home = obj.msc[key]['home']
      const away = obj.msc[key]['away']
      result[key] = {
        home,
        away,
        percentage:(Number (home) / (Number (home) + Number (away)).toFixed(2)) * 100||0,
        away_percentage:(Number (away) / (Number (home) + Number (away)).toFixed(2)) * 100||0,
      }
     
    }
  }
   return result
})

</script>

<style lang="scss" scoped>
.analysis-body {
  // background: #ffffff;
  .analysis-top {
    background: #ffffff;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-icon {
      background-image: url("../../../../assets/images/football_icon.png");
      height: 16px;
      width: 16px;
      margin:0 6px 0 12px ;
    }
    .analysis-top-txt {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      text-transform: capitalize;
      color: #1a1a1a;
    }
    .analysis-top-l{
      display: flex;
    }
    .analysis-top-right {
      display: flex;
      .switch-icon-score {
        height: 12px;
        width: 16px;
        margin-right: 14px;
        img {
          height: 12px;
          width: 16px;
        }
      }
    }
  }
}
</style>
