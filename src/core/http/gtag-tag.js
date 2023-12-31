/***/
//  应有引入的方法
import { SessionStorage } from "src/output/module/constant-utils-common.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { htmlVariables } = BUILDIN_CONFIG;
function gtag_config_send(user_id) {
  // 设置默认启动参数
  // GA 埋点开关开启---照常统计，和生产环境保持一致
  window.gtag_run = 1;
  try {
    let url_search = SEARCH_PARAMS.init_param;
    // 获取诸葛埋点开关
    let gtag = url_search.get("gtag");
    if (gtag) {
      // 设置诸葛埋点开关
      window.gtag_run = 1;
    }
  } catch (error) {
    console.error(error);
  }
  // 诸葛埋点开关关闭时,直接终止
  if (!window.gtag_run) {
    return;
  }
  if (user_id) {
    // 设置用户ID持久化
    SessionStorage .set("user_id", user_id);
  } else {
    // user_id无效时情况上次的缓存
    SessionStorage .set("user_id", "");
    return;
  }
  if (!window.INIT_GTAG && window.gtag_run) {
    // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
    //   return;
    // }
    // 初始化埋点信息
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    // 配置埋点信息
    window.gtag("config", htmlVariables.GA_TRACKING_ID, { user_id });
    // 设置埋点是否已经配置过
    window.INIT_GTAG = true;
  }
}

/**
 * @description: 埋点发送网页跟踪信息
 * @param {*} title 网页的标题（例如“首页”）
 * @param {*} path 网址的路径部分。此值应以斜杠 (/) 字符开头
 * @return {*}
 */
function gtag_view_send(title, path) {
  let user_id = SessionStorage .get("user_id");
  if (user_id && window.gtag_run) {
    // 初始化埋点Google Analytics GA_TRACKING_ID config配置
    if (!window.INIT_GTAG) {
      this.gtag_config_send(user_id);
    }
    // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
    //   return;
    // }
    // 埋点发送网页跟踪信息
    window.gtag("config", htmlVariables.GA_TRACKING_ID, {
      page_title: title, // 'homepage',
      page_path: path, // '/home'
      user_id, // 用户信息
    });
  }
}
/**
 * @description: 埋点发送事件跟踪信息
 * @param {*} action 事件报告中显示为事件操作的字符串
 * @param {*} category 显示为事件类别的字符串
 * @param {*} label 显示为事件标签的字符串
 * @param {*} value 显示为事件价值的非负整数
 * @return {*}
 */
function gtag_event_send(action, category, label, value) {
  let user_id = SessionStorage .get("user_id");
  if (user_id && window.gtag_run) {
    // 初始化埋点Google Analytics GA_TRACKING_ID config配置
    if (!window.INIT_GTAG) {
      this.gtag_config_send(user_id);
    }
    // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
    //   return;
    // }
    // 埋点发送事件跟踪信息
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      user_id, // 用户信息
      value,
    });
  }
}

const GATAG={
  gtag_config_send,
  gtag_view_send,
  gtag_event_send,
};


export    default  GATAG