<template>
  <!-- 赛事比分 -->
  <div class="score-more">
    <div v-show="false">{{ MatchListData.data_version.version }}</div>
    <!-- 棒球 -->
    <template v-if="match.csid == 3 && match_status">
      <!-- 上垒图标 icon-on_base0~3 -->
      <span class="icon-on_base1">
        <!-- 2垒 -->
        <span class="path1" :class="{ active: match.mbtlp == 1 }" />
        <!-- 1垒 -->
        <span class="path2" :class="{ active: match.mbolp == 1 }" />
        <!-- 3垒 -->
        <span class="path3" :class="{ active: match.mbthlp == 1 }" />
      </span>
      <!-- 出局 -->
      <div class="result">
        {{ i18n_t("common.out") }}
        <span class="yb-text-color1">{{ match.mbcn }}</span>
      </div>
    </template>
    <template v-else-if="is_show_score_content &&
      (lodash.get(score_list, '[0].length')) > 0 &&
      match_status
      ">
      <span class="scroll-arrow arrow-left" @click="scorll('left')" v-show="more_left_icon">
        <i aria-hidden="true" class="icon-arrow-left q-icon c-icon" style="color: #6d7278; font-size: 10px"></i>
      </span>
      <!-- 历史比分列表 -->
      <div class="stage-score" ref="stage_score">
        <span v-for="(score, index) in lodash.get(score_list, '[0]', [])" :key="index" class="item">{{ score.home }}-{{
          score.away }}</span>
      </div>
      <span class="scroll-arrow arrow-right" v-show="more_right_icon" @click="scorll('right')">
        <i aria-hidden="true" class="icon-arrow-right q-icon c-icon" style="color: #6d7278; font-size: 10px"></i>
      </span>
      <!-- 总局数|总分  篮球、冰球不显示 -->
      <div v-if="![2, 4].includes(+match.csid)" :class="['amount-score row', { 'min-width': match.csid == 7 }]">
        <div v-show="match.mfo">{{ match.mfo }}&nbsp;|&nbsp;</div>
        <div>
          <span>
            <!-- 网球(5)：总局数,其它：总分 -->
            <!-- // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
            {{
              match.csid == 5
              ? i18n_t("list.total_play_count")
              : [8, 9, 10].includes(match.csid * 1)
                ? i18n_t("list.total_pp_score_count2")
                : i18n_t("list.total_pp_score_count")
            }}&nbsp;
          </span>
          <span class="active-text">{{ score_list[1] }}</span>
        </div>
      </div>
    </template>
    <!-- 未开赛-回合数-棒球不需要 -->
    <template v-else-if="match.csid != 3">
      <span></span>
      <span class="mfo"> {{ match.mfo }}</span>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  match: {
    type: Object,
    default: () =>( { }),
  },
  // 是否显示比分内容
  is_show_score_content: {
    $type: Boolean,
    default: () => $true,
  }
})
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";
import { use_match_footer_score  } from '../match-footer-score'
const {
  score_list,
  scorll,
  more_left_icon,
  more_right_icon,
  stage_score,
  match_status,
} = use_match_footer_score(props)

</script>

<style lang="scss" scoped>
.score-more {
  position: relative;
  display: flex;
  justify-content: space-between;
  cursor: default;
  .scroll-arrow {
    position: absolute;
    $top: -1px;

    &.arrow-left {
      left: 4px;
    }

    &.arrow-right {
      right: 230px;
    }
  }

  .icon-arrow-right:before {
    color: #6d7278;
  }

  .active-text {
    color: var(--q-gb-t-c-2);
  }

  .stage-score {
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    padding: 0 5px;
    margin-right: 30px;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    cursor: default;
    &::-webkit-scrollbar {
      width: 0 !important;
    }

    .item {
      width: 50px;

      &:last-child {
        color: var(--q-gb-t-c-2);
      }
    }
  }

  .amount-score {
    flex-wrap: nowrap;
    color: var(--q-gb-t-c-8);

    &.min-width {
      min-width: 213px;
    }
  }

  .icon-on_base1 {
    font-size: 20px;
  }
}
</style>
