/*
 * @Description: home页 store
 */

const initialState = {
    // 首页选中的tab对象
    home_tab_item: {
        component: 'home',
        index: 0,
        name: '首页'
    },
    // 首页上一个选中的tab对象
    last_home_tab_item: {},


  }

  export default function homeReducer(state = initialState, action) {
    switch (action.type) {
      // 首页选中的tab对象
      case "SET_HOME_TAB_ITEM":
        return { ...state, home_tab_item: action.data };
      // 首页上一个选中的tab对象
      case "SET_LAST_HOME_TAB_ITEM":
        return { ...state, last_home_tab_item: action.data };
      // 默认
      default:
        return state;
    }
  }
