<!--
 * @Author: cooper
 * @Date: 2023-06-06 14:13:55
 * @Description: 赛事详情分析页
-->
<template>
  <div v-show="detail_info&&detail_info.ms>0">
<!--    <div>{{  }}</div>-->
    <div class="analysis-body">
      <!-- 动画/视频/比分榜 -->
      <venue-box
        :score_list="score_list"
        :detail_info="detail_info"
        v-show="!lodash_.isEmpty(detail_info)"
      />

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
      <!-- csid==1 || csid==2 并且 mbmty == 2 || mbmty == 4 为电子足球/篮球 -->
      <div v-if="!lodash_.isEmpty(score_list) && detail_info.ms > 0 && !((detail_info.csid == 1 || detail_info.csid == 2 ) && ([2,4].includes(detail_info.mbmty)))">
        <div
          class="tabs-wrap"
          v-if="['1', '2','4' ,'5','6', '9','7', '10'].includes(String(detail_info.csid))"
        >
          <span
            v-for="item in tabList"
            :key="item.id"
            @click="tabClick(item)"
            :class="[{ 'is-active': item.id === active }, 'tabs-item']"
            >{{ item.label() }}
          </span>
        </div>

        <!-- 足球分析页图表 -->
        <foot-ball-stats
          v-if="detail_info.csid == 1"
          :detail_info="detail_info"
          :score_list="score_list"
        />
        <!-- 2篮球、5网、7,斯诺克， 9排球、10羽毛球 -->
        <basket-ball-stats
          v-if="['2','4', '5','6', '7','9', '10'].includes(String(detail_info.csid))"
          :detail_info="detail_info"
          :score_list="score_list"
        />

        <!-- 4冰、6美足、5网、7斯诺克、9排球、10羽毛球 -->
        <!-- <template v-if="['4','6','5','7','9','10'].includes(lodash_.get(detail_info,'csid'))">
      <more :match_info="detail_info" />
    </template> -->
      </div>
      <!-- 选择哪队会赢组件 -->
      <switch-team v-if="false" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import lodash_ from "lodash";

import FootBallStats from "./compoments/football_stats.vue";
import BasketBallStats from "./compoments/basketball_stats.vue";
import switchTeam from "./compoments/switch-team.vue";
import venueBox from "./compoments/venue-box/index.vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,
} from "src/output/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

// const props =  defineProps({
//   detail_info: {  // 赛事详情
//     type: Object,
//     default: () => {}
//   },
// })

let detail_info = ref({});
const active = ref(1);
const tabList = ref([
  { label: () => i18n_t("common.panel_total"), id: 1 },
  // { label: "Timeline", id: 2 },
]);

onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_SHOW_DETAILS, get_detail_info);
});
// onUnmounted(()=>{
//     useMittOn(MITT_TYPES.EMIT_SHOW_DETAILS).off
//   })

// 获取数据
const get_detail_info = (mid) => {
  // 3572298
  MatchListCardDataClass.set_current_mid(mid)
  const infomation = MatchDataWarehouseInstance.get_quick_mid_obj(mid)
  console.log(infomation, "infomation");
  // 存入本地，点击大屏视频的时候使用
  sessionStorage.setItem('DETAIL_INFO', JSON.stringify(infomation))
  detail_info.value = infomation
 
  // setInterval(function (){
  // },2000)
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
const score_list = computed(() => {
  const obj = detail_info.value || {};
  let result = {};
  // msc [ 'S1|1:0', 'S2|1:0', 'S5|0:0', 'S6|0:0', 'S8|0:0' ] --比分（比分类型|比分）
  if (obj.msc && obj.msc.length > 0) {
    for (const item of obj.msc) {
      if (item) {
        const list = item.split("|");
        const score_list = list[1].split(":");
        result[list[0]] = {
          home: score_list[0],
          away: score_list[1],
          percentage:
            (Number(score_list[0]) /
              (Number(score_list[0]) + Number(score_list[1])).toFixed(2)) *
              100 || 0,
          away_percentage:
            (Number(score_list[1]) /
              (Number(score_list[0]) + Number(score_list[1])).toFixed(2)) *
              100 || 0,
        };
      }
    }
  } else {
    for (const key in obj.msc) {
      const home = obj.msc[key]["home"];
      const away = obj.msc[key]["away"];
      result[key] = {
        home,
        away,
        percentage:
          (Number(home) / (Number(home) + Number(away)).toFixed(2)) * 100 || 0,
        away_percentage:
          (Number(away) / (Number(home) + Number(away)).toFixed(2)) * 100 || 0,
      };
    }
  }
  /*
  S1: {
    away: "0"
    away_percentage: 0
    home: "1"
    percentage: 100
  }
  */

  return result;
});
</script>

<style lang="scss" scoped>
.analysis-body {
  // background: #ffffff;
  .analysis-top {
    background: var(--q-gb-bg-c-4);
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-icon {
      background-image: url("../../../../assets/images/football_icon.png");
      height: 16px;
      width: 16px;
      margin: 0 6px 0 12px;
    }
    .analysis-top-txt {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      text-transform: capitalize;
      color: var(--q-gb-t-c-5);
    }
    .analysis-top-l {
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
  background: var(--q-gb-bg-c-4);
  // padding-bottom: 10px;
  border-bottom: 1px solid var(--q-gb-bd-c-2);
}
.tabs-item {
  // margin-right: 40px;
  display: block;
  //  min-width: 50px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: var(--q-gb-t-c-5);
  cursor: pointer;
}
.is-active {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: var(--q-gb-t-c-5);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: -14px;
    left: 5%;
    right: 5%;
    width: 90%;
    height: 2px;
    background: var(--q-gb-bg-c-1);
  }
}
</style>