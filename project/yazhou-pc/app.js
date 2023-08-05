import { ref } from "vue";
import { http, AllDomain } from "src/core/http/";
import { api_match } from "/src/api/index.js";
// import store from "./src/store-redux-vuex/index.js";
import STANDARD_KEY from "src/core/standard-key";
import { ss } from "src/core/utils/web-storage";
import { loadLanguageAsync } from "./src/boot/i18n";
const token_key = STANDARD_KEY.get("token");
/**
 * 获取用户信息
 */
const handle_user_tryPlay = async () => {
  let token = ss.get(token_key);
  if (!token) {
    let res = await api_match.handle_user_tryPlay();
    let obj = res?.data?.data || {};
    token = obj.token;
    ss.set(token_key, token);
  } else {
    // 获取用户信息
    try {
      let res = await api_match.handle_getUserInfo();
      let obj = res?.data?.data || {};
      store.dispatch({
        type: "SETUSER",
        data: obj,
      });
    } catch (error) {}
  }
  console.log("token-111", token);
};
const init_load = ref(false);
const init_domain = async (config) => {
  try {
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
      //  SDK
      if (config) {
        let { token, tryPlay } = config;

        if (config.token) {
          ss.set(token_key, token);
        } else {
          // 调用接口，获取token
          handle_user_tryPlay();
        }
        if (config.call_back) {
          if (typeof config.call_back == "function") {
            config.call_back();
          }
        }
      } else {
        handle_user_tryPlay();
      }
      // http初始化方法 会调用 setApiDomain
      http.init();
    });
    AllDomain.run();
  }
};
export { init_load, init_domain };
