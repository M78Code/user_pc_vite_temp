<template>
  <div class="c-match-item " :class="'tpl-'+match_style_obj.data_tpl_id"  >
    <!-- 15分钟玩法标题 -->
    <div class=" flex absolute c15min-title">
      <div  :style="`width:${match_list_tpl_size.team_width+77}px !important;`"></div>
      <div class="play-name row col">
          <div class="col ellipsis text-center" :key="key" :style="`width:${ match_list_tpl_size.bet_width * 3}px !important;`"  v-for="(item,key) in bet_col">
              {{item}}
          </div>
      </div>
      <div :style="`width:${match_list_tpl_size.media_width-3}px !important;`"></div>
    </div>
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="match.is_hot"/>
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match.api_update_time !=0" :match="match" source="match_list"  show_page="match-list" :rows="2" />
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info1 v-if="is_mounted" is_15min :match="match" show_type="all" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
        />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],
import { computed } from 'vue';
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { t, compute_local_project_file_path } from "src/output/index.js";
// useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps ({
  match: {
    type: Object,
    default: () => {}
  }
})

let match_style_obj = MatchListCardDataClass.all_card_obj[props.match.mid+'_']


// 其他玩法标题
const bet_col = computed(() => {
  let bet_col,
  hSpecial =this.match.hSpecial;
  // 15分钟玩法
    let start = hSpecial - 1,
    end =  hSpecial +1;
    if(hSpecial>=4){
        start -= 1
        end -= 1
    }
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.15minutes_bet_col')]
    bet_col.splice(2,1)
    bet_col.splice(bet_col.length-1,1,"")
    bet_col = bet_col.slice(start,end)
    if(hSpecial == 6){
      bet_col.push('')
    }
  return  bet_col
})

</script>

<style lang="scss" scoped>
.tpl-24{
  margin-top: 24px;
  .c15min-title{
    top: 0;
    height: 24px;
  }
}
</style>