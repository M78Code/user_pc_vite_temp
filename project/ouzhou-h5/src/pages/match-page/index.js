import { reactive } from "vue"

export const store = reactive({
    tabModel: false, //下拉框
    dateIndex: 0, //下拉框选择
    menu_time: '',
    second_tab_index: 0, //单日选择
    area_tab_index: 0,
    current_menu_mi: '101',
    areaList: [],
    selectArea: {}, // league 当前选择的地区
    tabActive: 'matches',
    leaguesMatchs: [], // top-leagues页面的渲染数据
    isLeagueDetail: false, // league 是否为联赛点击后的列表页
    selectLeague: {} // league 当前选择的联赛
})