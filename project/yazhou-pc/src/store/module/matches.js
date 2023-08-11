/*
 * @Author: lockie
 * @Date: 2023-07-05 13:29:07
 * @FilePath: \user-pc-vue3\src\store-redux\module\matches.js
 * @Description: 主页信息状态管理器
 */

const initialState = {
  current_score_info: {}, // 确定当前选中筛选项(主页顶部筛选)
};

export default function matchesReducer(state = initialState, action) {
  switch (action.type) {
     // 保存投注信息
    case "SET_SCORE_INFO":
      return {...state, current_score_info: action.data };
    default:
      return state;
  }
}
