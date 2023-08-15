<template>
  <!--赛事玩法模板-->
  <div
    class="c-match-card relative-position"
    :id="DOM_ID_SHOW && `list-mid-${mid}`"
    :style="`height:${match_style_obj.total_height}px  !important;width:${vx_get_layout_size.list_content_width}px  !important;`"
    v-if="match_style_obj.is_show_card && current_comp"
  >
    <component
      v-if="is_mounted && [1,2].includes(match_style_obj.show_level)"
      :is="current_comp"
      :mid="mid"
      :class="'csid-'+match_style_obj.csid"
    />
    <!-- 调试信息 -->
    <div v-if="test" class="test">{{mid}}</div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import store from 'src/store-redux/index.js'

// inject:['match_list_card'],

// 玩法模板 0   足球-让球&大小  、 足球-角球 、 美足-让球&大小 、 手球-让球&大小
import { MatchTpl0AfterFullVersionWapper as matchTpl0After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-0-after/index.js");
// 玩法模板 2   足球-半/全
import { MatchTpl2AfterFullVersionWapper as matchTpl2After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-2-after/index.js");
// 玩法模板 7   篮球-让球&大
import { MatchTpl7AfterFullVersionWapper as matchTpl7After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-7-after/index.js");
// 玩法模板 9   网球-让球&大
import { MatchTpl9AfterFullVersionWapper as matchTpl9After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-9-after/index.js");
// 玩法模板 10  网球-准确盘
import { MatchTpl10AfterFullVersionWapper as matchTpl10After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-10-after/index.js");
// 玩法模板 12  热门赛事-竟足-让球/胜平
import { MatchTpl12AfterFullVersionWapper as matchTpl12After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-12-after/index.js");
// 玩法模板 17  棒球-让球&大
import { MatchTpl17AfterFullVersionWapper as matchTpl17After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-17-after/index.js");
// 玩法模板 18  所有冠军玩法 政治娱
import { MatchTpl18AfterFullVersionWapper as matchTpl18After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-18-after/index.js");
// 玩法模板 21  足球-比分
import { MatchTpl21AfterFullVersionWapper as matchTpl21After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-21-after/index.js");
// 玩法模板 24  足球-15分钟
import { MatchTpl24AfterFullVersionWapper as matchTpl24After } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-24-after/index.js");
// 电竞玩法模板
import { MatchTplEsportsAfterFullVersionWapper as matchTplesportsAfter } from ( /* webpackChunkName: "pc-mini-chunks" */ "src/components/match-list/match_tpl_new_data/match-tpl-esports-after/index.js");

let state = store.getState()
const props = defineProps({ ...useProps })
// 赛事样式对象
const match_style_obj = ref(this.match_list_card.all_card_obj['mid_'+props.mid] || {})
// 是否显示调试信息
const test = ref(sessionStorage.getItem('wsl'))
// 组件是否加载完成
const is_mounted = ref(false)
const current_comp = shallowRef(match_components_name)
// 显示部分dom ID
this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
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
  this.match = {}
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
