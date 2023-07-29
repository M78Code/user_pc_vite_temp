/*
 * @Author: success
 * @Date: 2023-07-28
 * @Description: 公共axios操作类http定义
 */
import axios from "axios";
import { getUUID } from "../uuid/index";
import axios_debounce_cache from "./axios-debounce-cache.js";
import pako_pb from "../pb-decode/index";
import { endsWith, get, isBoolean } from "lodash-es";
import STANDARD_KEY from "app/standard-key.js";
import wslog from "../ws/ws-log";
// import userCtr from "src/public/utils/user/userCtr.js";
import HttpLog from "./http-log";
function SendMsg(msg) {
  //等 ws
  console.info(msg);
}
function getDomains() {
  return "获取最新域名的方法 应该在domain里";
}

//其他非  缓存、限频、节流  相关的 一些常规接口的 cancel 逻辑
const axios_cancel_other = {};
window.axios_cancel_other = axios_cancel_other;

//应该在doamins里
/**
 * @description: 获取持久化localStorage中的数据
 * @param {string} key localStorage key值
 * @return {object} 返回Json类型数据
 */
function get_sava_domain_api() {
  let key = STANDARD_KEY.domain_api_key;
  console.log("key = domain_api01--", key);
  let gr = sessionStorage.getItem(STANDARD_KEY.gr);
  console.log('sessionStorage.getItem("gr")---', gr);
  // 返回默认值
  let ret = [];
  // 获取持久化数据
  let str = localStorage.getItem(key);
  console.log("获取持久化数据------", str);
  if (str) {
    try {
      // 字符串转json对象
      ret = JSON.parse(str);
    } catch (error) {
      console.error(error);
    }
  }
  return ret;
}

// 计算  error_max 的值
function compute_error_max() {
  let len = get_sava_domain_api().length;
  if (len == 0) {
    len = 10;
  }
  return len;
}
// 解析判定 url

function jie_xi_url(url_temp = "") {
  //  截取 ?

  url_temp = url_temp.split("?")[0];
  //去除 ://
  if (url_temp.startsWith("://")) {
    url_temp = url_temp.slice(3);
  }
  // 是完整的链接
  let is_full_url =
    url_temp.startsWith("http://") || url_temp.startsWith("https://");
  // 非常规业务逻辑 ，指定的完整url ，不走 baseurl
  let is_other_api =
    is_full_url &&
    (url_temp.includes("sdjfgsijmdkdhsa.gzxxty168.com") ||
      url_temp.includes("information-api.sportxxxwo8.com"));
  // 为了兼容可能的错误  url_temp 带 http 开头 或者 不带   需要截取 纯粹的 pathname
  // 新的 url 片段
  let new_url_temp = url_temp;
  // 是完整的链接 并且 是常规的业务逻辑
  if (is_full_url && !is_other_api) {
    new_url_temp = new URL(url_temp)["pathname"];
  }

  // 是否是  PB接口

  let is_pb = new_url_temp.endsWith("PB");
  return {
    is_full_url,
    is_other_api,
    new_url_temp,
    is_pb,
  };
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
function compute_request_config_by_config(url, config, request_config, params) {
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
      request_config.signal = controller.signal;
      request_config.uuid = uuid;

      // controller.abort()

      // 正常情况下 代码内 在请求之前 就要发起  axios_debounce_cache 检查
      // 然后才发起 ，然后才能走到这里 ，所以这里不做 最后一次请求的 cancel 逻辑
      // 特别是 次要玩法 tab mids 接口 会出异常
    }
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
}

/**
 * 返回结果 限频等 逻辑处理  done_ok
 *
 */
function handle_res_when_axios_debounce_cache_when_done_ok(res) {
  //  我们这里不考虑  后发出的请求先回来的事情 ，此逻辑下默认 取消上个请求
  //  对于列表 mids 接口 ， 也一样必须取消上个请求 ，默认  强求单行 ，不会并行
  if (res.config.axios_debounce_cache_key) {
    let instance = axios_debounce_cache[res.config.axios_debounce_cache_key];
    if (instance && instance["ENABLED"]) {
      // 改变最后一次请求的状态
      instance.last_request_info.state = "done-ok";
      instance.last_request_info.controller = null;
      instance.last_request_info.back_time = new Date().getTime();

      // 默认单行 因此 这次 OK 的数据 的  hash_code 理论上一定等于  last_request_info的 hash_code
      // 如果 和最后一次 发起请求 的 uuid 一样  则写入  写入最后一次请求OK 数据信息
      if (
        res.config.uuid &&
        res.config.uuid == instance.last_request_info.uuid
      ) {
        //写入最后一次请求OK 数据信息
        instance.last_done_ok_request_info.send_time =
          instance.last_request_info.send_time;
        instance.last_done_ok_request_info.hash_code =
          instance.last_request_info.hash_code;
        instance.last_done_ok_request_info.uuid =
          instance.last_request_info.uuid;
        instance.last_done_ok_request_info.back_time =
          instance.last_request_info.back_time;
        instance.last_done_ok_request_info.res_data = "";

        // mids 接口特殊不缓存
        if (instance.is_bymids_api) {
          // 是  mids
        } else {
          // PB 接口才会缓存 ，不然不处理
          let is_pb = jie_xi_url(res.config.url)["is_pb"];
          if (is_pb) {
            instance.last_done_ok_request_info.res_data = {
              ...res.data,
            };
          }
        }
      }
    }
  }
}

/**
 * 返回结果 限频等 逻辑处理  done_limit
 *
 */

function handle_res_when_axios_debounce_cache_when_done_limit(res) {
  //  我们这里不考虑  后发出的请求先回来的事情 ，此逻辑下默认 取消上个请求
  //  对于列表 mids 接口 ， 也一样必须取消上个请求 ，默认  强求单行 ，不会并行
  if (res.config.axios_debounce_cache_key) {
    let instance = axios_debounce_cache[res.config.axios_debounce_cache_key];
    if (instance && instance["ENABLED"]) {
      // 改变最后一次请求的状态
      instance.last_request_info.state = "done-limit";
      instance.last_request_info.controller = null;
      instance.last_request_info.back_time = new Date().getTime();
      // 默认单行 因此 这次 OK 的数据 的  hash_code 理论上一定等于  last_request_info的 hash_code
      //   强制设置进去 ，避免其他逻辑错误 ，强制相等
      instance.last_request_info.hash_code = res.config.hash_code;
    }
  }
}

/**
 * 返回结果 限频等 逻辑处理  error
 *
 */

function handle_res_when_axios_debounce_cache_when_error(res) {
  //  我们这里不考虑  后发出的请求先回来的事情 ，此逻辑下默认 取消上个请求
  //  对于列表 mids 接口 ， 也一样必须取消上个请求 ，默认  强求单行 ，不会并行
  if (res.config.axios_debounce_cache_key) {
    let instance = axios_debounce_cache[res.config.axios_debounce_cache_key];
    if (instance && instance["ENABLED"]) {
      // 改变最后一次请求的状态
      instance.last_request_info.state = "error";
      instance.last_request_info.controller = null;
      instance.last_request_info.back_time = new Date().getTime();
      // 默认单行 因此 这次 OK 的数据 的  hash_code 理论上一定等于  last_request_info的 hash_code
      //   强制设置进去 ，避免其他逻辑错误 ，强制相等
      instance.last_request_info.hash_code = res.config.hash_code;
    }
  }
}

/**
 * 去掉 api 参数 reload
 */
function force_current_api_flow_use_oss_file_api_reload() {
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
  // http错误访问处理
  err_count = {};
  // api错误信息收集接口
  HTTP_ERROR_API = "https://sdjfgsijmdkdhsa.gzxxty168.com/api/client/adderror";
  // 用户配置收集接口
  HTTP_PRO_INFO_API =
    "https://sdjfgsijmdkdhsa.gzxxty168.com/api/client/statistics";
  // 数据上报
  HTTP_UPLOAD_API = "https://information-api.sportxxxwo8.com";
  // 最近的错误数组，用于分析上报
  HTTP_ERROR_API_ERR_DATA = [];
  // 接口限流使用
  limit_api = {};
  // 是否触发过限流接口-接口限流使用
  limit_api_flg = false;
  // api访问数量(每分钟)
  request_count = 0;
  // api访问数量使用的定时器
  request_count_timer = null;
  // 显示失效弹出框使用的定时器
  show_fail_alert_timer = null;
  // token api接口连续失效次数
  token_invalid_api_count = 0;
  // token api接口连续失效用到的延时器
  token_invalid_api_timer = 0;
  // http root domain
  HTTP_ROOT_DOMAIN = "";
  // ws root domain
  WS_ROOT_DOMAIN = "";
  // axios 实例
  axios_instance = null;
  // 页面 失去 焦点后  HTTP 断开时间
  DOCUMENT_HIDDEN_HTTP_CLOSE_TIME = 5 * 60 * 1000;
  // 页面 失去 焦点后  WS 断开时间
  DOCUMENT_HIDDEN_WS_CLOSE_TIME = 5 * 60 * 1000;
  constructor(opts) {
    this.init(opts);
  }
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
    this.request_count_timer = setInterval(() => {
      console.log("this.request_count=" + this.request_count);
      SendMsg("HTTP-S:", { request_count: this.request_count });
      this.request_count = 0;
    }, 60 * 1000);
    // 超时时间
    this.axios_instance.defaults.timeout = 15000;
    // this.axios_instance.defaults.timeout = 3000;
    //明确声明超时错误
    this.axios_instance.defaults.transitional.clarifyTimeoutError = true;
    //设置   ROOT_DOMAIN
    this.set_root_domain();
    this.axios_instance.interceptors.request.use(
      (config) => {
        // console.error('请求错误问题定位---------------------0'  ,  config.url  );
        if (config.method == "get") {
          if (!config.params) {
            config.params = {};
          }
          if (!config.params.t) {
            config.params.t = new Date().getTime();
          }
        }
        // 自定义参数 说明  type  1 formdata 2 json 3 file   默认 json
        if (config.type == 1) {
          const formData = new FormData();
          let data = config.data || {};
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          config.data = formData;
          config.headers["Content-Type"] =
            "application/x-www-form-urlencoded; charset=UTF-8";
        } else if (config.type == 3) {
          config.headers["Content-Type"] = "multipart/form-data";
        }
        config.headers["requestId"] =
          sessionStorage.getItem(STANDARD_KEY.token) || "";
        // 头信息传参对象集合
        let request_code_obj = {};
        // 系统类型缩写： iphone=4 android=3 PC = 2 H5=1
        // panda-bss-info传参规则： panda-bss-info:"source:4"  内嵌webview panda-bss-info:"source:4,1"
        // 设置系统类型缩写
        request_code_obj["panda-bss-source"] = "2";
        // 头信息字段request-code值设置
        config.headers["request-code"] = JSON.stringify(request_code_obj);
        // config.headers["lang"] = window.reset_lang || window.vue.lang || "zh";
        config.headers["lang"] = "en"; // 语言调整
        let server_time = new Date().getTime();
        if (window.vue) {
          // try {
          //   server_time =
          //     server_time -
          //     window.vue.$store.geteners.get_timestamp.local_time +
          //     window.vue.$store.getters.get_timestamp.remote_time;
          // } catch (error) {
          //   console.log(error);
          // }
        }
        config.headers["checkId"] =
          "pc-" +
          config.headers["requestId"] +
          "-" +
          getUUID().replace(/-/g, "") +
          "-" +
          server_time;
        // window.wslog.sendMsg('HTTP-S:', config);
        config.time = new Date().getTime();
        this.request_count++;
        // config.url 后面是不带 ？的  会被 axios 解析掉参数放在其他地方
        if (sessionStorage.getItem(STANDARD_KEY.pb)) {
          if (endsWith(config.url, "PB")) {
            config.url = config.url.substring(0, config.url.length - 2);
          } else {
            if (config.url && config.url.indexOf("PB?") != -1) {
              config.url = config.url.replace("PB?", "?");
            }
          }
        }
        console.log("config-------------", config);
        // 统计api访问数量
        return config;
      }
      // error => {
      //   // 设置出现网络中断页面
      //   if (window.vue && !window.vue.socket_status && !window.vue.no_network_show) {
      //     window.vue.no_network_show = true;
      //   }
      //   return Promise.reject(error);
      // }
    );
    // http响应拦截器
    this.axios_instance.interceptors.response.use(
      (res) => {
        // console.error('请求错误问题定位---------------------1'  , res.config.url  );
        console.log("res.config.url------", res.config.url);
        let url_temp = get(res, "config.url");
        // 解析url
        let jiexi_result = jie_xi_url(url_temp);
        // 后面非常规业务逻辑 所用axios 需要和常规的分开
        if (jiexi_result.is_other_api) {
          return res;
        }

        url_temp = jiexi_result.new_url_temp;

        // 非核心业务不走 token 失效流程 不走 code 码转换等 流程 直接返回
        if (url_temp.includes("livechat-api")) {
          return res;
        }

        // 对  getSystemTime/currentTimeMillis 服务器时间戳接口 有返回值但是 返回异常的处理
        // 限频code "0401038"
        if (
          url_temp.includes("getSystemTime/currentTimeMillis") &&
          res.data.code != "0000000"
        ) {
          let ts = res.data.ts;
          if (ts) {
            res.data.code = "0000000";
            res.data.data = ts;
          }
        }

        // 用户相关 控制类  统计 用户 token 失效相关 流程
        // userCtr.record_token_if_expired(res);

        // 响应成功关闭loading
        // window.wslog.sendMsg('HTTP-R:', res);

        // 常规的业务 的 url 是不带 http 前缀的 不是完整域名 ，其他的都是完整域名
        // 单独的 外层的一些逻辑 并不走这个 axios 实例，比如外层的OSS 内的 api 逻辑

        if (res.data.code == "0000000") {
          // token api接口连续失效次数初始化
          this.token_invalid_api_count = 0;
          // token api接口连续失效延时器初始化
          clearTimeout(this.token_invalid_api_timer);
          this.token_invalid_api_timer = 0;
          res.data.ts_http = new Date().getTime() - res.config.time;
          // 修正mst倒计时
          this.fix_mst(res);
          // 0000000-数据返回成功
          res.data.code = 200;
          this.limit_api[url_temp] = 1;
          if (url_temp && endsWith(url_temp, "PB")) {
            let data_temp = pako_pb.unzip_data(get(res, "data.data"));
            res.data.data = data_temp;
          }

          //前端   缓存、限频、节流逻辑
          handle_res_when_axios_debounce_cache_when_done_ok(res);
        } else {
          //排除 时间戳接口   用户偏好
          if (!url_temp.includes("getSystemTime/currentTimeMillis")) {
            if (res.data.code == "0401038") {
              // 用户接口限流
              //前端   缓存、限频、节流逻辑
              handle_res_when_axios_debounce_cache_when_done_limit(res);
              window.limit_api_flg = true;

              if (!this.limit_api[url_temp]) {
                this.limit_api_flg = true;
              }
            } else {
              //前端   缓存、限频、节流逻辑
              handle_res_when_axios_debounce_cache_when_done_ok(res);
            }
          }
        }
        // 访问成功后清除之前的URL错误计数器
        if (this.err_count[url_temp]) {
          this.err_count[url_temp] = 0;
        }
        httplog.push({ url: url_temp });
        return res;
      },

      (error) => {
        console.log("error.config-------------", error);
        // 前端主动自己取消的请求 会走到这里
        //  code : "ERR_CANCELED" message : "canceled" name : "CanceledError"
        // 这里前端自己代码内部 取消的请求 会直接  表征是控制台显示： (canceled)   reject 掉  因为没有config
        // 其他的 异常会往下走
        if (!error || !error.config) {
          return Promise.reject(error);
        }
        let error_url = error.config.url;
        // 解析url
        let jiexi_result = jie_xi_url(error_url);
        //统一规则计算后 url 片段
        error_url = jiexi_result.new_url_temp;
        // 后面非常规业务逻辑 所用axios 需要和常规的分开
        if (jiexi_result.is_other_api) {
          return Promise.reject(error);
        }
        //打印日志
        if (error.config) {
          HttpLog.push({ url: error_url });
        }
        // console.error('请求错误问题定位---------------------2'  , error.config.url
        // ,error);
        //前端   缓存、限频、节流逻辑
        handle_res_when_axios_debounce_cache_when_error(error);
        //接口错误 统计 相关逻辑
        this.handle_count_error(error);
        return Promise.reject(error);
      }
    );
  }
  /**
   *
   * 接口错误 统计 相关逻辑
   */
  handle_count_error(error) {
    let error_url = error.config.url;
    // 解析url
    let jiexi_result = jie_xi_url(error_url);
    //统一规则计算后 url 片段
    error_url = jiexi_result.new_url_temp;
    // axios 超时的请求  AxiosError   code   "ETIMEDOUT"
    // axio 的 超时 表征上 code 码是200 ，但是 ，内部axios 处理后 ，这边 会是 error 自己抛出的封装后的异常

    // 请求超时 的 异常 计入还是不计入错误 ？？？？？ ，理论上 不计入 ？
    // 暂时 计入  错误统计
    // if(  error.code != "ETIMEDOUT" ){
    //  不需要统计接口错误：    是全连接 ，或者 是  livechat-api 的都不 统计
    let no_need_count_error =
      jiexi_result.is_full_url || error_url.includes("livechat-api");
    //  不需要统计错误 不走后面的逻辑
    if (no_need_count_error) {
      return false;
    }

    // 非取消请求,错误时,记录url错误请求次数
    if (this.err_count[error_url]) {
      // 已经有的进行累加错误次数
      this.err_count[error_url] = this.err_count[error_url] + 1;
    } else {
      // 初次错误时设置错误次数为1
      this.err_count[error_url] = 1;
    }

    console.log("this.err_count");
    //暂存 错误上报分析
    // this.HTTP_ERROR_API_ERR_DATA.push(error.config)
    // if(this.HTTP_ERROR_API_ERR_DATA.length>20)
    // {
    //   this.HTTP_ERROR_API_ERR_DATA.splice(0,this.HTTP_ERROR_API_ERR_DATA.length-20)
    // }

    // 总报错次数
    let err_count = Object.values(this.err_count).reduce((a, b) => a + b);

    let error_max = compute_error_max() + 2;
    console.log("http --错误 -----1----", error_max, err_count);
    //  错误 超过最大错误次数
    if (err_count > error_max) {
      console.log("http --错误 -----2----");
      console.log("error.config.url--", error.config);
      console.log("error.config.baseURL----", error.config.baseURL);
      console.log("http --错误 -----3----");
      console.log(
        "发送EMIT_API_DOMAIN_UPD_CMD >>http>>> " + JSON.stringify(error)
      );
      // 接受ws断开命令
      window.vue.$root.$emit("EMIT_API_DOMAIN_UPD_CMD", {
        type: "http",
        data: JSON.stringify(error),
      });

      this.err_count = {};
    }
    // }

    // // 设置出现网络中断页面
    // if (window.vue && !window.vue.socket_status && !window.vue.no_network_show) {
    //   window.vue.no_network_show = true;
    // }
  }

  /**
   * 设置   ROOT_DOMAIN
   */
  set_root_domain() {
    const api_domain = getDomains(); //这个逻辑应该在 domain里面
    this.axios_instance.defaults.baseURL = api_domain;
    this.axios_instance.prototype.HTTP_ROOT_DOMAIN = api_domain;
    this.HTTP_ROOT_DOMAIN = api_domain;

    //ws域名设定 逻辑不 应该在这里
    // this.axios_instance.prototype.WS_ROOT_DOMAIN = api_domain
    //   ? api_domain.replace("http", "ws")
    //   : "";
    //this.WS_ROOT_DOMAIN = this.axios_instance.prototype.WS_ROOT_DOMAIN;
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
   */
  // config 的 两种情况 参数
  //1.  {axios_debounce_cache_key:'menu_init'}
  //2.  {cancel_other:'1'}
  async get(url, params = {}, config = {}) {
    if (!this.axios_instance) {
      this.setApiDomain();
    }

    // http 请求 通道 关闭  检查
    if (this.http_close_check()) {
      return;
    }
    if (window.ws && window.ws.run == false) {
      params = null;
      return;
    }

    params.t = Date.now();

    return await new Promise((resolve, reject) => {
      if (window.wslog && window.wslog.sendMsg) {
        window.wslog.sendMsg("HTTP-S:", { url: url, params: params });
      }
      params = params || {};
      let request_config = {};

      // 根据参数    取消请求 逻辑  计算流程
      let compute_config_res = compute_request_config_by_config(
        url,
        config,
        request_config,
        params
      );

      request_config.params = params;
      request_config = { ...request_config, ...config };
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (params.gcuuid) {
        request_config.gcuuid = params.gcuuid;
        delete params.gcuuid;
      }
      // 删除内部参数
      delete params.inner_param;

      this.axios_instance
        .get(url, request_config)
        .then((res) => {
          //接口的全局跟踪 检查UID gcuuid   嫁接
          if (request_config.gcuuid) {
            res.data.gcuuid = request_config.gcuuid;
          }
          if (window.wslog && window.wslog.sendMsg) {
            window.wslog.sendMsg("HTTP-R:", res);
          }

          resolve(res);

          params = null;
        })
        .catch((err = {}) => {
          // console.error('请求错误问题定位---------------------3' , err?.config?.url,err);
          //接口的全局跟踪 检查UID gcuuid   嫁接
          if (request_config.gcuuid) {
            err.gcuuid = request_config.gcuuid;
          }

          // "ECONNABORTED"   远程主机拒绝网络连接 这种错误  code 码 200 ，不会走axios 后置错误拦截
          // 会被 内部抛出异常 走到这里  ，这种错误 不处理
          // console.error(err);
          if (window.wslog && window.wslog.sendMsg) {
            window.wslog.sendMsg("HTTP-R:", err);
          }

          // 取消请求则返回api_cancel标识
          if (
            err.code === "ERR_CANCELED" &&
            compute_config_res &&
            compute_config_res.api_status === "api_cancel"
          ) {
            reject("api_cancel");
          } else {
            reject(err);
          }

          params = null;
        });
    });
  }

  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  async post(url, params = {}, config = {}) {
    if (!this.axios_instance) {
      this.setApiDomain();
    }
    // http 请求 通道 关闭  检查
    if (this.http_close_check()) {
      return;
    }
    if (window.ws && window.ws.run == false) {
      params = null;
      return;
    }

    url = `${url}?t=${Date.now()}`;
    return await new Promise((resolve, reject) => {
      if (window.wslog && window.wslog.sendMsg) {
        window.wslog.sendMsg("HTTP-S:", { url: url, params: params });
      }

      let request_config = { type: config.type || 2 };

      // 根据参数    取消 逻辑  计算流程
      let compute_config_res = compute_request_config_by_config(
        url,
        config,
        request_config,
        params
      );

      request_config = { ...request_config, ...config };
      //接口的全局跟踪 检查UID gcuuid   嫁接
      if (params.gcuuid) {
        request_config.gcuuid = params.gcuuid;
        delete params.gcuuid;
      }
      // 删除内部参数
      delete params.inner_param;
      this.axios_instance
        .post(url, params, request_config)
        .then((res) => {
          //接口的全局跟踪 检查UID gcuuid   嫁接
          if (request_config.gcuuid) {
            res.data.gcuuid = request_config.gcuuid;
          }
          if (window.wslog && window.wslog.sendMsg) {
            window.wslog.sendMsg("HTTP-R:", res);
          }
          resolve(res);

          params = null;
        })
        .catch((err = {}) => {
          // console.error('请求错误问题定位---------------------3' , err?.config?.url,err);
          //接口的全局跟踪 检查UID gcuuid   嫁接
          if (request_config.gcuuid) {
            err.gcuuid = request_config.gcuuid;
          }
          // "ECONNABORTED"   远程主机拒绝网络连接 这种错误  code 码 200 ，不会走axios 后置错误拦截
          // 会被 内部抛出异常 走到这里  ，这种错误 不处理
          // console.error(err);
          if (window.wslog && window.wslog.sendMsg) {
            window.wslog.sendMsg("HTTP-R:", err);
          }

          // 取消请求则返回api_cancel标识
          if (
            err.code === "ERR_CANCELED" &&
            compute_config_res &&
            compute_config_res.api_status === "api_cancel"
          ) {
            reject("api_cancel");
          } else {
            reject(err);
          }

          params = null;
        });
    });
  }
  /**
   * @description: 检测修正比赛倒计时
   * @param {*}
   * @return {*}
   */
  fix_mst(res) {
    // 判断是否是数组
    let data = get(res, "data.data.data");
    try {
      if (data) {
        let mid = 0;
        if (Array.isArray(data)) {
          mid = get(data, "[0].mid");
          if (mid) {
            // 数组处理了
            data.forEach((match) => {
              this.match_fix_mst(match, res);
            });
          }
        } else {
          mid = get(data, "mid");
          if (mid) {
            // 对象处理了
            this.match_fix_mst(data, res);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description: 修正赛事比赛倒计时
   * @param {*}
   * @return {*}
   */
  match_fix_mst(match, http_data) {
    let time_m = http_data.data.ts_http;
    if (match && match.ms && match.mess == 1) {
      // 对进行中的赛事,并且处于倒计时状态的赛事进行修正
      let csid = parseInt(match.csid);
      let mst = parseInt(match.mst);
      // 转换成秒
      let mm = parseInt(time_m / 1000);
      let mmp = parseInt(match.mmp);
      let mmps = "";
      if (mst > 0) {
        switch (csid) {
          case 1: // 足球
            // 上半场,下半场,加时赛上半场,加时赛下半场
            mmps = [6, 7, 41, 42];
            if (mmps.includes(mmp)) {
              match.mst = mst + mm;
            }
            break;
          case 4: // 冰球
            // 第一局 第二局 第三局 加时赛 点球大战
            mmps = [1, 2, 3, 40, 50];
            if (mmps.includes(mmp)) {
              match.mst = mst + mm;
            }
            break;

          case 2: // 篮球
            // 上半场,下半场,第一节,第二节,第三节,第四节,加时赛
            mmps = [1, 2, 13, 14, 15, 16, 40];
            if (mmps.includes(mmp)) {
              match.mst = mst - mm;
            }
            break;
          case 6: // 美式足球
            // 第一节 第二节 第三节 第四节 加时赛
            mmps = [13, 14, 15, 16, 40];
            if (mmps.includes(mmp)) {
              match.mst = mst - mm;
            }
            break;

          default:
            break;
        }
        if (match.mst < 0) {
          match.mst = 0;
        }
        // console.log(`回表--mid:${match.mid}---mmp:${match.mmp}---球种${match.csid}-----前:${mst}---差:${mm}---后:${match.mst}`)
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
