<template>
  <div class="basic-wrap" @click.stop="details.on_go_detail(match, null, router, route)">
    <!-- 队伍信息 -->
    <div class="row-item team-item" v-for="item in ['home', 'away']" :key="item">
      <template v-if="is_suffix">
        <div class="team-logo" :class="lodash.get(match, 'match_logo.is_double', false) && 'double-logo'"></div>
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div
              :class="['team-name ellipsis allow-user-select', item, { 'bold': match.other_team_let_ball == (item === 'home' ? 'T1' : 'T2') }]"
              v-tooltip="{ content: team_names[item], overflow: 1 }">{{ team_names[item] }}</div>
          </div>
        </div>
        <!-- 当前局比分 -->
        <div class="score">{{ lodash.get(score_list, `[2].${item}`) }}</div>
      </template>
    </div>
    <div class="row-item match-icon">
      <!-- 提前结算 -->
      <div @click.stop="">
        <div v-if="lodash.get(match, 'mearlys', 0) && match.tpl_id != 12"
          class="icon-wrap settlement-pre relative-position" v-tooltip="{ content: i18n_t('bet_record.settlement_pre') }">
          <img class="match_pre" :src="compute_local_project_file_path('/image/png/match_pre.png')" />
        </div>
      </div>
      <!-- 中立场、盘口数 -->
      <div class=" more-info flex" v-if="is_show_more">
        <!-- 中立场 -->
        <div class="neutral-wrap">
          <span v-if="match.mng" class="icon-neutral q-icon c-icon"><span class="path1"></span><span
              class="path2"></span></span>
        </div>

        <!-- 是否收藏 -->
        <span @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match"
          v-if="GlobalAccessConfig.get_collectSwitch()">
          <i aria-hidden="true" class="icon-star q-icon c-icon"
            :class="(match.mf == 1 || match.mf == true) && 'active'"></i>
        </span>
        <!-- 统计分析 -->
        <div class="sr-link-icon-w" v-tooltip="{ content: i18n_t('common.analysis') }" v-if="is_show_sr_flg(match)"
          @click.stop='details.sr_click_handle(match)'>
          <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
        </div>
        <!-- 玩法数量 -->
        <div class="play-count-wrap row no-wrap">
          <span class="play-count">{{ handicap_num }}</span>
          <span class="yb-flex-center">
            <div class="yb-icon-arrow"></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue';
import { useRouter, useRoute } from "vue-router";
import lodash from 'lodash';
import { compute_local_project_file_path, is_show_sr_flg } from "src/output/index.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import details from "src/core/match-list-pc/details-class/details.js"
import { get_history_score_list } from 'src/core/match-list-pc/match-handle-data.js'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  is_show_more: {
    type: Boolean,
    default: true
  },
  is_suffix: {
    type: Boolean,
    default: true
  }
})
const match = inject("match")
const score_list = computed(() => {
  return get_history_score_list(match.value)
});
const team_names = computed(() => {
  let { mhn = '', man = '', up_half_text = '' } = match.value
  let team_names = {
    away: "",
    home: "",
  }
  if (props.is_suffix) {
    team_names = {
      away: man + up_half_text,
      home: mhn + up_half_text,
    }
  } else {
    team_names = {
      away: man,
      home: mhn,
    }
  }
  return team_names
})
</script>

<style lang="scss" scoped>
.basic-col {
  .row-item {
    display: flex;
    height: 35px;
    align-items: center;

    .team-logo {
      display: flex;
      width: 22px;
      min-width: 22px;
      align-items: center;
    }
  }

  .match-icon {
    justify-content: space-between;
  }

  .more-info {
    align-items: center;
  }
}
</style>
