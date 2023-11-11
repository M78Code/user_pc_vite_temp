<template>
    <scroll-result menu_type="28" :is_show_badge="false" :current_mi="state.current_mi" :menuList="state.slideMenu_sport" @changeMenu="changeMenu"/>
    <div class="match-container">
        <date-tab v-if="state.slideMenu" :defaultVal="state.currentSlideValue"  :dateList="state.slideMenu" @changeDate="changeDate"/>
        <match-container />
    </div>
    <!--  弹窗  -->
    <div v-if="state.select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="state.select_dialog = false"></div>
        <!-- 搜索联赛 -->
        <setect-league @closedHandle="state.select_dialog = false" @finishHandle="selectFinishHandle"></setect-league>
    </div>

    <!-- 设置 -->
    <!-- <match-container2 /> -->

</template>
<script setup>
import lodash_ from 'lodash'
import { watch,onMounted, onBeforeMount, reactive,ref,nextTick } from "vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import matchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/core/index.js";
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import scrollResult from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-result.vue';
import dateTab from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/date-tab/date-tab.vue';
import { api_analysis } from "src/api/"
// watch(() => MenuData.update_time.value, () => {
//   console.log("菜单id-球类id-对应euid",`${MenuData.menu_type.value}-${MenuData.menu_mi.value}-${MenuData.get_euid()}`)
// })

// import matchContainer2 from "src/base-h5/components/match-list/components/match-container-2.vue";
const inner_height = window.innerHeight;  // 视口高度
const props = defineProps({})
const state = reactive({
    select_dialog:false,
    currentSlideValue:"",
    slideMenu:[],
    slideMenu_date: [], // 时间
    slideMenu_sport: [], // 赛种
})
const selectFinishHandle = (val) => {
    console.log('选择完成')
    state.select_dialog = false
}
const changeDate = (item) =>{
    if (state.currentSlideValue === item.val) return
    state.currentSlideValue = item.val
    // set_scroll_data_list(item.sportList)
     getData(state.slideMenu_sport.filter((item)=>{return item.mi === state.current_mi})[0],lodash_.get(item.subList,'[0].field1', ''))
}
const changeMenu = (item) =>{
    if (state.current_mi === item.mi) return
    state.current_mi = item.mi;
    state.slideMenu = item.subList;
    state.currentSlideValue = lodash_.get(item.subList,'[0].field1', '');
    getData( item,lodash_.get(item.subList,'[0].field1', ''));
}
const switchHandle = async ()=> {
    const res = await  api_analysis.get_result_menu();
    //获取 赛果菜单
    // api_analysis.get_match_result_menu( {menuType:0} ).then( ( res = {} ) => {
        if(res.code == 200){
            console.log(222222)
            console.log(res)
            let scroll_data = res.data.map( item => {
                return {
                    mi: 100+item.sportId*1 + '',
                    ct: item.count,
                    md: item.date,
                    sport: item.sportId,
                    subList:item.subList.map((n)=>{
                        return {
                            val:n.field1,
                            ...n
                        }
                    })
                }
            })
            state.slideMenu_sport = scroll_data
            state.current_mi = scroll_data[0].mi
            state.slideMenu = scroll_data[0].subList
            state.currentSlideValue = lodash_.get(scroll_data[0].subList,'[0].field1', '')
            // 设置赛种数据
            // set_scroll_data_list(lodash_.get(res.data,'[0].subList', []))
            getData( scroll_data[0],lodash_.get(scroll_data[0].subList,'[0].field1', ''))
        }
    // })
}
// 设置赛种列表
const set_scroll_data_list = (data_list = []) => {
    // let scroll_data = data_list.map( item => {
    //     return {
    //         mi: 100+item.sportId*1 + '',
    //         ct: item.count,
    //         md: item.date,
    //         sport: item.sportId,
    //     }
    // })
    // state.slideMenu_sport = scroll_data
    // state.current_mi = scroll_data[0].mi
    // state.slideMenu = data_list.map((item)=>{
    //     return {
    //         val:item.field1,
    //         ...item
    //     }
    // })
    // // 设置时间默认选中
    // state.currentSlideValue = lodash_.get(data_list,'[0].field1', '')
    MenuData.set_result_menu_api_params(scroll_data[0])
    MatchMeta.get_results_match()
}
const getData = (item,date) =>{
    let params = {
        mi:item.mi,
        md:date
    }
    MenuData.set_result_menu_api_params(params)
    MatchMeta.get_results_match()
}
onMounted(()=>{
    // set_menu_lv1({mi:28})
    switchHandle()
})

// const set_menu_lv1 = item => {
//     MenuData.set_current_lv1_menu(item.mi);
//     MenuData.get_menu_lvmi_list(item.mi)
//     // MenuData.get_results_menu();
//     setTimeout(() => {
//         MatchMeta.get_results_match()
//     }, 2000)
// }

// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
.match-container{
    height: calc(100% - 1.71rem);
    overflow: hidden;
    overflow-y: auto;
}
</style>
