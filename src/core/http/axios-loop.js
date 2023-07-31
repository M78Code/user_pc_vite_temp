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
    this.$utils.axios_api_loop(obj_);
   * @param {*} axios_api axios api对象
   * @param {*} params 参数
   * @param {*} fun_then axios中then回调方法
   * @param {*} fun_catch axios中catch回调方法
   * @param {*} max_loop 最大循环调用次数(异常时会循环调用),默认3次
   * @param {*} timers 异常调用时延时时间,毫秒数,默认1000
   * @param {*} loop_count 当前循环次数(只在内部回调时使用)
   * @param {*} timer 异常调用时延时器对象(只在内部回调时使用)
   * @param {*} error_codes 成功请求后的异常码集合
   * @return {*}
   */
export default function axios_api_loop({
  axios_api,
  params,
  fun_then = null,
  fun_catch = null,
  max_loop = 3,
  timers = 1000,
  loop_count = 0,
  timer = 0,
  error_codes = [],
}) {
  // loop_count 当前循环次数(只在内部回调时使用)
  // timer 异常调用时延时器对象(只在内部回调时使用)
  //调用接口数据
  axios_api(params)
    .then((res) => {
      clearTimeout(timer);
      let code = _.get(res, "data.code");
      if (error_codes.includes(code)) {
        if (loop_count++ >= max_loop - 1) {
          if (fun_catch) {
            fun_then(res);
          }
        } else {
          timer = setTimeout(() => {
            this.axios_api_loop({
              axios_api,
              params,
              fun_then,
              fun_catch,
              max_loop,
              timers,
              loop_count,
              timer,
              error_codes,
            });
          }, timers);
        }
      } else {
        if (fun_then) {
          fun_then(res);
        }
      }
    })
    .catch((e) => {
      clearTimeout(timer);
      if (loop_count++ >= max_loop - 1) {
        if (fun_catch) {
          fun_catch(e);
        }
      } else {
        timer = setTimeout(() => {
          this.axios_api_loop({
            axios_api,
            params,
            fun_then,
            fun_catch,
            max_loop,
            timers,
            loop_count,
            timer,
            error_codes,
          });
        }, timers);
      }
    });
}
