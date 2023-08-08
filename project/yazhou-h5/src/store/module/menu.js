/*
 * @Description: 菜单store
 */
const initialState = {
  current_menu: {},//读取默认选中菜单
};
export default function menuReducer(state = initialState, action) {
  switch (action.type) {
     // 设置菜单信息
    case "SET_MENU":
      return {...state, current_menu: action.data };
    default:
      return state;
  }
}
