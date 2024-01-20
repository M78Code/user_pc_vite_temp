<template>
    <div class="esports-page">
        <!-- tab 切换 -->
        <div class="header_tabs">
            <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
                <q-tab v-for="(item, index) in BaseData.dianjing_sublist" :name="item.mi" :label="BaseData.menus_i18n_map[item.mi]" />
            </q-tabs>
        </div>
        <tab-date v-if="state.slideMenu" :defaultVal="state.currentSlideValue"  :dateList="state.slideMenu" @changeDate="changeDate"/>
        <!--二级赛事列表-->
        <div class="match-list-page">
            <MatchContainer />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref ,reactive } from "vue";
import { MenuData  } from "src/output/index.js";
import BaseData from 'src/core/base-data/base-data.js'
import tabDate from './tab-date.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

const state = reactive({
    slideMenu:[],
    currentSlideValue:""
})
const tabValue = ref(MenuData.current_lv_2_menu_mi.value || '');
/**
 * 获取时间
 */
const getDateList = async (csid) =>{
    const list = await MenuData.getDateList(+csid-2000);
    state.slideMenu = list;
    MatchMeta.get_esports_match()
}
// tabs 切换
const on_update = (val) => {
    // if(tabValue.value == val)return;
    tabValue.value = val;
    MenuData.set_menu_mi(val);
    getDateList(val);
}
/**
 * 时间点击
 * @param {*} item 
 */
 const changeDate = (item,index) =>{
    if (state.currentSlideValue === item.val) return
    state.currentSlideValue = item.val
}
onMounted(()=>{
    MenuData.set_menu_mi(+MenuData.current_lv_2_menu_mi.value || 2100);
    getDateList(tabValue.value)
})
</script>
<style scoped lang="scss">
    .esports-page{
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header_tabs{
            border-bottom: 2px solid #FF7000;
            :deep(.q-tabs--dense){
            .scroll--mobile{
                height: 50px;
                background-color: var(--q-gb-bg-c-2);
                padding: 0 10px;
                background-repeat: no-repeat;
                background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
                background-size: contain;
                background-position: right;
                .q-tab{
                flex: none;
                padding:0 0.05rem;
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
        .match-list-page {
            background-color: #e2e2e2 !important;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            position: relative;

            .match-list-container {
                height: 100%;
                background-color: var(--q-gb-bg-c-2) !important;

                :deep(.scroll-wrapper) {
                // background-color: var(--q-gb-bg-c-2) !important;

                    .s-w-item {
                        background-color: var(--q-gb-bg-c-2) !important;
                    }
                }
            }
     
        }
    }
</style>