<template>
  <div class="match-details">
    <div class="mathc_results_visuals">
      <template v-if="active_tab.id == '1'">
        <template v-if="match_detail && match_detail.msc && match_detail.msc.length > 0">
          <div v-if="match_detail.csid == 1">
            <div class="designation">
              <span class="ellipsis">{{ match_detail.mhn }}</span>
              <span class="ellipsis">{{ match_detail.man }}</span>
            </div>
            <div class="row">
              <div class="visuals col" v-for="item in statsList" :key="item">
                <div class="circle-part" v-if="detail_info[item.value_key]">
                  <div class="circle-title">
                    <div class="text-span">{{ item.value }}</div>
                  </div>
                  <div class="circle">
                    <span class="number">{{ detail_info[item.value_key]['home'] }} </span>
                    <q-knob
                      readonly
                      v-model="detail_info[item.value_key].percentage"
                      size="50px"
                      :thickness="0.4"
                      color="amber-7"
                      :track-color="detail_info[item.value_key].percentage==0?'grey-5':'indigo-12'"
                      class="q-ma-md"
                    />
                    <span class="number">{{ detail_info[item.value_key]['away'] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 篮球比赛分析图 -->
          <div v-if="match_detail.csid == 2">
            <basket_ball_stats :detail_info="match_detail" :score_list="detail_info" />
          </div>
          <div v-else>
            <!-- <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/no_data.png`" alt="">
            <div class="no-data-text">No Data</div> -->
          </div>

          <div class="progress" v-for="item in sliderList" :key="item">
            <div v-if="detail_info[item.value_key]">
              <div class="progress-title">
                <span>{{ detail_info[item.value_key]['home'] }}</span>
                <span>{{ item.title }}</span>
                <span>{{ detail_info[item.value_key]['away'] }}</span>
              </div>
              <div class="progress-content">
                <div class="progress">
                  
                  <div class="progressbar">
                    <q-slider readonly reverse v-model="detail_info[item.value_key]['percentage']" :min="0" :max="50" track-size="5px" color="amber-7" thumb-size="'0'" style="margin-right:6px"/>
                    <q-slider readonly   v-model="detail_info[item.value_key]['away_percentage']" :min="0" :max="50" track-size="5px" color="indigo-12" :thumb-size="'0'" />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
            <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/no-data.png`" alt="">
            <div class="no-data-text">{{ i18n_t("common.no_data") }}</div>
        </template>
      </template>
      <template v-else>
        <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/coming_soon.png`"  alt="">
        <div class="no-data-text">{{ i18n_t("ouzhou.no_data.coming_soon") }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import basket_ball_stats from './basketball_stats.vue'
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

const props = defineProps({
  match_odds_info: {
    type: Array,
    default: () => [],
  },
  match_detail: {
    type: Object,
    default: () => {},
  },
  active_tab: {
    type: Object,
    default: () => {},
  }
});
const xx = ref(10)
const sliderList = ref([
{
    title: i18n_t('ouzhou.detail.shots_on_goal'),
    lValue: 20,
    rValue: 40,
    value:15,
    value_key:'S18'
  },
  {
    title: i18n_t('ouzhou.detail.shot_wide_goal'),
    lValue: 11,
    rValue: 25,
    value:26,
    value_key:'S17'
  },
])
const statsList = ref([
  {
    value: i18n_t('ouzhou.detail.assault'),
    lValue: 20,
    rValue: 40,
    percentage: (40 / (20 + 40)) * 100,
    value_key:'S104'
  },
  {
    value: i18n_t('match_result.dangerous_offense'),
    lValue: 30,
    rValue: 40,
    percentage: (40 / (30 + 40)) * 100,
    value_key:'S8'
  },
  {
    value: i18n_t('ouzhou.detail.possession_ball'),
    lValue: 50,
    rValue: 40,
    percentage: (40 / (40 + 40)) * 100,
    value_key:'S105'
  },
]);
const emit = defineEmits(["change"]);
const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = [5].includes(item.hpt) ? item.title.length + 1 : item.title.length;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};
const detail_info = computed(()=>{
  const obj = props.match_detail;
  let result = {}
  if (obj.msc&&obj.msc.length>0 ) {
    for (const item of obj.msc) {
      const list = item?.split('|')
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
const active = ref(1);
onMounted(() => {});
setTimeout(() => {
  // console.log("detail match_detail", props.match_detail);
  // console.log("detail detail_info", detail_info);
  // console.log("active_tab", props.active_tab);
}, 100);
</script>

<style lang="scss" scoped>
.match-details {
  padding-bottom: 0.1rem;
  .mathc_results_visuals {
    .no-data {
      width: 140px;
      height: 140px;
      margin-left: 50%;
      margin-top: 30%;
      transform: translate(-70px);
    }
    .no-data-text {
      text-align: center;
      color: #A1A3A5;
      font-size: 16px;
    }
    .designation {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      color: #414655;
      position: relative;
      padding: 20px 15px 0 15px;
      span:nth-child(1) {
        &:after {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          position: absolute;
          background: #006eff;
          top: 26px;
          right: 5px;
        }
      }
      span:nth-child(2) {
        &:after {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          position: absolute;
          background: #ffb001;
          top: 26px;
          left: 5px;
        }
      }
    }
    .visuals {
      position: relative;
      padding-top: 20px;
      .circle-part {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text-span {
          color: var(--q-gb-t-c-3);
        }
        .circle {
          .number {
            font-weight: bold;
            color: var(--q-gb-t-c-4);
          }
        }
      }
    }
    .progress {
      padding-top: 20px;
      .progress-title {
        text-align: center;
        color: var(--q-gb-t-c-3);
        display: flex;
        padding: 0 20px;
        justify-content: space-between;
      }
      .progress-content {
        display: flex;
        justify-content: space-between;
        .progress {
          width: 100%;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          .progressbar {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }
      }
    }
  }
  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>