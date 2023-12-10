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
        {{ $t("common.out") }}
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
        <span v-for="(score, index) in lodash.get(score_list, '[0]', [])" :key="index" class="item">{{ score.home }}-{{
          score.away }}</span>
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
              ? $t("list.total_play_count")
              : [8, 9, 10].includes(match.csid * 1)
                ? $t("list.total_pp_score_count2")
                : $t("list.total_pp_score_count")
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
import { get_history_score_list } from 'src/core/match-list-pc/match-handle-data.js'
import { computed, onMounted, reactive, ref } from 'vue';
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { get_match_status } from 'src/output/index.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";
import lodash from 'lodash';
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  match: {
    type: Object,
    default: () => { },
  },
  // 是否显示比分内容
  is_show_score_content: {
    $type: Boolean,
    default: () => $true,
  }
})

let match_style_obj = MatchListCardDataClass.all_card_obj[props.match.mid + '_']
// 赛事模板宽度
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config

const more_right_icon = ref(false);
const more_left_icon = ref(false);
const stage_score = ref(null);
// 当前赛事状态
const match_status = computed(() => {
  const status = get_match_status(props.match.ms, [110]);
  return status;
});

const score_list = computed(() => {
  return get_history_score_list(props.match)
});
onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(() => {
    scorll("init");
  });
})

/**
 * 计算是否显示比分滚动箭头
 */
function compute_is_show_more() {
  if (!stage_score.value) return;
  let length = lodash.get(score_list, "[0].length", 0);
  if (length < 5) {
    more_right_icon.value = false;
    more_right_icon.value = false;
    return;
  }
  //比分总宽度
  let$totalWidth = length * 50,
    //已滚动的距离
    scrollLeft = lodash.get(stage_score.value, "scrollLeft", 0),
    //元素实际宽度
    clientWidth = lodash.get(stage_score.value, "clientWidth", 0);
  //总宽度大于实际宽度
  if (totalWidth > clientWidth) {
    more_right_icon.value = $true;
  }
  //已经移动距离
  if (scrollLeft > 0) {
    more_left_icon.value = $true;
    //未移动距离
  } else {
    more_left_icon.value = false;
  }
  //移动到底了
  if (totalWidth - 15 < scrollLeft + clientWidth) {
    more_right_icon.value = false;
  }
}
/**
 * 比分溢出时滚动方法
 */
function scorll(type) {
  let length = lodash.get(props.match, "score_list.length", 0);
  if (!stage_score.value || length < 5) return;
  let stageScore = stage_score.value;
  switch (type) {
    case "left":
      stageScore.scrollLeft -= 100;
      break;
    case "init":
      stageScore.scrollLeft = 2000;
      break;

    default:
      stageScore.scrollLeft += 100;
      break;
  }
  compute_is_show_more();
}


</script>

<style lang="scss" scoped>
.score-more {
  position: relative;
  display: flex;
  justify-content: space-between;
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
    display:flex;
    padding: 0 5px;
    margin-right: 30px;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .item {
      width: 50px;
      &:nth-child(2n) {
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
}</style>
