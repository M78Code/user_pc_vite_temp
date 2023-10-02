/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共方法对象定义
 */
import uid from "src/core/uuid/index.js";
import lodash from 'lodash'
import { date } from "quasar";
import { api_common, api_account } from 'src/api/index';
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { DateForMat } from "src/core/format/index.js"

const   BUILDIN_CONFIG = window.BUILDIN_CONFIG

export const utils = {

  // 是否加载播放器js
  is_load_player_js:false,
  // 是否已加载视频动画资源
  is_load_video_resources:false,
  timer1_: null,
  //用户切换的时间点(用于阻止用户过快点击)
  change_time:null,

  /**
   * @description 获取 icon 的 url
   * @param  {type} var  desc
   * @return {string} url
   */
  get_icon_url(menu){
    let url = ''
    // 竞彩足球
     let domain = window.BUILDIN_CONFIG.domain[window.BUILDIN_CONFIG.current_env][0]
    let prefix_job = window.BUILDIN_CONFIG.api.API_PREFIX_JOB
    let is_jing_cai = _.get(menu,'chinaBetting')==1
    if(is_jing_cai){
      url = `${domain}/${prefix_job}/${menu.field3}`
    }else{
      url = vue.get_file_path(menu.field3)
    }
    return url
  },
  /**
   * @Description:获取uuid(自动生成)
   * @Author success
   * @Date 2019/12/06 18:00:10
   */
  get_uuid () {
    return (this.request_uuid = uid().replace(/-/g, ""));
  },
  /**
   * @Description:获取request_id(自动生成)
   * @Author success
   * @Date 2019/12/06 18:00:10
   */
  get_request_id: function () {
    var ret = "";
    var request_uuid = sessionStorage.getItem("request_uuid");
    if (request_uuid) {
      ret = `${request_uuid}-${new Date().getTime()}`;
    } else {
      var uuid_ = this.get_uuid();
      sessionStorage.setItem("request_uuid", uuid_);
      ret = `${uuid_}-${new Date().getTime()}`;
    }
    return ret;
  },
  // 删除数据,释放内存
  del: function (any) {
    if (any && _.isObject(any)) {
      if (any instanceof Array) {
        any.splice(0, any.length);
      } else {
        for (const key in any) {
          delete any[key]
        }
      }
    }
  },


  /**
   * @description: 是否显示sr标志入口图标
   * @param {Object} match 赛事信息
   * @return {Boolean} 显示结果
   */
  is_show_sr_flg(match){
    
    return true;
  },
  /**
    * 获取单个投注项信息
    * @param  {object} match
    * @param  {string} ol_index
    * @param  {string} field
    * @return {undefined} undefined
    */
  mx_get_bet_simple(match, ol_index, field) {
    let play = match.hps[0].hl[0];
    let value = "";
    switch (field) {
      case "play":
        value = play;
        break;
      case "oid":
        value = _.get(play, `ol.${ol_index}.${field}`);
        break;
      case "bet_data":
        value = _.get(play, `ol.${ol_index}`);
        break;
      case "ol_data":
        value = _.get(play, `ol.${ol_index}`);
        break;
      case "bet_id":
        value = {
          mid: match.mid,
          hid: _.get(play, `hid`),
          oid: _.get(play, `ol.${ol_index}.oid`)
        };
        break;
    }
    return value;
  },


  /**
   * @Description 获取滚动条宽度  quasar源码复制的
   * @param {undefined} undefined
  */
  getScrollbarWidth () {
    const
      inner = document.createElement('p'),
      outer = document.createElement('div');
    this.css(inner, {
      width: '100%',
      height: '200px'
    })
    this.css(outer, {
      position: 'absolute',
      top: '0px',
      left: '0px',
      visibility: 'hidden',
      width: '200px',
      height: '150px',
      overflow: 'hidden'
    })
    outer.appendChild(inner)
    document.body.appendChild(outer)
    const w1 = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let w2 = inner.offsetWidth
    if (w1 === w2) {
      w2 = outer.clientWidth
    }
    outer.remove()
    return w1 - w2
  },
  /**
   * @Description 设置css quasar源码复制的
   * @param {undefined} undefined
  */
  css (element, css) {
    const style = element.style
    Object.keys(css).forEach(prop => {
      style[prop] = css[prop]
    })
  },
    /**
     * @description: 隐藏首屏loading动画
     * @return {*}
     */
  loading_animation_hidden(){
    // 隐藏首屏loading动画
    document.getElementById('loading-root-ele').style.visibility = 'hidden';
  },
  /**
   * 设置隐藏多余文字（q-pagination bug）
   *
   */
  set_page_aria_hidden(){
    let nodes = document.querySelectorAll(".q-pagination [aria-hidden=true]")
    if(nodes.length < 1) return
    _.each(nodes, e => {
      e.style.display='none'
    })
  },
  url_exists(url){
    var  http = new  XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return  http.status != 404;
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
   * 阻止用户频繁点击切换
   */
  is_time_limit(time1=500){
    let flag = true;
    let now = new Date().getTime();
    if(!this.change_time || (now - this.change_time) > time1){
      flag = false;
      this.change_time = now;
    }
    return flag;
  },
  // 批量清除定时器
  clear_timer() {
    const timer_arr = [
        'timer1_',
        'scrollItemTimer',
        'scrollItemTimer2',
    ]

    for (const timer of timer_arr) {
      clearTimeout(this[timer])
      this[timer] = null
    }
  },
  /**
   * @Description 详情页资源预加载 或者 视频动画预资源
   * @param {object} aa
   * @param {undefined} undefined
   */
  load_video_resources(){
    if(this.is_load_video_resources) return
    this.is_load_video_resources = true

    clearTimeout(this.timer1_)
    const that = this
    this.timer1_ = setTimeout( () => {
      let param = {}
      that.send_gcuuid = uid();
      param.gcuuid = that.send_gcuuid;
      api_common.getVideoReferurl(param).then( res => {
        if(this.send_gcuuid != res.gcuuid) return;
        if (res.code == 200) {
          // 获取视频动画域名
          return
          let referUrls = window.BUILDIN_CONFIG.live_domains[0] || lodash.get(res,'data.referUrl');
          referUrls = referUrls.replace(/https?:/, "");
          let animation_src = lodash.get(res,'data.aniUrl');
          let video_src = referUrls[referUrls.length - 1] == '/' ? referUrls+'video.html' : referUrls+ '/video.html'
          let obj = {
            video_src,
            animation_src
          }
          useMittEmit( MITT_TYPES.EMIT_SET_PRE_VIDEO_SRC,obj)
        }
      }).catch(err => {
        console.log(err)
      })
    }, 10000 )
  },

  /**
   * @Description 加载视频播放器js
   * @param {undefined} undefined
  */
   load_player_js(){
    if(this.is_load_player_js) return
    this.is_load_player_js = true
    let dom_ = document
    let dplayer_el = dom_.createElement('script');
    let  BUILD_VERSION=  window.BUILDIN_CONFIG.BUILD_VERSION


    dplayer_el.src = `${BUILD_VERSION?'/'+BUILD_VERSION:''}/lib/video/DPlayer.min.js`
    // if (!/(iPhone|iPad|iPod|iOS|Mac OS)/i.test(navigator.userAgent)) {
      let hls_el = dom_.createElement('script');
      hls_el.src = `${BUILD_VERSION?'/'+BUILD_VERSION:''}/lib/video/hls.js`
      dom_.head.appendChild(hls_el)
    // }
    dom_.head.appendChild(dplayer_el)
  },
  /**
   * 点击自定义的tab 选项滑动到中间动画
   * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
   * 2)接着向右移动容器一半的距离 containWidth / 2
   * 3)最后向左移动item一半的距离 offsetWidth / 2
   * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素，scrollItem 点击下标的元素 ）
   * @return {Undefined} undefined
   */
  tab_move: function(currentIndex, scrollBox, scrollItem, whether_to_slide) {
    if(!scrollBox || !scrollItem || !scrollItem[currentIndex]) return
    let lastSpot = scrollBox.scrollLeft
    let nextSpace = whether_to_slide ? 70 : 7 //每次移动距离
    if(whether_to_slide == 'no_fast') nextSpace = 7

    clearInterval(this.scrollItemTimer)
    this.scrollItemTimer = setInterval(() => {
      if(!scrollItem || !scrollItem[currentIndex]) return;
      let offsetWidth = scrollItem[currentIndex].offsetWidth //item
      let scrollLeft = scrollItem[currentIndex].offsetLeft //选中的元素滚到可视区域的最左边
      const containWidth = scrollBox.offsetWidth //容器的宽度
      let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2 //最终要停留的点
      if (Math.abs(lastSpot - resultSpot) < nextSpace) {
        clearInterval(this.scrollItemTimer)
      }
      if (resultSpot >= lastSpot) {
        lastSpot = lastSpot + nextSpace
      } else {
        lastSpot = lastSpot - nextSpace
      }
      try {
        scrollBox.scrollTo(lastSpot, 0)
      } catch (error) {
        console.error(error)
      }
    }, whether_to_slide ? '' : 15)
  },
  /**
   * 点击自定义的tab 选项滑动到中间动画
   * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
   * 2)接着向右移动容器一半的距离 containWidth / 2
   * 3)最后向左移动item一半的距离 offsetWidth / 2
   * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素）
   * @return {Undefined} undefined
   */
   tab_move2: function(currentIndex, scrollBox, whether_to_slide) {
    if(!scrollBox || !scrollBox.children || !scrollBox.children[currentIndex]) return
    let item = scrollBox.children[currentIndex]
    let lastSpot = scrollBox.scrollLeft
    let nextSpace = whether_to_slide ? 70 : 7 //每次移动距离
    if(whether_to_slide == 'no_fast') nextSpace = 7

    clearInterval(this.scrollItemTimer2)
    this.scrollItemTimer2 = setInterval(() => {
      if(!item) return;
      let offsetWidth = item.offsetWidth //item
      let scrollLeft = item.offsetLeft //选中的元素滚到可视区域的最左边
      const containWidth = scrollBox.offsetWidth //容器的宽度
      let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2 //最终要停留的点
      if (Math.abs(lastSpot - resultSpot) < nextSpace) {
        clearInterval(this.scrollItemTimer2)
      }
      if (resultSpot >= lastSpot) {
        lastSpot = lastSpot + nextSpace
      } else {
        lastSpot = lastSpot - nextSpace
      }
      try {
        scrollBox.scrollTo(lastSpot, 0)
      } catch (error) {
        console.error(error)
      }
    }, whether_to_slide ? '' : 15)
  },
  to_thousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },
  /**
   * @Description:获取uuid(自动生成)
   * @Author success
   * @Date 2019/12/06 18:00:10
   */
  get_uuid: function() {
    return (this.request_uuid = uid().replace(/-/g, ""));
  },
  // 删除数据,释放内存
  del :function(any){
    if(any&&(typeof any) == 'object')
    {
      if(any instanceof Array){
        for (let i = 0; i < any.length; i++) {
          any.splice(i,1);
          i--;
        }
      } else{
        for (const key in any) {
          delete any[key]
        }
      }
    }
  },
  /**
   *@description 用oid找出id_
   *@param {String} oid 投注项id
   *@param {Object} bet_obj 投注项数据集合
   *@return {String} id_
   */
  calc_id(oid,bet_obj) {
    let id_;
    for (let item of Object.values(bet_obj)) {
      if (item.cs.oid == oid) {
        id_ = item.cs.id_;
        break;
      }
    }
    return id_;
  },

  /**
   * @description: 菜单列表数量更新使用--菜单列表转换成对象
   * @param {Array} list 菜单列表
   * @param {Object} obj 菜单对象集合(输出信息)
   * @return {Boolean} 转换结果
   */
  menu_to_obj(list, obj) {
    var ret = true;
    if (list&& (list instanceof Array)) {
      list.forEach(item => {
        this.menu_item_to_obj(obj, item);
      });
    } else{
      ret = false;
    }
    return ret;
  },

  /**
   * @description: 菜单列表数量更新使用--菜单转对象
   * @param {Object}  obj 菜单对象
   * @param {Object} menu_item 菜单对象集合(输出信息)
   */
  menu_item_to_obj(obj, menu_item) {
    if (menu_item && (menu_item.menuId)) {
      let list = menu_item.subList;
      if (list && (list instanceof Array)) {
        list.forEach(item => {
          this.menu_item_to_obj(obj, item);
        });
      }
      let item_temp = {containLive:menu_item.containLive, count:menu_item.count, menuId:menu_item.menuId}
      obj[menu_item.menuId] = item_temp;
    }
  },

  /**
   * @description: 菜单列表数量更新使用--菜单列表转换成对象
   * @param {Array} list 菜单列表
   * @return {Array} 转换后的菜单数量列表
   */
  menu_to_list_menu_conut(list) {
    var ret = [];
    let obj = {};
    let res = this.menu_to_obj(list, obj)
    if(res){
      ret = Object.values(obj);
    }
    return ret;
  },

  /**
   *@description 根据result 的值返回是否赢钱
         "0": '未知',
         "1": '未知',
         "2": '走水',
         "3": '输',
         "4": '赢',
         "5": '赢半',
         "6": '输半',
   *@param {Number} val result的值
   *@return {Boolean}
   */
  calc_win(val){
    if(val != undefined && (val == 4 || val == 5)){
      return true
    }else{
      return false
    }
  },

  /**
   * @description: 埋点Google Analytics GA_TRACKING_ID config配置
   * @param {*} user_id 用户id
   * @return {*}
   */
  gtag_config_send(user_id){
    // 设置默认启动参数
    // GA 埋点开关开启---照常统计，和生产环境保持一致
    window.gtag_run = 1;
    let url_search = new URLSearchParams(location.search);
    // 获取诸葛埋点开关
    let gtag = url_search.get('gtag');
    if(gtag){
      // 设置诸葛埋点开关
      window.gtag_run = 1;
    }
    // 诸葛埋点开关关闭时,直接终止
    if(!window.gtag_run){
      return
    }
    if(user_id){
      // 设置用户ID持久化
      sessionStorage.setItem('user_id',user_id);
    } else {
      // user_id无效时情况上次的缓存
      sessionStorage.setItem('user_id','');
      return;
    }
    if(!window.INIT_GTAG && window.gtag_run){
      // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
      //   return;
      // }
      // 初始化埋点信息
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { dataLayer.push(arguments); }
      window.gtag('js', new Date());
      // 配置埋点信息
      window.gtag('config', window.BUILDIN_CONFIG.GA_TRACKING_ID,{user_id});
      // 设置埋点是否已经配置过
      window.INIT_GTAG = true;

    }
  },

  /**
   * @description: 埋点发送网页跟踪信息
   * @param {*} title 网页的标题（例如“首页”）
   * @param {*} path 网址的路径部分。此值应以斜杠 (/) 字符开头
   * @return {*}
   */
  gtag_view_send(title, path){
    let user_id = sessionStorage.getItem('user_id');
    if(user_id && window.gtag_run){
      // 初始化埋点Google Analytics GA_TRACKING_ID config配置
      if(!window.INIT_GTAG){
        this.gtag_config_send(user_id);
      }
      // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
      //   return;
      // }
      // 埋点发送网页跟踪信息
      window.gtag('config', window.BUILDIN_CONFIG.GA_TRACKING_ID, {
        'page_title' : title, // 'homepage',
        'page_path': path, // '/home'
        user_id,// 用户id
      });
      // console.log('gtag_view_send:'+JSON.stringify({title, path}));
    }
  },
  /**
   * @description: 埋点发送事件跟踪信息
   * @param {*} action 事件报告中显示为事件操作的字符串
   * @param {*} category 显示为事件类别的字符串
   * @param {*} label 显示为事件标签的字符串
   * @param {*} value 显示为事件价值的非负整数
   * @return {*}
   */
  gtag_event_send(action, category, label, value){
    let user_id = sessionStorage.getItem('user_id');
    if(user_id && window.gtag_run){
      // 初始化埋点Google Analytics GA_TRACKING_ID config配置
      if(!window.INIT_GTAG){
        this.gtag_config_send(user_id);
      }
      // if (!['393605793762643968', '393605857419595776', '393605916458618880', '393605993054998528', '393606048289787904'].includes(user_id)) {
      //   return;
      // }
      // 埋点发送事件跟踪信息
      window.gtag('event', action, {
        'event_category': category,
        'event_label': label,
        user_id,// 用户id
        value
      });
      console.log('gtag_event_send:'+JSON.stringify({action, category, label, value}));
    }
  },
  /**
   * @description: zhuge埋点identify方法(识别用户)
   * @param {*} user_id
   * @param {*} obj
   * @return {*}
   */
   zhuge_identify(user_id, obj={}){
    if(window.zhuge_run && window.zhuge && user_id) {
      // 增加自定义属性
      obj.type = 'h5';
      // 识别用户
      window.zhuge.identify(user_id,obj)
      console.log('zhuge identify: ',JSON.stringify({user_id, obj}));
    } else if(!user_id){
      // 阻止zhuge埋点事件发送
      window.zhuge_run = 0;
    }
  },

  /**
   * @description: zhuge埋点setSuperProperty方法(设置事件通用属性)
   * @param {*} obj 通用属性
   * @return {*}
   */
   zhuge_setSuperProperty(obj={}){
    if(window.zhuge_run && window.zhuge) {
      // 设置事件通用属性
      window.zhuge.setSuperProperty(obj);
      console.log('zhuge setSuperProperty: ',JSON.stringify({ obj}));
    }
  },

  /**
   * @description: zhuge埋点track方法(自定义事件)
   * @param {*} eventLabel
   * @param {*} obj
   * @return {*}
   */
  zhuge_track(eventLabel,obj={}){
    if(window.zhuge_run && window.zhuge) {
      // 自定义事件
      window.zhuge.track(eventLabel,obj)
      console.log('zhuge track: ',JSON.stringify({eventLabel,obj}));
    }
  },
  /**
   * 发送诸葛埋点事件
   * @param {*} name 事件标签
   * @param {*} user_info 用户信息
   * @param {*} eventPropsObj 新增的属性键值对
   */
  zhuge_event_send(name, user_info, eventPropsObj = {}) {
    let objKey = {
      clickTime: "点击时间",
      userName: "用户名",
      userId: "用户ID",
      merchantId: "商户ID",
      languageVersion: "语言版本",
      terminal: "访问终端",
      eventLabel: "事件标签",
    }
    let _obj = {
      [objKey.eventLabel]: name,
      [objKey.clickTime]: DateForMat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      [objKey.userName]: lodash.get(user_info, 'userName'),
      [objKey.userId]: lodash.get(user_info, 'userId'),
      [objKey.merchantId]: lodash.get(user_info, 'mId'),
      [objKey.languageVersion]: lodash.get(user_info, 'languageName'),
      [objKey.terminal]: "H5",
    };
    Object.assign(_obj, eventPropsObj)
    this.zhuge_track(name, _obj);
  },

  /**
   * @description: 加载诸葛sdk JS
   * @param {*} mid 商户id
   * @return {*}
   */
   zhuge_load_sdk_js(mid=0){
    // 设置默认启动参数
    window.zhuge_run = (mid && this.get_zhuge_config_obj().mid.includes(mid));
    try {
      let url_search = new URLSearchParams(location.search);
      // 获取诸葛埋点开关
      let zhuge = url_search.get('zhuge');
      if(zhuge){
        // 设置诸葛埋点开关
        window.zhuge_run = 1;
      }
    } catch (error) {
      console.error(error)
    }
    // 诸葛埋点开关关闭时,直接终止
    if(!window.zhuge_run){
      return
    }
    if (window.zhuge) return;
    window.zhuge = [];
    window.zhuge.methods = "_init identify track trackRevenue getDid getSid getKey setSuperProperty setUserProperties setWxProperties setPlatform".split(" ");
    window.zhuge.factory = function(b) {
      return function() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift(b);
        window.zhuge.push(a);
        return window.zhuge;
      }
    };
    for (var i = 0; i < window.zhuge.methods.length; i++) {
      var key = window.zhuge.methods[i];
      window.zhuge[key] = window.zhuge.factory(key);
    }
    window.zhuge.load = function(b, x) {
      if (!document.getElementById("zhuge-js")) {
        var a = document.createElement("script");
        var verDate = new Date();
        var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

        a.type = "text/javascript";
        a.id = "zhuge-js";
        a.async = !0;
        a.src = 'https://updata.yaohuakuo.com/zhuge.js?v=' + verStr;
        a.onerror = function() {
          window.zhuge.identify = window.zhuge.track = function(ename, props, callback) {
            if(callback && Object.prototype.toString.call(callback) === '[object Function]') {
              callback();
            } else if (Object.prototype.toString.call(props) === '[object Function]') {
              props();
            }
          };
        };
        var c = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(a, c);
        window.zhuge._init(b, x)
      }
    };
    // 测试环境key c41f8b7cb97640838d90a73a0f077a43
    // 生产环境的key  5a0301efe0244733acb0488763592a6b
    // 这里是生产环境的 Appkey，请不要改动
    window.zhuge.load(this.get_zhuge_config_obj().app_key, { //配置应用的AppKey
      superProperty: { //全局的事件属性(选填)
        '应用名称': 'paDataTest'
      },
      // debug: true,
      adTrack:false,     //广告监测开关，默认为false
      zgsee:false,      //视屏采集开关，默认为false
      autoTrack: true, //启用全埋点采集（选填，默认false）
      singlePage: true, //是否是单页面应用（SPA），启用autoTrack后生效（选填，默认false）,
      duration: false //页面停留时长采集开关，默认为false
    });
  },
  // 获取不同环境的商户id
  get_zhuge_config_obj(){
    let zhuge_obj = {app_key:'', mid:''};
    // 测试环境的key    c41f8b7cb97640838d90a73a0f077a43
    // 生产环境的key    5a0301efe0244733acb0488763592a6b
    try {
      switch (window.BUILDIN_CONFIG.current_env) {
        case 'local_dev': // 开发
          break;
        case 'local_test': // 测试
          zhuge_obj.app_key = 'c41f8b7cb97640838d90a73a0f077a43';
          // 1394602599797362688      ZB648
          zhuge_obj.mid = ['1500802482958372864', '1394602599797362688'];
          break;
        case 'idc_pre': // 预发布
          break;
        case 'idc_sandbox': // 试玩
          break;
        case 'idc_lspre': // 隔离预发布
          zhuge_obj.app_key = 'c41f8b7cb97640838d90a73a0f077a43';
          zhuge_obj.mid = ['1517403307839197184'];
          break;
        case 'idc_online': // 生产
          zhuge_obj.app_key = '5a0301efe0244733acb0488763592a6b';
          // 欧宝  1261540827428163584
          // KK  1452621933433720832
          // 亚盈  1452623150704627712
          // 88   1460568356368289792
          // 皇冠  1460568527676248064
          // BET365  1474704940109795328
          zhuge_obj.mid = ['1261540827428163584', '1452621933433720832', '1452623150704627712', '1460568356368289792', '1460568527676248064', '1474704940109795328'];
          break;
        case 'idc_ylcs': // 微型测试
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('get_zhuge_mid: ',error);
    }
    return zhuge_obj;
  },
  /**
   * @description: 获取指定时间戳的相应日期格式
   * @param timeStamp 时间戳
   * @param format  日期格式
   * @returns {string} 转换后的日期
   */
  formatDate(timeStamp, format = 'YYYY-MM-DD HH:mm:ss') {
    return date.formatDate(timeStamp, format)
  },
  /**
   * @description 数组元素交换
   * @param arr 目标数组
   * @param index1 待交换下标1
   * @param index2 待交换下标2
   * @returns {Array} 交换后的数组
   */
  swapArray(arr, index1, index2) {
    // arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    // return arr
    const tmp = arr[index2]
    arr[index2] = arr[index1]
    arr[index1] = tmp
    return arr
  },
  /**
   * @Description 根据球种ID获取球种中文名称
   * @param {undefined} undefined
  */
  csid_to_sport_name(csid){
    csid = parseInt(csid)
    let sport_name = ''
    switch(csid){
      case 1:
        sport_name = '足球'
        break
      case 2:
        sport_name = '篮球'
        break
      case 3:
        sport_name = '棒球'
        break
      case 4:
        sport_name = '冰球'
        break
      case 5:
        sport_name = '网球'
        break
      case 6:
        sport_name = '美式足球'
        break
      case 7:
        sport_name = '斯诺克'
        break
      case 8:
        sport_name = '乒乓球'
        break
      case 9:
        sport_name = '排球'
        break
      case 10:
        sport_name = '羽毛球'
        break
      case 11:
        sport_name = '手球'
        break
      case 12:
        sport_name = '拳击'
        break
      case 13:
        sport_name = '沙滩排球'
        break
      case 14:
        sport_name = '联合式橄榄球'
        break
      case 15:
        sport_name = '曲棍球'
        break
      case 16:
        sport_name = '水球'
        break
    }
    return sport_name
  },

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
    //this.$utils.axios_api_loop(obj_);
   *
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
   axios_api_loop({axios_api,params,fun_then=null,fun_catch=null,max_loop=3,timers=1000, loop_count=0,timer=0,error_codes=[],new_params}){
    // loop_count 当前循环次数(只在内部回调时使用)
    // timer 异常调用时延时器对象(只在内部回调时使用)
    // console.log({msg:'axios_api_loop',params,new_params,v:lodash.isEqual(params, new_params)}); // 比较新老参数方法
    // todo 传进来的params直接干掉,新的param直接在这里调用方法生成
    //调用接口数据
    axios_api(params).then(res => {
      clearTimeout(timer);
      let code = lodash.get(res,'data.code');
      if(error_codes.includes(code)){
        if(loop_count++>=(max_loop-1)){
          if(fun_catch){
            fun_then(res);
          }
        } else {
          timer=setTimeout(() => {
            this.axios_api_loop({axios_api,params,fun_then,fun_catch,max_loop,timers,loop_count,timer,error_codes});
          }, timers);
        }
      } else {
        if(fun_then){
          fun_then(res);
        }
      }
    }).catch(e => {
     console.error('----请求loop----', e)
      clearTimeout(timer);
      if(loop_count++>=(max_loop-1)){
        if(fun_catch){
          fun_catch(e);
        }
      } else {
        timer=setTimeout(() => {
          this.axios_api_loop({axios_api,params,fun_then,fun_catch,max_loop,timers,loop_count,timer,error_codes});
        }, timers);
      }
    });
  },
  /**
   * 上报URL
   * @param {*} params
   */
  upload_url_info(params) {
    return false
    api_account.upload_url_info(params).then(() => {

      console.log('URL上报成功');
    }).catch(error => {

      console.log('URL上报失败');
      console.log(error);
    })
  },
  /**
   * @description: 删除当前url中的指定参数
   * @param {*} key_arr
   * @return {*} url
   */
  remove_url_param(key_arr){
    let url_search = new URLSearchParams(location.search);
    // 删除  api
    if(key_arr){
      key_arr.forEach(key => {
        url_search.delete(key)
      });
    }
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
    return location.origin + "?" + new_search + new_hash;
  },
  /**
   * 平板访问时上报信息
   * @param {*} params
   */
  upload_tablet_comput(params) {
    api_account.upload_tablet_comput(params).then(() => {
      console.log('平板上报成功');
    }).catch(error => {
      console.log('平板上报失败');
      console.log(error);
    })
  },
    /**
     * rem 转换 像素值
     */
     rem_2_px(rem){

      let rem1px = window.innerWidth / 3.75; //1rem的像素值
      return  rem*rem1px .toFixed(2)
    },
    /**
     * 像素值转为rem
     */
    px_2_rem(px) {
      let rem1px = window.innerWidth / 3.75; //1rem的像素值
      return px / rem1px;
    },
    /**
     * @description 判断目标是否为整数
     * @param obj
     */
    is_integer(obj) {
      return Math.floor(obj) === obj
    },
    /**
     * 计算图片 路径  用于  img 标签
     * //当
     *  src/css/pro/bw3/variable.js  主题内 有用这张图片 （相当于 public 目录内的静态复制 ）
     *  并且 img 标签内有有用这张图片 的时候 打包方式最终 （webpack 托管哈希打包）是两张
     * 此事可以 使用此方法 让  img 标签 的 src 计算 路径 最终  和 主题内  图片一样 用  public 目录内的静态复制
     *
     * 最终目标是 ，代码打包出来加载的是同一张图片，不管是  webpack托管哈希的 还是 public 目录内的静态复制
     *
     * 特表留意 all_img_preloading 方法 的  预加载图片  两种形式 要和 img 标签 或者  variable.js 内的 统一
     *
     * 实现 方法本身 没有高低贵贱之分 ，没有好坏之分 ，保持单张图片 结果 统一就行
     *
     */
    compute_img_tag_src(path){
    if(BUILD_VERSION){
      return `/${BUILD_VERSION}${path}`
    }else{
      return `${BUILD_VERSION}${path}`
    }

    },

    // 用于判断收藏按钮是否可以触发
    judge_collectSwitch(collectSwitchStatus,vm){
      // 前端配置写死，世界杯后删除
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
      if(!collectSwitchStatus || ! window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.ENABLE_COLLECT_API ){
        vm.$toast(vm.i18n_t(`common.temporarily_unavailable`), 2000)
        return false
      }
      // 世界杯后恢复
      // if(!GlobalAccessConfig.get_collectSwitch()){
      //   this.$toast(i18n_t(`common.temporarily_unavailable`), 2000)
      //   return false
      // }
      return true
    },
    /**
     * @description 修改dom元素类名
     * @param domClassName string 要获取元素的类名
     * @param newName string 要修改成的类名
     * @return undefined
     */
    modify_dom_classname(domClassName, newName='') {
      let scrollContainerW = document.getElementsByClassName(domClassName)
      if (scrollContainerW.length > 0) {
        for(let i = 0; i < scrollContainerW.length > 0; i++) {
          scrollContainerW[i].className = newName
        }
      }
    },
    /**
     * @description 赛事显示倒计时优化显示
     * @param match 赛事信息
     * @param counting_time 需要显示的时间
     * @return undefined
     */
    counting_time_ctr_show_format(match,counting_time)
    {
      // counting_time 格式00:00
      let counting_time_ = counting_time;
      // 红猫赛事只显示分钟不显示秒
      if(lodash.get(match,'cds')=='1500' && lodash.get(match,'csid')==1 && counting_time){
        counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
      } else if(lodash.get(match,'ctt')==1 && [1,2].includes(lodash.get(match,'csid')*1) && counting_time){
        counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
      }
      return counting_time_;
    },
    /**
     * @description 虚拟赛事换算走表步长
     * @param match 赛事信息
     * @param step 原来的步长
     * @return 换算后的步长
     */
    match_vr_step(detail_data, step){
      let res = step;
      // 红猫赛事显示倒计时优化(使用每场比赛90分钟进行换算)
      if(lodash.get(detail_data,'cds')=='1500' && lodash.get(detail_data,'csid')==1){
        switch (lodash.get(detail_data,'mle')+'') {
          case '57': // 2 * 4分钟 加中场休息时间4分钟=>按照720秒换算
            res=7.5;
            break;
          case '66': // 2 * 5分钟  加中场休息时间4分钟=>按照840秒换算
            res=6.428571;
            break;
          case '55': //2 * 6分钟 (10.5s累加1分钟)
            res=5.7142;
            break;
          default:
            break;
        }
      } else if(lodash.get(detail_data,'ctt')==1 && [1,2].includes(lodash.get(detail_data,'csid')*1)){
        // 是机器开出的虚拟赛事时,使用atf时间系数换算时间
        // ctt (0 人 1机器)   atf (时间系数)
        res=Number(lodash.get(this.detail_data,'atf',1))*step;
      }
      return res;
    }
};

