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
      <scroll-list ref="scrollListRef" :is_show_badge="false" menu_type="50000" :current_mi="state.current_mi" :menuList="state.slideMenu_sport" @changeMenu="changeMenu"/>
      <!-- 收藏 -->
      <div class="match-container">
        <MatchContainer />
      </div>
    </div>
</template>
<script setup>

import { ref, onMounted, reactive, onUnmounted } from "vue";
import { i18n_t, MenuData } from "src/output/index.js";
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import BaseData from 'src/core/base-data/base-data.js'
import { api_common } from "src/api/index.js";
// import PageSourceData from "src/core/page-source/page-source.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useMittOn,MITT_TYPES } from "src/output"
const props = defineProps({})
const state = reactive({
  current_mi:'',//默认赛种
  slideMenu_sport: [], // 赛种
})
const tabValue = ref(MenuData.collect_menu || 1);
const scrollListRef = ref(null);
// const timer = ref(null);//5秒 加载收藏数量
const tabData = ref([
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
  },
  {
    name:"outrights",
    label: i18n_t("menu_itme_name.champion"),
    val:400
  },
  {
    name:"esports",
    label: i18n_t("menu_itme_name.esports"),
    val:2000
  }
]);
/**
 * tabs 切换
 * @param {*} val 
 */
const on_update = async (val,type) => {
  val = val || tabValue.value;
  switch (val) {
    //冠军
    case 400:
    state.slideMenu_sport = MenuData.champion_list;
      break;
    //电竞
    case 2000:
    state.slideMenu_sport = BaseData.dianjing_sublist;
      break;
    default:
    state.slideMenu_sport = MenuData.get_menu_lvmi_list_only(val);
      break;
  }
  // timer.value && clearTimeout(timer.value);
  // state.slideMenu_sport = await getListCount(val == 400?MenuData.champion_list:MenuData.get_menu_lvmi_list_only(val),val);
  // state.slideMenu_sport =val == 400?MenuData.champion_list:MenuData.get_menu_lvmi_list_only(val);
  // state.slideMenu_sport= MenuData.get_menu_lvmi_list_only(val);
  MenuData.set_current_lv1_menu(val);
  const index = MenuData.collect_menu?state.slideMenu_sport?.findIndex(n=>{return n.mi == MenuData.menu_mi.value}):0;
  changeMenu(state.slideMenu_sport?.[index !== -1 && type?index:0])
  MenuData.set_collect_menu(val);
  if(scrollListRef.value) scrollListRef.value.reset(state.slideMenu_sport?.[0].mi)
}
/**
 * 获取收藏球种数量
 */
const getListCount = async (list,type) =>{
  let collect = JSON.parse(JSON.stringify(list))|| [];
  let euid_list = [];
    // 获取对应的旧菜单id    
    euid_list = collect.map((item,index)=>{
      return MenuData.get_mid_for_euid(type==400?`${+item.mi+300}`:`${item.mi}${type}`);
    })
    euid_list = euid_list.toString()
    let type_ = {
        1:1,
        2:3,
        3:4,
        400:100,
    }
    let parmas = {
        //20001 冠军 的收藏id 传固定的
        euid: type == 400 ? 20001 : euid_list,
        //排序	 int 类型 1 按热门排序 2 按时间排序
        sort: 1,
        //1：滚球，2：即将开赛，3：今日赛事，4：早盘，100：冠军
        type: type_[type], 
        cuid: UserCtr.get_cuid(),
    }
    const res = await api_common.get_collect_menu_count_h5(parmas)
    if(res && res.code == 200){
        let collect_list = res.data || []
        collect = collect.map(item=>{
            item.ct = 0
            collect_list.forEach(obj=>{
                if(obj.sportId){
                    if(type == 400){
                        if(+item.mi+300 == (type + obj.sportId*1)){
                            item.ct = obj.count
                        }
                    }else{
                        if(item.mi == (100 + obj.sportId*1)){
                            item.ct = obj.count
                        }
                    }
                }
            })
            return item
        })
    }
    // timer.value = setTimeout(()=>getListCount(list,type),5000);
    return collect
}
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (item) =>{
  if(!item?.mi)return;
  state.current_mi = item.mi;
  MenuData.set_menu_mi(item.mi)
  // 收藏页
  if (MenuData.is_esports()) {
    // 电竞收藏
    MatchMeta.get_esports_collect_match()
  } else {
    // 常规收藏
    MatchMeta.get_collect_match()
  }
}
const mitt_list=[]
onMounted(()=>{
  let tabList = tabData.value;
  if(!MenuData.menu_list.map((item)=>{return +item.mi}).includes(400)){
    tabList.pop();
    tabData.value = tabList;
  };
  MenuData.set_collect_id(50000);
  const index = tabData.value.findIndex(n=>{return n.val == tabValue.value});
  on_update(tabData.value[index].val,1)
  if(scrollListRef.value) scrollListRef.value.reset(state.current_mi);
  mitt_list.push(useMittOn(MITT_TYPES.EMIT_COLLECT_MATCH_OZ, on_update).off)
})
onUnmounted(() => {
  MenuData.set_collect_id('');
  mitt_list.forEach(i=>i())
  // useMittOn(MITT_TYPES.EMIT_COLLECT_MATCH_OZ).off
  // timer.value && clearTimeout(timer.value);
})
</script>
<style scoped lang="scss">
.collect-wap {
  width: 100%;
  // height: calc(100% - 106px);
  height: 100%;
  display: flex;
  flex-direction: column;
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
    // height: calc(100% - 1.71rem);
    // height: calc(100% - 1.21rem);
    height: 0;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .match-list-container{
      background-color: var(--q-gb-bg-c-2) !important;
    }
}
</style>