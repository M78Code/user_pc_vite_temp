/*
 * @Author: jiffy
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @Description: 说明
 */
import { get } from "lodash";
/**
   * @description: axios_api轮询调用方法
   *
   * 使用例子:
   * let obj_ = {
      // axios api对象
      axios_api:api_home.get_menu_init,
      // axios api对象参数
      params:params,
      // axios中then回调方法
      fun_then: res => {},
      // axios中catch回调方法
      fun_catch: err => {},
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop:3,
      // 异常调用时延时时间,毫秒数,默认1000
      timers:1000
    }
    // axios_api轮询调用方法
    this.$axios_api_loop(obj_);
   * @param {*} axios_api axios api对象
   * @param {*} params 参数
   * @param {*} fun_then axios中then回调方法
   * @param {*} fun_catch axios中catch回调方法
   * @param {*} max_loop 最大循环调用次数(异常时会循环调用),默认3次
   * @param {*} timers 异常调用时延时时间,毫秒数,默认1000
   * @param {*} error_codes 成功请求后的异常码集合
   * @param {*} fun_finally axios中finally回调方法
   * @return {function}返回取消的方法
   */
const key_map = {}
export default function axios_api_loop(opts = {}) {
  // loop_count 当前循环次数(只在内部回调时使用)
  // timer 异常调用时延时器对象(只在内部回调时使用)
  //调用接口数据
  const {
    axios_api,
    params,
    fun_then = null,
    fun_catch = null,
    fun_finally = null,
    max_loop = 3,
    timers = 1000,
    error_codes = [],
    loop_count = 0,
    axios_key
  } = opts;
  opts.loop_count = (loop_count || 0) + 1;
  //如果key存在 但是没有值 就不执行了 因为执行了取消
  if (axios_key && !key_map[opts.axios_key]) {
    return
  }
  if (!axios_key) {
    opts.axios_key = Date.now();
    key_map[opts.axios_key] = opts.axios_key;
  }
  clearTimeout(opts.timer);
  axios_api(params).then((res) => {
    let code = get(res, "code") || get(res, "data.code") || get(res, "data.data.code");
    if (error_codes.includes(code)) {
      if (loop_count >= max_loop) {
        delete key_map[opts.axios_key]
        fun_catch && fun_catch(res);
        fun_finally && fun_finally();
      } else {
        opts.timer = setTimeout(() => {
          axios_api_loop(opts);
        }, timers);
      }
    } else {
      if (key_map[opts.axios_key]) {//如果已经取消了 但是接口发出去了 就不执行 结果了
        delete key_map[opts.axios_key]
        fun_then && fun_then(res);
        fun_finally && fun_finally();
      }
    }
  }).catch((e) => {
    clearTimeout(opts.timer);
    if (loop_count >= max_loop) {
      delete key_map[opts.axios_key]
      fun_catch && fun_catch(e);
      fun_finally && fun_finally();
    } else {
      opts.timer = setTimeout(() => {
        axios_api_loop(opts);
      }, timers);
    }
  });
  return function () { //返回取消的方法
    delete key_map[opts.axios_key]
  }
}