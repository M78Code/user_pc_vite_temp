/**
 *
 *  用户相关的  控制类 实体对象 单个实例
 *  全局接口配置 相关的 配置
 *  主题色相关
 *  商户相关
 *
 *
 *
 *
 *
 */

 import {get_file_path} from "project/activity/src/public/utils/get_file_path.js"

 import axios from "axios";
 import pako_pb from "project/activity/src/public/utils/custom_pb_pako.js";
 import infoUpload from 'project/activity/src/public/utils/http/information_upload.js';
 const axios_instance = axios.create()



class userCtr {
  constructor() {
    this.init();
  }
  /**
   * 初始化
   */
  init() {
    //所有接口上报的 用户信息失效，这里不包含 OSS域名检测的  src\public\utils\http\all_domain.js
    //接口会去 清除 这个 统计 ， 连续累计 一定 次数才会弹出 token 失效
    this.all_expired_count = 0;
    //相邻接口报用户token 失效累计次数上限
    this.all_expired_count_max = 5;
    //最后一次 调用 getuserinfo 接口 返回用户 token 失效
    this.last_getuserinfo_expired = false;
    // token 过期 累加达到 上限， 延迟 xx秒 执行的  弹出 用户token 失效对应的弹窗  等 流程的  定时器
    this.token_expired_max_process_timer = null;
    // token 过期 累加达到 上限， 延迟 15秒 执行的  弹出 用户token 失效对应的弹窗  等 流程的  延迟时间
    this.token_expired_max_process_delay_time = 15000;
    // getUserInfo 原始数据备份 备份数据
    this.getuserinfo_res_backup= null;


  }
  /**
   *   调用 getuserinfo 接口返回值  数据备份
   *   因为存在 域名检测会走  getuserinfo ，返回体是不做加工的
   *   但是全局的 http 接口 经过处理    resolve(res.data)
   *   所以这个方法 的调用直接放在 axios_wapper 内  以及  域名检测逻辑内部就行
   *
   *   getuserinfo 返回code 是 0000000
   *   并且 res.data.data 有值  res.data.data.userId  用户ID 有值
   *
   */
  set_getuserinfo_res(res) {

    if(!res.data){ return false }
    if(_.get(res,'data.code')!="0000000"){ return false }
    if(!_.get(res,'data.data')){ return false }
    // 数据规整容错
    // getUserInfo 原始数据备份 备份数据
     this.getuserinfo_res_backup = JSON.stringify(res.data) ;

     //设置 商户层级的 配置的界面 相关的设置
     this.set_merchant_config(_.get(res,'data.data.configVO'))

        //  调用用户接口，更新 域名流程
    let oss = _.get(res,'data.data.oss',{});
    oss.gr = _.get(res, "data.data.gr","").toUpperCase();
    window.vue.$root.$emit('set_getuserinfo_oss_api', oss);
    //上传数据
    infoUpload.upload_data(_.get(res,'data.data',{}))
   }


  /**
   * 获取  和 调用 getuserinfo 接口 data 实体 数据
   * 这里 是经过加工的 标准化的数据 也可能是缓存下来的数据
   * 并且这个数据 是经过规整的 ，
   *  这里返回缓存的实体
   */
  get_getuserinfo_data() {
    if(!this.getuserinfo_res_backup){
      return null
    }else{
     let obj =  JSON.parse( this.getuserinfo_res_backup)
     obj.code = 200
     return obj
    }

   }
  /**
   * 检查 token 是否过期
   * @param only_getuserinfo  是否仅仅判断 getuserinfo 接口
   * @returns
   */
  check_token_if_expired(only_getuserinfo = false) {
    // 如果只判断 getuserinfo 接口返回情况
    if (only_getuserinfo) {
      return this.last_getuserinfo_expired;
    } else {
      //统计所有接口 相邻接口累积 报用户token 失效 次数是否 小于上限
      return this.all_expired_count < this.all_expired_count_max;
    }
  }
  // 解析判定 url
  jie_xi_url(url_temp = "") {
    //  截取 ?
    url_temp = url_temp.split("?")[0];
    //去除 ://
    if (url_temp.startsWith("://")) {
      url_temp = url_temp.slice(3);
    }
    // 是完整的链接
    let is_full_url =
      url_temp.startsWith("http://") || url_temp.startsWith("https://");
    // 为了兼容可能的错误  url_temp 带 http 开头 或者 不带   需要截取 纯粹的 pathname
    // 新的 url 片段
    let new_url_temp = url_temp;
    // 是完整的链接
    if (is_full_url) {
      new_url_temp = new URL(url_temp)["pathname"];
    }
    // 是否是  PB接口
    let is_pb = new_url_temp.endsWith("PB");
    return {
      is_full_url,
      new_url_temp,
      is_pb,
    };
  }
  /**
   * 通过 res.config.url  判定哪些纳入统计
   *   计算 all_expired_count
   *        last_getuserinfo_expired
   *  有些接口不纳入 统计
   * @param {*} res 请求 返回 拦截器内的 全部 res 实体
   */
  record_token_if_expired(res) {
    // 不纳入统计的接口，这些接口无关紧要 或者 不验证token
    let whitelist = ["/yewu11/v1/getSystemTime/currentTimeMillis"];
    // 统一规则计算后的 url
    let jiexi_result = this.jie_xi_url(res.config.url);
    // 计算后的 url 片段
    let url_temp = jiexi_result.new_url_temp;
    // 在白名单内 不纳入统计
    if (whitelist.includes(url_temp)) {
      return false;
    }
    // 以前的逻辑
    // res.data.code == "0401013" ||
    // (res.data.code == "0400500" &&
    //   url_temp.includes("user/getUserInfo"))
    // token失效
    if (res.data.code == "0401013") {
      if (url_temp.includes("user/getUserInfoPB")) {
        //最后一次 调用 getuserinfo 接口 返回用户 token 失效
        this.last_getuserinfo_expired = true;
      }
      //所有接口上报的 用户信息失效
      this.all_expired_count += 1;
      //检查 token 失效 是否 上限 流程
      this.check_if_token_expired_max();
    }
    // 返回数据 绝对正常 ，这个执行在 code 被重写之前
    if (res.data.code == "0000000") {
      //所有接口上报的 用户信息失效 清零
      this.all_expired_count = 0;
      // 如果有  token 过期 累加达到 上限 的 流程的定时器 就清除
      if (this.token_expired_max_process_timer) {
        clearTimeout(this.token_expired_max_process_timer);
        this.token_expired_max_process_timer=null
      }
      //调用 getuserinfo 接口返回值  数据备份
      if (url_temp.includes("user/getUserInfoPB")) {
        let data_temp = pako_pb.unzip_data(_.get(res, 'data.data'));
        res.data.data = data_temp;
         this. set_getuserinfo_res(res)
      }

    }
  }
  /**
   * 检查 token 失效 是否 上限 流程
   *
   * 连续累加token失效次数 判定 是否 弹出 token失效框 执行相关流程
   */
  check_if_token_expired_max() {
    //统计所有接口 相邻接口累积 报用户token 失效 次数  小于上限 则 不用执行 后面逻辑
    if (this.all_expired_count < this.all_expired_count_max) {
      return false;
    }
    // 当大于上限次数  ，开启计时器
    // 如果已经 有计时器 不用执行后面逻辑
    if (this.token_expired_max_process_timer) {
      return false;
    }
    // token 过期 累加达到 上限， 延迟 xx秒 执行的  弹出 用户token 失效对应的弹窗  等 流程的  定时器
    this.token_expired_max_process_timer = setTimeout(() => {
      // 执行前再次判断 是否超限
      // 如果超限
      if (this.all_expired_count >= this.all_expired_count_max) {
         // 设置登录无效
         window.vue.$store.commit("set_is_invalid", true);
        //显示登录失效弹窗
        setTimeout(() => {
          window.vue.show_fail_alert();
        }, 100);

        // 关闭WS
        if (window.ws) {
          window.ws.destroy(true);
        }
      } else {
        //如果不超限 //清除定时器
        if (this.token_expired_max_process_timer) {
          clearTimeout(this.token_expired_max_process_timer);
          this.token_expired_max_process_timer=null
        }
      }
    }, this.token_expired_max_process_delay_time);
  }


  /**
   *  用户信息的  内的 视频多久 无操作 时间判定
   */
   compute_video_no_handle_time(res){

          // 长时间未操作暂停视频开关   1开启; 0关闭
          let center_video_time = _.get(res,'data.videoManageVo.closedWithoutOperation', 0);
          // 观看时间设置 0默认时间 1自定义时间
          let close_video_time_settings = _.get(res,'data.videoManageVo.videoSettings', 0);
          // 长时间未操作暂停视频时间(自定义时间)
          let close_video_time_custom = _.get(res,'data.videoManageVo.customViewTime', 0);
          // 长时间未操作暂停视频时间(默认时间)
          let close_video_time = _.get(res,'data.videoManageVo.viewingTime', 0)
          let setting_no_handle_time = (close_video_time_settings ? close_video_time_custom : close_video_time) * 1000 * 60
          // 商户级别视频流量管控开关 1开启、0关闭
          let config_video_switch = _.get(res, 'data.videoManageVo.videoSwitch', 0);
          // 系统级别视频流量管控总开关   '1'开启、'0'关闭
          let config_video_time = _.get(res, 'data.videoManageVo.configValue', 0);
          // 检查暂停视频开关是否开启 与 用户是否长时间未操作
          if(1*config_video_time != 0 && config_video_switch != 0 && center_video_time != 0 && setting_no_handle_time != 0){
           return  setting_no_handle_time

          }else{
            return  0
          }



   }




  /**
   *  用户信息的 gr 分组参数 判定 流程
   */

  check_getuserinfo_gr(res){

    let   reload_flg = false;
      // 获取用户分组信息
      let gr = _.get(res,'data.gr');
      if(gr) {


        gr = gr.toLocaleUpperCase();
        // localStorage持久化用户分组信息
        sessionStorage.setItem('gr',gr)

        if(window.env.config.gr != gr){


          let url_search = new URLSearchParams(location.search);
        //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
        url_search.set("rdm", new Date().getTime());
        // 删除  api
        url_search.delete('api')
        SEARCH_PARAMS.init_param_del(['api']);
        // 增加GR 参数
        url_search.set("gr", gr);
        SEARCH_PARAMS.init_param_set({gr})

        console.log("new url 1", new URL(location.href));
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
        let new_url = location.origin + "?" + new_search + new_hash;
        console.log("new_url-", new_url);
           // 分组不正确,重新刷新页面
           location.replace(new_url);
              // 分组不正确,重新刷新页面
              // location.reload();
             reload_flg = true;
        }



      } else {

        sessionStorage.setItem('gr','')
      }

   return reload_flg

  }



/**
 * 商户 设置 预览 ，这个时候无 token
 */

  async handle_merchant_setup_preview(){
    let params, partnerId
    if(location.href.indexOf("?")!=-1){
      let res=location.href.match(/partnerId=([a-zA-Z0-9]*)/);
      if(res&&res.length>1){
        partnerId=res[1];
      }
    }
    if(partnerId){
      params={
        merchantCode:partnerId
      }

    }else{
      this.set_web_meta_by_config()
      return Promise.resolve(1)
    }


    let api_domains = window.env.config.domain[window.env.config.current_env];
    let api_domain = api_domains[0];


    try {
      let res = await  axios_instance.get(`${api_domain}/yewu12/user/getConfig`, {
        params ,
        timeout:10000,

      })
      let data = _.get(res,'data.data')
      if ( _.isPlainObject(data) ) {
        this.set_merchant_config(data)
      }else{
        this.set_web_meta_by_config()
      }


    } catch (error) {
      this.set_web_meta_by_config()

    }
   // 留着给 其他地方异步去处理 后续逻辑
   return Promise.resolve(1)

  }

  /**
   * 设置 商户层级的 配置的界面 相关的设置
   */

   set_merchant_config(merchant_config){

    if(_.isPlainObject(merchant_config)){

      sessionStorage.setItem('merchant_config_json', JSON.stringify(merchant_config))
    }



  }
  /**
   * 获取首页 的 默认的  banner 的 地址
   */
  get_banner_url_first_page(){
    let merchant_config_json = JSON.parse(sessionStorage.getItem("merchant_config_json"))
    let url = _.get(merchant_config_json,'bannerUrl')

    return  url

  }





/**
 * 计算设置 网页 基础信息的 最终配置
 */

compute_set_web_meta_config(){
    // http://test-user-h5-bw3.sportxxxifbdxm2.com/?jz=1&partnerId=489637#/
    let json = sessionStorage.getItem('merchant_config_json')
    let config =  _.get(window.env,'config.html_info') || {}
    if(json ){
     // 2.本身有token 但是token 失效了 ，这个时候 理论上 之前什么样还什么样，根本不用处理


     let merchant_config = JSON.parse(json)

     // 浏览器icon
     if(merchant_config.pcLogoUrl){
       config.icon = get_file_path(merchant_config.pcLogoUrl)
     }
     // 最大宽度
     if(merchant_config.inlineWidth){
       config.max_width = merchant_config.inlineWidth
     }
     // 主logo白色
     if(_.get(merchant_config,'configMap.1')){
       config.day_logo = get_file_path(merchant_config.configMap[1])
     }
     // 主logo黑色
     if(_.get(merchant_config,'configMap.2')){
       config.night_logo = get_file_path(merchant_config.configMap[2])
     }
     // 兼容页logo
     if(merchant_config.compatLogoUrl){
       config.compatible_logo = get_file_path(merchant_config.compatLogoUrl)
     }
     // loading图片
     if(merchant_config.loadLogoUrl){
       config.loadLogoUrl = get_file_path(merchant_config.loadLogoUrl)
     }
     // 视频异常
     if(merchant_config.videoLogoUrl){
       config.videoLogoUrl = get_file_path(merchant_config.videoLogoUrl)
     }
     // 默认联赛logo
     if(merchant_config.leagueLogoUrl){
       this.set_league_logo_url(merchant_config.leagueLogoUrl)
       // config.leagueLogoUrl = get_file_path(merchant_config.leagueLogoUrl)
     }
     // 专业版默认主题色
     if(merchant_config.profesTag){
       config.default_theme.yabo = merchant_config.profesTag
     }


    }else{
     // 1.本身就是预览，接口炸了，那么按照前端自己的默认配置 设置
   }


   return  config

}

/**
 * @Description 判断联赛logo是否可用 并设置联赛logo
 * @param {undefined} undefined
*/
set_league_logo_url(url){
  url = get_file_path(url)
  let img = new Image();
  img.onload = function () {
    if (this.complete == true) {
      // 图片加载成功
      let style_el = document.createElement('style')
      style_el.innerHTML = `
      .leagues-logo-default[src^=data]{background-repeat:no-repeat;}
      .theme01 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
      .theme02 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
      .theme01_y0 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
      .theme02_y0 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
      `
      document.head.appendChild(style_el)
    }
  }
  img.src = url
}
/**
 * 预览配置 接口出错 后 按照前端默认的配置来设置 整个网页 基础信息
 * 几个场景：
 * 1.本身就是预览，接口炸了，那么按照前端自己的默认配置 设置
 * 2.本身有token 但是token 失效了 ，这个时候 理论上 之前什么样还什么样，根本不用处理
 *
 *
 */
  set_web_meta_by_config(){
     //计算 后的  设置 网页 基础信息的 最终配置
    let config = this.compute_set_web_meta_config()
    // 设置标题
    let title_el = document.createElement('title');
    let lang = window.vue.$store.getters.get_lang
    let title_str = this.get_web_title(lang);

    title_el.innerHTML = title_str;

    let metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') =='description' || metas[i].getAttribute('name') =='product-name') {
        metas[i].setAttribute('content',title_str);
      }
    }

    // 修改网站icon
    let icon_el = document.getElementById('link_icon')
    if(icon_el){
      icon_el.setAttribute('rel','icon')
      icon_el.setAttribute('type','image/x-icon')
      if(sessionStorage.getItem('hide_logo_icon') === '0'){
        icon_el.setAttribute('href',config.icon);
      }
    }
    // 设置样式
    let style_el = document.createElement('style')
    // 获取商户样式_y0
    const user_data_info = this.get_getuserinfo_data()
    const _data = _.get(user_data_info,'data', {})
    let merchant_style = _data.stm === 'blue' ? '_y0' : ''
    let style_html = `
      body.theme01${merchant_style}{background-color:#${config.body_bg_day}!important;}
      body.theme02${merchant_style}{background-color:#${config.body_bg_night}!important;}
      .c-max-width{max-width:${config.max_width}px  !important;}
      .theme01${merchant_style} .custom-format-img-logo-01{background-image: url("${config.day_logo}")!important;}
      .custom-format-img-logo-01-theme01{background-image: url("${config.day_logo}") !important;}
      .theme02${merchant_style} .custom-format-img-logo-01{background-image: url("${config.night_logo}") !important;}
      .custom-format-img-logo-04{background-image: url("${config.compatible_logo}") !important;}
    `
    // loading图片
    if(config.loadLogoUrl){
      style_html += `.custom-format-img-loading{background-image: url("${config.loadLogoUrl}") !important;}`
    }
    // 视频异常
    if(config.videoLogoUrl){
      style_html += `.custom-format-web-icon-05{background-image: url("${config.videoLogoUrl}") !important;}`
    }
    // 默认联赛logo
    // if(config.leagueLogoUrl){
    //   style_html += `
    //   .leagues-logo-default[src^=data]{background-repeat:no-repeat;}
    //   .theme01 img.leagues-logo-default[src^=data]{background-image: url("${config.leagueLogoUrl}") !important;}
    //   .theme02 img.leagues-logo-default[src^=data]{background-image: url("${config.leagueLogoUrl}") !important;}
    //   `
    // }
    style_el.innerHTML = style_html
    document.head.appendChild(title_el)
    document.head.appendChild(style_el)

    // 设置主题色
    // if(!window.vue.$store.getters.get_theme){
    //   let theme = 'theme0'+config.default_theme[window.env.config.FINAL_TARGET_PROJECT_NAME]
    //   window.vue.$store.dispatch('set_theme',theme)
    // }
    // window.vue.$store.dispatch('init_loading_theme')
    window.vue.$root.$emit(window.vue.emit_cmd.EMIT_MX_COLLECT_COUNT2_CMD);




  }
  /**
   * @Description 设置网站标题
   * @param {undefined} undefined
  */
   set_web_title(lang){
    document.title = this.get_web_title(lang)
    let metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') =='description' || metas[i].getAttribute('name') =='product-name') {
        metas[i].setAttribute('content',document.title);
      }
    }
  }
  /**
   * @Description 获取网站标题
   * @param {Object} lang 语言
   * @param {undefined} undefined
  */
  get_web_title(lang){
    let title = _.get(window.env,`config.html_info.title.${lang}`) || ''
    let json = sessionStorage.getItem('merchant_config_json')
    if(json){
      let merchant_config = JSON.parse(json)
      if(_.get(merchant_config,`titleMap.${lang}`)){
        title = _.get(merchant_config,`titleMap.${lang}`)
      }
    }
    return title
  }

  /**
   * @Description 修正用户主题样式
   * @param {Object} user_data 用户对象数据
  */
  repair_user_theme(user_data){
    if(!user_data){
      return;
    }
    if(user_data.stm=='blue'){
      //同步 商户主题色系
      localStorage.setItem('merchant_style', 'y0');
      // 修正session主题
      let session_theme =  sessionStorage.getItem("theme");
      if(session_theme){
        session_theme = session_theme.replace('_y0','')
        sessionStorage.setItem("theme",session_theme+'_y0')
      }
    } else {
      //同步 商户主题色系
      localStorage.setItem('merchant_style', 'common');
      // 修正session主题
      let session_theme =  sessionStorage.getItem("theme") ||''
      sessionStorage.setItem("theme",session_theme.replace('_y0',''))
    }
  }

}


const instance =new userCtr()
export default instance;
