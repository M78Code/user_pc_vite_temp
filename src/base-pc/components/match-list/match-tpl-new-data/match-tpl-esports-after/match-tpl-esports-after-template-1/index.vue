<template>
  <div class="c-match-item tpl-esports-bg">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center tpl-esports">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')"
        v-if="lodash.get(match, 'is_hot')" />
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match && match.api_update_time != 0" :match="match" source='match_list'
        :class="pos_class" show_page="match-list" :rows="2" />
    </div>
    <!-- 主盘 -->
    <div class="match-handicap-item-esports">
      <div class="c-match-card">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted" :match="match" :is_show_more="false" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="match.main_handicap_list" :match="match" :is_show_score="false" />
      </div>
      <div class="esports-play-box esports-additional-disk">
        <!-- 盘口数量 -->
        <div
          class="play-count-wrap no-wrap"
          @click="on_go_detail"
          v-if="MenuData.is_esports() && route.name != 'search'" 
          :style="`width:${match_list_tpl_size.team_width}px !important;`"
        >
        <div class="have-chuan-guan" >
          <span v-if="lodash.get(match,'ispo', 0) != 0">{{ i18n_t('match_info.match_parlay') }}</span>
        </div>
        <div class="play-detail-box">
          <span class="count">{{ handicap_num }}</span>
          <div class="yb-flex-center" style="margin-left:5px">
            <div class="yb-icon-arrow"></div>
          </div>
        </div>
        </div>
        <!-- 赛制 -->
        <div class="esports-play-competition">
          {{ match.mfo }}
        </div>
      </div>
    </div>
    <!-- 视频按钮 -->
    <div class="media-col">
      <match-media v-if="match" :match="match" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import lodash from 'lodash'
import { useRoute, useRouter } from 'vue-router';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import {UserCtr} from 'src/output/'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { MenuData } from "src/output/index.js"
import { BaseInfo } from "src/base-pc/mixin/base-info"

const route = useRoute();

const props = defineProps({
  is_show_more: {
    type: Boolean,
    default: () => false
  }
})
const match = inject("match");
const is_mounted = ref(true);
const match_list_tpl_size = inject("match_list_tpl_size");
const pos_class = computed(() => {
  if (lodash.get(match, 'ispo', 0) == 0 && lodash.get(match, 'mfo', '') == '') {
    return 'top18'
  }
  return ''
})

const {
  handicap_num,
} = BaseInfo(match)


</script>

<style lang="scss" scoped>
.match-handicap-item-esports {
  flex: 1;
  box-sizing: border-box;
  .c-match-card {
    display: flex;
  }
}
.basic-wrap {
  .row-item {
    display: flex;
    height: 35px;
    align-items: center;

    .team-logo {
      display: flex;
      width: 22px;
      min-width: 22px;
      align-items: center;

      img {
        width: 100%;
        max-height: 24px;
      }
    }
  }
}

.tpl-esports {
  .c-match-process {
    top: 26px;
  }
}

.process-col {
  line-height: 1.7;
}

.top18 {
  top: 18px !important;
}
</style>