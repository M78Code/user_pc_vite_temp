const initialState = {
    // 是否横屏
    is_hengping: false,
  };
  export default function commonReducer(state = initialState, action) {
    switch (action.type) {
      // 是否横屏
      case "SET_HENGPING":
        return { ...state, is_hengping: action.data };

      default:
        return state;
    }
  }