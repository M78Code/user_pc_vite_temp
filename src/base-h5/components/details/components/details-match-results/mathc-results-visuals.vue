<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 统计图形表
-->
<template>
  <div :class="['mathc_results_visuals', get_analyze_show?'analyze-show':'', ]">
    <div class="title" v-if="!get_analyze_show">{{ i18n_t('match_result.statistics') }}</div>
    <div class="designation">
      <span class="ellipsis">{{ statistics_table.mhn }}</span>
      <span class="ellipsis">{{ statistics_table.man }}</span>
    </div>
    <div class="visuals">
      <!-- 圆环图形 -->
      <div class="circle-part">
        <div class="circle" v-for="(item,index) in ring_statistics" :key="index">
          <template v-if="item.score_type == 'S111'">
            <span class="number">
              {{`${item.home}%`}}
            </span>
            <span class="text-span" :class="{'vi-top': UserCtr.lang == 'vi'}">{{ item.text }}</span>
            <q-knob
                readonly
                :model-value="item.away"
                :max="item.home + item.away"
                :size="get_analyze_show?'':'.56rem'"
                :thickness="0.3"
                color="orange"
                track-color="blue"
                :class="[(item.away == 0 && item.home == 0) && 'ring-zero-css', 'knob-shrink']"
            />
            <span class="number">
              {{`${item.away}%`}}
            </span>
          </template>
          <template v-else>
            <span class="number">
              {{`${item.proportion> 0 ? 100- item.proportion : '0'}%`}}
            </span>
            <span class="text-span" :class="{'vi-top': UserCtr.lang == 'vi'}">{{ item.text }}</span>
            <q-knob
                readonly
                :model-value="item.proportion"
                :size="get_analyze_show?'':'.56rem'"
                :thickness="0.3"
                color="orange"
                track-color="blue"
                :class="[(item.away == 0 && item.home == 0) && 'ring-zero-css', 'knob-shrink']"
            />
            <span class="number">
              {{`${item.proportion}%`}}
            </span>
          </template>
        </div>
      </div>
      <!--中间的图标模块-->
      <div class="yellow-red-card-corner">
        <div v-for="(item, index) in card_corner_list" :key="index">
          <span class="card-title">{{ item.text }}</span>
          <div class="score">
            <span>{{ item.home }}</span>
            <img :src="item.img" alt="">
            <span>{{ item.away }}</span>
          </div>
        </div>
      </div>
      <div class="linellae"></div>

      <!--横线条的 比例-->
      <div class="progress" v-for=" (progress_item, index) in progress_graph" :key="index">
        <div class="progress-text">
          {{ progress_item.text }}
        </div>
        <div class="progress-left">
          <span>{{ progress_item.home }}</span>
        </div>
        <q-linear-progress size="10px" :value="progress_item.home > 0 ? progress_item.proportion / 100 : 0" reverse class="progress-blue">
        </q-linear-progress>
        <q-linear-progress size="10px" :value="progress_item.proportion ? progress_item.proportion / 100 : progress_item.away > 0 ? 0 : 1" reverse class="progress-orange">
        </q-linear-progress>
        <div class="progress-right">
          <span>{{ progress_item.away }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import lodash from "lodash";
import { i18n_t } from "src/boot/i18n.js"
import { transform_score } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
 // 国际化比赛阶段比分转换工具
// import msc from "src/base-h5/mixins/common/msc.js";
import { onMounted, onUnmounted, ref, watch } from "vue";

  // mixins: [ msc ],
  const props = defineProps({
    // 圆环图形
    ring_statistics:{
      type:Array
    },
    // 中间的图标模块
    card_corner_list: {
      type: Array
    },
    // 中间的图标模块
    detail_data: {
      type: Object,
      default: {}
    },
    // 横线条的 比例
    progress_graph: {
      type: Array
    }
  })
  const get_analyze_show = ref(false)
  const statistics_table = ref({})
  const timer1_ = ref(null)

  onMounted(() => {
    get_list()
    
  })
  // watch: {
  //   'get_detail_data':{
  //     handler: 'get_list',
  //     immediate: true,
  //     deep: true
  //   }
  // },
  // computed: {
  //   ...mapGetters([
  //     // 赛事id
  //     'get_goto_detail_matchid',
  //     // 详情页的数据
  //     // 当前语言
  //     'get_analyze_show'
  //   ])
  // },
  const get_list = () => {
    console.log(props.detail_data,"card_corner_listcard_corner_listcard_corner_list");
    let cloneData = lodash.cloneDeep(props.detail_data);
    if(cloneData && cloneData.msc){
      transform_score(cloneData)
      statistics_table.value = cloneData
      // 环形比分图形表
      score_processing(props.ring_statistics, cloneData.msc)
      // 黄牌 红牌 角球
      score_processing(props.card_corner_list, cloneData.msc)
      // 进度条比分图形表
      score_processing(props.progress_graph, cloneData.msc)
    }
  }
  // msc 比分处理成 图形界面数据格式
  const score_processing = (data, msc) => {
    data.forEach( item => {
      for (let k in msc) {
        if ([k].includes(item.score_type) && (+msc[k].home + +msc[k].away != 0)) {
          item.home = +msc[k].home
          item.away = +msc[k].away
          if(["S8", "S105", "S1088", "S111"].includes(item.score_type)) {
            item.proportion = parseInt((item.away / (item.home + item.away)).toFixed(2) * 100)
          }else if(["S104", "S1101", "S18", "S17", "S19", "S107", "S110", "S108"].includes(item.score_type)){
            item.proportion = (item.home / (item.home + item.away)).toFixed(2) * 100
          }
        }
      }
    })
  }
  onUnmounted(() => {
    clearTimeout(timer1_.value)
    timer1_.value = null
  })
</script>

<style lang="scss" scoped>
.mathc_results_visuals {
    // 添加背景色，否则会镂空
    background-color: var(--q-gb-bg-c-23);
  padding-bottom: 0.31rem;
  border-bottom: 1px solid  var(--q-analysis-bd-color-3);
  .title {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.24rem;
    color: var(--q-analysis-text-color-20);
    border-bottom: 1px solid  var(--q-analysis-bd-color-3);
    background:  var(--q-analysis-text-color-17);
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: bold;
    position: relative;

    &:before {
      content: '';
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.14rem;
      background: var(--q-analysis-text-color-16);
      border-radius: 1.5px;
    }
  }

  .designation {
    height: 0.34rem;
    line-height: 0.34rem;
    padding-left: 0.15rem;
    color: var(--q-analysis-text-color-20);

    font-weight: bold;
    font-size: 0.12rem;
    display: flex;
    justify-content: space-between;
    padding-right: 0.15rem;

    span {
      position: relative;
      width: 50%;

      &:nth-child(1) {
        padding-left: 0.12rem;
        &:after {
          content: '';
          width: 0.06rem;
          height: 0.06rem;
          border-radius: 50%;
          position: absolute;
          left: 0.01rem;
          top: 0.14rem;
          background: var(--q-analysis-bg-color-17);
        }
      }

      &:nth-child(2) {
        padding-right: 0.12rem;
        text-align: right;

        &:after {
          content: '';
          width: 0.06rem;
          height: 0.06rem;
          border-radius: 50%;
          position: absolute;
          right: 0.01rem;
          top: 0.14rem;
          background: var(--q-analysis-text-color-16);
        }
      }
    }
  }

  .visuals {

    border-radius: 0.08rem;

    .circle-part {
      display: flex;
      margin-bottom: 0.3rem;

      .circle {
        margin-top: 0.35rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .number {
          color: var(--q-analysis-text-color-20);
          font-size: 0.12rem;

          letter-spacing: 0;
          margin: 0 0.04rem;
          text-align: right;
          line-height: 0.12rem;
        }
        .text-span {
            color: var(--q-analysis-text-color-5);
          }

        .knob-img {
          margin: 0 0.04rem;
        }

        :deep(.text-span) {

          font-size: 0.12rem;

          letter-spacing: 0;
          text-align: center;
          line-height: 0.12rem;
          position: absolute;
          top: -0.19rem;
          color: var(--q-analysis-text-color-5);
          &.vi-top {
            top: -0.28rem;
          }
        }
      }
    }

    .yellow-red-card-corner {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.18rem;

      > div {
        margin-right: 0.7rem;
        min-width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:last-child {
          margin-right: 0;
        }

        .card-title {
          color: var(--q-analysis-text-color-5);
          font-size: 0.12rem;

          letter-spacing: 0;
          text-align: center;
          line-height: 0.12rem;
          margin-bottom: 0.04rem;
        }

        .score {
          display: flex;
          align-items: center;
          color: var(--q-analysis-text-color-20);
          > span {
            &:nth-child(1) {
              margin-right: 0.13rem;
              color: var(--q-analysis-text-color-20);
            }

            &:last-child {
              margin-left: 0.13rem;
              color: var(--q-analysis-text-color-20);
            }
          }

          > img {
            width: 0.095rem;
            height: 0.112rem;
          }
        }
      }
    }

    .linellae {
      background:  var(--q-analysis-bd-color-3);
      height: 0.01rem;
      margin: 0 0.15rem 0.25rem;
    }

    .progress {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.3rem;
      position: relative;

      .progress-text {
        color: var(--q-analysis-text-color-5);
        font-size: 0.12rem;

        letter-spacing: 0;
        text-align: center;
        line-height: 0.1rem;
        position: absolute;
        top: -0.12rem;
      }

      img {
        width: 0.092rem;
        height: 0.112rem;
      }

      &:last-child {
        margin-bottom: unset;
      }

      .progress-left {
        display: flex;
        align-items: center;
        width: 0.2rem;
        justify-content: flex-end;

        span {
          color: var(--q-analysis-text-color-20);
          font-size: 0.12rem;

          text-align: center;
          line-height: 0.12rem;

          &:nth-child(1) {
            margin-right: 0.065rem;
          }

          &:last-child {
            margin-left: 0.15rem;
          }
        }
      }

      .q-linear-progress {
        width: 1.4rem;
        height: 0.04rem;
        border-radius: 3px;
        overflow: unset;
        margin: 0 0.02rem 0 0;

        &:last-child {
          margin-right: unset;
        }

        :deep(.q-linear-progress__track--light) {
          background: var(--q-analysis-text-color-16);

          &.q-linear-progress__track {
            opacity: 1;
          }
        }
      }

      .progress-right {
        display: flex;
        align-items: center;
        width: 0.2rem;
        color: var(--q-analysis-text-color-20);
        span {

          font-size: 0.12rem;

          text-align: center;
          line-height: 0.12rem;

          &:nth-child(1) {
            margin-right: 0.15rem;
          }

          &:last-child {
            margin-left: 0.065rem;
          }
        }
      }
    }
  }

  :deep(.text-orange) {
    color: var(--q-analysis-text-color-16) !important;
  }

  :deep(.text-blue) {
    color: var(--q-analysis-bg-color-17) !important;
  }

  :deep(.q-linear-progress) {
    color: var(--q-analysis-bg-color-17) !important;
    &.progress-blue {
      color: var(--q-analysis-bg-color-17);
        .q-linear-progress__track--light {
          background: var(--q-analysis-text-color-18) !important;
        }
      }
    &.progress-orange {
      color: var(--q-analysis-text-color-16) !important;
      .q-linear-progress__model {
          background: var(--q-analysis-text-color-18) !important;
        }
    }
  }
  :deep(.ring-zero-css) {
      .text-orange,
      .text-blue {
        color:  var(--q-analysis-text-color-18) !important;
      }
    }
  &.analyze-show {
    border: none;
    background: var(--q-color-com-bg-color-5);
    opacity: 0.6;
    width: 3.67rem;
    height: 2.66rem;
    .designation {
      border-bottom: 1px solid rgba(225,225,225, 0.2);
      margin-bottom: 0.02rem;
      color: var(--q-gb-t-c-18);
    }
    .visuals {
      .linellae {
        background: rgba(242, 243, 247, 0.2);
      }
      .circle-part {
        margin-bottom: 0rem;
        .circle {
          margin-top: 0.15rem;
          .number {
            color: var(--q-gb-t-c-18);
          }
          .text-span {
            font-size: 0.1rem;
            top: -0.1rem;
          }
          .knob-shrink {
            transform: scale(0.8);
          }
        }
      }
      .progress {
        margin-bottom: .15rem;
        .progress-text {
          font-size: 0.1rem
        }
        .progress-left {
          span {
            color: var(--q-gb-t-c-18);
          }
        }
        .progress-right {
          span {
            color: var(--q-gb-t-c-18);
          }
        }
      }
      .yellow-red-card-corner {
        margin-bottom: .05rem;
        >div{
          margin-right: 0;
          .card-title {
            font-size: 0.1rem;
          }
          .score {
            color: var(--q-gb-t-c-18);
          }
        }
        div:nth-child(2) {
          margin: 0 0.1rem
        }
      }
      .linellae {
        margin: 0 .15rem .15rem;
      }
    }
  }
}
</style>