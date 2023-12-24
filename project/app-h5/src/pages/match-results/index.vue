<template>
    <template v-if="MenuData.is_results()">
        <navigation-bar centerContentType="switch" borderBottomNoShow :goBackAssign="goBackAssign">
            <template v-slot:center>
                <div class="switch-box">
                    <div v-for="(item, index) in switchMenu" :key="'swtich-' + index" @click="switchHandle(index)"
                        :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']">
                        <span> {{ item }} </span>
                    </div>
                </div>
            </template>
            <template v-slot:right>
                <img
                    class="right-icon"
                    @click="state.select_dialog = true"
                    :src="compute_local_project_file_path('/image/svg/navbar_icon.svg')"
                    alt=""
                />
            </template>
        </navigation-bar>
        
        <div class="slide-box">
            <div v-for="(item, index) in state.slideMenu" @click="slideHandle(item,index,$event)" :class="['slide-item', state.currentSlideValue == item.field1 &&
                'slide-item-active']" :key="'slide-' + index">
                <span>{{ index? item.date:i18n_t('menu_itme_name.today') }}</span>
            </div>
        </div>

        <ScrollMenu v-if="state.slideMenu_sport.length" :scrollDataList="state.slideMenu_sport" :is_show_badge="false" :current_mi="state.current_mi" @changeMenu="set_scroll_current"/>

        <ObserverWrapper class="match-result-contant" :match_list="state.matchs_data" com_type="app-h5"></ObserverWrapper>
    </template>
    <!-- <div class="match-results-container-styles">
       
        <match-container />
    </div> -->

    <!-- <div v-if="state.select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="state.select_dialog = false"></div>
        <setect-league @closedHandle="state.select_dialog = false" @finishHandle="selectFinishHandle"></setect-league>
    </div> -->

</template>
<script setup>
import lodash_ from 'lodash'
import { onMounted, onUnmounted, reactive } from "vue";
import { ScrollMenu } from 'src/base-h5/components/menu/app-h5-menu/index'
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { api_analysis } from "src/api/"
import { MenuData,compute_local_project_file_path } from "src/output/index.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt";

import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';


// 新修改


const inner_height = window.innerHeight;  // 视口高度
const switchMenu = ['普通赛果', '冠军赛果']

const state = reactive({
    currentSwitchValue: 0, // 普通赛果：0  冠军赛果：1
    currentSlideValue: 0, // 日期数 目前slideMenu写死
    select_dialog:false,
    setting_dialog: false,
    slideMenu_date: [], // 时间
    slideMenu_sport: [], // 赛种
    current_mi: '', // 当前选中的赛种
    matchs_data: []
})

const switchHandle = async val => {
    state.currentSwitchValue = val
    MenuData.set_result_menu_lv1_mi(val)
    state.matchs_data = []
    //获取 赛果菜单
    if (val) {
        MenuData.set_results_kemp(1)
        state.slideMenu_sport = []
        MenuData.set_result_menu_api_params({
            md:state.currentSlideValue
        })
        state.matchs_data = await MatchMeta.get_champion_match_result()
    } else {
        MenuData.set_results_kemp(0)
    }
    api_analysis.get_match_result_menu( {menuType:val} ).then( async ( res = {} ) => {
        if(res.code == 200){
            state.slideMenu = res.data || {}
            const index = MenuData.data_tab_index || 0;
            // 设置时间默认选中
            state.currentSlideValue = lodash_.get(res.data,`[${index}].field1`, '')
            // if (val) {
            //     MenuData.set_result_menu_api_params({
            //         mi: 10000,
            //         md:state.currentSlideValue,
            //         sport: 1
            //     })
            //     // 冠军赛果
            //     state.matchs_data = await MatchMeta.get_champion_match_result()
            // } else {
                // 设置赛种数据
            set_scroll_data_list(lodash_.get(res.data,`[${index}].sportList`, []))
            // }
        }
    })
    
}
const slideHandle = (val, i,e) => {
    if (state.currentSlideValue === val) return
    MenuData.set_date_time(i,val.field1);
    state.currentSlideValue = val.field1
    set_scroll_data_list(val.sportList)
    scrollMenuEvent(e, ".slide-box", ".switch-item-active");
}

// 设置赛种列表
const set_scroll_data_list = (data_list = []) => {
    let scroll_data = data_list.map( item => {
        return {
            ...item,
            mi: 100+item.sportId*1 + ''+'1',
            ct: item.count,
            md: item.date,
            sport: item.sportId,
            mif:100+item.sportId*1
        }
    })
    state.slideMenu_sport = scroll_data
    state.current_mi = MenuData.current_lv_2_menu_i || scroll_data[0]?.mi
    set_scroll_current(MenuData.current_lv_2_menu?.mi ?MenuData.current_lv_2_menu:scroll_data[0])
}

// 设置滑动菜单的选中id
const set_scroll_current = async item => {
    state.matchs_data = []
    console.log('set_scroll_currentMenuData.get_results_kemp()', MenuData.get_results_kemp(), item)
    if (!item) return
    MenuData.set_current_lv_2_menu_i(item)
    if (MenuData.get_results_kemp()) {
        state.slideMenu_sport = []
        MenuData.set_result_menu_api_params({
            md:state.currentSlideValue
        })
        state.matchs_data = await MatchMeta.get_champion_match_result()
        if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
    } else {
        // 常规赛果
        state.current_mi = item.mi
        let params = {
            mi:item.mi,
            md:state.currentSlideValue,
            sport:item.sport
        }
        MenuData.set_result_menu_api_params(params)
        state.matchs_data = await MatchMeta.get_results_match()
        if (state.matchs_data.length > 0)  useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
    }
   
}

const goBackAssign = () => {
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    MenuData.set_current_lv1_menu(2);
    MenuData.set_current_lv_2_menu_i({});
    MenuData.set_results_kemp(0)
}
MenuData.is_esports() && MenuData.set_top_menu_title({})//从电竞过来 这个菜单没有制空 所以菜单不对 判断了是 电竞
MenuData.set_current_lv1_menu(28)//设置为赛果
switchHandle(0)

</script>
<style scoped lang="scss">
@import "./index.scss";
</style>