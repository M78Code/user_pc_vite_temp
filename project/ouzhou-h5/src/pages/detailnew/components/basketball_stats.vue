<!--
 * @Author: cooper
 * @Date: 2023-06-013 14:13:55
 * @Description: 篮球赛事分析页
-->
<template>
  <div class="detail-tab" v-if="!_.isEmpty(score_list)">
    <div>
      <div class="detail-tab-team">
        <div class="detail-tab-team-pos">
          <span class="team-point-l"></span>
          <span class="team-name">{{ detail_info.mhn }}</span>
        </div>
        <div class="detail-tab-team-pos">
          <span class="team-name" style="text-align: right;">{{ detail_info.man }}</span>
          <span class="team-point-r"></span>
        </div>
      </div>
      <div>
        <!-- 得分条 -->
        <div class="detail-slider" v-for="item in sliderList" :key="item.title">
          <div class="row justify-between" v-if="score_list[item.value_key]">
            <span>{{ score_list[item.value_key].home  }}</span>
            <span class="detail-slider-title">{{ item.title }}</span>
            <span>{{ score_list[item.value_key].away }}</span>
          </div>
          <div class="detail-slider-line"  v-if="score_list[item.value_key]">
            <q-slider readonly reverse :model-value="score_list[item.value_key].percentage" :min="0" :max="120" track-size="5px" color="amber-7"
              :thumb-size="0" style="margin-right:6px" />
            <q-slider readonly :model-value="score_list[item.value_key].away_percentage" :min="0" :max="120" track-size="5px" color="indigo-12"
              :thumb-size="0" />
          </div>
        </div>
        <!-- 犯规条 篮球赛事才有 -->
        <div class="detail-score-more">
          <div class="row justify-center">
            <div class="score-more-title"> 
              <span>{{ score_list['S111']['home']+'%' }}</span>
              <span>{{ score_list['S110']['home'] }}</span>
            </div>
            <div class="score-more-r-title">
              <span>{{ score_list['S110']['away'] }}</span>
               <span>{{ score_list['S111']['away']+'%' }}</span>
            </div>
          </div>
          <div class="detail-slider-line">
            <div class="home-stop stop">
              <span class="dot dot-h" v-for="item in  5" :key="item"></span>
            </div>
            <div class="slider-main">
              <q-slider readonly reverse :model-value="score_list['S111']['home']+'%'" :min="0" :max="50" track-size="5px" color="amber-7"
                :thumb-size="0" style="margin-right:6px" />
              <q-slider readonly :model-value="score_list['S111']['away']+'%'" :min="0" :max="50" track-size="5px" color="indigo-12"
                :thumb-size="0" />
            </div>
            <div class="home-stop stop">
              <span class="dot dot-h-r" v-for="item in  5" :key="item"></span>
            </div>
          </div>
          <div class="row justify-between" style="color:#8A8986">
            <span>Time Out</span>
            <span>Free Throw</span>
            <span>Time Out</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import _ from "lodash"
const props =  defineProps({
  detail_info: {  // 赛事详情
    type: Object,
    default: () => {}
  },
  score_list: {  // 赛事详情
    type: Object,
    default: () => {}
  },
})

const value = ref(50);
const standard = ref(15)
const sliderList = ref([
  {
    title: "2 Point",
    value_key:'S107'
  },
  {
    title: "3 Point",
    value_key:'S108'
  },
  {
    title: "Foul",
    value_key:'S106'
  },
])
const statsList = ref([
  {
    value: "2 Point",
    value_key:'S107'
  },
  {
    value: "3 Point",
    value_key:'S108'
  },
  {
    value: "Foul",
    value_key:'S106'
  },
]);
const tab = ref("mails");
const active = ref(1);
const tabClick = (item) => {
  active.value = item.id;
};
</script>

<style lang="scss" scoped>
.detail-tab {
  // height: 272px;
  background: #ffffff;
  padding-bottom: 15px;
}

.tabs-wrap {

  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-bottom: 10px;
  border-bottom: 1px solid #e2e2e2;
}

.tabs-item {
  margin-right: 40px;
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

.detail-tab-team {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;

  .detail-tab-team-pos {
    width: 50%;
    display: flex;
    align-items: center;
  }

  .team-name {
    display: inline-block;
    width: 88%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .team-point-l {
    display: inline-block;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: #ffac01;
    margin-right: 10px;
  }

  .team-point-r {
    display: inline-block;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: #5881f7;
    margin-left: 10px;
  }
}

.detail-statsic {
  display: flex;
  justify-content: space-around;

  .detail-statsic-title {
    text-align: center;
    color: #8a8986;
  }

  .detail-statsic-chart {
    display: flex;
    align-items: center;

    &:deep(.q-ma-md) {
      margin: 16px 8px;
    }
  }
}

.detail-slider {
  padding: 5px 28px;

  .detail-slider-line {
    display: flex;

  }

  .detail-slider-title {
    color: #8A8986;
  }

}

.detail-score-more {
  padding: 5px 28px;
  .score-more-title{
    margin-right: 10px;
    span{
      font-weight: 500;
      color: #1a1a1a;
      &:nth-child(1){
        color:#FFAC01;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
  .score-more-r-title{
    margin-left: 10px;
    span{
      font-weight: 500;
      color: #1a1a1a;
      &:nth-child(2){
        color:#5881f7;
        display: inline-block;
        margin-left: 10px;
      }
    }
  }

  .detail-slider-line {
    display: flex;
    justify-content: center;

    .home-stop {

      // width: 15%;
      .dot {
        height: 6px;
        width: 6px;
        display: inline-block;
        border-radius: 50%;
        margin-right: 3px;
      }

      .dot-h {
        background-color: #ff7000;
      }

      .dot-h-r {
        background-color: #5881f7;
      }
    }

    .slider-main {
      width: 68%;
      display: flex;
      margin: 0 10px // flex-wrap: nowrap;
    }

  }
}</style>
