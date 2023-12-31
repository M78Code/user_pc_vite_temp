/*
 * @Author: success
 * @Date: 2023-07-28
 * @Description: 公共axios操作类http定义
 */
import axios from "axios";
import { get } from "lodash";
import { wslog } from "../log/";
import AxiosiInterceptors, { ParseUrl } from "./axios-interceptors"; //拦截器
import { compute_request_config_by_config } from "./debounce-module/";
import { usePageVisibilityChange } from "src/core/utils/common/module/event-hook.js";
import domain from "./domain";
 
// 本次打包的 客户端版本
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { BUILD_VERSION, CURRENT_ENV ,PROJECT_NAME ,IS_PC,API_PREFIX,API_PREFIX_WBSOCKET} = BUILDIN_CONFIG ;

import { SessionStorage ,LocalStorage} from "src/output/module/constant-utils-common.js"
// import ws from "../ws/ws.js";

import STANDARD_KEY from "src/core/standard-key";

const token_key = STANDARD_KEY.get("token"); 

/**
 * 页面隐藏时间 纪录
 */
let DOCUMENT_HIDDEN = 0;
usePageVisibilityChange(
  () => {
    DOCUMENT_HIDDEN = 0;
  },
  () => {
    DOCUMENT_HIDDEN = Date.now();
  }
);

/**
 * 去掉 api 参数 reload
 */
function force_current_api_flow_use_oss_file_api_reload() {
  return;
  let url_search = new URLSearchParams(location.search);
  //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
  url_search.set("rdm", new Date().getTime());
  // 删除  api
  url_search.delete("api");
  console.log("new url 1", new URL(location.href));
  console.log();
  // 旧的哈希  兼容   #/home?rdm=1660636891118 这种形式处理
  let old_hash = location.hash;
  // 新的 哈希
  let new_hash = "";
  if (!old_hash) {
    new_hash = "";
  } else {
    if (old_hash.includes("?")) {
      new_hash = old_hash.split("?")[0];
    } else {
      // '#/home'
      new_hash = old_hash;
    }
  }
  // 新的 搜索参数
  let new_search = url_search.toString();
  // 新的 url
  let new_url = location.origin + "?" + new_search + new_hash;
  console.log("new_url-", new_url);
  // 这里因为版本不一致 ，无论如何都重定向 刷新
  location.replace(new_url);
}
class AxiosHttp {
  constructor() {
    // api访问数量(每分钟)
    this.request_count = 0;
    // http root domain
    this.HTTP_ROOT_DOMAIN = "";
    this.HTTP_UPLOAD_API = "";
    // axios 实例
    this.axios_instance = null;
    // 页面 失去 焦点后  HTTP 断开时间
    this.DOCUMENT_HIDDEN_HTTP_CLOSE_TIME = 5 * 60 * 1000;
    // this.init();
  }
  /**
   * @Description:初始化网络配置信息
   * @Author success
   * @param:
   * @return:
   * @Date 2020/08/29 20:43:22
   */
  init(opts = {}) {
    this.axios_instance = axios.create({
      headers: this.getDefaultHeaders(),
    });
    this.request_count = 0;
    clearInterval(this.request_count_timer);
    //每分钟上报 请求次数
    this.request_count_timer = setInterval(() => {
      wslog.send_msg("HTTP-S:", { request_count: this.request_count });
      this.request_count = 0;
    }, 60 * 1000);
    //明确声明超时错误
    this.axios_instance.defaults.timeout = 10000;
    this.axios_instance.defaults.transitional.clarifyTimeoutError = true;
    //设置ROOT_DOMAIN
    this.setApiDomain();
    //设置interceptors hook 拦截器
    this.interceptorsHook();
  }
  // 默认头信息传参对象集合 固定 的
  getDefaultHeaders() {
    // 系统类型缩写： iphone=4 android=3 PC = 2 H5=1
    // panda-bss-info传参规则： panda-bss-info:"source:4"  内嵌webview panda-bss-info:"source:4,1"
    // 设置系统类型缩写
    return {
      "request-code": JSON.stringify({
        "panda-bss-source": IS_PC? "2" : "1",
      }),
    };
  }
  /**
   * 设置   ROOT_DOMAIN
   */
  set_root_domain() {
    // 新逻辑这里只会有一个
    let api_domain = get(BUILDIN_CONFIG, 'DOMAIN_RESULT.first_one')
    // if (window.env.NODE_ENV != "development") {
    //   this.axios_instance.defaults.baseURL = api_domain;
    // }
    // 38913	一般	高	缺陷	【日常】【生产】【PC】Y0商户偶现关机/重启后，首次跳转我们场馆，页面展示异常，显示网络不给力
    //  这个bug 产生原因是 safari 浏览器 强缓存页面导致 。 页面走不了 域名判定流程 ，在挂机启动的时候，初始化没有走域名判定流程
    // 如果没有最快的最优域名 也没有 弹出 token失效的 弹窗,直接走到了这里的 主程序请求流程
    // console.log("api_domain", api_domain);
    if (!api_domain) {
      //session 缓存的 是否 因为设置页面API 域名错误 刷新过
      let has_reload = SessionStorage .get("set_root_domain_error_force_reload");
      console.log("has_reload", has_reload);
      //不清楚，页面强缓存，唤醒的时候 session 是否还存在
      if (!has_reload) {
        // 只做一次尝试  ，直接走OSS 文件 流程  ，刷新页面  ，不能多次 避免 异常情况下 无限刷新
        SessionStorage .set("set_root_domain_error_force_reload", "1");
        force_current_api_flow_use_oss_file_api_reload();
      } else {
        //如果有缓存过刷新
        //session 缓存 有东西 缓存说刷新过
        // session  缓存的 最快域名
        let best_api = SessionStorage .get("best_api") || "";
        let gr = SessionStorage .get("gr");
        let domain_api = domain.get_save_domain_api();
        if (!gr) {
          gr = BUILDIN_CONFIG.DOMAIN_RESULT.gr || "COMMON";
          SessionStorage .set("gr", gr);
        }
        if (best_api) {
          // 缓存   有  最快域名
          BUILDIN_CONFIG.DOMAIN_RESULT.first_one = best_api;
          api_domain = best_api;
        } else {
          // 缓存   无  最快域名
          // 从本地 存储内找一条数据先用 ， 后面即便 是分组不对 ，会走到纠错流程
          let find_obj = null;
          if (domain_api.length > 0) {
            find_obj = domain_api.find((x) => x.group == gr);
          }
          if (find_obj) {
            //如果找到 数据
            api_domain = find_obj["api"];
            BUILDIN_CONFIG.DOMAIN_RESULT.first_one = api_domain;
          } else {
            // 什么都没有的 补偿刷新一次  或者两次
            if (has_reload < 4) {
              SessionStorage .set("set_root_domain_error_force_reload", has_reload + 1);
              force_current_api_flow_use_oss_file_api_reload();
            } else {
              // 正常的走到 释放页面 的步骤 ，就是 wifi 图标 必须刷新页面才行的 那种
            }
          }
        }
      }
    } else {
      // 有 api_domain
      // 去除垃圾数据  ，避免长时间 挂机或者 safari 的 强缓存机制 再次影响到 页面 流程
      SessionStorage .get("set_root_domain_error_force_reload");
    }
    this.axios_instance.defaults.baseURL = api_domain;
    this.axios_instance.prototype.HTTP_ROOT_DOMAIN = api_domain;
    this.axios_instance.prototype.WS_ROOT_DOMAIN = api_domain
      ? api_domain.replace("http", "ws")
      : "";
    this.HTTP_ROOT_DOMAIN = this.axios_instance.prototype.HTTP_ROOT_DOMAIN;
    // ws root domain
    this.WS_ROOT_DOMAIN = this.axios_instance.prototype.WS_ROOT_DOMAIN;
  }
  /**
   * @Description:设置网络相关数据
   * @Author success
   * @param:
   * @return:
   * @Date 2020/08/29 16:13:55
   */
  setApiDomain() {
    //未知原因导致调用此方法的时候 axios 未实例化
    //38913 【日常】【生产】【PC】Y0商户偶现关机/重启后，首次跳转我们场馆，页面展示异常，显示网络不给力
    if (!this.axios_instance) {
      this.init();
    }
    // 设置  ROOT_DOMAIN
    this.set_root_domain();
    //设置ws地址
    // 后面打开 暂时先 http 请求 ws不是完整的流程
    // ws.set_ws_url(
    //   `${this.axios_instance.prototype.WS_ROOT_DOMAIN}/${API_PREFIX_WBSOCKET}/push`
    // );
    this.request_count = 0;
    this.err_count = {};
    // window.ws.retInitData(true)
  }
  /**
   * 设置拦截器
   */
  interceptorsHook() {
    //自身拦截器
    this.axios_instance.interceptors.request.use((config) => {
      this.request_count++;
      return config;
    });
    //业务拦截器
    const { requestHook, responseHook } = AxiosiInterceptors;
    // http请求拦截器
    requestHook.forEach(({ resolve, reject }) => {
      this.axios_instance.interceptors.request.use(resolve, reject);
    });
    // http响应拦截器
    responseHook.forEach(({ resolve, reject }) => {
      this.axios_instance.interceptors.response.use(resolve, reject);
    });
  }
  /**
   * 接口返回数据的 wapper
   */
   set_ses_wapper(res){
    let result = {};
    let data = (res || {}).data;
    if (data && (data.code == "0000000" || data.code == "200")) {
      result = {
        code: '200',
      };
    }
    result = {
      data: data.data,
      code: data.code,
      message: data.msg,
      gcuuid: data.gcuuid,
      ts:data.ts,
      ...result
    };
    return result;
  }

  /**
   * http 请求 通道 关闭  检查
   * @returns
   */
  http_close_check() {
    let closed = false;
    if (DOCUMENT_HIDDEN) {
      if (
        new Date().getTime() - DOCUMENT_HIDDEN >
        this.DOCUMENT_HIDDEN_HTTP_CLOSE_TIME
      ) {
        closed = true;
      }
    }
    return closed;
  }
  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   * @param {Object} config [axios配置项]
   */
  async get(url, params = {}, config = {}) {
    return this.request(
      {
        method: "GET",
        url,
        params,
      },
      config
    );
  }
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   * @param {Object} config [axios配置项]
   */
  async post(url, params = {}, config = {}) {
    return this.request(
      {
        method: "POST",
        url,
        params,
      },
      config
    );
  }
  /**
   * request方法，对应全部的请求 兼容以前的方法
   * @param {Object} request_config [axios配置项]
   * @param {Object} config [axios配置项]
   */
  async request(request_config = {}, config = {}) {
    //未知原因导致调用此方法的时候 axios 未实例化
    //38913 【日常】【生产】【PC】Y0商户偶现关机/重启后，首次跳转我们场馆，页面展示异常，显示网络不给力
    if (!this.axios_instance) {
      this.init();
    }
    // http 请求 通道 关闭  检查
    if (this.http_close_check()) {
      return;
    }
    if (window.ws && window.ws.run == false) {
      return;
    }
    const params = get(request_config, "params", {});
    // 根据参数 取消请求 逻辑  计算流程
    const compute_config = compute_request_config_by_config(
      ParseUrl(request_config.url),
      config,
      request_config.params
    );
    //合并参数
    Object.assign(request_config, compute_config, config);
    //接口的全局跟踪 检查UID gcuuid   嫁接
    if (params.gcuuid) {
      request_config.gcuuid = params.gcuuid;
      delete params.gcuuid;
    }
    delete params.inner_param;
    switch (String(request_config.method).toLowerCase()) {
      case "get":
        if (!params.t) {
          params.t = Date.now();
        }
        break;
      case "post":
        request_config.params = { t: Date.now() };
        request_config.data = params || {};
        request_config.type = request_config.type || 2;
        break;
    }
    // 无token时取消所有请求
    if(!window.SEARCH_PARAMS.has_token){
      return Promise.reject("api_cancel");
    }
    // 删除内部参数
    try {
      wslog.send_msg("HTTP-S:", { url: request_config.url, params });
      const res = await this.axios_instance.request(request_config);
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (request_config.gcuuid) {
        res.data.gcuuid = request_config.gcuuid;
      }
      wslog && wslog.send_msg("HTTP-R:", res);
      return Promise.resolve(this.set_ses_wapper(res));
    } catch (err) {
      // console.error('请求错误问题定位---------------------3' , err?.config?.url,err);
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (request_config.gcuuid) {
        err.gcuuid = request_config.gcuuid;
      }
      // "ECONNABORTED"   远程主机拒绝网络连接 这种错误  code 码 200 ，不会走axios 后置错误拦截
      // 会被 内部抛出异常 走到这里  ，这种错误 不处理
      // console.error(err);
      wslog && wslog.send_msg("HTTP-R:", err);
      // 取消请求则返回api_cancel标识
      if (
        err.code === "ERR_CANCELED" &&
        compute_config &&
        compute_config.api_status === "api_cancel"
      ) {
        return Promise.reject("api_cancel");
      } else {
        return Promise.reject(err);
      }
    }
  }
}
const http = new AxiosHttp();
export default http;
