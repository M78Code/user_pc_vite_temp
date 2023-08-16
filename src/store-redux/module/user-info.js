/**
 * @Description: 公共数据，存储用户信息，用户余额,菜单信息等
 */
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
import { nextTick } from "vue";
import { api_account } from "src/api/";
const initialState = {
  uuid: null,
  // 用户信息
  user_info: {},
  amount: 0,
  show_balance: true,
  show_login_popup: {
    isShow: false,
    redirect: null,
  },
  is_invalid: false, //token是否失效
  // 用户是否长时间未操作
  is_user_no_handle: false,
  // 是否首次登录
  is_new_user: false,
};

export default function userReducer(state = initialState, action) {
  console.log("counterReducer------", action);
  switch (action.type) {
    // 保存用户详情
    case "SET_USER":
      nextTick(() => {
        useMittEmit(MITT_TYPES.EMIT_USER_CHAUNGE, action.data);
      });
      return { ...state, user_info: action.data };
    case "SET_AMOUNT":
      // 保存用户余额
      //通知mitt用户余额变化
      useMittEmit(MITT_TYPES.EMIT_USER_AMOUNT_CHAUNGE, action.data);
      return { ...state, amount: action.data };
    //设置用户id
    case "SET_UUID":
      return { ...state, uuid: action.data };
    //设置用户信息
    case "SET_SHOW_BALANCE":
      //设置用户余额是否展示状态
      return { ...state, show_balance: action.data };
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

/**
 * 获取用户余额
 * @param {*} uid 用户uid
 */
export const get_balance = (uid) => {
  return async (dispatch) => {
    try {
      //获取用户余额
      const res = await api_account.check_balance({
        uid,
        t: new Date().getTime(),
      });
      let obj = res?.data?.data || {};
      // 将用户余额保存于公共仓库
      dispatch({
        type: "SET_AMOUNT",
        amount: obj.amount,
      });
    } catch (error) {}
  };
};
