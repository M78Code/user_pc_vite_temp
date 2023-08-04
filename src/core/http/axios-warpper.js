/*
 * @Author: success
 * @Date: 2023-07-28
 * @Description: 公共axios操作类http定义
 */
import axios from "axios";
import { get } from "lodash";
import wslog from "../ws/ws-log";
import AxiosiInterceptors, { ParseUrl } from "./axios-interceptors"; //拦截器
import { compute_request_config_by_config } from "./debounce-module/";
import AllDomain from "../domain/domain";
// import {GET_DOCUMENT_HIDDEN} from 'xxx'
class AxiosHttp {
  // api访问数量(每分钟)
  request_count = 0;
  // http root domain
  HTTP_ROOT_DOMAIN = AllDomain.DOMAIN_RESULT.first_one;
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
      ...opts,
    });
    this.request_count = 0;
    clearInterval(this.request_count_timer);
    //每分钟上报 请求次数
    this.request_count_timer = setInterval(() => {
      console.log("this.request_count=" + this.request_count);
      wslog.send_msg("HTTP-S:", { request_count: this.request_count });
      this.request_count = 0;
    }, 60 * 1000);
    //明确声明超时错误
    this.axios_instance.defaults.timeout = 15000;
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
        "panda-bss-source": "2",
      }),
    };
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
   * @Description:设置网络相关数据
   * @Author success
   * @param:
   * @return:
   * @Date 2020/08/29 16:13:55
   */
  setApiDomain() {
    // 设置   ROOT_DOMAIN
    const api_domain = AllDomain.DOMAIN_RESULT.first_one; // 这个逻辑应该在 domain里面
    this.axios_instance.defaults.baseURL = api_domain;
    this.axios_instance.prototype.HTTP_ROOT_DOMAIN = api_domain;
    this.HTTP_ROOT_DOMAIN = api_domain;
    this.request_count = 0;
    //这里可以做ws刷新 不做ws的链接重拼接 会变得难以维护
    // 逻辑放ws里 链接掉了自己重新链接 是否害怕不是同一域名？
    //   if (window.ws && window.ws.setWsUrl) {
    //     window.ws.setWsUrl(`${this.axios_instance.prototype.WS_ROOT_DOMAIN}
    ///${window.env.config.api.API_PREFIX_WBSOCKET}/push`);
    //   }
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
   * @param {Object} request_config [axios配置项]
   * @param {Object} config [axios配置项]
   */
  async request(request_config, config) {
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
    switch (String(config.method).toLowerCase()) {
      case "get":
        if (!params.t) {
          params.t = Date.now();
        }
        break;
      case "post":
        request_config.params = { t: Date.now() };
        request_config.data = params;
        request_config.type = request_config.type || 2;
        break;
    }
    // 删除内部参数
    try {
      wslog.send_msg("HTTP-S:", { url: request_config.url, params });
      const res = await this.instance.request(request_config);
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (request_config.gcuuid) {
        res.data.gcuuid = request_config.gcuuid;
      }
      wslog.send_msg("HTTP-R:", res);
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
      wslog.send_msg("HTTP-R:", err);
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
export default new AxiosHttp();
