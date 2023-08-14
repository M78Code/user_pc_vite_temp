/*
 * @Author: Cable
 * @Date: 2021-06-18 17:45:18
 * @Description: ws调用接口节流工具类
 */


export default class WsDebounce {
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view, callback) {
    // 视图对象
    this.view = view;
    // 赛事ID
    this.mids = [];
    // 球种ID
    this.csids = [];
    // 回调函数
    this.callback = callback;
  }
  /**
   * @Description 添加赛事ID 
   * @param {object} match
   * @param {undefined} undefined
  */
  add_mid(match) {
    if (!this.mids.includes(match.mid)) {
      this.mids.push(match.mid)
      this.csids.push(match.csid * 1)
    }
    this.debounce()
  }

  /**
   * @description: 检测是否只有足球球种
   * @param {Array} csids 球种数组
   * @return {Boolean}
   */
  is_check_all_football(csids) {
    let ret = false;
    if (csids && csids.length) {
      ret = true;
      for (let i = 0; i < csids.length; i++) {
        if (csids[i] != 1) {
          ret = false;
          break;
        }
      }
    }
    return ret;
  }
  /**
   * @Description 节流函数  3秒内重复调用只调用一次
   * @param {undefined} undefined
  */
  debounce() {
    let time_ = 1000;
    if (this.is_check_all_football(this.csids)) {
      time_ = 3000
    }

    clearTimeout(this.interval_id)
    this.interval_id = setTimeout(() => {
      this.run_id = false
      this.call_api()
    }, time_)

    if (!this.run_id) {
      this.run_id = this.interval_id
    }

    if (this.run_id != this.interval_id) {
      clearTimeout(this.interval_id)
    }

  }
  /**
   * @Description 调用接口 
   * @param {undefined} undefined
  */
  call_api() {
    if (this.callback) {
      this.callback(this.mids)
    }
    this.mids = [];
  }
  // 批量清除定时器
  clear_timer() {
    const timer_arr = [
      'interval_id'
    ]

    for (const timer of timer_arr) {
      clearTimeout(this[timer])
      this[timer] = null
    }
  }
}