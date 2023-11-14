

/**
 * module/border.js 仅配置border-color
 * module/background.js 仅配置background-color、background-image
 * module/color.js 仅配置color
 * theme.js 可以配置其他杂项，但不允许配置上述样式变量
 */
//背景图片前缀
let preffix = ''
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') preffix = '/' + require('app/version.js').BUILD_VERSION

export default {
  // 主题色通用 背景颜色
  "theme-bg-common": {
    t1: "#414655",
    y1: "#414655",
    t2: "#fff",
    y2: "#fff",
  },

  // 通用线条背景
  'theme-bg-line': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#4176fa',
    t2: '#ffb001',
    y2: '#2cb2ff',
  },

  // 主要滚动条
  "bg-main-scroll": {
    t1: "#f0f6ff",
    y1: "#f0f6ff",
    t2: "#1f222b",
    y2: "#1f222b",
  },
  // 主要滚动条horizontal
  "bg-main-scroll-h": {
    t1: "#d1d5d8",
    y1: "#dde1eb",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },

  //复选框
  "bg-check-wrap": {
    t1: "#fff",
    y1: "#fff",
    t2: "#22262f",
    y2: "#22262f",
  },

  // ------------------> 投注以及注单历史相关开始 <------------------
  // 投注项  盘口  背景颜色
  "theme-bg-handicap": {
    t1: "#414655",
    y1: "#414655",
    t2: "#fff",
    y2: "#fff",
  },

  //投注记录背景
  "theme-bg-record": {
    t1: "#fff",
    y1: "#fff",
    t2: "#414655",
    y2: "#414655",
  },

  //投注失效
  "theme-bg-invalid": {
    t1: "#f25151",
    y1: "rgba(255, 64, 64, 0.8)",
    t2: "#f25151",
    y2: "rgba(255,64,64,0.4)",
  },

  //投注赢
  "theme-bg-win": {
    t1: "#FF4040",
    y1: "#E93D3D",
    t2: "#E93D3D",
    y2: "#E93D3D",
  },

  //投注输
  "theme-bg-lose": {
    t1: "#5a6074",
    y1: "#6C6C6C",
    // y1: "rgba(165,174,200,0.80)",
    t2: "#6C6C6C",
    y2: "#6C6C6C",
  },

  //单双关切换按钮hover效果
  "theme-bg-bet-series": {
    t1: "rgba(255,176,0,0.2)",
    y1: "rgba(86,159,253,0.1)",
    t2: "rgba(255,176,0,0.2)",
    y2: "rgba(86,159,253,0.1)",
  },

  //投注框hover背景效果
  "theme-bg-bet-zone-head": {
    t1: "transparent",
    y1: "transparent",
    t2: "transparent",
    y2: "rgba(86, 159, 253, 0.1)",
  },

  //投注失效按钮背景色
  "theme-bg-bet-bet-submit2": {
    t1: "#CBCED8",
    y1: "#CBCED8",
    t2: "#626262",
    y2: "#626262",
  },

  //蒙层
  "theme-bg-mask": {
    t1: "rgba(225,225,225,0.8)",
    y1: "rgba(225,225,225,0.8)",
    t2: "rgba(43, 48, 56, 0.88);",
    y2: "rgba(43, 48, 56, 0.88);",
  },

  //预约蒙层
  "theme-cathectic-appoint": {
    t1: "rgba(255, 255, 255, 0.5)",
    y1: "rgba(255, 255, 255, 0.5);",
    t2: "rgba(0, 0, 0, 0.5);",
    y2: "rgba(0, 0, 0, 0.5); ",
  },

  // 投注项  盘口  背景颜色  hover
  "theme-bg-handicap-hover": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#2883f9",
  },

  // 确定按钮背景
  "theme-bg-bet-confirm": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#ffb001",
    y2: '#45B0FF'//"#5A6074",
  },

  // bet-item 单个投注项组件  背景颜色

  "theme-bg-bet-item": {
    t1: "#414655",
    y1: "#414655",
    t2: "#fff",
    y2: "#fff",
  },

  // bet-item 单个投注项组件  背景颜色 右半部分

  "theme-bg-bet-item-right": {
    t1: "rgba(240,246,255,0.4)",
    y1: "rgba(240,246,255,0.4)",
    t2: "#1f222b",
    y2: "#1f222b",
  },

  // bet-item 单个投注项组件  背景颜色  hover
  "theme-bg-bet-item-hover": {
    t1: "#ecf4ff",
    y1: "#ecf4ff",
    t2: "#2d3749",
    y2: "#2d3749",
  },


  //预约input
  "theme-bg-bet-pre-input": {
    t1: "transparent",
    y1: "transparent",
    t2: "transparent",
    y2: "transparent",
  },

  //渐变背景投注卡片
  "theme-bg-bet-card": {
    t1: "#F0F5FC",
    y1: "#F0F5FC",
    t2: "#2F333E",
    y2: "#2F333E",
  },

  //减加
  "theme-bg-add-sub": {
    t1: "#F2F5F9",
    y1: "#F2F5F9",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  //   大视频投注激活
  'theme-bg-video-item': {
    t1: '#FFB001',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#2CB2FF',
  },
  // ------------------> 投注以及注单历史相关结束 <------------------

  // ------------------> 晒单列表开始 <------------------

  //大背景
  "theme-bg-bet-saidan-list": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#262A36",
    y2: "#262A36",
  },

  //按钮背景
  "theme-bg-clear-btn": {
    t1: "rgba(248,249,251,0.20)",
    y1: "rgba(248,249,251,0.20)",
    t2: "rgba(59,67,89,0.20)",
    y2: "rgba(59,67,89,0.20)",
  },

  //晒单不能点击
  "theme-bg-is-saidan-unclick": {
    t1: "#F6F7FA",
    y1: "#F6F7FA",
    t2: "rgba(59,67,89,0.20)",
    y2: "rgba(59,67,89,0.20)",
  },

  // ------------------> 晒单列表结束<------------------
  // 列表 日期 菜单栏目
  "theme-bg-date-menu-row": {
    t1: "#fff",
    y1: "#fff",
    t2: "#191c24",
    y2: "#191c24",
  },

  "list-header-row-bg": {
    t1: "#fff",
    y1: "#fff",
    t2: "rgba(255, 255, 255, 0.1)",
    y2: "rgba(255, 255, 255, 0.1)",
  },
  "list-header-row-item-bg": {
    t1: "#fff",
    y1: "#fff",
    t2: "#1F222B",
    y2: "#1F222B",
  },
  "list-header-leagues-tabs-bg": {
    t1: "linear-gradient(99deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0.00) 21.76%), #fff",
    y1: "linear-gradient(99deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0.00) 21.76%), #fff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "chuanguan-bg-color": {
    t1: "#fff",
    y1: "#fff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  // 按钮组
  "theme-bg-btn-group": {
    t1: "#fff",
    y1: "#fff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  //搜索框插件 赛事
  "theme-bg-search-match": {
    t1: "#fff",
    y1: "#fff",
    t2: "#1f222b",
    y2: "#1f222b",
  },
  //搜索结果
  "theme-bg-search-result": {
    t1: "#fff",
    y1: "#fff",
    t2: "#21232d",
    y2: "#21232d",
  },
  //搜索-hover
  "theme-bg-search-hover": {
    t1: "#f6f7fa",
    y1: "#F3FAFF",
    t2: "rgba(255, 176, 1, 0.10)",
    y2: "rgba(116, 196, 255, 0.10);",
  },

  //site-header
  "theme-bg-site-header": {
    t1: "#fff",
    y1: "#fff",
    t2: "#191c24",
    y2: "#1f222b",
  },
  //bet-content
  "theme-bg-bet-content": {
    t1: "#fff",
    y1: "#fff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  //下注金额按钮
  "theme-bg-bet-btn": {
    t1: "#fff",//e4ebf1
    y1: "hsla(0,0%,100%,0.6)",//bfcedd
    t2: "#3c3f4c",//3c3f4c none
    y2: "#3c3f4c",//0
  },
  //下注金额按钮-hover
  // "theme-bg-bet-btn-hover": {
  //   t1: "#ffb001",
  //   y1: "#4176fa",
  //   t2: "#ffb001",
  //   y2: "#2883f9",
  // },

  //bet-btn-appoint
  "theme-bg-bet-btn-appoint": {
    t1: "rgba(255,176,0,0.2)",       //#ff9124  #ffb001
    y1: "rgba(65,118,250,0.15)",  //#4176fa  #4176fa
    t2: "rgba(255,176,0,0.2)",       //#ff9124  #ffb001
    y2: "rgba(86,159,253,0.2)",   //#2cb2ff  #2cb2ff
  },

  // 主体背景色
  "theme-main-content-bg-color": {
    t1: "#EFF1F6",
    y1: "#EFF1F6",
    // t2: `url(${preffix}/image/yabo/svg/page_background.png)`,
    // y2: `url(${preffix}/image/yabo/svg/page_background.png)`,
  },

  // 左侧投注背景色
  "bet-main-content-bg-color": {
    t1: "#EFF1F6",
    y1: "#ffffff",
    t2: `none`,
    y2: `none`,
  },
  //搜索框遮罩层
  "theme-bg-search-mask": {
    t1: "rgba(20,23,29,0.15)",
    y1: "rgba(20,23,29,0.15)",
    t2: "rgba(20,23,29,0.8)",
    y2: "rgba(20,23,29,0.8)",
  },
  "mk-content-bg-color": {
    t1: "#EFF1F6",
    y1: "#EFF1F6",
    t2: "#191c24",
    y2: "#191c24",
  },
  //菜单激活线条
  "theme-bg-menu-line-active": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#2cb2ff",
  },
  //菜单展开关闭按钮
  "theme-bg-menu-toggle-btn": {
    t1: "linear-gradient(180deg, #ffb001d9 0%, #ff7000d9 100%)",
    y1: "#179CFF",
    t2: "#ffb001",
    y2: "#2cb2ff",
  },
  // y0-bg-color12适用
  "theme-bg-menu-fixed": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#262B37",
    y2: "#262B37",
  },

  // 顶部菜单row转column
  "y0-menu-inline-column": {
    t1: "block",
    y1: "block",
    t2: "block",
    y2: "block",
  },

  // 顶部菜单column转row
  "y0-menu-inline-row": {
    t1: "inline-block",
    y1: "inline-block",
    t2: "inline-block",
    y2: "inline-block",
  },

  "y0-menu-inline-row-5": {
    t1: "5px",
    y1: "5px",
    t2: "5px",
    y2: "5px",
  },

  "y0-menu-inline-column-0": {
    t1: "0px",
    y1: "0px",
    t2: "0px",
    y2: "0px",
  },
  // 顶部菜单背景渐变色
  "theme-bg-menu-match-type": {
    t1: "linear-gradient(180deg, #179CFF,#179CFF)",
    // t1: "linear-gradient(180deg, #FFB001,#FF7000)",
    y1: "linear-gradient(319.79deg, #179CFF,#179CFF)",
    // y1: "linear-gradient(319.79deg, #3D72FA,#62B3FF)",
    t2: "linear-gradient(180deg, #FFB001,#FF7000)",
    // y2: "linear-gradient(319.79deg, #3D72FA,#62B3FF)",
    // t2: "linear-gradient(319.79deg, #179CFF,#179CFF)",
    y2: "linear-gradient(319.79deg, #45B0FF,#45B0FF)",
  },


  "theme-bg-menu-match-type-no-active": {
    t1: "linear-gradient(0deg, #FFFFFF,#E5EDFF,#FFFFFF)",
    y1: "linear-gradient(0deg, #FFFFFF,#E5EDFF,#FFFFFF)",
    t2: "linear-gradient(0deg, #3B414E,#1D202A,#2C313F)",
    y2: "linear-gradient(0deg, #3B414E,#1D202A,#2C313F)",
  },
  "theme-bg-menu-match-type-hover-no-active": {
    t1: "linear-gradient(180deg, #F3F5FB,#F3F5FB)",
    y1: "linear-gradient(180deg, #F3F5FB,#F3F5FB)",
    t2: "linear-gradient(180deg, #3B414E,#414655)",
    y2: "linear-gradient(180deg, #3B414E,#414655)",
  },

  // 顶部菜单背景渐变色
  "theme-bg-menu-match-type-old": {
    t1: "linear-gradient(319.79deg, #FFFFFF,#FFFFFF)",
    y1: "linear-gradient(180deg, #FFFFFF,#FFFFFF)",
    t2: "linear-gradient(319.79deg, #FFFFFF,#FFFFFF)",
    y2: "linear-gradient(180deg, #FFFFFF,#FFFFFF)",
  },

  // 顶部菜单背景渐变色
  "theme-bg-menu-match-type-solid": {
    t1: "#BFCEDD",
    y1: "#BFCEDD",
    t2: "#414655",
    y2: "#414655",
  },

  // 顶部菜单背景渐变色
  "theme-bg-menu-match-type-count-no-active": {
    t1: "#414655",
    y1: "#414655",
    t2: "#FFFFFF",
    y2: "#FFFFFF",
  },



  // 渐变背景 主列表 球类标题
  "theme-bg-match-type": {
    t1: "linear-gradient(225deg,#f5f6fa,#a8b1ca)",
    y1: "linear-gradient(225deg,#3d72fa,#62b6ff)",
    t2: "linear-gradient(225deg,#272a33,#656e88)",
    y2: "linear-gradient(225deg,#3d72fa,#62b6ff)",
  },

  // 渐变背景 主列表 联赛标题
  "theme-bg-match-league-row": {
    t1: "linear-gradient(180deg,#fff 22%,#f7f8ff);",
    y1: "linear-gradient(180deg,#fff 22%,#f7f8ff)",
    t2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
    y2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
  },

  // 渐变背景 赛事详情 玩法标题
  "theme-bg-match-detail-play-name-row": {
    t1: "linear-gradient(180deg,#fff 21%,#f0f3f7)",
    y1: "linear-gradient(180deg,#fff 22%,#f7f8ff)",
    t2: "linear-gradient(0deg,#2e3039,#3c3f4c)",
    y2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
  },

  // 渐变背景 菜单 主
  "theme-bg-main-menu-active": {
    t1: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(255,176,1,0.24) 55%,rgba(255,112,0,0.4))",
    y1: "linear-gradient(225deg,rgba(61,114,250,0),rgba(98,182,255,0.3))",
    t2: "linear-gradient(225deg,rgba(255,176,1,0.1),rgba(255,176,1,0.3))",
    y2: "linear-gradient(-45deg,rgba(86,159,253,0.02),rgba(86,159,253,0.35))",
  },

  // 渐变背景 菜单 主 展开区域
  "theme-bg-menu-fold2-wrap": {
    t1: "linear-gradient(269deg,#fff,#f0f6ff)",
    y1: "linear-gradient(269deg,#fff,#f0f6ff)",
    t2: "#191c24",
    y2: "#191c24",
  },

  //菜单 搜索框
  "theme-bg-menu-search-wrap": {
    t1: "linear-gradient(-62deg,rgba(255,176,1,0.1) 4%,rgba(255,176,1,0.1) 96%)",
    y1: "#419bf9",
    t2: "linear-gradient(-62deg, rgba(86,159,253,0.10) 4%, rgba(86,159,253,0.10) 96%)",
    y2: "#419bf9",
  },

  //card头部按钮渐变(按钮组-左)
  "theme-bg-card-btn": {
    t1: "linear-gradient(180deg,#ffb001,#ff7000)",
    y1: "linear-gradient(180deg,#62b6ff,#3d72fa)",
    t2: "linear-gradient(179deg,#ffb001,#ff7000)",
    y2: "linear-gradient(180deg,#62b6ff,#3d72fa)",
  },

  //card头部按钮渐变2(热门、收起)
  "theme-bg-card-btn2": {
    t1: "linear-gradient(198deg,#ffb001,#ff7000 95%)",
    y1: "linear-gradient(135deg,#3d72fa,#62b6ff)",
    t2: "linear-gradient(198deg,#ffb001,#ff7000 95%)",
    y2: "linear-gradient(135deg,#3d72fa,#62b6ff)",
  },
  //card头部按钮3 (按钮组-右)
  "theme-bg-card-btn3": {
    t1: "linear-gradient(198deg,#ffb001,#ff7000 95%)",
    y1: "linear-gradient(135deg,#3d72fa,#62b6ff)",
    t2: "#fff",
    y2: "linear-gradient(135deg,#3d72fa,#62b6ff)",
  },

  //card内部按钮激活
  "theme-bg-btn-active1": {
    t1: "linear-gradient(270deg,rgba(255,176,1,0.1),rgba(255,112,0,0.1))",
    y1: "#f0f6ff",
    t2: "linear-gradient(270deg,rgba(255,176,1,0.1))",
    y2: "#3b465b",
  },
  //选择按钮(选择联赛)
  "theme-bg-select-btn": {
    t1: "#fff",
    y1: "#f0f6ff",
    t2: "linear-gradient(180deg,#191c24 22%,#212736)",
    y2: "#3b465b",
  },
  //card内部按钮激活2(首页右侧card内按钮激活状态)
  "theme-bg-btn-active2": {
    t1: "linear-gradient(270deg,#138CFF,#138CFF)",
    // t1: "linear-gradient(270deg,#ff7000,#ff7000)",
    y1: "linear-gradient(180deg,#138CFF,#138CFF)",
    // y1: "linear-gradient(180deg,#62b6ff,#3d72fa)",
    t2: "linear-gradient(270deg,#ffb001,#ffb001)",
    y2: "linear-gradient(180deg,#62b6ff,#3d72fa)",
  },
  //hover #99a3b1
  //搜索框
  "theme-bg-search-box": {
    t1: "linear-gradient(-62deg,rgba(255,176,1,0.1) 4%,rgba(255,176,1,0.1) 96%)",
    y1: "linear-gradient(-62deg,rgba(86,159,253,0.1) 4%,rgba(86,159,253,0.1) 96%)",
    t2: "linear-gradient(-62deg,rgba(255,176,1,0.1) 4%,rgba(255,176,1,0.1) 96%)",
    y2: "linear-gradient(-62deg,rgba(86,159,253,0.1) 4%,rgba(86,159,253,0.1) 96%)",
  },

  //菜单按钮
  'img-bg-today-menu': {
    t1: `url(${preffix}/image/yabo/png/today_menu_bg_1.png)`,
    y1: `url(${preffix}/image/yabo/png/today_menu_bg_2.png)`,
    t2: `url(${preffix}/image/yabo/png/today_menu_bg_1_1.png)`,
    y2: `url(${preffix}/image/yabo/png/today_menu_bg_2_2.png)`,
  },
  //菜单按钮激活
  'img-bg-today-menu-active': {
    t1: `url(${preffix}/image/yabo/png/today_menu_bg_2_2_active.png)`,
    // t1: `url(${preffix}/image/yabo/png/today_menu_bg_1_active.png)`,
    y1: `url(${preffix}/image/yabo/png/today_menu_bg_2_2_active.png)`,
    t2: `url(${preffix}/image/yabo/png/today_menu_bg_1_active.png)`,
    y2: `url(${preffix}/image/yabo/png/today_menu_bg_2_2_active.png)`,
  },
  //左侧菜单live背景
  'img-bg-menu-live': {
    t1: `url(${preffix}/image/common/png/live_txt_01.png)`,
    y1: `url(${preffix}/image/common/png/live_txt_02.png)`,
    t2: `url(${preffix}/image/common/png/live_txt_01.png)`,
    y2: `url(${preffix}/image/common/png/live_txt_02.png)`,
  },

  // 右侧详情加载loading进行优化
  'theme-bg-details_loading': {
    t1: 'rgba(0, 0, 0, 0.6)',
    y1: 'rgba(0, 0, 0, 0.6)',
    t2: 'rgba(0, 0, 0, 0.7)',
    y2: 'rgba(0, 0, 0, 0.7)',
  },

  /****************站点头部 start****************/
  'theme-bg-simple-header': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#1F222B',
    y2: '#1F222B',
  },

  /****************站点头部 start****************/

  /****************注单历史 start****************/
  // 提前结算按钮
  'theme-bg-pre-btn': {
    t1: 'linear-gradient(360deg,rgba(255,176,1,0.5),rgba(255,176,1,0.04) 99%)',
    y1: 'rgba(23,156,255,0.20)',
    t2: 'rgba(255,176,1,0.20)',
    y2: 'rgba(69,176,255,0.20)',
  },
    // 提前结算按钮
  'theme-bg-pre-btn-1': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#45B0FF',
  },
  // 提前结算按钮
  'theme-bg-pre-btn-2': {
    t1: '#F2F2F2',
    y1: '#F2F2F2',
    t2: '#1F222B',
    y2: '#F2F2F2',
  },
  // 提前结算按钮划过样式
  'theme-bg-pre-btn-hover': {
    t1: '#179CFF',
    y1: 'rgba(23, 156, 255, 0.5)',
    t2: 'rgba(255, 176, 1, 0.5)',
    y2: 'rgba(69, 176, 255, 0.5) ',
  },
  // 提前结算按钮划过样式2
  'theme-bg-pre-btn2': {
    t1: 'transparent',
    y1: 'transparent',
    t2: '#ffffff',
    y2: 'transparent',
  },
  // 暂停提前结算
  'theme-bg-pre-stop-btn': {
    t1: '#DFE0E8',
    y1: '#FFFFFF',
    t2: '#DFE0E8',
    y2: 'rgba(0,0,0,0.20)',
  },
  //  查看所有注单
  'theme-bg-load-all': {
    t1: '#fff',
    y1: '#fff',
    t2: '#272a33',
    y2: '#272a33',
  },
  // 提前结算结算详情
  'theme-bg-bet-detail': {
    t1: '#E1E7EF',
    y1: '#DFECFE',
    t2: '#3F4352',
    y2: '#3F4352',
  },
  // 提前结算弹窗结算详情
  'theme-bg-bet-ceil-detail': {
    t1: 'transparent',
    y1: 'transparent',
    t2: 'transparent',
    y2: 'rgba(86, 159, 253, 0.1)',
  },
  // 时间选择器
  'theme-bg-date-range': {
    t1: 'rgba(255,176,1,0.5)',
    y1: 'currentColor',
    t2: 'rgba(255,176,1,0.5)',
    y2: 'currentColor',
  },
  //  赛果背景
  'theme-bg-match_results': {
    t1: '#fff',
    // y1: '#fff',
    y1: '#EFF1F6',
    t2: '#0b0b0b',
    y2: '#0b0b0b',
  },
  //  赛果搜索按钮
  'theme-bg-results-search-btn': {
    t1: 'linear-gradient(225deg,#ffb001,#138CFF)',
    // t1: 'linear-gradient(225deg,#ffb001,#ff7000)',
    y1: '#179cff',
    t2: '#ffb001',
    y2: '#179cff',
  },
  //  排序选择器 hover
  'theme-bg-wrap-time-hover': {
    t1: '#f6f7fa',
    y1: '#f6f7fa',
    t2: 'rgba(255,176,1,0.5)',
    y2: 'rgba(86,159,253,0.4)',
  },
  //  预约头部背景
  'theme-bg-appoint-order': {
    t1: '#FFFFFF',
    y1: '#FFFFFF',
    t2: '#262B37',
    y2: '#262B37',
  },
  //预约分割线
  "theme-bg-appoint-line": {
    t1: "transparent",
    y1: "#E4EBF1;",
    t2: "transparent",
    y2: "#3D4152",
  },
  //预约阴影
  "theme-bg-appoint-order-status": {
    t1: "0px 1px 4px 0px rgba(0,0,0,0.1)",
    y1: "0;",
    t2: "0px 1px 4px 0px rgba(0,0,0,0.1)",
    y2: "0",
  },
  // 投注串关开关 开 背景颜色
  'theme-bg-bet-series-open': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#2CB2FF',
  },
  // 投注串关开关 关 背景颜色
  'theme-bg-bet-series-close': {
    t1: '#FFFFFF',
    y1: '#FFFFFF',
    t2: '#1F222B',
    y2: '#1F222B',
  },
  // 投注串关开关 开 字体颜色
  'theme-bg-bet-series-text-open': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#74C4FF',
  },
  // 投注串关开关 关 字体颜色
  'theme-bg-bet-series-text-close': {
    t1: '#99A3B1',
    y1: '#99A3B1',
    t2: '#A0A0A0',
    y2: '#A0A0A0',
  },
  // 投注项删除按钮
  'theme-bg-bet-text-delete': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: '#45B0FF',
  },
  //  投注数量背景颜色
  'theme-bg-bet-count': {
    t1: '#ffb001',
    y1: '#179CFF',
    // y1: '#4176fa',
    t2: '#ffb001',
    y2: '#2cb2ff',
  },
  //  赛事详情坑位背景色
  'theme-bg-handicap-item': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: 'transparent',
    y2: 'transparent',
  },

  /****************注单历史 end****************/
  // 注单历史弹窗table背景
  'theme-bg-table-content': {
    t1: `#ffffff`,
    y1: `#ffffff`,
    t2: `transparent`,
    y2: `#1b1c25`,
  },
  // 注单历史详情二级列表
  'theme-bg-shadow-bg': {
    t1: `#f5f7fa`,
    y1: `#f5f7fa`,
    t2: `#3a3e4b`,
    y2: `#3a3e4b`,
  },
  //赛果日期排序
  'img-bg-position-sort': {
    t1: `-72px`,
    y1: `-24px`,
    t2: `-48px`,
    y2: `0`,
  },
  'img-bg-position-sort-up': {
    t1: `-84px`,
    y1: `-36px`,
    t2: `-60px`,
    y2: `-12px`,
  },
  /****************右侧顶部 全局切换菜单****************/
  'popup-wrap-bg-color': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'version-popup-wrap-bg-color': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#242526',
    y2: '#242526',
  },
  'popup-wrap-bg-color-hover': {
    t1: 'linear-gradient(90deg, rgba(23, 156, 255, 0.3) 0%, rgba(250, 252, 255, 0.01) 100%);',
    y1: 'linear-gradient(90deg, rgba(23, 156, 255, 0.3) 0%, rgba(250, 252, 255, 0.01) 100%);',
    t2: 'linear-gradient(243.79deg, rgba(0, 0, 0, 0.01) 16.49%, rgba(255, 176, 1, 0.3) 83.51%);',
    y2: 'linear-gradient(90deg, rgba(23, 156, 255, 0.3) 0%, rgba(250, 252, 255, 0.01) 100%);',
  },
  'popup-wrap-box-shadow': {
    t1: '0 0 4px 2px rgb(0 0 0 / 10%)',
    y1: '0 0 4px 2px rgb(0 0 0 / 10%)',
    t2: '0 0 4px 2px rgb(0 0 0 / 10%)',
    y2: '0 0 4px 2px rgb(0 0 0 / 10%)',
  },
  'popup-wrap-text-color-active': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#4276fb',
    t2: '#ffb001',
    y2: '#2cb2ff',
  },
  'popup-wrap-text-color-active-1': {
    t1: '#fff',
    y1: '#fff',
    t2: 'rgba(255, 255, 255, 0.10)',
    y2: 'rgba(255, 255, 255, 0.10)',
  },
  'popup-wrap-text-color-active-2': {
    t1: '#D7DEE3',
    y1: '#D7DEE3',
    t2: 'transparent',
    y2: 'transparent',
  },
  /****************右侧顶部 全局切换菜单****************/


  /****************左侧菜单,头部菜单 start****************/
  //余额刷新icon
  "theme-bg-refresh-icon": {
    t1: "#fff",
    y1: "#fff",
    t2: "#303137",
    y2: "#303137",
  },
  /****************左侧菜单,头部菜单 end****************/

  /****************主列表 start****************/
  //列表右上角搜索
  'bg-main-search': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: '#3c3f4c',
    y2: '#3c3f4c',
  },
  //无选中时确定按钮
  'bg-filter-btn-dis': {
    t1: '#f0f5fc',//fg rgba(45,45,45,0.3) bd e6ebf2
    y1: '#f0f5fc',//fg rgba(45,45,45,0.3) bd e6ebf2
    t2: '#5a6074',//fg #99a3b1  bd #5a6074
    y2: '#5a6074',//fg fff
  },
  //filter关闭按钮
  'bg-filter-btn-close': {
    t1: 'none',
    y1: 'none',
    t2: '#272a33',
    y2: '#272a33',
  },
  //竖线节点背景
  'bg-wrap-point': {
    t1: '#d0d8de',
    y1: '#d0d8de',
    t2: '#3d4152',
    y2: '#3d4152',
  },
  //搜索底部
  'bg--search-footer': {
    t1: '#fafafa',
    y1: '#fafafa',
    t2: '#191c24',
    y2: '#191c24',
  },


  /****************主列表 end****************/



  /****************详情 start****************/
  // 玩法集
  'theme-bg-tab-item': {
    t1: 'rgba(240,246,255,0.2)',
    y1: '',
    t2: 'rgba(59,67,89,0.2)',
    y2: '',
  },
  'theme-bg-tab-item-active': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#FFB001',
    y2: 'linear-gradient(0deg, #45B0FF 0%, #45B0FF 100%), linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%);',
  },
  'theme-bg-tab-item-hover': {
    t1: 'rgba(250,230,194,0.2)',
    y1: 'rgba(66,118,251,0.06)',
    t2: 'rgba(250,230,194,0.2)',
    y2: '',
  },
  // 玩法集名称前修饰样式
  'theme-bg-play-name-before': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#4276fb',
    // t2: '#ffb001',
    // y2: '#2CB2FF',
    t2: '#45B0FF',
    y2: '#45B0FF',
  },
  'list-replay-bg-color': {
    t1: '#fff',
    y1: '#fff',
    t2: 'rgba(34, 40, 47, 0.9)',
    y2: 'rgba(34, 40, 47, 0.9)',
  },
  // 详情页精彩回放进度条背景色
  'theme-bg-video-history-progress': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#4276fb',
    t2: '#ffb001',
    y2: '#2CB2FF',
  },
  // 详情页精彩回放进度条底部容器背景色
  'theme-bg-video-history-progress-container': {
    t1: 'rgba(0, 0, 0, 0.1)',
    y1: 'rgba(0, 0, 0, 0.1)',
    t2: 'rgba(255, 255, 255, 0.1)',
    y2: 'rgba(255, 255, 255, 0.1)',
  },
  // 详情页精彩回放进度条icon边框颜色
  'theme-border-video-history-icon': {
    t1: '#FF700066',
    y1: '#179CFF66',
    t2: '#ffb00166',
    y2: '#2CB2FF66',
  },
  /****************详情 end****************/

  /****************公告 start****************/
  'theme-bg-announce': {
    t1: 'transparent',
    y1: 'transparent',
    t2: '#1f222b',
    y2: '#1f222b',
  },

  //左侧菜单-hover
  "bg-left-menu-hover": {
    t1: "#F3fAFF",
    y1: "#F3fAFF",
    t2: "#262933",
    y2: "#2c3642",
  },
  /****************公告 end****************/

  /* 其他 start */
  "theme-body-bg-color": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#191c24",
    y2: "#191c24",
  },
  "y0-btn-hover": {
    t1: "#179CFF",
    // t1: "#ffb001",
    y1: "#179CFF",
    // y1: "#4276FB",
    t2: "#ffb001",
    y2: "#45B0FF",
  },
  "y0-btn-color6": {
    t1: "#f2f2f2",
    y1: "#555555",
    t2: "#f2f2f2",
    y2: "#555555",
  },
  "y0-select-background6": {
    t1: "#22262f",
    y1: "#ffffff",
    t2: "#ffffff",
    y2: "#22262f",
  },
  "y0-btn-hover2": {
    t1: "#179CFF",
    // t1: "#ffb001",
    y1: "#179CFF",
    // y1: "#4276fb",
    t2: "#ffb001",
    y2: "#179CFF",
  },
  "bet-bg-color1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "yb-bg-color1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#191c24",
    y2: "#191c24",
  },
  "yb-bg-color2": {
    t1: "#f5f6fa",
    y1: "#f5f6fa",
    t2: "#ffb001",
    y2: "#ffb001",
  },
  "yb-bg-color3": {
    t1: "#ffff",
    y1: "#f6f7fa",
    t2: "#1f222b",
    y2: "#1f222b",
  },
  "yb-bg-color4": {
    t1: "#ffb001",
    y1: "#ffb001",
    t2: "#99a3b1",
    y2: "#99a3b1",
  },
  "yb-bg-color5": {
    t1: "#fff",
    y1: "#fff",
    t2: "#22262f",
    y2: "#22262f",
  },
  "yb-bg-color6": {
    t1: "#f0f2f5",
    y1: "#f0f2f5",
    t2: "#5a6074",
    y2: "#5a6074",
  },
  "yb-bg-color7": {
    t1: "#f0f5fc",
    y1: "#ffffff",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },
  "yb-bg-color8": {
    t1: "rgba(90, 96, 116, 0.3)",
    y1: "rgba(90, 96, 116, 0.3)",
    t2: "#666b7d",
    y2: "#666b7d",
  },
  "yb-bg-color9": {
    t1: "#cde8ff",
    y1: "#cde8ff",
    // t1: "#fff2e7",
    // y1: "#d5e5fa",
    t2: "#262933",
    y2: "#213d56",
    // y2: "#74C4FF",
  },
  "yb-bg-color10": {
    t1: "#fff",
    y1: "#e4ebf1",
    t2: "#e4ebf1",
    y2: "#e4ebf1",
  },
  "yb-bg-color11": {
    t1: "rgba(246,247,250,0.9)",
    y1: "rgba(246,247,250,0.9)",
    t2: "#2b2f38",
    y2: "#2b2f38",
  },
  "yb-bg-color12": {
    t1: "linear-gradient(243deg, #F2F5F9 14.69%, #A8B1CA 116.69%);",
    y1: "linear-gradient(243deg, #F2F5F9 14.69%, #A8B1CA 116.69%);",
    // y1: "linear-gradient(243deg, rgba(242, 245, 249, 0.50) 14.69%, rgba(168, 177, 202, 0.50) 116.69%);",
    t2: "linear-gradient(243deg, #575859 14.69%, #575859 116.69%)",
    y2: "linear-gradient(243deg, #575859 14.69%, #575859 116.69%)",
  },
  "yb-bg-color12_1": {
    t1: "linear-gradient(243deg, rgba(242, 245, 249, 0.50) 14.69%, rgba(168, 177, 202, 0.50) 116.69%);",
    y1: "linear-gradient(243deg, rgba(242, 245, 249, 0.50) 14.69%, rgba(168, 177, 202, 0.50) 116.69%);",
    t2: "linear-gradient(243deg, rgba(242, 245, 249, 0.10) 14.69%, rgba(168, 177, 202, 0.10) 116.69%)",
    y2: "linear-gradient(243deg, rgba(242, 245, 249, 0.10) 14.69%, rgba(168, 177, 202, 0.10) 116.69%)",
  },
  // 新旧版本切换选中
  "version-old-new-active": {
    t1: "linear-gradient(243.79deg, rgba(0, 0, 0, 0.01) 16.49%, rgba(69, 176, 255, 0.3) 83.51%);",
    y1: "linear-gradient(90deg, rgba(23, 156, 255, 0.3) 0%, rgba(250, 252, 255, 0.01) 100%);",
    t2: "linear-gradient(243.79deg, rgba(0, 0, 0, 0.01) 16.49%, rgba(255, 176, 1, 0.3) 83.51%);",
    y2: "linear-gradient(243.79deg, rgba(0, 0, 0, 0.01) 16.49%, rgba(69, 176, 255, 0.3) 83.51%);",
  },
  "yb-bg-color14": {
    t1: "rgba(29, 33, 39, 0.94)",
    y1: "rgba(29, 33, 39, 0.94)",
    t2: "rgba(29, 33, 39, 0.94)",
    y2: "#1D2126",
  },
  "yb-bg-color15": {
    t1: "rgba(58, 64, 76, 0.96)",
    y1: "rgba(58, 64, 76, 0.96)",
    t2: "rgba(58, 64, 76, 0.96)",
    y2: "#383E4A",
  },
  "yb-bg-color16": {
    t1: "rgba(0, 0, 0, 0.5)",
    y1: "rgba(0, 0, 0, 0.5)",
    t2: "rgba(0, 0, 0, 0.5)",
    y2: "#0F0F0F",
  },
  "yb-bg-color18": {
    t1: "#e7eaee",
    y1: "#e7eaee",
    t2: "rgba(31, 34, 43, 0.5)",
    y2: "#1D2026",
  },
  "yb-bg-color21": {
    t1: "#f7f8fa",
    y1: "#f7f8fa",
    t2: "#181a21",
    y2: "#181a21",
  },
  "yb-bg-color22": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#21232d",
    y2: "#21232d",
  },
  "yb-bg-color23": {
    t1: "#EFF8FF",
    y1: "#EFF8FF",
    t2: "#FFFFFF14",
    y2: "#FFFFFF14",
  },
  "yb-bg-highlight-t-color23": {
    t1: "#EFF8FF",
    y1: "#EFF8FF",
    t2: "rgba(255, 255, 255, 0.05);",
    y2: "rgba(255, 255, 255, 0.05);",
  },
  "yb-bg-highlight-y-color23": {
    t1: "#FAFCFF",
    y1: "#FAFCFF",
    t2: "rgba(255, 255, 255, 0.03);",
    y2: "rgba(255, 255, 255, 0.03);",
  },
  "yb-bg-color23-1": {
    t1: "#f5f6f9",
    y1: "#f5f6f9",
    t2: "#FFFFFF14",
    y2: "#FFFFFF14",
  },
  "yb-bg-color24": {
    t1: "#fff",
    y1: "#fff",
    t2: "#272a33",
    y2: "#272a33",
  },
  "yb-bg-color25": {
    t1: "#f8faff",
    y1: "#f6f7fa",
    t2: "#262c39",
    y2: "#262c39",
  },
  "y0-bg-color20": {
    t1: "#f3faff",
    y1: "#f3faff",
    t2: "#2C2D34",
    y2: "#2C2D34",
  },
  "y0-bg-color20_1": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#2C2D34",
    y2: "#2C2D34",
  },
  "y0-bg-color1": {
    t1: "#0b0b0b",
    y1: "#232A34",
    t2: "#0b0b0b",
    y2: "#0b0b0b",
  },
  "y0-bg-color1_1": {
    t1: "linear-gradient(0deg, #F2F5F9 0%, #F2F5F9 100%), linear-gradient(180deg, #FFF 2.62%, #F4F5FF 100%)",
    y1: "linear-gradient(0deg, #F2F5F9 0%, #F2F5F9 100%), linear-gradient(180deg, #FFF 2.62%, #F4F5FF 100%)",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "y0-bg-color2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "y0-bg-color2-2-2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#1b1c25",
    y2: "#1b1c25",
  },
  "y0-bg-color2_1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#303137",
    y2: "#303137",
  },
  "y0-bg-color2_1_1": {
    t1: "#D7DEE3",
    y1: "#D7DEE3",
    t2: "#3C3B3E",
    y2: "#3C3B3E",
  },
  "y0-bg-color7": {
    t1: "#f5f7fa",
    y1: "#F3FAFF;",
    t2: "rgba(243, 250, 255, 0.05) ",
    y2: "rgba(243, 250, 255, 0.05)",
  },
  "y0-bg-color8": {
    t1: "#EFF1F6",
    y1: "#EFF1F6",
    t2: "#191c22",
    y2: "#191c22",
  },
  "y0-bg-color11": {
    t1: "#F2F5F9",
    // t1: "#f0f5fc",
    y1: "#F2F5F9",
    // y1: "#f0f6ff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "y0-bg-color12": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#24272d",
    y2: "#24272d",
  },
  "y0-bg-color12_1": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#45B0FF",
  },
  "y0-bg-color12_1-1": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#FFB001",
    y2: "#179CFF",
  },
  "y0-bg-color12_3": {
    t1: "#ff7000",
    y1: "#ff7000",
    t2: "#ff7000",
    y2: "#ff7000",
  },
  "y0-bg-color12_2": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#191c22",
    y2: "#191c22",
  },
  "y0-bg-color13": {
    t1: "#e3e9ee",
    y1: "#e3e9ee",
    t2: "rgba(86,159,253, 0.3)",
    y2: "rgba(86,159,253, 0.3)",
  },
  "re-bg-color1": {
    t1: "#eff1f6",
    y1: "#eff1f6",
    t2: "#000000",
    y2: "#000000",
  },
  "re-bg-color1_1": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "re-bg-color2": {
    t1: "#e7eaee",
    y1: "#e7eaee",
    t2: "#1b1c25",
    y2: "#1b1c25",
  },
  "re-bg-color3": {
    t1: "#fff",
    y1: "#fff",
    t2: "#0b0b0b",
    y2: "#0b0b0b",
  },
  "re-bg-color4": {
    t1: "#f6f7fa",
    y1: "#f6f7fa",
    t2: "#303541",
    y2: "#303541",
  },
  "re-bg-color5": {
    t1: "#e7eaee",
    y1: "#e7eaee",
    t2: "#22262f",
    y2: "#22262f",
  },
  "menu-bg-image1": {
    t1: `url(${preffix}/image/common/png/y0_sport_icon36.png)`,
    y1: `url(${preffix}/image/common/png/y0_sport_icon36.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon36.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon36.png)`,
  },
  "esport-bg-image": {
    t1: `url(${preffix}/image/common/png/sport_icon36.png)`,
    y1: `url(${preffix}/image/common/png/sport_icon36.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon36.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon36.png)`,
  },
  "menu-bg-color2": {
    t1: "#fff",
    y1: "#314A6B",
    t2: "#1C1E23",
    y2: "rgba(86, 159, 253, 0.24)",
  },
  "menu-bg-color3": {
    t1: "#569ffd",
    y1: "#2A3C53",
    t2: "#3c3f4c",
    y2: "#21232d",
  },
  "menu-bg-color4": {
    t1: "#ecf4ff",
    y1: "#1F2022",
    t2: "#1f222b",
    y2: "rgba(86, 159, 253, 0.35)",
  },
  "menu-bg-color5": {
    t1: "#f6f7fa",
    y1: "#f6f7fa",
    t2: "#2b2f38",
    y2: "#2b2f38",
  },
  "menu-bg-color6": {
    t1: "linear-gradient(-45deg,rgba(98,182,255,0.3),rgba(98,182,255,0.3) 55%,rgba(98,182,255,0.3))",
    // t1: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(255,176,1,0.24) 55%,rgba(255,112,0,0.4))",
    // y1: "linear-gradient(225deg,rgba(61,114,250,0),rgba(98,182,255,0.3))",
    y1: "linear-gradient(-45deg,rgba(98,182,255,0.3),rgba(98,182,255,0.3) 55%,rgba(98,182,255,0.3))",
    t2: "linear-gradient(225deg,rgba(255,176,1,0.1),rgba(255,176,1,0.3))",
    y2: "linear-gradient(-45deg,rgba(86,159,253,0.02),rgba(86,159,253,0.35))",
  },
  "menu-bg-color7": {
    t1: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(255,176,1,0.24) 55%,rgba(255,112,0,0.4))",
    y1: "linear-gradient(225deg,rgba(61,114,250,0),rgba(98,182,255,0.3))",
    t2: "linear-gradient(225deg,rgba(255,176,1,0.1),rgba(255,176,1,0.3))",
    y2: "linear-gradient(-45deg,rgba(86,159,253,0.02),rgba(86,159,253,0.35))",
  },
  "menu-bg-color8": {
    t1: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(23, 156, 255, 0.20) 55%,rgba(23, 156, 255, 0.20))",
    // t1: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(255,176,1,0.24) 55%,rgba(255,112,0,0.4))",
    y1: "linear-gradient(225deg, rgba(23, 156, 255, 0.20) 0%, rgba(23, 156, 255, 0.20) 100%)",
    // y1: "linear-gradient(225deg, rgba(61,114,250,0.00) 0%, rgba(98,182,255,.3) 100%)",
    t2: "linear-gradient(-45deg,rgba(255,176,1,0.02),rgba(255,176,1,0.24) 55%,rgba(255,112,0,0.4))",
    y2: "linear-gradient(225deg, rgba(61,114,250,0.00) 0%, rgba(98,182,255,.3) 100%)",
  },
  "menu-bg-color9": {
    t1: "#fff2e7",
    y1: "rgba(86, 159, 253, 0.1)",
    t2: "#262933",
    y2: "rgba(86, 159, 253, 0.1)",
  },
  "menu-bg-color10": {
    t1: "#dedede",
    y1: "#dedede",
    t2: "#656e88",
    y2: "#656e88",
  },
  "menu-bg-color11": {
    t1: "linear-gradient(269deg,#fff,#f0f6ff)",
    y1: "#F3FAFF",
    t2: "#191c24",
    y2: "#191c24",
  },
  "match-bg-color1": {
    t1: "#f6f7fa",
    y1: "#1F2022",
    t2: "transparent",
    y2: "#1F2022",
  },
  "match-bg-color2": {
    t1: "#fff",
    y1: "#314A6B",
    t2: "#1C1E23",
    y2: "rgba(28, 30, 38, 0.7)",
  },
  "match-bg-color3": {
    t1: "#569ffd",
    y1: "#2A3C53",
    t2: "#3c3f4c",
    y2: "#3c3f4c",
  },
  "match-bg-color4": {
    t1: "#fff",
    y1: "#fff",
    t2: "#1f222b",
    y2: "#1f222b",
  },
  "match-bg-color5": {
    t1: "rgba(255, 255, 255, 0.6)",
    y1: "rgba(255, 255, 255, 0.6)",
    t2: "rgba(31, 34, 43, 0.5)",
    y2: "rgba(31, 34, 43, 0.5)",
  },
  "match-bg-color6": {
    t1: "#179CFF",
    y1: "#179CFF",
    t2: "#ffb001",
    y2: "#45B0FF",
    // t1: "#ff7000",
    // y1: "#4276fb",
    // y2: "#2883F9",
  },
  "match-bg-color7": {
    t1: "#ecf4ff",
    y1: "#ecf4ff",
    t2: "#4F493B",
    y2: "#444B4F",
  },
  "match-bg-color8": {
    t1: "#fff7e6",
    y1: "#f0f6ff",
    t2: "#3c3831",
    y2: "#3b465b",
  },
  "match-bg-color10": {
    t1: "",
    y1: "",
    t2: "",
    y2: "",
  },
  "match-bg-color11": {
    t1: "#EFF1F6",
    y1: "#EFF1F6",
    t2: "#191919",
    y2: "#191919",
  },
  "match-bg-color12": {
    t1: "#e7eaee",
    y1: "#e7eaee",
    t2: "#262933",
    y2: "#262933",
  },
  "match-bg-color13": {
    t1: "rgba(203, 206, 216, .5)",
    y1: "rgba(203, 206, 216, .5)",
    t2: "#262B34",
    y2: "#262B34",
  },
  'list-replay-number-bg-color': {
    t1: '#f8f9fb',
    y1: '#f8f9fb',
    t2: '#252b33',
    y2: '#252b33',
  },
  'league-rank-header-bg-color': {
    t1: '#f7f8fa',
    y1: '#f7f8fa',
    t2: 'rgba(51, 57, 68, 0.6)',
    y2: 'rgba(51, 57, 68, 0.6)',
  },
  'vs-team-wrap-bg-color': {
    t1: '#a8b2c2',
    y1: '#a8b2c2',
    t2: '#666b7d',
    y2: '#666b7d',
  },
  'vs-team-wrap-hover': {
    t1: '#f6f7fa',
    y1: '#ecf4ff',
    t2: '#666b7d',
    y2: '#666b7d',
  },
  'vs-team-wrap-item-bg-color': {
    t1: '#fff',
    y1: '#fff',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'info-img-wrap-bg-color': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: '#3B4359',
    y2: '#3B4359',
  },
  'carousel-handicap-item-bg-color': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: 'rgba(59,67,89,0.40)',
    y2: 'rgba(59,67,89,0.40)',
  },
  'icon-star-bg-color': {
    t1: '#CBCED8',
    y1: '#CBCED8',
    t2: '#727D89',
    y2: '#727D89',
  },
  'control-item-bg-color': {
    t1: '#e7eaee',
    y1: '#e7eaee',
    t2: 'rgba(59,67,89,0.40)',
    y2: 'rgba(59,67,89,0.40)',
  },
  'wrap-recents-bg-color': {
    t1: 'rgba(235,236,243,0.6)',
    y1: 'rgba(235,236,243,0.6)',
    t2: 'rgba(40, 43, 55, 1)',
    y2: 'rgba(40, 43, 55, 1)',
  },
  'wrap-recents-border-color': {
    t1: 'rgba(235,236,243,0.6)',
    y1: 'rgba(235,236,243,0.6)',
    t2: 'rgba(40, 43, 55, 1)',
    y2: 'rgba(40, 43, 55, 1)',
  },
  'wrap-recents-handicap-bg-color': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: 'rgba(59, 67, 89, 0.4)',
    y2: 'rgba(59, 67, 89, 0.4)',
  },
  'handicap-sub-title-bg-color': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: 'rgba(31, 34, 43, 0.5)',
    y2: 'rgba(31, 34, 43, 0.5)',
  },
  'linear-progress-bg-color': {
    t1: 'rgba(0,0,0,0.05)',
    y1: 'rgba(0,0,0,0.05)',
    t2: '#22262f',
    y2: '#22262f',
  },
  'linear-progress-bg-color-2': {
    t1: '#179CFF',
    y1: '#179CFF',
    t2: '#2cb2ff',
    y2: '#2cb2ff',
  },
  'linear-progress-bg-color-3': {
    t1: '#179CFF',
    // t1: '#ff7000',
    y1: '#179CFF',
    // y1: '#ff7000',
    t2: '#ffb001',
    y2: '#ffb001',
  },
  'stripe-bg-color': {
    t1: '#f0f6ff',
    y1: '#f0f6ff',
    t2: '#3B4359',
    y2: '#3B4359',
  },
  'vr-virtual_statu-bg-color': {
    t1: '#e7eaee',
    y1: '#e7eaee',
    t2: 'rgba(51, 57, 68, 0.8)',
    y2: 'rgba(51, 57, 68, 0.8)',
  },
  'chatroom-bg-color-1': {
    t1: '#fff',
    y1: '#fff',
    t2: '#2F333E',
    y2: '#2F333E',
  },
  'chatroom-bg-color-2': {
    t1: '#fff8f2',
    y1: '#fff',
    t2: '#1A1E28',
    y2: '#1A1E28',
  },
  'chatroom-bg-color-3': {
    t1: '#fff',
    y1: '#fff',
    t2: '#3B4359',
    y2: '#3B4359',
  },
  'chatroom-bg-color-4': {
    t1: '#d8d8d8',
    y1: '#d8d8d8',
    t2: '#414655',
    y2: '#414655',
  },
  'chatroom-bg-color-5': {
    t1: '#FFE9C7',
    y1: '#ECF1FF',
    t2: '#51392C',
    y2: '#2C3A5E',
  },
  'point-wrap-color': {
    t1: '#c1c4c7',
    y1: '#c1c4c7',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'go-top-btn-bg-color-hover': {
    t1: '#ffb633',
    y1: '#0086f3',
    t2: '#535766',
    y2: '#535766',
  },
  'go-top-btn-bg-color-hover22': {
    t1: '#ffb633',
    y1: '#0086f3',
    t2: '#535766',
    y2: '#535766',
  },
  "analysis-bg-color-4": {
    t1: "#76c06d",
    y1: "#569ffd",
    t2: "#76c06d",
    y2: "#569ffd",
  },
  "analysis-bg-color-10": {
    t1: "#e7eaee",
    y1: "#e7eaee",
    t2: "#3b3b3b",
    y2: "#3b3b3b",
  },
  "analysis-bg-color-11": {
    t1: "rgba(23, 156, 255, 0.1)",
    y1: "rgba(23, 156, 255, 0.1)",
    t2: "rgba(255, 176, 1, 0.1)",
    y2: "rgba(116, 196, 255, 0.1)",
  },
  "analysis-bg-color-15": {
    t1: "#179CFF",
    // t1: "#FF7000",
    y1: "#179CFF",
    // y1: "#2cb2ff",
    t2: "#FF7000",
    y2: "#2cb2ff",
  },
  "analysis-bg-color-15": {
    t1: "#F4FAFF",
    y1: "#F4FAFF",
    t2: "rgba(255, 255, 255, 0.03)",
    y2: "rgba(255, 255, 255, 0.03)",
  },

"analysis-bg-color-16": {
  t1: "#F4FAFF",
  y1: "#F4FAFF",
  t2: "#444b4f",
  y2: "#444b4f",
},
  "vr-yb-bg-color2": {
    t1: "#ffffff",
    y1: "#f0f6ff",
    t2: "#191c24",
    y2: "#262b37",
  },
  "vr-yb-bg-color3": {
    t1: "#fff",
    y1: "#fff",
    t2: "",
    y2: "#262b37",
  },
  'vr-handicap-sub-title-bg-color': {
    t1: '#f7f8fa',
    y1: '#f8faff',
    t2: '#262c39',
    y2: 'rgba(51,57,68,0.6)',
  },
  'bet-dialog-bg-color1': {
    t1: '#179cff',
    y1: '#179cff',
    t2: '#45b0ff',
    y2: '#45b0ff',
  },
  "activity-bg-color-2": {
    t1: "rgba(255, 112, 0, 0.1)",
    y1: "#F0F6FF",
    t2: "rgba(255, 112, 0, 0.1)",
    y2: "#F0F6FF",
  },
  "activity-bg-color-3": {
    t1: "#fec59e",
    y1: "#c3d5f5",
    t2: "#fec59e",
    y2: "#c3d5f5",
  },
  "activity-bg-color-7": {
    t1: "#f77000",
    y1: "#179CFF",
    t2: "#f77000",
    y2: "#179CFF",
  },
  'sr-link-icon-bg-color': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: '#3c3f4c',
    y2: '#3c3f4c',
  },
  'sr-link-icon-bg-color-hover': {
    t1: '#ebecf3',
    y1: '#ebecf3',
    t2: '#5a6074',
    y2: '#5a6074',
  },
  'sr-link-icon-bg-img': {
    t1: 'none',
    y1: 'none',
    t2: 'linear-gradient(180deg,#191c24 22%,#212736)',
    y2: 'linear-gradient(180deg,#191c24 22%,#212736)',
  },
  'bg-replay-tab': {
    t1: `#fff`,
    y1: `#fff`,
    t2: `#1c1c25`,
    y2: `#1c1c25`
  },
  "analysis-bg-gradient-2": {
    t1: "linear-gradient(270deg, #138CFF 0%, #138CFF 100%)",
    // t1: "linear-gradient(270deg, #FF7000 0%, #ff7000 100%)",
    y1: "linear-gradient(-40deg, #138CFF 0%, #138CFF 100%)",
    // y1:  "linear-gradient(-40deg, #3d72fa 0%, #62b3ff 100%)",
    t2: "linear-gradient(270deg, #FF7000 0%, #ff7000 100%)",
    y2: "linear-gradient(-40deg, #3d72fa 0%, #62b3ff 100%)",
  },
  "background-gradient-14": {
    t1: "linear-gradient(0deg,#fff 21%,#f0f3f7);",
    y1: "linear-gradient(180deg,#fff 22%,#f7f8ff)",
    t2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
    y2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
  },
  'detail-right-model-bg-color': {
    t1: '#f6f7fa',
    y1: '#f6f7fa',
    t2: 'linear-gradient(0deg, #181b21 0%, var(--qq--yb-bg-color1) 100%)',
    y2: 'linear-gradient(0deg, #181b21 0%, var(--qq--yb-bg-color1) 100%)',
  },
  'league-rank-bg-img': {
    t1: 'linear-gradient(0deg,#fff 21%,#f0f3f7)',
    y1: 'linear-gradient(0deg,#fff 21%,#f0f3f7)',
    t2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
    y2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
  },
  "background-gradient-1": {
    t1: "#ECF7FF",
    y1: "#ECF7FF",
    t2: "#3E382D",
    y2: "#283442",
  },
  "background-gradient-1_1": {
    t1: "#626262",
    y1: "#F8F8F8",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)"
  },
  "background-gradient-1_2": {
    t1: "#626262",
    y1: "#FFFFFF",
    t2: "#626262",
    y2: "#626262"
  },
  "background-gradient-4": {
    t1: "#F5F6FA",
    y1: "#F8F8F8",
    t2: "linear-gradient(180deg, #191C24 22%, #212736 100%)",
    y2: "linear-gradient(180deg, #191C24 22%, #212736 100%)",
  },
  "background-gradient-5": {
    t1: "linear-gradient(180deg, #FFFFFF 21%, #F0F3F7 100%)",
    y1: "linear-gradient(180deg, #FFFFFF 21%, #F0F3F7 100%)",
    t2: "linear-gradient(180deg, #3B414E 0%, #1D202A 65%, #262B37 100%)",
    y2: "linear-gradient(180deg, #3B414E 0%, #1D202A 65%, #262B37 100%)",
  },
  "background-gradient-6": {
    t1: "linear-gradient(180deg, #179CFF 0%, #179CFF 100%)",
    y1: "linear-gradient(180deg, #179CFF 0%, #179CFF 100%)",
    // t2: "linear-gradient(180deg, #179CFF 0%, #179CFF 100%)",
    y2: "linear-gradient(180deg, #74C4FF 0%, #74C4FF 100%)",
    // t1: "linear-gradient(180deg, #FFB001 0%, #FF7000 100%)",

    // y1: "linear-gradient(180deg, #138CFF 0%, #138CFF 100%)",
    // y1: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    t2: "linear-gradient(180deg, #FFB001 0%, #FF7000 100%)",
    // y2: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },
  "background-gradient-7": {
    t1: "#ebecf3",
    y1: "#ebecf3",
    t2: "linear-gradient(0deg,#5a6074 100%,#5a6074 100%)",
    y2: "linear-gradient(0deg,#5a6074 100%,#5a6074 100%)",
  },
  "background-gradient-8": {
    t1: "#ffffff",
    y1: "#ffffff",
    // t1: "#f0f6ff",
    // y1: "#f0f6ff",
    t2: "linear-gradient(180deg,rgba(25,28,36,0.6) 22%,rgba(33,39,54,0.6))",
    y2: "linear-gradient(180deg,rgba(25,28,36,0.6) 22%,rgba(33,39,54,0.6))",
  },
  "background-gradient-9": {
    t1: "linear-gradient(270deg,#179CFF,#179CFF)",
    // t1: "linear-gradient(270deg,#ffb001,#ff7000)",
    y1: "linear-gradient(270deg,#179CFF,#179CFF)",
    // y1: "linear-gradient(270.01deg, #5163B7 0.01%, #8997D8 99.38%)",
    t2: "linear-gradient(180deg,#ffb001 100%,#ffb001)",
    // y2: "linear-gradient(270.01deg, #5163B7 0.01%, #8997D8 99.38%)",
    y2: "linear-gradient(180deg, #45B0FF 0.01%, #45B0FF 100%)"
  },
  "background-gradient-10": {
    t1: "linear-gradient(270deg, #FFB001 0%, #FF7000 100%)",
    y1: "linear-gradient(270deg, #62B6FF 0%, #3D72FA 100%)",
    t2: "linear-gradient(270deg, #FFB001 0%, #FF7000 100%)",
    y2: "linear-gradient(270deg, #62B6FF 0%, #3D72FA 100%)",
  },
  "background-gradient-12": {
    t1: "linear-gradient(269deg,#fff,#f0f6ff)",
    y1: "linear-gradient(269deg,#fff,#f0f6ff)",
    t2: "#262933",
    y2: "#262933",
  },
  "background-gradient-13": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#1F222B",
    y2: "#1F222B",
  },
  "theme-body-bg--esport-color": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "#2c2D34",
    y2: "#2c2D34",
  },
  "background-gradient-15": {
    t1: "linear-gradient(269deg,#fff,#f0f6ff)",
    y1: "linear-gradient(269deg,#fff,#f0f6ff)",
    t2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
    y2: "linear-gradient(180deg,#3b414e,#1d202a 65%,#262b37)",
  },
  "background-gradient-16": {
    t1: "linear-gradient(269deg,#fff,#f0f6ff)",
    y1: "linear-gradient(269deg,#fff,#f0f6ff)",
    t2: "linear-gradient(43deg,#222530,#191c24)",
    y2: "linear-gradient(43deg,#222530,#191c24)",
  },
  "background-gradient-17": {
    t1: "linear-gradient(225deg,rgba(255,112,0,0.1),rgba(255,112,0,0.3))",
    y1: "linear-gradient(225deg, rgba(61, 114, 250, 0) 0%, rgba(65, 118, 250, 0.3) 100%)",
    t2: "linear-gradient(225deg,rgba(255,112,0,0.1),rgba(255,112,0,0.3))",
    y2: "linear-gradient(225deg, rgba(61, 114, 250, 0) 0%, rgba(65, 118, 250, 0.3) 100%)",
  },
  'chatroom-gradient-1': {
    t1: `linear-gradient(225deg, #F5F6FA 0%, #A8B1CA 100%)`,
    y1: `linear-gradient(225deg, #F5F6FA 0%, #A8B1CA 100%)`,
    // y1: `linear-gradient(225deg, #F5F6FA 0%, #A8B1CA 100%)`,
    t2: `linear-gradient(43deg,#222530,#191c24)`,
    y2: `linear-gradient(43deg,#222530,#191c24)`
  },
  //渐变色 开始 0% 色
  "background-gradient-color-1-s": {
    t1: "#179CFF",
    // t1: "#ffb001",
    y1: "#179CFF",
    // y1: "#3D72FA",
    t2: "#FFB001",
    // y2: "#3D72FA",
    // t2: "#179CFF",
    y2: "#179CFF",
  },
  //渐变色 结束 100% 色
  "background-gradient-color-1-e": {
    t1: "#179CFF",
    // t1: "#ff7000",
    y1: "#179CFF",
    // y1: "#62B3FF",
    t2: "#FF7000",
    // y2: "#62B3FF",
    // t2: "#179CFF",
    y2: "#179CFF",
  },
  //渐变色 开始 0% 色
  "background-gradient-color-2-s": {
    t1: "#f5f6fa",
    y1: "#179cff1e",
    // y1: "#3D72FA",
    t2: "#272a33",
    y2: "#3D72FA",
  },
  //渐变色 结束 100% 色
  "background-gradient-color-2-e": {
    t1: "#a8b1ca",
    y1: "#179cff00",
    // y1: "##137cFF",
    t2: "#656e88",
    y2: "#62B3FF",
  },
  'vr-bg-color1': {
    t1: 'linear-gradient(180deg,#fff 21%,#f0f3f7)',
    y1: 'linear-gradient(180deg,#fff 21%,#f0f3f7)',
    t2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
    y2: ' linear-gradient(0deg,#2e3039,#3c3f4c)',
  },
  'vr-bg-color2': {
    t1: '#fff',
    y1: '#fff',
    t2: 'rgba(34, 40, 47, 0.9)',
    y2: 'rgba(34, 40, 47, 0.9)',
  },
  'vr-bg-color3': {
    t1: 'none',
    y1: 'none',
    t2: '#252b33',
    y2: '#252b33',
  },
  'vr-bg-color4': {
    t1: 'linear-gradient(180deg,#fff 21%,#f0f3f7)',
    y1: 'linear-gradient(180deg,#fff 21%,#f0f3f7)',
    t2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
    y2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
  },
  'vr-bg-color5': {
    t1: '#e7eaee',
    y1: '#e7eaee',
    t2: 'rgba(51,57,68,0.6)',
    y2: 'rgba(51,57,68,0.6)',
  },
  'vr-bg-color6': {
    t1: 'rgba(0, 0, 0, 0.4)',
    y1: 'rgba(0, 0, 0, 0.4)',
    t2: 'linear-gradient(90deg,#3a404c,rgba(41,44,54,0))',
    y2: 'linear-gradient(90deg,#3a404c,rgba(41,44,54,0))',
  },
  'vr-bg-color7': {
    t1: 'none',
    y1: 'none',
    t2: 'linear-gradient(90deg, #3a404c 0%, rgba(41, 44, 54, 0) 100%)',
    y2: 'linear-gradient(90deg, #3a404c 0%, rgba(41, 44, 54, 0) 100%)',
  },
  'vr-bg-color8': {
    t1: '#f5f6fa',
    y1: '#f5f6fa',
    t2: 'rgba(51,57,68,0.6)',
    y2: 'rgba(51,57,68,0.6)',
  },
  'vr-bg-color9': {
    t1: '#f6f7fa',
    y1: '#f6f7fa',
    t2: '#393f4a',
    y2: '#393f4a',
  },
  'vr-bg-color10': {
    t1: '#fff',
    y1: '#fff',
    t2: 'none',
    y2: 'none',
  },
  'vr-bg-color11': {
    t1: '#e7eaee',
    y1: '#e7eaee',
    t2: 'rgba(51,57,68,0.6)',
    y2: 'rgba(51,57,68,0.6)',
  },
  'vr-bg-color12': {
    t1: 'linear-gradient(180deg,#fff7f1 21%,#fff7f1)',
    y1: 'linear-gradient(180deg,#fff 21%,#f0f3f7)',
    t2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
    y2: 'linear-gradient(0deg,#2e3039,#3c3f4c)',
  },
  'vr-bg-color13': {
    t1: 'linear-gradient(90.04deg, #FEF2F2 0%, #D6E6F4 99.22%)',
    y1: 'linear-gradient(90.04deg, #FEF2F2 0%, #D6E6F4 99.22%)',
    t2: 'linear-gradient(90.04deg, #2F2B28 0%, #292B2E 99.22%)',
    y2: 'linear-gradient(90.04deg, #2F2B28 0%, #292B2E 99.22%)',
  },
  "activity-bd-img-gradient-2": {
    t1: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    y1: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
    t2: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    y2: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
  },
  "activity-bd-img-gradient-3": {
    t1: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    y1: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    t2: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    y2: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },
  "activity-tab-bg-img-active": {
    t1: "linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%)",
    y1: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    t2: "linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%)",
    y2: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },
  "activity-btn-bg-img1": {
    t1: `url(${preffix}/image/activity_imgs/imgs/get_box.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/get_box_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/get_box.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/get_box_y0.svg)`,
  },
  "activity-btn-bg-img2": {
    t1: `url(${preffix}/image/activity_imgs/imgs/get_bonus.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/get_bonus_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/get_bonus.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/get_bonus_y0.svg)`,
  },
  'vr-bg-image1': {
    t1: `url(${preffix}/image/common/virtual/live.svg)`,
    y1: `url(${preffix}/image/common/virtual/y0_live.svg)`,
    t2: `url(${preffix}/image/common/virtual/live.svg)`,
    y2: `url(${preffix}/image/common/virtual/y0_live.svg)`,
  },
  'vr-bg-image2': {
    t1: `url(${preffix}/image/yabo/svg/whistle01.svg)`,
    y1: `url(${preffix}/image/yabo/svg/whistle01.svg)`,
    t2: `url(${preffix}/image/yabo/svg/whistle02.svg)`,
    y2: `url(${preffix}/image/yabo/svg/whistle02.svg)`,
  },
  'vr-bg-image3': {
    t1: `url(${preffix}/image/yabo/svg/trophy01.svg)`,
    y1: `url(${preffix}/image/yabo/svg/trophy01.svg)`,
    t2: `url(${preffix}/image/yabo/svg/trophy02.svg)`,
    y2: `url(${preffix}/image/yabo/svg/trophy02.svg)`,
  },
  'vr-bg-image4': {
    t1: `url(${preffix}/image/yabo/svg/elimination_bg01.svg)`,
    y1: `url(${preffix}/image/yabo/svg/elimination_bg01.svg)`,
    t2: `url(${preffix}/image/yabo/svg/elimination_bg02.svg)`,
    y2: `url(${preffix}/image/yabo/svg/elimination_bg02.svg)`,
  },
  'vr-bg-image5': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/virtual_right_rank_title.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/virtual_right_rank_title.svg)`,
    t2: `url(${preffix}/image/yabo/theme01/img/svg/virtual_right_rank_title.svg)`,
    y2: `url(${preffix}/image/yabo/theme01_y0/img/svg/virtual_right_rank_title.svg)`,
  },
  'bg-image-url1': {
    t1: `url(${preffix}/image/common/png/hot_icon.png)`,
    y1: `url(${preffix}/image/common/png/y0_hot_icon_1.png)`,
    t2: `url(${preffix}/image/common/png/hot_icon.png)`,
    y2: `url(${preffix}/image/common/png/y0_hot_icon_1.png)`,
  },

  'bg-image-url2': {
    t1: `url(${preffix}/image/common/png/sport_icon.png)`,
    y1: `url(${preffix}/image/common/png/y0_sport_icon.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon.png)`,
    y2: `url(${preffix}/image/common/png/y0_sport_icon.png)`,
  },

  'bg-image-url51': {
    t1: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    y1: `url(${preffix}/image/common/png/sport_icon_blue_hover.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon_blue_hover.png)`,
  },

  'bg-image-old-url2': {
    t1: `url(${preffix}/image/common/png/sport_old_icon.png)`,
    y1: `url(${preffix}/image/common/png/y0_sport_old_icon.png)`,
    t2: `url(${preffix}/image/common/png/sport_old_icon.png)`,
    y2: `url(${preffix}/image/common/png/y0_sport_old_icon.png)`,
  },

  'bg-image-url4': {
    t1: `url(${preffix}/image/yabo/svg/sports_bg_100.svg)`,
    y1: `url(${preffix}/image/yabo/svg/sports_bg_100.svg)`,
    t2: `url(${preffix}/image/yabo/svg/sports_bg_100.svg)`,
    y2: `url(${preffix}/image/yabo/svg/sports_bg_100.svg)`,
  },
  'bg-image-url5': {
    t1: `url(${preffix}/image/yabo/svg/sports_bg_101.svg)`,
    y1: `url(${preffix}/image/yabo/svg/sports_bg_101.svg)`,
    t2: `url(${preffix}/image/yabo/svg/sports_bg_101.svg)`,
    y2: `url(${preffix}/image/yabo/svg/sports_bg_101.svg)`,
  },
  'bg-image-url6': {
    t1: `url(${preffix}/image/yabo/svg/sports_bg_103.svg)`,
    y1: `url(${preffix}/image/yabo/svg/sports_bg_103.svg)`,
    t2: `url(${preffix}/image/yabo/svg/sports_bg_103.svg)`,
    y2: `url(${preffix}/image/yabo/svg/sports_bg_103.svg)`,
  },
  'bg-image-url7': {
    t1: `url(${preffix}/image/yabo/svg/sports_bg_102.svg)`,
    y1: `url(${preffix}/image/yabo/svg/sports_bg_102.svg)`,
    t2: `url(${preffix}/image/yabo/svg/sports_bg_102.svg)`,
    y2: `url(${preffix}/image/yabo/svg/sports_bg_102.svg)`,
  },
  'bg-image-url8': {
    t1: `url(${preffix}/image/yabo/svg/details_info.svg)`,
    y1: `url(${preffix}/image/yabo/svg/y0_details_info.svg)`,
    t2: `url(${preffix}/image/yabo/svg/details_info.svg)`,
    y2: `url(${preffix}/image/yabo/svg/y0_details_info.svg)`,
  },
  'bg-image-url9': {
    t1: `url(${preffix}/image/yabo/svg/details_info_focus.svg)`,
    y1: `url(${preffix}/image/yabo/svg/y0_details_info_focus.svg)`,
    t2: `url(${preffix}/image/yabo/svg/details_info_focus.svg)`,
    y2: `url(${preffix}/image/yabo/svg/y0_details_info_focus.svg)`,
  },
  'bg-image-url10': {
    t1: `url(${preffix}/image/yabo/theme01/img/gif/loading_theme01.gif)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/gif/loading_theme01.gif)`,
    t2: `url(${preffix}/image/yabo/theme02/img/gif/loading_theme02.gif)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/gif/loading_theme02.gif)`,
  },
  'bg-image-url11': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/lock.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/lock.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/lock.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/lock.svg)`,
  },
  'bg-image-url12': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/video0.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/video0.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/video0.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/video0.svg)`,
  },
  'bg-image-url13': {
    t1: `url(${preffix}/image/yabo/theme02/img/svg/video2.svg)`,
    // y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/video2.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/img/svg/video2_bule.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/video2.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/video2.svg)`,
  },
  'bg-image-url14': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/animation0.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/animation0.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/animation0.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/animation0.svg)`,
  },
  'bg-image-url15': {
    t1: `url(${preffix}/image/yabo/theme02/img/svg/animation2.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/animation2.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/animation2.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/animation2.svg)`,
  },
  'bg-image-url16': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/switch0.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/switch0.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/switch0.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/switch0.svg)`,
  },
  'bg-image-url17': {
    t1: `url(${preffix}/image/yabo/theme02/img/svg/switch2.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/switch2.svg)`,
    // y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/switch2.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/switch2.svg)`,
    y2: `url(${preffix}/image/yabo/theme01_y0/img/svg/switch2.svg)`,
  },
  'bg-image-url18': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/live_studio02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/live_studio02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/live_studio02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/live_studio02.svg)`,
  },
  'bg-image-url19': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/live_studio01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/live_studio01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/live_studio01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/live_studio01.svg)`,
  },
  'bg-image-url20': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/anchor02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/anchor02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/anchor02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/anchor02.svg)`,
  },
  'bg-image-url21': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/anchor01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/anchor01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/anchor01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/anchor01.svg)`,
  },
  'bg-image-url22': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/topic02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/topic02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/topic02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/topic02.svg)`,
  },
  'bg-image-url23': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/topic01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/topic01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/topic01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/topic01.svg)`,
  },
  'bg-image-url24': {
    t1: `url(${preffix}/image/common/png/team_logo_01.png)`,
    y1: `url(${preffix}/image/common/png/team_logo_01.png)`,
    t2: `url(${preffix}/image/common/png/team_logo_02.png)`,
    y2: `url(${preffix}/image/common/png/team_logo_02.png)`,
  },
  'bg-image-url25': {
    t1: `url(${preffix}/image/yabo/theme01/team_logo/logo.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/team_logo/logo.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/team_logo/logo.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/team_logo/logo.svg)`,
  },
  'bg-image-url26': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/unfold_close_thme01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/unfold_close_thme01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/unfold_close_thme02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/unfold_close_thme02.svg)`,
  },
  'bg-image-url27': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/unfold_open_them01_copy.png)`,
    // t1: `url(${preffix}/image/yabo/theme01/img/svg/unfold_open_them01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/img/svg/unfold_open_them01_copy.svg)`,
    // y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/y0_unfold_open.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/unfold_open_them02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/y0_unopen_video.svg)`,
  },
  'bg-image-url28': {
    t1: `url(${preffix}/image/yabo/svg/video_match_results_select.svg)`,
    y1: `url(${preffix}/image/yabo/svg/video_match_results_select_active.svg)`,
    t2: `url(${preffix}/image/yabo/svg/video_match_results_select.svg)`,
    y2: `url(${preffix}/image/yabo/svg/video_match_results_select_active.svg)`,
  },
  'bg-image-url29': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/tabs-line-right.png)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/png/tabs-line-right.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/tabs-line-right.png)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/png/tabs-line-right.png)`,
  },
  'bg-image-url30': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/tabs-line-left.png)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/png/tabs-line-left.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/tabs-line-left.png)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/png/tabs-line-left.png)`,
  },
  'bg-image-url3': {
    t1: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    y1: `url(${preffix}/image/common/png/sport_icon_blue_hover.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon_blue_hover.png)`,
  },

  'bg-image-url31': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/radio.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/radio.svg)`,
    t2: `none`,
    y2: `none`,
  },
  'bg-image-url32': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/radio-checked.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/radio-checked.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/radio-checked.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/radio-checked.svg)`,
  },
  'bg-image-url33': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/checkbox.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/checkbox.svg)`,
    t2: `none`,
    y2: `none`,
  },
  'bg-image-url34': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/checkbox-checked.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/checkbox-checked.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/checkbox-checked.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/checkbox-checked.svg)`,
  },
  'bg-image-url35': {
    t1: `url(${preffix}/image/yabo/svg/theme01_plus.svg)`,
    y1: `url(${preffix}/image/yabo/svg/theme01_plus.svg)`,
    t2: `url(${preffix}/image/yabo/svg/theme02_plus.svg)`,
    y2: `url(${preffix}/image/yabo/svg/theme02_plus.svg)`,
  },
  'bg-image-url36': {
    t1: `url(${preffix}/image/yabo/svg/theme01_del.svg)`,
    y1: `url(${preffix}/image/yabo/svg/theme01_y0_del.svg)`,
    t2: `url(${preffix}/image/yabo/svg/theme02_del.svg)`,
    y2: `url(${preffix}/image/yabo/svg/theme02_y0_del.svg)`,
  },
  'bg-image-url37': {
    t1: `url(${preffix}/image/common/svg/play_video.svg)`,
    y1: `url(${preffix}/image/common/svg/y0_play_video.svg)`,
    t2: `url(${preffix}/image/common/svg/play_video.svg)`,
    y2: `url(${preffix}/image/common/svg/y0_play_video.svg)`,
  },
  'bg-image-url38': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/new_empty.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/new_empty.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/new_empty.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/new_empty.png)`,
  },
  'bg-image-url39': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/video_left.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/video_left.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/video_left.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/video_left.png)`,
  },
  'bg-image-url40': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/video_right.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/video_right.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/video_right.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/video_right.png)`,
  },
  'bg-image-url41': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/video_line.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/video_line.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/video_line.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/video_line.png)`,
  },
  'bg-image-url42': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/video_middle.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/video_middle.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/video_middle.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/video_middle.png)`,
  },
  'bg-image-old-url43': {
    t1: `url(${preffix}/image/common/png/sport_icon_old_hover.png)`,
    y1: `url(${preffix}/image/common/png/sport_icon_old_hover.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon_old_unselect.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon_old_unselect.png)`,
  },
  'bg-image-url43': {
    t1: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    y1: `url(${preffix}/image/common/png/sport_icon_hover.png)`,
    t2: `url(${preffix}/image/common/png/sport_icon_unselect.png)`,
    y2: `url(${preffix}/image/common/png/sport_icon_unselect.png)`,
  },
  'bg-image-url44': {
    t1: `url(${preffix}/image/common/png/video_history_play.png)`,
    y1: `url(${preffix}/image/common/png/y0_video_history_play.png)`,
    t2: `url(${preffix}/image/common/png/video_history_play.png)`,
    y2: `url(${preffix}/image/common/png/y0_video_history_play.png)`,
  },
  'video-bg-image-url44': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/data.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/data.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/data.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/data.svg)`,
  },
  'results-bg-image-url45': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/result_info.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/result_info.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/result_info.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/result_info.svg)`,
  },
  'results-bg-image-url45-hover': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/result_info_hover.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/result_info_hover.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/result_info_hover.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/result_info_hover.svg)`,
  },
  'bg-image-url46': {
    t1: `url(${preffix}/image/common/png/y0_icon_ball_yellow.png)`,
    y1: `url(${preffix}/image/common/png/y0_icon_ball_blue.png)`,
    t2: `url(${preffix}/image/common/png/y0_icon_ball_yellow.png)`,
    y2: `url(${preffix}/image/common/png/y0_icon_ball_blue.png)`,
  },

  'bg-image-url47': {
    t1: `url(${preffix}/image/common/png/y0_icon_yellow_unselect.png)`,
    y1: `url(${preffix}/image/common/png/y0_icon_ball_blue.png)`,
    t2: `url(${preffix}/image/common/png/y0_icon_yellow_unselect.png)`,
    y2: `url(${preffix}/image/common/png/y0_icon_ball_blue.png)`,
  },

  'bg-image-url48': {
    t1: `url(${preffix}/image/common/png/y0_icon_yellow_select.png)`,
    y1: `url(${preffix}/image/common/png/y0_hot_icon_1.png)`,
    t2: `url(${preffix}/image/common/png/y0_icon_yellow_select.png)`,
    y2: `url(${preffix}/image/common/png/y0_hot_icon_1.png)`,
  },

  'bg-image-url49': {
    t1: `url(${preffix}/image/common/png/t1_icon_yellow_unselect_new.png)`,
    y1: `url(${preffix}/image/common/png/y1_icon_ball_blue_new.png)`,
    t2: `url(${preffix}/image/common/png/t1_icon_yellow_unselect_new.png)`,
    y2: `url(${preffix}/image/common/png/y1_icon_ball_blue_new.png)`,
  },

  'bg-image-url50': {
    t1: `url(${preffix}/image/common/png/t1_icon_yellow_select_new.png)`,
    y1: `url(${preffix}/image/common/png/t1_icon_yellow_select_new.png)`,
    t2: `url(${preffix}/image/common/png/y1_hot_icon_1_new.png)`,
    y2: `url(${preffix}/image/common/png/y1_hot_icon_1_new.png)`,
  },

  'control-bg-img-url': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/arrow.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/arrow.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/arrow.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/arrow.svg)`,
  },
  'control-bg-img-url-hover': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/arrow_active.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/arrow_active.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/arrow_active.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/arrow_active.svg)`,
  },
  'chatroom-icon-1': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/chatroom01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/chatroom01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/chatroom01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/chatroom01.svg)`
  },
  'chatroom-icon-2': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/emoji01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/emoji01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/emoji01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/emoji01.svg)`
  },
  'chatroom-icon-3': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/emoji02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/emoji02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/emoji02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/emoji02.svg)`
  },
  'chatroom-icon-4': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/send01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/send01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/send01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/send01.svg)`
  },
  'chatroom-icon-5': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/send02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/send02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/send02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/send02.svg)`
  },
  'chatroom-icon-6': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/unmute_info.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/unmute_info.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/unmute_info.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/unmute_info.svg)`
  },
  'chatroom-icon-7': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/mute_info.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/mute_info.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/mute_info.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/mute_info.svg)`
  },
  'chatroom-icon-8': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/show_order01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/show_order01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/show_order01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/show_order01.svg)`
  },
  'chatroom-icon-9': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/show_order02.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/show_order02.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/show_order02.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/show_order02.svg)`
  },
  'chatroom-icon-10': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/statistics01.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/statistics01.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/statistics01.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/statistics01.svg)`
  },
  'chatroom-icon-11': {
    t1: `url(${preffix}/image/yabo/svg/like_order01.svg)`,
    y1: `url(${preffix}/image/yabo/svg/like_order01_y0.svg)`,
    t2: `url(${preffix}/image/yabo/svg/like_order02.svg)`,
    y2: `url(${preffix}/image/yabo/svg/like_order02_y0.svg)`
  },
  'chatroom-icon-12': {
    t1: `url(${preffix}/image/yabo/svg/like_order_day.svg)`,
    y1: `url(${preffix}/image/yabo/svg/like_order_day.svg)`,
    t2: `url(${preffix}/image/yabo/svg/like_order_night.svg)`,
    y2: `url(${preffix}/image/yabo/svg/like_order_night.svg)`
  },
  'chatroom-icon-13': {
    t1: `url(${preffix}/image/yabo/png/notify.png)`,
    y1: `url(${preffix}/image/yabo/png/notify_y0.png)`,
    t2: `url(${preffix}/image/yabo/png/notify.png)`,
    y2: `url(${preffix}/image/yabo/png/notify_y0.png)`
  },
  'chatroom-icon-14': {
    t1: `url(${preffix}/image/yabo/theme01/img/svg/ask-icon.svg)`,
    y1: `url(${preffix}/image/yabo/theme01_y0/img/svg/ask-icon.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/img/svg/ask-icon.svg)`,
    y2: `url(${preffix}/image/yabo/theme02_y0/img/svg/ask-icon.svg)`
  },
  'chatroom-bg-image1': {
    t1: `url(${preffix}/common/png/select_yellow.png)`,
    y1: `url(${preffix}/common/png/select_blue.png)`,
    t2: `url(${preffix}/common/png/select_yellow.png)`,
    y2: `url(${preffix}/common/png/select_blue.png)`
  },
  'public-bg-image1': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/user_api_limited.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/user_api_limited.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/user_api_limited.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/user_api_limited.png)`,
  },
  'public-bg-image2': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/no_data_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/no_data_01.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/no_data_02.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/no_data_02.png)`,
  },
  'public-bg-image3': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/no_data_es_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/no_data_es_01.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/no_data_es_02.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/no_data_es_02.png)`,
  },
  'public-bg-image4': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/no_video_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/no_video_01.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/no_video_02.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/no_video_02.png)`,
  },
  'public-bg-image5': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/page404_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/page404_01.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/page404_02.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/page404_02.png)`,
  },
  'public-bg-image6': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/refresh_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/refresh_01.png)`,
    t2: `url(${preffix}/image/yabo/theme02/img/png/refresh_02.png)`,
    y2: `url(${preffix}/image/yabo/theme02/img/png/refresh_02.png)`,
  },
  'public-bg-image7': {
    t1: `url(${preffix}/image/yabo/theme01/img/png/filter_no_data_01.png)`,
    y1: `url(${preffix}/image/yabo/theme01/img/png/filter_no_data_01.png)`,
    t2: `url(${preffix}/image/yabo/theme01/img/png/filter_no_data_01.png)`,
    y2: `url(${preffix}/image/yabo/theme01/img/png/filter_no_data_01.png)`,
  },
  "activity-bd-img-1": {
    t1: `url(${preffix}/image/activity_imgs/imgs/title_bg.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/title_bg_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/title_bg.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/title_bg_y0.svg)`,
  },
  "activity-bd-img-2": {
    t1: `url(${preffix}/image/activity_imgs/imgs/text-pre.png)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/text-pre_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/text-pre.png)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/text-pre_y0.svg)`,
  },
  "activity-bd-img-3": {
    t1: `linear-gradient(0deg, #f7f8f8 0%, #e3e3e3 31%, #ffffff 100%)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/game_record.png)`,
    t2: `linear-gradient(0deg, #f7f8f8 0%, #e3e3e3 31%, #ffffff 100%)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/game_record.png)`,
  },
  "activity-bd-img-4": {
    t1: `url(${preffix}/image/activity_imgs/imgs/get_all_bonus.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/get_all_bonus_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/get_all_bonus.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/get_all_bonus_y0.svg)`,
  },
  "activity-bd-img-5": {
    t1: `url(${preffix}/image/activity_imgs/imgs/waiting.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/waiting_y0.svg)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/waiting.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/waiting_y0.svg)`,
  },
  "activity-bd-img-6": {
    t1: `url(${preffix}/image/activity_imgs/imgs/history_list_bg.svg)`,
    y1: `url(${preffix}/image/activity_imgs/imgs/game_record.png)`,
    t2: `url(${preffix}/image/activity_imgs/imgs/history_list_bg.svg)`,
    y2: `url(${preffix}/image/activity_imgs/imgs/game_record.png)`,
  },
  'user-info-show-bg-color1': {
    t1: `url(${preffix}/image/yabo/theme01/balance_refresh.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/balance_refresh.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/balance_refresh.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/balance_refresh.svg)`,
  },
  'user-info-show-bg-color2': {
    t1: `url(${preffix}/image/yabo/theme01/balance_refresh_hover.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/balance_refresh_hover.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/balance_refresh_hover.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/balance_refresh_hover.svg)`,
  },
  'match-result-live-icon-bg': {
    t1: `url(${preffix}/image/yabo/theme01_y0/match-result-live.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/match-result-live.svg)`,
    t2: `url(${preffix}/image/yabo/theme02_y0/match-result-live.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/match-result-live.svg)`,
  },
  'match-result-play_icon': {
    t1: `url(${preffix}/image/yabo/theme01/match-result-play_icon.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/match-result-play_icon.svg)`,
    t2: `url(${preffix}/image/yabo/theme02/match-result-play_icon.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/match-result-play_icon.svg)`,
  },
  'no-data-icon-bg': {
    t1: `url(${preffix}/image/yabo/theme01_y0/no-data.svg)`,
    y1: `url(${preffix}/image/yabo/theme01/no-data.svg)`,
    t2: `url(${preffix}/image/yabo/theme02_y0/no-data.svg)`,
    y2: `url(${preffix}/image/yabo/theme02/no-data.svg)`,
  },
  'icon-eye_show': {
    t1: `url(${preffix}/image/yabo/svg/eye_show.svg)`,
    y1: `url(${preffix}/image/yabo/svg/eye_show.svg)`,// public/image/yabo/svg/night_eye_show.svg
    t2: `url(${preffix}/image/yabo/svg/night_eye_show.svg)`,
    y2: `url(${preffix}/image/yabo/svg/night_eye_show.svg)`,
  },
  // T余额隐藏显示icon
  'icon-eye_hide': {
    t1: `url(${preffix}/image/yabo/svg/eye_hide.svg)`,
    y1: `url(${preffix}/image/yabo/svg/eye_hide.svg)`,// public/image/yabo/svg/night_eye_hide.svg
    t2: `url(${preffix}/image/yabo/svg/night_eye_hide.svg)`,
    y2: `url(${preffix}/image/yabo/svg/night_eye_hide.svg)`,
  },
  // 赛果页面精彩回放视频左右箭头
  'match-results-drag-scroll-left': {
    t1: `url(${preffix}/image/yabo/svg/eye_hide.svg)`,
    y1: `url(${preffix}/image/yabo/svg/video-swipe-arrow-left-new-day.svg)`,
    t2: `url(${preffix}/image/yabo/svg/video-swipe-arrow-left-new-neight.svg)`,
    y2: `url(${preffix}/image/yabo/svg/video-swipe-arrow-left-new-neight.svg)`,
  },
  // 赛果页面精彩回放视频左右箭头
  'match-results-drag-scroll-right': {
    t1: `url(${preffix}/image/yabo/svg/eye_hide.svg)`,
    y1: `url(${preffix}/image/yabo/svg/video-swipe-arrow-right-new-day.svg)`,
    t2: `url(${preffix}/image/yabo/svg/video-swipe-arrow-right-new-neight.svg)`,
    y2: `url(${preffix}/image/yabo/svg/video-swipe-arrow-right-new-neight.svg)`,
  },
  /* 其他 end */
  // ============================新手版===============
  /* 盘口底色 */
  "handicap-new-bg-color": {
    t1: "#f4faff",
    y1: "#F4FAFF",
    // y1: "#f6f7fa",
    t2: "#2b2f38",
    y2: "#2b2f38",
  },
  "match_details_analysis_title": {
    t1: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
    y1: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
    t2: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
    y2: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
  },
  "match_details_analysis_pannel_title": {
    t1: "#F4FAFF",
    y1: "#F4FAFF",
    t2: "#1E1F26",
    y2: "#1E1F26",
  },

  /* 新手版列表背景色 */
  "list-new-bg-color": {
    t1: "#ffffff",
    y1: "#ffffff",
    // y1: "#f6f7fa",
    t2: "#FFFFFF08",
    y2: "#FFFFFF08",
  },
  /* 列表背景色 */
  "list-data-bg-color": {
    t1: "#fafcff",
    y1: "#fafcff",
    // y1: "#f6f7fa",
    t2: "#FFFFFF08",
    y2: "#FFFFFF08",
  },

  /* 新手版列表联赛名称背景色 */
  "league-title-bg-color": {
    t1: "#ffffff",
    y1: "#ffffff",
    // y1: "#f6f7fa",
    t2: "#25262C",
    y2: "#25262C",
  },

  /* 赔率上升 */
  "odd-up-bg-color": {
    t1: "#E93D3D1A",
    y1: "#E93D3D1A",
    // y1: "#f6f7fa",
    t2: "#E93D3D1A",
    y2: "#E93D3D1A",
  },
  /* 赔率下降 */
  "odd-down-bg-color": {
    t1: "#50C0421A",
    y1: "#50C0421A",
    // y1f6f7fa",
    t2: "#50C0421A",
    y2: "#50C0421A",
  },

  /* 新手版列表联赛名称背景色 */
  "league-border-bg-color": {
    t1: "#ffffff",
    y1: "#ffffff",
    // y1: "#f6f7fa",
    t2: "#25272D",
    y2: "#25272D",
  },
  "match_details_title_bg": {
    t1: "#ffffff",
    y1: "#ffffff",
    t2: "#262B37",
    y2: "#262B37",
  },
  "match_details_right_rol": {
    t1: "#f6f7fa",
    y1: "#f6f7fa",
    t2: "#262B37",
    y2: "#262B37",
  },

  "match_type_title_bg": {
    t1: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, #FFFFFF, #FFFFFF);",
    y1: "linear-gradient(98.85deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0) 21.76%),linear-gradient(0deg, #FFFFFF, #FFFFFF);",
    t2: "#25262D",
    y2: "#25262D",
  },
  "match_type_title_bg2": {
    t1: "linear-gradient(99deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0.00) 21.76%), #FFF",
    y1: "linear-gradient(99deg, rgba(23, 156, 255, 0.12) -5.42%, rgba(23, 156, 255, 0.00) 21.76%), #FFF",
    t2: "#25262D",
    y2: "#25262D",
  },
  "table_tr_detail": {
    t1: "#fff",
    y1: "#fff",
    t2: "#24252b",
    y2: "#24252b",
  },
    "menu-bg-title-color": {
      t1: "rgba(23, 156, 255, 0.2)",
      y1: "rgba(23, 156, 255, 0.2)",
      t2: "rgba(255, 176, 1, 0.2)",
      y2: "rgba(69, 176, 255, 0.2)",
    },
    "menu-bg-title-item-color": {
      t1: "rgba(23, 156, 255, 0.2)",
      y1: "transparent",
      t2: "rgba(255, 176, 1, 0.1)",
      y2: "rgba(116, 196, 255, 0.1)",
    },
    /* 左侧投注tab按钮未结算结算预约背景色 */
    "bet-record-tab-bg-color": {
      t1: "",
      y1: "#179CFF",
      t2: "#FFB001",
      y2: "#45B0FF",
    },
    'back-menu-bg-button-color': {
      t1: '#FFFFFF',
      y1: '#FFFFFF',
      t2: 'transparent',
      y2: '#303137',
    },
    'back-menu-bg-color': {
      t1: 'linear-gradient(243.46deg, rgba(242, 245, 249, 0.5) 14.69%, rgba(168, 177, 202, 0.5) 116.69%)',
      y1: 'linear-gradient(243.46deg, rgba(242, 245, 249, 0.5) 14.69%, rgba(168, 177, 202, 0.5) 116.69%)',
      t2: 'linear-gradient(243.46deg, rgba(242, 245, 249, 0.1) 14.69%, rgba(168, 177, 202, 0.1) 116.69%)',
      y2: 'linear-gradient(243.46deg, rgba(242, 245, 249, 0.1) 14.69%, rgba(168, 177, 202, 0.1) 116.69%)',
    },
    'theme-bd-remove-color': {
      t1: '#FDE5E5',
      y1: '#FDE5E5',
      t2: '#734347',
      y2: '#734347',
    },
    'theme-bd-play-color': {
      t1: '#FFFFFF',
      y1: '#FFFFFF',
      t2: '#1F222B',
      y2: '#1F222B',
    },
    'theme-bd-keyboard-color': {
      t1: '#FFFFFF',
      y1: '#FFFFFF',
      t2: 'rgba(255, 255, 255, 0.05)',
      y2: 'rgba(255, 255, 255, 0.05)',
    },
      /* 赛果日历图标颜色 */
    'match-result-icon-color':{
      t1: '#191c24',
      y1: '#999999',
      t2: '#A0A0A0;',
      y2: '#A0A0A0;',
    },
    /* 赛果日历背景颜色 */
    "match-result-date-bg-color": {
      t1: "#ffffff",
      y1: "#ffffff",
      t2: "#1b1c25",
      y2: "#1b1c25",
    },
    /* 详情返回按钮 */
    'detail-icon-btn': {
      t1: ``,
      y1: `url(${preffix}/image/yabo/svg/back-btn-day.svg)`,
      t2: `url(${preffix}/image/yabo/svg/back-btn-night.svg)`,
      y2: `url(${preffix}/image/yabo/svg/back-btn-night.svg)`,
    },
     /* 标题左边icon */
     'title-icon-btn': {
      t1: ``,
      y1: `url(${preffix}/image/yabo/svg/icon-day-title-y1.svg)`,
      t2: `url(${preffix}/image/yabo/svg/icon-night-title-t2.svg)`,
      y2: `url(${preffix}/image/yabo/svg/icon-night-title-y2.svg)`,
    },
    'theme-bd-vr-color': {
      t1: 'transparent',
      y1: '#FFFFFF',
      t2: '#1F222B',
      y2: '#1F222B',
    },
    'theme-bd-vr-color-hover': {
      t1: '#179CFF',
      y1: '#179CFF',
      t2: '#FFB001',
      y2: '#45B0FF',
    },
     /* 盒子阴影 */
     'box-shawdow-color': {
      t1: ``,
      y1: '0px 2px 8px 0px #D9DEEA',
      t2: `none`,
      y2: `none`,
    },
         /*内嵌版多语言下拉框背景色 */





        'popup-setting-text-color-active': {
          t1: '#000',
          y1: '#000',
          t2: '#fff',
          y2: '#fff',
        },
        'popup-setting-item-color': {
          t1: '#fbfbfb',
          y1: '#fbfbfb',
          t2: '#35363C',
          y2: '#35363C',
        },
        'popup-setting-item-on-color': {
          t1: '#fff',
          y1: '#fff',
          t2: '#1D1D1D',
          y2: '#1D1D1D',
        },
        'popup-setting-item-border-color': {
          t1: '#d7dee3',
          y1: '#d7dee3',
          t2: '#35363C',
          y2: '#35363C',
        },
        'popup-setting-item-p-color': {
          t1: '#595959',
          y1: '#595959',
          t2: '#A0A0A0',
          y2: '#A0A0A0',
        },
        'popup-setting-item-p-on-color': {
          t1: '#595959',
          y1: '#595959',
          t2: '#fff',
          y2: '#fff',
        },
    /*内嵌版多语言下拉框背景色 */
    'wrap-lang-bg-color': {
    t1: `#FFFFFF`,
    y1: '#FFFFFF',
    t2: `#2F3137`,
    y2: `#2F3137`,
  },
  'yb-bg-zone-color12': {
    t1: '#ffffff',
    y1: '#ffffff',
    t2: '#2F3137',
    y2: '#2F3137',
  },

  'analysis-bd-color-4-1': {
    t1: '#ECF7FF',
    y1: '#ECF7FF',
    t2: '#1E1F26',
    y2: '#1E1F26',
  },
  
  /* 按钮阴影 */
  'btn-box-shadow-bg-color': {
    t1: '#ffffff',
    y1: 'rgba(0, 0, 0, 0.05)',
    t2: 'rgba(0, 0, 0, 0.30)',
    y2: 'rgba(0, 0, 0, 0.30)',
  },

   // 主题色通用 背景颜色
  "virtual_theme-bg-common": {
    t1: "#EFF1F6",
    y1: "#EFF1F6",
    t2: "#191C24",
    y2: "#191C24",
  },
  'popup-setting-item-text-color': {
    t1: '#595959',
    y1: '#595959',
    t2: '#35363C',
    y2: '#35363C',
  },
  "detail-play-name-title-bg-color": {
    t1: "#FFFFFF",
    y1: "#FFFFFF",
    t2: "rgba(255, 255, 255, 0.05)",
    y2: "rgba(255, 255, 255, 0.05)",
  },
  "match-details-bg-color": {
    t1: "#FCFCFC",
    y1: "#FCFCFC",
    t2: "rgba(255, 255, 255, 0.01)",
    y2: "rgba(255, 255, 255, 0.01)",
  },
 
}
