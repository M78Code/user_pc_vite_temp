<!--
 * @Author:
 * @Date:
 * @Description: 详情页足球赛事分析赔率页面
-->
<template>
  <div class="analysis-odds">
    <div class="heade-wrapper">
      <div class="heade">
        <span
          v-for="(item, i) in tab_list"
          :key="i"
          :class="{ 'is-active': tabIndex == i }"
          @click="radio_button(i)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="content" :class="tabIndex == 1 && 'ouzhi'">
      <div class="tittle">
        <p class="sub_tiele">{{ tab_list[tabIndex].name }}</p>
        <section v-if="tabIndex != 1" class="tabs_title row items-center">
          <p class="s1">{{ i18n_t("analysis_football_matches.company") }}</p>
          <p class="s2">
            {{
              tabIndex == 2
                ? i18n_t("analysis_football_matches.big")
                : i18n_t("analysis_football_matches.Main_win")
            }}
          </p>
          <p class="s3">{{ i18n_t("analysis_football_matches.handicap") }}</p>
          <p class="s4">
            {{
              tabIndex == 2
                ? i18n_t("analysis_football_matches.small")
                : i18n_t("analysis_football_matches.away_win")
            }}
          </p>
        </section>
        <section class="tabs_title row items-center" v-else>
          <!-- <div class="row items-center justify-between"> -->
          <!-- <div class="ellipsis">
              {{ i18n_t("analysis_football_matches.company") }}
            </div> -->
          <!-- <div class="yb_ml6" style="visibility: hidden">
              <p>
                {{
                  i18n_t("analysis_football_matches.Initial_slidin0.08offer")
                }}
              </p>
              <p>1</p>
            </div> -->
          <!-- </div> -->
          <div class="ellipsis bookName">
            {{ i18n_t("analysis_football_matches.company") }}
          </div>
          <p class="t2">{{ i18n_t("analysis_football_matches.home_win1") }}</p>
          <p class="t3">{{ i18n_t("analysis_football_matches.flat") }}</p>
          <p class="t4">{{ i18n_t("analysis_football_matches.away_win") }}</p>
          <p class="t4">
            {{ i18n_t("analysis_football_matches.Main_win_rate") }}
          </p>
          <p class="t4">
            {{ i18n_t("analysis_football_matches.Customer_win_rate") }}
          </p>
          <p class="t4">
            {{ i18n_t("analysis_football_matches.Return_rate") }}
          </p>
        </section>
      </div>
      <div class="sliding" v-if="data_list.length">
        <div
          class="detail row items-center"
          v-for="(item, index) in data_list"
          :class="tabIndex != 1 ? 'other_tabs' : 'win_tabs'"
          :key="index"
        >
          <div class="tbale_one row items-center">
            <div class="ellipsis bookName">{{ item.bookName }}</div>
            <div class="yb_ml6">
              <p>{{ i18n_t("analysis_football_matches.Initial_offer") }}</p>
              <p>{{ i18n_t("analysis_football_matches.immediate") }}</p>
            </div>
          </div>

          <div class="t2 column justify-center set_width">
            <p>{{ item.handicapOddsDTOList[0].value0 }}</p>
            <p
              :class="{
                red: item.handicapOddsDTOList[1].directions.value0 == 1,
                green: item.handicapOddsDTOList[1].directions.value0 == -1,
              }"
            >
              {{ item.handicapOddsDTOList[1].value0 }}
              <i class="odd yb_ml4"></i>
            </p>
          </div>

          <div class="t3 column justify-center set_width">
            <p>{{ item.handicapOddsDTOList[0].handicapVal }}</p>
            <p
              :class="{
                red: item.handicapOddsDTOList[1].directions.handicapVal == 1,
                green: item.handicapOddsDTOList[1].directions.handicapVal == -1,
              }"
            >
              {{ item.handicapOddsDTOList[1].handicapVal }}
              <i class="odd yb_ml4"></i>
            </p>
          </div>

          <div class="t4 column justify-center set_width">
            <p>{{ item.handicapOddsDTOList[0].value }}</p>
            <p
              :class="{
                red: item.handicapOddsDTOList[1].directions.value == 1,
                green: item.handicapOddsDTOList[1].directions.value == -1,
              }"
            >
              {{ item.handicapOddsDTOList[1].value }}
              <i class="odd yb_ml4"></i>
            </p>
          </div>
          <template v-if="tabIndex == 1">
            <div class="t4 column justify-center set_width">
              <p>{{ item.handicapOddsDTOList[0].value0WinRate }}%</p>
              <p
                :class="{
                  red:
                    item.handicapOddsDTOList[1].directions.value0WinRate == 1,
                  green:
                    item.handicapOddsDTOList[1].directions.value0WinRate == -1,
                }"
              >
                {{ item.handicapOddsDTOList[1].value0WinRate }}%
              </p>
            </div>
            <div class="t4 column justify-center set_width">
              <p>{{ item.handicapOddsDTOList[0].valueWinRate }}%</p>
              <p
                :class="{
                  red: item.handicapOddsDTOList[1].directions.valueWinRate == 1,
                  green:
                    item.handicapOddsDTOList[1].directions.valueWinRate == -1,
                }"
              >
                {{ item.handicapOddsDTOList[1].valueWinRate }}%
              </p>
            </div>
            <div class="t4 column justify-center set_width">
              <p>{{ item.handicapOddsDTOList[0].returnRate }}%</p>
              <p
                :class="{
                  red: item.handicapOddsDTOList[1].directions.returnRate == 1,
                  green:
                    item.handicapOddsDTOList[1].directions.returnRate == -1,
                }"
              >
                {{ item.handicapOddsDTOList[1].returnRate }}%
              </p>
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="!data_list.length && is_done"
        class="yb_py18 text-center no-list"
      >
        {{ i18n_t("common.no_data") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineComponent,
  ref,
  nextTick,
  onUnmounted,
  onMounted,
  computed,
} from "vue";
import { api_analysis } from "src/api/index.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { useRoute } from "vue-router";
import { i18n_t } from "src/boot/i18n.js";
const get_detail_data = ref({
  csid: "1",
  mid: "1",
});

//路由
const route = useRoute();

// TODO: 后续修改调整
// import { mapGetters } from "vuex";
// 国际化后续修改调整
const tab_list = ref([
  { name: i18n_t("footer_menu.rangqiu") },
  { name: i18n_t("footer_menu.win_alone") },
  { name: i18n_t("analysis_football_matches.size") },
]);
const tabIndex = ref(0);
//详细赔率数据
const data_list = ref([]);
//数据加载完成
const is_done = ref(false);
onMounted(() => {
  // 添加监听 赛事分析刷新事件 TODO: 后续修改调整 $root emit
  useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis);
  get_list();
});

/**
 *@description 按钮切换
 *@param {Undefined}
 *@return {Undefined} undefined
 */
const radio_button = (index) => {
  if (tabIndex.value == index) return;
  tabIndex.value = index;
  data_list.value = [];
  get_list();
};
const get_list = async () => {
  try {
    is_done.value = false;
    let parameter = {
      standardMatchId: match_id.value,
      parentMenuId: 5, //父菜单类型:(2数据;3阵容4情报;5赔率)
      sonMenuId: tabIndex.value + 1,
    };
    let result = await api_analysis.get_match_analysise_data(parameter);
    let res = {};
    if (result.status) {
      res = result.data;
    } else {
      res = result;
    }
    let { code, data } = res;
    if (code == 200 && data && data.sThirdMatchHistoryOddsDTOList.length) {
      data_list.value = data.sThirdMatchHistoryOddsDTOList;
    }
    is_done.value = true;
  } catch (error) {
    console.error(error);
  }
};
// 刷新 当前赛事分析信息
const refresh_match_analysis = () => {
  const new_tabIndex = tabIndex.value;
  tabIndex.value = -1;

  nextTick(() => {
    radio_button(new_tabIndex);
  });
};

const search_list_high = computed(() => {
  let rem_1 = (window.innerWidth * 100) / 375;
  return { height: window.innerHeight - rem_1 - 90 + "px" };
});
// 赛事id
const match_id = computed(() => {
  // get_detail_data.mid  后续修改调整
  return route.params.mid || get_detail_data.value.mid;
});
onUnmounted(() => {
  // 移除监听 赛事分析刷新事件 TODO: $root emit 后续修改调整
  useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis).off;
  // 国际化后续修改调整
  tab_list.value = ref([
    { name: i18n_t("footer_menu.rangqiu") },
    { name: i18n_t("analysis_football_matches.European_Finger") },
    { name: i18n_t("analysis_football_matches.size") },
  ]);
  tabIndex.value = 0;
  //详细赔率数据
  data_list.value = [];
  //数据加载完成
  is_done.value = false;
});
// computed: {
//  TODO: 后续修改调整
//   ...mapGetters(['get_goto_detail_matchid', 'get_detail_data']),
// },
</script>

<style lang="scss" scoped>
.analysis-odds {
  background: var(--q-analysis-text-color-19);
  height: calc(100% - 0.5rem);

  .heade-wrapper {
    width: 100%;
    height: auto;
    margin: 0 auto;
    // background: var(--q-gb-bg-c-18);
    position: sticky;
    top: 1.21rem;
    padding: 0.15rem 0.48rem;
    z-index: 100;
    background: var(--q-analysis-text-color-19);

    .heade {
      position: relative;
      background: var(--q-gb-bg-c-18);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.08rem;
      padding: 0.01rem;

      &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid var(--q-analysis-bd-color-18);
        border-radius: 0.16rem;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }

      > span {
        height: 0.3rem;
        line-height: 0.3rem;
        flex: 1;
        letter-spacing: 0;
        text-align: center;
        font-size: 0.14rem;
        border-radius: 0.08rem;
        // background: var(--q-analysis-bg-color-1);
        color: var(--q-analysis-text-color-34);
        &:nth-child(2) {
          position: relative;

          // &:before {
          //   content: '';
          //   width: 0.01rem;
          //   height: 0.14rem;
          //   position: absolute;
          //   left: 0;
          //   top: 0.08rem;
          //   background: var(--q-analysis-bg-color-18);
          // }

          // &:after {
          //   content: '';
          //   width: 0.01rem;
          //   height: 0.14rem;
          //   position: absolute;
          //   right: 0;
          //   top: 0.08rem;
          //   background: var(--q-analysis-bg-color-18);
          // }
        }

        &.is-active {
          height: 0.29rem;
          background: var(--q-gb-bg-c-28);
          color: var(--q-analysis-text-color-20);
          &:nth-child(2) {
            &:before,
            &:after {
              display: none;
            }
          }

          border-radius: 0.08rem;
        }
      }
    }
  }

  .content {
    color: var(--q-analysis-text-color-20);
    margin: 5px 8px;
    border-radius: 8px;
    background: var(--q-gb-bg-c-28);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
    //让球
    .tittle {
      position: sticky;
      top: 1.81rem;
      z-index: 80;
      background: var(--q-gb-bg-c-23);
      .sub_tiele {
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 20px; /* 142.857% */
        width: 100%;
        height: 0.32rem;
        -background: var(--q-gb-bg-c-28);
        padding: 0.06rem 0.08rem;
        font-size: 0.14rem;
        color: var(--q-gb-t-c-18);
        border-bottom: 0.5px solid var(--q-gb-bd-c-6);
           &:before {
            content: '';
            width: 0.03rem;
            height: 0.14rem;
            position: absolute;
            left: 0rem;
            top: 0.07rem;
            background: var(--q-gb-t-c-1);
            border-radius: 1.5px;
    }
      }
      .tabs_title {
        -color: #949ab6;
        color: var(--q-analysis-text-color-34);
        margin: 0 0.08rem;
        height: 0.24rem;
        line-height: 0.24rem;
        border-bottom: 0.5px solid var(--q-gb-bd-c-6);
        .s1,
        .s2,
        .s3,
        .s4 {
          width: calc(100%/4);
          text-align: center;
        }
        p {
          width: calc(calc(100% - 0.92rem) / 6);
          text-align: center;
        }
        .bookName {
          min-width: 0.92rem;
          text-align: center;
        }
      }
    }
  }
  .detail {
    border-bottom: 0.5px solid var(--q-gb-bd-c-6);
    &:last-child{
      border-bottom:none;
    }
    .tbale_one {
      .bookName {
        width: 0.56rem;
        height: 0.72rem;
        line-height: 0.72rem;
        text-align: center;
        border-right: 0.5px solid var(--q-gb-bd-c-6);
      }
      .yb_ml6 {
        margin-left: 0;
        p {
          width: 0.36rem;
          height: 0.32rem;
          line-height: 0.36rem;
          text-align: center;
        }
        :nth-child(1) {
          border-bottom: 0.5px solid var(--q-gb-bd-c-6);
        }
      }
    }
    //大小
    .t2,
    .t3,
    .t4 {
      p {
        height: 0.32rem;
        line-height: 0.36rem;
      }
    }
    .t4 {
      span {
        display: inline-block;
        height: 0.32rem;
        line-height: 0.36rem;
      }
    }
  }
  .odd {
    display: inline-block;
    width: 0.06rem;
    height: 0.08rem;
    margin-left: 0;
  }

  .red {
    color: var(--q-analysis-text-color-33);
    i {
      background-color: var(--q-analysis-text-color-33);
      -webkit-clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
      clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
    }
  }

  .green {
    color: var(--q-analysis-text-color-7);
    i {
      background-color: var(--q-analysis-text-color-7);
      -webkit-clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
      clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
    }
  }
  .no-list {
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    padding-top: 0.05rem !important;
    font-size: 12px;
    color: var(--q-analysis-text-color-14);
  }
}

.sliding {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0.08rem;
}
.win_tabs {
  .set_width {
    width: calc(calc(100% - 0.92rem) / 6);
    text-align: center;
    :nth-child(1) {
      border-bottom: 0.5px solid var(--q-gb-bd-c-6);
    }
  }
}
.other_tabs {
  .set_width {
    width: calc(calc(100% - 0.92rem) / 3);
    text-align: center;
    :nth-child(1) {
      border-bottom: 0.5px solid var(--q-gb-bd-c-6);
    }
  }
}
</style>
