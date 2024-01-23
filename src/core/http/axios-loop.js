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
   * @return {*}
   */
export default async function axios_api_loop(opts = {}) {
  // loop_count 当前循环次数(只在内部回调时使用)
  // timer 异常调用时延时器对象(只在内部回调时使用)
  //调用接口数据
  const {
    axios_api,
    params,
    fun_then = null,
    fun_catch = null,
    fun_finally=null,
    max_loop = 3,
    timers = 1000,
    error_codes = [],
    loop_count = 0,
  } = opts;
  opts.loop_count = (loop_count || 0) + 1;
  try {
    const res = await axios_api(params);
    //timer其实没啥用哦 因为下一次进来是已经执行了  也没有缓存
    //又没有取消方法 不知道以前为什么加
    clearTimeout(opts.timer);
    let code = get(res, "code") || get(res, "data.code") || get(res, "data.data.code") ;
    if (error_codes.includes(code)) {
      if (loop_count >= max_loop) {
        fun_catch && fun_catch(res);
        fun_finally && fun_finally();
      } else {
        opts.timer = setTimeout(() => {
          axios_api_loop(opts);
        }, timers);
      }
    } else {
      fun_then && fun_then(res);
      fun_finally && fun_finally();
    }
  } catch (e) {
    clearTimeout(opts.timer);
    if (loop_count >= max_loop) {
      fun_catch && fun_catch(e);
      fun_finally && fun_finally();
    } else {
      opts.timer = setTimeout(() => {
        axios_api_loop(opts);
      }, timers);
    }
  }
}
