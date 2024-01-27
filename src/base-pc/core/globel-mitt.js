import { http, AllDomain } from "src/core/http/";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { LocalStorage, SessionStorage } from 'src/core/utils/common/module/web-storage.js'
import { onBeforeUnmount } from "vue";
import { throttle } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { NODE_ENV, TAG, PRO_ARR } = BUILDIN_CONFIG;
import STANDARD_KEY from "src/core/standard-key/";
import UserCtr from "src/core/user-config/user-ctr.js";

const token_key = STANDARD_KEY.get("token");
// import store from "src/store-redux-vuex/index.js";
// let state = store.getState();
let api_cmd_data;
/** 抖动处理 触发切网络api域名动作 重新设置api域名函数
 * @description:
 * @param {undefined}  data 消息体
 * @return {undefined} undefined
 */
const resetApiDemo = throttle(
  (data) => {
    // 如果用户失效,ws停止请求

    //let token = SessionStorage .get(token_key);
    if (data && !SessionStorage.get(token_key)) {
      return;
    }
    console.log("触发切网络api域名动作", data);
    // 错误上报相关
    if (data && (data.type == "http" || data.type == "ws")) {
      if (typeof data.data == "string") {
        try {
          // 字符串转json对象数据
          data.data = JSON.parse(data.data);
        } catch (error) {
          console.error("resetApiDemo:", error);
        }
      }
      api_cmd_data = { time: new Date().getTime(), data };
    } else {
      api_cmd_data = { time: new Date().getTime(), data };
    }
    // 切换可用的api域名
    AllDomain.auto_set_domain_event();
  },
  12000,
  { leading: true, trailing: true }
);

/**
 * @description: 发送用户配置收集信息到服务器
 */
const send_user_pro_info = () => {
  if (NODE_ENV == "development") {
    // 是开发环境时直接返回
    return;
  }
  // 获取用户上次发消息的时间
  let time = LocalStorage.get("s_user_info_time");
  // 24小时内只发送一次消息,到服务器
  if (time && new Date().getTime() - time * 1 < 1 * 24 * 60 * 60 * 1000) {
    return;
  }
  // 定义需要提交参数的变量
  let lang = "";
  let accessToken = "";
  let userInfo = null;
  if (window.vue) {
    // 获取语种
    if (window.vue.lang) {
      lang = window.vue.lang;
    }
    // 获取token
    try {
      accessToken = UserCtr.user_token;
    } catch (e) {
      console.error(e);
    }
    if (!accessToken) accessToken = "";
    // 获取用户信息
    try {
      userInfo = UserCtr.user_info;
    } catch (e) {
      console.error(e);
    }
    if (!userInfo) userInfo = null;
  }
  let project_name = "";
 
  // 拼装需要提交的数据
  let data = {
    config: BUILDIN_CONFIGg, // 所有配置信息
    env: CURRENT_ENV, // 环境信息 ，  可选值： local_dev  ，local_test，local_ylcs，idc_pre，idc_sandbox，idc_lspre，idc_online
    projectHref: location.href, // 当前项目的 url  , 例如 https://user-pc.35ri3g.com/#/home  ，有什么 拿什么 不一定带token ,页面的 哈希路径一定 要带上  location.href
    projectInfo: { final_type: project_name }, // 项目信息对象内 必须有一个字段 final_type :  取值范围 ： [  'pc-zhuanye',  'h5-xinban', 'h5-jiuban' ]
    userInfo: userInfo, // 用户信息 对象   user/getUserInfo  这个接口返回的 对象  ，包含商户的一些配置
    userToken: SessionStorage.get("pc_token"), // 用户的token
    tag: TAG, // 项目的tag版本号
    lang: lang, // 当前用户的选择的页面展示语言
    description: "", // 描述自己附加的描述信息,便于分析问题
    projectType: "pc", //项目类型  小写  h5 ,pc
    isInIframe: top.location != location, // 是否 处于内嵌 ，pc  专用
    isInApp: false, //是否 是 包网 app 内 webview  ，能确定就传 ，不能就不传
    other: {}, // 扩展字段  对象
  };
  // 发送数据到服务器
  axios_instance.post(http.HTTP_PRO_INFO_API, data).then((res) => {
    // 更新本次次发消息的时间
    LocalStorage.set("s_user_info_time", new Date().getTime());
    console.log("发送成功");
  });
};

/**
 * @description: 发送错误信息api到服务器
 */
const send_api_error_data = throttle(
  (object) => {
    // 发送api域名全部不可用通知
    useMittEmit(MITT_TYPES.EMIT_APIS_DOMAIN_ALL_BAD);
    if (NODE_ENV == "development") {
      // 是开发环境时直接返回
      return;
    }
    if (api_cmd_data && api_cmd_data.data.type == "ws") {
      // ws断开推送消息的直接返回
      return;
    }
    // 定义需要提交的信息字段
    let lang = "";
    let accessToken = "";
    let userInfo = null;
    let errorApi = null;
    let apiStatus = null;

    if (window.vue) {
      // 获取语言
      if (window.vue.lang) {
        lang = window.vue.lang;
      }
      // 获取token
      try {
        // 从用户信息中获取token
        accessToken = UserCtr.user_token
      } catch (e) {
        console.error(e);
      }
      if (!accessToken) accessToken = "";
      // 获取用户信息
      try {
        userInfo = UserCtr.user_info
      } catch (e) {
        console.error(e);
      }
      if (!userInfo) userInfo = null;

      // 获取提交的错误信息
      if (api_cmd_data) {
        if (new Date().getTime() - api_cmd_data.time < 25 * 1000) {
          console.log("api_cmd_data.data==", api_cmd_data.data);
          if (api_cmd_data.data) {
            errorApi = api_cmd_data.data;
          }
        }
      }

      // 获取api域名信息
      apiStatus = object || LocalStorage.get(AllDomain.DOMAIN_API);
    }
    // 拼装需要提交的数据
    let data = {
      env: CURRENT_ENV, // 环境信息 ，  可选值： local_dev  ，local_test，local_ylcs，idc_pre，idc_sandbox，idc_lspre，idc_online
      tag: TAG, // git tag
      projectHref: location.href, // 当前项目的 url  , 例如 https://user-pc.35ri3g.com/#/home  ，有什么 拿什么 不一定带token ,页面的 哈希路径一定 要带上  location.href
      projectInfo: PRO_ARR, // 项目信息 对象
      config: BUILDIN_CONFIG, // 所有配置信息
      userInfo: userInfo, // 用户信息 对象  ，  //  user/getUserInfo  这个接口返回的 对象  ，包含商户的一些配置
      userToken: SessionStorage.get("pc_token"), //用户 的  token
      apiStatus: apiStatus, // 目前页面上 允许的请求 域对象  以及   各自目前的  状态 延迟信息
      lang: lang, // 当前用户的 选择 的 页面展示语言
      description: "", // 描述  ，自己 附加的  描述信息 ，便于分析问题
      errorApi: http.HTTP_ERROR_API_ERR_DATA, //  最终由哪个 api 接口 引起的   错误 上报     {  url:'' , params:'' ,method:''   }
      module: "h5-api-domain", //  报错模块信息
      projectType: "pc", //项目类型  小写  h5 ,pc
      isInIframe: top.location != location, //是否 处于内嵌 ，
      isInApp: false, // 是否 是 包网 app 内 webview  ，能确定就传 ，不能就不传
      returnCitySN: "", // 用户位置信息
    };
    // 发送数据到服务器
    axios_instance.post(http.HTTP_ERROR_API, data).then((res) => {
      console.log("发送成功");
    });
  },
  10 * 1000,
  {
    leading: true,
    trailing: true,
  }
);
// 接受ws断开命令

useMittOn(MITT_TYPES.EMIT_API_DOMAIN_UPD_CMD, resetApiDemo)
useMittOn(// 发送用户基本信息到服务命令
  MITT_TYPES.EMIT_API_USER_PRO_INFO_CMD,
  send_user_pro_info
)
// 调用用户接口，更新 域名流程
useMittOn(MITT_TYPES.EMIT_SET_GETUSERINFO_OSS_API, (oss_) => {
  AllDomain.set_getuserinfo_oss(oss_);
})

