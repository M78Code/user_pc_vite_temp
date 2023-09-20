<template>
  <!--赛事玩法模板-->
  <div
    class="c-match-card relative-position"
    :id="DOM_ID_SHOW && `list-mid-${mid}`"
    :style="`height:300px  !important;width:1920px  !important;`"
  >
  <div v-show="false">{{ MatchListCardData.list_version }}</div>
    <!-- <component
      v-if="is_mounted && [1,2].includes(match_style_obj.show_level)"
      :is="match_components_name"
      :mid="mid"
      :class="'csid-'+match_style_obj.csid"
    /> -->
    <match-tpl-0-after :mid="mid" />
    <!-- 调试信息 -->
    <div v-if="test" class="test">{{mid}}</div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref, onMounted, onUnmounted, shallowRef } from 'vue';
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import store from 'src/store-redux/index.js'

// inject:['match_list_card'],

// 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
import { MatchTpl0AfterFullVersionWapper as MatchTpl0After } from "src/components/match-list/match-tpl-new-data/match-tpl-0-after/index.js";
// // 玩法模板 2   足球-半/全
// import { MatchTpl2AfterFullVersionWapper as matchTpl2After } from "src/components/match-list/match-tpl-new-data/match-tpl-2-after/index.js";
// // 玩法模板 7   篮球-让球&大
// import { MatchTpl7AfterFullVersionWapper as matchTpl7After } from "src/components/match-list/match-tpl-new-data/match-tpl-7-after/index.js";
// // 玩法模板 9   网球-让球&大
// import { MatchTpl9AfterFullVersionWapper as matchTpl9After } from "src/components/match-list/match-tpl-new-data/match-tpl-9-after/index.js";
// // 玩法模板 10  网球-准确盘
// import { MatchTpl10AfterFullVersionWapper as matchTpl10After } from "src/components/match-list/match-tpl-new-data/match-tpl-10-after/index.js";
// // 玩法模板 12  热门赛事-竟足-让球/胜平
// import { MatchTpl12AfterFullVersionWapper as matchTpl12After } from "src/components/match-list/match-tpl-new-data/match-tpl-12-after/index.js";
// // 玩法模板 17  棒球-让球&大
// import { MatchTpl17AfterFullVersionWapper as matchTpl17After } from "src/components/match-list/match-tpl-new-data/match-tpl-17-after/index.js";
// // 玩法模板 18  所有冠军玩法 政治娱
// import { MatchTpl18AfterFullVersionWapper as matchTpl18After } from "src/components/match-list/match-tpl-new-data/match-tpl-18-after/index.js";
// // 玩法模板 21  足球-比分
// import { MatchTpl21AfterFullVersionWapper as matchTpl21After } from "src/components/match-list/match-tpl-new-data/match-tpl-21-after/index.js";
// // 玩法模板 24  足球-15分钟
// import { MatchTpl24AfterFullVersionWapper as matchTpl24After } from "src/components/match-list/match-tpl-new-data/match-tpl-24-after/index.js";
// // 电竞玩法模板
// import { MatchTplEsportsAfterFullVersionWapper as matchTplesportsAfter } from "src/components/match-list/match-tpl-new-data/match-tpl-esports-after/index.js";
let state = store.getState()
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  mid: {
    type: [String, Number],
    default: () => null,
  },
})
// 赛事样式对象
const match_style_obj = ref(MatchListCardDataClass.all_card_obj[props.mid+'_'] || {})
// 是否显示调试信息
const test = ref(sessionStorage.getItem('wsl'))
// 组件是否加载完成
const is_mounted = ref(false)
// 显示部分dom ID
// this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
const vx_get_layout_size = ref(state.layoutReducer.layout_size)
// 赛事模板名称
const match_components_name = computed(() => {
  let {tpl_id = 0} = match_style_obj.value
  // 25 罚牌主盘口
  if([3,5,6,8,19,20,22,23,25].includes(+tpl_id)){
    tpl_id = 2
  }else if([11,16].includes(+tpl_id)){
    tpl_id = 9
  }else if([15].includes(+tpl_id)){
    tpl_id = 10
  }else if([13].includes(+tpl_id)){
    tpl_id = 0
  }
  return `match-tpl${tpl_id}-after`
})

onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(()=>{
    is_mounted.value = true
  })
})

onUnmounted(() => {
  match_style_obj.value = null
})

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
