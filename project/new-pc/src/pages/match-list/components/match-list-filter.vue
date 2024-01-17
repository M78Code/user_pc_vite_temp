<template>
    <div></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { api_filter } from "src/api/index.js";
import { MenuData } from "src/output/index.js"

const list = ref([]);

const data = reactive({
    total: null, //赛事总数
    total_league: null,
    is_active: false, //确认按钮是否激活
    all_filter_list: [],//筛选全部数据
    filter_list: [],//筛选数据
    all_select: false,// 是否全选
    load_data_state: "loading",//数据加载状态
    search_filter_data: "data",//数据加载状态
    is_suck_down:false,//确定按钮是否低吸
    hot_real_list: [], // 真正的热门数据
    un_hot_list: [], // 所有的非热门数据
    list_data: [] //接口返回数据
})

async function init() {
    console.log(MenuData, "MenuData__"); 
    // const params = {
    //   // 29 是代表 赛果里边的 我的投注的选项  筛选type入参 1滚球 3今日 4早盘 滚球走index_old.vue
    //   type: MenuData.is_results(m_type) && get_curr_sub_menu_type.value == 29 ? '29' : MenuData.menu_id_map(type.value),
    //   euid: MenuData.is_jinzu(m_type) ? m_id : MenuData.get_euid(MenuData.get_current_sub_menuid()), // menuType 30竞足
    //   inputText: props.search_val,
    //   cuid: UserCtr.get_uid(),
    //   device: 'v2_h5',
    //   md: lodash.get(MenuData.current_lv_3_menu, 'field1')
    // };
    try {
        // getFilterMatchListPB?
        // euid=3020101&
        // uuid=b9dd89606b9c4a6580479711d38ac73d&
        // pids=& 非滚球传 玩法ID
        // orpt=0& 获得当前的模板ID
        // t=1705459483196
        const res = await api_filter.get_fetch_filter_match_old({

        })
    } catch (error) {
        
    }
}

onMounted(() => {
    init();
})
</script>