/*
 * @Author: success
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
export const EMIT_SKT1_CMD = 'SKT1_SCMD';
/** websocket接收消息命令 */
export const EMIT_SKT1_R_CMD = 'SKT1_RCMD';
/** 发送菜单变化命令 */
export const EMIT_MENU_CHANGE_CMD = 'MENU_CHANGE_SCMD';
/** 发送底部菜单变化命令 */
export const EMIT_MENU_CHANGE_FOOTER_CMD = 'EMIT_MENU_CHANGE_FOOTER_CMD';
/** 押注成功通知消息命令 */
export const EMIT_BATTING_SUCCESS_CMD = 'BATTING_SUCCESS_CMD';
/** 押注功能滚动条上滚命令 */
export const EMIT_BATTING_SCROLL_TOP_CMD = 'BATTING_SCROLL_TOP_CMD';
/**收藏页下拉页面查看历史数据 */
export const EMIT_HISTORY_EXPAND_CHANGE_CMD = 'HISTORY_EXPAND_CHANGE';
/** 收藏页历史数据变化  */
export const EMIT_HISTORY_DATA_CHANGE_CMD = 'HISTORY_DATA_CHANGE';
/** 收藏比赛数据*/
export const EMIT_COLLECT_MATCH_CMD = 'COLLECT_MATCH';
/** 收藏数据清空*/
export const EMIT_COLLECT_DATA_CLEANING_CMD = 'COLLECT_DATA_CLEANING';
/** 比赛或联赛收藏变化*/
export const EMIT_COLLECT_CHANGE_CMD = 'COLLECT_CHANGE';
/** 设置需要编辑（显示键盘）的子项*/
export const EMIT_SETCTRINDEX_CMD = 'SETCTRINDEX';
/** 键盘按钮触发改变金额*/
export const EMIT_CHANGE_MONEY_CMD = 'CHANGE_MONEY';
/** 单个投注时右上角的X号是否显示*/
export const EMIT_X_BTN_HIDE_CMD = 'X_BTN_HIDE';
/** 触发滑块删除*/
export const EMIT_IS_DELETE_CMD = 'IS_DELETE';
/** 筛选 resultItem 组件点击时 emit*/
export const EMIT_MATCH_ROW_CLICK_CMD = 'MATCH_ROW_CLICK';

// 更新init_load
export const EMIT_ALLOW_INIT_LOAD = "EMIT_ALLOW_INIT_LOAD";
// c201消息处理
export const EMIT_C201_UPDATE = "EMIT_C201_UPDATE";
// 监听键盘金额改变事件
export const EMIT_CHANGE_MONEY = "EMIT_CHANGE_MONEY";
// 监听键盘赔率改变事件
export const EMIT_CHANGE_ODDS = "EMIT_CHANGE_ODDS";
// 监听键盘盘口改变事件
export const EMIT_CHANGE_MARKET = "EMIT_CHANGE_MARKET";
// 移除无效注单
export const EMIT_REMOVE_INVALID_ = "EMIT_REMOVE_INVALID_";
//
export const EMIT_C201_UPDATE2 = "EMIT_C201_UPDATE2";
// 触发投注状态改变
export const EMIT_CHANGE_STATUS_ = "EMIT_CHANGE_STATUS_";
//
export const EMIT_UPDATE_MONEY = "EMIT_UPDATE_MONEY";
// 触发键盘金额改变和同步最大金额
export const EMIT_SEND_VALUE = "EMIT_SEND_VALUE";
// 将当前活动项的赔率传递给键盘
export const EMIT_SEND_PRE_ODDS = "EMIT_SEND_PRE_ODDS";
// 将当前活动项的盘口传递给键盘
export const EMIT_SEND_PRE_MARKET = "EMIT_SEND_PRE_MARKET";
// 监听页面可见性，当页面不可见时关闭视频声音一级关闭ws推送 , 当可见时恢复
export const EMIT_VISIBILITYCHANGE_EVENT = "EMIT_VISIBILITYCHANGE_EVENT";
// 详情页刷新
export const EMIT_REF_API = "EMIT_REF_API";
// 刷新 注单记录----请求
export const EMIT_UPDATE_ORDER_LIST = "EMIT_UPDATE_ORDER_LIST";
// 刷新详情页头部信息
export const EMIT_REFRESH_DETAILS = "EMIT_REFRESH_DETAILS";
// 详情玩法集
export const EMIT_GET_ODDS_LIST = "EMIT_GET_ODDS_LIST";
// 详情视频开启
export const EMIT_SET_SHOW_VIDEO = "EMIT_SET_SHOW_VIDEO";
// 控制视频说明弹窗
export const EMIT_VIDEO_DESCRIPTION_SHOW = "EMIT_VIDEO_DESCRIPTION_SHOW";
// 详情iframe标签
export const EMIT_SET_IFRAME_ONLOAD = "EMIT_SET_IFRAME_ONLOAD";
// 赛事分析刷新事件
export const EMIT_REFRESH_MATCH_ANALYSIS = "EMIT_REFRESH_MATCH_ANALYSIS";
// 重载注单页面
export const EMIT_RELOAD_NOTE_SHEET = "EMIT_RELOAD_NOTE_SHEET";
//
export const EMIT_REFRESH_CHATROOM = "EMIT_REFRESH_CHATROOM";
// 足篮显示分析页
export const EMIT_ANA_SHOW = "EMIT_ANA_SHOW";
// 监听是否下拉联赛列表
export const EMIT_IS_BOOL_DIALOG_DETAILS = "EMIT_IS_BOOL_DIALOG_DETAILS";
// 显示注单历史
export const EMIT_CHANGE_RECORD_SHOW = "EMIT_CHANGE_RECORD_SHOW";
// 触发窗口尺寸变化
export const EMIT_WINDOW_RESIZE = "EMIT_WINDOW_RESIZE";
//
export const EMIT_C201_HANDLE = "EMIT_C201_HANDLE";
export const EMIT_C201_HANDLE_BET_RECORD = "EMIT_C201_HANDLE_BET_RECORD";
//
export const EMIT_C210_HANDLE = "EMIT_C210_HANDLE";
// 详情页储存时间，保证时间同步
export const EMIT_SET_MATCH_TIME = "EMIT_SET_MATCH_TIME";
// 监听match_nostart事件
export const EMIT_MATCH_NOSTART = "EMIT_MATCH_NOSTART";
// 详情页更新 正/倒 计时时间
export const EMIT_UPDATE_GAME_TIME = "EMIT_UPDATE_GAME_TIME";
//  第一次赛事列表接口拉取后设置吸顶赛事(吸顶功能已移除) 与设置冠军玩法前置逻辑
export const EMIT_IS_FIRST_LOADED = "EMIT_IS_FIRST_LOADED";
// 触发登录失效
export const EMIT_GO_TO_VENDER = "EMIT_GO_TO_VENDER";
// 失败 页面  没网 之类的 错误页面
export const EMIT_DOMAIN_ERROR_ALERT = "EMIT_DOMAIN_ERROR_ALERT";
// 详情页资源预加载 或者 视频动画预资源
export const EMIT_SET_PRE_VIDEO_SRC = "EMIT_SET_PRE_VIDEO_SRC";
// 监听搜索弹框是否展示
export const EMIT_CHANGE_SELECT_DIALOG = "EMIT_CHANGE_SELECT_DIALOG";
// 监听设置弹框是否展示
export const EMIT_CHANGE_SETTING_SHOW = "EMIT_CHANGE_SETTING_SHOW";
// 监听搜索筛选弹框是否展示
export const EMIT_CHANGE_SEARCH_FILTER_SHOW = "EMIT_CHANGE_SEARCH_FILTER_SHOW";
// 触发获取用户余额
export const EMIT_GET_USER_ACCOUNT1 = "EMIT_GET_USER_ACCOUNT1";
// 首页是否已经加载完接口，显示骨架屏
export const EMIT_API_LOAD = "EMIT_API_LOAD";
// 监听reset_set_hton事件(详情页投注项点击置顶),设置详情页玩法集合区域的高度为0
export const EMIT_RESET_SET_HTON = "EMIT_RESET_SET_HTON";
// 菜单时间列表变化
export const EMIT_CURRENT_WORLD_CUP_MENU_S_TIME_EVENT = "EMIT_CURRENT_WORLD_CUP_MENU_S_TIME_EVENT";
// 详情若无热门推荐赛事，则隐藏相应内容
export const EMIT_HIDE_DETAIL_MATCH_LIST = "EMIT_HIDE_DETAIL_MATCH_LIST";
// 底部信息skt连接,发送启动命令
export const EMIT_CATEGORY_SKT = "EMIT_CATEGORY_SKT";
// 搜索页面是否是 历史和热门点击
export const EMIT_SET_IS_HOT_HISTORY = "EMIT_SET_IS_HOT_HISTORY";
// 拳击赛事级别关盘+当前时间(服务器时间)>=赛事开赛时间(mgt) 此时详情页拳击赛事切换下一场
export const EMIT_CHANGE_DETAILS_MATCH = "EMIT_CHANGE_DETAILS_MATCH";
// 头部信息skt连接，发送启动命令
export const EMIT_DETAILS_SKT = "EMIT_DETAILS_SKT";
// 触发比分更新
export const EMIT_SET_NATIVE_DETAIL_DATA = "EMIT_SET_NATIVE_DETAIL_DATA";
// 0号模板点击收起的时候，要调整滚动距离 |
export const EMIT_SET_DETAILDS_SCROLL = "EMIT_SET_DETAILDS_SCROLL";
// 详情页模板加载骨架屏
export const EMIT_MATCHINFO_LOADING = "EMIT_MATCHINFO_LOADING";
// 切换玩法集时候的动作,判断页面距离顶部的距离(视频和动画没点开的时候), 当点开视频或者动画时,设置玩法区域的高度
export const EMIT_DETAILILS_TAB_CHANGED = "EMIT_DETAILILS_TAB_CHANGED";
// 切换玩法集时记录当前玩法的ID
export const EMIT_DETAILS_TAB_ITEM = "EMIT_DETAILS_TAB_ITEM"
// 调用 玩法集列表接口
export const EMIT_TABS_LIST_UPDATE_HANDLE = "EMIT_TABS_LIST_UPDATE_HANDLE";
// 赛果骨架屏
export const EMIT_RESULT_LIST_LOADING = "EMIT_RESULT_LIST_LOADING";
// 详情页骨架屏切换时，显示
export const EMIT_CHANGE_TAB = "EMIT_CHANGE_TAB";
// 将tab的滚动距离回复到初始点
export const EMIT_REFRESH_DETAILS_TAB = "EMIT_REFRESH_DETAILS_TAB";
// 更新详情页玩法集，需要拉取玩法集接口
export const EMIT_REFRESH_DETAILS_TAB_BET = "EMIT_REFRESH_DETAILS_TAB_BET";
// 触发详情页世间初始化
export const EMIT_MATCH_TIME_SHOW_INIT = "EMIT_MATCH_TIME_SHOW_INIT";
// WS推送C105(C106)更新足球基准分
export const EMIT_CHANGE_BASE_SCORE = "EMIT_CHANGE_BASE_SCORE";
// 当ws推送C301菜单数量变化时通知菜单组件更新数量
export const EMIT_MENU_MATCH_COUNT_CHANGE = "EMIT_MENU_MATCH_COUNT_CHANGE";
// 赛程骨架屏的 显示
export const EMIT_SHOW_HOT_SCHEDULE_LOADING = "EMIT_SHOW_HOT_SCHEDULE_LOADING";
// 触发榜单页 和 赛程列表页面 的切换
export const EMIT_HOT_LEADERBOARD_SWITCH = "EMIT_HOT_LEADERBOARD_SWITCH";
// 触发数据更新  初始化 sports_balls_tab 的data 数据
export const EMIT_SET_SPORTS_BALLS_TAB = "EMIT_SET_SPORTS_BALLS_TAB";
// 赛果虚拟体育分页时页码切换 (可移除)
export const EMIT_VIRTUAL_RESULT_PAGE_CHANGE = "EMIT_VIRTUAL_RESULT_PAGE_CHANGE";
// 次要玩法展开时拉取赛事接口后更新本地的赛事投注项赔率对象数据
export const EMIT_SPECIAL_HPS_LOADED = "EMIT_SPECIAL_HPS_LOADED";
// 投注框获取到最新赔率同步到列表页
export const EMIT_BET_ODD_SYNCHRONIZE = "EMIT_BET_ODD_SYNCHRONIZE";
// 赛事列表滚动时通知到赛事列表主组件的mixin统一处理数据
export const EMIT_MATCH_LIST_SCROLLING = "EMIT_MATCH_LIST_SCROLLING";
// 赛事次要玩法展开通知到赛事列表主组件的mixin重新计算dom高度
export const EMIT_SECONDARY_PLAY_UNFOLD_CHANGE = "EMIT_SECONDARY_PLAY_UNFOLD_CHANGE";
// 热门赛事列表切换二级菜单时, 通知隐藏次要玩法(罚牌) 描述
export const EMIT_TAB_HOT_CHANGING = "EMIT_TAB_HOT_CHANGING";
// 赛事列表数据加载完成后 , 处理页脚菜单第一个项相关逻辑 , 如果是专业版显示"关注" , 如果是简版显示切换赔率的菜单
export const EMIT_MATCH_LIST_DATA_TAKED = "EMIT_MATCH_LIST_DATA_TAKED";
// 罚牌描述图标点击控制罚牌描述框显示与隐藏
export const EMIT_INFO_ICON_CLICK = "EMIT_INFO_ICON_CLICK";
// 通知罚牌描述框显示与隐藏切换
export const EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE = "EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE";
// 次要玩法收到C105推送命令时更新获取数据更新投注项
export const EMIT_C105_CMD_NOTICE = "EMIT_C105_CMD_NOTICE";
// 虚拟体育篮球倒计时到达时切换进行中或赛事赛事
export const EMIT_BASKETBALL_TIME_ARRIVED = "EMIT_BASKETBALL_TIME_ARRIVED";
// 虚拟篮球到达赛前状态时, 强行结束篮球倒计时并切换到赛前状态
export const EMIT_FORCE_END_PLAYING_BASKETBALL = "EMIT_FORCE_END_PLAYING_BASKETBALL";
// 虚拟篮球赛事结束时展示篮球赛果并且赛果显示倒计时到达时切换到下一轮虚拟篮球
export const EMIT_INGAME_RESULT_SHOW_END = "EMIT_INGAME_RESULT_SHOW_END";
// 虚拟体育倒计时还剩10秒开赛时通知赛事关盘
export const EMIT_ARRIVED10 = "EMIT_ARRIVED10";
// 欧洲版h5虚拟体育-头部菜单点击
export const EMIT_VR_MENU_CLICK = "EMIT_VR_MENU_CLICK";
// 虚拟足球获取到赛果数据时通知子组件显示赛果数据
export const EMIT_MATCH_RESULT_DATA_LOADED = "EMIT_MATCH_RESULT_DATA_LOADED";
// 简版页脚菜单切换 玩法 全场独赢 , 全场让球 , 大小 , 角球等
export const EMIT_FOOTER_SUB_MENU_ID_CHANGED = "EMIT_FOOTER_SUB_MENU_ID_CHANGED";
// 拉取菜单接口重新统计菜单赛事数量(例如当页脚刷新时,或赛事结束移除列表时)
export const EMIT_RE_STATISTICS_MATCH_COUNT = "EMIT_RE_STATISTICS_MATCH_COUNT";
// 触发隐藏弹出框动作
export const EMIT_HID_SEARCH_DIA = "EMIT_HID_SEARCH_DIA";
// 触发联赛赛选完成动作
export const EMIT_SELECT_LEAGUE_COMPLETE = "EMIT_SELECT_LEAGUE_COMPLETE";
// 获取到视频进程数据 , 初始化视频数据准备播放视频
export const EMIT_VIDEO_PROCESS_DATA_GOT = "EMIT_VIDEO_PROCESS_DATA_GOT";
// 篮球早盘倒计时结束显示列表比分
export const EMIT_PRE_COUNTING_EDN = "EMIT_PRE_COUNTING_EDN";
// 所有赛事结束通知获取下一轮赛事数据
export const EMIT_IS_ALL_END_NOTICE = "EMIT_IS_ALL_END_NOTICE";
// 虚拟体育获取到视频接口中的赛事数据同步状态到赛事列表 , 并根据接口数据更新视频播放进度
export const EMIT_SYNC_VIDEO_DATA = "EMIT_SYNC_VIDEO_DATA";
// 获取到视频进程接口数据 , 更新视频进度与赛事进度
export const EMIT_CURRENT_VIDEO_PROCESS_INITED = "EMIT_CURRENT_VIDEO_PROCESS_INITED";
// 虚拟体育拉取接口时通知显示loading动画
export const EMIT_VIRTUAL_MATCH_LOADING = "EMIT_VIRTUAL_MATCH_LOADING";
// 虚拟体育拉取接口时通知显示loading动画
export const EMIT_MATCH_EDNED_STATUS2 = "EMIT_MATCH_EDNED_STATUS2";
//首页活动弹框
export const EMIT_INDEX_ACTIVITY_STATUS = "EMIT_INDEX_ACTIVITY_STATUS";
// 活动倒计时结束 刷新当面页面
export const EMIT_INDEX_REFRESH_END = "EMIT_INDEX_REFRESH_END";
//
export const EMIT_NO_VIRTUAL_MENU_DATA = "EMIT_NO_VIRTUAL_MENU_DATA";
//  绑定取消预约弹层，订单号，队名
export const EMIT_SHOW_CANCLE_POP = "EMIT_SHOW_CANCLE_POP";
//
export const EMIT_GET_ORDER_LIST = "EMIT_GET_ORDER_LIST";
// 足球进球事件
export const EMIT_FOOTBALL_EVENTS = "EMIT_FOOTBALL_EVENTS";
// 视频切换
export const EMIT_VIDEO_SWITCHING = "EMIT_VIDEO_SWITCHING";
// 滚动时隐藏罚牌/角球等说明弹窗
export const EMIT_HIDE_GAMEPLAY_TITLE = "EMIT_HIDE_GAMEPLAY_TITLE";
//
export const EMIT_GET_ACTIVE_DETAILS_PLAY_TAB = "EMIT_GET_ACTIVE_DETAILS_PLAY_TAB";
// 主菜单切换
export const EMIT_MAIN_MENU_CHANGE = "EMIT_MAIN_MENU_CHANGE";
// 获取二级菜单选中项菜单数据
// 接口请求超时清除加载中
export const EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE = "EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE";
//
export const EMIT_COUNTING_DOWN_START_ENDED = "EMIT_COUNTING_DOWN_START_ENDED";
// 上次滚动记录值存在 则触发滚动计算
export const EMIT_SET_SCROLL_TOP = "EMIT_SET_SCROLL_TOP";
// 搜索页跳转冠军逻辑
export const EMIT_SEARCH_GOTO_BY_MAIN_SPORT = "EMIT_SEARCH_GOTO_BY_MAIN_SPORT";
//
export const EMIT_XU_NI_TY_STANDARD_ODD_STATUS = "EMIT_XU_NI_TY_STANDARD_ODD_STATUS";
// 这个是为了赛果二级菜单 有一个 骨架屏显示
export const EMIT_SUB_LOADING_RESULT = "EMIT_SUB_LOADING_RESULT";
//
export const EMIT_TO_MAINTENANCE = "EMIT_TO_MAINTENANCE";

// 调用用户接口，更新 域名流程
export const EMIT_SET_GETUSERINFO_OSS_API = "EMIT_SET_GETUSERINFO_OSS_API";
//
export const EMIT_UNFOLD_CHANGED = "EMIT_UNFOLD_CHANGED";
// 没有轮播图和没有赛事时触发事件
export const EMIT_MAY_ALSO_LIKE_CHANGE = "EMIT_MAY_ALSO_LIKE_CHANGE";
//
export const EMIT_ANIMATE_RESET_MYSCROLL_TOP = "EMIT_ANIMATE_RESET_MYSCROLL_TOP";
// 赛事级别关盘;直接清空;is_no_data 为 false;
export const EMIT_RESET_MYSCROLL_TOP = "EMIT_ANIMATE_RESET_MYSCROLL_TOP";

// 首页轮播展示默认banner事件
export const EMIT_SHOW_DEFAULT_BANNER_EVENT = "EMIT_SHOW_DEFAULT_BANNER_EVENT";
// 用户已经成功登录
export const EMIT_USER_LOGON_OK_EVENT = "EMIT_USER_LOGON_OK_EVENT";
// 触发首页跳转
export const EMIT_HOME_TAB = "EMIT_HOME_TAB";
export const EMIT_MAIN_LIST_MATCH_IS_EMPTY = "EMIT_MAIN_LIST_MATCH_IS_EMPTY";
// 到底了
export const EMIT_MAIN_LIST_MAX_HEIGHT = "EMIT_MAIN_LIST_MAX_HEIGHT";
// 赛事列表回到顶部
export const EMIT_GOT_TO_TOP = "EMIT_GOT_TO_TOP";
// 快捷切换是否禁用
export const EMIT_IS_SHOW_MASK = "EMIT_IS_SHOW_MASK";
// 显示 骨架图
export const EMIT_SHOW_SKELETON_DIAGRAM = "EMIT_SHOW_SKELETON_DIAGRAM";
/**
 * 触发toast弹框
 */
export const EMIT_SHOW_TOAST_CMD = "EMIT_SHOW_TOAST_CMD";

// 重新监听新的赛事列表
export const EMIT_HANDLE_START_OBSERVER = "EMIT_HANDLE_START_OBSERVER";


export const EMIT_IFRAME_VIDEO_VOLUME = "EMIT_IFRAME_VIDEO_VOLUME";
export const EMIT_EVENT_DATA = "EMIT_EVENT_DATA";
export const TOGGLE_COLLECT_LEAGUE = "TOGGLE_COLLECT_LEAGUE";
export const EMIT_COLLECT_MATCH_OZ = "EMIT_COLLECT_MATCH_OZ";

// 限额
export const EMIT_REF_DATA_BET_MONEY = "EMIT_REF_DATA_BET_MONEY"
// 投注弹窗显示
export const EMIT_REF_SHOW_BET_BOX = "EMIT_REF_SHOW_BET_BOX"
// 菜单切换
export const EMIT_MENU_ANIMATION = "EMIT_MENU_ANIMATION"

// 详情盘口一键折叠
export const EMIT_DETAILS_TOGGLE_HANDICAP= "EMIT_DETAILS_TOGGLE_HANDICAP"

// 投注列表切换
export const EMIT_BET_RECORD_SELECTED_CHANGE= "EMIT_BET_RECORD_SELECTED_CHANGE"

// 提前结算列表金额变化
export const EMIT_EARLY_MONEY_LIST_CHANGE= "EMIT_EARLY_MONEY_LIST_CHANGE"
//------------------------------------------------------------------命令定义-E-------------------------------------------------------------------------------------
// 切换主题
export const EMIT_THE_THEME_CHANGE = "EMIT_THE_THEME_CHANGE"

// 滑动菜单点击
export const EMIT_SCROLL_TOP_NAV_CHANGE = "EMIT_SCROLL_TOP_NAV_CHANGE"
// 滑动 时间 获取的数据
export const EMIT_SCROLL_DATE_TIME_CHANGE = "EMIT_SCROLL_DATE_TIME_CHANGE"

// 菜单左键回退
export const EMIT_MENU_GO_BACK = "EMIT_MENU_GO_BACK"

// 串关键盘变动金额
export const EMIT_INPUT_BET_MONEY = "EMIT_INPUT_BET_MONEY"

// 单关键盘变动金额
export const EMIT_INPUT_BET_MONEY_SINGLE = "EMIT_INPUT_BET_MONEY_SINGLE"

// 清除投注样式
export const EMIT_CLEAR_SCORE_ACTIVE = "EMIT_CLEAR_SCORE_ACTIVE"

// WS驱动详情
export const EMIT_DATAWARE_DETAIL_UPDATE = "EMIT_DATAWARE_DETAIL_UPDATE"
// 用于C106投注项红绿升级
export const EMIT_SET_BET_WS_C106_CHANGE = "EMIT_SET_BET_WS_C106_CHANGE"

// 欧洲版侧面菜单组件left-menu 球种切换
export const EMIT_OUZHOU_LEFT_MENU_CHANGE = "EMIT_OUZHOU_LEFT_MENU_CHANGE"

// 欧洲版赛果搜索跳转详情操作
export const EMIT_GO_TO_DETAIL_HANDLE = "EMIT_GO_TO_DETAIL_HANDLE"

// 菜单数量变更
export const EMIT_SET_BESE_MENU_COUNT_CHANGE = "EMIT_SET_BESE_MENU_COUNT_CHANGE"

// websocket链接状态变化
export const EMIT_WS_STATUS_CHANGE_EVENT  = 'EMIT_WS_STATUS_CHANGE_EVENT'

//ws链接数据
export const EMIT_MATCH_DETAIL_SOCKET  = 'EMIT_MATCH_DETAIL_SOCKET'

// 初始化 滑块值 app-h5
export const EMIT_INIT_SLIDER_CONFIG  = 'EMIT_INIT_SLIDER_CONFIG'
