<!--
 * @Author: cooper
 * @Date: 2023-06-013 14:13:55
 * @Description: 篮球赛事分析页
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
          <span class="team-name" style="text-align: right">{{
            detail_info.man
          }}</span>
          <span class="team-point-r"></span>
        </div>
      </div>
      <div>
        <!-- 得分条 网球需在后面添加%  如有其他赛事自行添加 -->
        <div class="detail-slider" v-for="item in sliderList" :key="item.title">
          <div class="row justify-between" v-if="score_list[item.value_key]">
            <span>
              {{ score_list[item.value_key].home}}{{["5"].includes(String(detail_info.csid))?'%':''}}
            </span>
            <span class="detail-slider-title">{{ item.title() }}</span>
            <span>
              {{ score_list[item.value_key].away }}{{["5"].includes(String(detail_info.csid))?'%':''}}
            </span>
          </div>
          <div class="detail-slider-line" v-if="score_list[item.value_key]">
            <!-- score_list[item.value_key].percentage -->
            <q-slider
              readonly
              reverse
              :model-value="cale_score(score_list[item.value_key].home)"
              :min="0"
              :max="50"
              track-size="5px"
              color="amber-7"
              :thumb-size="0"
              style="margin-right: 6px"
            />
            <!-- score_list[item.value_key].away_percentage -->
            <q-slider
              readonly
              :model-value="cale_score(score_list[item.value_key].away)"
              :min="0"
              :max="50"
              track-size="5px"
              color="indigo-12"
              :thumb-size="0"
            />
          </div>
        </div>
        <!-- 犯规条 篮球赛事才有 -->
        <div class="detail-score-more" v-if="detail_info.csid == 2">
          <div class="row justify-center">
            <div class="score-more-title">
              <span>{{ score_list["S111"]["home"] + "%" }}</span>
              <span>{{ score_list["S110"]["home"] }}</span>
            </div>
            <div class="score-more-r-title">
              <span>{{ score_list["S110"]["away"] }}</span>
              <span>{{ score_list["S111"]["away"] + "%" }}</span>
            </div>
          </div>
          <div class="detail-slider-line">
            <div class="home-stop stop">
              <span
                class="dot"
                :class="{ 'dot-h': 5 - stop_obj.home >= item }"
                v-for="item in 5"
                :key="item"
              ></span>
            </div>
            <div class="slider-main">
              <q-slider
                readonly
                reverse
                :model-value="score_list['S111']['home']"
                :min="0"
                :max="100"
                track-size="5px"
                color="amber-7"
                :thumb-size="0"
                style="margin-right: 6px"
              />
              <q-slider
                readonly
                :model-value="score_list['S111']['away']"
                :min="0"
                :max="100"
                track-size="5px"
                color="indigo-12"
                :thumb-size="0"
              />
            </div>
            <div class="home-stop stop">
              <span
                class="dot"
                :class="{ 'dot-h-r': 5 - stop_obj.away >= item }"
                v-for="item in 5"
                :key="item"
              ></span>
            </div>
          </div>
          <div class="row justify-between" style="color: #8a8986">
            <span>{{ i18n_t("basketball.pause") }}</span>
            <span>{{ i18n_t("basketball.penalty") }}</span>
            <span>{{ i18n_t("basketball.pause") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
// import lodash from "lodash";
import { allBallObj } from "../compoments/venue-box/score_config";
const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
  score_list: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
});
let sliderList = ref([]);

const value = ref(50);
const standard = ref(15);

watch(
  () => props.detail_info.csid,
  (csid) => {
    sliderList.value = allBallObj[csid];
  },
  { immediate: true }
);

const tab = ref("mails");

const tabClick = (item) => {
  active.value = item.id;
};

// 找寻当前比赛的双方暂停次数
const dict = {
  13: {
    foul: "S10601",
    stop: "S10901",
  }, //第一节
  301: {
    foul: "S10602",
    stop: "S10902",
  }, //第一节结束
  14: {
    foul: "S10602",
    stop: "S10902",
  }, //第二节
  302: {
    foul: "S10603",
    stop: "S10903",
  }, //第二节结束
  15: {
    foul: "S10603",
    stop: "S10903",
  }, //第三节
  303: {
    foul: "S10604",
    stop: "S10904",
  }, //第三节结束
  16: {
    foul: "S10604",
    stop: "S10904",
  }, //第四节
  100: {
    foul: "S10604",
    stop: "S10904",
  }, //第四节结束
  32: {
    foul: "S10605",
    stop: "S10906",
  }, //等待加时
  40: {
    foul: "S10605",
    stop: "S10906",
  }, //加时赛
  110: {
    foul: "S10605",
    stop: "S10906",
  }, //加时赛结束
  1: {
    foul: "S10606",
    stop: "S109",
  }, //上半场
  2: {
    foul: "S10607",
    stop: "S109",
  }, //下半场
  31: {
    foul: "S10606",
    stop: "S109",
  }, //中场休息
};
const stop_obj = computed(() => {
  let { mmp } = props.detail_info;
  const stop_key = dict[mmp].stop;
  let obj = {
    home: props.score_list[stop_key]?.home,
    away: props.score_list[stop_key]?.away,
  };
  return obj;
});


const cale_score = function(value1){
  value1 =  Number(value1)
  if(value1 > 0){
    let percentage = value1 * 2
    if(percentage < 100){
      return percentage
    }else{
      return 100
    }
  }else{
    return 1
  }
}
</script>

<style lang="scss" scoped>
.detail-tab {
  // height: 272px;
  background: var(--q-gb-bg-c-4);
  padding-bottom: 15px;
  &:deep(.q-slider__track) {
    border-radius: 0;
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

  .detail-slider-line {
    display: flex;
  }

  .detail-slider-title {
    color: var(--q-gb-t-c-8);
  }
}

.detail-score-more {
  padding: 5px 28px;
  .score-more-title {
    margin-right: 10px;
    span {
      font-weight: 500;
      color: var(--q-gb-t-c-5);
      &:nth-child(1) {
        color: #ffac01;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
  .score-more-r-title {
    margin-left: 10px;
    span {
      font-weight: 500;
      color: var(--q-gb-t-c-5);
      &:nth-child(2) {
        color: #5881f7;
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
      margin: 0 10px; // flex-wrap: nowrap;
    }
  }
}
</style>
