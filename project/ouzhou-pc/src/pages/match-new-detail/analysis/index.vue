
<!--
 * @Author: cooper
 * @Date: 2023-06-06 14:13:55
 * @Description: 赛事详情分析页
-->
<template>
  <div>
    <div class="analysis-body">
      <!-- 动画/视频/比分榜 -->
      <venue-box :score_list="score_list" :detail_info="detail_info" v-show="!lodash_.isEmpty(detail_info)" />
  
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
      <div v-if="!lodash_.isEmpty(score_list)&&detail_info.ms>0">
    <div class="tabs-wrap">
      <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
        :class="[{ 'is-active': item.id === active }, 'tabs-item']">{{ item.label }}
      </span>
    </div>
     
       <!-- 足球分析页图表 -->
      <foot-ball-stats v-if="detail_info.csid==1" :detail_info="detail_info" :score_list="score_list" />
       <!-- 篮球分析页图表 -->
       <basket-ball-stats  v-if="detail_info.csid==2" :detail_info="detail_info" :score_list="score_list" />

      </div>
      <!-- 选择哪队会赢组件 -->
      <switch-team v-if="false" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted,ref,computed,watch } from "vue";
// import {LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js';

 import FootBallStats from './compoments/football_stats.vue'
 import BasketBallStats from './compoments/basketball_stats.vue'
import switchTeam from './compoments/switch-team.vue'

import venueBox from './compoments/venue-box/index.vue'
import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt"
import { MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,MenuData,UserCtr } from "src/core/index"; 

// const props =  defineProps({
//   detail_info: {  // 赛事详情
//     type: Object,
//     default: () => {}
//   },
// })

let detail_info = ref({})
const active = ref(1);
const tabList = ref([
  { label: i18n_t("common.panel_total"), id: 1 },
  // { label: "Timeline", id: 2 },
]);

onMounted(()=>{
  useMittOn(MITT_TYPES.EMIT_SHOW_DETAILS,get_detail_info)
})
onUnmounted(()=>{
    useMittOn(MITT_TYPES.EMIT_SHOW_DETAILS).off
  })


// 获取数据
const get_detail_info = (mid)=>{
  detail_info.value = MatchDataWarehouseInstance.get_quick_mid_obj(mid)

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


.tabs-wrap {
height: 50px;
display: flex;
justify-content: center;
align-items: center;
background: #ffffff;
// padding-bottom: 10px;
border-bottom: 1px solid #e2e2e2;
}
.tabs-item {
  // margin-right: 40px;
  display: block;
  //  min-width: 50px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: #1a1a1a;
  cursor: pointer;
}
.is-active {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: #1a1a1a;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: -14px;
    left: 5%;
    right: 5%;
    width: 90%;
    height: 2px;
    background: #ff7000;
  }
}


</style>
