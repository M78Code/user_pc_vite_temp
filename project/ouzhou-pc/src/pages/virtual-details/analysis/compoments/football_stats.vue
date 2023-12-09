
<!--
 * @Author: cooper
 * @Date: 2023-06-013 14:13:55
 * @Description: 足球赛事分析页
-->
<template>
  <div class="detail-tab" v-if="!lodash.isEmpty(score_list)">
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
      
        <div class="detail-statsic" v-if="score_list">
          <div v-for="item in statsList" :key="item.value">
            <div class="detail-statsic-title">{{ i18n_t(item.value)}}</div>
            <div class="detail-statsic-chart" v-if="score_list[item.value_key]" >
              <span>{{ score_list[item.value_key].home }}</span>
              <q-knob
                readonly
                reverse
                v-model="score_list[item.value_key].percentage"
                size="50px"
                :thickness="0.4"
                color="amber-7"
                :track-color="score_list[item.value_key].percentage==0?'grey-3':'indigo-12'"
                class="q-ma-md"
              />
              <span>{{score_list[item.value_key].away }}</span>
            </div>
          </div>
        </div>
        <!-- 得分条 -->
        <div class="detail-slider" v-for="item in sliderList" :key="item.title">
          <div class="row justify-between" v-if="score_list[item.value_key]">
            <span>{{ score_list[item.value_key].home  }}</span>
            <span class="detail-slider-title">{{i18n_t(item.title)}}</span>
            <span>{{ score_list[item.value_key].away  }}</span>
          </div>
          <div class="detail-slider-line" v-if="score_list[item.value_key]">
            <q-slider readonly reverse :model-value="score_list[item.value_key].percentage" :min="0" :max="50" track-color="basic-bg-track" track-size="5px" color="amber-7"
              :thumb-size="'0'" style="margin-right:6px" />
            <q-slider readonly :model-value="score_list[item.value_key].away_percentage" :min="0" :max="50" track-color="basic-bg-track" track-size="5px" color="indigo-12"
              :thumb-size="'0'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref,computed } from "vue";
import { i18n_t } from "src/boot/i18n.js"
// import _ from "lodash"
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
const statsList = ref([
  {
    value: 'common.assault',
    value_key:'S104'
   
  },
  {
    value: 'common.dangerous_assault',
    value_key:'S8'
  
  },
  {
    value: 'common.possession_ball',
    value_key:'S105'
  
  },
]);
onMounted(()=>{
})




const value = ref(50);
const standard = ref(15)
const sliderList = [
  {
    title: 'common.shots_on_goal',
    value_key:'S18'
  },
  {
    title:'common.shot_wide_goal',
    value_key:'S17'
  },

]
const tab = ref("mails");

</script>

<style lang="scss" scoped>
.detail-tab {
  // height: 272px;
  background: var(--q-gb-bg-c-4);
  padding-bottom: 15px;
  margin-bottom: 10px;
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
    background-color: var(--q-gb-bg-c-12);
    margin-right: 10px;
  }

  .team-point-r {
    display: inline-block;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: var(--q-gb-bg-c-13);
    margin-left: 10px;
  }
}

.detail-statsic {
  display: flex;
  justify-content: space-around;

  .detail-statsic-title {
    text-align: center;
    color: var(--q-gb-t-c-8);
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
  &:deep(.q-slider__track) {
     border-radius: 0;
    }

  .detail-slider-line {
    display: flex;

  }

  .detail-slider-title {
    color: var(--q-gb-t-c-8);
  }

}

.detail-score-more {
  padding: 5px 28px;
  .score-more-title{
    margin-right: 10px;
    span{
      font-weight: 500;
      color: var(--q-gb-t-c-5);
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
      color: var(--q-gb-t-c-5);
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
        background-color: var(--q-gb-bg-c-1);
      }

      .dot-h-r {
        background-color: var(--q-gb-bg-c-13);
      }
    }

    .slider-main {
      width: 68%;
      display: flex;
      margin: 0 10px // flex-wrap: nowrap;
    }

  }
}</style>
