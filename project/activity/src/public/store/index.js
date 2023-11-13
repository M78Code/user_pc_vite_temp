/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 持久化数据入口
 */
//socket
import websocket from "src/public/store/module/websocket/websocket.js";
//global
import global from "src/public/store/module/global/global.js";
// 用户信息
import user from "src/public/store/module/user/index.js";
//投注记录
import bet_record from "src/public/store/module/bet_record/bet_record.js";
// 投注列表
import betting_list from "src/public/store/module/betting_list/betting_list.js";
//搜索
import search from "src/public/store/module/search/search.js";
//布局相关
import layout from "src/public/store/module/layout/layout.js";
//联赛
import filter from "src/public/store/module/filter/filter_store";
// 赔率转换
import odds_conversion from "src/public/store/module/odds_conversion/odds_conversion.js";
// 菜单
import main_menu from "src/public/store/module/main_menu/main_menu.js";
// 赛事详情
import match_details from "src/public/store/module/match_details/index";
//语言
import languages from "src/public/store/module/languages/languages.js"
//主题
import theme from "src/public/store/module/theme/theme.js";
// 聊天室
import chatroom from "src/public/store/module/chatroom/chatroom.js";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export default {
  global,
  betting_list,
  main_menu,
  layout,
  websocket,
  user,
  bet_record,
  search,
  filter,
  odds_conversion,
  match_details,
  languages,
  theme,
  chatroom,
};
