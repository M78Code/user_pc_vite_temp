import { nextTick } from "vue";
import { useMittEmit, MITT_TYPES } from "src/core/mitt";

const initialState = {
  // 当前页面 home：赛事列表  details：详情
  layout_cur_page: { cur: "", from: "" },
  // 当前展开区块  match-list:赛事列表 match-detail:赛事详情
  cur_expand_layout: "match-list",
  //左侧显示内容类型 menu:菜单 bet_list:投注列表 bet_history:投注记录
  layout_left_show: "menu",
  // 列表显示内容  match:赛事 collect:收藏 search:搜索
  layout_list_type: "match",
  layout_list_size: {},

  // 自定义滚动条样式
  scroll_style: {
    width: "9px",
    background: "#000",
    zIndex: 20,
    opacity: 1,
    borderRadius: "4px",
  },
  // 左侧列表显示形式 normal：展开 mini：收起 normal-mini自己点击的
  left_menu_status: "normal",
  left_menu_is_mini: false, //是否mini
  layout_right_status: false, //是否展示右侧
  //不允许从这里拿宽度来判断东西 这是配置的 和scss对应
  layout_setting: {
    // 主内容最大宽度
    max_width: 1920,
    // 主内容最小宽度出现滚动条
    min_width: 1440,
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
  //页面是否达到最小宽度 true是/false否
  is_min_width: false,
  layout_size: {
    // // 中间区域宽度
    center_width: 1920,
    // // 列表实际内容宽度，除去边框间距等等
    list_content_width: 1920,
    // // 主内容高度（菜单、列表、详情、右侧）
    content_height: 900,
  },
  //收起右侧详情 展开多列玩法
  is_unfold_multi_column:false
};

export default function layoutReducer(state = initialState, action) {
  switch (action.type) {
    // 页面是否达到最小宽度
    case "SET_IS_MIN_WIDTH":
      return { ...state, is_min_width: action.data };
    // 是否展示右侧
    case "SET_LAYOT_RIGHT_STATS":
      nextTick(() => {
        useMittEmit(MITT_TYPES.EMIT_LAYOUT_RIGHT_STATUS, action.data);
        //只有和上次的值 不一样 宽度才是变化 才去计算
        if (action.data != state.layout_right_status)
          useMittEmit(MITT_TYPES.EMIT_LAYOUT_RESIZE, action.data);
      });
      return { ...state, layout_right_status: action.data };
    //设置菜单是否为mini
    case "SET_LEFT_MENU_STATUS":
      const left_menu_is_mini = action.data == "mini";
      nextTick(() => {
        //通知监听了菜单栏变化的消息
        useMittEmit(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, action.data);
        //只有和上次的值 不一样 宽度才是变化 才去计算
        if (left_menu_is_mini != state.left_menu_is_mini)
          useMittEmit(MITT_TYPES.EMIT_LAYOUT_RESIZE, action.data);
      });
      return {
        ...state,
        left_menu_status: action.data,
        left_menu_is_mini, //true/false
      };
    // 获取当前页路由信息
    case "SET_LAYOUT_CUR_PAGE":
      return { ...state, layout_cur_page: action.data };
    // 设置展开区块
    case "SET_CUR_EXPAND_LAYOUT":
      return { ...state, cur_expand_layout: action.data };
    //获取左侧布局信息(取值有menu,bet_list,history)
    case "SET_LAYOUT_LEFT_SHOW":
      return { ...state, layout_left_show: action.data };
    // 设置列表显示内容  match:赛事 collect:收藏 search:搜索
    case "SET_LAYOUT_LIST_TYPE":
      return { ...state, layout_list_type: action.data };
    // 自定义滚动条样式
    case "SET_SCROLL_STYLE":
      return { ...state, scroll_style: action.data };
    //设置当前页面布局
    case "SET_LAYOUT_CUR_PAGE":
      return { ...state, layout_cur_page: action.data };
    //页面所有布局宽高信息
    case "SET_LAYOUT_SIZE":
      const layout_size = Object.assign({}, state.layout_size, action.data);
      return { ...state, layout_size };
    //页面所有布局宽高信息
    case "SET_LAYOUT_LIST_SIZE":
      return { ...state, layout_list_size: action.data };
    //右侧详情 展开多列玩法
    case "SET_UNFOLD_MULTI_COLUMN":
      return { ...state, is_unfold_multi_column: action.data };
    default:
      return state;
  }
}
