/**
 * module/border.js 仅配置border-color
 * module/background.js 仅配置background-color、background-image
 * module/color.js 仅配置color
 * theme.js 可以配置其他杂项，但不允许配置上述样式变量
 * t1 黄色日间
 * t2 黄色夜间
 * y1 蓝色日间
 * y2 蓝色夜间
 */
export default {
  // 主题色通用 文字颜色
  "theme-text-color-common": {
    t1: "#414655",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },

  // 投注项  盘口  文字颜色
  "theme-text-color-handicap": {
    t1: "#414655",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },

  // 投注项  盘口  文字颜色
  "theme-text-color-handicap-hover": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#414655",
    y2: "#414655",
  },

  //晒单按钮
  "theme-text-is-clear-unclick": {
    t1: "#999",
    y1: "#555555",
    t2: "#A0A0A0",
    // t2: "#ffffff",
    y2: "#A0A0A0",
    // y2: "#ffffff",
  },

  //晒单 联赛标题 文字颜色
  "theme-text-show-order-title": {
    t1: "#666666",
    y1: "#666666",
    t2: "#99a3b1",
    y2: "#ffffff",
  },

  //晒单 联赛标题/日期 文字颜色
  "theme-text-show-order-away": {
    t1: "#2D2D2D",
    y1: "#2D2D2D",
    t2: "#FFFFFF",
    y2: "#FFFFFF",
  },

  //冠军投资标题？？  目前左侧投注日期显示
  "theme-text-bet-outweight": {
    t1: "#666",
    y1: "#555555",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
   },
   //电子竞技暂无数据
  "theme-text-esports-color": {
    t1: "#666",
    y1: "#000",
    t2: "#e7e7e7",
    y2: "#e7e7e7",
   },

  // 亮色字体 ，
  // 列表 右侧三列之类的 玩法标题
  "theme-text-color-highlight": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#41465",
    t2: "#ffb001",
    y2: "#ffffff",
  },
  //左侧菜单-hover
  "color-left-menu-hover": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#0086f3",
    t2: "inherit",
    y2: "#74C4FF", 

  },
  //菜单、公告颜色
  "theme-menu-olor": {
    t1: "#666",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  //公告右侧小菜单 余额
  "theme-small-menu-active": {
    t1: "##179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#2CB2FF",
  },
   //头部菜单文字active
   "theme-menu-text": {
    t1: "#1d1d1d",
    y1: "#1d1d1d",
    t2: "#f2f2f2",
    y2: "#f2f2f2",
  },
  "theme-menu-text-2": {
    t1: "#f2f2f2",
    y1: "#f2f2f2",
    t2: "#1d1d1d",
    y2: "#1d1d1d",
  },
  //头部菜单文字active
  "theme-menu-text-active": {
    t1: "#FFB001",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },

  //card内部按钮激活 这个和上面只有一个颜色差异，后面合并
  "theme-color-card-btn-active": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#2cb2ff",
    t2: "#ffb001",
    y2: "#2cb2ff",
  },
  //选择按钮
  "theme-color-select-btn": {
    t1: "#6c7ba8",
    y1: "#2cb2ff",
    t2: "#99a3b1",
    y2: "#2cb2ff",
  },

  // 按钮组
  "theme-color-btn-group": {
    t1: "#999",
    y1: " #555555",
    t2: "rgba(255, 255, 255, 0.10);",
    y2: "rgba(255, 255, 255, 0.10);",
  },

  // 关闭文字
  "theme-color-text-close": {
    t1: "#999",
    y1: "#000",
    t2: "#5a6074",
    y2: "#ffffff",
  },
  // 关闭文字hover
  "theme-color-text-close-hover": {
    t1: "#555",
    y1: "#414655",
    t2: "#99a3b1",
    y2: "#ffffff",
  },
  //按钮
  "color-result-btn-page": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#ffffff",
    y2: "#ffffff",
  },

  /**头部菜单,左侧菜单相关 start **/

  //余额刷新icon before
  "theme-color-refresh-icon": {
    t1: "#BFBFBF",
    y1: "#BFBFBF",
    t2: "#626262",
    y2: "#626262",
  },
  //余额眼睛icon
  "theme-color-icon-eye": {
    t1: "#626262",
    y1: "#CDCDCD",
    t2: "#727d8a",
    y2: "#727d8a",
  },
    //提前结算图标
    "theme-color-bet-info": {
      t1: "#a5aec8",
      y1: "#a5aec8",
      t2: "rgba(0, 0, 0, 0.2)",
      y2: "rgba(0, 0, 0, 0.2)",
    },
  //余额隐藏
  // "theme-color-balance-hide": {
  //   t1: "#a5aec8",
  //   y1: "#2d2d2d",
  //   t2: "#727d8a",
  //   y2: "#2cb2ff",
  // },
  
  // 新版体育菜单--新旧版切换
  "old-new-active": {
    t1: "#179cff",
    y1: "#179cff",
    t2: "#ffb001",
    y2: "#74c4ff",
  },
  /**头部菜单,左侧菜单相关 end **/

  /**搜索框、搜索组件相关 start **/
  //搜索组件和原yb-text-active-color1
  "theme-color-text-activeOrSearch": {
    t1: "#2d2d2d",
    y1: "#555555",
    t2: "#ffffff",
    y2: "rgba(160, 160, 160, 0.67)",
  },
  //搜索结果team
  "color-text-search-team": {
    t1: "#2d2d2d",
    y1: "#2d2d2d",
    t2: "#99a3b1",
    y2: "#ffffff",
  },
  //搜索面板
  "theme-color-search-pnl": {
    t1: "rgba(160, 160, 160, 0.67)",//日间黄色
    y1: "#555555",//日间蓝色
    t2: "rgba(160, 160, 160, 1)",//夜间黄色
    y2: "rgba(160, 160, 160, 1)",//夜间蓝色
  },
  //搜索面板字体
  "theme-color-search-pnl1": {
    t1: "rgba(160, 160, 160, 0.67)",
    y1: "#1D1D1D",//日间蓝色
    t2: "#F2F2F2",//夜间黄色
    y2: "#F2F2F2",//夜间蓝色
  },
  //搜索面板-hover
  "theme-color-search-pnl-hover": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#0086f3",
    t2: "#ffb001",
    y2: "#2cb2ff",
  },
  //搜索面板-active
  "theme-color-search-pnl-active": {
    t1: "#74C4FF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  //搜索-无数据时候所有地方(“换个词搜索试试吧”这种字眼除外)都统一用这个颜色，已和产品确认
  "theme-color-search-nodata": {
    t1: "#666",
    y1: "#666",
    t2: "#6d7278",
    y2: "#6d7278",
  },
  ///搜索-无数据 “换个词搜索试试吧” 在这里
  "color-search-nodata-other": {
    t1: "#999",
    y1: "#999",
    t2: "#5a6074",
    y2: "#5a6074",
  },
  //搜索记录清除历史按钮
  'theme-color-search-clear-icon': {
    t1: '#ccc',
    y1: '#ccc',
    t2: '#5a6074',
    y2: '#ffffff',
  },
  //搜索记录清除历史按钮-hover
  'theme-color-search-clear-icon-hover': {
    t1: '#999',
    y1: '#999',
    t2: '#abbac8',
    y2: '#ffffff',
  },
  //左侧搜索框内文字
  "theme-color-search-wrap": {
    t1: "#999",
    y1: "#BACCFC",
    t2: "#626262",
    y2: "#626262",
  },
  //搜索框占位
  "color-search-placeholder": {
    t1: "#777",
    y1: "#777",
    t2: "#ffffff",
    y2: "#ffffff",
  },

  /**搜索框、搜索组件相关 end **/


  /****************主列表 start****************/
  //列表右上角按钮
  "color-leagues-btn": {
    t1: "#6c6c6c",
    y1: "#6c6c6c",
    t2: "#99a3b1",
    y2: "#99a3b1",
  },
  //filter icon关闭按钮
  'color-filter-icon-search': {
    t1: 'inherit',
    y1: 'inherit',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  //分栏显示文字
  'color-card-wrap-title': {
    t1: '#878d99',
    y1: '#878d99',
    t2: '#878d99',
    y2: '#ffffff',
  },
  //filter文字&关闭按钮
  'color-filter-item': {
    t1: '#555',
    y1: '#000',
    t2: '#99a3b1',
    y2: '#ffffff',
  },
  //赛果列表文字
  'color-results-size': {
    t1: '#6c6c6c',
    y1: '#6c6c6c',
    t2: '#f2f2f2',
    y2: '#f2f2f2',
  },
  //无选中时确定按钮
  'color-filter-btn-dis': {
    t1: 'rgba(45,45,45,0.3)',
    y1: 'rgba(45,45,45,0.3)',
    t2: '#99a3b1',
    y2: '#ffffff',
  },
  //左箭头
  'color-left-goback': {
    t1: '#c2c2c2',
    y1: '#414655',
    t2: 'inherit',
    y2: 'inherit',
  },
  //搜索选中结果
  "color-search-check-active": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#0086f3",
    t2: "#99a3b1",
    y2: "inherit",
  },
  //
  "vr-text-color10": {
    t1: "#6d7278",
    y1: "#6d7278",
    t2: "#6d7278",
    y2: "#ebebec",
  },

  /****************主列表 end****************/


  /**投注相关 start **/
  //投注zone
  "theme-color-bet-zone": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "theme-color-bet-after": {
    t1: "#555555",
    y1: "#555555",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "theme-color-bet-odds": {
    t1: "#1D1D1D",
    y1: "#1D1D1D",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "theme-color-bet-zone-right": {
    t1: "#99A3B1",
    y1: "#99A3B1",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "theme-bet-text-delete-color": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#1F222B",
    y2: "#FFFFFF",
  },
  "theme-color-bet-keyboard": {
    t1: "#555",
    y1: "#555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "theme-color-bet-keyboard_1": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "theme-color-bet-keyboard_2": {
    t1: "#CBCED8",
    y1: "#CBCED8",
    t2: "#626262",
    y2: "#626262",
  },
  "theme-color-bet-keyboard_3": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "theme-bet-delete-all": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "theme-bet-moeny-win": {
    t1: "#555555",
    y1: "#555555",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "theme-bet-delete-all-border": {
    t1: "#D7DEE3",
    y1: "#D7DEE3",
    t2: "#3C3B3E",
    y2: "#3C3B3E",
  },
  "theme-bet-delete-all-button": {
    t1: "transparent",
    y1: "transparent",
    t2: "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
    y2: "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
  },

  //投注金额按钮
  "theme-color-bet-gray-btn": {
    t1: "rgba(45, 45, 45, 0.3)",
    y1: "rgba(45, 45, 45, 0.3)",
    t2: "#ffffff",
    y2: "#ffffff",
  },

  //投注金额按钮
  "theme-color-bet-input-placeholder": {
    t1: "#CBCED8",
    y1: "#CBCED8",
    t2: "#626262",
    y2: "#626262",
  },

  //投注欧洲盘名称显示
  "theme-color-bet-handicap-name": {
    t1: "#179CFF",
    // y1: "#333333",
    y1: "#179CFF",
    t2: "#74C4FF",
    y2: "#74C4FF",
  },
  "theme-bet-confirm-message": {
    t1: "#FFF3D9",
    y1: "#FFF3D9",
    t2: "#5E5032",
    y2: "#5E5032",
  },
  "theme-bet-success-order": {
    t1: "#E8F6E6",
    y1: "#E8F6E6",
    t2: "#446145",
    y2: "#446145",
  },
  "theme-bet-fail-order": {
    t1: "#FDE5E5",
    y1: "#FDE5E5",
    t2: "#734347",
    y2: "#734347",
  },

  /**投注相关 end **/


  /****************详情 start****************/
  // 玩法集
  'theme-color-tab-item': {
    t1: '#555555',
    y1: '#555555',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  // 玩法集hover
  'theme-color-tab-item-hover': {
    t1: '#555555',
    y1: '#555555',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  // 选中玩法集
  'theme-color-tab-item-active': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#1F222B',
    y2: '#ffffff',
  },
  // 玩法集名称前修饰样式
  'theme-color-handicap-item-title': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#ffb001',
    y2: '#74C4FF',
  },
  // 详情投注项hover
  'theme-color-handicap-item-bet-hover': {
    t1: '#666',
    y1: '#666',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  // 详情投注项选中
  'theme-color-handicap-item-bet-active': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'theme-color-text-active': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  /****************详情 end****************/

  /****************注单历史 start****************/
  // 提前结算按钮
  'theme-color-pre-btn': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#0086f3',
    t2: '#ff7000',
    y2: '#ffffff',
  },
  'theme-color-pre-btn-row-2': {
    t1: '#000000',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#74C4FF',
  },
  'bet-pre-confirming-text-color': {
    t1: '#000000',
    y1: '#F2F2F2',
    t2: '#1F222B;',
    y2: '#F2F2F2',
  },
  // 暂停提前结算
  'theme-color-pre-stop-btn': {
    t1: '#A8B1BD',
    y1: '#7A7D88',
    t2: '#999999',
    y2: '#8D8F94',
},
  'theme-color-pre-btn2': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#555',
    // y1: '#4176fa',
    t2: '#ffb001',
    y2: '#f2f2f2',
  },
  //  标题样式设置
  'theme-color-record-title': {
    t1: '#2d2d2d',
    y1: '#555555',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  //  查看所有注单
  'theme-color-load-all': {
    t1: '#555',
    y1: '#555',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  // 注单历史切换
  'theme-color-tab-wrap': {
    t1: '#e7eaee',
    y1: '#e7eaee',
    t2: '#282b37',
    y2: '#282b37',
    },
    // 注单历史弹窗选择今天昨天按钮颜色
  'theme-color-tool-btn': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#333333',
    y2: '#ffffff',
    },
    // 注单历史弹窗选择查询按钮颜色
  'theme-color-records-search-btn': {
    t1: '#17191d',
    y1: '#ffffff',
    t2: '#99a3b1',
    y2: '#ffffff',
    },
    //  排序选择器
    'theme-color-wrap-time': {
        t1: '#17191d',
        y1: '#17191d',
        t2: '#99a3b1',
        y2: '#99a3b1',
    },
    //  排序选择器 hover
    'theme-color-wrap-time-hover': {
        t1: '#17191d',
        y1: '#17191d',
        t2: '#ffffff',
        y2: '#ffffff',
    },
    //  提前结算进度条
    'theme-color-pre-over': {
        t1: '#ffb001',
        y1: '#4176fa',
        t2: '#ffb001',
        y2: '#45b0ff',
    },
    //  注单历史弹窗输字体颜色
    'theme-color-lose-color': {
        t1: '#1d1d1d',
        y1: '#1d1d1d',
        t2: '#f2f2f2',
        y2: '#f2f2f2',
    },
    //  注单历史弹窗th字体颜色
    'theme-color-head-ceil': {
        t1: '#2d2d2d',
        y1: '#555555',
        t2: '#F2F2F2',
        y2: '#F2F2F2',
    },
    //  注单历史弹窗td字体颜色
    'theme-color-ceil': {
        t1: '#1d1d1d',
        y1: '#1d1d1d',
        t2: '#F2F2F2',
        y2: '#F2F2F2',
    },
    'theme-color-ceil_1': {
      t1: '#1d1d1d',
      y1: '#1d1d1d',
      t2: '#F2F2F2',
      y2: '#F2F2F2',
  },
    //  注单历史弹窗盘口字体颜色
    'theme-color-play-type': {
        t1: '#555555',
        y1: '#99a3b1',
        t2: '#A0A0A0',
        y2: '#A0A0A0',
    },
    'theme-color-play-typeb': {
      t1: '#1d1d1d',
      y1: '#1d1d1d',
      t2: '#f2f2f2',
      y2: '#f2f2f2',
  },
  'theme-color-play-typez': {
    t1: '#555555',
    y1: '#555555',
    t2: '#a0a0a0',
    y2: '#a0a0a0',
},
    'bk-list-background': {
      t1: '#f0f6ff',
      y1: '#f0f6ff',
      t2: '#191c24',
      y2: '#191c24',
  },
    //  注单历史弹窗顶部切换字体颜色
    'theme-color-tab-wrap': {
        t1: '#5a6074',
        y1: '#414655',
        t2: '#99a3b1',
        y2: '#ffffff',
    },
    //  注单历史弹窗顶部切换字体激活状态颜色
    'theme-color-tab-wrap-active': {
        t1: '#191c24',
        y1: '#000',
        t2: '#ffffff',
        y2: '#ffffff',
    },
       //  最高可盈
       'theme-color-df-jb': {
        t1: '#191c24',
        y1: '#555555',
        t2: '#A0A0A0',
        y2: '#A0A0A0',
    },
    //  注单历史弹窗顶部字体颜色
    'theme-color-bet-desc': {
        t1: '#898A8B',
        y1: '#898A8B',
        t2: '#626262',
        y2: '#626262',
    },
    //  注单历史弹窗球种联赛字体颜色
    'theme-color-appoint-status': {
        t1: '#1D1D1D',
        y1: '#1D1D1D',
        t2: '#F2F2F2',
        y2: '#F2F2F2',
    },

    //  注单历史弹窗球种联赛字体颜色
    'theme-color-market_value': {
        t1: '#5a6074',
        y1: '#5a6074',
        t2: '#f2f2f2',
        y2: '#f2f2f2',
    },
    //  注单历史弹窗翻页字体颜色
    'theme-color-pagination-wrap': {
        t1: '#99a3b1',
        y1: '#000',
        t2: '#99a3b1',
        y2: '#788299',
    },
    //  赛果奇幻球种框字体
    'theme-color-rule-area': {
        t1: '#35363b',
        y1: '#35363b',
        t2: '#ffffff',
        y2: '#ffffff',
    },
  /****************注单历史 end****************/
  /****************详情&VR体育 start****************/
  'list-replay-text-color': {
    t1: '#000',
    y1: '#000',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'list-replay-number-text-color': {
    t1: '#5a6074',
    y1: '#5a6074',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'league-rank-title-text-color': {
    // t1: '#2d2d2d',
    // y1: '#2d2d2d',
    // t2: '#ffffff',
    // y2: '#ffffff',
    t1: '#1D1D1D',
    y1: '#1D1D1D',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  'league-rank-header-text-color': {
    t1: '#666',
    y1: '#666',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'vs-team-wrap-text-color': {
    t1: '#555',
    y1: '#555',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'wrap-score-text-color': {
    t1: '#888',
    y1: '#888',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'num-zero-text-color': {
    t1: '#D1D1D1',
    y1: '#D1D1D1',
    t2: 'rgba(160, 160, 160, 0.67)',
    y2: 'rgba(160, 160, 160, 0.67)',
  },
  'handicap-item-play-name-text-color': {
    t1: '#414655',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'hot-handicap-item-play-name-text-color': {
    t1: '#888888',
    y1: '#414655',
    t2: '#99a3b1',
    y2: '#ffffff',
  },
  'handicap-item-odds-text-color': {
    t1: '#414655',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'wrap-icon-color-hover': {
    t1: '#5a6074',
    y1: '#5a6074',
    t2: '#abbac8',
    y2: '#abbac8',
  },
  'more-handle-text-color': {
    t1: '#888',
    y1: '#888',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'wrap-recents-text-color': {
    t1: '#999',
    y1: '#999',
    t2: '#99a3b1',
    y2: '#99a3b1',
  },
  'wrap-recents-league-title-text-color': {
    t1: '#2d2d2d',
    y1: '#2d2d2d',
    t2: '#99a3b1',
    y2: '#99a3b1',
  },
  'right-icons-color': {
    t1: '#c2c2c2',
    y1: '#c2c2c2',
    t2: '#999',
    y2: '#999',
  },
  'right-icons-color-hover': {
    t1: '#c2c2c2',
    y1: '#c2c2c2',
    t2: '#d1d1d1',
    y2: '#d1d1d1',
  },
  'sr-link-icon': {
    t1: '#a5aec8',
    y1: '#a5aec8',
    t2: '#727d8a',
    y2: '#727d8a',
  },
  'wrap-hot-text-color': {
    t1: '#414655',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'back-arrow-icon': {
    t1: '#999',
    y1: '#999',
    t2: '#abbac8',
    y2: '#abbac8',
  },
  'right-wrap-icon-hover': {
    t1: '#666',
    y1: '#666',
    t2: '#abbac8',
    y2: '#abbac8',
  },
  'data-title-text-color': {
    t1: '#2d2d2d',
    y1: '#2d2d2d',
    t2: '#9ea5b4',
    y2: '#9ea5b4',
  },
  'progress-wrap-score-text-color': {
    t1: '#999',
    y1: '#999',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'match-wrap-list-text-active': {
    t1: '#83838a',
    y1: '#83838a',
    t2: '#99a3b1',
    y2: '#99a3b1',
  },
  'video-tips-wrap-text-color': {
    t1: '#cccccc',
    y1: '#cccccc',
    t2: '#99a3b1',
    y2: '#99a3b1',
  },
  'video-history-btn-border-color': {
    t1: '#FFB001',
    y1: '#179CFF',
    // y1: '#4276FB',
    t2: '#FFB001',
    y2: '#4276FB',
  },
  'video-history-video-border-color': {
    t1: 'rgba(255, 112, 0, 1)',
    y1: '#179CFF',
    // y1: '#4276FB',
    t2: 'rgba(255, 112, 0, 1)',
    y2: '#4276FB',
  },
  'video-history-btn-background-color': {
    t1: 'linear-gradient(315.29deg, rgba(255, 145, 36, 0.2) 0%, rgba(254, 176, 1, 0.2) 100%)',
    y1: 'rgba(66, 118, 251, 0.4)',
    t2: 'linear-gradient(315.29deg, rgba(255, 145, 36, 0.2) 0%, rgba(254, 176, 1, 0.2) 100%)',
    y2: 'rgba(66, 118, 251, 0.4)',
  },
  'icon-back-color': {
    t1: '#414655',
    y1: '#414655',
    t2: '#abbac8',
    y2: '#abbac8',
  },
  /****************详情&VR体育 end****************/
  'vr-text-color1': {
    t1: '#414655',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  "vr-text-color2": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#0086f3",
    t2: "#ffb001",
    y2: "#2CB2FF",
  },
  "vr-text-color5": {
    t1: "#6d7278",
    y1: "#6d7278",
    t2: "#99a3b1",
    y2: "#ebebec",
  },
  'vr-text-color6': {
    t1: '#6b737d',
    y1: '#6b737d',
    t2: '#6b737d',
    y2: '#ffffff',
  },
  'vr-text-color7': {
    t1: '#2d2d2d',
    y1: '#2d2d2d',
    t2: '',
    y2: '',
  },
  'vr-text-color8': {
    t1: '#666666',
    y1: '#666666',
    t2: '',
    y2: '',
  },
  'vr-text-color9': {
    t1: '#000',
    y1: '#000',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  "vr-text-color10": {
    t1: "#6d7278",
    y1: "#6d7278",
    t2: "#6d7278",
    y2: "#ebebec",
  },
  'go-top-btn-icon': {
    t1: '#999',
    y1: '#999',
    t2: '#babdcc',
    y2: '#babdcc',
  },
  /****************内嵌版菜单 start****************/
  "settings-label-text-color": {
    t1: "#6C6C6C",
    y1: "#6C6C6C",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "settings-label-text-colo2": {
    t1: "#666666",
    y1: "#666666",
    t2: "#898A8B",
    y2: "#898A8B",
  },
  "settings-item-text-color": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "settings-item-arrow-icon": {
    t1: "#6c7ba8",
    y1: "#6c7ba8",
    t2: "#717b89",
    y2: "#717b89",
  },
  "right-time-text-color": {
    t1: "#414655",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  /****************内嵌版菜单 end****************/

  /****************活动 start****************/
  "activity-text-color-4": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276FB",
    t2: "#ff7000",
    y2: "#4276FB",
  },
  "activity-text-color-16": {
    t1: "#333333",
    y1: "#ffffff",
    t2: "#333333",
    y2: "#ffffff",
  },
  /****************活动 end****************/

  /****************赛事分析 start****************/
  "analysis-text-color-15": {
    t1: "#e7eaee",
    y1:  "#e7eaee",
    t2:  "#3b3b3b",
    y2: "#3b3b3b",
  },
  "analysis-both-time-color-1": {
    t1: "#6C6C6C",
    y1:  "#6C6C6C",
    t2:  "#A0A0A0",
    y2: "#A0A0A0",
  },
  "analysis-tab-data-text-color-1": {
    t1: "#1D1D1D",
    y1: "#1D1D1D",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "analysis-match-time-color-1": {
    t1: "#1D1D1D",
    y1: "#1D1D1D",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
 
  /****************赛事分析 end****************/

  /****************虚拟体育 start****************/
  "vr-yb-text-color1": {
    t1: "#666",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "vr-yb-text-color2": {
    t1: "#2d2d2d",
    y1: "#414655",
    t2: "",
    y2: "#ffffff",
  },
  'vr-list-replay-text-color': {
    t1: '#000',
    y1: '#414655',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  'vr-league-rank-header-text-color': {
    t1: '#666',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'vr-league-rank-title-text-color': {
    t1: '#2d2d2d',
    y1: '#414655',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'vr-league-rank-title-text-color-2': {
    t1: '#666',
    y1: '#414655',
    t2: '#d1d1d1',
    y2: '#ffffff',
  },
  'vr-match-process': {
    t1: '#fa6400',
    y1: '#0086f3',
    t2: '#FFB001',
    y2: '#74C4FF',
  },
  /****************虚拟体育 end****************/

  /****************预约投注 start****************/
  // 取消预约投注弹出窗设置
  'bet-dialog-text-color1': {
    t1: '#414655',
    y1: '#555555 ',
    t2: '#B8B8B8',
    y2: '#B8B8B8',
  },
  'bet-dialog-text-color2': {
    t1: '#6D7278',
    y1: '#555555',
    t2: '#B8B8B8',
    y2: '#B8B8B8',
  },
  'bet-dialog-text-color3': {
    t1: '#ffb001',
    y1: '#569FFD',
    t2: '#ffb001',
    y2: '#569FFD',
  },
  /****************预约投注 end****************/

  /****************用户信息显示设置 start****************/
  'user-info-show-text-color1': {
    t1: '#555555',
    y1: '#555555',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'user-info-show-text-color2': {
    t1: 'color: rgba(153, 153, 153, 0.6)',
    y1: 'rgba(153, 153, 153, 0.6)',
    t2: '#5a6074',
    y2: '#A5AEC8',
  },
  'user-info-show-text-color3': {
    t1: '#2d2d2d',
    y1: '#2d2d2d',
    t2: '#ffffff',
    y2: '#ffffff',
  },
  'user-info-show-text-color4': {
    t1: '#bfbfbf',
    y1: '#bfbfbf',
    t2: '#5a6074',
    y2: '#A5AEC8',
  },
  /****************用户信息显示设置 end****************/
  /* 其他 */
  "scrollbar-color": {
    t1: "rgba(203,206,216,0.5)",
    y1: "rgba(203,206,216,0.5)",
    t2: "#262B34",
    y2: "#262B34",
  },
  "scrollbar-color2": {
    t1: "rgba(203,206,216,0.5)",
    y1: "rgba(203,206,216,0.5)",
    t2: "#262B34",
    y2: "#262B34",
  },
  "yb-text-color1": {
    t1: "#6c6c6c",
    y1: "#6c6c6c",
    t2: "#5a6074",
    y2: "#5a6074",
  },
  "yb-text-color2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#99a3b1",
    y2: "#ff7000",
  },
  "yb-text-color3_1": {
    t1: "#6c6c6c",
    y1: "#6c6c6c",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },

  "yb-text-color3": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },

  "yb-text-color4": {
    t1: "#1D1D1D",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "yb-text-color4-title": {
    t1: "#1D1D1D",
    y1: "#1d1d1d",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  // 注单历史提前结算 按钮上方的文字
  "bet-text-color4": {
    t1: "#1D1D1D",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "bet-info-wrap-color4": {
    t1: "#555555",
    y1: "#555555",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "yb-text-color4_1": {
    t1: "#BCBCBE",
    y1: "#BCBCBE",
    t2: "#626262",
    y2: "#626262",
  },
  "yb-text-color4_2": {
    t1: "#D7DEE3",
    y1: "#D7DEE3",
    t2: "#3B3A3D",
    y2: "#3B3A3D",
  },
  "yb-text-color4_6": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "yb-text-color4_2_1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#3B3A3D",
    y2: "#ffffff",
  },
  "yb-text-color4_2_2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#1F222B",
    y2: "#ffffff",
  },
  "yb-text-color4_2_submit2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "yb-text-color4_3": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#3B3A3D",
    y2: "#3B3A3D",
  },
  "yb-text-color4_3_1": {
    t1: "#d7dee3",
    y1: "#d7dee3",
    t2: "transparent",
    y2: "transparent",
  },
  "yb-text-color4_3_2": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#F2F2F2",
    y2: "#179CFF",
  },
  "yb-text-color4_3_3": {
    t1: "#1D1D1D",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#A0A0A0",
  },
  
  "yb-text-color5": {
    t1: "#2d2d2d",
    y1: "#2d2d2d",
    t2: "#ffb001",
    y2: "#ffb001",
  },
  "yb-text-color9": {
    t1: "#2d2d2d",
    y1: "#2d2d2d",
    t2: "#f5f7fa",
    y2: "#f5f7fa",
  },
  "yb-text-color9_0": {
    t1: "#ECF7FF",
    y1: "#ECF7FF",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "yb-text-color10": {
    t1: "#ffb001",
    y1: "#ffb001",
    t2: "#abbac8",
    y2: "#abbac8",
  },
  "yb-text-color11": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#272a33",
    y2: "#272a33",
  },
  "yb-text-color12": {
    t1: "#626262",
    y1: "#626262",
    t2: "#626262",
    y2: "#626262",
  },
  "yb-text-color13": {
    t1: "#414655",
    y1: "#414655",
    t2: "#babdcc",
    y2: "#babdcc",
  },
  "yb-text-color27": {
    t1: "#414655",
    y1: "#414655",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-text-color28": {
    t1: "#333333",
    y1: "#333333",
    t2: "#99a3b1",
    y2: "#99a3b1",
  },
  "yb-text-color29": {
    t1: "#6c6c6c",
    y1: "#6c6c6c",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-bg-hover-color24": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#535766",
    y2: "#535766",
  },

  "y0-text-color1": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#ffb001",
    y2: "#74C4FF",
  },
  "y0-text-color1_1_1": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#74c4ff",
    y2: "#74c4ff",
  },
  "y0-text-color1_results": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#179CFF",
    y2: "#179CFF",
  },
  "y0-text-color-champion": {
    t1: "#1d1d1d",
    y1: "#1d1d1d",
    t2: "#f2f2f2",
    y2: "#f2f2f2",
  },
  "y0-text-color-champion-1": {
    t1: "#1d1d1d",
    y1: "#179CFF",
    t2: "#f2f2f2",
    y2: "#f2f2f2",
  },
  "y0-text-color1_1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgba(255, 255, 255, 0.05);",
    y2: "rgba(255, 255, 255, 0.05);",
  },
  "y0-text-color1_2_1": {
    t1: "#7ca6ce",
    y1: "#7ca6ce",
    t2: "#626262",
    y2: "#626262",
  },
  "y0-text-color1_2": {
    t1: "#E93D3D",
    y1: "#E93D3D",
    t2: "#E93D3D",
    y2: "#E93D3D",
  },
  "y0-text-color1_3": {
    t1: "#FF7000",
    y1: "#FF7000",
    t2: "#E93D3D",
    y2: "#E93D3D",
  },
    //投注 已结算串关大颜色
    "y0-text-color1_4": {
      t1: "#555555",
      y1: "#555555",
      t2: "#ffffff",
      y2: "#ffffff",
    },
  "y0-text-color2": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#ffb001",
    y2: "#45B0FF",
  },
  "y0-text-color4": {
    t1: "#161c24",
    y1: "#17191d",
    t2: "#161c24",
    y2: "#161c24",
  },
  "y0-text-color5": {
    t1: "#414655",
    y1: "#1D1D1D",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "y0-text-color5_1": {
    t1: "#6C6C6C",
    y1: "#6C6C6C",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "y0-text-color5_2": {
    t1: "#1D1D1D",
    y1: "#1D1D1D",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "y0-text-color5_2_left": {
    t1: "#6C6C6C",
    y1: "#6C6C6C",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  // 赛事分析头部球队比分
  "y0-text-color5_3": {
    t1: "#1D1D1D",
    y1: "#1D1D1D",
    t2: "#74C4FF",
    y2: "#74C4FF",
  },
  "y0-text-color6": {
    t1: "#08d764",
    y1: "#6C7BA8",
    t2: "#08d764",
    y2: "#08d764",
  },
  "y0-text-color10": {
    t1: "#179CFF",
    // t1: "#ffb001",
    y1: "#179CFF",
    // y1: "#0086f3",
    t2: "#ffb001",
    y2: "#45B0FF",
  },
  "y0-text-color12": {
    t1: "#999",
    y1: "#4176fa",
    t2: "#5a6074",
    y2: "#68aaff",
  },
  "y0-text-color121": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "y0-text-color14": {
    t1: "#1d1d1d",
    y1: "#1d1d1d",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "y0-text-color15": {
    t1: "#ffb001",
    y1: "#0086f3",
    t2: "#ffb001",
    y2: "#0086f3",
  },
  "yb-text-color15": {
    t1: "#626262",
    y1: "#626262",
    t2: "#626262",
    y2: "#626262",
  },
  "yb-text-color17": {
    t1: "#179CFF",
    // t1: "#C31337",
    y1: "#179CFF",
    // y1: "#C31337",
    t2: "#b1222b",
    y2: "#ADDCFF",
  },
  "yb-text-color18": {
    t1: "#17191d",
    y1: "#17191d",
    t2: "#99a3b1",
    y2: "#99a3b1",
  },
  "yb-text-color19": {
    t1: "#f7f8fa",
    y1: "#f7f8fa",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-text-color20": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#5163b7",
    t2: "#ffb001",
    y2: "#74C4FF",
    // y2: "#a1b2ff",
  },
  "yb-text-color21": {
    t1: "#414655",
    y1: "#414655",
    t2: "#dde2e9",
    y2: "#dde2e9",
  },
  "yb-text-color22": {
    t1: "#a5aec8",
    y1: "#a5aec8",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-text-color23": {
    t1: "#6C7BA8",
    y1: "#6C6C6C",
    t2: "#99a3b1",
    y2: "#A0A0A0",
  },
  "yb-text-color25": {
    t1: "#17191d",
    y1: "#17191d",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-text-color26": {
    t1: "#CBCED8",
    y1: "#CBCED8",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "yb-text-color26_1": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "yb-text-color27_1": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#1F222B",
    y2: "#F2F2F2",
  },
  "y0-text-color0": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#2CB2FF",
    t2: "#ffb001",
    y2: "#2CB2FF",
  },
  "y0-text-color28": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#2CB2FF",
  },
  "y0-text-color29": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#414655",
    t2: "#ffb001",
    y2: "#ffffff",
  },

  "y0-text-color30": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "yb-text-active-color1": {
    t1: "#1d1d1d",
    y1: "#1d1d1d",
    t2: "#f2f2f2",
    y2: "#f2f2f2",
  },
  "yb-text-active-color1_1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgb(255,255,255,0.05)",
    y2: "rgb(255,255,255,0.05)",
  },
  "yb-text-active-colornew1": {
    t1: "#45B0FF",
    y1: "#45B0FF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "menu-text-color2": {
    t1: "#666",
    y1: "#868686",
    t2: "#626262",
    y2: "#F2F2F2",
  },
  "menu-text-color3": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#74C4FF",
  },
  "menu-text-color4": {
    t1: "#414655",
    y1: "#414655",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "match-text-color1": {
    t1: "#414655",
    y1: "#868686",
    t2: "#C8C8CA",
    y2: "#C8C8CA",
  },
  "match-text-color3": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#74C4FF",
    // y2: "#2cb2ff",
  },
  "match-text-color4": {
    t1: "#5a6074",
    y1: "#5a6074",
    t2: "#99a3b1",
    y2: "#99a3b1",
  },
  "match-text-color5": {
    t1: "#83838a",
    y1: "#83838a",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  "match-text-color6": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffffff",
    y2: "#ffffff",
  },
  /* 其他 end */
  'chatroom-text-color-1':{
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276FB",
    t2: "#ff7000",
    y2: "#4276FB",
  },
  'chatroom-text-color-2':{
    t1: "#C31337",
    y1: "#FC2222",
    t2: "#C31337",
    y2: "#FC2222",
  } ,
  "y0-collect-start-text-color-3": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#ffb001",
    // y1: "#0086f3",
    t2: "#ffb001",
    y2: "#2CB2FF",
  },
  "y0-collect-start-text-color-upd-4": {
    // t1: "#ff7000",
    t1: "#179CFF",
    // y1: "#ff7000",
    y1: "#ffb001",
    t2: "#ffb001",
    y2: "#ffb001",
  },



  /****************新手版***************/

  "match-new-text-color1": {
    t1: "#6c6c6c",
    y1: "#6c6c6c",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "match-new-text-color2": {
    t1: "#555555",
    y1: "#555555",
    t2: "#A0A0A0",
    y2: "#A0A0A0",
  },
  "details-chat-blue": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#74C4FF",
    y2: "#74C4FF",
  },
  "details-chat-origin": {
    t1: "#FF7000",
    y1: "#FF7000",
    t2: "#FFB001",
    y2: "#FFB001",
  },
  "details-chat-num_zero": {
    t1: "#D1D1D1",
    y1: "#D1D1D1",
    t2: "rgba(160, 160, 160, 0.67)",
    y2: "rgba(160, 160, 160, 0.67)",
  },
  "menu-item-text-color": {
    t1: "#555555",
    y1: "#555555",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "menu-item-text-color-hover": {
    t1: "#FFB001",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  "menu-item-number-color": {
    t1: "#6C6C6C",
    y1: "#6C6C6C",
    t2: "#F2F2F2",
    y2: "#F2F2F2",
  },
  "menu-item-title-color": {
    t1: "#FFB001",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#74C4FF",
  },
  'back-menu-bg-border-color': {
    t1: '#D7DEE3',
    y1: '#D7DEE3',
    t2: '#3B3A3D',
    y2: '#3B3A3D',
  },
  'menu-middle-text-color': {
    t1: '#6C6C6C',
    y1: '#6C6C6C',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  'menu-middle-text-color-hover': {
    t1: '#FFFFFF',
    y1: '#FFFFFF',
    t2: '#FFFFFF',
    y2: '#FFFFFF',
  },
  'theme-bd-keyboard-color-hover': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#45B0FF',
  },
  'theme-bd-keyboard-text-color-hover': {
    t1: '#FFFFFF',
    y1: '#FFFFFF',
    t2: '#1F222B',
    y2: '#FFFFFF',
  },
  'theme-color-disable-keyboard': {
    t1: '#CBCED8',
    y1: '#CBCED8',
    t2: '#626262',
    y2: '#626262',
  },
  /* 提前结算按钮余额文字颜色 */
  'bet-pre-money-text-color': {
    t1: '#CBCED8',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#179cff',
  },
  /* 提前结算按钮提前结算文字颜色 */
  'bet-pre-btn-text-color': {
    t1: '#CBCED8',
    y1: '#555555',
    t2: '#FFB001',
    y2: '#179CFF',
  },
  'book-content-pre-color': {
    t1: '#555555',
    y1: '#555555',
    t2: '#A0A0A0',
    y2: '#A0A0A0',
  },
 /* 公告顶部字体颜色 */
 'notice-top-text-color':{
    t1: '#626262',
    y1: '#626262',
    t2: '#555555',
    y2: '#555555',
 },
 /* 公告内容字体颜色 */
 'notice-content-text-color':{
    t1: '#191c24',
    y1: '#191c24',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
 },
 'vr-text-color':{
    t1: '#6C6C6C',
    y1: '#6C6C6C',
    t2: '#F2F2F2',
    y2: '#F2F2F2',
  },
  'vr-text-color-hover':{
    t1: '#FFFFFF',
    y1: '#FFFFFF',
    t2: '#1F222B',
    y2: '#F2F2F2',
  },
  'vr-border-color':{
    t1: '#E2E2E4',
    y1: '#E2E2E4',
    t2: '#35363C',
    y2: '#35363C',
  },
};
