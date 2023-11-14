/**
 * module/border.js 仅配置border-color
 * module/background.js 仅配置background-color、background-image
 * module/color.js 仅配置color
 * theme.js 可以配置其他杂项，但不允许配置上述样式变量
 */
export default {
  // 主题色通用 边框颜色
  "theme-bd-color-common": {
   t1: "#414655",
   y1: "#414655",
   t2: "#fff",
   y2: "#fff",
 },

// 投注项  盘口  边框颜色
  "theme-bd-color-handicap": {
  t1: "#414655",
  y1: "#414655",
  t2: "#fff",
  y2: "#fff",
  },

  //投注失效
  "theme-bd-invalid": {
    t1: "0",
    y1: "1px solid #ff4040",
    t2: "0",
    y2: "1px solid #ff4040",
   },

   //投注赢
  "theme-bd-win": {
    t1: "#e93d3d",
    // y1: "#ff4040",
    y1: "#E93D3D",
    t2: "#d02d2d",
    y2: "#ff4040",
   },

   //投注输
  "theme-bd-lose": {
    t1: "#14171d",
    y1: "#a5aec8",
    t2: "#555",
    y2: "#414655",
   },

  //input 边框
  "theme-bd-bet-pre-input": {
    t1: "rgba(255, 255, 255, 0.05)",
    y1: "#F2F5F9",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "#414655",
  },
  // 投注项  盘口  边框颜色
  "theme-bd-color-handicap-hover": {
  t1: "#fff",
  y1: "#fff",
  t2: "#414655",
  y2: "#414655",
  },

  //搜索框
  "theme-bd-color-search-wrap": {
    t1: "rgba(255,176,1,0.6)",
    y1: "#419bf9",
    t2: "rgba(255,176,1,0.6)",
    y2: "#419bf9",
  },
  //公告按钮边框 card内部按钮边框 选择按钮
  "theme-bd-color-notice-btn": {
    t1: "#e4eaff",
    y1: "#e4eaff",
    t2: "#313541",
    y2: "#313541",
  },
  //card内部按钮激活
  "theme-bd-color-card-btn-active": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#2cb2ff",
    t2: "#ffb001",
    y2: "#2cb2ff",
  },

  //左侧菜单
  "theme-bd-color-menu": {
    t1: "#ebecf3",
    y1: "#e4eaff",
    t2: "rgba(61,65,82,0.6)",
    y2: "rgba(61,65,82,0.6)",
  },
  //余额刷新icon
  "theme-bd-refresh-icon": {
    t1: "#e4eaff",
    y1: "#e4eaff",
    t2: "transparent",
    y2: "transparent",
  },
  //左菜单min
  "bd-menu-mini": {
    t1: "#bfcedd",//bg #fff
    y1: "#bfcedd",//bg #fff
    t2: "#3d4152",//bg 262b37
    y2: "#3d4152",//bg 262b37
  },

  //搜索组件 公告栏
  "theme-bd-color-notice": {
    t1: "#bfcedd",
    y1: "#ECF7FF",
    t2: "#282b37",
    y2: "#414655",
  },
  //搜索组件 公告栏
  "theme-bd-color-notice-top": {
    t1: "#ECF7FF",
    y1: "#ECF7FF",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  //搜索框下边框
  "theme-bd-bottom-searchBox": {
    t1: "#ebecf4",
    y1: "#bfcedd",
    t2: "#282b37",
    y2: "#414655",
  },
  //搜索组件tab
  "theme-bd-color-search-pnl": {
    t1: "#f6f7fa",
    y1: "#f6f7fa",
    t2: "#282b37",
    y2: "#282b37",
  },
  //注单内容
  "theme-bd-bet-content": {
    t1: "rgba(0,0,0,0.15)",
    y1: "#bfcedd",
    t2: "#37393d",
    y2: "#414655",
  },
  //注单按钮
  "theme-bd-keyboard-btn": {
    t1: "#e4ebf1",
    y1: "#bfcedd",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },
  // "theme-bd-search-module": {
  //   t1: "#ebecf4",
  //   y1: "#ebecf4",
  //   t2: "#282b37",
  //   y2: "#282b37",
  // },

  // 关闭文字boder
  "theme-bd-color-close": {
    t1: "#999",
    y1: "#999",
    t2: "#fff",
    y2: "#282b37",
  },
  // 取消投注按钮
  "theme-bd-bet-btn-cancel": {
    t1: "rgba(216,222,234,0.5)",
    y1: "#bfcedd",
    t2: "rgba(216,222,234,0.5)",
    y2: "#3c3f4c",
  },
  "theme-bd-bet-btn-cancel-1": {
    t1: "rgba(0,0,0,0.2)",
    y1: "rgba(0,0,0,0.2)",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },
  //main-content
  "theme-bd-main-content": {
    t1: "#f6f7fa",
    y1: "#f0f6ff",
    t2: "#17191d",
    y2: "#17191d",
  },
  //复选框
  "bd-check-wrap": {
    t1: "#d1d5d8",
    y1: "#d1d5d8",
    t2: "#383c44",
    y2: "#383c44",
  },

  /****************主列表 start****************/
  //列表右上角搜索
  "theme-bd-main-search": {
    t1: "#ebecf3",
    y1: "#ebecf3",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },
  //filter关闭按钮
  'bd-filter-btn-close': {
    t1: 'rgba(216,222,234,0.5)',
    y1: 'rgba(216,222,234,0.5)',
    t2: '#272a33',
    y2: '#272a33',
  },
  //无选中时确定按钮
  'bd-filter-btn-dis': {
    t1: '#e6ebf2',
    y1: '#e6ebf2',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  //wrap-title
  'bd-wrap-title': {
    t1: '#ebecf3',
    y1: '#bfcedd',
    t2: 'transparent',
    y2: '#3d4152',
  },
  //搜索底部
  'bd--search-footer': {
    t1: '#e1e4e6',
    y1: '#e1e4e6',
    t2: '#272a33',
    y2: '#272a33',
  },

  /****************主列表 end****************/


  /****************站点头部 start****************/
  'theme-bd-simple-header': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: '#17191d',
    y2: '#17191d',
  },

  /****************站点头部 start****************/

   /****************提前结算按钮 start****************/
  'theme-bd-pre-btn': {
    t1: '#ffb001',
    y1: 'rgba(23, 156, 255, 0.50) ', 
    t2: 'rgba(255, 176, 1, 0.50)',
    y2: 'rgba(69, 176, 255, 0.50)',
    },
    // 暂停提前结算
    'theme-bd-pre-stop-btn': {
        t1: '0',
        y1: '0.5px solid rgba(191,206,221,1)',
        t2: '0',
        y2: '0.5px solid rgba(65,70,85,1)',
    },
    'theme-bd-bet-item': {
        t1: '#e4ebf1',
        y1: '#e4ebf1',
        t2: '#42444d',
        y2: '#42444d',
    },
    // 赛果
    'theme-bd-btn-confrim': {
        t1: '#d0d8de',
        y1: '#d0d8de',
        t2: '#ffb001',
        y2: '#2cb2ff',
    },
    'theme-bd-top-btn-confrim': {
        t1: '#d0d8de',
        y1: '#d0d8de',
        t2: 'transparent',
        y2: 'transparent',
    },
    'theme-bd-top-btn': {
        t1: '#d0d8de',
        y1: '#d0d8de',
        t2: '#ffb001',
        y2: '#2cb2ff',
    },
    'theme-bd-top-bt-btn': {
        t1: '#d0d8de',
        y1: '#d0d8de',
        t2: 'transparent',
        y2: 'transparent',
    },
    'theme-bd-scrollarea': {
        t1: 'none',
        y1: 'none',
        t2: '1px solid #ffb001',
        y2: '1px solid #2cb2ff',
    },
    'theme-bd-y-select': {
        t1: '1px solid #d0d8de',
        y1: '1px solid #d0d8de',
        t2: 'none',
        y2: 'none',
    },
    // 注单历史切换tab
    'theme-bd-tab-btn-wrap': {
        t1: '#e7eaee',
        y1: '#e7eaee',
        t2: '#282b37',
        y2: '#282b37',
    },
    // 注单历史时间弹窗
    'theme-bd-q-date': {
        t1: '0',
        y1: '0',
        t2: '0',
        y2: '1px solid #2cb2ff',
    },
    //  查看所有注单
    'theme-bd-load-all': {
        t1: '1px solid rgba(216,222,234,0.5)',
        y1: '1px solid rgba(216,222,234,0.5)',
        t2: '',
        y2: '',
    },
    //  复选下拉控件
    'theme-bd-y-checkbox': {
        t1: 'none',
        y1: 'none',
        t2: '1px solid rgba(56,60,68,1)',
        y2: '1px solid rgba(56,60,68,1)',
    },
    //  单选下拉控件
    'theme-bd-r-checked': {
        t1: 'none',
        y1: 'none',
        t2: '1px solid #383C44',
        y2: '1px solid #383C44',
    },
    /****************提前结算按钮 end****************/

  /****************详情 start****************/
  // 玩法集
  'theme-bd-tab-item': {
    t1: '#e4eaff',
    y1: '#e4eaff',
    t2: '#3d4152',
    y2: '#3d4152',
  },
  // 玩法集hover
  'theme-bd-tab-item-hover': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#4276fb',
    t2: '#ffb001',
    y2: '#2cb2ff',
  },
  /****************详情 end****************/

  /* 其他 start */
  "yb-border-color1": {
    t1: "#ebecf4",
    y1: "#ebecf4",
    t2: "#282b37",
    y2: "#282b37",
  },
  "yb-border-color2": {
    t1: "#ebecf3",
    y1: "#ebecf3",
    t2: "#d1d1d1",
    y2: "#d1d1d1",
  },
  "yb-border-color3": {
    t1: "#5a6074",
    y1: "#5a6074",
    t2: "#0b0b0b",
    y2: "#0b0b0b",
  },
  "yb-border-color6": {
    t1: "rgba(209, 213, 216, 0.6)",
    y1: "rgba(209, 213, 216, 0.6)",
    t2: "rgba(40, 43, 55, 0.5)",
    y2: "#23242A",
  },
  "yb-border-color7": {
    t1: "#E2E2E4",
    y1: "#E2E2E4",
    t2: "#1D1D1D",
    y2: "#1D1D1D",
  },
  "yb-border-color8": {
    t1: "#d1d1d1",
    y1: "#d1d1d1",
    t2: "#414655",
    y2: "#414655",
  },
  "yb-border-color10": {
    t1: '#d0d8de',
    y1: '#d0d8de',
    t2: 'hsla(0,0%,100%,0.1)',
    y2: 'hsla(0,0%,100%,0.1)',
  },
  "yb-border-color11": {
    t1: "#d0d8de",
    y1: "#d0d8de",
    t2: "#242B38",
    y2: "#242B38",
  },
  "yb-border-color12": {
    t1: "#bfcedd",
    y1: "#bfcedd",
    t2: "#414655",
    y2: "#414655",
  },
  "yb-border-color13": {
    t1: "#dce0e5",
    y1: "#dce0e5",
    t2: "#282b37",
    y2: "#282b37",
  },
  "yb-border-color14": {
    t1: "#d0d8de",
    y1: "#d0d8de",
    t2: "rgba(255, 255, 255, 0.1)",
    y2: "rgba(255, 255, 255, 0.1)",
  },
  "yb-border-color15": {
    t1: "#bfcedd",
    y1: "#bfcedd",
    t2: "#3d4152",
    y2: "#3d4152",
  },
  "yb-border-color16": {
    t1: "#bfcedd",
    y1: "#bfcedd",
    t2: "#282b37",
    y2: "#282b37",
  },
  "yb-border-color81": {
    t1: " ##BACCFC",
    // t1: " #FFB780",
    y1: "#BACCFC",
    // y1: "#419bf9",
    t2: " #FFB780",
    y2: "#419bf9",
  },
  "menu-border-color": {
    t1: "#ebecf3",
    y1: "#ebecf3",
    t2: "#282b37",
    y2: "#282b37",
  },
  "match-border-color2": {
    t1: "#E4EAFF",
    y1: "#F5F5F5",
    // t2: "#3D4152",
    t2: "rgba(31, 34, 43, 0.5)",
    // y2: "#3D4152",
    y2: "rgba(31, 34, 43, 0.5)",
  },
  "match-border-color2_2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgba(31, 34, 43, 0.5)",
    y2: "rgba(31, 34, 43, 0.5)",
  },
  "match-border-color1": {
    // t1: "#ff7000",
    t1: "#179CFF",
    y1: "#179CFF",
    // y1: "#f0f6ff",
    t2: "#3c3831",
    y2: "#3b465b",
  },
  "match-border-color3": {
    t1: "#eaeaea",
    y1: "#eaeaea",
    t2: "#1f222b",
    y2: "#1f222b",
  },
  "match-border-color4": {
    t1: "#d1d5d8",
    y1: "#d1d5d8",
    t2: "#30333a",
    y2: "#30333a",
  },
  "match-border-color5": {
    t1: "#E4EAFF",
    y1: "#E2E2E2",
    t2: "rgba(255, 255, 255, 0.10)",
    y2: "rgba(255, 255, 255, 0.10)" ,
  },
  "match-border-color6": {
    t1: "#E4EAFF",
    y1: "#ffffff",
    // t2: "#3D4152",
    t2: "rgba(31, 34, 43, 0.5)",
    // y2: "#3D4152",
    y2: "rgba(31, 34, 43, 0.5)",
  },
  "match-icon-color1": {
    t1: "#a5aec8",
    y1: "#a5aec8",
    t2: "#5a6074",
    y2: "#5a6074",
  },
  'list-replay-border-color': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'rgba(40, 43, 55, 1)',
    y2: 'rgba(40, 43, 55, 1)',
  },
  'league-rank-border-color': {
    t1: '#eff0f6',
    y1: '#eff0f6',
    t2: '#3D4152',
    y2: '#3D4152',
  },
  'carousel-handicap-item-border-color': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'rgba(65,70,85,1)',
    y2: 'rgba(65,70,85,1)',
  },
  'wrap-icon-border-hover': {
    t1: '#dedfe6',
    y1: '#dedfe6',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'more-handle-border-color': {
    t1: '#dedfe6',
    y1: '#dedfe6',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'wrap-recents-handicap-border-color': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'rgba(255, 255, 255, 0.1)',
    y2: 'rgba(255, 255, 255, 0.1)',
  },
  'sr-link-icon-bd-color': {
    t1: '#e4eaff',
    y1: '#e4eaff',
    t2: '#313541',
    y2: '#313541',
  },
  'linear-progress-bd-color': {
    t1: '#dbdbdb',
    y1: '#dbdbdb',
    t2: '#282b37',
    y2: '#282b37',
  },
  'sports-guessing-bd-color': {
    t1: '#e4eaff',
    y1: '#e4eaff',
    t2: 'transparent',
    y2: 'transparent',
  },
  'chatroom-bd-color-1': {
    t1: '#DCE0E5',
    y1: '#DCE0E5',
    t2: '#414655',
    y2: '#414655',
  },
  'chatroom-bd-color-2': {
    t1: '#d9d9d9',
    y1: '#d9d9d9',
    t2: '#414655',
    y2: '#414655',
  },
  'chatroom-bd-color-3': {
    t1: '#ffb479',
    y1: 'rgba(66,118,251,.5)',
    t2: 'rgba(255,176,1,1)',
    y2: 'rgba(66,118,251,.5)',
  },
  'chatroom-bd-color-4': {
    // t1: '#ff7000',
    t1: '#179CFF',
    y1: '#179CFF',
    // y1: '#4276FB',
    t2: '#FFB001',
    y2: '#4276FB',
  },
  'vr-border-color1': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'transparent',
    y2: 'transparent',
  },
  'vr-border-color2': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'transparent',
    y2: 'transparent',
  },
  'vr-border-color3': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: '#262c34',
    y2: '#262c34',
  },
  'go-top-btn-border': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: 'none',
    y2: 'none',
  },
  'match-type-tab-bg-border': {
    t1: "#ECF7FF",
    y1: "#ECF7FF",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "list-header-row-item-border": {
    t1: "#E2E2E4",
    y1: "#E2E2E4",
    t2: "#35363C",
    y2: "#35363C",
  },
  "activity-bd-color-2": {
    t1: "#fec59e",
    y1: "#A4BEFE",
    t2: "#fec59e",
    y2: "#A4BEFE",
  },
  "activity-bd-color-3": {
    t1: "#d3d3d3",
    y1: "transparent",
    t2: "#d3d3d3",
    y2: "transparent",
  },
  "activity-bd-color-4": {
    t1: "#fec59e",
    y1: "#ddd",
    t2: "#fec59e",
    y2: "#ddd",
  },
  'bet-dialog-border-color1': {
    t1: '#ffb001',
    y1: '#569FFD',
    t2: '#ffb001',
    y2: '#569FFD',
  },
  "skin-toggle-bd-color": {
    t1: "#e4eaff",
    y1: "#e4eaff",
    t2: "#3d4152",
    y2: "#3d4152",
  },
  /* 多选框勾选打勾颜色 */
  "check-wrap-active-color": {
    t1: "#fff",
    y1: "#fff",
    t2: "#000",
    y2: "#000",
  },

  // ============================新手版===============

    /*列表边框颜色 */
    "list-new-border-color": {
      t1: "#f5f5f5",
      y1: "#f5f5f5",
      t2: "#000",
      y2: "#000",
    },
    "match-border-colornew": {
      t1: "#F5F5F5",
      y1: "#F5F5F5",
      t2: "rgba(31, 34, 43, 0.5)",
      y2: "rgba(31, 34, 43, 0.5)",
    },

}
