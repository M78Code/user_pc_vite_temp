import { loadLanguageAsync } from "src/output/index.js";
import { throttle } from "lodash";
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
const BUILDIN_CONFIG = window.BUILDIN_CONFIG;
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import STANDARD_KEY from "src/core/standard-key";
import { enter_params } from 'src/core/enter-params/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import MenuData from "src/core/menu-h5/menu-data-class.js";
import BetWsMessage from "src/core/bet/class/bet-ws-message.js";
import { http, AllDomain } from "src/core/http/";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import {url_param_ctr_init, watch_route_fun} from "src/core/url-param-ctr/index.js";
import PageSourceData  from  "src/core/page-source/page-source.js";

export default {
  data() {
    return {
      // api刷新数据参数
      api_cmd_data: null,

      // 是否已经加载过
      init_load: false,
      // app进入页面的全局loading动画开关
      app_init_loading: true,
      //事件挂载
      emitters: {},
    };
  },
  created() {
    // loading页面最长20秒
    this.timer_ = setTimeout(() => {
      this.hide_loading(0);
    }, 20000);
    this.mitt_list = [];
    this.mitt_list.push(useMittOn(MITT_TYPES.EMIT_LOADING_CTR_CMD, this.hide_loading).off)
    // 参数控制处理和跳转逻辑
    url_param_ctr_init(this);
    // 设置wslog 默认函数防止提前调用报错
    window.wslog = { sendMsg: () => {} };
    // 设置商户分割信息
    let gr = (window.SEARCH_PARAMS.init_param.get('gr')?.toLocaleUpperCase()) || sessionStorage.getItem(STANDARD_KEY.get("gr")) || "COMMON";

    BUILDIN_CONFIG.DOMAIN_RESULT.gr = gr;

    this.on_listeners();
    this.bind_debounce_throttle();
    // init_load设置使用到的定时器
    this.init_load_timer = setTimeout(() => {
      this.set_init_load(true);
    }, 11000);
  },
  watch: {
    '$route'(to, from) {
      PageSourceData && PageSourceData.set_from_page(from.name)
      watch_route_fun(to, from);
    },
    init_load(val){
      if(val&&document.getElementById("loading-root-ele")){
        if(!['app-h5','ouzhou-h5'].includes(BUILDIN_CONFIG.PROJECT_NAME)){
          document.getElementById("loading-root-ele").style.visibility = "hidden";
        }
        // 隐藏loading动画背景
        useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,1)
      }
    }
  },
  async beforeMount () {
     
    // 这里最好是 url 内的 语种 ，不过 兜底语言是中文 因此 这里设置中文
    // 后面如果确实有需要就自己处理 。目前这个是兼容某些异常场景下 接口先返回来回
    // 文件后返回回来 的显示异常，不管 前端缓存，资源文件丢失的场景，生产无此场景
    const lang = window.SEARCH_PARAMS.init_param.get('lang') || LocalStorage.get('lang') ||'zh';
    lang && (await  loadLanguageAsync(lang));
      // 实例化域名检测类对象
      AllDomain.create( () => {
        
        // data参数说明: {type:'domain_api',status:0 ,list:[]}
        // 是api域名类型时
        console.log("---------------- 域名检测初始化完成 ----------------")
        this.init_net_set();
        // 首次进入,发现最快的域名
        // http初始化方法 会调用 setApiDomain
        // ws和http域名切换逻辑
        http.setApiDomain();
        enter_params(async(user)=>{
          await loadLanguageAsync(lang);
          MenuData.init();
          BetData.init_core()
          BetViewDataClass.init()
          BetWsMessage.init()
          this.set_init_load(true);
        })
      });
     // 启动域名检测功能
     AllDomain.run();
  },
  
  beforeUnmount() {
    this.off_listeners();
    this.unbind_debounce_throttle();
    // 清除定时器
    clearTimeout(this.init_load_timer);
    this.init_load_timer = null;
    if (AllDomain) {
      // 销毁停止对象功能
      AllDomain.clear_timer && AllDomain.clear_timer();
    }
    // 销毁监听
    this.mitt_list.forEach(i=>i());
    clearTimeout(this.timer_);
  },
  methods: {
    /**
     * @description: 设置this.init_load变量的状态
     * @param {*} status 布尔值
     */
    set_init_load(status) {
      this.init_load = status;
    },
    /**
     * @description: 初始化网络配置
     * @param {*} data data参数说明: {type:'domain_api',status:0 ,list:[]} status字段:0-初始状态 1-已经发现最快的api域名并已经设置,  2-已经切换到最新的可用域名, 3-切换时发现没有域名可用
     */
    init_net_set() {
      // 首次初始化时调用
      if (!this.init_load) {
        // http初始化方法
        http.init();
      }
      // ws和http域名切换逻辑
      http.setApiDomain();
    },
    /**
     * @description 元数据请求回来 初始化赛事加载
     * @remarks: 不能在这注册， 每个页面都会调用， 这里拿不到 路由信息 
     */
    init_match_callback () {
      MatchMeta.set_origin_match_data()
    },
    /** 触发切网络api域名动作
     * @description:
     * @param {undefined}  data 消息体
     * @return {undefined} undefined
     */
    resetApiDemo(data) {
      if (AllDomain) {
        // 如果用户失效,ws停止请求
        if (data && window.is_token_invalid_show) {
          return;
        }
        console.log("触发切网络api域名动作", data);
        // 错误上报相关
        if (data && (data.type == "http" || data.type == "ws")) {
          if (typeof data.data == "string") {
            try {
              // 字符串转json对象数据
              data.data = JSON.parse(data.data);
            } catch (error) {
              console.error("resetApiDemo:", error);
            }
          }
          this.api_cmd_data = { time: new Date().getTime(), data };
        } else {
          this.api_cmd_data = { time: new Date().getTime(), data };
        }
        // 切换可用的api域名
        AllDomain.auto_set_domain_event();
      }
    },

    // get_games_imgDomain
    //  调用用户接口，更新 域名流程
    set_getuserinfo_oss_api(oss_) {
      AllDomain.set_getuserinfo_oss(oss_);
    },
    // 更新init_load
    handle_init_load(allow_init_load) {
      this.set_init_load(allow_init_load);
    },
    // 添加相应监听事件
    on_listeners() {
      this.emitters = {
        // 接受ws断开命令
        emitter_1: useMittOn(
          MITT_TYPES.EMIT_API_DOMAIN_UPD_CMD,
          this.resetApiDemo
        ).off,
        // 发送用户基本信息到服务命令
        emitter_2: useMittOn(
          MITT_TYPES.EMIT_SET_GETUSERINFO_OSS_API,
          this.set_getuserinfo_oss_api
        ).off,
        //注册 允许显示主页面事件
        emitter_3: useMittOn(
          MITT_TYPES.EMIT_ALLOW_INIT_LOAD,
          this.handle_init_load
        ).off,
        emitter_4: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, this.init_match_callback).off,

        // emitter_4: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, this.init_match_callback).off
      };
    },
    // 移除相应监听事件
    off_listeners() {
      Object.values(this.emitters).map((x) => x());
    },

    // 绑定防抖/节流
    bind_debounce_throttle() {
      // 抖动处理
      // 重新设置api域名函数
      this.resetApiDemo = throttle(this.resetApiDemo, 12000, {
        leading: true,
        trailing: true,
      });
    },
    // 解绑防抖/节流
    unbind_debounce_throttle() {
      this.resetApiDemo.cancel && this.resetApiDemo.cancel();
    },
    // 隐藏loading
    hide_loading(data){
      if(data){
        document.getElementById("loading-root-ele").classList.add('transparent-bg');
      } else {
        document.getElementById("loading-root-ele").style.visibility = "hidden";
      }
    },
  },
};
