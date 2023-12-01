// 用户信息
import user from "project/activity/src/store/module/user/index.js.js";
//语言
import languages from "project/activity/src/store/module/languages/languages.js.js"
//主题
import theme from "project/activity/src/public/store/module/theme/theme.js";
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export default {
  languages,
  theme,
  user,
};
