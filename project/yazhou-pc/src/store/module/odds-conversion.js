const initialState = {
  // 从服务器拉取到的 赔率转换表
  odds_coversion_map: "",
};

export default function oddsConversionReducer(state = initialState, action) {
  switch (action.type) {
    //设置左侧列表显示状态
    case "SET_ODDS_COVERSION_MAP":
      return { ...state, odds_coversion_map: action.data };
    default:
      return state;
  }
}
