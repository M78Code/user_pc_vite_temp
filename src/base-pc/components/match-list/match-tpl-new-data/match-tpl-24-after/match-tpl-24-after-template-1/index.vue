<template>
  <div class="c-match-item " :class="'tpl-' + match_style_obj.data_tpl_id">
    <!-- 15分钟玩法标题 -->
    <div class=" flex absolute c15min-title">
      <div :style="`width:${match_list_tpl_size.team_width + 77}px !important;`"></div>
      <div class="play-name row col">
        <div class="col ellipsis text-center" :key="key"
          :style="`width:${match_list_tpl_size.bet_width * 3}px !important;`" v-for="(item, key) in bet_col">
          {{ item }}
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.media_width - 3}px !important;`"></div>
    </div>
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="match.is_hot" />
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match.api_update_time != 0" :match="match" source="match_list"
        show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info1 v-if="is_mounted" is_15min show_type="all" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match.main_handicap_list" :match="match" />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue';
import { compute_local_project_file_path } from "src/output/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo1FullVersionWapper as BasisInfo1 } from 'src/base-pc/components/match-list/match-basis-info/template-1/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  }
})
// 赛事信息
const match = inject('match');
// 赛事模板样式
let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
const is_mounted = ref(true);
// 赛事模板宽度信息
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
// 赛事模板投注项信息


// 其他玩法标题
const bet_col = computed(() => {
  let bet_col,
    {hSpecial=1} = match.value;
  // 15分钟玩法
  let start = hSpecial - 1,
    end = hSpecial + 1;
  if (hSpecial >= 4) {
    start -= 1
    end -= 1
  }
  bet_col = [...i18n_t('list.match_tpl_title.tpl1.15minutes_bet_col')]
  bet_col.splice(2, 1)
  bet_col.splice(bet_col.length - 1, 1, "")
  bet_col = bet_col.slice(start, end)
  if (hSpecial == 6) {
    bet_col.push('')
  }
  return bet_col
})

</script>

<style lang="scss" scoped>
.tpl-24 {
  margin-top: 24px;

  .c15min-title {
    top: 0;
    height: 24px;
  }
}
</style>