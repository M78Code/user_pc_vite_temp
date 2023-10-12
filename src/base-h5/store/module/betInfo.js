/*
 * @Description: 投注信息管理器
 */
const initialState = {
  orderDetailList: [{
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
  }], // 投注信息
  current_check_betId: null,
};

export default function betInfoReducer(state = initialState, action) {
  switch (action.type) {
     // 保存投注信息
    case "SET_BET_INFO":
      return {...state, orderDetailList: action.data };
      // 当前选中的赔率id 用于全局互斥 卡片高亮
    case "SET_BET_ID":
      return {...state, current_check_betId: action.data };
    default:
      return state;
  }
}
