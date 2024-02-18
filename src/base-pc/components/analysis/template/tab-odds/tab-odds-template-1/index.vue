<template>
  <div class="odds q-pb-md">
    <div class="tab">
      <!-- 让球 -->
      <span :class="{ active: tabIndex == 1 }" @click="tabClick(1)">{{
        i18n_t("analysis.rangqiu")
      }}</span>
      <!-- 欧指 -->
      <span :class="{ active: tabIndex == 2 }" @click="tabClick(2)">{{
        i18n_t("analysis.European_Finger")
      }}</span>
      <!-- 大小 -->
      <span :class="{ active: tabIndex == 3 }" @click="tabClick(3)">{{
        i18n_t("analysis.size")
      }}</span>
    </div>

    <div class="panel">
      <!-- 大小  胜平负  让球 -->
      <div class="panel-title">
        {{
          tabIndex == 3
            ? i18n_t("analysis.size")
            : tabIndex == 2
            ? i18n_t("analysis.odds_title")
            : i18n_t("analysis.rangqiu")
        }}
      </div>
      <div class="d-header d-tr relative-position">
        <template v-if="tabIndex == 1">
          <!-- 公司 -->
          <div class="d-td">{{ i18n_t("analysis.company") }}</div>
          <!-- 主胜 -->
          <div class="d-td">{{ i18n_t("analysis.Main_win") }}</div>
          <!-- 盘口 -->
          <div class="d-td">{{ i18n_t("analysis.handicap") }}</div>
          <!-- 客胜 -->
          <div class="d-td">{{ i18n_t("analysis.away_win") }}</div>
        </template>
        <template v-if="tabIndex == 2">
          <!-- 公司 -->
          <div class="d-td">{{ i18n_t("analysis.company") }}</div>
          <!-- 主胜 -->
          <div class="d-td">{{ i18n_t("analysis.Main_win") }}</div>
          <!-- 平 -->
          <div class="d-td">{{ i18n_t("analysis.flat") }}</div>
          <!-- 客胜 -->
          <div class="d-td">{{ i18n_t("analysis.away_win") }}</div>
          <!-- 主胜率 -->
          <div class="d-td">{{ i18n_t("analysis.Main_win_rate") }}</div>
          <!-- 客胜率 -->
          <div class="d-td">{{ i18n_t("analysis.Customer_win_rate") }}</div>
          <!-- 返还率 -->
          <div class="d-td">{{ i18n_t("analysis.Return_rate") }}</div>
        </template>
        <template v-if="tabIndex == 3">
          <!-- 公司 -->
          <div class="d-td">{{ i18n_t("analysis.company") }}</div>
          <!-- 大 -->
          <div class="d-td">{{ i18n_t("analysis.big") }}</div>
          <!-- 盘口 -->
          <div class="d-td">{{ i18n_t("analysis.handicap") }}</div>
          <!-- 小 -->
          <div class="d-td">{{ i18n_t("analysis.small") }}</div>
        </template>
      </div>

      <div class="d-body d-tr" v-for="(item, index) in odds_data" :key="index">
        <div class="company">{{ item.bookName }}</div>

        <div class="content">
          <div class="handicap-before">
            <!-- 初盘 -->
            <span class="d-td timer">{{ i18n_t("analysis.Initial_offer") }}</span>
            <span class="d-td">{{
              lodash.get(item, "handicapOddsDTOList[0].value0")
            }}</span>
            <span class="d-td">{{
              lodash.get(item, "handicapOddsDTOList[0].handicapVal")
            }}</span>
            <span class="d-td">{{
              lodash.get(item, "handicapOddsDTOList[0].value")
            }}</span>
            <template v-if="tabIndex == 2">
              <span class="d-td"
                >{{
                  lodash.get(item, "handicapOddsDTOList[0].value0WinRate")
                }}%</span
              >
              <span class="d-td"
                >{{
                  lodash.get(item, "handicapOddsDTOList[0].valueWinRate")
                }}%</span
              >
              <span class="d-td"
                >{{
                  lodash.get(item, "handicapOddsDTOList[0].returnRate")
                }}%</span
              >
            </template>
          </div>
          <div class="handicap-now">
            <!-- 即时 -->
            <p class="d-td timer">{{ i18n_t("analysis.immediate") }}</p>
            <p class="d-td" :class="stateClass(item, 'value0')">
              <span>{{
                lodash.get(item, "handicapOddsDTOList[1].value0")
              }}</span>
            </p>
            <p class="d-td" :class="stateClass(item, 'handicapVal')">
              <span>{{
                lodash.get(item, "handicapOddsDTOList[1].handicapVal")
              }}</span>
            </p>
            <p class="d-td" :class="stateClass(item, 'value')">
              <span>{{
                lodash.get(item, "handicapOddsDTOList[1].value")
              }}</span>
            </p>
            <template v-if="tabIndex == 2">
              <p class="d-td" :class="stateClass(item, 'value0WinRate')">
                <span
                  >{{
                    lodash.get(item, "handicapOddsDTOList[1].value0WinRate")
                  }}%</span
                >
              </p>
              <p class="d-td" :class="stateClass(item, 'valueWinRate')">
                <span
                  >{{
                    lodash.get(item, "handicapOddsDTOList[1].valueWinRate")
                  }}%</span
                >
              </p>
              <p class="d-td" :class="stateClass(item, 'returnRate')">
                <span
                  >{{
                    lodash.get(item, "handicapOddsDTOList[1].returnRate")
                  }}%</span
                >
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import analysisData  from 'src/public/mixins/analysis/analysis'

import { ref, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useRegistPropsHelper } from "src/composables/regist-props/index.js";
import { component_symbol, need_register_props } from "../config/index.js";
import { api_analysis } from "src/api/index";
import lodash from "lodash";

useRegistPropsHelper(component_symbol, need_register_props);

const props = defineProps(["match"]);
const tabIndex = ref(1);
const odds_data = ref({});

// 拉取数据
getData();

function tabClick(index) {
  tabIndex.value = index;
  getData();
}

/**
 * @description: 赔率tab
 */
function getData() {
  let params = {
    parentMenuId: 5,
    sonMenuId: tabIndex.value,
    standardMatchId: props.match.mid,
  };
  api_analysis.get_match_analysise_data(params).then((res) => {
    // get_analysiseData(params, (res) => {
    res = res.data;
    if (
      res.sThirdMatchHistoryOddsDTOList &&
      res.sThirdMatchHistoryOddsDTOList.length
    ) {
      odds_data.value = res.sThirdMatchHistoryOddsDTOList;
    }
  });
}

/**
 * @description: 添加红升绿降样式
 */
function stateClass(data, type) {
  if (data.handicapOddsDTOList[0][type] > data.handicapOddsDTOList[1][type]) {
    return "down";
  } else if (
    data.handicapOddsDTOList[0][type] < data.handicapOddsDTOList[1][type]
  ) {
    return "up";
  }
}

onUnmounted(() => {
  odds_data.value = null;
});
</script>

<style lang="scss" scoped>
.odds {
  min-width: 950px;

  .tab {
    display: flex;
    align-items: center;
    height: 30px;
    color: var(--q-analysis-color-3);
    margin-bottom: 10px;
    width: 300px;
    border-radius: 8px;
    overflow: hidden;

    span {
      width: 100px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      text-align: center;
      border: 1px solid var(--q-analysis-color-10);

      &:last-child {
        border-left: none;
        border-radius: 0 8px 8px 0;
      }

      &:nth-child(2) {
        border-left: none;
      }

      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &:not(:last-child) {
        border-right: none;
      }

      &.active {
        background-image: var(--q-analysis-bg-gradient-2);
        color: var(--q-analysis-color-13);
      }
    }
  }

  .d-tr {
    display: flex;
    align-items: center;
  }

  .d-header {
    height: 28px;
    background: var(-q-analysis-color-17);

    .d-td {
      flex: 1;
      text-align: center;
      color: var(--q-analysis-color-12);

      &:first-child {
        flex: unset;
        width: 160px;
        margin-right: 80px;
      }
    }
  }

  .d-body {
    border-bottom: 1px solid var(--q-analysis-color-10);

    &:last-child {
      border-bottom: 1px solid var(--q-analysis-color-10);
      border-radius: 0 0 8px 8px;
    }

    .company {
      height: 80px;
      width: 160px;
      border-right: 1px solid var(--q-analysis-color-10);
      display: flex;
      align-items: center;
      padding-left: 30px;
    }

    .content {
      flex: 1;

      .handicap-before,
      .handicap-now {
        display: flex;

        .d-td {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          border-right: 1px solid var(--q-analysis-color-10);
          flex: 1;
          position: relative;
          margin-bottom: 0;

          &:last-child {
            border-right: transparent;
          }
        }
      }

      .handicap-now {
        border-bottom: 0 !important;

        .up {
          background: rgba(233, 61, 61, 0.05);

          span {
            position: relative;

            &::after {
              position: absolute;
              top: 3px;
              right: -7px;
              display: block;
              content: "";
              width: 6px;
              height: 10px;
              background-image: url($SCSSPROJECTPATH + "/image/common/svg/red_up.svg");
              background: no-repeat center;
            }
          }
        }

        .down {
          background: rgba(80, 192, 66, 0.05);

          span {
            position: relative;

            &::after {
              position: absolute;
              top: 3px;
              right: -7px;
              display: block;
              content: "";
              width: 6px;
              height: 10px;
              background: url($SCSSPROJECTPATH+"/image/common/svg/green_down.svg")
                no-repeat center;
            }
          }
        }
      }

      .handicap-before {
        border-bottom: 1px solid var(--q-analysis-color-10);
      }

      .timer {
        width: 80px;
        flex: unset !important;
      }
    }
  }
}
</style>
