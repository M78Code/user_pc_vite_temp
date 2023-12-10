/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 全局注册
 */
 


import {tooltip} from "project_path/src/core/index.js"
 

import Icon from "project/activity/src/components/icon/icon.vue"
import load_data from "project/activity/src/components/load_data/load_data-h5.vue";

import * as error_mapping from "project/activity/src/config/error_code_mapping.js";
 
 
 
// 加载公共样式
import 'project/activity/src/css/common.scss';


// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";

const {BUILD_VERSION ,CURRENT_ENV,IS_DEV} = BUILD_VERSION_CONFIG

 
// 加载所有模板文件
// const require_all = require.context("project_theme", true, /\.scss$/)
// require_all.keys().forEach( item => require_all(item))

// 是否内嵌
window.is_iframe = window.frames.length != parent.frames.length
// const api_prefix = window.env.config.api.API_PREFIX_FILE_REAL

export default async (app) => {//app, router, store,


  window.set_prototype = function (key, val) {
    window[key] = val
  }
 

  /** 三方类库 **************************/
  // 重写console.log, 支持ws推送console.log日志
 
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
      if(IS_DEV)
      {
        // 生产环境不打印日志
        // mFun.call(console, ...arguments);
        var stack = getStackTrace() || ""
        var matchResult = stack.match(/\(.*?\)/g) || []
        var line = matchResult[1] || ""
        if(line) {
          for (var i in arguments) {
            try {
              if (typeof arguments[i] == 'object') {
                arguments[i] = JSON.stringify(arguments[i])
              }
              line = line.replace("(", "").replace(")", "")
              line = line.replace(/.*\/src\//,'/src/').replace(/\?.*\&/,'');
              arguments[i] += '             webpack-internal:///.' + line;
            } catch (error) {
            }
          }

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
    if(!IS_DEV){
      console.log = function(str){};
    }
  }

 
 
  // 用户相关的 全局 单实例 类
  // window.userCtr = userCtr
  // 全局图片路径前缀 区分本地/打包
 
  // HTMLImageElement扩展 play()和stop()， 用于控制gif播放
  if ('getContext' in document.createElement('canvas')) {
    HTMLImageElement.prototype.play = function() {
      if (this.storeCanvas) {
        // 移除存储的canvas
        this.storeCanvas.parentElement.removeChild(this.storeCanvas);
        this.storeCanvas = null;
        // 透明度还原
        // image.style.opacity = '';
        this.style.opacity = '';
      }
      if (this.storeUrl) {
        this.src = this.storeUrl;
      }
    };
    HTMLImageElement.prototype.stop = function() {
      const canvas = document.createElement('canvas');
      // 尺寸
      const width = this.width, height = this.height;
      if (width && height) {
        // 存储之前的地址
        if (!this.storeUrl) {
          this.storeUrl = this.src;
        }
        // canvas大小
        canvas.width = width;
        canvas.height = height;
        // 绘制图片帧（第一帧）
        canvas.getContext('2d').drawImage(this, 0, 0, width, height);
        // 重置当前图片
        try {
          this.src = canvas.toDataURL("image/gif");
        } catch(e) {
          // 跨域
          this.removeAttribute('src');
          // 载入canvas元素
          canvas.style.position = 'absolute';
          // 前面插入图片
          this.parentElement.insertBefore(canvas, this);
          // 隐藏原图
          this.style.opacity = '0';
          // 存储canvas
          this.storeCanvas = canvas;
        }
      }
    };
  }

  /**
   * @description: lodash debounce 防抖函数功能
   * @param {Function} func 要防抖动的函数
   * @param {number} wait 需要延迟的毫秒数
   * @param {Object}  options 选项对象
   *        options.leading=false {boolean} 指定在延迟开始前调用
   *        options.maxWait {number} 设置 func 允许被延迟的最大值
   *        options.trailing=true {boolean} 指定在延迟结束后调用
   */
  window.debounce=(func,wait,options)=>{
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
  window.throttle=(func,wait,options)=>{
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
  window.debounce_throttle_cancel=(fun)=>{
    if(fun && fun.cancel && (typeof(fun.cancel)=='function'))
    {
      fun.cancel();
    }
  }

  /**
   * @description: 获取图片完整网络路径
   * @param {String} path 图片路径
   * @return {String} csid 球种类型
   */
  window.get_file_path = ()=>''


  // 获取赛事阶段国际化字符串
  // @param: mmp-比赛阶段
  // @param: sport_type-球种
  window.mmpName = function (sportType, mmp) {
    let name = `mmp.${sportType}.${mmp}`
    let ret = i18n_t(`mmp.${sportType}.${mmp}`);
    return name == ret ? '' : ret;
  }

  /** 组件  **************************/

  // 可变色和大小的 icon
  app.component("icon", Icon);
  app.component("load-data", load_data);

  /** JS  **************************/

  // emit 常量 ：MITT_TYPES.常量
  
  // 错误码异常映射
  window.error_mapping = error_mapping;
 



  //提示框样式
  window.tooltip_style = 'background:rgba(0,0,0,0.8);padding:4px 5px;border-radius:0px;color:#fff'

  window.bar_style = {
    width: '14px',
    backgroundColor: '#1F222B',
    opacity: 1,
    zIndex: 500,
    border: '1px solid #282B37',
    borderBottom: 'none',
  }

  window.thumb_style = {
    width: "7px",
    background: "#3C3F4C",
    borderRadius: "4px",
    opacity: 1,
    zIndex: 501,
    right: '3.5px',
    cursor: 'pointer'
  }
  /** 指令  **************************/

  app.directive('img', {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind(el, binding) {
      el.setAttribute('data-src', binding.value[0])
      el.setAttribute('data-team', binding.value[1])
      el.setAttribute('data-csid', binding.value[2])
      el.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
      // 先设置透明 防止显示加载图片错误
      el.style.opacity = 0
    },
    // 当元素被插入到DOM中时
    inserted(el, binding) {
      if (IntersectionObserver) {
        img_observe(el)
      } else {
        load_img_src(el)
      }
    },
    // 当元素更新时
    update(el, binding) {
      if(binding.value[0] == binding.oldValue[0]){
        return
      }
      el.setAttribute('data-src', binding.value[0])
      el.setAttribute('data-team', binding.value[1])
      el.setAttribute('data-csid', binding.value[2])
      if (IntersectionObserver) {
        img_observe(el)
      } else {
        load_img_src(el)
      }
    },
    // 组件销毁
    unbind(el){
      if(el.is_show_io){
        el.is_show_io.disconnect();
      }
    },
  })

  app.directive('check-img', {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind(el, binding) {
      el.setAttribute('data-src', binding.value.src)
      el.setAttribute('data-default', binding.value.default)
      el.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
      // 先设置透明 防止显示加载图片错误
      el.style.opacity = 0
    },
    // 当元素被插入到DOM中时
    inserted(el) {
      load_img_src_common(el)
    },
    // 当元素更新时
    update(el, binding) {
      if(binding.value.src == binding.oldValue.src){
        return
      }
      el.setAttribute('data-src', binding.value.src)
      el.setAttribute('data-default', binding.value.default)
      load_img_src_common(el)
    },
  })

  // 利用IntersectionObserver监听el 是否可视
  const img_observe = function(el) {
    el.is_show_io = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting) {
        load_img_src(el)
        el.is_show_io.disconnect();
      }
    })
    el.is_show_io.observe(el)
  }

  // 字母顺序
  const letter_num = {A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,}

  /**
   * @Description 加载图片
   * @param {object} el dom元素
   * @param {undefined} undefined
  */
  const load_img_src = function(el){
    let self_img = el.dataset.src
      // 绝对地址时直接使用，否则需要重新获取地址
      let img_url = /^http(s)?/.test(self_img) || /^\/\//.test(self_img) ? self_img : window.get_file_path(self_img,el.getAttribute('data-csid'));
      image_is_exist(img_url,el).then( res => {
        el.style.opacity = 1
        if(res) return
        el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        // 队名图标的处理逻辑
        let team_letter = el.dataset.team
        if(team_letter != 'undefined'){
          let default_img = /[a-z]/i.test(team_letter) ? team_letter : 'logo'
          el.classList.add('team-logo-'+default_img)
          if(letter_num[default_img]){
            let width = el.width || el.clientWidth
            let position = parseInt(letter_num[default_img] * width * 64 / 44 * 100) / 100
            el.style = `background-position:0 -${position}px`
          }
          // 联赛图标
        }else{
          el.classList.add('leagues-logo-default')
        }
        el = null;
      })
      el.removeAttribute('data-src')
  }

  /**
   * @Description 加载图片
   * @param {object} el dom元素
   * @param {undefined} undefined
  */
   const load_img_src_common = function(el){
    let self_img = el.dataset.src
    // 绝对地址时直接使用，否则需要重新获取地址
    let img_url = /^http(s)?/.test(self_img) ? self_img : window.get_file_path(self_img,el.getAttribute('data-csid'));
    image_is_exist(img_url,el).then( res => {
      el.style.opacity = 1
      if(res) return
      el.src = el.dataset.default
      el = null;
    })
    el.removeAttribute('data-src')
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
  // 图片懒加载指令
  app.directive('imgdef', {
    // 当元素被插入到DOM中时
    inserted(el, binding) {
      el.src = binding.value
    },
    // 当元素更新时
    update(el, binding) {
      el.src = binding.value
    }
  })

  /**
   * @Description 悬浮气泡鼠标经过
   * @param {object} e 鼠标经过事件
   * @param {undefined} undefined
  */
  const tooltip_enter = function(e){
    let el = e.target
    if(el.tip_cancel == 1){
      return
    }
    let tipid = el.tip_tipid
    let content = el.tip_content
    let time = el.tip_time
    let overflow = el.overflow
    let left = e.pageX - e.offsetX + el.offsetWidth / 2
    let top = e.pageY - e.offsetY - 24 - 6 - 4
    let style = `display: block;top:${top}px;left:${left}px;`
    let m_width = el.m_width
    let border_width = 0
    if(overflow){
      let css = getComputedStyle(el)
      border_width = Number(css.borderLeftWidth.replace('px','')) + Number(css.borderRightWidth.replace('px',''))
      style += `visibility:hidden;font-size:${css.fontSize};line-height:${css.lineHeight};font-weight:${css.fontWeight};`
    }
    if(overflow == 2){
      style += `width:${el.offsetWidth + 10}px;white-space:normal;word-break:break-all;height:auto;`
    }
    tooltip(content,style,time,tipid,el.getBoundingClientRect().width-border_width,el.offsetHeight,overflow,m_width)
  }

  /**
   * @Description 悬浮气泡鼠标离开
   * @param {undefined} undefined
  */
  const tooltip_leave = function(e){
    if(e.target.tip_cancel == 1){
      return
    }
    tooltip('cancel',0,0,0)
  }

  // 自定义悬浮气泡指令
  app.directive('tooltip',{
    // 指令绑定
    bind(el,bind){
      el.tip_cancel = bind.value.cancel === true ? 1 : 0
      el.tip_tipid = _.uniqueId()
      el.tip_content = bind.value.content
      el.tip_time = bind.value.time || 0
      el.overflow = bind.value.overflow || 0
      el.m_width = bind.value.m_width || 0
      el.onmouseenter = tooltip_enter
      el.onmouseleave = tooltip_leave
    },
    // 指令参数更新
    update(el,bind){
      el.tip_cancel = bind.value.cancel === true ? 1 : 0
      el.tip_content = bind.value.content
      el.tip_time = bind.value.time || 0
      if(bind.value.cancel === true){
        tooltip('cancel',0,0,el.tip_tipid)
      }
    },
    // 组件销毁
    unbind(el){
      tooltip('cancel',0,0,el.tip_tipid)
      el.onmouseenter = null
      el.onmouseleave = null
    },
  })

  /**
   * @Description v-icon指令，用于将quasar组件中自带的图标（Material Icon）替换为自定义的图标
   * Material Design 的图标是怎么生效的?参见：https://segmentfault.com/q/1010000002811943
   */
  app.directive('icon', {
    inserted(el, binding) {
      // binding.value即为替换icon的映射对象
      // 目标组件类名
      const target_class = el.classList[0]
      // 待替换图标icon名称 如chevron_left、chevron_right
      const replace_keys = Object.keys(binding.value)
      // 查找目标组件下待替换图标的icon元素集合
      const icons = target_class === 'q-icon' ? [el] : document.querySelectorAll(`.${target_class} i.material-icons`)

      // 替换目标组件下的icon
      icons.forEach(item => {
        replace_keys.forEach(key => {
          if (item.innerHTML === key) {
            item.classList.replace('material-icons', binding.value[key])
          }
        })
        item.innerHTML = ''
      })
    }
  })
}
