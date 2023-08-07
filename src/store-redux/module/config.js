
const initialState = {
  config: {
    inner_width: 1440, // 页面宽度
    multi_column: false, // 13列玩法 足球
  },
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
     // 保存页面配置信息
    case "SETCONFIG":
      return {...state, userInfo: action.config };
    default:
      return state;
  }
}
