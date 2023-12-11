/*
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 定义一些公共的常用工具
 */

export default {
  data() {
    return {
      // 列表页滚动效果时钟
      scrolling_timer:0,
      // 无拼接的图标时的默认图片
      image_panda_placeholder: '/panda/image/panda_placeholder.jpg'
    };
  },
  methods: {
    
  /**
   * @description: lodash debounce 防抖函数功能
   * @param {Function} func 要防抖动的函数
   * @param {number} wait 需要延迟的毫秒数
   * @param {Object}  options 选项对象
   *        options.leading=false {boolean} 指定在延迟开始前调用
   *        options.maxWait {number} 设置 func 允许被延迟的最大值
   *        options.trailing=true {boolean} 指定在延迟结束后调用
   */
   debounce(func,wait,options){
    let res = null;
    if(func && (typeof(func)=='function'))
    {
      res = _.debounce(func,wait,options);
    } else {
      res = func
    }
    return res;
  },


      // lodash debounce防抖函数和throttle节流函数功能cancel函数调用
  debounce_throttle_cancel(fun){
    if(fun && fun.cancel && (typeof(fun.cancel)=='function'))
    {
      fun.cancel();
    }
  },
      /**
   * @description: lodash throttle 节流函数功能
   * @param {Function} func 要防抖动的函数
   * @param {number} wait 需要延迟的毫秒数
   * @param {Object}  options 选项对象
   *        options.leading=false {boolean} 指定在延迟开始前调用
   *        options.trailing=true {boolean} 指定在延迟结束后调用
   */
 throttle (func,wait,options) {
    let res = null;
    if(func && (typeof(func)=='function'))
    {
      res = _.throttle(func,wait,options);
    } else {
      res = func
    }
    return res;
  },

    /**
     * @description: 用户金额格式化
     * @param {Number} value 用户金额
     * @param {Number} min 最小值
     * @return {Object} 
     */    
    amount_format(value,min){
      let param = {};
      min = min || 100000;
      let k = 10000, sizes = ['',i18n_t("bet.wan"),i18n_t("bet.wanwan"),i18n_t("bet.wanyi")], i;
      if(value < min ){
        param.value = value;
        param.unit = '';
      }else{
        i = Math.floor(Math.log(value)/ Math.log(k));
        param.value = ((value/Math.pow(k,i))).toFixed(3).slice(0,-1);
        param.unit = sizes[i];
      }
      return {
        value:param.value + '',
        unit:param.unit
      };
    },
    /**
     * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
     * @param {Number} value 需要转换的值
     * @return {Number} 
     */   
    rem(value){
      let font_size = innerWidth * 100 / 375;
      return Math.ceil(value * font_size);
    },
    /** 
     * @description: 参考iphone6,7,8窗口高度(667)模拟rem
     * @param {Number} value 需要转换的值
     * @return {Number} 
     */   
    rem_height(value){
      let limit = 170;
      let font_size = innerHeight * 100 / 667;
      // 注释掉，放开响应式变化限制
      /*if(font_size > limit){
        font_size = limit
      }*/
      return Math.ceil(value * font_size);
    },
    /**
     * @description: 拼接图片地址
     * @param {String} str 需要拼接的图片尾部
     * @return {String} 
     */    
    compute_image_src(str) {
      return str ? this.get_file_path(str) : this.image_panda_placeholder
    },
    /**
     * @description: 判断是否为低端机
     * @param {Undefined} Undefined
     * @return {Boolean} 
     */   
    is_low(){
      let timing = window.performance.timing;
      let sub = Math.abs(timing.domComplete - timing.connectStart);
      return sub > 2600;
    },
    /**
     * 获取当前服务器时间
     * @param {Undefined} Undefined
     * @return {Boolean} 
     */
    get_now_server(){
      if(!window.vue.get_local_server_time){
        let now = new Date();
        window.vue.get_local_server_time = {
          server_time:now.getTime(),
          local_time_init:now.getTime()
        }
      }
      let remote_time = window.vue.get_local_server_time.server_time * 1;
      let local_time = window.vue.get_local_server_time.local_time_init * 1;
      let now = new Date().getTime();
      return remote_time + (now - local_time);
    }
  }
};
