/*
 * @Author: success
 * @Date: 2023-07-28
 * @Description: 公共axios操作类http定义
 */
import axios from "axios";
import { getUUID } from "../uuid/index";
import axios_debounce_cache from "./debounce-module/";
import { get } from "lodash-es";
// import STANDARD_KEY from "app/standard-key.js";
import wslog from "../ws/ws-log";
// import userCtr from "src/public/utils/user/userCtr.js";
import axiosiInterceptors, { jie_xi_url } from "./axios-interceptors"; //拦截器
//应该在doamins里
import { get_sava_domain_api, getDomains } from "../domain";
//其他非  缓存、限频、节流  相关的 一些常规接口的 cancel 逻辑
const axios_cancel_other = {};
window.axios_cancel_other = axios_cancel_other;
// 计算  error_max 的值
function compute_error_max() {
  let len = get_sava_domain_api().length;
  if (len == 0) {
    len = 10;
  }
  return len;
}
/**
 * 根据参数    取消请求 逻辑  计算流程
 * @param {*} url
 * @param {*} config
 * @param {*} request_config
 */
// config 的 两种情况 参数
//1.  {axios_debounce_cache_key:'menu_init'}
//2.  {cancel_other:'1'}
function compute_request_config_by_config(url, config, params) {
  // 请求单行 ，下次请求发起 ，则取消上次请求
  if (config.axios_debounce_cache_key) {
    // 走  接口  缓存、限频、节流
    let instance = axios_debounce_cache[config.axios_debounce_cache_key];
    if (instance && instance["ENABLED"]) {
      // 如果这个接口配置了 缓存、限频、节流 策略 并且开启了
      //当开启 缓存并检查接口参数的 菜单ID
      if (instance.euid_cache_and_check && params.euid) {
        instance.euid_cache_and_check_last_euid = params.euid;
      }
      let hash_code = instance.hash_code(params);
      instance.last_request_info.send_time = new Date().getTime();
      let uuid = getUUID();
      instance.last_request_info.hash_code = hash_code;
      instance.last_request_info.uuid = uuid;
      instance.last_request_info.state = "going";
      let controller = new AbortController();
      // https://www.npmjs.com/package/axios#cancellation
      instance.last_request_info.controller = controller;
      // controller.abort()
      // 正常情况下 代码内 在请求之前 就要发起  axios_debounce_cache 检查
      // 然后才发起 ，然后才能走到这里 ，所以这里不做 最后一次请求的 cancel 逻辑
      // 特别是 次要玩法 tab mids 接口 会出异常
      return {
        signal: controller.signal,
        uuid: uuid,
      };
    }
    return {};
  } else if (config.cancel_other) {
    // 取消其他常规接口的请求
    let url_temp = jie_xi_url(url)["new_url_temp"];
    let old_controller = axios_cancel_other[url_temp];
    if (old_controller) {
      old_controller.abort && old_controller.abort();
    }
    let controller = new AbortController();
    axios_cancel_other[url_temp] = controller;
    request_config.signal = controller.signal;
    // controller.abort()
    // 返回api请求取消标识，供特定操作判断
    return {
      api_status: "api_cancel",
    };
  }
  return {};
}
class AxiosHttp {
  // api访问数量(每分钟)
  request_count = 0;

  // api错误信息收集接口
  HTTP_ERROR_API = "https://sdjfgsijmdkdhsa.gzxxty168.com/api/client/adderror";
  // 用户配置收集接口
  HTTP_PRO_INFO_API =
    "https://sdjfgsijmdkdhsa.gzxxty168.com/api/client/statistics";
  // 数据上报
  HTTP_UPLOAD_API = "https://information-api.sportxxxwo8.com";
  // 最近的错误数组，用于分析上报
  HTTP_ERROR_API_ERR_DATA = [];

  // http root domain
  HTTP_ROOT_DOMAIN = "";
  // axios 实例
  axios_instance = null;
  // 页面 失去 焦点后  HTTP 断开时间
  DOCUMENT_HIDDEN_HTTP_CLOSE_TIME = 5 * 60 * 1000;
  constructor(opts) {
    this.init(opts);
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
    clearInterval(this.request_count_timer);
    //每分钟上报 请求次数
    this.request_count_timer = setInterval(() => {
      console.log("this.request_count=" + this.request_count);
      wslog.sendMsg("HTTP-S:", { request_count: this.request_count });
      this.request_count = 0;
    }, 60 * 1000);
    //明确声明超时错误
    this.axios_instance.defaults.timeout = 15000;
    this.axios_instance.defaults.transitional.clarifyTimeoutError = true;
    //设置   ROOT_DOMAIN
    this.set_root_domain();
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
        "panda-bss-source": "2",
      }),
    };
  }
  /**
   * 设置拦截器
   */
  interceptorsHook() {
    this.axios_instance.interceptors.request.use((config) => {
      this.request_count++;
      return config;
    });
    const [request, response] = axiosiInterceptors;
    // http请求拦截器
    request.forEach(({ resolve, reject }) => {
      this.axios_instance.interceptors.request.use(resolve, reject);
    });
    // http响应拦截器
    response.forEach(({ resolve, reject }) => {
      this.axios_instance.interceptors.request.use(resolve, reject);
    });
  }
  /**
   * 设置   ROOT_DOMAIN
   */
  set_root_domain() {
    //force_current_api_flow_use_oss_file_api_reload 这个逻辑应该在 domain里面
    const api_domain = getDomains(); // 这个逻辑应该在 domain里面
    this.axios_instance.defaults.baseURL = api_domain;
    this.axios_instance.prototype.HTTP_ROOT_DOMAIN = api_domain;
    this.HTTP_ROOT_DOMAIN = api_domain;

    // 这个逻辑应该在这？ domain里吧 获取domain时候才出现的？
    //force_current_api_flow_use_oss_file_api_reload
    //session 缓存的 是否 因为设置页面API 域名错误 刷新过
    // let has_reload = sessionStorage.getItem(
    //   "set_root_domain_error_force_reload"
    // );
    //不清楚，页面强缓存，唤醒的时候 session 是否还存在
    // if (!has_reload) {
    // 只做一次尝试  ，直接走OSS 文件 流程  ，刷新页面  ，不能多次 避免 异常情况下 无限刷新
    // sessionStorage.setItem("set_root_domain_error_force_reload", "1");
    // force_current_api_flow_use_oss_file_api_reload();
    // }
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
    // 设置   ROOT_DOMAIN
    this.set_root_domain();
    this.request_count = 0;
    this.err_count = {};
    // window.ws.retInitData(true)
  }
  /**
   * http 请求 通道 关闭  检查
   * @returns
   */
  http_close_check() {
    let closed = false;
    if (window.DOCUMENT_HIDDEN) {
      if (
        new Date().getTime() - window.DOCUMENT_HIDDEN >
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
   * @param {String} request_config [axios配置项]
   * @param {Object} config [axios配置项]
   */
  async request(request_config, config) {
    if (!this.axios_instance) {
      this.setApiDomain();
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
      request_config.url,
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
    switch (String(config.method).toLowerCase()) {
      case "get":
        if (!params.t) {
          params.t = Date.now();
        }
        break;
      case "post":
        request_config.url += `?t=${Date.now()}`;
        request_config.data = params;
        request_config.type = request_config.type || 2;
        break;
    }
    // 删除内部参数
    try {
      wslog.sendMsg("HTTP-S:", { url: request_config.url, params });
      const res = await this.instance.request(request_config);
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (request_config.gcuuid) {
        res.data.gcuuid = request_config.gcuuid;
      }
      wslog.sendMsg("HTTP-R:", res);
      return Promise.resolve(res);
    } catch (err) {
      // console.error('请求错误问题定位---------------------3' , err?.config?.url,err);
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (request_config.gcuuid) {
        err.gcuuid = request_config.gcuuid;
      }
      // "ECONNABORTED"   远程主机拒绝网络连接 这种错误  code 码 200 ，不会走axios 后置错误拦截
      // 会被 内部抛出异常 走到这里  ，这种错误 不处理
      // console.error(err);
      wslog.sendMsg("HTTP-R:", err);
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
const DefAxiosHttp = new AxiosHttp();
const resetHttp = () => {
  DefAxiosHttp.setApiDomain();
};
export default DefAxiosHttp;
export { resetHttp };
