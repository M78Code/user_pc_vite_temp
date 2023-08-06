/**
 * @Description: 公共数据，存储用户信息，用户余额
 */
const initialState = {
  userInfo: {},
  amount:0  //用户余额
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
     // 保存用户详情
    case "SETUSER":
      return {...state, userInfo: action.data };
    case "SETAMOUNT":
      // 保存用户余额
      return { ...state, amount: action.amount };
    default:
      return state;
  }
}
