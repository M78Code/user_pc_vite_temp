<template>
    <scroll-list ref="scrollListRef" menu_type="28" :is_show_badge="false" :current_mi="state.current_mi" :menuList="state.slideMenu_sport" @changeMenu="changeMenu"/>
    <div class="match-result">
        <date-tab v-if="state.slideMenu" :defaultVal="state.currentSlideValue"  :dateList="state.slideMenu" @changeDate="changeDate"/>
        <MatchContainer />
    </div>

</template>
<script setup>
import lodash_ from 'lodash'
import { watch,onMounted, onBeforeMount, reactive,ref,nextTick, onUnmounted, computed } from "vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
// import setectLeague from 'src/base-h5/components/setect-league/index.vue'
// import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/output/index.js";
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import dateTab from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/date-tab/date-tab.vue';
import { api_analysis } from "src/api/"
import { useMittEmit, MITT_TYPES } from "src/core/mitt";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG ;
const matchs_data = ref([])
// const inner_height = window.innerHeight;  // 视口高度
const props = defineProps({})
const state = reactive({
    select_dialog:false,
    currentSlideValue:"",
    slideMenu:[],
    slideMenu_sport: [], // 赛种
})
//滚动初始化
const scrollListRef = ref(null);
// const selectFinishHandle = (val) => {
//     console.log('选择完成')
//     state.select_dialog = false
// }
/**
 * 时间点击
 * @param {*} item 
 */
const changeDate = (item,index) =>{
    matchs_data.value = []
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
    if (state.currentSlideValue === item.val) return
    state.currentSlideValue = item.val
    MenuData.set_result_menu(index);
    getData(state.slideMenu_sport.filter((n)=>{return n.mi === state.current_mi})[0],item.val)
}
/**
 * 球种点击
 * @param {*} item 
 */
const changeMenu = (item) =>{
    if (state.current_mi === item.mi) return
    state.current_mi = item.mi;
    MenuData.set_menu_mi(item.mi)
    state.slideMenu = item.subList;
    state.currentSlideValue = lodash_.get(item.subList,'[0].field1', '');
    getData( item,lodash_.get(item.subList,'[0].field1', ''));
}
/**
 * 初始化数据
 * @param {*} scroll_data 
 */
const init_data = (scroll_data) =>{
    state.slideMenu_sport = scroll_data;
    const index = scroll_data.findIndex(n=>{return n.mi == MenuData.menu_mi.value});
    state.current_mi = scroll_data[index!= -1?index:0].mi;
    state.slideMenu = scroll_data[index!= -1?index:0].subList;
    state.currentSlideValue = lodash_.get(scroll_data[index!= -1?index:0].subList,`[${MenuData.result_menu}].field1`, '');
    //初始化滚动
    scrollListRef.value?.reset(state.current_mi);
    getData( scroll_data[index!= -1?index:0],state.currentSlideValue)
}
/**
 * 格式化球种id
 * @param {*} item 
 */
const menuTypeFormat = (item) =>{
    const menuType = item.menuType;
    if(menuType<100)return +item.sportId+100;//常规
    if(menuType == 100)return 400;//冠军
    if(menuType>3000)return `2${item.sportId}`;//电竞
    return item.sportId;//默认vr 其他
}

const switchHandle = async ()=> {
    const res = await  api_analysis.get_result_menu();
    //获取 赛果菜单
    // api_analysis.get_match_result_menu( {menuType:0} ).then( ( res = {} ) => {
        if(res?.code == 200){
            //四期没有电竞vr 生产屏蔽
            let scroll_data = res.data.filter((n)=>{return IS_FOR_NEIBU_TEST?n.sportId != '0':n.sportId != '0' && +n.menuType<=100}).map( item => {
                const subList = item.subList.sort((a,b) => Number(b.field1) - Number(a.field1))
                return {
                    mi: menuTypeFormat(item),
                    ct: item.count,
                    sport: item.sportId,
                    name:item.name,
                    subList:subList.map((n)=>{
                        return {
                            val:n.field1,
                            ...n
                        }
                    })
                }
            })
            !MenuData.slideMenu_sport?.length && init_data(scroll_data)
            MenuData.set_slideMenu_sport(scroll_data);
        }
    // })
}
/**
 * 请求
 * @param {*} item 
 * @param {*} date 
 */
const getData = async (item,date) =>{
    let params = {
        mi:item.mi,
        md:date,
        sport:item.sport
    }
    MenuData.set_result_menu_api_params(params)
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, { state: false });
    try {
        matchs_data.value = await MatchMeta.get_results_match()
        useMittEmit(MITT_TYPES.EMIT_HANDLE_START_OBSERVER);
    } catch (err) {
        useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, { state: true, type: 'noWifi' });
    }
    
}
onMounted(()=>{
    VirtualList.set_is_show_ball(false)
    MenuData.set_current_lv1_menu(28)
    MenuData.slideMenu_sport?.length && init_data(MenuData.slideMenu_sport);//优先取缓存
    switchHandle();//正常加载接口  替换新数据
}) 

onUnmounted(() => {
    VirtualList.set_is_show_ball(true)
})

</script>
<style scoped lang="scss">
@import "./index.scss";
.match-result{
    display: flex;
    flex-direction: column;
    height: 0;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .match-list-container{
        height: calc(100% - 45px);
    }
}
</style>