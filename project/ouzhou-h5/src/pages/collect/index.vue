<!--
 * @Author: rise
 * @Date: 2023-11-03 16:37:52
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 11:01:56
 * @Description:  
-->
<template>
  <div class="collect-wap">
    <!-- <TopHeader :title="i18n_t('menu_itme_name.esports')">
        <template #right>
            <div>111</div>
        </template>
      </TopHeader> -->

    <div v-if="state.select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
      <div style="height:100%;width: 100%" @click="state.select_dialog = false"></div>
      <!-- 搜索联赛 -->
      <setect-league @closedHandle="state.select_dialog = false" @finishHandle="selectFinishHandle"></setect-league>
    </div>
    <!-- 收藏 -->
    <scroll-menu menu_type="1" :is_show_badge="false"  v-if="MenuData.menu_list.length" @changeMenu="changeMenu"/>
    <div class="match-container">
        <match-container />
    </div>

  </div>
</template>
<script setup>
import { watch, onMounted, onBeforeMount, reactive, nextTick } from "vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import matchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/core/index.js";
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import dateTab from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/date-tab/date-tab.vue';


const inner_height = window.innerHeight;  // 视口高度
const props = defineProps({})
const state = reactive({
  select_dialog: false,
})

const selectFinishHandle = (val) => {
  console.log('选择完成')
  state.select_dialog = false
}
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (mi) =>{
  console.log("euid",MenuData.get_euid())
  MatchMeta.get_collect_match()
}
onMounted(() => {
  changeMenu("40003")
})

// const set_menu_lv1 = item => {
//   MenuData.set_current_lv1_menu(item.mi);
//   MenuData.get_menu_lvmi_list(item.mi)
//   // MenuData.get_results_menu();
//   setTimeout(() => {
//     MatchMeta.get_results_match()
//     MatchMeta.get_collect_match()
//   }, 2000)
// }
</script>
<style scoped lang="scss">
.collect-wap {
  width: 100%;
  height: 100%;
}
.match-container{
    height: calc(100% - 1.71rem);
    overflow: hidden;
    overflow-y: auto;
}
</style>