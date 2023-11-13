/*
 * @Author: success
 * @Date: 2020-08-28 20:51:01
 * @Description: http相关API Domain动态更新逻辑
 */

console.log('测试执行------------2----0');

import http from "src/public/utils/http/axios_warpper";
http.init_window_env()
import AllDomain from 'src/public/utils/http/all_domain.js'
import {   loadLanguageAsync } from 'src/boot/i18n'

import axios from "axios";

const axios_instance = axios.create()
console.log('测试执行------------2----1');
import { mapGetters} from "vuex";
export default {
  data() {
    console.log('测试执行------------2----2');
    return {
      // api刷新数据参数
      api_cmd_data:null,

      // 是否已经加载过
      init_load:false,
      // init_load设置使用到的定时器
      init_load_timer:null,
      // app进入页面的全局loading动画开关
      app_init_loading:false,
      // app进入页面的全局loading动画关闭时使用的定时器
      app_init_loading_timer:null,
    }
  },
  computed: {
    ...mapGetters({
      // 登录是否失效
      vx_get_is_invalid: "get_is_invalid",
    }),
    /**
    * @description: 首屏loading动画是否显示
    * @return {boolean} 是否显示首屏loading中动画
    */
    loading_is_show() {
      return (this.app_init_loading && !this.init_load);
    },
  },
  created(){
    console.log('测试执行------------2----3');

    window.vue = this;
    // 设置wslog 默认函数防止提前调用报错
    window.wslog = {sendMsg:()=>{}}
    // 设置商户分割信息
    let gr = sessionStorage.getItem('gr')
    if(gr){
      window.env.config.gr = gr.toLocaleUpperCase();
    } else {
      window.env.config.gr = 'COMMON';
    }


    // 首屏loading动画是否显示使用的延时器
    this.loading_is_show_timer = 0;
    this.app_init_loading = true;
    // 抖动处理
    // 重新设置api域名函数
    this.resetApiDemo = this.throttle(this.resetApiDemo,12000, {leading: true, trailing: true});

    // 发送api错误消息函数
    this.send_api_error_data = this.throttle(this.send_api_error_data,10*1000, {leading: true, trailing: true});
    // 接受ws断开命令
    this.$root.$on('EMIT_API_DOMAIN_UPD_CMD', this.resetApiDemo);
    // 发送用户基本信息到服务命令
    this.$root.$on('EMIT_API_USER_PRO_INFO_CMD', this.send_user_pro_info);
    // 调用用户接口，更新 域名流程
    this.$root.$on('set_getuserinfo_oss_api', this.set_getuserinfo_oss_api);
    //当出现异常兜底 12 秒显示页面
    this.init_load_timer = setTimeout(() => {
      this.set_init_load(true);
    }, 12000);

       // 这里最好是 url 内的 语种 ，不过 兜底语言是中文 因此 这里设置中文
    // 后面如果确实有需要就自己处理 。目前这个是兼容某些异常场景下 接口先返回来回
    // 文件后返回回来 的显示异常，不管 前端缓存，资源文件丢失的场景，生产无此场景
    let languageName = localStorage.getItem('lang') || 'zh';

  loadLanguageAsync(languageName).finally(()=>{
   // 实例化域名检测类对象
   AllDomain.create(()=>{
    // 首次进入,发现最快的域名
    this.init_net_set();
    this.set_init_load(true);


  });

    // 启动域名检测功能
    AllDomain.run();
    console.log('测试执行------------2----5');
    })

    console.log('测试执行------------2----4');


  },
  destroyed(){
    // 移除监听事件
    this.$root.$off('EMIT_API_DOMAIN_UPD_CMD', this.resetApiDemo);
    this.$root.$off('EMIT_API_USER_PRO_INFO_CMD', this.send_user_pro_info);
    // 调用用户接口，更新 域名流程
    this.$root.$off('set_getuserinfo_oss_api', this.set_getuserinfo_oss_api);
    // 取消节流函数功能
    this.debounce_throttle_cancel(this.resetApiDemo);

    this.debounce_throttle_cancel(this.send_api_error_data);
    // 清除定时器
    clearTimeout(this.init_load_timer);
    clearTimeout(this.app_init_loading_timer);
    clearTimeout(this.loading_is_show_timer);


  },

  methods: {
    /**
     * @description: 设置this.init_load变量的状态
     * @param {*} status 布尔值
     */
    set_init_load(status){
      // 当this.init_load值从false,变到true时进入
      if((!this.init_load) && status){
        // 清除上次的定时器
        clearTimeout(this.app_init_loading_timer)
        // 10秒后关闭,阻止页面数据加载时白屏问题
        this.app_init_loading_timer = setTimeout(() => {
          // 关闭app全局loading动画
          this.app_init_loading = false;
        }, 10000);
      }
      this.init_load = status;
    },
    //  调用用户接口，更新 域名流程
    set_getuserinfo_oss_api(oss_) {
      AllDomain.set_getuserinfo_oss(oss_);
    },
    /**
     * @description: 初始化网络配置
     */
    init_net_set(){
      // 首次初始化时调用
      if(!this.init_load){
        //初始化window.env
        http.init_window_env()
        // http初始化方法
        http.init();
      }
      // ws和http域名切换逻辑
      http.setApiDomain();



    },

    /** 触发切网络api域名动作
     * @description:
     * @param {undefined}  data 消息体
     * @return {undefined} undefined
     */
    resetApiDemo(data){
      if(AllDomain)
      {
        // 如果用户失效,ws停止请求
        if(data  && this.vx_get_is_invalid){
          return;
        }
        console.log('触发切网络api域名动作',data)
        // 错误上报相关
        if(data && (data.type == 'http' ||data.type == 'ws')){
          if(typeof(data.data) == 'string'){
            try {
              // 字符串转json对象数据
              data.data = JSON.parse(data.data);
            } catch (error) {
              console.error('resetApiDemo:',error);
            }
          }
          this.api_cmd_data = {time:new Date().getTime(), data};
        } else {
          this.api_cmd_data = {time:new Date().getTime(), data};
        }


          // 切换可用的api域名
          AllDomain.auto_set_domain_event(window.env.config.domain[window.env.config.current_env][0]);

      }
    },



    /**
     * @description: 发送错误信息api到服务器
     */
    send_api_error_data(object){
      return;
      // 发送api域名全部不可用通知
      this.$root.$emit(this.emit_cmd.APIS_DOMAIN_ALL_BAD);
      if(process.env.NODE_ENV == "development")
      {
        // 是开发环境时直接返回
        return;
      }
      if(this.api_cmd_data && this.api_cmd_data.data.type == 'ws'){
        // ws断开推送消息的直接返回
        return;
      }
      // 定义需要提交的信息字段
      let lang = '';
      let accessToken = '';
      let userInfo = null;
      let errorApi = null;
      let apiStatus = null;

      if(window.vue){
        // 获取语言
        if(window.vue.lang){
          lang = window.vue.lang;
        }
        // 获取token
        try {
          // 从用户信息中获取token
          accessToken = window.vue.$store.getters.get_user_token.token
        } catch (e) {
          console.error(e)
        }
        if (!accessToken) accessToken = '';
        // 获取用户信息
        try {
          userInfo = window.vue.$store.getters.get_user
        } catch (e) {
          console.error(e)
        }
        if (!userInfo) userInfo = null;

        // 获取提交的错误信息
        if(this.api_cmd_data){
          if(new Date().getTime()-this.api_cmd_data.time < 25*1000){
            console.log('this.api_cmd_data.data==',this.api_cmd_data.data)
            if(this.api_cmd_data.data){
              errorApi = this.api_cmd_data.data;
            }
          }
        }

        // 获取api域名信息
        try {
          if(object){
            apiStatus = object;
          } else {
            let str = localStorage.getItem(AllDomain.DOMAIN_API);
            if(str)
            {
              // 字符串转json对象数据
              apiStatus = JSON.parse(str);
            }
          }
        } catch (error) {}
      }
      // 拼装需要提交的数据
      let data = {
        env:window.env.config.current_env, // 环境信息 ，  可选值： local_dev  ，local_test，local_ylcs，idc_pre，idc_sandbox，idc_lspre，idc_online
        tag:window.env.config.TAG, // git tag
        projectHref:location.href , // 当前项目的 url  , 例如 https://user-pc.35ri3g.com/#/home  ，有什么 拿什么 不一定带token ,页面的 哈希路径一定 要带上  location.href
        projectInfo:window.env.config.pro_arr, // 项目信息 对象
        config:window.env.config,// 所有配置信息
        userInfo:userInfo,// 用户信息 对象  ，  //  user/getUserInfo  这个接口返回的 对象  ，包含商户的一些配置
        userToken:sessionStorage.getItem('pc_token'),//用户 的  token
        apiStatus:apiStatus,// 目前页面上 允许的请求 域对象  以及   各自目前的  状态 延迟信息
        lang: lang, // 当前用户的 选择 的 页面展示语言
        description:'', // 描述  ，自己 附加的  描述信息 ，便于分析问题
        errorApi:http.HTTP_ERROR_API_ERR_DATA,      //  最终由哪个 api 接口 引起的   错误 上报     {  url:'' , params:'' ,method:''   }
        module:'h5-api-domain', //  报错模块信息
        projectType:'pc', //项目类型  小写  h5 ,pc
        isInIframe:(top.location != location),//是否 处于内嵌 ，
        isInApp:false, // 是否 是 包网 app 内 webview  ，能确定就传 ，不能就不传
        returnCitySN:'' // 用户位置信息
      }
      // 发送数据到服务器
      axios_instance.post(http.HTTP_ERROR_API, data)
        .then(res => {
          console.log('发送成功');
        })
    },

    /**
     * @description: 发送用户配置收集信息到服务器
     */
    send_user_pro_info(){
      return;
      if(process.env.NODE_ENV == "development")
      {
        // 是开发环境时直接返回
        return;
      }
      // 获取用户上次发消息的时间
      let time = localStorage.getItem('s_user_info_time')
      // 24小时内只发送一次消息,到服务器
      if(time && (new Date().getTime() - time*1 < 1*24*60*60*1000)){
        return;
      }
      // 定义需要提交参数的变量
      let lang = '';
      let accessToken = '';
      let userInfo = null;
      if(window.vue){
        // 获取语种
        if(window.vue.lang){
          lang = window.vue.lang;
        }
        // 获取token
        try {
          accessToken = window.vue.$store.getters.get_user_token.token
        } catch (e) {
          console.error(e)
        }
        if (!accessToken) accessToken = '';
        // 获取用户信息
        try {
          userInfo = window.vue.$store.getters.get_user
        } catch (e) {
          console.error(e)
        }
        if (!userInfo) userInfo = null;
      }
      let project_name = '';
      // 获取项目信息
      if(window.env.config.FINAL_TARGET_PROJECT_NAME == 'yabo'){
        project_name = 'pc-zhuanye';
      }
      // 拼装需要提交的数据
      let data = {
        config:window.env.config,// 所有配置信息
        env:window.env.config.current_env,  // 环境信息 ，  可选值： local_dev  ，local_test，local_ylcs，idc_pre，idc_sandbox，idc_lspre，idc_online
        projectHref: location.href , // 当前项目的 url  , 例如 https://user-pc.35ri3g.com/#/home  ，有什么 拿什么 不一定带token ,页面的 哈希路径一定 要带上  location.href
        projectInfo: { "final_type":project_name}, // 项目信息对象内 必须有一个字段 final_type :  取值范围 ： [  'pc-zhuanye',  'h5-xinban', 'h5-jiuban' ]
        userInfo: userInfo, // 用户信息 对象   user/getUserInfo  这个接口返回的 对象  ，包含商户的一些配置
        userToken: sessionStorage.getItem('pc_token'), // 用户的token
        tag: window.env.config.TAG, // 项目的tag版本号
        lang: lang, // 当前用户的选择的页面展示语言
        description: "", // 描述自己附加的描述信息,便于分析问题
        projectType: "pc", //项目类型  小写  h5 ,pc
        isInIframe:(top.location != location), // 是否 处于内嵌 ，pc  专用
        isInApp: false, //是否 是 包网 app 内 webview  ，能确定就传 ，不能就不传
        other: {} // 扩展字段  对象
      }
      // 发送数据到服务器
      axios_instance.post(http.HTTP_PRO_INFO_API, data)
        .then(res => {
          // 更新本次次发消息的时间
          localStorage.setItem('s_user_info_time', new Date().getTime())
          console.log('发送成功');
        })
    },



  },
  watch: {
    loading_is_show(new_){
      if(!new_){
        clearTimeout(this.loading_is_show_timer);
        // 延迟隐藏首屏loading动画
        this.loading_is_show_timer = setTimeout(() => {
          // 隐藏首屏loading动画
          this.$utils.loading_animation_hidden();
        }, 3000);
      }
    }
  }
};
