
const initialState = {
  // 左侧列表显示形式 normal：展开 mini：收起
  main_menu_toggle:"normal",

  // 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关
  cur_menu_type: {
    type_name:'',
    pre_name:''
  },
  // 内嵌版 菜单收起状态
  menu_collapse_status: false,
};

export default function menusReducer(state = initialState, action) {
  switch (action.type) {
   //设置左侧列表显示状态
    case "SET_MAIN_MENU_TOGGLE":
      return { ...state, main_menu_toggle: action.data }
   // 当前菜单类型
    case "SET_CUR_MENU_TYPE":
      return { ...state, cur_menu_type: action.data }
    // 内嵌版 菜单收起状态
    case "SET_MENU_COLLAPSE_STATUS":
      return { ...state, menu_collapse_status: action.data }
    default:
      return state;
  }
}
