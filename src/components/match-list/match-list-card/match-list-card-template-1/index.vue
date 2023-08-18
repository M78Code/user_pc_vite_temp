<template>
  <div
    v-if="card_style_obj.is_show_card"
    class="list-card-wrap v-scroll-item relative-position"
    :class="{
      'sticky-wrap':['sport_title','play_title','no_start_title','league_title','champion_league_title'].includes(card_style_obj.card_type),
      'matc-type-card':['sport_title','play_title','no_start_title'].includes(card_style_obj.card_type)
    }"
    :style="`height:${card_style_obj.card_total_height}px  !important;width:${vx_get_layout_size.list_content_width}px  !important;${card_style}`"
  >

  </div>
</template>

<script setup>
  // inject:['match_list_card'],
import MatchListCard from 'src/core/match-list-pc/match-card/match-list-card-class.js'

console.log('lockie_test_console', MatchListCard);
// import { computed, defineProps, onMounted, onUnmounted } from 'vue';
// import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
// import {component_symbol ,need_register_props} from "../config/index.js"
// import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
// import store from 'src/store-redux/index.js'
// import loadData from "src/public/components/load_data/load_data.vue"
// import { i18n } from 'src/boot/i18n.js'
// import { MatchCardFullVersionWapper as MatchCard } from ( /* webpackChunkName: "details" */ "src/components/match-list/match-card/index.js")
// // 赛事列表头部——滚球——赛事类型
// import { PlayMatchTypeFullVersionWapper as PlayMatchType } from ( /* webpackChunkName: "details" */ "src/components/match-list/play-match-type/index.js")
// // 赛事列表头部——滚球——联赛信息
// import { PlayMatchLeagueFullVersionWapper as PlayMatchLeague } from ( /* webpackChunkName: "details" */ "src/components/match-list/play-match-league/index.js")
// // 赛事列表头部——冠军信息
// import { MatchTypeChampionFullVersionWapper as MatchTypeChampion } from ( /* webpackChunkName: "details" */ "src/components/match-list/match-type-champion/index.js")

// let state = store.getState();
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

// // 当前列表类型
// const match_list_type = ref(match_list_card.match_list_mapping_relation_obj_type)
// // 卡片样式对象
// const card_style_obj = ref(match_list_card.all_card_obj[props.card_key])
// // 是否显示调试信息
// const test = ref(sessionStorage.getItem('wsl'))
// // 组件是否加载完成
// const is_mounted = ref(false);
// const vx_get_layout_size = ref(state.layoutReducer.layout_size)

// /**
//  * @Description 设置卡片样式
//  * @param {undefined} undefined
// */
// const card_style = computed(() => {
//   // 设置卡片高度
//   let card_style = ''
//   // 如果卡片类型是球种标题、已开赛、未开赛标题  设置吸顶
//   if(['sport_title','play_title','no_start_title'].includes(this.card_style_obj.card_type)){
//     let top = match_list_card.view.sticky_top.type
//     card_style = `top:${top - 0.5}px;`
//   }
//   // 如果是联赛标题卡片  设置联赛吸顶
//   else if(['league_title','champion_league_title'].includes(this.card_style_obj.card_type)){
//     let top = match_list_card.view.sticky_top.league
//     card_style = `top:${top - 0.5}px;`
//   }
//   return card_style
// })

// /**
//  * @Description 设置赛事ID列表
//  * @param {undefined} undefined
// */
// const mids_arr = () => {
//   let mids_arr = []
//   if(this.card_style_obj.card_type == 'league_container'){
//     mids_arr = this.card_style_obj.mids.split(',')
//   }
//   return mids_arr
// }

// onMounted(() => {
//   // 异步设置组件是否挂载完成
//   setTimeout(()=>{
//     is_mounted.value = true
//   })
// })

// /**
//  * @Description 刷新联赛
//  * @param {undefined} undefined
// */
// const refresh_league = () => {
//   match_list_card.refresh_league(card_style_obj.value)
// }

// onUnmounted(() => {
//   card_style_obj.value = null
// })
</script>

<style lang="scss" scoped>
.list-card-wrap {
  overflow: hidden;
  .list-card-inner {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  /*  数据加载组件 */
  .load-data-wrap {
    width: 100%;
    height: 100%;
    ::v-deep .empty-wrap .img {
      width: 130px !important;
      height: 130px !important;
    }
    ::v-deep .user_api_limited {
      .img {
        display: none;
      }
    }
  }
  .test-info {
    position: absolute;
    color: red;
    font-size: 14px;
    z-index: 999999;
    right: 0;
    bottom: 0;
    user-select: text;
  }
}
.list-hot-icon {
  width: 14px;
  height: 14px;
  margin: 2px 15px 0 10px;
}
.list-hot-text {
  font-size: 14px;
  font-weight: 600;
}
</style>
