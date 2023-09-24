<template>
  <!--赛事玩法模板-->
  <div
    class="c-match-card relative-position"
    :id="`list-mid-${mid}`"
    :style="`height:${match_style_obj.total_height}px !important;width:${LayOutMain_pc.layout_content_width}px  !important;`"
  >
  <!-- 赛事玩法模板赛事玩法模板赛事玩法模板赛事玩法模板赛事玩法模板  {{mid}} -->
  <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
  <!-- {{ match_style_obj.show_level }} -->
  <!-- && [1,2].includes(match_style_obj.show_level) -->
    <component
      v-if="is_mounted"
      :is="match_components_name()"
      :mid="mid"
      :class="'csid-'+match_style_obj.csid"
    />
    <!-- <MatchTpl0After :mid="mid" />   -->
   <!-- {{ match_components_name() }} -->
 
  </div>
</template>

<script>
import { computed, defineProps, ref, onMounted, onUnmounted, shallowRef } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { LayOutMain_pc } from "src/core/index.js";
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import store from 'src/store-redux/index.js'
// inject:['match_list_card'],

// 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
import { MatchTpl0AfterFullVersionWapper as Matchtpl1after } from "src/components/match-list/match-tpl-new-data/match-tpl-0-after/index.js";
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
    Matchtpl1after,
    MatchTpl2After,
    MatchTpl7After,
    MatchTpl9After,
    MatchTpl10After
  },
  watch: {
  
  },
  setup(props) {
    // 赛事样式对象
    let match_style_obj = MatchListCardDataClass.all_card_obj[props.mid+'_']
    // 是否显示调试信息
    const test = ref(sessionStorage.getItem('wsl'))
    // 组件是否加载完成
    const is_mounted = ref(true);
    // 显示部分dom ID
    // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
    // 赛事模板名称
    const match_components_name = () => {
      let {tpl_id = 1} = match_style_obj
      console.log('match_style_objmatch_style_obj', match_style_obj);
      // 25 罚牌主盘口
      if([3,5,6,8,19,20,22,23,25].includes(+tpl_id)){
        // return MatchTpl2After
        tpl_id = 2
      }else if([11,16].includes(+tpl_id)){
        // return MatchTpl9After
        tpl_id = 9
      }else if([15].includes(+tpl_id)){
        // return MatchTpl10After
        tpl_id = 10
      }else if([13].includes(+tpl_id)){
        // return matchtpl1after
        tpl_id = 1
      }

      return `MatchTpl${tpl_id}After`
    }

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
      match_components_name,
      is_mounted,
      LayOutMain_pc,
      MatchListCardData,
      MatchListCardDataClass
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
