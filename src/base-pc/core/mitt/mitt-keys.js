/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 事件通信协议-命令定义
 */
//------------------------------------------------------------------命令定义-S-------------------------------------------------------------------------------------
/** websocket发送消息命令 */
// 触发获取用户余额
export const EMIT_GET_USER_ACCOUNT = "EMIT_GET_USER_ACCOUNT";
//用户信息更新
export const EMIT_USER_CHAUNGE = "EMIT_USER_CHAUNGE";
// 用户余额变化
export const EMIT_USER_AMOUNT_CHAUNGE = "EMIT_USER_AMOUNT_CHAUNGE";
// 主题变化
export const EMIT_THEME_CHANGE = "EMIT_THEME_CHANGE";
// 语言变化
export const EMIT_LANG_CHANGE = "EMIT_LANG_CHANGE";

// 是否显示收藏 变化
export const EMIT_FAVORITE_CHANGE_CMD = "EMIT_FAVORITE_CHANGE_CMD";

// 版本变化
export const EMIT_STANDARD_EDITION_CHANGE = "EMIT_STANDARD_EDITION_CHANGE";

export const EMIT_UPD_TIME_REFRESH_CMD = "EMIT_UPD_TIME_REFRESH_CMD";

//  元数据的  赛事 基础信息 加载完成 
export const EMIT_UPDATE_CURRENT_LIST_METADATA = "EMIT_UPDATE_CURRENT_LIST_METADATA";

//初始化数据加载
export const EMIT_UPDATE_INIT_DATA = "EMIT_UPDATE_INIT_DATA";

// 发送api域名切换命令命令
export const EMIT_API_DOMAIN_UPD_CMD = "EMIT_API_DOMAIN_UPD_CMD";

// 发送用户基本信息到服务器
export const EMIT_API_USER_PRO_INFO_CMD = "EMIT_API_USER_PRO_INFO_CMD";
// apis域名全部不可用
export const EMIT_APIS_DOMAIN_ALL_BAD = "EMIT_APIS_DOMAIN_ALL_BAD";
// loading动画操作
export const EMIT_LOADING_CTR_CMD = "EMIT_LOADING_CTR_CMD";
// iframe预加载操作
export const EMIT_IFRAME_BEFORE_LOADING_CMD = "EMIT_IFRAME_BEFORE_LOADING_CMD";
//------------------------------------------------------------------命令定义-E-------------------------------------------------------------------------------------


//------------------------------------------------------------------命令定义-S-------------------------------------------------------------------------------------
/** websocket发送消息命令 */
export const EMIT_SKT1_CMD = "EMIT_SKT1_SCMD";
/** websocket接收消息命令 */
export const EMIT_SKT1_R_CMD = "EMIT_SKT1_RCMD";
/** layout-header展示搜索 */
export const EMIT_LAYOUT_HEADER_SEARCH_ISSHOW = "EMIT_LAYOUT_HEADER_SEARCH_ISSHOW";
/** 错误页面 */
export const EMIT_DOMAIN_ERROR_ALERT = "EMIT_DOMAIN_ERROR_ALERT";
// 点击键盘
export const EMIT_KEY_BOARD_CLICK_CMD = "EMIT_KEY_BOARD_CLICK";
// 计算总投注数
export const EMIT_BET_TOTAL_COUNT_CMD = "EMIT_BET_TOTAL_COUNT";
// 计算总金额
export const EMIT_BET_TOTAL_MONEY_CMD = "EMIT_BET_TOTAL_MONEY";
// 计算总收益额
export const EMIT_BET_TOTAL_WIN_MONEY_CMD = "EMIT_BET_TOTAL_WIN_MONEY";
// 单关的校验金额
export const EMIT_BET_SINGLE_CHECK_MONEY_CMD = "EMIT_BET_SINGLE_CHECK_MONEY";
// 单关保留选项
export const EMIT_SINGLE_SAVE_BET_CMD = "EMIT_SINGLE_SAVE_BET_CMD";
// 获取单关滚动条的高度
export const EMIT_BET_SINGLE_SCROLL_HEIGHT_CMD =
  "EMIT_BET_SINGLE_SCROLL_HEIGHT";
// 串关的校验金额
export const EMIT_BET_MIX_CHECK_MONEY_CMD = "EMIT_BET_MIX_CHECK_MONEY";
// 串关保留选项
export const EMIT_MIX_SAVE_BET_CMD = "EMIT_MIX_SAVE_BET_CMD";
// 检查串关是否有效
export const EMIT_BET_CHECK_EFFECT_CMD = "EMIT_BET_CHECK_EFFECT";
// 检查串关是否异常
export const EMIT_BET_CHECK_EXCEPTION_CMD = "EMIT_BET_CHECK_EXCEPTION";
// 提示显示
export const EMIT_SHOW_TOAST_CMD = "EMIT_SHOW_TOAST_CMD";
// 提示显示
export const EMIT_SHOW_ALERT_CMD = "EMIT_SHOW_ALERT_CMD";
// 确认弹出框
export const EMIT_SHOW_CONFIRM_CMD = "EMIT_SHOW_CONFIRM_CMD";

// 设置值
export const EMIT_BET_SET_OBJ_CMD = "EMIT_SET_BET_OBJ";
// 完成投注
export const EMIT_COMPLETE_HANDLE_CMD = "EMIT_COMPLETE_HANDLE";
// 单关投注完成
export const EMIT_SINGLE_COMPLETE_HANDLE_CMD = "EMIT_SINGLE_COMPLETE_HANDLE";
// 单关取消按钮
export const EMIT_SINGLE_CANCEL_HANDLE_CMD = "EMIT_SINGLE_CANCEL_HANDLE";
// 最高可赢
export const EMIT_MAX_WIN_MONEY_CMD = "EMIT_MAX_WIN_MONEY";
// 获取账户金额
export const EMIT_GET_BALANCE_CMD = "EMIT_GET_BALANCE_CMD";
// 单关滚动条位置初始化
export const EMIT_BET_SINGLE_POSITION_CMD = "EMIT_SINGLE_POSITION";
// 串关滚动条位置初始化
//export const EMIT_BET_MIX_POSITION_CMD = "MIX_POSITION";
// 更新赛事列表对应投注项数据
export const EMIT_MATCH_UPDATE_TARGET_OBJ_CMD = "EMIT_UPDATE_TARGET_OBJ";
// 更新赛事详情对应投注项数据
export const EMIT_DETAIL_UPDATE_TARGET_OBJ_CMD =
  "EMIT_DETAIL_UPDATE_TARGET_OBJ";
// 获取赛事信息
export const EMIT_GET_MATCH_INFO_CMD = "EMIT_GET_MATCH_INFO_CMD";

// 发送刷新页面命令
export const EMIT_LOCATION_RELOAD_CMD = "EMIT_LOCATION_RELOAD_CMD";

// 站点 tab 休眠状态转激活
export const EMIT_SITE_TAB_ACTIVE = "EMIT_SITE_TAB_ACTIVE";
// 站点 tab 站点页眉 弹窗控制
export const EMIT_SITE_SHOW_MODEL = "EMIT_SITE_SHOW_MODEL";
// 站点 tab 站点页眉 打开注单历史
export const EMIT_SITE_OPEN_HISTORY = "EMIT_SITE_OPEN_HISTORY";
// 刷新C8订阅
export const EMIT_REFRESH_C8_SUBSCRIBE = "EMIT_REFRESH_C8_SUBSCRIBE";

// 获取最大最小金额
export const EMIT_MIN_MAX_MONEY_CMD = "EMIT_MIN_MAX_MONEY_CMD";

// 发送刷新菜单数量
export const EMIT_MENU_REFRESH_COUNT_CMD = "EMIT_MENU_REFRESH_COUNT_CMD";

// 菜单变化
export const EMIT_MENU_CHANGE_CMD = "EMIT_MENU_CHANGE_CMD";

// 热门菜单变化——专业版
export const EMIT_MENU_HOT_CHANGE_CMD = "EMIT_MENU_HOT_CHANGE_CMD";

// 列表顶部菜单变化
export const EMIT_TOPMENU_CHANGE_CMD = "EMIT_TOPMENU_CHANGE_CMD";

// 发送收藏指令
export const EMIT_MX_COLLECT_COUNT_CMD = "EMIT_MX_COLLECT_COUNT_CMD";

// 发送收藏指令
export const EMIT_MX_COLLECT_COUNT2_CMD = "EMIT_MX_COLLECT_COUNT2_CMD";
// 发送注单历史查询事件
export const EMIT_RECODES_QUERY_BUT_CMD = "EMIT_RECODES_QUERY_BUT_CMD";
// 改变分页
export const EMIT_RECORD_CHANGE_PAGE_SIZE_CMD =
  "EMIT_RECORD_CHANGE_PAGE_SIZE_CMD";

// 发送初始化最小值组件命令
export const EMIT_MIX_INIT_VIEW_CMD = "EMIT_MIX_INIT_VIEW_CMD";

// 重新调用单关最大最小值接口
export const EMIT_BET_SINGLE_RECALL_MONEY_CMD =
  "EMIT_BET_SINGLE_RECALL_MONEY_CMD";

// 重置单关红升绿降状态
export const EMIT_BET_SINGLE_RESET_CMD = "EMIT_BET_SINGLE_RESET_CMD";

// 重置串关红升绿降状态
export const EMIT_BET_MIX_ITEM_RESET_CMD = "EMIT_BET_MIX_ITEM_RESET_CMD";

// 备份串关bet_obj对象
export const EMIT_MIX_BET_OBJ_CLONE_CMD = "EMIT_MIX_BET_OBJ_CLONE_CMD";

// 列表赛事类型与表头吸顶
export const EMIT_MATCH_LIST_STICKY = "EMIT_MATCH_LIST_STICKY";

// 赛事列表订阅
export const EMIT_MATCH_LIST_SUBSCRIBE = "EMIT_MATCH_LIST_SUBSCRIBE";

// 赛事详情订阅
export const EMIT_MATCH_DETAIL_SUBSCRIBE = "EMIT_MATCH_DETAIL_SUBSCRIBE";

// 启动热门推荐的自动轮播
export const EMIT_HOT_START_PLAY = "EMIT_HOT_START_PLAY";

// 停止日门推荐的自动轮播
export const EMIT_HOT_STOP_PLAY = "EMIT_HOT_STOP_PLAY";

// 热门推荐收藏功能
export const EMIT_HOT_COLLECT = "EMIT_HOT_COLLECT";

 

// 触发清除串关输入框金额
export const EMIT_BET_MIX_CLEAR_HANDLE_CMD = "EMIT_BET_MIX_CLEAR_HANDLE_CMD";

// 发送父窗口中body标签中的滚动条滚动到顶部事件命令
export const EMIT_PATENT_BODY_SCROLL_TOP_CMD = "EMIT_PATENT_BODY_SCROLL_TOP_CMD";
// 获取直播赛事命令定义
export const EMIT_LIVE_ANIMATE_MATCH = "EMIT_GET_ANIMATE_MATCH";
// 获取热门联赛命令定义
export const EMIT_LEAGUE_HOT_LIST = "EMIT_LEAGUE_HOT_LIST";

// 投注栏投注项聚焦时定位
export const EMIT_BET_ITEM_POSITION_CMD = "EMIT_BET_ITEM_POSITION_CMD";
// C2订阅
export const EMIT_SCMD_C2_CMD = "EMIT_SCMD_C2_CMD";
// 开启菜单上loadding指令
export const EMIT_OPEN_MENU_LOADDING_CMD = "EMIT_OPEN_MENU_LOADDING_CMD";
// 关闭菜单上loadding指令
export const EMIT_CLOSE_MENU_LOADDING_CMD = "EMIT_CLOSE_MENU_LOADDING_CMD";
// 检查单关无效的金额
export const EMIT_SINGLE_CHECK_VALID_MOENY_CMD =
  "EMIT_SINGLE_CHECK_VALID_MOENY_CMD";

// 赛事列表重载
export const EMIT_RELOAD_MATCH_LIST_CMD = "EMIT_RELOAD_MATCH_LIST_CMD";


/******************************************** 投注 开始 *************************************************************************/


/******************************************** 投注 结束 *************************************************************************/

// 串关金额设置
export const EMIT_BET_MIX_SET_MONEY_CMD = "EMIT_BET_MIX_SET_MONEY_CMD";
// 更改串关的match_update字段值
export const EMIT_BET_MIX_CHANGE_MATCH_UPDATE =
  "EMIT_BET_MIX_CHANGE_MATCH_UPDATE";
// 更新串关投注项上的match_udpate字段
export const EMIT_BET_MIX_MATCH_UPDATE = "EMIT_BET_MIX_MATCH_UPDATE";
// 设置单关最小金额
export const EMIT_BET_SINGLE_MIN_MONEY = "EMIT_BET_SINGLE_MIN_MONEY";
// 设置串关最小金额
export const EMIT_BET_MIX_MIN_MONEY = "EMIT_BET_MIX_MIN_MONEY";
// 设置输入框金额
export const EMIT_BET_SET_MONEY = "EMIT_BET_SET_MONEY";
export const EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD =
  "EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD";
// 更新键盘按键状态
export const EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD =
  "EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD";
// 触发键盘时间
export const EMIT_MIX_UPDATE_KEYBOARD_STATUS_HANDLE =
  "EMIT_MIX_UPDATE_KEYBOARD_STATUS_HANDLE";
// 触发时输入框显示最大的金额
export const EMIT_BET_MIX_INPUT_MAX_MONEY = "EMIT_BET_MIX_INPUT_MAX_MONEY";
// 获取当前赛事选中的玩法对象
export const EMIT_MATCH_CURRENT_PLAY_CMD = "EMIT_MATCH_CURRENT_PLAY_CMD";
// 初始化玩法
export const EMIT_INIT_PLAY_INFO_CMD = "EMIT_INIT_PLAY_INFO_CMD";

// 更改联赛筛选单选框选中状态
export const EMIT_CHANGE_CHECK = "EMIT_CHANGE_CHECK";
// 选择查询的数据类型
export const EMIT_M_SELECT_CLICK = "EMIT_M_SELECT_CLICK";
// 同步详情数据到列表
export const EMIT_SYNCH_FROM_DETAIL = "EMIT_SYNCH_FROM_DETAIL";
// 串关计算投注区域高度(投注内嵌)
export const EMIT_COMPUTED_BET_HEIGHT_CMD = "EMIT_COMPUTED_BET_HEIGHT_CMD";
// 虚拟体育返回到体育项目
export const EMIT_VIRTUAL_BET_BACK_CMD = "EMIT_VIRTUAL_BET_BACK_CMD";
// 设置注单历史结算订单状态
export const EMIT_SET_PRE_ORDER_STATUS_CMD = "EMIT_SET_PRE_ORDER_STATUS_CMD";
// 设置注单历史结算概率(probabilities)和cashOutStatus的值
export const EMIT_SET_WS_INFO_DATA_CMD = "EMIT_SET_WS_INFO_DATA_CMD";
// 初始化确认中数据
export const EMIT_INIT_CONRIM_DATA_CMD = "EMIT_INIT_CONRIM_DATA_CMD";
// 未结算订单统计
export const EMIT_UNSETTLE_TICKETS_COUNT_CMD =
  "EMIT_UNSETTLE_TICKETS_COUNT_CMD";
// 获取提前结算按钮上的金额
export const EMIT_GET_PRE_AMOUNT_CMD = "EMIT_GET_PRE_AMOUNT_CMD";
// 语言切换时更新主队和客队名称
export const EMIT_UPDATE_HOME_AWAY_CMD = "EMIT_UPDATE_HOME_AWAY_CMD";
// 语言切换时更新
export const EMIT_CLICK_LANG_CMD = "EMIT_CLICK_LANG_CMD";
// 初始化联赛名称 赛季 玩法名称 队伍名称
export const EMIT_INIT_BET_LIST_ITEM_CMD = "EMIT_INIT_BET_LIST_ITEM_CMD";
// 获取投注数据(内嵌mini切换或者语言发生变化时调用)
export const EMIT_UPDATE_BET_DATA_CMD = "EMIT_UPDATE_BET_DATA_CMD";
// 从预约中列表数据，去除已经预约成功的注单数据
export const EMIT_DEL_BOOK_HISTORY_RECORD_CMD =
  "EMIT_DEL_BOOK_HISTORY_RECORD_CMD";
// 情况多项输入框
export const EMIT_CLEAR_BET_MULTIPLE_CMD = "EMIT_CLEAR_BET_MULTIPLE_CMD";
// 列表通知详情收藏
export const EMIT_MATCH_TO_HOT_COLLECT = "EMIT_MATCH_TO_HOT_COLLECT";
// 列表使用元数据 加载
export const EMIT_FETCH_MATCH_LIST_METADATA = "EMIT_FETCH_MATCH_LIST_METADATA";
// 列表刷新拉取接口
export const EMIT_FETCH_MATCH_LIST = "EMIT_FETCH_MATCH_LIST";
// 列表刷新拉取接口 结束
export const EMIT_FETCH_MATCH_LIST_FINISHED = "EMIT_FETCH_MATCH_LIST_FINISHED";
// 赛事收藏
export const EMIT_MX_COLLECT_MATCH = "EMIT_MX_COLLECT_MATCH";
//赛事详细数据接口
export const EMIT_API_BYMIDS = "EMIT_API_BYMIDS";
// 历史交战、近期战绩下拉框
export const EMIT_SELECT_FN = "EMIT_SELECT_FN";
// 杯赛积分查看更多
export const EMIT_GET_ALL_VSINFO = "EMIT_GET_ALL_VSINFO";
//打开单关投注
export const EMIT_OPEN_SINGLE_BET = "EMIT_OPEN_SINGLE_BET";
//单关合并投注
export const EMIT_OPEN_MAERGE_BET = "EMIT_OPEN_MAERGE_BET";
//左侧 菜单/投注/投注记录切换
export const EMIT_LAYOUT_LIST_TYPE = "EMIT_LAYOUT_LIST_TYPE";
// 可视区域id变更
export const EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE = "EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE";
//按钮失效
export const EMIT_BTN_CHANGE = "EMIT_BTN_CHANGE";

//键盘抬起事件
export const EMIT_ENTER_PRESS_EVENT = "EMIT_ENTER_PRESS_EVENT";

//关闭大视频投注
export const EMIT_CLOSE_BIG_VIDEO_BET = "EMIT_CLOSE_BIG_VIDEO_BET";

//跟新电竞右侧视频
export const EMIT_GET_ESPORTS_VIDEO_LIST = "EMIT_GET_ESPORTS_VIDEO_LIST";

//网络错误时设置默认最大最小值
export const EMIT_NET_ERR = "EMIT_NET_ERR";
//------------------------------------------------------------------命令定义-E-------------------------------------------------------------------------------------

 
// 调用用户接口，更新 域名流程
export const EMIT_SET_GETUSERINFO_OSS_API = "EMIT_SET_GETUSERINFO_OSS_API";

// ------------------------------------------------------------------投注相关-----------------------------------------------------------------------------------
// 添加虚拟体育投注项对象
export const EMIT_VITTUAL_BET_OBJ_ADD = "EMIT_VITTUAL_BET_OBJ_ADD";
// 移除虚拟体育投注项对象 移除对应的键值对
export const EMIT_VITTUAL_BET_OBJ_DEL = "EMIT_VITTUAL_BET_OBJ_DEL";
// 移除虚拟体育投注项对象 移除对应的数据
export const EMIT_VITTUAL_BET_LIST_DEL = "EMIT_VITTUAL_BET_LIST_DEL";
// 获取投注项状态
export const EMIT_GET_ODDS_ACTIVE = "EMIT_GET_ODDS_ACTIVE";
// 投注成功后获取投注记录数据 数量 24小时内的
export const EMIT_TICKRTS_COUNT_CONFIG = "EMIT_TICKRTS_COUNT_CONFIG"
// 投注记录获取
export const EMIT_GET_RECORD_LIST = "EMIT_GET_RECORD_LIST"
// 限额
export const EMIT_REF_DATA_BET_MONEY = "EMIT_REF_DATA_BET_MONEY"
// 投注金额更新
export const EMIT_REF_DATA_BET_MONEY_UPDATE = "EMIT_REF_DATA_BET_MONEY_UPDATE"
// 键盘输入
export const EMIT_INPUT_BET_MONEY_KEYBOARD = "EMIT_INPUT_BET_MONEY_KEYBOARD"
// 投注loading
export const EMIT_BET_LOADING = "EMIT_BET_LOADING"


// ------------------------------------------------------------------详情相关-----------------------------------------------------------------------------------

// 通知列表右侧详情，获取近期关注数据
export const EMIT_GET_HISTORY = "EMIT_GET_HISTORY";

export const EMIT_AUTOSET_MATCH = "EMIT_AUTOSET_MATCH";
//滚动位置
export const EMIT_SET_SCROLL_POSITION = "EMIT_SET_SCROLL_POSITION";
// 检查玩法关盘
export const EMIT_CHECK_PLAYS_SHOW = "EMIT_CHECK_PLAYS_SHOW";
// 检查玩法关盘
export const EMIT_SET_CLOSE_TIPS = "EMIT_SET_CLOSE_TIPS";
// 详情页 loading 状态改变
export const EMIT_CHANGE_LOADING_STATUS_DETAILS =
  "EMIT_CHANGE_LOADING_STATUS_DETAILS";
  // 右侧详情加载 loading 状态改变
export const EMIT_CHANGE_LOADING_STATUS_RIGHT_DETAILS =
"EMIT_CHANGE_LOADING_STATUS_RIGHT_DETAILS";
// 获取详情页头部高度
export const EMIT_GET_DETAILS_HEIGHT_MAIN = "EMIT_GET_DETAILS_HEIGHT_MAIN";
// 右侧头部高度
export const EMIT_MATCH_DETAILS_HEADER_HEIGHT_RIGHT_DETAILS = "EMIT_MATCH_DETAILS_HEADER_HEIGHT_RIGHT_DETAILS";
// 获取虚拟详情页头部高度
export const EMIT_DETAILS_HEADER_HEIGHT_VIRTUAL_DETAILS = "EMIT_DETAILS_HEADER_HEIGHT_VIRTUAL_DETAILS";
// 虚拟体育右侧头部视频区高度
export const EMIT_VIRTUAL_DETAILS_HEADER_HEIGHT = "EMIT_VIRTUAL_DETAILS_HEADER_HEIGHT";

export const EMIT_GET_BACKGROUND_IMG = "EMIT_GET_BACKGROUND_IMG";

// // 左侧菜单初始化完成，顶部导航增加虚拟体育和电竞
export const EMIT_MENU_INIT_DONE = "EMIT_MENU_INIT_DONE";
export const EMIT_IS_MENU_LOADDING = "EMIT_IS_MENU_LOADDING";
export const EMIT_SET_PRE_VIDEO_SRC = "EMIT_SET_PRE_VIDEO_SRC";
export const EMIT_CLOSE_HOME_LOADING = "EMIT_CLOSE_HOME_LOADING";
//更新活动入口小红点
export const EMIT_UPDATE_BONUS = "EMIT_UPDATE_BONUS";

// // 版本号检查状态通知
export const EMIT_REQUEST_USER_BANNER = "EMIT_REQUEST_USER_BANNER";
// // 重新计算投注框高度
export const EMIT_TOGGLE_HANDLE = "EMIT_TOGGLE_HANDLE";
export const EMIT_LIST_ON_SCROLL = "EMIT_LIST_ON_SCROLL";
export const EMIT_RIGHT_DETAILS_ON_SCROLL = "EMIT_RIGHT_DETAILS_ON_SCROLL";

// 重新计算布局
export const EMIT_LAYOUT_RESIZE="EMIT_LAYOUT_RESIZE"
//菜单变化是否mini
export const EMIT_LAYOUT_MENU_TOGGLE="EMIT_LAYOUT_MENU_TOGGLE";
//多列玩法变化
export const EMIT_MULTI_COLUMN_TOGGLE="EMIT_MULTI_COLUMN_TOGGLE";
//PC右侧是否展示
export const EMIT_LAYOUT_RIGHT_STATUS="EMIT_LAYOUT_RIGHT_STATUS"

// 监听数据加载状态
export const EMIT_SET_MATCH_DETAIL_LOAD_STATE = "EMIT_SET_MATCH_DETAIL_LOAD_STATE";
// 监听用户点击玩法   折叠或收起
export const EMIT_SET_PANEL_STATUS = "EMIT_SET_PANEL_STATUS";
// 监听获取当前选中详情玩法集
export const EMIT_GET_ACTIVE_DETAILS_PLAY_TAB = "EMIT_GET_ACTIVE_DETAILS_PLAY_TAB";
export const EMIT_SET_MATCH_LIST_SCROLL_TOP = 'EMIT_SET_MATCH_LIST_SCROLL_TOP'

// ------------------------------------------------------------------视频相关-----------------------------------------------------------------------------------
/** 关闭视频播放窗口 */
export const EMIT_VIDEO_ZONE_EVENT_CMD = 'EMIT_VIDEO_ZONE_EVENT_CMD'

/**  详情tab玩法列表数据 */
export const EMIT_SET_HANDICAP_THIS = 'EMIT_SET_HANDICAP_THIS'


 /**  球种下拉框更新选中球种 */
 export const EMIT_CHANGE_SPORT = 'EMIT_CHANGE_SPORT'
 /**  下拉框选择球种 */
 export const EMIT_SElECT_SPORT = 'EMIT_SElECT_SPORT'
 /**  监听是否关闭日期选择器 */
 export const EMIT_STARTTIME_SHOWFUNC = 'EMIT_STARTTIME_SHOWFUNC'
 /**  隐藏球类选择器*/
 export const EMIT_HIDE_SPORT_SElECT = 'EMIT_HIDE_SPORT_SElECT'

/**   站点 tab 休眠状态转激活 */
 export const EMIT_VISIBILITYCHANGE_EVENT = 'EMIT_VISIBILITYCHANGE_EVENT'
/**     切换球种时让联赛选择框清除选中热门*/
 export const EMIT_INIT_SELECT= 'EMIT_INIT_SELECT'

/**  赛果时间选择器   */
export const EMIT_SHOW_SELECT= 'EMIT_SHOW_SELECT'

/**   赛事详情更新   */
export const EMIT_SHOW_DETAILS= 'EMIT_SHOW_DETAILS'


/**   赛事详情更新一键收起   */
export const EMIT_SHOW_FOLD= 'EMIT_SHOW_FOLD'

/**   赛事详情更新一键置顶   */
export const EMIT_SET_PLAT_TOP= 'EMIT_SET_PLAT_TOP'

// WS驱动详情
export const EMIT_DATAWARE_DETAIL_UPDATE = "EMIT_DATAWARE_DETAIL_UPDATE"

/**   ifram 视频   */
export const EMIT_IFRAME_VIDEO_VOLUME= 'EMIT_IFRAME_VIDEO_VOLUME'

/**   原视频全屏  */
export const EMIT_IFRAME_VIDEO_STATUS_CHANGE= 'EMIT_IFRAME_VIDEO_STATUS_CHANGE'

/** 视频退出浏览器全屏 components.video.vue $exit_browser_full_screen */
export const EMIT_EXIT_BROWSER_FULL_SCREEN = 'EMIT_EXIT_BROWSER_FULL_SCREEN'

export const EMIT_VIDEO_ZONE_EVENT_CMD_END= 'EMIT_VIDEO_ZONE_EVENT_CMD_END'

export const EMIT_IFRAME_VIDEO_MSG_EVENT= 'EMIT_IFRAME_VIDEO_MSG_EVENT'

/** 视频退出全屏 components.video.vue $exit_full_screen */
export const EMIT_EXIT_FULL_SCREEN_MSG_EVENT= 'EMIT_EXIT_FULL_SCREEN_MSG_EVENT'
// 晒单页面变更
export const EMIT_SAIDAN_PAGE_CHANGE_MSG_EVENT= 'EMIT_SAIDAN_PAGE_CHANGE_MSG_EVENT'

// websocket链接状态变化
export const EMIT_WS_STATUS_CHANGE_EVENT  = 'EMIT_WS_STATUS_CHANGE_EVENT'

// 快捷金额 显示 隐藏
export const EMIT_SHOW_QUICK_AMOUNT  = 'EMIT_SHOW_QUICK_AMOUNT'
// 设置快捷金额 
export const EMIT_SET_QUICK_AMOUNT  = 'EMIT_SET_QUICK_AMOUNT'
// 左侧菜单变更 欧洲版
export const EMIT_SET_LEFT_MENU_CHANGE  = 'EMIT_SET_LEFT_MENU_CHANGE'
// 左侧菜单变更-冠军 欧洲版
export const EMIT_SET_LEFT_MENU_CHANGE_OUTRIGHTS  = 'EMIT_SET_LEFT_MENU_CHANGE_OUTRIGHTS'
// 左侧菜单变更-收藏 欧洲版
export const EMIT_SET_LEFT_MENU_CHANGE_FAVOURITES  = 'EMIT_SET_LEFT_MENU_CHANGE_FAVOURITES'
// 搜索结果变更
export const EMIT_SET_SEARCH_CHANGE  = 'EMIT_SET_SEARCH_CHANGE'
// 搜索结果input宽度变更
export const EMIT_SET_SEARCH_CHANGE_WIDTH  = 'EMIT_SET_SEARCH_CHANGE_WIDTH'
// 用于切换home 触发更新
export const EMIT_SET_HOME_MATCHES = "EMIT_SET_HOME_MATCHES"
// 用于C106投注项红绿升级
export const EMIT_SET_BET_WS_C106_CHANGE = "EMIT_SET_BET_WS_C106_CHANGE"
// var 时间
export const EMIT_VAR_EVENT = "EMIT_VAR_EVENT"
// 菜单数量变更
export const EMIT_SET_BESE_MENU_COUNT_CHANGE = "EMIT_SET_BESE_MENU_COUNT_CHANGE"

/**   切换赛事更新   */
export const EMIT_SWITCH_MATCH = 'EMIT_SWITCH_MATCH'

/**   多项注单输入金额   */
export const EMIT_BET_MULTIPLE_MONEY = 'EMIT_BET_MULTIPLE_MONEY'

// 投注列表切换
export const EMIT_BET_RECORD_SELECTED_CHANGE= "EMIT_BET_RECORD_SELECTED_CHANGE"

// 提前结算列表金额变化
export const EMIT_EARLY_MONEY_LIST_CHANGE= "EMIT_EARLY_MONEY_LIST_CHANGE"
// 获取最近访问的赛种信息
export const EMIT_SET_VISIT_SPORTS_LIST= "EMIT_SET_VISIT_SPORTS_LIST"