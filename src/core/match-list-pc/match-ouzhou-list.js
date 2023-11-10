import { reactive, ref } from "vue";



class MatchListOuzhouClass {
    constructor() {
        this.init()
    }
    init() {
        // matches
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

        // 15mins

        this.orderDetailList= [{
            sportId: '',
            matchId: '',
            tournamentId: '',
            scoreBenchmark: '',  //比分
            marketId: '', //盘口ID
            playOptionsId: '', //投注项id
            marketTypeFinally: '',  // 欧洲版默认是欧洲盘 HK代表香港盘
            odds: null,  //十万位赔率
            oddFinally: null, //最终赔率
            playName: '', //玩法名称
            sportName: '', //球种名称
            matchType: '',  //赛事类型
            matchName: '', //赛事名称
            playOptionName: '',
            playOptions: '',
            tournamentLevel: '', //联赛级别
            playId: null, //玩法ID
            dataSource: '', //数据源
            home: '', //主队名称
            away: '', //客队名称
          }] // 投注信息
          this.current_check_betId = ref(null)
          this.betFooterInfo= {
            bet_state: false, // 投注状态 是否投注
            state: false, // 投注框底部状态
            title:'', // 投注信息展示
          }
          this.bet_layer_state= false // 投注窗盘口信息状态 
          this.bet_show_state= false // 投注窗状态 
          this.tip_show_state= false // 投注窗状态 

    }

    set_menu (state) {
        this.redux_menu = state
    }

}


export default new MatchListOuzhouClass()