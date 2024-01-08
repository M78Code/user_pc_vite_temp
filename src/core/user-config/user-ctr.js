/**
 *
 *  用户相关的  控制类 实体对象 单个实例
 *  全局接口配置 相关的 配置
 *  主题色相关
 *  商户相关
 */
// #TODO 等后续get_server_file_path、http、infoUpload和pako_pb公共模块开发后再替换
import { ref,nextTick, reactive} from "vue";
// #TODO 还有使用到的loadash,如果全局配置则无需引入，或者按需引入，等正是开发组件决定,  _  (lodash)
import lodash from "lodash";
// #TODO 使用axios，等正式开发组件时候 npm install axios
import axios from "axios";
import { uid } from 'quasar';

import { get_server_file_path } from "src/core/file-path/file-path.js";
import {pako_pb} from "src/core/pb-decode/custom_pb_pako.js";
import { infoUpload } from "src/core/http/index.js";
import ServerTime from 'src/core/server-time/server-time.js';
import { odds_table } from "src/core/constant/common/module/csid.js"
 
import { LocalStorage, SessionStorage } from "src/core/utils/common/module/web-storage.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
import {GLOBAL_CONSTANT } from "src/core/constant/global/index.js"
const { PROJECT_NAME,htmlVariables } = BUILDIN_CONFIG ;

// #TODO 接口统一管理的文件，后续替换
import { api_details, api_account,api_betting } from "src/api/index.js";
import { api_common } from 'src/api/index'
import { i18n_t } from "src/boot/i18n.js";

import STANDARD_KEY from "src/core/standard-key";
const user_key = STANDARD_KEY.get("user_info");
import { AllDomain } from "src/core/http/";

const axios_instance = axios.create();
class UserCtr {
  constructor() {
    this.init();
    this.set_user_info_refresh()
  }
  /**
   * 初始化
   */
  init() {
    //所有接口上报的 用户信息失效，这里不包含 OSS域名检测的  src\public\utils\http\all_domain.js
    //接口会去 清除 这个 统计 ， 连续累计 一定 次数才会弹出 token 失效
    this.all_expired_count = 0;
    //相邻接口报用户token 失效累计次数上限
    this.all_expired_count_max = 2;
    //最后一次 调用 getuserinfo 接口 返回用户 token 失效
    this.last_getuserinfo_expired = false;
    // token 过期 累加达到 上限， 延迟 xx秒 执行的  弹出 用户token 失效对应的弹窗  等 流程的  定时器
    this.token_expired_max_process_timer = null;
    // token 过期 累加达到 上限， 延迟 15秒 执行的  弹出 用户token 失效对应的弹窗  等 流程的  延迟时间
    this.token_expired_max_process_delay_time = 5000;
    // getUserInfo 原始数据备份 备份数据
    this.getuserinfo_res_backup = null;
    // uid
    this.uid = this.init_uid();

    // 数据持久化使用到的key值
    this.local_storage_key = "h5_user_base_info";
    // 用户详情
    this.user_info = {};
    // 登录用户的id
    this.user_logined_id = "";
    // 用户是否长时间未操作
    this.is_user_no_handle = false;
    // 用户令牌信息
    this.user_token = "";
    // 用户信息数据
    this.user_info_data = "";

    // 用户语言
    this.lang = LocalStorage.get("lang");

    // 用户主题  日间版本 ，夜间版本 可能有多版本哦 不止二个
    this.theme = LocalStorage.get("theme",  LocalStorage.get('default-theme') );

    // 当前 选择的 赔率 ，有些赛种只有港赔理论上和这里无关 盘口
    this.odds = {
      // 上次赔率
      pre_odds: "EU",
      // 当前赔率
      cur_odds: "EU",
    };
    // 当前币种类型 
    // src/core/constant/common/module/keyword.js
    this.currency = 1

    this.test=1;
    //排序	 int 类型 1 按热门排序 2 按时间排序 欧洲版默认时间排序
    this.sort_type = 2;
     //每日活动	 Boolean 类型 ture 开启 false 关闭
     this.daily_activities =  LocalStorage.get("daily_activities",false);
    //收藏/关注	true/false
    this.show_favorite_list = false;

    // 用户 token 失效
    this.is_invalid = false;
    // 用户 余额
    this.balance = 0;
    //  用户余额是否展示状态
    this.show_balance = false;
    //用户版本 移动端有简版 1 和标准版 2
    this.standard_edition =LocalStorage.get("standard_edition",2) 
    // this.standard_edition = 1
    //登录弹窗状态
    this.show_login_popup = false;
    // 是否首次登录
    this.is_new_user = false;
    //  当前用户开启的活动
    this.activity = {
      id: '',
      // 详细信息
      list: []
    }
    //弹窗 联赛筛选的数据
    this.league_select_list = []
    //弹窗 赛果联赛筛选的数据
    this.amidithion_league_select_list = []
    //获取资源配置(商户后台配置的图片、跳转链接)
    this.resources_obj = {}
    // 用户信息版本
    this.user_version = ref('0')
    this.update = (v) => {
      this.user_version.value = v || Date.now()
      nextTick(()=>{
        SessionStorage.set(user_key,this)
      })
    }
    this.callbackUrl = ''
 
    

    // 常规体育的 图片地址 
    this.common_img_domain = ''

    // 角球开关盘标识
    this.corner_oc_change = ''
    // 次要玩法数据更新
    this.c303_data_change = ''
    // 次要玩法盘口状态变化
    this.c305_data_change = ''
    // var事件国际化信息
    this.var_event_i18n = []
    //监听设置菜单发生变化时
    this.set_menu_init = 1

    // 设置topic数据
    let topic = LocalStorage.get('topic');
    topic && (BUILDIN_CONFIG.TOPIC = topic);
    nextTick(()=>{
      this.get_system_time()
    })
  }

  // 获取topic指定key域名url
  get_topic_key_url(key) {
    let res = '';
    if(key){
      res = lodash.get(window, `BUILDIN_CONFIG.TOPIC.${key}`, lodash.get(window.SEARCH_PARAMS.get_topic(),`${key}`));
    }
    return res;
  }
  
  // 刷新后 获取缓存数据
  set_user_info_refresh() {
    // 获取数据缓存
    let session_info = SessionStorage.get(user_key);
    if (!session_info) {
      return;
    }
   
    if (Object.keys(session_info).length) {
      for(let item in session_info){
        if(!['user_version','token_expired_max_process_timer','daily_activities','lang','theme'].includes(item) ){
          this[item] = session_info[item]
        }
      }
    }
  }

  // 角球开关盘标识
  set_corner_oc_change (val) {
    this.corner_oc_change = val
  }

  // 次要玩法数据更新
  set_c303_data_change (val) {
    this.c303_data_change = val
  }

  // 次要玩法盘口状态变化
  set_c305_data_change (val) {
    this.c305_data_change = val
  }
  // 设置当前var事件国际化集合信息 
  set_var_event_i18n(val) {
    this.var_event_i18n = val
  }
  /**
   * 获取初始化uid
   * @return {String} uid
   */
  init_uid() {
    let res = '';
    let unique = LocalStorage.get("unique_uuid");
    if (unique) {
      res = unique;
    } else {
      res = uid().replace(/-/g, "");
      LocalStorage.set("unique_uuid", res);
    }
    return res;
  }
  /**
   * 用户 id
   * @param {*} uid
   */

  set_uid(uid) {
    this.uid = uid;
  }
  get_cuid() {
    return this.user_info.userId;
  }
  /**
   * 排序变化      //排序	 int 类型 1 按热门排序 2 按时间排序
  */
  set_sort_type(data) {
    this.sort_type = data;
    useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
      text: "sortRules",
      data,
    });
    this.update()
  }
  /**
   * 排序变化      //排序	 int 类型 1 按热门排序 2 按时间排序
  */
  set_menu_init_change() {
    this.set_menu_init += 1;
    this.update()
  }
  /**
   * 每日活动    //开启关闭	 Boolean 类型 true 开启 false 关闭
  */
  set_daily_activities(status) {
    this.daily_activities = status;
    LocalStorage.set("daily_activities",status);
    useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
      text: "activities",
    });
    this.update()
  }
  /**
   * 设置语言变化
  */
  set_lang(data) {
    // console.error('sssssssss',data)
    if(data){
      SEARCH_PARAMS.init_param_set({lang:data});
      // console.error('SEARCH_PARAMS',data)
      if(this.lang == data)return;
      this.lang = data;
      this.user_info.languageName = data;
      LocalStorage.set('lang',data)
      useMittEmit(MITT_TYPES.EMIT_LANG_CHANGE, data);
      this.update()
    }
  }
  /**
  * 设置主题变化
 */
  set_theme(theme) {
    this.theme = theme;
    useMittEmit(MITT_TYPES.EMIT_THEME_CHANGE, theme);
    // 替换body上className
    const old_theme = LocalStorage.get("theme") || sessionStorage.getItem("theme") || theme == 'day' ? 'theme02' : 'theme01';
    document.getElementById('ty-app').classList.replace(old_theme, theme)
    LocalStorage.set("theme", theme.value || theme)
    LocalStorage.set("default-theme", theme.value || theme)
    // store.dispatch({ type: "SET_THEME", data });
    // loadLanguageAsync(lang);//加载语言
    // 设置主题
    // LocalStorage.set('default-theme', theme)
    this.update()
  }
  /**
   * 联赛赛选的数据发生变化
  */
  set_league_select_list(val,type) {
    //赛果筛选
    if (type && type === 'amidithion'){
      this.amidithion_league_select_list = val.value
    }else{
      //普通筛选
      this.league_select_list = val.value
    }
    this.update()
  }
  set_cur_odds(odd) {
    let params = {
      userMarketPrefer: odd
    }
    api_betting.record_user_preference(params).then((res = {}) => {
      if (res.code == 200) {
        this.set_pre_odds(this.odds.cur_odds)
        this.odds.cur_odds = odd;
        this.update()
      } else {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, '请稍后再试！')
      }
    })
  }
  set_pre_odds(odd) {
    this.odds.pre_odds = odd
  }
  get_uid() {
    // 当用户未登录时返回uuid, 当用户登录时返回userId
    return this.user_info && this.user_info.userId ? this.user_info.userId : this.uid;
  }
  get_loaded_user_id() {
    return this.user_logined_id;
  }
  // 获取约
  get_set_balance() {
    return this.balance
  }
  get_user() {
    return this.user_info;
  }
  //用户是否长时间未操作
  get_is_user_no_handle() {
    return this.is_user_no_handle;
  }
  get_user_token() {
    return this.user_token;
  }
  get_user_info_data() {
    return this.user_info;
  }
  set_user_info(user_obj) {
    if (!user_obj) {
      return;
    }
    if (user_obj.balance === null) delete user_obj.balance;
    // 获取历史uid
    const uid_ = this.get_uid();
    // 新旧版切换开关, 默认是开  1是开0是关
    if (user_obj.h5VerSysSwitch && user_obj.h5VersionSwitch) {
      user_obj.versionSwitch = user_obj.h5VerSysSwitch == 1 && user_obj.h5VersionSwitch == 1
    }
    user_obj.ommv = user_obj.ommv == 1 || false
    if (this.user_info) {
      Object.assign(this.user_info, user_obj);
    } else {
      this.user_info = user_obj;
    }
    // 设置用户信息，存入localStorage中
    // this.user_info.token = this.user_token
    this.set_user_base_info(this.user_info);
    
    this.is_invalid = false;
    this.user_logined_id = user_obj.userId
    SessionStorage.set('user_id', user_obj.userId)
    // 判断是不是新用户登录
    if (uid_ && uid_ != user_obj.userId) {
      // 发送订阅ws公共命令
      window.postMessage({ event: 'WS', cmd: `WS_RESEND_SCMD_EVENT`, data: { user_id: user_obj.userId } }, '*');
    }
  }
  /**
   * 设置活动
   * */
  set_user_activity(activity) {
    this.activity = { ...activity }
  }
  /**
   * 设置是否 显示、收藏
   * */
  set_show_favorite_list(v) {
    this.show_favorite_list = !!v;
    //通知收藏变化了
    useMittEmit(MITT_TYPES.EMIT_FAVORITE_CHANGE_CMD, this.show_favorite_list)
  }
  clear_user({ commit }) {
    // this.user_info = "";
    for (const key in this.user_info) {
      delete this.user_info[key];
    }
    this.is_invalid = true;
  }
  //设置用户是否长时间未操作
  set_is_user_no_handle({ commit }, val) {
    this.is_user_no_handle = val;
  }

  // 设置当前币种
  set_currency_code () {
    // 获取当前商户设置的币种
    let currency = lodash.get(this.user_info,'cvo.series.code',1)
    this.currency = currency
    // 去耦合性
    SessionStorage.set('currency_code',currency)
  }
  /**
   * 刷新用户信息
   */
  async refresh_user_info(){
    await this.get_user_info(this.get_user_token())
  }
 /**
  * 获取用户信息
  * @param {*} token 
  * @param {*} callback 
  */
  async get_user_info(token, callback) {
    let res = '';
    let time_upd = lodash.get(BUILDIN_CONFIG.DOMAIN_RESULT, 'getuserinfo_res.time_upd')
    if(time_upd && ((new Date().getTime()-time_upd)<2000)){
      // 首次加载时用户接口,两秒内只调用一次
      res = lodash.get(BUILDIN_CONFIG.DOMAIN_RESULT, 'getuserinfo_res.data');
    } else {
      res = await api_account.get_user_info({
        token,
      });
    }
    let obj = lodash.get(res, 'data', {});
    this.set_user_token(token);
    this.set_user_info(obj);
    this.update()
    this.get_balance()
    this.set_currency_code()
    const gr = lodash.get(this.user_info,'gr');
    gr && SessionStorage.set('gr', gr);
    callback && callback(obj);
  }

  // 获取用户余额
  get_balance() {
    api_account
      .check_balance({ uid: this.user_info.userId })
      .then((res) => {
        if (res.code == 200) {
          let amount = lodash.get(res, "data.amount");
          this.set_balance(amount);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  
  /**
   * 设置版本 简易版还是 标准版
   * 2标准 1简易
  */
  set_standard_edition(v) {
    this.standard_edition = v;
    sessionStorage.setItem('standard_edition', v)
    LocalStorage.set('standard_edition',v)
    useMittEmit(MITT_TYPES.EMIT_STANDARD_EDITION_CHANGE, this.standard_edition)
    // set_newer_standard_edition(edition);
    // set_secondary_unfold_map({}); // 清空次要玩法折叠的记录，收起来
    // // 发送埋点
    // let zhuge_obj = {
    //   版本类型: edition == 1 ? "简易" : "标准",
    // };
    // $send_zhuge_event("TY_H5_菜单_版本_点击", UserCtr.user_info, zhuge_obj);
  }
  set_balance(balance) {
    this.balance = 1 * balance;
    //通知余额变化
    useMittEmit(MITT_TYPES.EMIT_USER_AMOUNT_CHAUNGE, this.balance)
    this.update()
  }
  /**
   * 获取  和 调用 getuserinfo 接口 data 实体 数据
   * 这里 是经过加工的 标准化的数据 也可能是缓存下来的数据
   * 并且这个数据 是经过规整的 ，
   *  这里返回缓存的实体
   */
  get_getuserinfo_data() {
    if (!this.getuserinfo_res_backup) {
      return null;
    } else {
      let obj = JSON.parse(this.getuserinfo_res_backup);
      obj.code = 200;
      return obj;
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
   * @Description:判断用户是否登录
   * @Author Cable
   * @param {function} callback  回调函数
   */
  async check_login(callback) {
    try {
      // #TODO 接口
      let res = await api_common.getMatchUserIsLogin();
      callback(
        lodash.get(res, "data.isLogin", false),
        lodash.get(res, "code") == "0401038"
      );
    } catch (error) {
      console.log(error, '1111');
      callback(false, true);
    }
  }
  /**
   *  用户信息的  内的 视频多久 无操作 时间判定
   */
  compute_video_no_handle_time(res) {
    // 长时间未操作暂停视频开关   1开启; 0关闭
    let center_video_time = lodash.get(
      res,
      "data.videoManageVo.closedWithoutOperation",
      0
    );
    // 观看时间设置 0默认时间 1自定义时间
    let close_video_time_settings = lodash.get(
      res,
      "data.videoManageVo.videoSettings",
      0
    );
    // 长时间未操作暂停视频时间(自定义时间)
    let close_video_time_custom = lodash.get(
      res,
      "data.videoManageVo.customViewTime",
      0
    );
    // 长时间未操作暂停视频时间(默认时间)
    let close_video_time = lodash.get(res, "data.videoManageVo.viewingTime", 0);
    let setting_no_handle_time =
      (close_video_time_settings ? close_video_time_custom : close_video_time) *
      1000 *
      60;
    // 商户级别视频流量管控开关 1开启、0关闭
    let config_video_switch = lodash.get(
      res,
      "data.videoManageVo.videoSwitch",
      0
    );
    // 系统级别视频流量管控总开关   '1'开启、'0'关闭
    let config_video_time = lodash.get(
      res,
      "data.videoManageVo.configValue",
      0
    );
    // 检查暂停视频开关是否开启 与 用户是否长时间未操作
    if (
      1 * config_video_time != 0 &&
      config_video_switch != 0 &&
      center_video_time != 0 &&
      setting_no_handle_time != 0
    ) {
      return setting_no_handle_time;
    } else {
      return 0;
    }
  }

  /**
   *  用户信息的 gr 分组参数 判定 流程
   */

  check_getuserinfo_gr(res) {
    let reload_flg = false;
    // 获取用户分组信息
    let gr = lodash.get(res, "data.gr");
    if (gr) {
      gr = gr.toLocaleUpperCase();
      // localStorage持久化用户分组信息
      sessionStorage.setItem("gr", gr);

      //  if(BUILDIN_CONFIG.gr != gr){
      if (BUILDIN_CONFIG.DOMAIN_RESULT.gr != gr) {
        // #TODO
        let url_search = SEARCH_PARAMS.init_param;
        //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
        url_search.set("rdm", new Date().getTime());
        // 删除  api
        url_search.delete("api");
        SEARCH_PARAMS.init_param_del(['api']);
        // 增加GR 参数
        url_search.set("gr", gr);
        SEARCH_PARAMS.init_param_set({gr});
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
      sessionStorage.setItem("gr", "");
    }

    return reload_flg;
  }

  /**
   * 商户 设置 预览 ，这个时候无 token
   */

  async handle_merchant_setup_preview() {
    let params, partnerId;
    if (location.href.indexOf("?") != -1) {
      let res = location.href.match(/partnerId=([a-zA-Z0-9]*)/);
      if (res && res.length > 1) {
        partnerId = res[1];
      }
    }
    if (partnerId) {
      params = {
        merchantCode: partnerId,
      };
    } else {
      this.set_web_meta_by_config();
      return Promise.resolve(1);
    }

    //  let api_domains = BUILDIN_CONFIG.domain[BUILDIN_CONFIG.CURRENT_ENV];
    let api_domains =
      BUILDIN_CONFIG.domain[BUILDIN_CONFIG.CURRENT_ENV] || [];
    let api_domain = api_domains[0];

    try {
      let res = await axios_instance.get(
        `${api_domain}/yewu12/user/getConfig`,
        {
          params,
          timeout: 10000,
        }
      );
      let data = lodash.get(res, "data.data");
      if (lodash.isPlainObject(data)) {
        this.set_merchant_config(data);
      } else {
        this.set_web_meta_by_config();
      }
    } catch (error) {
      this.set_web_meta_by_config();
    }
    // 留着给 其他地方异步去处理 后续逻辑
    return Promise.resolve(1);
  }

  /**
   * 设置 商户层级的 配置的界面 相关的设置
   */

  set_merchant_config(merchant_config) {
    if (lodash.isPlainObject(merchant_config)) {
      sessionStorage.setItem(
        "merchant_config_json",
        JSON.stringify(merchant_config)
      );
    }
  }
  /**
   * 获取首页 的 默认的  banner 的 地址
   */
  get_banner_url_first_page() {
    let merchant_config_json = JSON.parse(
      sessionStorage.getItem("merchant_config_json")
    );
    let url = lodash.get(merchant_config_json, "bannerUrl");

    return url;
  }

  /**
   * @Description 判断联赛logo是否可用 并设置联赛logo
   * @param {undefined} undefined
   */
  set_league_logo_url(url) {
    url = get_server_file_path(url);
    let img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        // 图片加载成功
        let style_el = document.createElement("style");
        // dom元素设置
        // style_el.innerHTML = `
        // .leagues-logo-default[src^=data]{background-repeat:no-repeat;}
        // .theme01 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
        // .theme02 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
        // .theme01_y0 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
        // .theme02_y0 img.leagues-logo-default[src^=data]{background-image: url("${url}") !important;}
        // `
        style_el.innerHTML = `
        .leagues-logo-default[src^=data]{background-repeat:no-repeat;}
        `;
        document.head.appendChild(style_el);
      }
    };
    img.src = url;
  }
  
  /**
   * @Description 设置网站标题
   * @param {undefined} undefined
   */
  set_web_title(lang) {
    document.title = this.get_web_title(lang);
    let metas = document.getElementsByTagName("meta");
    for (let i = 0; i < metas.length; i++) {
      if (
        metas[i].getAttribute("name") == "description" ||
        metas[i].getAttribute("name") == "product-name"
      ) {
        metas[i].setAttribute("content", document.title);
      }
    }
  }
  /**
   * @Description 获取网站标题
   * @param {Object} lang 语言
   * @param {undefined} undefined
   */
  get_web_title(lang) {
    // let title = lodash.get(window.env,`config.html_info.title.${lang}`) || ''
    let title = lodash.get(htmlVariables, `title.${lang}`) || "";
    let json = sessionStorage.getItem("merchant_config_json");
    if (json) {
      let merchant_config = JSON.parse(json);
      if (lodash.get(merchant_config, `titleMap.${lang}`)) {
        title = lodash.get(merchant_config, `titleMap.${lang}`);
      }
    }
    return title;
  }

  /**
   * @Description 修正用户主题样式
   * @param {Object} user_data 用户对象数据
   */
  repair_user_theme(user_data) {
    if (!user_data) {
      return;
    }
    if (user_data.stm == "blue") {
      //同步 商户主题色系
      LocalStorage.set("merchant_style", "y0");
      // 修正session主题
      let session_theme = sessionStorage.getItem("theme");
      if (session_theme) {
        session_theme = session_theme.replace("_y0", "");
        sessionStorage.setItem("theme", session_theme + "_y0");
      }
    } else {
      //同步 商户主题色系
      LocalStorage.set("merchant_style", "common");
      // 修正session主题
      let session_theme = sessionStorage.getItem("theme") || "";
      sessionStorage.setItem("theme", session_theme.replace("_y0", ""));
    }
  }

  //显示token失效弹窗
  show_fail_alert() {
    let ret = false;
    let callbackUrl = this.user_info.callbackUrl;
    if (this.is_invalid) {
      //是否失效
      // if ((!callbackUrl) && (callbackUrl != undefined)) {
      //   // 弹出提示消息、登录层
      //   useMittEmit(
      //     MITT_TYPES.EMIT_SHOW_TOAST_CMD,
      //     window.vue.i18n_t("login.login_timeout")
      //   );
      // } else {
      // 登录失效直接展示 alert
      useMittEmit(MITT_TYPES.EMIT_SHOW_ALERT_CMD, {
        text: i18n_t("login.login_timeout"),
        callback: () => {
          location.href = callbackUrl;
          // 清除旧的登录信息
          this.clear_user();
        },
      });
      // }
      ret = true;
    }
    return ret;
  }
  // 获取var事件国际化信息
  get_var_event_i18n() {
    return this.var_event_i18n;
  }
  /**
   * 获取用户基础信息
   * 语种信息,赔率类型
   *
   */
  get_user_base_info() {
    let str = LocalStorage.get(this.local_storage_key);
    let data = null;
    if (str) {
      try {
        data = JSON.parse(str);
      } catch (error) {
        console.error("userCtr get_user_base_info() 错误:", error);
      }
    }
    return data;
  }
  /**
   * 设置用户基础信息
   *
   *  {languageName:'语种',userMarketPrefer:'赔率种类'}
   *
   */
  set_user_base_info(obj) {
    if (obj) {
      let lang_list = ['zh','en']
      let lang = obj.languageName
      if(PROJECT_NAME.includes('ouzhou')){
        if(!lang_list.includes(obj.languageName)){
          lang = 'zh'
        }
      }
      try {
        let data = {
          languageName: this.lang ? this.lang : lang,
          userMarketPrefer: obj.userMarketPrefer,
        };
        // 设置国际化语言
        this.set_lang(data.languageName);
        LocalStorage.set(this.local_storage_key, data);
      } catch (error) {
        console.error("userCtr  set_user_base_info() 错误:", error);
      }
    }
  }
  /**
   * 合并用户基础信息
   * @param {*} obj
   */
  assign_user_base_info(obj) {
    let obj_ = this.get_user_base_info();
    if (obj && obj_) {
      try {
        Object.assign(obj, obj_);
        this.set_user_base_info(obj);
      } catch (error) {
        console.error("userCtr  assign_user_base_info() 错误:", error);
      }
    }
    return obj;
  }

  /**
   * 检测本地是否存有用户基础信息, 有用户信息返回用户基本信息,否则返回null,
   *
   */
  check_user_base_info() {
    let res = null;
    let obj = this.get_user_base_info();
    if (obj && obj.languageName && obj.userMarketPrefer) {
      res = obj;
    }
    return res;
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
    if (!res.data) {
      return false;
    }
    if (lodash.get(res, "data.code") != "0000000") {
      return false;
    }
    if (!lodash.get(res, "data.data.userId")) {
      return false;
    }
    // 数据规整容错
    // getUserInfo 原始数据备份 备份数据
    this.getuserinfo_res_backup = JSON.stringify(res.data);
    //设置 商户层级的 配置的界面 相关的设置
    this.set_merchant_config(lodash.get(res, "data.data.configVO"));

    //  调用用户接口，更新 域名流程
    let oss = lodash.get(res, "data.data.oss", {});
    oss.gr = lodash.get(res, "data.data.gr", "").toUpperCase();
    useMittEmit(MITT_TYPES.EMIT_SET_GETUSERINFO_OSS_API, oss);
    // 保存userinfo
    this.set_user_info(lodash.get(res, "data.data", {}))
    //上传数据
    infoUpload.upload_data(lodash.get(res, "data.data", {}));

    // 主题修正
    if(!this.theme){
      this.theme = LocalStorage.get("theme",  LocalStorage.get('default-theme'));
      this.theme && LocalStorage.set("theme", this.theme);
    }
    let local_theme = LocalStorage.get("theme");
    if(this.theme && this.theme != local_theme){
      LocalStorage.set("theme", this.theme);
    }
    this.set_web_meta_by_config();
  }
  /**
   *  常规体育的 图片地址 
  */
  set_common_img_domain(url) {
    //设置一次

    this.common_img_domain = url

  }
  /**
     * @description: 设置电竞图片资源域名
     */
  async set_e_sports_domain_img() {
    //电竞图片地址 
    this.e_sports_img_domain = LocalStorage.get('e_sports_domain_img', '');
    try {
      var send_gcuuid = uid();
      const res = await api_common.get_games_imgDomain({
        gcuuid: send_gcuuid
      })
      if (send_gcuuid != res.gcuuid) return;
      if (res && res.data) {
        // 请求成功,获取服务器返回的数据
        let temp = lodash.get(res, 'data');
        // 切除域名后面多余的/
        if (temp && lodash.endsWith(temp, '/')) {
          temp = temp.substring(0, temp.length - 1);
        }
        // 持久化电竞图片域名
        LocalStorage.set('e_sports_domain_img', temp);
        // 设置全局电竞图片域名信息
        GLOBAL_CONSTANT.E_SPORTS_DOMAIN_IMG = temp;

      }
    } catch (error) {
      console.error(error);
    }
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
      if (url_temp.includes("user/getUserInfo")) {
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
        this.token_expired_max_process_timer = null;
      }
      //调用 getuserinfo 接口返回值  数据备份
      if (url_temp.includes("user/getUserInfo")) {
        let data_temp = pako_pb.unzip_data(lodash.get(res, "data.data"));
        data_temp && (res.data.data = data_temp);
        let gr = (lodash.get(res, "data.data.gr") || "").toUpperCase();
        if(gr && BUILDIN_CONFIG.DOMAIN_RESULT.gr != gr){
          AllDomain.begin_process_when_use_url_api_after_process(res);
          //保存 用户数据
          BUILDIN_CONFIG.DOMAIN_RESULT.getuserinfo_res = res;
        }
        if (window.url_param_lg) {
          res.data.data.languageName = window.url_param_lg;
        }
        this.set_getuserinfo_res(res);
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
        // 跳转商户
        useMittEmit(MITT_TYPES.EMIT_GO_TO_VENDER);
        //设置登录无效
         this.is_invalid=true;
        //显示登录失效弹窗
        setTimeout(() => {
          this.show_fail_alert();
        }, 100);
        // 关闭WS
        if (window.ws) {
          window.ws.destroy(true);
        }
      } else {
        //如果不超限 //清除定时器
        if (this.token_expired_max_process_timer) {
          clearTimeout(this.token_expired_max_process_timer);
          this.token_expired_max_process_timer = null;
        }
      }
    }, this.token_expired_max_process_delay_time);
  }
  /**
   *  用户信息的 gr 分组参数 判定 流程
   */
  check_getuserinfo_gr(res) {
    let reload_flg = false;
    // 获取用户分组信息
    let gr = lodash.get(res, "data.gr");
    if (gr) {
      gr = gr.toLocaleUpperCase();
      // localStorage持久化用户分组信息
      sessionStorage.setItem("gr", gr);
      LocalStorage.set(
        "user_gr",
        JSON.stringify({ token: sessionStorage.getItem("h5_token"), gr })
      );
      if (BUILDIN_CONFIG.gr != gr) {
        let url_search = SEARCH_PARAMS.init_param;
        //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
        url_search.set("rdm", new Date().getTime());
        // 删除  api
        url_search.delete("api");
        SEARCH_PARAMS.init_param_del(['api']);
        // 增加GR 参数
        url_search.set("gr", gr);
        SEARCH_PARAMS.init_param_set({gr});
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
        this.reload_flg = true;
      }
    } else {
      // localStorage持久化用户分组信息清空
      LocalStorage.set("user_gr", "");
    }

    return reload_flg;
  }
  /**
   * 计算设置 网页 基础信息的 最终配置
   */
  compute_set_web_meta_config() {
    // http://test-user-h5-bw3.sportxxxifbdxm2.com/?jz=1&partnerId=489637#/
    let json = sessionStorage.getItem("merchant_config_json");
    // let config = lodash.get(window.env, "config."html_info) || {};
    let config = htmlVariables;
    if (json) {
      // 2.本身有token 但是token 失效了 ，这个时候 理论上 之前什么样还什么样，根本不用处理

      let merchant_config = JSON.parse(json);
      // 浏览器icon
      if (merchant_config.pcLogoUrl) {
        config.icon = get_server_file_path(merchant_config.pcLogoUrl);
      }
      // 最大宽度
      if (merchant_config.inlineWidth) {
        config.max_width = merchant_config.inlineWidth;
      }
      // 主logo白色
      if (lodash.get(merchant_config, "configMap.1")) {
        config.day_logo = get_server_file_path(merchant_config.configMap[1]);
      }
      // 主logo黑色
      // if(lodash.get(merchant_config,'configMap.2')){
      //   config.night_logo = get_server_file_path(merchant_config.configMap[2])
      // }
      // 兼容页logo
      if (merchant_config.compatLogoUrl) {
        config.compatible_logo = get_server_file_path(merchant_config.compatLogoUrl);
      }
      // // 专业版默认主题色
      // if(merchant_config.profesTag){
      //   config.default_theme.yabo = merchant_config.profesTag
      // }
      // // 标准版默认主题色
      // if(merchant_config.standardTag){
      //   config.default_theme.yabo_v1 = merchant_config.standardTag
      // }
      // // 新手版默认主题色
      // if(merchant_config.nociceTag){
      //   config.default_theme.yabo_v2 = merchant_config.nociceTag
      // }
    } else {
      // 1.本身就是预览，接口炸了，那么按照前端自己的默认配置 设置
    }
    return config;
  }
  /**
   * 预览配置 接口出错 后 按照前端默认的配置来设置 整个网页 基础信息
   * 几个场景：
   * 1.本身就是预览，接口炸了，那么按照前端自己的默认配置 设置
   * 2.本身有token 但是token 失效了 ，这个时候 理论上 之前什么样还什么样，根本不用处理
   *
   *
   */
  set_web_meta_by_config() {
    //计算 后的  设置 网页 基础信息的 最终配置
    let config = this.compute_set_web_meta_config();
    // 设置标题
    this.set_web_title(this.lang);
    // 设置网站icon
    let icon_el = document.getElementById("link_icon");
    icon_el.setAttribute("rel", "icon");
    icon_el.setAttribute("type", "image/png");
    icon_el.setAttribute("href", config.icon);

    // 设置用户配置样式
    // let style_html = `
    //   body.theme01${merchant_style}{background-color:#${config.body_bg_day}!important;}
    //   body.theme02${merchant_style}{background-color:#${config.body_bg_night}!important;}
    //   .c-max-width{max-width:${config.max_width}px  !important;}
    //   .theme01${merchant_style} .custom-format-img-logo-01{background-image: url("${config.day_logo}")!important;}
    //   .custom-format-img-logo-01-theme01{background-image: url("${config.day_logo}") !important;}
    //   .theme02${merchant_style} .custom-format-img-logo-01{background-image: url("${config.night_logo}") !important;}
    //   .custom-format-img-logo-04{background-image: url("${config.compatible_logo}") !important;}
    // `
    // let style_html = `
    //   .custom-format-img-logo-04{background-image: url("${config.compatible_logo}") !important;}
    // `;
    // // loading图片
    // if (config.loadLogoUrl) {
    //   style_html += `.custom-format-img-loading{background-image: url("${config.loadLogoUrl}") !important;}`;
    // }
    // // 视频异常
    // if (config.videoLogoUrl) {
    //   style_html += `.custom-format-web-icon-05{background-image: url("${config.videoLogoUrl}") !important;}`;
    // }
    // 默认联赛logo
    // if(config.leagueLogoUrl){
    //   style_html += `
    //   .leagues-logo-default[src^=data]{background-repeat:no-repeat;}
    //   .theme01 img.leagues-logo-default[src^=data]{background-image: url("${config.leagueLogoUrl}") !important;}
    //   .theme02 img.leagues-logo-default[src^=data]{background-image: url("${config.leagueLogoUrl}") !important;}
    //   `
    // }
    // 设置主题色
    // if(!window.vue.$store.getters.get_theme){
    //   let theme = 'theme0'+config.default_theme[BUILDIN_CONFIG.PROJECT_NAME]
    //   window.vue.$store.dispatch('set_theme',theme)
    // }
  }
  // 设置 用户token
  set_user_token(token) {
    this.user_token = token
  }
  /**
   * 设置用户余额显示隐藏
   * state 状态 true flase
   */
  set_show_balance(state) {
    this.show_balance = state
    this.update()
  }

  get_resources_obj() {
    return this.resources_obj
  }
  /**
   * TODO 暂时放这里 后续可以挪动 mainLayout里
   * 获取资源配置(商户后台配置的图片、跳转链接)  延迟触发以优化首屏加载速度
   */
  async fetch_resourcesimg() {
    lodash.delay(async () => {
      try {
        let param = {
          token: this.get_user_token()
        }
        this.send_gcuuid3 = uid();
        param.gcuuid = this.send_gcuuid3;
        const res = await api_common.queryFestivalBanner(param)
        if (this.send_gcuuid3 != res.gcuuid) { return };
        const data = lodash.get(res, 'data')
        if (res && res.code == 200 && data) {
          const stime = ServerTime.get_remote_time() //获取服务器时间
          const { img11, img11Type, img11Url, img12, img12Type, img12Url, startTime, endTime } = data
          if (stime <= endTime && stime >= startTime) {
            if (img11) {
              this.resources_obj = ({ is_show: true, theme01: { img_src: get_server_file_path(img11), type: img11Type, jump_url: img11Url } })
            }
            if (img12) {
              this.resources_obj = ({ is_show: true, theme02: { img_src: get_server_file_path(img12), type: img12Type, jump_url: img12Url } })
            }
          } else {
            this.resources_obj = ({ is_show: false, theme02: {}, theme01: {} })
          }
          this.update()
        }

      } catch (e) {
        console.error(e)
      }
    }, 1000)
  }
  /** TODO  如果不合适 后续可挪移到 mainLayout里
    * @description 获取运营位活动相关的配置图片, 延迟触发以优化首屏加载速度
    * @return {Undefined} undefined
    */
  async fetch_actimg() {
    lodash.delay(async () => {
      try {
        let param = {
          token: this.get_user_token()
        }
        this.send_gcuuid4 = uid();
        param.gcuuid = this.send_gcuuid4;
        const res = await api_account.get_BannersUrl(param)
        if (this.send_gcuuid4 != res.gcuuid) return;
        if (res && lodash.get(res, 'code') == 200 && lodash.get(res, 'data')) {
          let arr = lodash.cloneDeep(lodash.get(res, 'data')), arr1 = [], arr2 = [], obj3 = '', obj4 = '';
          let showActivity = false;
          arr.forEach(item => {
            if (item.tType == 3 && !obj3) {
              obj3 = item
            } else if (item.tType == 4 && !obj4) {
              obj4 = item
              // 去掉一个自然日展示一次的判断，有值就展示
              if (SessionStorage.get('showActivityTime')) {
                // 判断日期如果不在同一天就展示弹窗
                if (new Date(+SessionStorage.get('showActivityTime')).getDate() != new Date().getDate()) {
                  showActivity = true
                }
              } else {
                showActivity = true
                SessionStorage.set('showActivityTime', new Date().getTime())
              }
            } else if (item.tType == 1) {
              arr1.push(item)
              LocalStorage.set('home_banner_default', get_server_file_path(item.imgUrl))
            } else if (item.tType == 2) {
              arr2.push(item)
            }
          })
          if (showActivity && obj4) {
            //首页活动弹框 
            useMittEmit(MITT_TYPES.EMIT_INDEX_ACTIVITY_STATUS, obj4.imgUrl)
          }
          // 左下角浮层图标
          // this.float_btnobj = obj3
          // if (obj4) {
          //     // 首页中间弹窗
          //     this.activity_layerimg = obj4.imgUrl
          // }
          // 类型：1-首页banner  2-列表banner  3-左下角浮层图标   4-首页中间弹窗
          let obj = {
            "type1": arr1,
            "type2": arr2,
            "type3": obj3,
            "type4": obj4,
          }
          //TODO
          // get_banner_obj.value = obj
          // 首页banner没有数据，则展示默认banner
          if (!arr1.length) {
            useMittEmit(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, true)
          }
        }
      } catch (error) {
        // 接口错误 则首页轮播展示默认banner
        useMittEmit(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT)
      } finally {
        // // 热门、视频直播页需关闭语言切换状态
        // if (this.get_home_tab_item.index !== 0) {
        //     this.set_is_language_changing(false)
        // }
      }
    }, 1000)
  }

  /**
  * @description: api参数域名加密(专用)
  * @param {*} api 加密字符串
  * @return {*}  明码字符串
  */
   api_encrypt(api_str){
    // 解密url 内 api 字段使用的 key
    const DECRYPT_KEY_URL_API = CryptoJS.enc.Utf8.parse("OBTY20220712OBTY");
    let res = '';
  	if(api_str){
      var encrypt = CryptoJS.AES.encrypt(api_str, DECRYPT_KEY_URL_API, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      res = encrypt.toString();
  	}
    return res;
  }

  /**
   *@description 获取url跳转必须的参数链接字符串(包括token,gr,lang,theme,api等)
   *@param {Object} obj 外部传参对象 
   *@return {Srting} url参数字符串(没有?号): token=8c0c99da8b66a35f6e7971c9207c4525d7a5fded&gr=common&theme=theme-2&api=vymDTv0iHMiYDktoWIswpIRpkRguppwnCb55aDoef0A=
  */
  get_user_url_parames(obj={}){
    let res = {}
    const get_value =function(key){
      let res_ = SessionStorage.get(key) || LocalStorage.get(key);
      return res_;
    }
    // token 令牌
    res.token = this.user_token || get_value('token');
    // gr分组
    res.gr = lodash.get(this.user_info,'gr') || get_value('gr') || '';
    // theme主题
    res.theme = this.theme || get_value('theme') || '';
    // 语言
    res.lang = this.lang || get_value('lang') || '';
    // api 获取默认最快域名进行加密
    res.api = this.api_encrypt(BUILDIN_CONFIG.DOMAIN_RESULT.first_one || get_value('best_api')) || '';
    // 项目来源;
    res.project = BUILDIN_CONFIG .PROJECT_NAME;
    // topic
    res.topic = encodeURIComponent(this.get_topic_key_url('domain') || '');
    // 功能附加参数
    const PARAM_ADD_KEY = ['wsl', 'pb', 'vlg'];
    PARAM_ADD_KEY.forEach(key => {
      const val = SEARCH_PARAMS.init_param.get(key);
      val && (res[key] = val);
    });
    // 参数合并
    Object.assign(res, obj)
    // 参数累加
    const searchParams = new URLSearchParams(res);
    // url编码转换
    res = decodeURIComponent(searchParams.toString());
    return res;
  }

  async get_system_time () {
    let ts = '';
    if(window.SEARCH_PARAMS.has_token){
      let res = await api_common.get_time_server()
      ts = lodash.get(res,'ts','')
      LocalStorage.set('server_time',ts)
    } 
    return ts
  }
  // 是否支持当前赔率
  is_cur_odds (odds='') {
    // 获取当前的盘口赔率
    let cur_odds = lodash.get(odds_table,`${this.odds.cur_odds}`, '1' )
    // 获取当前投注项 如果不支持当前的赔率 就使用欧赔
    if(odds.includes(cur_odds)){
      return true 
    }
    return false
  }
}

const instance = reactive(new UserCtr());
export default instance;
