import { ref, watch, computed } from "vue";
import { http, AllDomain } from "src/core/http/";
import { GetUrlParams } from "src/core/utils/";

import { api_match } from "/src/api/index.js";
// import store from "./src/store-redux-vuex/index.js";
import STANDARD_KEY from "src/core/standard-key";
import { ss } from "src/core/utils/web-storage";
import { loadLanguageAsync } from "./src/boot/i18n";
import { useRouter } from "vue-router";
import base_data from "src/core/utils/base-data/base-data.js";
const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
const token_key = STANDARD_KEY.get("token"); //token键
const init_load = ref(false); //用于加载是否完成
const router = useRouter(); //路由器
const url_params = GetUrlParams(); //获取url参数

//动画逻辑 靠后


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
/**
 * 监听路由变化设置全局
 */
watch(
  () => router.currentRoute,
  (cur_router) => {
    const { to, from } = cur_router || {};
    console.log(to, from);
    if (_to != _from) {
      // this.vx_set_layout_cur_page({
      //   cur: _to,
      //   from: _from,
      //   from_path:cur_router.path,
      // });
    }
    console.log("watch", newValue);
  },
  { immediate: true }
);
console.log("测试执行------------1----3");
// 资源文件加载时,避免强缓存使用的rdm参数值
window.src_rdm = Date.now();
const init_domain = async (config) => {
  try {
    // 设置是否是内嵌iframe
    // 设置商户分割信息
    //  let gr = ss.get('gr')
    //  if(gr){
    //    window.env.config.gr = gr.toLocaleUpperCase();
    //  } else {
    //    window.env.config.gr = 'COMMON';
    //  }
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
      if (!init_load.value) {
          // http初始化方法 会调用 setApiDomain
          http.init();
        }
      // ws和http域名切换逻辑
      http.setApiDomain();
  init_load.value=true;

      // 首次初始化时调用
        handle_user_tryPlay();
      // 元数据初始化
      base_data.init();
    });
    AllDomain.run();
  }
};
export { init_load, init_domain };
