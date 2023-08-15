<template>
  <!-- 赛事比分 -->
  <div :class="['score-more', { 'items-center': match.tpl_id == 17 }]" :style="`width:${score_wrap_width}px`">
    <!-- 棒球 -->
    <template v-if="match.tpl_id == 17 && match_status">
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
        {{ i18n.t("common.out") }}
        <span class="yb-text-color1">{{ match.mbcn }}</span>
      </div>
    </template>
    <template v-else-if="is_show_score_content &&
      lodash.get(match, 'score_list.length', 0) > 0 &&
      match_status
      ">
      <span class="scroll-arrow arrow-left" @click="scorll('left')" v-show="more_left_icon">
        <i aria-hidden="true" class="icon-arrow-left q-icon c-icon" style="color: #6d7278; font-size: 10px"></i>
      </span>
      <!-- 历史比分列表 -->
      <div class="stage-score" ref="stage_score">
        <span v-for="(score, index) in lodash.get(match, 'score_list', [])" :key="index" class="item">{{ score.home }}-{{
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
              ? i18n.t("list.total_play_count")
              : [8, 9, 10].includes(match.csid * 1)
                ? i18n.t("list.total_pp_score_count2")
                : i18n.t("list.total_pp_score_count")
            }}
          </span>
          <span class="active-text">{{ match.total_score_str }}</span>
        </div>
      </div>
    </template>
    <!-- 未开赛-回合数-棒球不需要 -->
    <div class="mfo" v-else-if="match.csid != 3">
      {{ match.mfo }}
    </div>
  </div>
</template>

<script>

import { computed, defineProps, onMounted, reactive, ref, watch } from 'vue';
import { i18n } from 'src/boot/i18n.js'
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import store from 'src/store-redux/index.js'
import { get_match_status } from 'src/core/utils/index.js'
import lodash from 'lodash';
let state = store.getState();
const props = defineProps({ ...useProps });
const more_right_icon = ref(false);
const more_left_icon = ref(false);
const stage_score = ref(null);
// 页面布局大小信息
const vx_get_layout_size = reactive(state.layoutReducer.layout_size);
// 当前赛事状态
const match_status = computed(() => {
  get_match_status(props.match.ms, [110]);
})

onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(() => {
    scorll("init");
  });
})

watch(vx_get_layout_size.center_width, () => {
  compute_is_show_more();
})

/**
 * 计算是否显示比分滚动箭头
 */
const compute_is_show_more = () => {
  if (!stage_score.value) return;
  let length = lodash.get(this.match, "score_list.length", 0);
  if (length < 5) {
    more_right_icon.value = false;
    more_right_icon.value = false;
    return;
  }
  //比分总宽度
  let totalWidth = length * 50,
    //已滚动的距离
    scrollLeft = lodash.get(stage_score.value, "scrollLeft", 0),
    //元素实际宽度
    clientWidth = lodash.get(stage_score.value, "clientWidth", 0);
  //总宽度大于实际宽度
  if (totalWidth > clientWidth) {
    more_right_icon.value = true;
  }
  //已经移动距离
  if (scrollLeft > 0) {
    more_left_icon.value = true;
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
const scorll = (type) => {
  let length = lodash.get(this.match, "score_list.length", 0);
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
  this.compute_is_show_more();
}


</script>

<style lang="scss" scoped>
.score-more {
  display: flex;
  justify-content: space-between;
  height: 35px;
  line-height: 35px;
  position: relative;

  .scroll-arrow {
    position: absolute;
    top: -1px;

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

  .stage-score {
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 0 5px;
    margin-right: 30px;
    margin-bottom: -18px;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;

    &::-webkit-scrollbar {
      width: 0 !important;
    }

    span {
      display: inline-block;

      &.item {
        width: 50px;
      }
    }
  }

  .amount-score {
    flex-wrap: nowrap;

    &.min-width {
      min-width: 213px;
    }
  }

  .icon-on_base1 {
    font-size: 20px;
  }

  .mfo {
    width: 100%;
    text-align: right;
  }
}
</style>
