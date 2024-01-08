<template>
  <div class="list-card-wrap v-scroll-item relative-position" :class="{
    'sticky-wrap': ['sport_title', 'play_title', 'no_start_title', 'league_title', 'champion_league_title'].includes(card_style_obj?.card_type),
    'matc-type-card': [
      'sport_title',
      'play_title',
      'no_start_title',
    ].includes(card_type),
  }" :style="`height:${card_style_obj?.card_total_height}px  !important;width:${LayOutMain_pc.layout_content_width - 15
  }px  !important;${card_style}`">1111111111
      {{ card_type }}
    <div v-if="is_mounted" :class="{ 'list-card-inner': !MatchListCardData.is_champion }">
      <!-- 赛事状态 | 赛种类型 -->
      <play-match-type v-if="['sport_title', 'play_title', 'no_start_title'].includes(card_type)
        " :card_style_obj="card_style_obj" />
      <!-- 联赛标题 -->
      <play-match-league v-else-if="card_type == 'league_title' && card_style_obj?.mid
        " :card_style_obj="card_style_obj" :key="card_type" />
      <!-- 冠军联赛标题 -->
      <match-type-champion v-else-if="card_type == 'champion_league_title'" :card_style_obj="card_style_obj" />
      <!-- 暂无数据 -->
      <div class="fit" v-else-if="card_type == 'no_data'">
        <load-data style="max-height: 260px" state="empty" />
        <!-- 强力推荐 -->
        <div class="row">
          <img class="list-hot-icon" :src="compute_local_project_file_path('/image/svg/hot.svg')" />
          <div class="list-hot-text">{{ i18n_t("list.hot_match") }}</div>
        </div>
      </div>
      <!-- 赛事卡片 -->
      <template v-else-if="card_type == 'league_container'">
        <!-- 数据加载状态 -->
        <!-- 赛事列表 -->
        <match-card v-for="mid in mids_arr" :key="mid" :mid="mid" />
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, nextTick, provide, ref, watch } from "vue";
import { PlayMatchTypeFullVersionWapper as PlayMatchType } from "src/base-pc/components/match-list/play-match-type/index.js";
import { PlayMatchLeagueFullVersionWapper as PlayMatchLeague } from "src/base-pc/components/match-list/play-match-league/index.js";
import { MatchTypeChampionFullVersionWapper as MatchTypeChampion } from "src/base-pc/components/match-list/match-type-champion/index.js";
import { MatchCardFullVersionWapper as MatchCard } from "src/base-pc/components/match-list/match-card/index.js";
import LoadData from "src/base-pc/components/load-data/load-data.vue";

import MatchListCardData from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { compute_local_project_file_path, MatchDataWarehouse_PC_List_Common } from "src/output/index.js";
import { LayOutMain_pc } from "src/output/project/common/pc-common.js";

const props = defineProps({
  card_key: String,
  MatchListData: {
    default: () => MatchDataWarehouse_PC_List_Common
  }
});
provide("MatchListData", props.MatchListData)
// 卡片样式对象
let card_style_obj = computed(() => {
  return MatchListCardDataClass.get_card_obj_bymid(props.card_key, MatchListCardDataClass.list_version.value)
});

provide("card_style_obj", card_style_obj)
// 存储一个变量，减少对card_style_obj的重复访问和判断
let card_type = computed(() => {
  return (card_style_obj.value?.card_type)
});
let sticky_top = ref(MatchListCardDataClass.sticky_top);
// 组件是否加载完成
const is_mounted = ref(false);
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
      card_type.value
    )
  ) {
    let top = sticky_top.value?.type || 0;
    card_style = `top:${top - 0.5}px;`;
  }
  // 如果是联赛标题卡片  设置联赛吸顶
  else if (
    ["league_title", "champion_league_title"].includes(
      card_type.value
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
  let _mids_arr = [];
  if (card_style_obj.value?.card_type == "league_container") {
    _mids_arr = card_style_obj.value?.mids.split(",");
    return _mids_arr;
  }
  return _mids_arr;
});
onMounted(() => {
  // 异步设置组件是否挂载完成
  nextTick(()=>{
    is_mounted.value = true
  })
});
</script>
<style lang="scss" scoped>
.list-card-wrap {
  overflow: hidden;

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