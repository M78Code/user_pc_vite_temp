/*
 * @Author: success
 * @Date: 2020-08-20 18:35:55
 * @Description:  全局注册对象
 */
import Vue from 'vue'

import filters from 'src/boot/global-filters.js'
import * as wsCmd from "src/public/utils/ws/wsCmd.js";
import * as emit_cmd from "src/public/utils/http/emit_cmd.js";
import toastRegistry from "src/public/components/toast/toast";
import {common} from "src/boot/common.js";
import 'url-search-params-polyfill'
import utils from 'src/public/utils/utils';
import userCtr from 'src/public/utils/user/userCtr.js';
// 导入自定义高精度计算工具js
import math from "src/boot/mathjs"
import axios_debounce_cache from "utils/http/axios_debounce_cache";
import {get_file_path} from "src/public/utils/get_file_path.js"

let BUILD_VERSION =  process.env.NODE_ENV=='development'?'':   require('../../version.js').BUILD_VERSION;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(toastRegistry) // this.$toast('暂无赛事', 800), 全局类似这样调用，800 是显示的时间

/**-------------------- 调试用 --------------------
 * 简单封装log，便于控制台打印关键信息，颜色高亮显示
 * 可根据自身喜好自定义改造，如高亮颜色
 * 记得调试结束后，删除相应打印log
 * -------------------- 调试用 --------------------
 */
const LOG = ['log', 'info', 'warn', 'error']
LOG.forEach(logType => {
  window[logType] = function () {
    let [key, ...logInfo] = arguments

    let color
    switch(logType) {
      case 'log': color = 'hotpink';break;
      case 'info': color = 'orange';break;
      case 'warn': color = 'red';break;
      case 'error': color = '';break;
      default: color = '';break;
    }

    console[logType](`%c${key}--------`, `color:${color}`, ...logInfo)
  }
})

// 加载所有模板文件
const require_all = require.context("project_theme", true, /\.scss$/)
require_all.keys().forEach( item => require_all(item))




 export default async ({ app, router, store, Vue }) => {

  /** 三方类库 **************************/
  Vue.prototype._ = window._;

  Vue.prototype.$utils = utils;
  // 高精度运算工具对象(例子:this.$mathjs.multiply(1.13,100000))
  Vue.prototype.$mathjs = math;

   // emit 常量 ：this.emit_cmd.常量
  Vue.prototype.emit_cmd = emit_cmd;
  // // 用户相关的 全局 单实例 类
  Vue.prototype.userCtr = userCtr




  /**
   * @description: lodash debounce 防抖函数功能
   * @param {Function} func 要防抖动的函数
   * @param {number} wait 需要延迟的毫秒数
   * @param {Object}  options 选项对象
   *        options.leading=false {boolean} 指定在延迟开始前调用
   *        options.maxWait {number} 设置 func 允许被延迟的最大值
   *        options.trailing=true {boolean} 指定在延迟结束后调用
   */
  Vue.prototype.debounce=(func,wait,options)=>{
    let res = null;
    if(func && (typeof(func)=='function'))
    {
      res = _.debounce(func,wait,options);
    } else {
      res = func
    }
    return res;
  }

  /**
   * @description: lodash throttle 节流函数功能
   * @param {Function} func 要防抖动的函数
   * @param {number} wait 需要延迟的毫秒数
   * @param {Object}  options 选项对象
   *        options.leading=false {boolean} 指定在延迟开始前调用
   *        options.trailing=true {boolean} 指定在延迟结束后调用
   */
  Vue.prototype.throttle=(func,wait,options)=>{
    let res = null;
    if(func && (typeof(func)=='function'))
    {
      res = _.throttle(func,wait,options);
    } else {
      res = func
    }
    return res;
  }
  // lodash debounce防抖函数和throttle节流函数功能cancel函数调用
  Vue.prototype.debounce_throttle_cancel=(fun)=>{
    if(fun && fun.cancel && (typeof(fun.cancel)=='function'))
    {
      fun.cancel();
    }
  }


  // 目前环境信息
  const current_env = window.env.config.current_env;
  //获取图片完整网络路径
  Vue.prototype.get_file_path =get_file_path;


  /** JS  **************************/
  // 全局WS命令定义
  Vue.prototype.$wscmd = wsCmd;
  // 全局公共函数和变量
  Vue.prototype.$common= common;
  // 全局图片路径前缀 区分本地/打包
  Vue.prototype.$g_image_preffix = process.env.NODE_ENV === "development" ? '' : '/' +  BUILD_VERSION
  /**
   * 描述： 缓存、限频、节流  函数
   * params  接口参数
   * cb  调用接口的方法
   * url_key 去抖动，缓存的 key
   */
  let timer = null
  Vue.prototype.cache_limiting_throttling_get_list = (params, cb, url_key='menu_init')=>{
    if(axios_debounce_cache && axios_debounce_cache[url_key] && axios_debounce_cache[url_key]['ENABLED']){
      let info = axios_debounce_cache[url_key].can_send_request(params)
      if(info.can_send){
        //直接发请求 单次数 请求的方法
        if(cb) {cb()}
      }else{
        // 记录timer
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
          //直接发请求 单次数 请求的方法
          if(cb) {cb()}
          timer =null
        }, info.delay_time ||1000);
      }
    }else{
      //直接发请求 多次数  循环请求 的方法
      if(cb) {cb()}
    }
  }
  // 重写console.log, 支持ws推送console.log日志
  // 是否是开发环境
  const is_development = (window.env.NODE_ENV == 'development');
  // 是否开启clog打印
  const clog = (sessionStorage.getItem('clog') == 1)?1: ((location.href.indexOf('clog=1') != -1)?1:0);
  sessionStorage.setItem('clog', clog);
  if(clog)
  {
    const log = console.log;
    let getStackTrace = function () {
      var obj = {};
      try {
        Error.captureStackTrace(obj, getStackTrace);
      } catch (error) {
        obj.stack = '';
      }
      return obj.stack;
    };

    console.log = function(str){
      if(is_development)
      {
        // 生产环境不打印日志
        // mFun.call(console, ...arguments);
        var stack = getStackTrace() || ""
        var matchResult = stack.match(/\(.*?\)/g) || []
        var line = matchResult[1] || ""
        if(line)
        {
          for (var i in arguments) {
          }
          if (typeof arguments[i] == 'object') {
            arguments[i] = JSON.stringify(arguments[i])
          }
          line = line.replace("(", "").replace(")", "")
          line = line.replace(/.*\/src\//,'/src/').replace(/\?.*\&/,'');
          arguments[i] += '             webpack-internal:///.' + line;
        }
        log.apply(console, arguments)
      }
      if(clog && window.wslog){
        try {
          let arguments_ = arguments;
          if (arguments && arguments.length == 1){
            if(arguments[0] && (typeof arguments[0]) == 'object'){
              arguments_ = arguments[0];
            } else{
              try {
                if(item){
                  arguments_ = JSON.parse(arguments[0]);
                } else {
                  arguments_ = arguments[0];
                }
              } catch (error) {
                arguments_ = arguments[0];
              }
            }
          }
          window.wslog.sendMsg('CLOG-L:', arguments_);
        } catch (error) {}
      }
    }
  } else {
    if(!is_development){
      console.log = function(str){};
    }
  }

  Vue.directive('img', {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind(img_dm, binding) {
      img_dm.setAttribute('data-src', binding.value[0])
      img_dm.setAttribute('data-team', binding.value[1])
      img_dm.setAttribute('data-csid', binding.value[2])
      img_dm.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    },
    // 当元素被插入到DOM中时
    inserted(img_dm, binding) {
      if (IntersectionObserver) {
        img_observe(img_dm)
      } else {
        load_img_src(img_dm)
      }
    },
    // 当元素更新时
    update(img_dm, binding) {
      if(binding.value[0] == binding.oldValue[0]){
        return
      }
      img_dm.setAttribute('data-src', binding.value[0])
      img_dm.setAttribute('data-team', binding.value[1])
      img_dm.setAttribute('data-csid', binding.value[2])
      if (IntersectionObserver) {
        img_observe(img_dm)
      } else {
        load_img_src(img_dm)
      }
    },
    // 组件销毁
    unbind(el){
      if(el.is_show_io){
        el.is_show_io.disconnect();
      }
    },
  })

  // 利用IntersectionObserver监听el 是否可视
  const img_observe = function(img_dm) {
    img_dm.is_show_io = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting) {
        load_img_src(img_dm)
        img_dm.is_show_io.disconnect();
      }
    })
    img_dm.is_show_io.observe(img_dm)
  }

  // 字母顺序
  const letter_num = {A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,}

  /**
   * @Description 加载图片
   * @param {object}  dom元素
   * @param {undefined} undefined
   */
  const load_img_src = function(img_dm){
    let self_img = img_dm.dataset.src
    // 绝对地址时直接使用，否则需要重新获取地址
    let img_url = /^http(s)?/.test(self_img) ? self_img : Vue.prototype.get_file_path(self_img,img_dm.getAttribute('data-csid'));
    image_is_exist(img_url,img_dm).then( res => {
      if(res) return
      img_dm.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      // 队名图标的处理逻辑
      let team_letter = img_dm.dataset.team
      if(team_letter != 'undefined'){
        let default_img = /[a-z]/i.test(team_letter) ? team_letter : 'logo'
        img_dm.classList.add('team-logo-'+default_img)
        if(typeof letter_num[default_img] !== undefined){
          // let position = (parseInt(letter_num[default_img] * img_dm.clientWidth * 64 / 44 * 100) / 100) / 100
          // let every = img_dm.getBoundingClientRect().width  * letter_num[default_img] * (128 / 88)
          // let all = img_dm.getBoundingClientRect().width * 26 * (128 / 88)
          // 兼容部分手机浏览器下图标展示不完全（缩小精度）
          let every = img_dm.getBoundingClientRect().width  * letter_num[default_img] * 1.436
          let all = img_dm.getBoundingClientRect().width * 26 * 1.436
          img_dm.style = `background-position:0 -${every}px;background-size: 100% ${all}px!important;`
        }
        // 联赛图标
      }else{
        img_dm.classList.add('leagues-logo-default')
      }
      img_dm = null;
    })
    img_dm.removeAttribute('data-src')
  }

  /**
   * 检测图片是否存在
   * @param url
   */
  let image_is_exist = function (url,img) {
    return new Promise((resolve) => {
      // var img = new Image();
      img.onload = function () {
        if (this.complete == true) {
          resolve(true);
          // img = null;
        }
      }
      img.onerror = function () {
        resolve(false);
        // img = null;
      }
      if(url){
        img.src = url;
      }else{
        resolve(false);
      }
      img = null;
    })
  }

}
