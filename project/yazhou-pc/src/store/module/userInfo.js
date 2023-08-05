/**
 * @Author: cooper
 * @Date: 2023-07-02 16:13:55
 * @Description: 公共数据，存储用户信息，用户余额,菜单信息等
 */
const initialState = {
  userInfo: {},
  menu_list:[], // 菜单数据
  amount:0  //用户余额
};

export default function userReducer(state = initialState, action) {
  console.log("counterReducer------", action);
  switch (action.type) {
     // 保存用户详情
    case "SETUSER":
      return {...state, userInfo: action.data };
    case "SETAMOUNT":
      // 保存用户余额
      return { ...state, amount: action.amount };
      case "SETMENU":
        // 保存菜单数据
        return { ...state, menu_list: action.data };
    default:
      return state;
  }
}
