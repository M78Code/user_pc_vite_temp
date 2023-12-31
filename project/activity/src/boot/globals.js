import Icon from "project/activity/src/components/icon/icon.vue"
import load_data from "project/activity/src/components/load_data/load_data-h5.vue";
// 加载公共样式
import 'project/activity/src/css/common.scss';
// 本次打包的 客户端版本
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const {BUILD_VERSION ,CURRENT_ENV,IS_DEV} = BUILDIN_CONFIG 
export default async (app) => {//app, router, store,
  /** 三方类库 **************************/
  // 重写console.log, 支持ws推送console.log日志
  // 是否开启clog打印
  const clog = (SEARCH_PARAMS.init_param.get('clog') == 1)?1: ((location.href.indexOf('clog=1') != -1)?1:0);
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
      // console.log = function(str){};
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
  /** 组件  **************************/
  // 可变色和大小的 icon
  app.component("icon", Icon);
  app.component("load-data", load_data);
  /** JS  **************************/
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
}
