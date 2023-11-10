import { reactive, ref } from "vue";



class MatchListOuzhouClass {
    constructor() {
        this.init()
    }
    init() {
        this.redux_menu= {
            menu_list: [
                101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
                114, 104, 106, 118,
              ], // 左侧菜单列表
            top_events: [], // top_event 菜单列表
            in_play: [], // 滚球菜单列表
            menu_root: 1, // 菜单的 root 节点   root ： 1 首页  2 滚球  3 my bets   4 左侧赛种
            menu_left: 1,  // 左侧菜单 赛种菜单id
            menu_id_euid:"", // 菜单对应的euID
            menu_id_euid_ealy:'', // 菜单对应的 早盘 euID
            mid_tab_type:'', // header tab切换
            mid_tab_menu_type:1, // header tab切换对应的 赛种菜单id 或者 时间 (左侧赛种菜单对应的 matches 今日 2 其他日期为 3)  或者 联赛类型
            mid_right_bg: 0 , // header 右上角对应的赛种
        }
        this.coom_soon = ref(false)

    }

    set_menu (state) {
        this.redux_menu = state
    }

}


export default new MatchListOuzhouClass()