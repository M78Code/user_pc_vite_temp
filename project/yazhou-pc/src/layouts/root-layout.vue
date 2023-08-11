<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 根容器
-->
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- 图片预加载 -->
    <div v-if="showPreload" class="preload"></div>
    <!-- 页面实际容器 -->
    <router-view v-if="is_init_config && show_router_view" :key="$i18n.locale"/>
    <!-- 网络中断组件 -->
    <!-- 网站维护提示组件 -->
    <!-- 网络状态组件 -->
  </q-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import websocket from "src/public/mixins/websocket/websocket.js"; // websocket数据页面数据接入
import global_mixin from "src/public/mixins/global/global_mixin.js";//全局设置
import play_mapping from "src/public/config/mapping/play_mapping";//处理业务逻辑中(用来做判断使用),需要用到的玩法id集合
import BaseUserInfo from "src/public/utils/user/base_user_info.js";//: 用户基本信息缓存存储,及工具方法(语种信息,赔率类型,主题设置等)
import match_list_basic_data from "src/public/utils/dataClassCtr/match_list_basic_data.js"
import "src/public/utils/menuClass/menu_class_new.js" // 菜单核心功能的class类
import NewMenu from "src/public/utils/menuClass/menu_class_new.js";
import userCtr from 'src/public/utils/user/userCtr.js';
import {
  api_common,

} from "src/public/api/index";

export default {
  name: "RootLayout",
  mixins: [websocket, global_mixin ],

  data() {
    return {

      // 配置是否初始化完成
      is_init_config: false,
      //业务逻辑需要的数据
      play_mapping: {},
      timer:null, // 定时器
      original_url: "",
      showPreload: false,
      showPreloadTimer: null,
      // 当前页面转后台运行开关
      vue_hidden_run_flg:false,
      // 定时器
      timeout_vue_hidden_run_flg:null,
      // 休眼后台运行是间缀
      background_run_time:0,
      // 是否显示主路由试图
      show_router_view:false,
    };
  },

  computed: {
    ...mapGetters({
      lang: "get_lang",//获取语言
      // 获取用户信息
      vx_get_user: "get_user",
      get_user_token:"get_user_token",//获取用户token
      get_theme: "get_theme",//获取模板主题
      // 获取服务器时间和本地时间差
      vx_get_timestamp: "get_timestamp",
      get_is_user_no_handle: "get_is_user_no_handle",
    }),
  },
  watch:{
    lang(lang){
      userCtr.set_web_title(lang)



      // 更新赛事基础数据
      match_list_basic_data.get_simple_matches()
    },
    // 全局点击事件
    get_global_click(){
      this.user_handle_last_time = new Date().getTime()
      this.get_is_user_no_handle && this.set_is_user_no_handle(false)
    },
  },
  created() {
    // 设置即将开赛筛选默认值为全部
    this.$store.state.filter.open_select_time = null;
    // 业务逻辑数据
    this.play_mapping = play_mapping;
    // 将 vue 实例对象挂载到 window
    window.vue = this;
    // 设置当前服务器时间缀与本地时间缀
    this.vx_set_remote_server_time();
    //设置用户id
    this.set_uuid();
    this.go_to_hash()
    // 处理引流页登录跳转
    var url = window.location.href;
    // 存储刚进入页面的url(给url上报提供)
    window.sessionStorage.setItem('original_url',url)
    var token = "";
    if (url.includes("?")) {
      let param = url.match(/token=([a-zA-Z0-9]*)/);
      if (param && param.length > 1) {
        token = param[1];
        let url = window.location.href.replace('?#','#').replace('?&','?').replace('&#','#').replace(/[\?&]$/,'')
        history.replaceState(null, null, url);
      }
      param = url.match(/lang=([a-zA-Z0-9]*)/);
      if(param && param.length > 1) {
        window.url_lang = param[1];
      }
    }

    // 进入时 判断url是否含keep_url, 没有就去除参数
    if (!location.href.includes('keep_url')) {
      // 去除参数
      url = url.replace(location.search, '')
      // 设置最新url地址
      history.replaceState(null, null, url)
    }

    if(!token && this.get_user_token)
    {
      token = this.get_user_token;
    }

    if (token) {
      // 如果url上的lang参数存在，调用一次设置语言
      this.vx_set_is_invalid(false);
      this.vx_set_user_token(token);
      this.vx_set_user({ token,view:this,finish_callback:()=>{
        // 设置主题
        this.handle_init_theme();
        // 显示主路由试图
        this.show_router_view = true;
      }});
    }else{
      this.handle_init_theme();
      // 显示主路由试图
      this.show_router_view = true;
      this.$root.$emit('close_home_loading', false)

       userCtr .handle_merchant_setup_preview().then(()=>{

        this.is_init_config = true

       })


      // 设置登录无效
      this.vx_set_is_invalid(true);
      // 强制弹token失效窗口
      if (this.timer) {clearTimeout(this.timer)};
     this.timer = setTimeout(() => {
        this.show_fail_alert();
      }, 500);
      if(window.ws){
        window.ws.destroy(true);
      }
    }

    let params = url.split('?')[1];
    let paramsArr = [];
    let lg, mk;
    const userInfo = BaseUserInfo.get();
    // 获取链接里的 语言 lg, 盘口设置 mk
    if (params && params.includes('&')) {
      paramsArr = params.split('&');
      paramsArr.forEach(item => {
        // 语言
        if (item.includes('lg')) {
          lg = item.split('=')[1];
        } else {
          lg = userInfo && userInfo.languageName;
        }
        this.set_lang(  sessionStorage.getItem('lang') || lg || 'zh');
        // 盘口偏好
        if (item.includes('mk')) {
          mk = item.split('=')[1].toUpperCase();
        } else {
          mk = userInfo && userInfo.userMarketPrefer;
        }
        this.set_cur_odd(mk || '')
      })
      // 语言和盘口设置都有值的时候直接加载页面
      if (!!lg && !!mk) {
        this.is_init_config = true;
      }
    }
    this.showPreloadTimer = setTimeout(() => {
      this.showPreload = true;
    }, 2000);


    // 设置当前页面是否后台运行中状态
    this.set_vue_hidden_run(false);
    // 设置当前页面转后台运行开关
    this.timeout_vue_hidden_run_flg = setTimeout(() => {
      this.vue_hidden_run_flg = true;
    }, 4000);

    // 监听VUE页面刷新事件

    this.$root.$on('upd_user_data', this.upd_user);
    this.user_handle_last_time = new Date().getTime()
    this.set_is_user_no_handle(false)
    window.addEventListener('mousemove',this.mousemove)
    window.addEventListener('keydown',this.keydown)

    // 监听页面是否转入休眠状态
    document.addEventListener('visibilitychange', this.event_listener_visibilitychange);
    document.addEventListener('pagehide', this.event_listener_visibilitychange);

    // 设置电竞图片资源域名
    this.set_e_sports_domain_img()

  },

  methods: {
    ...mapActions({
      vx_set_remote_server_time: "set_remote_server_time", // 设置当前服务器时间缀与本地时间缀
      set_uuid: "set_uuid",//设置用户id
      vx_set_user: "set_user",  // 设置用户信息
      set_user_assign: "set_user_assign",
      set_is_user_no_handle: 'set_is_user_no_handle',
      // 设置当前页面是否后台运行中状态
      set_vue_hidden_run:'set_vue_hidden_run',
      set_theme: 'set_theme',

    }),
    ...mapMutations({
      vx_set_user_token: "set_user_token",//设置用户token
      vx_set_is_invalid: "set_is_invalid", //设置登录是否失效状态
      set_cur_odd: "set_cur_odd",// 设置盘口偏好
      set_pre_odd: "set_pre_odd",// 设置上次盘口偏好
      set_lang: "set_lang" //设置语言
    }),
    /**
     * @description 主题初始化设置 1.用户已切换过主题 （区分常规-蓝色来回切换） 2.用户初次进入页面
     *
     * 当用户首次进入 url 参数内没有带 主题 ， userinfo 接口 第一次 请求 出现错误
     * 则会存在问题： 问题 影响面 不大 ，只要纠正到  同组就行
     * 可能会出现先显示的 theme01  然后被纠正到 theme01_y0  这种第一次 进来 接口出错的场景不管 ，闪一次就好
     * 以页面尽快显示为准
     *
     */
    handle_init_theme() {
      // sessionStorage 里面存储的 主题配置
      let session_theme =  sessionStorage.getItem("theme") ||''
      //localStorage 里面存储的 主题配置
      let local_theme =     localStorage.getItem('userId_theme') && JSON.parse(localStorage.getItem('userId_theme')) || {}
      //留意此处的 sessionStorage 内的 theme 可能是错的 ， 优先级 localStorage > session_theme
      //最终计算后的 theme
      let final_theme=''
      if(session_theme){
        // session 有主题色代表刷新 或者弹窗
        final_theme=session_theme
      }else{
      //读取 localStorage 内的 theme 并且 纠正
      if (Object.keys(local_theme).length) {
              //localStorage 里面存储的 主题配置
              const curr_user_id = this.vx_get_user.userId
              //当前缓存的主题设置
              let ct= ''
              //主题色 重设 和强制纠正
              //有用户信息
              if (curr_user_id) {
                //当前缓存的主题设置
                ct= local_theme[curr_user_id]
                //用户信息内 主题蓝色
                if (this.vx_get_user.stm == 'blue') {
                  //Y0系列主题强制纠错
                  if (ct && !ct.endsWith('_y0')) {
                    ct += '_y0'
                  }
                  //同步 商户主题色系
                  localStorage.setItem('merchant_style', 'y0')
                } else {
                   //同步 商户主题色系
                  localStorage.setItem('merchant_style', 'common')
                }
              } else {
                // 无用户信息
                //  此时 走  src\index.template.html  内 通过url 参数对  merchant_style 的设定
                //  之前是什么 还是什么
              }
              //最终计算后的 theme
            final_theme=ct
            }
      }
      //主题色，这里url 传参的优先级 可以提前 ，目前是没这样对接的，未来可能这样对接
      final_theme=  final_theme|| new URLSearchParams(location.search).get("theme") ||'';
      // 一般来讲 ，final_theme  session_theme  要么都有值 要么都没 ，而且相等 但是优先级  ，final_theme 大
    // 事实上到这一步  final_theme 不一定有值 ， 如果  session_theme 没值，代表要纠正主题 ，有值代表弹窗或者刷新
        if(final_theme){
          //设置 theme
          this.set_theme(final_theme)
        } else{
            // 初次进入页面时 默认主题设置
        this.set_default_theme()
        }

    },
    /**
     * @description 默认主题设置
     */
    set_default_theme() {


      // 默认 白色版
      const default_theme = _.get(this.vx_get_user, 'configVO.profesTag', 1)
      // 商户 主题色系
      let is_y0 = localStorage.getItem('merchant_style') == 'y0'
      if (is_y0) {
        this.set_theme(`theme0${default_theme}_y0`)
      } else {
        this.set_theme(`theme0${default_theme}`)
      }
    },
     /**
     * @description: 跳转指定路由
     */
    go_to_hash(){
      let params = new URLSearchParams(window.location.search)
      let gotohash = params.get('gotohash')

       // 外链 跳转到 赛事详情页面  拼接规则=> ?gotohash=体育类型-赛事id-联赛tid-球种csid
       // 跳转到体育赛事详情 ?gotohash=sports-2267075-239-1
       if (gotohash && gotohash.includes('-')) {
         const [type, mid, tid, csid] = gotohash.split('-')
         const go_to_details_obj = {
           name: 'details',
           params: {
             mid,
             tid,
             csid
           }
         }

         this.$router.push(go_to_details_obj)
       } else {
         // 其他特定路由情况

         switch (gotohash) {
           case 'worldcup':
             // this.$router.push({name: 'world_cup_schedule'})
             break;

           default:
             break;
         }
       }

    },
        /**
     * @description: 设置电竞图片资源域名
     */
     set_e_sports_domain_img(){
      try {

           // 获取持久化的电竞图片域名
           window.env.config.e_sports.domain_img = localStorage.getItem('e_sports_domain_img');


        // 从服务器获取电竞域名信息
        api_common.get_games_imgDomain( {}).then(res => {
          // console.error(' api_common.get_games_imgDomain-----',res);
          if (  res.data && res.data.data) {
            // 请求成功,获取服务器返回的数据
            let temp = _.get(res,'data.data');
            // 切除域名后面多余的/
            if(temp && _.endsWith(temp, '/')){
              temp = temp.substring(0,temp.length-1);
            }
            // 持久化电竞图片域名
            localStorage.setItem('e_sports_domain_img',temp);
            // 设置全局电竞图片域名信息
            window.env.config.e_sports.domain_img = temp;
          }
        }).catch( err => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    },


   /**
     * 离开页面 30 分钟重新 聚焦页面 需要重载刷新 浏览器
     * 30分钟内 每次获取 焦点 传递一次  休眠状态转激活 事件
     */
     /**
     * @description: visibilitychange事件监听
     */
     event_listener_visibilitychange(){
       if (!this.vue_hidden_run_flg) { return false }
       let _is_hidden = document.visibilityState == 'hidden'
      //  document.visibilityState == 'visible'
       if (_is_hidden) {
         window.DOCUMENT_HIDDEN = new Date().getTime()
       } else {
         // 获取 焦点后 ，页面激活 ，次开关打开 ，HTTP,WS 就会自动 打开开关
         window.DOCUMENT_HIDDEN = ''
       }

       // 设置当前页面是否后台运行中状态
       this.set_vue_hidden_run(_is_hidden);
       //页面失去焦点 ，隐藏   后台运行
       if (_is_hidden) {
         this.background_run_time = new Date().getTime()
         // 在后台运行超过 over_timer 分钟后才广播刷新数据指令
       } else {
         // 页面 唤起  这里流程分 二种：
         // 流程一：   离开不到30分钟 ，  列表或者详情 ，监听到 页面聚焦时间 变更 ，重新拉取当前的接口
         // 流程二：   离开超过30分钟 ，  页面直接刷新 重走流程
         // 30分钟  重载刷新  页面
         let over_timer = 30 * (60 * 1000)
         let now_time = new Date().getTime()
         // 在后台共运行了多少时间
         let run_time = now_time - this.background_run_time
         // 页面需要 重载刷新
         let need_reload = run_time > over_timer
         //如果需要 重载刷新
         if (need_reload) {
          window.location.reload()
         } else {
           // 站点 tab 休眠状态转激活  ，
           this.$root.$emit(this.emit_cmd.EMIT_SITE_TAB_ACTIVE )
         }
       }
},


    /**
     * @Description 鼠标移动
     * @param {undefined} undefined
    */
    mousemove(){
      this.user_handle_last_time = new Date().getTime()
      this.get_is_user_no_handle && this.set_is_user_no_handle(false)
    },
    /**
     * @Description 键盘按下
     * @param {undefined} undefined
    */
    keydown(){
      this.user_handle_last_time = new Date().getTime()
      this.get_is_user_no_handle && this.set_is_user_no_handle(false)
    },
    /**
     * @Description 定时器检查用户是否长时间未操作
     * @param {number} setting_no_handle_time 后台设定的长时间未操作时间
     * @param {undefined} undefined
    */
    check_user_no_handle(setting_no_handle_time){
      // 距离上次操作时间
      let since_last_time = new Date().getTime() - this.user_handle_last_time
      if(since_last_time >= setting_no_handle_time){
        since_last_time = 0
      }
      let timing = setting_no_handle_time - since_last_time + 100
      this.check_user_no_handle_timer = setTimeout(()=>{
        since_last_time = new Date().getTime() - this.user_handle_last_time
        // 如果距离上次操作时间 大于后台设定的长时间未操作时间 则设置用户长时间未操作
        if(since_last_time > setting_no_handle_time){
          this.set_is_user_no_handle(true)
        }
        this.check_user_no_handle(setting_no_handle_time)
      },timing)
    },
    upd_user(){
      if(this.get_user_token)
      {
        this.vx_set_user({
          token:this.get_user_token,
          view:this,
          finish_callback: () => {
            // 设置主题
            this.handle_init_theme();
          }
        });
      }
    }
  },
  destroyed() {

    this.$root.$off('upd_user_data', this.upd_user);
    this.$root.$off('close_home_loading', false)
    window.removeEventListener('mousemove',this.mousemove)
    window.removeEventListener('keydown',this.keydown)

    document.removeEventListener('visibilitychange', this.event_listener_visibilitychange);
    document.removeEventListener('pagehide', this.event_listener_visibilitychange);

        // 清除定时器
        clearTimeout(this.timeout_vue_hidden_run_flg);
     /**清除定时器 */
    clearTimeout(this.check_user_no_handle_timer);
    clearTimeout(this.timer);
    clearTimeout(this.showPreloadTimer)
    this.timer =null
  }
};
</script>
<style scoped>
.preload {
  width: 1px;
  height: 1px;
  position: absolute;
  background: url('~public/image/common/png/sport_icon.png'),
                    url('~public/image/common/png/sport_icon36.png'),
                    url('~public/image/common/png/sport_icon_unselect.png'),
                    url('~public/image/common/png/hot_icon.png'),
                    url('~public/image/common/png/hot_icon_un_select.png'),
                    url('~public/image/common/activity_banner/banner.jpg'),
                    url('~public/image/common/png/sport_icon_hover.png'),
                    url('~public/image/common/png/team_logo_01.png'),
                    url('~public/image/common/png/team_logo_02.png');
}
</style>



