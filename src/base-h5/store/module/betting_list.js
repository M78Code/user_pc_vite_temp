/*
 * @Description: 投注列表 store
 */

const initialState = {
    // 合并投注项弹框提示是否显示
    combine_tips_show: false,

  }

  export default function bettingListReducer(state = initialState, action) {
    switch (action.type) {
      // 合并投注项弹框提示是否显示
      case "SET_COMBINE_TIPS_SHAOW":
        return { ...state, combine_tips_show: action.data };
      // 默认
      default:
        return state;
    }
  }