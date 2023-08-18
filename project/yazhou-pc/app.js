import { ref, watch, computed } from "vue";
import { http, AllDomain } from "src/core/http/";
import { GetUrlParams } from "src/core/utils/";
import { get_user_info } from "src/store-redux/module/user-info.js";
import store from "src/store-redux/index.js";

import { api_match } from "src/api/index.js";

import STANDARD_KEY from "src/core/standard-key";
import { ss } from "src/core/utils/web-storage";
import { loadLanguageAsync } from "./src/boot/i18n";
import base_data from "src/core/utils/base-data/base-data.js";
const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
const token_key = STANDARD_KEY.get("token"); //token键
const init_load = ref(false); //用于加载是否完成
const url_params = GetUrlParams(); //获取url参数
//动画逻辑 靠后
/**
 * 获取用户信息
 */
const handle_user_tryPlay = async () => {
  let token = ss.get(token_key, url_params.token);
  if (!token) {
    //试玩登录
    let res = await api_match.handle_user_tryPlay();
    let obj = res?.data?.data || {};
    token = obj.token;
    ss.set(token_key, token);
    store.dispatch(get_user_info(token));
  } else {
    store.dispatch(get_user_info(token));
  }
};
console.log("测试执行------------1----3");
// 资源文件加载时,避免强缓存使用的rdm参数值
window.src_rdm = Date.now();
const init_domain = async (config) => {
  try {
    // 设置是否是内嵌iframe
    // 设置商户分割信息
    BUILDIN_CONFIG.DOMAIN_RESULT.gr = ss.get("gr", "COMMON");
    // 设置商户样式
    if (top.location != location) {
      if (
        DEFAULT_VERSION_NAME == "zhuanye" &&
        url_params.ignore_iframe_pc == 1
      ) {
        ss.set("hide_logo_icon", "1");
      }
    } else {
      ss.set("hide_logo_icon", "0");
    }
    // 这里最好是 url 内的 语种 ，不过 兜底语言是中文 因此 这里设置中文
    // 后面如果确实有需要就自己处理 。目前这个是兼容某些异常场景下 接口先返回来回
    // 文件后返回回来 的显示异常，不管 前端缓存，资源文件丢失的场景，生产无此场景
    let languageName = "zh";
    await loadLanguageAsync(languageName);
  } catch (error) {
  } finally {
    console.log(" init_domain --  开始执行:");
    // 实例化域名检测类对象
    AllDomain.create(() => {
      // 首次进入,发现最快的域名
      console.log(" init_domain -- 回调执行:");
      // http初始化方法 会调用 setApiDomain
      // ws和http域名切换逻辑
      http.setApiDomain();
      // 首次初始化时调用
      handle_user_tryPlay();
      // 元数据初始化
      base_data.init();
      init_load.value = true;
    });
    AllDomain.run();
  }
};
export { init_load, init_domain };
