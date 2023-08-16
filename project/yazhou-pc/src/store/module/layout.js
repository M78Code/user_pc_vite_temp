const initialState = {
  // 当前页面 home：赛事列表  details：详情
  layout_cur_page: { cur: "", from: "" },
  // 当前展开区块  match-list:赛事列表 match-detail:赛事详情
  cur_expand_layout: "match-list",
  //左侧显示内容类型 menu:菜单 bet_list:投注列表 bet_history:投注记录
  layout_left_show: "menu",
  layout_list_size: {},
  layout_list_width: 0,
  // 列表显示内容  match:赛事 collect:收藏 search:搜索
  layout_list_type: "match",
  // 左侧列表显示形式 normal：展开 mini：收起
  main_menu_toggle: "normal",
  is_unfold_multi_column: false, //是否展开多列玩法
  //页面是否达到最小宽度 true是/false否
  is_min_width: false,
  // 自定义滚动条样式
  scroll_style: {
    width: "9px",
    background: "#000",
    zIndex: 20,
    opacity: 1,
    borderRadius: "4px",
  },
  layout_setting: {
    // 主内容最大宽度
    max_width: 1920,
    // 主内容最小宽度出现滚动条
    min_width: 1400,
    // 左侧菜单宽度
    left_width: 234,
    // 左侧菜单宽度mini
    left_width_mini: 64,
    // 右侧区域宽度
    right_width: 441,
    // 头部导航高度
    nav_height: 60,
    //公共高度
    notice_height: 36,
  },

  layout_size: {
    // // 中间区域宽度
    center_width: 1920,
    // // 列表实际内容宽度，除去边框间距等等
    list_content_width: 1920,
    // // 主内容高度（菜单、列表、详情、右侧）
    content_height: 900,
    // 列表实际内容宽度，除去边框间距等等
    list_content_width: 0,
  },
};

export default function layoutReducer(state = initialState, action) {
  switch (action.type) {
    // 页面是否达到最小宽度
    case "SET_IS_MIN_WIDTH":
      return { ...state, is_min_width: action.data };
    // 获取当前页路由信息
    case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data };
    // 设置展开区块
    case "SETCUREXPANDLAYOUT":
      return { ...state, cur_expand_layout: action.data };
    //获取左侧布局信息(取值有menu,bet_list,history)
    case "SETLAYOUTLEFTSHOW":
      return { ...state, layout_left_show: action.data };
    // 设置列表显示内容  match:赛事 collect:收藏 search:搜索
    case "SETLAYOUTLISTTYPE":
      return { ...state, layout_list_type: action.data };
    // 自定义滚动条样式
    case "SETSCROLLSTYLE":
      return { ...state, scroll_style: action.data };
    //设置当前页面布局
    case "SET_LAYOUT_CUR_PAGE":
      return { ...state, layout_cur_page: action.data };
    //页面所有布局宽高信息
    case "SET_LAYOUT_SIZE":
      const layout_size = Object.assign({}, state.layout_size, action.data);
      return { ...state, layout_size };
    default:
      return state;
  }
}
