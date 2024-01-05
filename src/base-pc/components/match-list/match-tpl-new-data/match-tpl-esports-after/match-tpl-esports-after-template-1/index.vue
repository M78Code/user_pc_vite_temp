<template>
  <div class="c-match-item tpl-esports-bg">
    <div v-show="false">{{ MatchListData.data_version.version }}</div>
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <!-- 比赛进程 -->
      <div class="process-col yb-flex-center tpl-esports">
        <!--热门赛事显示hot标识-->
        <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="lodash.get(match, 'is_hot')"/>
        <!-- 串 ：可串关文字提示 ispo：0否 1普通串关 2局内串关 -->
        <div class="match-parlay">
          <template v-if="lodash.get(match,'ispo', 0) != 0">
            <div v-if="parlay_overflow" class="wd1" v-tooltip="{content:'Parlay',overflow:1}">P&nbsp;</div>
            <div class="wd" v-else>{{ i18n_t('match_info.match_parlay') }}</div>
          </template>          
          <div>{{match.mfo}}</div>
        </div>

        <!-- 比赛进程 -->
        <match-process v-if="is_mounted && match && match.api_update_time !=0" :match="match" source='match_list' 
          :class="pos_class" show_page="match-list" :rows="2" />
      </div>
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
        <basis-info2 v-if="is_mounted" :match="match" :is_show_more="false" />
      </div>

      <!-- 赛事盘口投注项 -->
      <match-handicap
        v-if="match"
        :handicap_list="match.main_handicap_list"
        :match="match"
        :is_show_score="false"
      />

      <!-- 视频按钮 -->
      <div class="media-col"  >
        <match-media v-if="match" :match="match" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import lodash from 'lodash'

import { MatchDataWarehouse_PC_List_Common as MatchListData, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'

const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
  is_show_more: {
    type: Boolean,
    default: () => false
  }
})

let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
let match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
const is_mounted = ref(true);

const pos_class = computed(() => {
  if(_.get(this.match,'ispo', 0) == 0 && _.get(this.match,'mfo', '')==''){
    return 'top18'
  }
  return ''
})

watch(() => MatchListData.data_version.version, (new_value, old_value) => {
  match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
})

</script>

<style lang="scss" scoped>
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
.tpl-esports{
  .c-match-process{top: 26px;}
}
.process-col {    
 line-height: 1.7;
}
.top18{
  top: 18px!important;
}
</style>