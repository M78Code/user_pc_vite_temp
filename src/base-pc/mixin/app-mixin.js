import { http, AllDomain } from "src/core/http/";
import { SessionStorage } from "src/output/index.js";
import { enter_params } from 'src/core/enter-params/index.js'
import { loadLanguageAsync,LocalStorage,MatchDetailCalss,GlobalSwitchClass,MenuData,useMittOn, MITT_TYPES, useMittEmit } from "src/output/index.js";
import LayOutMain_pc from "src/core/layout/index.js";
import base_data from "src/core/base-data/base-data.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetWsMessage from "src/core/bet/class/bet-ws-message.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import {url_param_ctr_init, watch_route_fun} from "src/core/url-param-ctr/index.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { DEFAULT_VERSION_NAME } = BUILDIN_CONFIG;
export default {
    data() {
      return {
        init_load: false,
      }
    },
    created () {
      this.vue_hidden_run_flg = false;
      this.background_run_time = "";
      this.background_run_time_timer = setTimeout(() => {
        this.vue_hidden_run_flg = true;
      }, 4000);

      // loading页面最长20秒
      this.timer_ = setTimeout(() => {
        this.hide_loading(0);
      }, 20000);
      this.mitt_list = [];
      this.mitt_list.push(useMittOn(MITT_TYPES.EMIT_LOADING_CTR_CMD, this.hide_loading).off)
        // 参数控制处理和跳转逻辑
        url_param_ctr_init(this);
        MenuData.get_new_data&&MenuData.get_new_data()
        this.init_process() 
      // 监听页面是否转入休眠状态
      document.addEventListener("visibilitychange",this.visibilitychange_handle);
      document.addEventListener("pagehide", this.visibilitychange_handle);

    },
    watch: {
      '$route'(to, from) {
        watch_route_fun(to, from, this);
      },
      init_load(val){
        if(val && document.getElementById("loading-root-ele")){
          if(!['ouzhou-pc'].includes(BUILDIN_CONFIG.PROJECT_NAME)){
            document.getElementById("loading-root-ele").style.visibility = "hidden";
          }
          // 隐藏loading动画背景
          useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,1)
        }
      }
    },
    methods: {
     
      /**
       *@description 页面可见性变化的处理函数
      */
      visibilitychange_handle() {
        if (!this.vue_hidden_run_flg) {
          return false;
        }
        let is_hidden = document.visibilityState == "hidden";
      
        if (is_hidden) {
          window.DOCUMENT_HIDDEN = new Date().getTime();
        } else {
          // 获取 焦点后 ，页面激活 ，次开关打开 ，HTTP,WS 就会自动 打开开关
          window.DOCUMENT_HIDDEN = "";
        }
        // 设置当前页面是否后台运行中状态
        GlobalAccessConfig.set_vue_hidden_run(is_hidden);
      
        //页面失去焦点 ，隐藏   后台运行
        if (is_hidden) {
          this.background_run_time = new Date().getTime();
          // 在后台运行超过 over_timer 分钟后才广播刷新数据指令
        } else {
          // 页面 唤起  这里流程分 二种：
          // 流程一：   离开不到30分钟 ，  列表或者详情 ，监听到 页面聚焦时间 变更 ，重新拉取当前的接口
          // 流程二：   离开超过30分钟 ，  页面直接刷新 重走流程
          // 30分钟  重载刷新  页面
          let over_timer = 30 * (60 * 1000);
          let now_time = new Date().getTime();
          // 在后台共运行了多少时间
          let run_time = now_time - this.background_run_time;
          // 页面需要 重载刷新
          let need_reload = run_time > over_timer;
          //如果需要 重载刷新
          if (need_reload) {
            window.location.reload();
          } else {
            // 站点 tab 休眠状态转激活  ，
            useMittEmit(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT);
          }
        }
      },
      async init_process() {
        try {
          // 设置是否是内嵌iframe
          // 设置商户分割信息
          BUILDIN_CONFIG.DOMAIN_RESULT.gr = SessionStorage.get("gr", "COMMON");
          // 设置商户样式
          if (top.location != location) {
            if (
              DEFAULT_VERSION_NAME == "zhuanye" &&
              window.SEARCH_PARAMS.init_param.get('ignore_iframe_pc') == 1
            ) {
              SessionStorage.set("hide_logo_icon", "1");
            }
          } else {
            SessionStorage.set("hide_logo_icon", "0");
          }
         
        } catch (error) {
          console.error(error)
        } finally {
           // 这里最好是 url 内的 语种 ，不过 兜底语言是中文 因此 这里设置中文
          // 后面如果确实有需要就自己处理 。目前这个是兼容某些异常场景下 接口先返回来回
          // 文件后返回回来 的显示异常，不管 前端缓存，资源文件丢失的场景，生产无此场景
          let languageName = window.SEARCH_PARAMS.init_param.get('lang') ||LocalStorage.get('lang') ||'zh';
          await loadLanguageAsync(languageName);
          console.log(" init_domain --  开始执行:");
          // 实例化域名检测类对象
          AllDomain.create(() => {
          
            // 首次进入,发现最快的域名
            console.error(" init_domain -- 回调执行:");
            // http初始化方法 会调用 setApiDomain
            // ws和http域名切换逻辑
            http.setApiDomain();

            enter_params(async(user)=>{
              // 客户端-获取紧急开关配置
              await GlobalAccessConfig.init();
              // 元数据初始化
              base_data.init();
              // 投注信息 初始化
              BetData.init_core();
              
              // 设置设备类型 2 pc
              BetData.set_device_type(2);
              BetViewDataClass.init();
              BetWsMessage.init()
              // 布局初始化
              LayOutMain_pc.init();
              //赛事详情类参数初始化
              MatchDetailCalss.init()
              //全局开发类初始化
              GlobalSwitchClass.init()
              this.init_load = true;
            })
          });
        AllDomain.run();
        }
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
    beforeUnmount() {
      // 销毁监听
      this.mitt_list.forEach(i=>i());
      clearTimeout(this.timer_);
      // 移除监听页面是否转入休眠状态
      document.removeEventListener("visibilitychange",this.visibilitychange_handle);
      document.removeEventListener("pagehide", this.visibilitychange_handle);
      clearTimeout(this.background_run_time_timer);
    
    },
}