<template>
  <!--赛事玩法模板-->
  <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>

  <div class="c-match-card relative-position" :id="`list-mid-${mid}`"
    :style="`height:${lodash.get(match_style_obj, `total_height`)}px !important;width:${LayOutMain_pc.layout_content_width - 15}px  !important;`"
    v-if="match_style_obj.is_show_card">
    <!-- 数据模版调试 -->
    <div v-show="GlobalAccessConfig.get_wsl()" style="position:absolute;color:red"> {{ match_style_obj.view_tpl_id }}-{{
      match_style_obj.data_tpl_id }}-{{
    match_style_obj.show_level }}-{{ match_style_obj.is_show_card }}
    </div>
    <component :is="`MatchTpl${match_style_obj.view_tpl_id}After`" v-if="[1, 2].includes(match_style_obj.show_level)"
      :mid="mid" />
  </div>
  <div class="test">
  </div>
</template>

<script>
import { provide, computed } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchDataWarehouse_PC_List_Common, GlobalAccessConfig } from "src/output/index.js";
import { LayOutMain_pc } from "src/output/project/common/pc-common.js";
// 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
import { MatchTpl1AfterFullVersionWapper as MatchTpl1After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-1-after/index.js";
// // 玩法模板 2   足球-半/全
import { MatchTpl2AfterFullVersionWapper as MatchTpl2After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-2-after/index.js";
// // // 玩法模板 7   篮球-让球&大
import { MatchTpl7AfterFullVersionWapper as MatchTpl7After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-7-after/index.js";
// // // 玩法模板 9   网球-让球&大
import { MatchTpl9AfterFullVersionWapper as MatchTpl9After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-9-after/index.js";
// // // 玩法模板 10  网球-准确盘
import { MatchTpl10AfterFullVersionWapper as MatchTpl10After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-10-after/index.js";
// // // 玩法模板 12  热门赛事-竟足-让球/胜平
import { MatchTpl12AfterFullVersionWapper as MatchTpl12After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-12-after/index.js";
// // // 玩法模板 17  棒球-让球&大
import { MatchTpl17AfterFullVersionWapper as MatchTpl17After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-17-after/index.js";
// // // 玩法模板 18  所有冠军玩法 政治娱
import { MatchTpl18AfterFullVersionWapper as MatchTpl18After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-18-after/index.js";
// // // 玩法模板 21  足球-比分
import { MatchTpl21AfterFullVersionWapper as MatchTpl21After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-21-after/index.js";
// // // 玩法模板 24  足球-15分钟
import { MatchTpl24AfterFullVersionWapper as MatchTpl24After } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-24-after/index.js";

// // 电竞玩法模板
import { MatchTplEsportsAfterFullVersionWapper as MatchTplEsportsAfter } from "src/base-pc/components/match-list/match-tpl-new-data/match-tpl-esports-after/index.js";
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { get_match_to_map_obj } from 'src/core/match-list-pc/match-handle-data.js'
export default {
  props: {
    mid: {
      type: [String, Number],
      default: () => null,
    },
  },
  components: {
    MatchTpl1After,
    MatchTpl2After,
    MatchTpl7After,
    MatchTpl9After,
    MatchTpl17After,
    MatchTpl10After,
    MatchTpl21After,
    MatchTpl12After,
    MatchTpl18After,
    MatchTpl24After,
    MatchTplEsportsAfter
  },
  setup(props) {
    // 赛事样式对象
    const match = MatchDataWarehouse_PC_List_Common.get_quick_mid_obj_ref(props.mid)
    let match_style_obj = computed(() => {
      return MatchListCardDataClass.get_card_obj_bymid(props.mid, MatchListCardDataClass.list_version.value)
    });
    const match_list_tpl_size = computed(() => {
      return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.value?.data_tpl_id}_config`].width_config
    })
    const match_tpl_info = computed(() => {
      return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.value?.data_tpl_id}_config`]
    })
    //非坑位对象
    const not_hn_obj_map = computed(() => {
      return get_match_to_map_obj(match.value, null, props.add_type); //非坑位对象
    })
    provide("match", match)
    provide("match_style_obj", match_style_obj)
    provide("match_list_tpl_size", match_list_tpl_size)
    provide("match_tpl_info", match_tpl_info)
    provide("not_hn_obj_map", not_hn_obj_map)
    return {
      match_style_obj,
      LayOutMain_pc,
      MatchListCardData,
      MatchListCardDataClass,
      GlobalAccessConfig
    }
  }
}

// const props = defineProps({
//   mid: {
//     type: [String, Number],
//     default: () => null,
//   },
// })
</script>

<style lang="scss" scoped>
.c-match-card {
  overflow: hidden;

  .test {
    position: absolute;
    color: red;
    font-size: 14px;
    z-index: 999999;
    left: 0;
    top: 0;
    user-select: text;
  }
}
</style>