/*
 * @Description: 用户信息金额
 */
const initialState = {
  amount:10000000,

};

export default function userInfoReducer(state = initialState, action) {
  switch (action.type) {
     // 保存用户信息
    case "SET_AMOUNT_INFO":
      // console.error('action.data ',action.data)
      return {...state, amount: action.data };
    default:
      return state;
  }
}
