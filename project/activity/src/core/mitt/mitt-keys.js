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

export const EMIT_SHOW_ALERT_CMD = "EMIT_SHOW_ALERT_CMD";
export const EMIT_MENU_CHANGE_CMD = "EMIT_MENU_CHANGE_CMD";
export const EMIT_WINDOW_RESIZE = "EMIT_WINDOW_RESIZE";
export const EMIT_GO_TO_VENDER = "EMIT_GO_TO_VENDER";
export const EMIT_DOMAIN_ERROR_ALERT = "EMIT_DOMAIN_ERROR_ALERT";
export const EMIT_INDEX_REFRESH_END = "EMIT_INDEX_REFRESH_END";
export const EMIT_TO_MAINTENANCE = "EMIT_TO_MAINTENANCE";
export const EMIT_SHOW_TOAST_CMD = "EMIT_SHOW_TOAST_CMD";
export const EMIT_SITE_TAB_ACTIVE = "EMIT_SITE_TAB_ACTIVE";