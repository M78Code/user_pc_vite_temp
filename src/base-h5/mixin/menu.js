import { watch, computed, ref } from "vue";
import { MenuData } from 'src/output'
import PageSourceData from "src/core/page-source/page-source.js";
import { useRoute } from "vue-router"

const page_source = ref(PageSourceData.page_source) // 当前页面来源


const { menu_type, update_time } =  MenuData;
//是否 滚球
const is_scroll_ball = computed(() => {
    return MenuData.is_scroll_ball(menu_type.value);
});
//是否 电竞
const is_esports = computed(() => {
    return MenuData.is_esports(menu_type.value);
});
//是否 vr
const is_vr = computed(() => {
    return MenuData.is_vr(menu_type.value);
});
//是否 赛果
const is_results = computed(() => {
    return MenuData.is_results(menu_type.value);
});
//是否 早盘
const is_zaopan = computed(() => {
    return MenuData.is_zaopan(menu_type.value);
});
//是否 今日
const is_today = computed(() => {
    return MenuData.is_today(menu_type.value);
});
//是否 串关
const is_mix = computed(() => {
    return MenuData.is_mix(menu_type.value);
});
//是否 冠军
const is_kemp = computed(() => {
    return MenuData.is_kemp(menu_type.value);
});
//是否 竞足
const is_jinzu = computed(() => {
    return MenuData.is_jinzu(menu_type.value);
});
// 是否 热门
const is_hot = computed(() => {
    return MenuData.is_hot(menu_type.value);
});
// 是否 收藏
const is_collect = computed(() => {
    return MenuData.is_collect(menu_type.value);
});

//是否 详情页 用途： 赛事列表、热门、详情 引入赛事列表组件
const is_detail = computed(() => {
    return page_source.value === 'detail_match_list' 
});

//是否 详情页
const is_detail_category = () => {
    const route = useRoute()
    let is_ = page_source.value === 'detail_match_list' || ['match_result','details','category'].includes(route.name);
    return is_
}

const footer_menu_id = ''
const menu_lv1 = ref(MenuData.current_lv_1_menu)//1级 大类
const menu_lv2 = ref(MenuData.current_lv_2_menu)//2级 球种
const menu_lv3 = ref(MenuData.current_lv_3_menu)//3级 日期
const menu_lv4 = ref(MenuData.current_lv_4_menu)//4级 联赛
// 所选日期
const date_time = ref(MenuData?.data_time)
watch(update_time, () => {
    menu_lv1.value = MenuData.current_lv_1_menu;//1级
    menu_lv2.value = MenuData.current_lv_2_menu;//2级
    menu_lv3.value = MenuData.current_lv_3_menu;//3级
    menu_lv4.value = MenuData.current_lv_4_menu;//4级
    date_time.value = MenuData.data_time
});
export { update_time, footer_menu_id, date_time,
    is_jinzu, is_kemp,is_mix, is_vr, is_zaopan, is_esports, is_scroll_ball, is_today, is_results, menu_type, menu_lv1, menu_lv2, is_hot, is_detail, is_collect,is_detail_category
}