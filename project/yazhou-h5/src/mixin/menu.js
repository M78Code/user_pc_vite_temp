import { watch, computed, ref } from "vue";
import { MenuData } from 'src/core/'
const { menu_type, update_time } =
    MenuData;
//是否 滚球
const is_scroll_ball = computed(() => {
    return MenuData.is_scroll_ball(menu_type.value);
});
//是否 电竞
const is_export = computed(() => {
    return MenuData.is_export(menu_type.value);
});
//是否 vr
const is_vr = computed(() => {
    return MenuData.is_vr(menu_type.value);
});
//是否 赛果
const is_results = computed(() => {
    return MenuData.is_results(menu_type.value);
});
//是否 赛果
const is_zaopan = computed(() => {
    return MenuData.is_zaopan(menu_type.value);
});
//是否 今日
const is_today = computed(() => {
    return MenuData.is_today(menu_type.value);
});
//是否 串关
const is_mix = computed(() => {
    return MenuData.is_results(menu_type.value);
});
//是否 冠军
const is_kemp = computed(() => {
    return MenuData.is_kemp(menu_type.value);
});
//是否 禁足
const is_jinzu = computed(() => {
    return MenuData.is_jinzu(menu_type.value);
});
const menu_lv1 = ref(MenuData.current_lv_1_menu)//1级 大类
const menu_lv2 = ref(MenuData.current_lv_1_menu)//2级 球种
const menu_lv3 = ref(MenuData.current_lv_1_menu)//3级 日期
const menu_lv4 = ref(MenuData.current_lv_1_menu)//4级 联赛
watch(update_time, () => {
    menu_lv1.value = MenuData.current_lv_1_menu;//1级
    menu_lv2.value = MenuData.current_lv_2_menu;//2级
    menu_lv3.value = MenuData.current_lv_3_menu;//3级
    menu_lv4.value = MenuData.current_lv_4_menu;//4级
});
export {
    is_jinzu, is_kemp, is_mix, is_vr, is_zaopan, is_export, is_scroll_ball, is_today, is_results, menu_type, menu_lv1, menu_lv2
}