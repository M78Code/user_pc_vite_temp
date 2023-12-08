import { MenuData } from "src/output/index.js";

/**
 * 一级菜单展示 原逻辑
 * @param {*} all_menu 
 */
export const get_sport_menu = (all_menu) => {
    const top_menu = all_menu.filter((item) => {
        const mi = item.mi || "",
            is_today = MenuData.is_today(mi),//今日
            is_scroll_ball = MenuData.is_scroll_ball(mi),//滚球
            is_vr = MenuData.is_vr(mi),//VR
            is_esports = MenuData.is_esports(mi);//电竞
        return is_today || is_scroll_ball || is_vr || is_esports;
    })
    return [top_menu]
}
/**
 * 一级菜单展示
 * @param {*} all_menu 
 */
// export const get_sport_menu = (all_menu) => {
//   const top_menu = all_menu.filter((item)=>{
//     const mi = item.mi || "",
//     is_today = MenuData.is_today(mi),//今日
//     is_scroll_ball = MenuData.is_scroll_ball(mi),//滚球
//     is_zaopan = MenuData.is_zaopan(mi),//早盘 
//     is_mix = MenuData.is_mix(mi),//串关
//     is_kemp = MenuData.is_kemp(mi);//冠军
//     return is_today || is_scroll_ball|| is_zaopan || is_mix || is_kemp;
//   })
//   return [top_menu]
// }