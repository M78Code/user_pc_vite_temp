<template>
    <template v-if="MenuData.is_results()">
        <navigation-bar :centerFlex="6" centerContentType="switch" borderBottomNoShow :goBackAssign="goBackAssign">
            <template v-slot:center>
                <div class="switch-box">
                    <div v-for="(item, index) in switchMenu" :key="'swtich-' + index" @click="switchHandle(item.val)"
                        :class="['switch-item', state.currentSwitchValue === item.val && 'switch-item-active']">
                        <span> {{ item.name }} </span>
                    </div>
                </div>
            </template>
            <template v-if="state.currentSwitchValue !== 3" v-slot:right>
                <img
                    class="right-icon"
                    @click="filterChange()"
                    :src="compute_local_project_file_path('/image/svg/navbar_icon.svg')"
                    alt=""
                />
            </template>
        </navigation-bar>
        
        <!-- <div class="slide-box">
            <div v-for="(item, index) in state.slideMenu" @click="slideHandle(item,index,$event)" :class="['slide-item', state.currentSlideValue == item.field1 &&
                'slide-item-active']" :key="'slide-' + index">
                <span>{{ index? item.date:i18n_t('menu_itme_name.today') }}</span>
            </div>
        </div> -->
        <DateTab @changeDate="setDate" ref="RsDateTabMenu" :dataList="dataList"  />
        <!-- <ScrollMenu v-if="state.slideMenu_sport.length" :scrollDataList="menu_list" :is_show_badge="false" :current_mi="state.current_mi" @changeMenu="set_scroll_current"/> -->
        <ScrollMenu v-if="menu_list.length" :scrollDataList="menu_list" :is_show_badge="false" :current_mi="current_mi" @changeMenu="set_scroll_current"/>
        <div class="tab-wrapper"  v-if="state.currentSwitchValue == 2">
        <!-- <div class="tab-wrapper" v-if="state.currentSwitchValue == 2"> -->
            <div class="tab-item" :class="{active:i == state.tab_item_i}" v-for="(tab_item,i) of state.tab_items.find(n=>{return +n.menuId == MenuData.current_lv_2_menu?.sport_id})?.subList"
            :key="i" @click="changeLeagueVr(tab_item.menuId,i)">
            <div>{{tab_item.name}}</div>
            </div>
        </div>
        <MatchContainer/>
    </template>

     <!-- 筛选+搜索  已脱离文档流-->
     <div v-if="state.select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="select_dialog = false" />
        <setect-league @closedHandle="state.select_dialog = false"></setect-league>
    </div>

</template>
<script setup>
// import lodash_ from 'lodash'
import { ref, reactive,computed, nextTick, onMounted } from "vue";
import { ScrollMenu,DateTab } from 'src/base-h5/components/menu/app-h5-menu/index'
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
// import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
// import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
// import { api_analysis } from "src/api/"
import MatchFold from 'src/core/match-fold/index.js'
import { MenuData,compute_local_project_file_path } from "src/output/index.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt";
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";
// import BaseData from "src/core/base-data/base-data.js";
import setectLeague from 'src/base-h5/components/tutorial/navigation-bar/setect-league.vue'
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import {api_common } from "src/api/index.js";
import { dianjing_sublist } from "src/output/module/constant-utils.js"
const inner_height = window.innerHeight;  // 视口高度
const switchMenu = [
    {
        name:i18n_t('app_h5.match.normal_results'),
        val:0
    },
    {
        name: i18n_t('app_h5.match.game_results'),
        val:1
    },
    {
        name:i18n_t('app_h5.match.championship_results'),
        val:3
    }
]
/**
 * 赛果日期格式
 */
 const dataList = reactive(dateTabList(new Date(new Date().getTime() - 24 * 60 * 60 * 1000),[{ name: "今日", val: new Date().setHours(0, 0, 0, 0) }],[],1));
/**
 * 默认值
 */
 const state = reactive({
    currentSwitchValue: MenuData.get_results_type()||0, // 普通赛果：0  电竞赛果：1 vr赛果：2 冠军赛果：3
    currentSlideValue: MenuData.data_time || dataList[0].val, // 日期数 目前slideMenu写死
    select_dialog:false,
    setting_dialog: false,
    slideMenu_date: [], // 时间
    slideMenu_sport: [], // 赛种
    matchs_data: [],
    tab_items:[],
    tid:"",
    tab_item_i:0
})
 /**
 * 球种列表
 */
const menu_list = computed(()=>{
    let arr = []
    switch (state.currentSwitchValue) {
        case 0:
            arr = MenuData.menu_list.map(item=>{return {...item,sport_id:+item.mi-100,result_mi:+item.mi-100}});
            break;
        case 1:
            // arr = BaseData.dianjing_sublist.map(item=>{return {...item,sport_id:+item.mi-2000,result_mi:+item.mi}});
            arr = dianjing_sublist().map(item=>{return {...item,sport_id:+item.mi-2000,result_mi:+item.mi}});
            break;
        case 2:
            arr = MenuData.get_menu_lvmi_special_list(300).map(item=>{return {...item,sport_id:+item.mi-30000,result_mi:+item.mi}});
            break;
        case 3:
            arr = [];
            break;
    }
    return arr;
})
const current_mi = ref(MenuData.current_lv_2_menu?.mi||menu_list.value[0]?.mi)


/**
 * 时间切换
 */
const setDate = () =>{
    state.currentSlideValue = MenuData.data_time;
    //调用接口
    get_date_matches_list();
}
/**
 * 筛选点击
 */
const filterChange = () =>{
    if(state.currentSwitchValue !==3)state.select_dialog = true;
}
/**
 * 联赛点击
 * @param {*} tid 
 * @param {*} i 
 */
const changeLeagueVr = (tid,i) =>{
    if(state.tab_item_i == i)return;
    state.tab_item_i = i;
    state.tid = tid
    MenuData.set_results_vr_type(i);
    get_date_matches_list();
}
/**
 * 暂时获取联赛接口  后期国际化从init取 目前init没有国际化
 */
const get_vr_menu_list = async () =>{
    const res = await api_common.get_virtual_menu({device: 'V1_H5'});
    if(res && res.code =='200'){
        return res.data
    }
    return [];
}
/**
 * 设置vr联赛id
 * @param {*} menu_mi 
 * @param {*} index 
 */
const setTid = (menu_mi,index) =>{
    const tid = state.tab_items.find(n=>{return +n.menuId == menu_mi.sport_id})?.subList?.[index]?.menuId;
    state.tid = tid;
    state.tab_item_i = index;
}
/**
 * 头部切换
 * @param {*} val 
 * @param {*} type 
 */
const switchHandle = async(val,type) => {
    state.currentSwitchValue = val
    MenuData.set_result_menu_lv1_mi(val)
    state.matchs_data = []
    MenuData.set_results_type(val)
    const menu_mi = MenuData.current_lv_2_menu?.mi && type?MenuData.current_lv_2_menu:menu_list.value[0];
    if(val !== 2)return set_scroll_current(menu_mi);
    state.tab_items =  await get_vr_menu_list();
    const index = MenuData.is_results_vr_type && type?MenuData.is_results_vr_type:0;
    return set_scroll_current(menu_mi,index)
}
/**
 * 获取数据
 */
const get_date_matches_list = async (item)=>{
    state.matchs_data = []
    item = item || MenuData.current_lv_2_menu?.mi?MenuData.current_lv_2_menu:menu_list.value[0];
    MatchFold.clear_fold_info()
    MatchMeta.clear_match_info()
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, { state: false })
    if(item?.sport_id){
        let params = {
            mi:item.mif,
            md:state.currentSlideValue,
            sport:item.sport_id
        }
        MenuData.set_result_menu_api_params(params)
    }
    switch (+state.currentSwitchValue) {
        case 0:
        case 1:
            nextTick(async () => {
                state.matchs_data = await MatchMeta.get_results_match();
            })
            break;
        case 2:
            nextTick(async () => {
                state.matchs_data = await MatchMeta.get_virtual_results_match(state.tid);
            })
            break;
        case 3:
            let params = {
                md:state.currentSlideValue,
            }
            MenuData.set_result_menu_api_params(params)
            state.matchs_data = await MatchMeta.get_champion_match_result()
            break;
        default:
            break;
    }
}

// 设置滑动菜单的选中id
const set_scroll_current = (item,index) => {
    index = index ||0;
    state.matchs_data = []
    if(item){
        current_mi.value = item.mif ||item.mi;
        MenuData.set_current_lv_2_menu_i(item);
    }
    if(state.currentSwitchValue == 2){
        setTid(item,index)
    }
    get_date_matches_list(item)
}

const goBackAssign = () => {
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    MenuData.set_current_lv1_menu(2);
    MenuData.set_current_lv_2_menu_i({});
    MenuData.set_results_type(0)
}

// onMounted(() => {
if(MenuData.is_esports())MenuData.set_top_menu_title({})
MenuData.set_current_lv1_menu(28)//设置为赛果
switchHandle(MenuData.get_results_type()||0,1)
MenuData.search_data_tab_index();
// })

</script>
<style scoped lang="scss">
@import "./index.scss";
.select-mask{
   overflow: hidden;
}
</style>