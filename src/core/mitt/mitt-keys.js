/*
 * @Author: jiffy
 * @Date: 2023-08-02 16:35:21
 * @LastEditTime: 2023-08-02 16:58:01
 * @LastEditors: jiffy
 * @Description: 说明
 *
 */





 



/** websocket发送消息命令 */
export const EMIT_DOMAIN_ERROR_ALERT = 'EMIT_DOMAIN_ERROR_ALERT';
/** 显示注单历史 */
export const EMIT_CHANGE_RECORD_SHOW = "EMIT_CHANGE_RECORD_SHOW";
// 触发窗口尺寸变化
export const EMIT_WINDOW_RESIZE = "EMIT_WINDOW_RESIZE";
/** 发送底部菜单变化命令 */
export const EMIT_MENU_CHANGE_FOOTER_CMD = 'MENU_CHANGE_FOOTER_SCMD';
// 倒计时开始结束
export const EMIT_COUNTING_DOWN_START_ENDED = "EMIT_COUNTING_DOWN_START_ENDED";
// 监听页面可见性，当页面不可见时关闭视频声音一级关闭ws推送 , 当可见时恢复
export const EMIT_VISIBILITYCHANGE_EVENT = "EMIT_VISIBILITYCHANGE_EVENT";