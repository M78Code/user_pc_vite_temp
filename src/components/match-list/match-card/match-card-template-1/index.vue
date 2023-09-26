<template>
  <!--赛事玩法模板-->
  <div
    class="c-match-card relative-position"
    :id="`list-mid-${mid}`"
    :style="`height:${match_style_obj.total_height}px !important;width:${LayOutMain_pc.layout_content_width}px  !important;`"
  >
  <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
  <!-- {{ match_style_obj.show_level }} -->
  <!-- && [1,2].includes(match_style_obj.show_level) -->
    <component
      :is="`MatchTpl${match_style_obj.view_tpl_id}After`"
      :mid="mid"
    />
 
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { LayOutMain_pc } from "src/core/index.js";
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import store from 'src/store-redux/index.js'
// inject:['match_list_card'],

// 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
import { MatchTpl1AfterFullVersionWapper as MatchTpl1After } from "src/components/match-list/match-tpl-new-data/match-tpl-1-after/index.js";
// // 玩法模板 2   足球-半/全
import { MatchTpl2AfterFullVersionWapper as MatchTpl2After } from "src/components/match-list/match-tpl-new-data/match-tpl-2-after/index.js";
// // // 玩法模板 7   篮球-让球&大
import { MatchTpl7AfterFullVersionWapper as MatchTpl7After } from "src/components/match-list/match-tpl-new-data/match-tpl-7-after/index.js";
// // // 玩法模板 9   网球-让球&大
import { MatchTpl9AfterFullVersionWapper as MatchTpl9After } from "src/components/match-list/match-tpl-new-data/match-tpl-9-after/index.js";
// // // 玩法模板 10  网球-准确盘
import { MatchTpl10AfterFullVersionWapper as MatchTpl10After } from "src/components/match-list/match-tpl-new-data/match-tpl-10-after/index.js";
// // // 玩法模板 12  热门赛事-竟足-让球/胜平
// import { MatchTpl12AfterFullVersionWapper as MatchTpl12After } from "src/components/match-list/match-tpl-new-data/match-tpl-12-after/index.js";
// // // 玩法模板 17  棒球-让球&大
// import { MatchTpl17AfterFullVersionWapper as MatchTpl17After } from "src/components/match-list/match-tpl-new-data/match-tpl-17-after/index.js";
// // // 玩法模板 18  所有冠军玩法 政治娱
// import { MatchTpl18AfterFullVersionWapper as MatchTpl18After } from "src/components/match-list/match-tpl-new-data/match-tpl-18-after/index.js";
// // // 玩法模板 21  足球-比分
// import { MatchTpl21AfterFullVersionWapper as MatchTpl21After } from "src/components/match-list/match-tpl-new-data/match-tpl-21-after/index.js";
// // // 玩法模板 24  足球-15分钟
// import { MatchTpl24AfterFullVersionWapper as MatchTpl24After } from "src/components/match-list/match-tpl-new-data/match-tpl-24-after/index.js";
// // 电竞玩法模板
// import { MatchTplEsportsAfterFullVersionWapper as MatchTplesportsAfter } from "src/components/match-list/match-tpl-new-data/match-tpl-esports-after/index.js";
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
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
    MatchTpl10After,
  },
  setup(props) {
    // 赛事样式对象
    let match_style_obj = MatchListCardDataClass.all_card_obj[props.mid+'_']
    // 组件是否加载完成
    const is_mounted = ref(true);
    // 显示部分dom ID
    // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
    onMounted(() => {
      // 异步设置组件是否挂载完成
      // setTimeout(()=>{
      //   is_mounted.value = true
      // })
    })
    onUnmounted(() => {
      match_style_obj = null
    })
    return {
      match_style_obj,
      is_mounted,
      LayOutMain_pc,
      MatchListCardData,
      MatchListCardDataClass,
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
    bottom: 0;
    user-select: text;
  }
}
</style>
