/*
 * @Description: 弹出对话框提示store
 */
const initialState = {
    //文字内容
    txt: '',
    //文字内容
    txt_new: '', 
    //持续时间
    toast_hide_time:1000,
  };
  export default function toastReducer(state = initialState, action) {
    switch (action.type) {
      // 文字内容
      case "SET_TEXT":
        return { ...state, text: action.data };
      // 持续时间
      case "SET_TOAST_HIDE_TIME":
        return { ...state, toast_hide_time: action.data };

      default:
        return state;
    }
    return action
  }
