<!--
 * @Author: rise
 * @Date: 2023-11-03 16:37:52
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 11:01:56
 * @Description:  
-->
<template>
    <div class="collect-wap">
      <!-- tab 切换 -->
      <div class="header_tabs">
        <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
          <q-tab v-for="(item,index) in tabData" :key="index" :name="item.val" :label="item.label" />
        </q-tabs>
      </div>
      <scroll-list ref="scrollListRef" menu_type="50000" :is_show_badge="false" :current_mi="state.current_mi" :menuList="state.slideMenu_sport" @changeMenu="changeMenu"/>
      <!-- 收藏 -->
      <div class="match-container">
        <MatchContainer />
      </div>
    </div>
</template>
<script setup>

import { ref, onMounted, reactive } from "vue";
import { i18n_t, MenuData } from "src/core/index.js";
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
const props = defineProps({})
const state = reactive({
  current_mi:'',//默认赛种
  slideMenu_sport: [], // 赛种
})
const tabValue = ref(1);
const scrollListRef = ref(null)
const tabData = reactive([
  {
    name:"inplay",
    label:i18n_t("menu_itme_name.inplay"),
    val:1,
  },
  {
    name:"today",
    label:i18n_t("menu_itme_name.today"),
    val:2,
  },
  {
    name:"early",
    label:i18n_t("menu_itme_name.early"),
    val:3,
  }
]);
/**
 * tabs 切换
 * @param {*} val 
 */
const on_update = (val) => {
  state.slideMenu_sport= MenuData.get_menu_lvmi_list_only(val);
  MenuData.set_current_lv1_menu(val)
  if(state.slideMenu_sport?.[0])changeMenu(state.slideMenu_sport?.[0])
  if(scrollListRef.value) scrollListRef.value.reset(state.slideMenu_sport?.[0].mi)
}
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (item) =>{
  state.current_mi = item.mi;
  MenuData.set_menu_mi(item.mi)
  MatchMeta.get_collect_match()
}
onMounted(()=>{
  MenuData.set_collect_id(50000);
  on_update(tabData[0].val)
})
</script>
<style scoped lang="scss">
.collect-wap {
  width: 100%;
  height: calc(100% - 106px);
  .header_tabs{
    border-bottom: 2px solid var(--q-gb-bd-c-1);
    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background-color: var(--q-gb-bg-c-2);
        padding: 0 10px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: right;
        .q-tab{
          flex: none;
        }
        .q-ripple{
          display: none;
        }
      }
      .q-tab__label{
        color: var(--q-gb-t-c-3);
        text-transform: capitalize;
        font-weight: 600;
      }
      .q-tab--active .q-tab__label{
        //color: #FF7000;
        color: var(--q-gb-t-c-1);
      }
      .q-tab__indicator{
        height: 3px;
        //background: #FF7000;
        background-color: var(--q-gb-bg-c-1);
      }
    }
  }
  .data-get-empty2{
    :deep(.no_data_img){
      width: 140px;
      height: 140px;
    }
  }
}

.match-container{
    height: calc(100% - 1.21rem);
    overflow: hidden;
    overflow-y: auto;
    .match-list-container{
      background-color: var(--q-gb-bg-c-2) !important;
    }
}
</style>