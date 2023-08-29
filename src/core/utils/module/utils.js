/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共方法对象定义
 */
import uid from "src/core/uuid/index.js";
const   BUILDIN_CONFIG = window.BUILDIN_CONFIG
export const utils = {
  // 是否内嵌
  is_iframe: window.frames.length != parent.frames.length,
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
    let ret = false;
    // store.getters.get_global_switch.statistics_switch
    let { statistics_switch=true}=      BUILDIN_CONFIG.SERVER_GLOBAL_SWITCH
    if([1,2].includes(+match.csid) && statistics_switch){
      ret = true;
    }
    if(!(window.env &&  window.BUILDIN_CONFIG && window.BUILDIN_CONFIG.FINAL_TARGET_PROJECT_NAME == 'yabo'))
    { // 只有专业版显示sr标志入口图标
      ret = false;
    }
    return ret;
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
};
 
