import { pako_pb } from "../pb-decode/index";
import { httplog } from "../log/";
import { endsWith, get } from "lodash";
import STANDARD_KEY from "../standard-key";
import axios_debounce_cache from "./debounce-module/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import domain from "./domain";
import { SessionStorage, LocalStorage } from "src/core/utils/common/module/web-storage.js";
import {  get_query_string} from "src/core/utils/common/module/Qs.js"
import { useMittEmit, MITT_TYPES } from "../mitt";
const token_key = STANDARD_KEY.get("token"); //token键
const lang_key =  'lang'; // 语言key

const FNANI_STATUS = {
  // token api接口连续失效次数
  token_invalid_api_count: 0,
  // http错误访问处理
  err_count: {},
  // 显示失效弹出框使用的定时器
  show_fail_alert_timer: null,
  // token api接口连续失效用到的延时器
  token_invalid_api_timer: null,
  limit_api: {}, // 接口限流使用
  // 是否触发过限流接口-接口限流使用
  limit_api_flg: false,
};
/**
 * 请求拦截器公共的
 */
const requestHook = {
  resolve: (config) => {
    // console.error('请求错误问题定位---------------------0'  ,  config.url  );
    switch (String(config.method).toLowerCase()) {
      case "post":
        // 自定义参数 说明  type  1 formdata 2 json 3 file   默认 json
        if (config.type == 1 && config.data) {
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
        break;
    }
    //请求token
    // const requestId = "68e6c351022cec470f7cc3195fbabda7adb46a8d"
    const requestId = SessionStorage.get(token_key) || SessionStorage.get("token") ||get_query_string.token || "";
    config.headers["requestId"] = requestId;
    //请求语言
    // 兼容hk时接口获取不到数据
    let lang_ = config.lang && config.lang == 'hk' ? 'zh' : LocalStorage.get(lang_key,LocalStorage.get('lang')); // 语言调整
    config.headers["lang"] = lang_
    config.headers["checkId"] = `pc-${requestId}-${(UserCtr.get_uid()).replace(/-/g, "")}-${Date.now()}`;
    config.time = new Date().getTime();
    // config.url 后面是不带 ？的  会被 axios 解析掉参数放在其他地方
    if (SessionStorage.get(STANDARD_KEY.get("pb")) || SEARCH_PARAMS.init_param.get("pb")) {
      if (endsWith(config.url, "PB")) {
        config.url = config.url.substring(0, config.url.length - 2);
      } else {
        if (config.url && config.url.indexOf("PB?") != -1) {
          config.url = config.url.replace("PB?", "?");
        }
      }
    }
    return config;
  },
  reject: (error) => {
    console.error("请求失败了", error);
  },
};
// http响应拦截器
const responseHook = {
  resolve: (res) => {
    // console.error('请求错误问题定位---------------------1'  , res.config.url  );
    // console.log("res.config.url------", res.config.url);
    let url_temp = get(res, "config.url");
    // 解析url
    let jiexi_result = ParseUrl(url_temp);
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
    UserCtr.record_token_if_expired(res);

    // 常规的业务 的 url 是不带 http 前缀的 不是完整域名 ，其他的都是完整域名
    // 单独的 外层的一些逻辑 并不走这个 axios 实例，比如外层的OSS 内的 api 逻辑
    if (res.data.code == "0000000") {
      // token api接口连续失效次数初始化
      FNANI_STATUS.token_invalid_api_count = 0;
      // token api接口连续失效延时器初始化
      clearTimeout(FNANI_STATUS.token_invalid_api_timer);
      FNANI_STATUS.token_invalid_api_timer = 0;
      res.data.ts_http = new Date().getTime() - res.config.time;
      // 修正mst倒计时
      fix_mst(res);
      // 0000000-数据返回成功
      res.data.code = 200;
      FNANI_STATUS.limit_api[url_temp] = 1;
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

          if (!FNANI_STATUS.limit_api[url_temp]) {
            FNANI_STATUS.limit_api_flg = true;
          }
        } else {
          //前端   缓存、限频、节流逻辑
          handle_res_when_axios_debounce_cache_when_done_ok(res);
        }
      }
    }
    // 访问成功后清除之前的URL错误计数器
    if (FNANI_STATUS.err_count[url_temp]) {
      FNANI_STATUS.err_count[url_temp] = 0;
    }
    // console.log("httplog--------", httplog);
    httplog.push({ url: url_temp });
    return res;
  },
  reject: (error) => {
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
    let jiexi_result = ParseUrl(error_url);
    //统一规则计算后 url 片段
    error_url = jiexi_result.new_url_temp;
    // 后面非常规业务逻辑 所用axios 需要和常规的分开
    if (jiexi_result.is_other_api) {
      return Promise.reject(error);
    }
    //打印日志
    if (error.config) {
      httplog.push({ url: error_url });
    }
    // console.error('请求错误问题定位---------------------2'  , error.config.url
    // ,error);
    //前端   缓存、限频、节流逻辑
    handle_res_when_axios_debounce_cache_when_error(error);
    //接口错误 统计 相关逻辑
    handle_count_error(error);
    return Promise.reject(error);
  },
};

function handle_count_error(error) {
  let error_url = error.config.url;
  // 解析url
  let jiexi_result = ParseUrl(error_url);
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
  if (FNANI_STATUS.err_count[error_url]) {
    // 已经有的进行累加错误次数
    FNANI_STATUS.err_count[error_url] = FNANI_STATUS.err_count[error_url] + 1;
  } else {
    // 初次错误时设置错误次数为1
    FNANI_STATUS.err_count[error_url] = 1;
  }

  console.log("FNANI_STATUS.err_count");
  //暂存 错误上报分析
  // this.HTTP_ERROR_API_ERR_DATA.push(error.config)
  // if(this.HTTP_ERROR_API_ERR_DATA.length>20)
  // {
  //   this.HTTP_ERROR_API_ERR_DATA.splice(0,this.HTTP_ERROR_API_ERR_DATA.length-20)
  // }

  // 总报错次数
  let err_count = Object.values(FNANI_STATUS.err_count).reduce((a, b) => a + b);
  let error_max = domain.get_save_domain_api().length;
  error_max = error_max == 0 ? 10 : error_max;
  error_max += 2;
  console.log("http --错误 -----1----", error_max, err_count);
  //  错误 超过最大错误次数
  if (err_count > error_max) {
    // console.log("http --错误 -----2----");
    // console.log("error.config.url--", error.config);
    // console.log("error.config.baseURL----", error.config.baseURL);
    // console.log("http --错误 -----3----");
    // console.log(
    //   "发送EMIT_API_DOMAIN_UPD_CMD >>http>>> " + JSON.stringify(error)
    // );

    // 接受ws断开命令  
    // 此处在接口 出现 502 后 一直死循环请求接口，导致页面崩溃
    // useMittEmit(MITT_TYPES.EMIT_API_DOMAIN_UPD_CMD, {
    //   type: "http",
    //   data: JSON.stringify(error),
    // });
    // FNANI_STATUS.err_count = {};
  }
}
/**
 * @description: 检测修正比赛倒计时
 * @param {*}
 * @return {*}
 */
function fix_mst(res) {
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
            match_fix_mst(match, res);
          });
        }
      } else {
        mid = get(data, "mid");
        if (mid) {
          // 对象处理了
          match_fix_mst(data, res);
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
function match_fix_mst(match, http_data) {
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
/**
 *  解析判定 url
 * @param {string} [url=""]
 * @returns{ is_full_url,
    is_other_api,
    new_url_temp,
    is_pb,}
 * */
export function ParseUrl(url_temp = "") {
  //  截取 ?
  url_temp = url_temp.split("?")[0];
  //去除 ://
  if (url_temp.startsWith("://")) {
    url_temp = url_temp.slice(3);
  }
  // 是完整的链接
  let is_full_url =
    url_temp.startsWith("http://") || url_temp.startsWith("https://");
  // 为了兼容可能的错误  url_temp 带 http 开头 或者 不带   需要截取 纯粹的 pathname
  // 新的 url 片段
  let new_url_temp = url_temp;
  // 是完整的链接 并且 是常规的业务逻辑
  if (is_full_url) {
    new_url_temp = new URL(url_temp)["pathname"];
  }

  // 是否是  PB接口

  let is_pb = new_url_temp.endsWith("PB");
  return {
    is_full_url,
    new_url_temp,
    is_pb,
  };
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
          let is_pb = ParseUrl(res.config.url)["is_pb"];
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

export default {
  requestHook: [requestHook], //拦截器是可以有多个的
  responseHook: [responseHook], //拦截器是可以有多个的
};
