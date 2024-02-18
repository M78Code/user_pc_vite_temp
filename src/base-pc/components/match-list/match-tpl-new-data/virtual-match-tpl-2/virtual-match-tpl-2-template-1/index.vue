<template>
  <div
    v-if="match.mhs != 2"
    class="c-match-item  virtual-match-tpl2"
  >
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <div class="team-wrap" :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <!-- 赛狗编号 -->
        <div class="team-item" v-for="(team, index) in match.teams" :key="index">
          <div :class="`ranking-icon ranking-bg-style1-${index + 1} csid-${match.csid}`"></div>
          {{ team }}
        </div>
      </div>
      <!-- 赛事盘口投注项 -->
      <match-handicap
        :handicap_list="match.main_handicap_list"
        :match="match"
      />
      
      <!-- 统计分析 -->
      <div class="media-col">
        <div class="media-item" v-for="(team, index) in match.teams" :key="index">
          <virtual-match-media
            :show_icons="['statistic']"
            :match="match"
            :match_index="match.match_index"
            :statistic_mark="index"
          />
        </div>
      </div>
    </div>
    
    <!-- 跳转详情 -->
    <div @click.stop="on_go_detail" class="more-row row items-center justify-end cursor-pointer">
      <!-- 显示所有盘口 -->
      {{ i18n_t("list.show_more_handicap") }}
      <icon-wapper name="icon-triangle3" color="#99A3B1" />
    </div>
  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],

import details from "src/core/match-list/details-class/details.js";
import { IconWapper } from 'src/components/icon'
import { ref, computed, watch } from 'vue';

import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { is_eports_csid } from 'src/output/index.js'
import { useRouter } from "vue-router";
const router = useRouter()
;

/**
 * 跳转至详情
 * @return {undefined} undefined
 */
const on_go_detail = () => {
  this.set_global_click()
  if(is_eports_csid(this.match.csid)){
    this.match.go_detail_type = 'no_switch'
  }
  details.on_go_detail(this.match,null,router);
}

</script>

<style lang="scss" scoped>
.team-wrap {
  .team-item {
    height: 35px;
    display: flex;
    align-items: center;
    .ranking-icon {
      margin: 0 22px 0 24px;
      width: 24px;
      height: 24px;
    }
  }
}
.media-col {
  .media-item {
    height: 35px;
    display: flex;
    justify-items: center;
  }
}
</style>/index.js