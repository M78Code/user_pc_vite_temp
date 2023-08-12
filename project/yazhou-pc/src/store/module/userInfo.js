/**
 * @Description: 公共数据，存储用户信息，用户余额,菜单信息等
 */
const initialState = {
  uuid: "",
  // 用户信息
  user: '',
  show_balance: true,
  show_login_popup: {
    isShow: false,
    redirect: null
  },
  is_invalid: false,  //token是否失效
  // 用户是否长时间未操作
  is_user_no_handle: false,
  // 是否首次登录
  is_new_user: false
};

export default function userReducer(state = initialState, action) {
  console.log("counterReducer------", action);
  switch (action.type) {
    //设置用户id
    case "SET_UUID":
      return { ...state, uuid: action.data };
    //设置用户信息
    case "SET_SHOW_BALANCE":
      //设置用户余额是否展示状态
      return { ...state, show_balance: action.amount };
    case "SET_SHOW_LOGIN_POPUP":
      // 设置登录弹窗状态
      return { ...state, show_login_popup: action.data };
    case "SET_IS_INVALID":
      //保存token状态（是否失效）
      return { ...state, is_invalid: action.data };
    case "SET_IS_USER_NO_HANDLE":
      //设置用户是否长时间未操作
      return { ...state, is_user_no_handle: action.data };
    case "SET_IS_NEW_USER":
      // 是否首次登录a
      return { ...state, is_new_user: action.data };
    default:
      return state;
  }
}
