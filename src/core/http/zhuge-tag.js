import { get } from "lodash-es";

// const {config} =useGlobelConfig();
const {
  zhuge_config = {
    js_url: "https://updata.yaohuakuo.com/zhuge.js?v=",
    mid: [],
    app_key: "",
  },
  platform,
} = config || {};
//platform 看怎么存吧
/**
 * @description: zhuge埋点identify方法
 * @param {*} user_id
 * @param {*} obj
 * @return {*}
 */
export function zhuge_identify(user_id, obj = {}) {
  if (window.zhuge_run && window.zhuge && user_id) {
    // 自定义属性
    // 增加设备标识

    //platform 看怎么存吧
    obj.type = platform == "pc" ? "pc" : "mobild";
    // 识别用户
    window.zhuge.identify(user_id, obj);
  } else if (!user_id) {
    // 阻止zhuge埋点事件发送
    window.zhuge_run = 0;
  }
}

/**
 * @description: zhuge埋点track方法
 * @param {*} eventLabel
 * @param {*} obj
 * @return {*}
 */
export function zhuge_track(eventLabel, obj = {}) {
  if (window.zhuge_run && window.zhuge) {
    // 自定义事件
    window.zhuge.track(eventLabel, obj);
  }
}
/**
 * @Description 发送诸葛埋点事件----添加新的事件用这个方法
 * @param {string} eventLabel 事件标签名称
 * @param {undefined} eventPropsObj 要加的参数
 */
export function send_zhuge_event(eventLabel, eventPropsObj = {}) {
  let vx_get_user = store.getters.get_user;
  let objKey = {
    clickTime: "点击时间",
    userName: "用户名",
    userId: "用户ID",
    merchantId: "商户ID",
    languageVersion: "语言版本",
    terminal: "访问终端",
    eventLabel: "事件标签",
  };
  let _obj = {
    [objKey.eventLabel]: eventLabel,
    [objKey.clickTime]: new Date().Format("yyyy-MM-dd hh:mm:ss"),
    [objKey.userName]: get(vx_get_user, "userName"),
    [objKey.userId]: get(vx_get_user, "userId"),
    [objKey.merchantId]: get(vx_get_user, "mId"),
    [objKey.languageVersion]: get(vx_get_user, "languageName"),
    [objKey.terminal]: "PC",
  };
  Object.assign(_obj, eventPropsObj);
  console.log(eventLabel, _obj);
  zhuge_track(eventLabel, _obj);
}
/**
 * @description: zhuge埋点setSuperProperty方法(设置事件通用属性)
 * @param {*} obj 通用属性
 * @return {*}
 */
export function zhuge_setSuperProperty(obj = {}) {
  if (window.zhuge_run && window.zhuge) {
    // 设置事件通用属性
    window.zhuge.setSuperProperty(obj);
  }
}

/**
 * @description: 加载诸葛sdk JS
 * @param {*} mid 商户id
 * @return {*}
 */
export function zhuge_load_sdk_js(mid = 0) {
  // 设置默认启动参数
  window.zhuge_run = mid && zhuge_config.mid.includes(mid);
  try {
    let url_search = new URLSearchParams(location.search);
    // 获取诸葛埋点开关
    let zhuge = url_search.get("zhuge");
    if (zhuge) {
      // 设置诸葛埋点开关
      window.zhuge_run = 1;
    }
  } catch (error) {
    console.error(error);
  }
  // 诸葛埋点开关关闭时,直接终止
  if (!window.zhuge_run) {
    return;
  }
  if (window.zhuge) return;
  window.zhuge = [];
  window.zhuge.methods =
    "_init identify track trackRevenue getDid getSid getKey setSuperProperty setUserProperties setWxProperties setPlatform".split(
      " "
    );
  window.zhuge.factory = function (b) {
    return function () {
      var a = Array.prototype.slice.call(arguments);
      a.unshift(b);
      window.zhuge.push(a);
      return window.zhuge;
    };
  };
  for (var i = 0; i < window.zhuge.methods.length; i++) {
    var key = window.zhuge.methods[i];
    window.zhuge[key] = window.zhuge.factory(key);
  }
  window.zhuge.load = function (b, x) {
    if (!document.getElementById("zhuge-js")) {
      var a = document.createElement("script");
      var verDate = new Date();
      var verStr =
        verDate.getFullYear().toString() +
        verDate.getMonth().toString() +
        verDate.getDate().toString();

      a.type = "text/javascript";
      a.id = "zhuge-js";
      a.async = !0;
      a.src = zhuge_config.js_url + verStr;
      a.onerror = function () {
        window.zhuge.identify = window.zhuge.track = function (
          ename,
          props,
          callback
        ) {
          if (
            callback &&
            Object.prototype.toString.call(callback) === "[object Function]"
          ) {
            callback();
          } else if (
            Object.prototype.toString.call(props) === "[object Function]"
          ) {
            props();
          }
        };
      };
      var c = document.getElementsByTagName("script")[0];
      c.parentNode.insertBefore(a, c);
      window.zhuge._init(b, x);
    }
  };
  // 测试环境的key    c41f8b7cb97640838d90a73a0f077a43
  // 生产环境的key    5a0301efe0244733acb0488763592a6b
  window.zhuge.load(get_zhuge_config_obj().app_key, {
    //配置应用的AppKey-----替换为生产环境的Key
    superProperty: {
      //全局的事件属性(选填)
      应用名称: "paDataTest",
    },
    // debug: true,
    adTrack: false, //广告监测开关，默认为false
    zgsee: false, //视屏采集开关，默认为false
    autoTrack: true, //启用全埋点采集（选填，默认false）
    singlePage: true, //是否是单页面应用（SPA），启用autoTrack后生效（选填，默认false）,
    duration: false, //页面停留时长采集开关，默认为false
  });
}

// // 获取不同环境的商户id
// export function get_zhuge_config_obj() {
//   let zhuge_obj = { app_key: "", mid: "" };
//   // 测试环境的key    c41f8b7cb97640838d90a73a0f077a43
//   // 生产环境的key    5a0301efe0244733acb0488763592a6b
//   try {
//     switch (window.env.config.current_env) {
//       case "local_dev": // 开发
//         break;
//       case "local_test": // 测试
//         zhuge_obj.app_key = "c41f8b7cb97640838d90a73a0f077a43";
//         // 1534069625510301696  统计时长，不统计埋点事件
//         zhuge_obj.mid = ["1500802482958372864", "1534069625510301696"];
//         break;
//       case "idc_pre": // 预发布
//         break;
//       case "idc_sandbox": // 试玩
//         break;
//       case "idc_lspre": // 隔离预发布
//         zhuge_obj.app_key = "c41f8b7cb97640838d90a73a0f077a43";
//         zhuge_obj.mid = ["1534076760197566464", "1534076609261342720"];
//         break;
//       case "idc_online": // 生产
//         zhuge_obj.app_key = "5a0301efe0244733acb0488763592a6b";
//         // 欧宝  1261540827428163584
//         // KK  1452621933433720832
//         // 亚盈  1452623150704627712
//         // 88   1460568356368289792
//         // 皇冠  1460568527676248064
//         // BET365  1474704940109795328
//         zhuge_obj.mid = [
//           "1261540827428163584",
//           "1452621933433720832",
//           "1452623150704627712",
//           "1460568356368289792",
//           "1460568527676248064",
//           "1474704940109795328",
//         ];
//         break;
//       case "idc_ylcs": // 微型测试
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     console.error("get_zhuge_mid: ", error);
//   }
//   return zhuge_obj;
// }

export default {
  zhuge_identify,
  zhuge_track,
  send_zhuge_event,
  zhuge_setSuperProperty,
  zhuge_load_sdk_js,
};
