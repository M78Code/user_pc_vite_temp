<template>
    <template v-if="MenuData.is_results()">
        <navigation-bar :centerFlex="6" centerContentType="switch" borderBottomNoShow :goBackAssign="goBackAssign">
            <template v-slot:center>
                <div class="switch-box">
                    <div v-for="(item, index) in switchMenu" :key="'swtich-' + index" @click="switchHandle(index)"
                        :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']">
                        <span> {{ item }} </span>
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

        <!-- <ObserverWrapper class="match-result-contant" :match_list="state.matchs_data" com_type="app-h5"></ObserverWrapper> -->
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
import { onMounted, ref, reactive,computed, nextTick } from "vue";
import { ScrollMenu,DateTab } from 'src/base-h5/components/menu/app-h5-menu/index'
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
// import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
// import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
// import { api_analysis } from "src/api/"
import { MenuData,compute_local_project_file_path } from "src/output/index.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt";
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';
import BaseData from "src/core/base-data/base-data.js";
import setectLeague from 'src/base-h5/components/tutorial/navigation-bar/setect-league.vue'
import MatchContainer from "src/base-h5/components/match-list/index.vue";

// 新修改


const inner_height = window.innerHeight;  // 视口高度
const switchMenu = [i18n_t('app_h5.match.normal_results'), i18n_t('app_h5.match.game_results'), i18n_t('app_h5.match.vr_results'), i18n_t('app_h5.match.championship_results')]
/**
 * 赛果日期格式
 */
 const dataList = reactive(dateTabList(new Date(new Date().getTime()),[],[],1));
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
    matchs_data: []
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
            arr = BaseData.dianjing_sublist.map(item=>{return {...item,sport_id:+item.mi-2000,result_mi:+item.mi}});
            break;
        case 2:
            arr = MenuData.get_menu_lvmi_special_list(300).map(item=>{return {...item,sport_id:+item.mi-30000,result_mi:+item.mi}});;
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
    get_date_matches_list(MenuData.current_lv_2_menu?.mi?MenuData.current_lv_2_menu:menu_list.value[0]);
}
/**
 * 筛选点击
 */
const filterChange = () =>{
    if(state.currentSwitchValue !==3)state.select_dialog = true;
}
const switchHandle = (val,type) => {
    state.currentSwitchValue = val
    MenuData.set_result_menu_lv1_mi(val)
    state.matchs_data = []
    MenuData.set_results_type(val)
    set_scroll_current(MenuData.current_lv_2_menu?.mi && type?MenuData.current_lv_2_menu:menu_list.value[0])
    // //获取 赛果菜单
    // switch (+val) {
    //     case 0:
    //         normalAndChampionApi(0)
    //         break;
    //     case 1:
    //         break;
    //     case 2:
    //         break;
    //     case 3:
    //         state.slideMenu_sport = []
    //         MenuData.set_result_menu_api_params({
    //             md:state.currentSlideValue
    //         })
    //         state.matchs_data = await lodash_.debounce(()=>{
    //             return MatchMeta.get_champion_match_result();
    //         },1000) 
    //         console.error('get_champion_match_result')
    //         normalAndChampionApi(1)
    //         break;
    // }
    
    
}
// const normalAndChampionApi = (val) => {
//     // 赛果菜单接口 menuType 0 标准赛事，1冠军赛事
//     api_analysis.get_match_result_menu( {menuType:val} ).then( async ( res = {} ) => {
//         if(res.code == 200){
//             state.slideMenu = res.data || {}
//             const index = MenuData.data_tab_index || 0;
//             // 设置时间默认选中
//             state.currentSlideValue = lodash_.get(res.data,`[${index}].field1`, '')
//             set_scroll_data_list(lodash_.get(res.data,`[${index}].sportList`, []))
//         }
//     })
// }
// const slideHandle = (val, i,e) => {
//     if (state.currentSlideValue === val) return
//     MenuData.set_date_time(i,val.field1);
//     state.currentSlideValue = val.field1
//     set_scroll_data_list(val.sportList)
//     scrollMenuEvent(e, ".slide-box", ".switch-item-active");
// }

// // 设置赛种列表
// const set_scroll_data_list = (data_list = []) => {
//     let scroll_data = data_list.map( item => {
//         return {
//             ...item,
//             mi: 100+item.sportId*1 + ''+'1',
//             ct: item.count,
//             md: item.date,
//             sport: item.sportId,
//             mif:100+item.sportId*1
//         }
//     })
//     state.slideMenu_sport = scroll_data
//     state.current_mi = MenuData.current_lv_2_menu_i || scroll_data[0]?.mi
//     set_scroll_current(MenuData.current_lv_2_menu?.mi ?MenuData.current_lv_2_menu:scroll_data[0])
// }
/**
 * 获取数据
 */
const get_date_matches_list = async (item)=>{
    if(item?.sport_id){
        let params = {
            mi:item.mif,
            md:1703520000000+'',
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
                state.matchs_data = await MatchMeta.get_virtual_results_match();
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
    if (state.matchs_data.length) useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
}

// 设置滑动菜单的选中id
const set_scroll_current = item => {
    state.matchs_data = []
    if(item){
        current_mi.value = item.mif ||item.mi;
        MenuData.set_current_lv_2_menu_i(item);
    }
    get_date_matches_list(item)
    // if (MenuData.get_results_type() == 3) {
    //     state.slideMenu_sport = []
    //     MenuData.set_result_menu_api_params({
    //         md:state.currentSlideValue
    //     })
    //     state.matchs_data = await MatchMeta.get_champion_match_result()
    //     if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
    // } else {
    //     // 常规赛果
    //     state.current_mi = item.mi
    //     let params = {
    //         mi:item.mi,
    //         md:state.currentSlideValue,
    //         sport:item.sport
    //     }
    //     MenuData.set_result_menu_api_params(params)
    //     state.matchs_data = await MatchMeta.get_results_match()
    //     if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
    // }
   
}
// // 设置滑动菜单的选中id
// const set_scroll_current = async item => {
//     state.matchs_data = []
//     console.log('set_scroll_currentMenuData.get_results_kemp()', MenuData.get_results_type(), item)
//     if (!item) return
//     MenuData.set_current_lv_2_menu_i(item)
//     if (MenuData.get_results_type() == 3) {
//         state.slideMenu_sport = []
//         MenuData.set_result_menu_api_params({
//             md:state.currentSlideValue
//         })
//         state.matchs_data = await MatchMeta.get_champion_match_result()
//         if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
//     } else {
//         // 常规赛果
//         state.current_mi = item.mi
//         let params = {
//             mi:item.mi,
//             md:state.currentSlideValue,
//             sport:item.sport
//         }
//         MenuData.set_result_menu_api_params(params)
//         state.matchs_data = await MatchMeta.get_results_match()
//         if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
//     }
   
// }

const goBackAssign = () => {
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    MenuData.set_current_lv1_menu(2);
    MenuData.set_current_lv_2_menu_i({});
    MenuData.set_results_type(0)
}
if(MenuData.is_esports())MenuData.set_top_menu_title({})
MenuData.set_current_lv1_menu(28)//设置为赛果
switchHandle(MenuData.get_results_type()||0,1)
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>