import { reactive } from "vue"
import { MenuData } from "src/output";
export const store = reactive({
    tabModel: false, //下拉框
    dateIndex: 0, //下拉框选择
    menu_time: '',
    second_tab_index: 0, //单日选择
    area_tab_index: 0,
    current_menu_mi: '101',
    areaList: [],
    selectArea: {}, // league 当前选择的地区
    tabActive: 'Matches',
    leaguesMatchs: [], // top-leagues页面的渲染数据
    isLeagueDetail: false, // league 是否为联赛点击后的列表页
    selectLeague: {}, // league 当前选择的联赛
    curSelectedOption: {},
    selectOptions: [
        { label: 'ouzhou.match.select_time.12h', time: "12hours", timestamp: 12 }, //12小时后的时间戳
        { label: 'ouzhou.match.select_time.24h', time: "24hours", timestamp: 24 },
        { label: 'ouzhou.match.select_time.72h', time: "3day", timestamp: 72 },
        { label: 'ouzhou.match.select_time.168h', time: "7day", timestamp: 168 },
    ],
    tabOptions: MenuData.match_tab_list?.length ? MenuData.match_tab_list : [
        'Matches',
        'League',
        'Outrights'
    ],
})