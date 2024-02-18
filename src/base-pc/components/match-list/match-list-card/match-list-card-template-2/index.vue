<!-- 欧洲版 主列表页面 -->
<template>
  <div v-show="false">{{ MatchListCardDataClass.list_version }}{{ LayOutMain_pc.layout_version }}</div>
  <div class="list-card-wrap v-scroll-item relative-position" :class="{
    'matc-type-card': [
      'sport_title',
      'play_title',
      'no_start_title',
    ].includes(card_style_obj?.card_type)
  }" :style="`height:${card_style_obj?.card_total_height}px  !important;
    width:${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)
  }px  !important;${card_style}`" v-if="card_style_obj.is_show_card">
    <div :class="{ 'list-card-inner': !MatchListCardData.is_champion }">
      <!-- <div v-if="['split_line'].includes(card_style_obj?.card_type)" :style="{'height': '100px'}"></div> -->
      <!-- 赛事状态 | 赛种类型 -->
      <div v-if="['sport_title', 'play_title', 'no_start_title'].includes(card_style_obj?.card_type)">
        <play-match-type :card_style_obj="card_style_obj" />
      </div>
      <!-- 联赛标题 -->
      <div v-else-if="card_style_obj?.card_type == 'league_title' && card_style_obj?.mid">
        <play-match-league :card_style_obj="card_style_obj" :key="card_style_obj?.card_type" />
      </div>
      <!-- 冠军联赛标题 -->
      <div v-else-if="card_style_obj?.card_type == 'champion_league_title'">
        <match-type-champion :card_style_obj="card_style_obj" />
      </div>
      <!-- 赛事卡片 -->
      <div v-else-if="card_style_obj?.card_type == 'league_container' && mids_arr.length">
        <!-- 数据加载状态 -->
        <!-- 赛事列表 -->
        <!-- {{ card_style_obj.mids.split(',') }} -->
        <!-- {{ mids_arr }} -->
        <match-card v-for="mid in card_style_obj.mids.split(',')" :key="mid" :mid="mid" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, watch, provide } from "vue";

import { PlayMatchTypeFullVersionWapper as PlayMatchType } from "src/base-pc/components/match-list/play-match-type/index.js";
import { PlayMatchLeagueFullVersionWapper as PlayMatchLeague } from "src/base-pc/components/match-list/play-match-league/index.js";
import { MatchCardFullVersionWapper as MatchCard } from "src/base-pc/components/match-list/match-card/index.js";
import { MatchTypeChampionFullVersionWapper as MatchTypeChampion } from "src/base-pc/components/match-list/match-type-champion/index.js";
import MatchListCardData from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchDataWarehouse_PC_List_Common } from "src/output/index.js";
import { LayOutMain_pc } from "src/output/project/index.js";
const props = defineProps({
  card_key: String,
  MatchListData: {
    default: () => MatchDataWarehouse_PC_List_Common
  }
});
provide("MatchListData", props.MatchListData)
// 卡片样式对象
let card_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.card_key);
let sticky_top = ref(null);
// 组件是否加载完成
const is_mounted = ref(true);
/**
 * @Description 设置卡片样式
 * @param {undefined} undefined
 */
const card_style = computed(() => {
  // 设置卡片高度
  let card_style = "";
  // 如果卡片类型是球种标题、已开赛、未开赛标题  设置吸顶
  if (
    ["sport_title", "play_title", "no_start_title"].includes(
      card_style_obj?.card_type
    )
  ) {
    let top = sticky_top.value?.type || 0;
    card_style = `top:${top - 0.5}px;`;
  }
  // 如果是联赛标题卡片  设置联赛吸顶
  else if (
    ["league_title", "champion_league_title"].includes(
      card_style_obj?.card_type
    )
  ) {
    let top = sticky_top.value?.league || "";
    card_style = `top:${top - 0.5}px;`;
  }
  return card_style;
});
/**
 * @Description 设置赛事ID列表
 * @param {undefined} undefined
 */
const mids_arr = computed(() => {
  let mids_arr = [];
  if (card_style_obj?.card_type == "league_container") {
    // 深拷贝一个mids 所属对象 防止mids丢失
    let new_card_style_obj = lodash.cloneDeep(card_style_obj)
    mids_arr = new_card_style_obj?.mids.split(",");
    return mids_arr;
  }
  return mids_arr;
});

onMounted(() => {
  // 异步设置组件是否挂载完成
  // setTimeout(()=>{
  //   is_mounted.value = true
  // })
});
</script>
<style lang="scss" scoped>
.list-card-wrap {
  .list-card-inner {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  /*  数据加载组件 */
  .load-data-wrap {
    width: 100%;
    height: 100%;

    :deep(.empty-wrap .img) {
      width: 130px !important;
      height: 130px !important;
    }

    :deep(.user_api_limited) {
      .img {
        display: none;
      }
    }
  }

  .test-info {
    position: absolute;
    color: red;
    font-size: 14px;
    z-index: 999999;
    right: 0;
    bottom: 0;
    user-select: text;
  }
}

.list-hot-icon {
  width: 14px;
  height: 14px;
  margin: 2px 15px 0 10px;
}

.list-hot-text {
  font-size: 14px;
  font-weight: 600;
}
</style>