

const menu = [
  101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
  114, 104, 106, 118,
]

const initialState = {
  // 当前页面 home：赛事列表  details：详情
  layout_cur_page: { cur: "", from: "" },
  // 当前展开区块  match-list:赛事列表 match-detail:赛事详情
  cur_expand_layout: "match-list",
  // 左侧显示内容类型 menu:菜单 bet_list:投注列表 bet_history:投注记录
  layout_left_show: "menu",
  layout_list_size: {},
  layout_list_width: 0,
  // 列表显示内容  match:赛事 collect:收藏 search:搜索
  layout_list_type: "match",
  // 自定义滚动条样式
  scroll_style: {
    width: "9px",
    background: "#000",
    zIndex: 20,
    opacity: 1,
    borderRadius: "4px"
  },
  layout_size: {
    // 浏览器宽度
    inner_width: 0,
    // 浏览器高度
    inner_height: 0,
    // 主内容宽度
    main_width: 0,
    // 左侧菜单宽度
    left_width: 0,
    // 中间区域宽度
    center_width: 0,
    // 列表实际内容宽度，除去边框间距等等
    list_content_width: 0,
    // 右侧区域宽度
    right_width: 0,
    // 头部高度
    header_height: 0,
    // 主内容高度（菜单、列表、详情、右侧）
    content_height: 0,
  },
  redux_menu: {
    menu_list: menu, // 左侧菜单列表
    top_events: [], // top_event 菜单列表
    in_play: [], // 滚球菜单列表
    menu_root: 1, // 菜单的 root 节点   root ： 1 首页  2 滚球  3 my bets   4 左侧赛种
    menu_left: 1,  // 左侧菜单 赛种菜单id
    menu_id_euid: "", // 菜单对应的euID
    menu_id_euid_ealy: '', // 菜单对应的 早盘 euID
    mid_tab_type: '', // header tab切换
    mid_tab_menu_type: 1, // header tab切换对应的 赛种菜单id 或者 时间 (左侧赛种菜单对应的 matches 今日 2 其他日期为 3)  或者 联赛类型
    mid_right_bg: 0, // header 右上角对应的赛种
    coom_soon: false
  }
};

export default function menusReducer(state = initialState, action) {
  switch (action.type) {
    // 保存菜单信息
    case "SETREDUXMENU":
      return { ...state, redux_menu: action.data }
     // 获取当前页路由信息
     case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data }
       // 设置展开区块
     case "SETCUREXPANDLAYOUT":
      return { ...state, cur_expand_layout: action.data }
      //获取左侧布局信息(取值有menu,bet_list,history)
     case "SETLAYOUTLEFTSHOW":
      return { ...state, layout_left_show: action.data }
      // 获取页面宽高信息 --可以废弃，废弃改动较大
     case "SETLAYOUTLISTSIZE":
      return { ...state, layout_list_size: action.data }
      
      // 获取当前页路由信息
     case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data }
      // 获取当前页路由信息
     case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data }
      // 获取当前页路由信息
     case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data }
      // 获取当前页路由信息
     case "SETLAYOUTCURPAGE":
      return { ...state, layout_cur_page: action.data }
    default:
      return state;
  }
}
