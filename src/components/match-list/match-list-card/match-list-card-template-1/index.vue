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
// import match_list_card from 'src/core/match-list-pc/match-card/match-list-card-class.js'

console.log('lockie_test_console', match_list_card);
import { computed, defineProps, onMounted, onUnmounted, inject } from 'vue';
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import store from 'src/store-redux/index.js'
let state = store.getState();
const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

// 卡片样式对象
const card_style_obj = ref(match_list_card.all_card_obj[props.card_key])
// 组件是否加载完成
const is_mounted = ref(false);
const vx_get_layout_size = ref(state.layoutReducer.layout_size)
const match_list_card = inject('match_list_card')
/**
 * @Description 设置卡片样式
 * @param {undefined} undefined
*/
const card_style = computed(() => {
  // 设置卡片高度
  let card_style = ''
  // 如果卡片类型是球种标题、已开赛、未开赛标题  设置吸顶
  if(['sport_title','play_title','no_start_title'].includes(this.card_style_obj.card_type)){
    let top = match_list_card.view.sticky_top.type
    card_style = `top:${top - 0.5}px;`
  }
  // 如果是联赛标题卡片  设置联赛吸顶
  else if(['league_title','champion_league_title'].includes(this.card_style_obj.card_type)){
    let top = match_list_card.view.sticky_top.league
    card_style = `top:${top - 0.5}px;`
  }
  return card_style
})


onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(()=>{
    is_mounted.value = true
  })
})

onUnmounted(() => {
  card_style_obj.value = null
})
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
