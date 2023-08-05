/**
 * @Author: jiffy
 * @Date: 2023-07-30 14:41:55
 * @Description:
 */
import { cloneDeep, isObject } from "lodash";


//--------------------------------------------
import { uid } from "quasar";
// import { store } from "src/store/index.js"
// import { api_details,api_account } from "src/public/api/index"
const utils = {
  // 是否内嵌
  is_iframe: window.frames.length != parent.frames.length,
  // 是否加载播放器js
  is_load_player_js:false,
  // 是否已加载视频动画资源
  is_load_video_resources:false,
  /**
   * 获取url参数的方法 默认返回全部 {name:value}
   * @param {string} name 获取单个
   * @returns {name:value}|value
   */
  GetUrlParams(name) {
    const search_ary = location.search.slice(1).split("&");
    const obj = {};
    search_ary.forEach((item) => {
      const [key, value] = item.split("&");
      obj[key] = decodeURIComponent(value);
    });
    if (name) return obj[name];
    return obj;
  },
  /**
   * 深度合并方法 和lodash Merge不一样
   * @param {object} src 源
   * @param {object} target 目标
   * @returns {object} 返回深度合并后的对象
   * */
  deepMerge(src, target) {
    let key;
    const res = cloneDeep(src);
    for (key in target) {
      res[key] = isObject(res[key])
        ? deepMerge(res[key], target[key])
        : target[key];
    }
    return res;
  },
  // /**
  //  * @Description 加载视频动画资源
  //  * @param {object}
  //  * @param {undefined} undefined
  // */
  // load_video_resources(){
  //   if(this.is_load_video_resources) return
  //   this.is_load_video_resources = true
  //   if( this.timer_load_video){
  //     clearTimeout( this.timer_load_video)
  //     this.timer_load_video =null
  //   }
  //  this.timer_load_video = setTimeout( () => {
  //     api_details.post_video_refer().then( res => {
  //       // 获取视频动画域名
  //       let video_src = window.env.config.live_domains[0] || _.get(res, "data.data.referUrl",'')
  //       video_src = video_src.replace(/https?:/, "") + '?is_preload=1'
  //       let animation_src = _.get(res, "data.data.aniUrl",'')
  //       let obj = {
  //         video_src,
  //         animation_src
  //       }
  //       window.vue.$root.$emit('set_pre_video_src',obj)
  //     })
  //   },10000)
  // },
  /**
   * @Description 加载视频播放器js
   * @param {undefined} undefined
  */
  load_player_js(){
    if(this.is_load_player_js) return
    this.is_load_player_js = true
    let dplayer_el = document.createElement('script');
    let hls_el = document.createElement('script');

let  BUILD_VERSION=  window.env.config.BUILD_VERSION


    dplayer_el.src =   `${BUILD_VERSION?'/'+BUILD_VERSION:''}/lib/video/DPlayer.min.js`
    hls_el.src = `${BUILD_VERSION?'/'+BUILD_VERSION:''}/lib/video/hls.js`
    document.head.appendChild(dplayer_el)
    document.head.appendChild(hls_el)
  },
  /**
   * @description 获取 icon 的 url
   * @param  {type} var  desc
   * @return {string} url
   */
  get_icon_url(menu){
    let url = ''
    // 竞彩足球
     let domain = window.env.config.domain[window.env.config.current_env][0]
    let prefix_job = window.env.config.api.API_PREFIX_JOB
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
  get_uuid: function () {
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
   * @description: 数字转中文
   * @param {Integer} number 形如123的数字
   * @return {String} 返回转换成的形如 一百二十三 的字符串
   */
  numberToChinese: function (number) {
    // // 单位 字符
    let t = {units: '个十百千万@#%亿^&~', chars: '零一二三四五六七八九',}
    let a = (number + '').split(''), s = [];
    if (a.length > 12) {
      throw new Error('too big');
    } else {
      for (var i = 0, j = a.length - 1; i <= j; i++) {
        if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
          if (i == 0) {
            if (a[i] != '1') s.push(t.chars.charAt(a[i]));
          } else {
            s.push(t.chars.charAt(a[i]));
          }
        } else {
          s.push(t.chars.charAt(a[i]));
        }
        if (i != j) {
          s.push(t.units.charAt(j - i));
        }
      }
    }
    //return s;
    return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
      b = t.units.indexOf(d);
      if (b != -1) {
        if (d == '亿') return d;
        if (d == '万') return d;
        if (a[j - b] == '0') return '零'
      }
      return '';
    }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
      return b;
    }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
      return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
    }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
      c = t.units.indexOf(d);
      if (c != -1) {
        if (a[j - c] == '0') return d + '零' + b
      }
      return m;
    });
  },

  /**
   * @description 根据 ms 返回是否是滚球
   * @param  {number} ms  赛事的当前状态
   * @oaran {array} exclude 排除的状态
   * @return {number} is_play 是否滚球：0 非滚球 1 滚球
   */
  get_match_status(ms,exclude){
    let _ms = Number(ms)
    // 为滚球的所有状态
    let all_ms = [1,2,7,10,110]

    // 排除某些滚球状态
    if(exclude){
      all_ms = all_ms.concat(exclude).filter(v => !all_ms.includes(v) || !exclude.includes(v))
    }

    // 非滚球
    let is_play =  0
    // 进行中,暂停,延迟,比赛中断,即将开赛
    if(all_ms.includes(_ms)){
      is_play = 1
    }

    return is_play
  },


  /**
   * @description: 将赛事数据列表/对象转换成c8命令结构体
   * @param {Array/Object} match_any 赛事数据列表/对象
   * @return {Object} 转换后的C8 对象
   */
  ws_c8_obj_format(match_any){
    let ret = {};
    if(match_any){
      if(Array.isArray(match_any)){
        match_any.map(match => {
          if(match.mid){
            ret[match.mid] = {mid:match.mid, ms:match.ms, csid:match.csid, mess:match.mess, mmp:match.mmp, hpids:[]};
          }
        })
      } else{
        if(match_any.mid){
          ret[match_any.mid] = {mid:match_any.mid, ms:match_any.ms,  csid:match_any.csid, mess:match_any.mess, mmp:match_any.mmp, hpids:[]};
        }
      }
    }
    return ret;
  },
  /**
   * @description: url地址增加参数
   * @param {String} url
   * @param {String} param_key
   * @param {String} param_val
   * @return {String}
   */
  url_add_param(url,param_key,param_val){
    let ret = url;
    if(ret && typeof(ret)=='string'){
      ret = `${ret}${((ret.indexOf('?') == -1)?'?':'&')}${param_key}=${param_val}`;
    }
    return ret;
  },
  /**
   * @description: 获取国际化模板信息,进行二次操作
   * @param {String} t_path 国际化信息路径
   * @param {Number} csid 赛事种类
   * @return {Array} 国际化字符串信息
   */
  get_match_tpl_title(t_path, csid){
    let ret = _.cloneDeep(window.vue.$root.$t(t_path));
    try {
      if(csid){
        if(window.vue.$i18n.locale == 'en'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
          switch (t_path) {
            case 'list.match_tpl_title.tpl7.bet_col':
              if(ret && ret[2] && ret[2] == '1X2'){
                if(csid == 2) { //2-篮球
                  ret[2] = window.vue.$root.$t('list.play_name_other_name.play_capot_name2');
                }
              }
              break;
            case 'list.match_tpl_title.tpl0.bet_col':
            case 'list.match_tpl_title.tpl16.bet_col':
              if(ret){
                if(csid == 2 || csid == 6) { //2-篮球
                  let cur_title =  window.vue.$root.$t('list.play_name_other_name.play_capot_name2')
                  ret[0] = cur_title;
                 ret[3] &&  (ret[3] = ret[3].replace('1x2',cur_title))
                } else if(!(csid == 4 || csid == 1)){
                  ret[0] = window.vue.$root.$t('list.play_name_other_name.play_capot_name1');
                }
              }

              break;

            default:
              break;
          }
        } else if(window.vue.$i18n.locale == 'vi'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球
          switch (t_path) {
            case 'list.match_tpl_title.tpl9.bet_col':
              if(ret && ret[0] && ret[0] == '1X2'){
                if(csid == 5) { //5-网球
                  ret[0] = window.vue.$root.$t('list.play_name_other_name.play_capot_name1');
                }
              }
              break;
            default:
              break;
          }
        } else if(window.vue.$i18n.locale == 'zh'){
          // csid：1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 11-手球
          switch (t_path) {
            case 'list.match_tpl_title.tpl0.bet_col':
              if(ret){
                if(csid == 11) { //11-手球
                  ret = _.cloneDeep(window.vue.$root.$t('list.match_tpl_title.tpl0.bet_col_csid_11'));
                }
              }
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
    return ret;
  },

  // /**
  //  * @description: 是否显示sr标志入口图标
  //  * @param {Object} match 赛事信息
  //  * @return {Boolean} 显示结果
  //  */
  // is_show_sr_flg(match){
  //   let ret = false;
  //   if([1,2].includes(+match.csid) && store.getters.get_global_switch.statistics_switch){
  //     ret = true;
  //   }
  //   if(!(window.env &&  window.env.config && window.env.config.FINAL_TARGET_PROJECT_NAME == 'yabo'))
  //   { // 只有专业版显示sr标志入口图标
  //     ret = false;
  //   }
  //   return ret;
  // },
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
 * 根据hpid判断显示的队名
 * @param  {object} play_data
 * @return {boolean}
 */
  hpid_show_team(play_data) {
    let hpid_list =
      ['12','28', '121', '149', '4', '19', '37', '39', '46', '52', '58', '64', '143', '113', '154', '155', '163', '181', '185', '172', '176', '253', '268', '243', '249','30001','30006'];
    return hpid_list.includes(_.get(play_data, 'hl._play.hpid'));
  },

  /**
   * @description: 获取指定时区的Date对象(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {Date} 转换后的时区Date对象
   */
  format_time_zone(time,offset=8){
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return new Date(wishTime);
  },

  /**
   * @description: 获取指定时区的时间缀(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {Date} 转换后的时区时间缀
   */
   format_time_zone_millisecond(time,offset=8){
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return wishTime;
  },
  /**
   * @Description 获取格式化时间对象
   * @param {undefined} undefined
  */
  format_date_base_obj(value) {
    let time = new Date(parseInt(value));
    let y = time.getFullYear();
    let m = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + "").padStart(2, 0);
    let mm = (time.getMinutes() + "").padStart(2, 0);
    let s = (time.getSeconds() + "").padStart(2, 0);
    let w = time.getDay();
    return { y, m, d, h, mm, s, w };
  },
  /**
   * @description 切换左侧主菜单选中状态
   *
   * @param  {number} menu_id  菜单ID
   * @param  {number} menu_grade  第几级菜单
   * @return {undefined} undefined
   */
  switch_main_menu_select(menu_id,menu_type=1){
    if(menu_type==1){
      window.$menu.subMenuLoopClick(menu_id,)
    }
  },

  /**
   * @description 路由跳转（便于快速调试）
   *
   * @param  {string} location  地址
   * @return {undefined} undefined
   */
  redirect_router(location = '/home'){
    window.vue.$router.push(location)
  },
  /**
   * @Description 根据csid获取对应的模板ID
   * @param {undefined} undefined
  */
  csid_to_tpl_id(csid){
    csid = csid * 1
    let tpl_id = 99
    switch(csid){
      case 1: // 足球
      case 11:// 手球
        tpl_id = 0
        break
      case 2: // 篮球
        tpl_id = 7
        break
      case 3: // 棒球
        tpl_id = 17
        break
      case 4: // 冰球
        tpl_id = 16
        break
      case 5: // 网球
        tpl_id = 9
        break
      case 6: // 美足
        tpl_id = 0
        break
      case 7: // 斯诺克
      case 8: // 乒乓球
      case 9: // 排球
      case 10: // 羽毛球
      case 13: // 沙滩排球
        tpl_id = 11
        break
      case 12: // 拳击
        tpl_id = 19
        break
      case 14: // 橄榄球
      case 15: // 曲棍球
      case 16: // 水球
        tpl_id = 20
        break
      case 100: // lol
      case 101: // dota2
      case 102: // CSgo
      case 103: // 王者荣耀
        tpl_id = 'esports'
        break
    }
    return tpl_id
  },
  /**
   * @Description 是否电竞的球种ID
   * @param {undefined} undefined
  */
  is_eports_csid(csid){
    // 英雄联盟100  dota2 101 csgo 102 王者荣耀103
    return [100,101,102,103].includes(+csid)
  },
  /**
   * @Description 是否虚拟体育的球种ID
   * @param {undefined} undefined
  */
  is_virtual_csid(csid){
    // 虚拟足球1001  虚拟赛狗1002  虚拟篮球1004 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
    return [1001,1002,1004,1010,1011,1009].includes(+csid)
  },
  /**
   * @description: 数据合并优化版函数
   * @param {*} obj_obj 旧数据
   * @param {*} src_obj 新数据
   */
   merge_with(obj_obj, src_obj){
    let customizer = (objValue, srcValue) => {
      let res = objValue;
      // 数据类型
      let type = typeof(objValue);
      if('object' == type){
        if(Array.isArray(objValue)){
          type = 'array';
        }
      }
      // console.error(type,'=====>',objValue);
      // 根据数据类型进行逻辑处理
      if('object' == type){
        // 为对象的操作
        if(!srcValue){
          res = srcValue;
        } else {
          for (const key in objValue) {
            if (objValue[key]) {
              if(srcValue[key] == undefined){
                // 删除右侧没有的对象key数据
                delete objValue[key]
              } else {
                // if(typeof(objValue[key]) == 'object'){
                //   // this.mergeWith2(objValue[key], srcValue[key],0);
                // }
              }
            }
          }
        }
      } else if('array' == type){
        // 为数组的操作
        let len = srcValue.length;
        // 删除多余的数组项
        objValue.splice(len,objValue.length-len);
      } else {
        // 普通类型不做处理
      }
    }
    _.mergeWith(obj_obj, src_obj,customizer);
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
    try {
      let url_search = new URLSearchParams(location.search);
      // 获取诸葛埋点开关
      let gtag = url_search.get('gtag');
      if(gtag){
        // 设置诸葛埋点开关
        window.gtag_run = 1;
      }
    } catch (error) {
      console.error(error)
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
      window.gtag('config', window.env.config.GA_TRACKING_ID,{user_id});
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
      window.gtag('config', window.env.config.GA_TRACKING_ID, {
        'page_title' : title, // 'homepage',
        'page_path': path, // '/home'
        user_id,// 用户信息
      });
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
        user_id,// 用户信息
        value
      });
    }
  },

  /**
   * @description: zhuge埋点identify方法
   * @param {*} user_id
   * @param {*} obj
   * @return {*}
   */
  zhuge_identify(user_id, obj={}){
    if(window.zhuge_run && window.zhuge && user_id) {
      // 自定义属性
      // 增加设备标识
      obj.type = 'pc';
      // 识别用户
      window.zhuge.identify(user_id,obj)
    } else if(!user_id){
      // 阻止zhuge埋点事件发送
      window.zhuge_run = 0;
    }
  },

  /**
   * @description: zhuge埋点track方法
   * @param {*} eventLabel
   * @param {*} obj
   * @return {*}
   */
  zhuge_track(eventLabel,obj={}){
    if(window.zhuge_run && window.zhuge) {
      // 自定义事件
      window.zhuge.track(eventLabel,obj)
    }
  },
  /**
   * @Description 发送诸葛埋点事件----添加新的事件用这个方法
   * @param {string} eventLabel 事件标签名称
   * @param {undefined} eventPropsObj 要加的参数
  */
  send_zhuge_event(eventLabel, eventPropsObj = {}){
    let vx_get_user = {}
    // let vx_get_user = store.getters.get_user;
    let objKey = {
      clickTime: "点击时间",
      userName: "用户名",
      userId: "用户ID",
      merchantId: "商户ID",
      languageVersion: "语言版本",
      terminal: "访问终端",
      eventLabel: "事件标签"
    }
    let _obj = {
      [objKey.eventLabel]: eventLabel,
      [objKey.clickTime]: new Date().Format('yyyy-MM-dd hh:mm:ss'),
      [objKey.userName]: _.get(vx_get_user, 'userName'),
      [objKey.userId]: _.get(vx_get_user, 'userId'),
      [objKey.merchantId]: _.get(vx_get_user, 'mId'),
      [objKey.languageVersion]: _.get(vx_get_user, 'languageName'),
      [objKey.terminal]: "PC"
    };
    Object.assign(_obj, eventPropsObj);
    console.log(eventLabel, _obj);
    this.zhuge_track(eventLabel,_obj);
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
    }
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
    // 测试环境的key    c41f8b7cb97640838d90a73a0f077a43
    // 生产环境的key    5a0301efe0244733acb0488763592a6b
    window.zhuge.load(this.get_zhuge_config_obj().app_key, { //配置应用的AppKey-----替换为生产环境的Key
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
  //获取服务器时间
  get_remote_time() {
    let { local_time, remote_time } = {};
    // let { local_time, remote_time } =  store.getters.get_timestamp;
    let now = new Date().getTime()
    let time = remote_time + (now - local_time);
    return time;
  },
  // 获取不同环境的商户id
  get_zhuge_config_obj(){
    let zhuge_obj = {app_key:'', mid:''};

    // 测试环境的key    c41f8b7cb97640838d90a73a0f077a43
    // 生产环境的key    5a0301efe0244733acb0488763592a6b
    try {
      switch (window.env.config.current_env) {
        case 'local_dev': // 开发
          break;
        case 'local_test': // 测试
          zhuge_obj.app_key = 'c41f8b7cb97640838d90a73a0f077a43';
          // 1534069625510301696  统计时长，不统计埋点事件
          zhuge_obj.mid = ['1500802482958372864', '1534069625510301696'];
          break;
        case 'idc_pre': // 预发布
          break;
        case 'idc_sandbox': // 试玩
          break;
        case 'idc_lspre': // 隔离预发布
          zhuge_obj.app_key = 'c41f8b7cb97640838d90a73a0f077a43';
          zhuge_obj.mid = ['1534076760197566464', '1534076609261342720'];
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
   *
   *
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
  axios_api_loop({axios_api,params,fun_then=null,fun_catch=null,max_loop=3,timers=1000, loop_count=0,timer=0,error_codes=[]}){
    // loop_count 当前循环次数(只在内部回调时使用)
    // timer 异常调用时延时器对象(只在内部回调时使用)
    //调用接口数据
    axios_api(params).then(res => {
      clearTimeout(timer);
      let code = _.get(res,'data.code');
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
   * @Description 获取媒体索引
   * @param {string} type
   * @return {NUmber}  1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题
   *
   */
  get_media_icon_index(type){
      const media_icons = [
          'video',
          'animation',
          'studio',
          'anchor',
          'topic',
      ]
      return media_icons[type - 1] || media_icons.indexOf(type) + 1 || 1
  },
    /**
   * @description: 获取指定时区的时间戳(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {int} 转换后的时区的时间戳
   */
     format_time_zone_time(time,offset=8){
      var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
      var localTime = d.getTime();//获取的是毫秒级
      var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
      var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
      var wishTime= utc + (3600000*offset);
      return wishTime;
    },
   /**
   * @description 序列化比分
   * @param  {Array} msc
   * @return {object}
   */
    serialized_score(msc = [],is_init = false){
      let score_obj = {}
      if(is_init){
        score_obj = {
          S11:{
            home:'',
            away:''
          },
          S103:{
            home:'0',
            away:'0'
          },
          S5:{
            home:'',
            away:''
          },
          S10102:{
            home:'',
            away:''
          }
        }
      }
      // 遍历接口比分数据 转成比分对象
      _.each(msc, score_str => {
        let [key,value] = score_str.split('|')
        if(value){
          let [home,away] = value.split(':')
          score_obj[key] = {home,away}
        }
      })
      return  score_obj
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
   * C01赛事显示倒计时优化
   * @param  match 赛事信息   
   * @param  counting_time 显示时间
   *
   */
  counting_time_ctr_show_format(match,counting_time)
  {
    // counting_time 格式00:00
    let counting_time_ = counting_time;
    // C01赛事只显示分钟不显示秒
    if(_.get(match,'cds')=='C01' && _.get(match,'csid')==1 && counting_time){
      counting_time_ = _.get(counting_time_.split(':'),'[0]');
    } else if(_.get(match,'ctt')==1 &&  [1,2].includes(_.get(match,'csid',0)*1) && counting_time){
      // ctt (0 人 1机器)   atf (时间系数)
      counting_time_ = _.get(counting_time_.split(':'),'[0]');
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
    // C01赛事显示倒计时优化(使用每场比赛90分钟进行换算)
    if(_.get(detail_data,'cds')=='C01' && _.get(detail_data,'csid')==1){
      switch (_.get(detail_data,'mle')+'') {
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
    } else if(_.get(detail_data,'ctt')==1 && [1,2].includes(_.get(detail_data,'csid',0)*1)){
      // 是机器开出的虚拟赛事时,使用atf时间系数换算时间
      // ctt (0 人 1机器)   atf (时间系数)
      res=Number(_.get(this.detail_data,'atf',1))*step;
    }
    return res;
  }
};
export default utils;


