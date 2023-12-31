
import { defineComponent, defineAsyncComponent } from "vue";
import _ from "lodash";

import {change_theme_variable} from  "../../theme/theme-config.js"

//头部引入
import {
  useMittOn,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "project_path/src/core/index.js";
import { UserCtr } from "project_path/src/core/index.js";
export default defineComponent({

  data() {
    return {
      animation_src: "", // 预加载动画地址
      screen_width: "", // 屏幕宽度
      inner_height: 667, // 视口高度
      maintenance_time: 0, // 维护提示的显示时间
      theme_list: [
        { name: "黄白", value: "theme01" },
        { name: "黄黑", value: "theme02" },
        { name: "蓝白", value: "theme01_y0" },
        { name: "蓝黑", value: "theme02_y0" },
      ],
    };
  },

  async created() {
    let token =
      SEARCH_PARAMS.init_param.get("token") ||
      UserCtr.get_user_token() ||
      window.SEARCH_PARAMS.get_url_param(window.location.href).get("token");
    // await UserCtr.get_user_info(token);
    // document.getElementById("loading-root-ele")?.style?.visibility = "hidden";
    // html宽度基准值不为375的商户(如：外层样式宽度为750)
    this.wpx = SEARCH_PARAMS.init_param.get("wpx");
    this.inner_height = window.innerHeight;
    //created 内 执行
    this.handle_generat_emitters();
    // this.onResize()
    this.limit_rem();
    let theme = this.get_project_theme();
    UserCtr.set_theme(theme);
    // 设置 主题色 
    change_theme_variable( this.css_var_project_key ,theme)
  },
  mounted() {},
  methods: {
    /**
     * @description 设置项目主题设置
     */
    get_project_theme() {
      let res = '';
      // 默认 白色版
      const default_theme = SEARCH_PARAMS.init_param.get('theme') || 1 // _.get(UserCtr.user_info, 'configVO.h5Default', 1)
      if(default_theme && lodash.startsWith(default_theme,'theme0')){
        res = default_theme;
      } else {
        // 商户 主题色系
        let is_y0 = (SEARCH_PARAMS.init_param.get('stm') == 'blue' || UserCtr.user_info.stm === 'blue') 
        if (is_y0) {
          res = `theme0${default_theme}_y0`;
        } else {
          res = `theme0${default_theme}`;
        }
      }
      return res;
    },
    /**
     * @description 主题初始化设置 1.用户已切换过主题 （区分常规-蓝色来回切换） 2.用户初次进入页面
     *
     * 当用户首次进入 url 参数内没有带 主题 ， userinfo 接口 第一次 请求 出现错误
     * 则会存在问题： 问题 影响面 不大 ，只要纠正到  同组就行
     * 可能会出现先显示的 theme01  然后被纠正到 theme01_y0  这种第一次 进来 接口出错的场景不管 ，闪一次就好
     * 以页面尽快显示为准
     */
    handle_init_theme() {
      const local_theme =
        (localStorage.getItem("userId_theme") &&
          JSON.parse(localStorage.getItem("userId_theme"))) ||
        {};
      if (Object.keys(local_theme).length) {
        let user_info = UserCtr.user_info;
        const curr_user_id = user_info.userId;
        //当前缓存的主题设置
        let ct = local_theme[curr_user_id];
        //主题色 重设 和强制纠正
        //有用户信息
        if (user_info) {
          //用户信息内 主题蓝色
          if (user_info.stm === "blue") {
            //Y0系列主题强制纠错
            if (ct && !ct.endsWith("_y0")) {
              ct += "_y0";
            }
            //同步 设置 商户主题色系
            localStorage.setItem("merchant_style", "y0");
          } else {
            localStorage.setItem("merchant_style", "common");
          }
        } else {
          // 无用户信息
          //  此时 走  src\index.template.html  内 通过url 参数对  merchant_style 的设定
          //  之前是什么 还是什么
        }
        // 用户已切换过主题, 则更新当前主题
        if (ct) {
          UserCtr.set_theme(ct);
        } else {
          // 默认主题设置
          UserCtr.set_theme();
        }
      } else {
        // 初次进入页面时 默认主题设置
        UserCtr.set_theme();
      }
    },
    /**
     * 滚动输出
     * @param {*} info 
     */
    handle_scroll(info){
      // console.log('滚动输出------',info);
    },

    //小屏幕rem适配方案，(375的设计稿，16px，可写成.16rem)
    onResize() {
      let html_ele = document.documentElement;
      useMittEmit(MITT_TYPES.EMIT_WINDOW_RESIZE);

      // 等待视口高度变过来以后再做相应的操作
      clearTimeout(this.timer_5);
      this.timer_5 = setTimeout(() => {
        this.toast_show = true;
        this.inner_height = window.innerHeight;
        let max_width = html_ele.clientWidth;
        if (
          window.matchMedia("(orientation:portrait)").matches ||
          window.orientation == 180 ||
          window.orientation == 0
        ) {
          this.set_is_hengping(false);
          html_ele.style.cssText = "font-size: 26.667vw";
          if (this.wpx) {
            if (max_width > this.wpx) {
              this.limit_rem();
              document.getElementById("ty-app").classList.add("max_limit_w750");
            } else {
              document
                .getElementById("ty-app")
                .classList.remove("max_limit_w750");
            }
          } else {
            if (max_width > 500) {
              this.limit_rem();
              document.getElementById("ty-app").classList.add("max_limit_rem");
            } else {
              document
                .getElementById("ty-app")
                .classList.remove("max_limit_rem");
            }
          }
        } else {
          this.set_is_hengping(true);
          if (this.get_is_full_screen) {
            // 横屏而且视频全屏的时候，以屏幕高度来计算rem
            html_ele.style.cssText = "font-size: 26.667vh";
          } else {
            html_ele.style.cssText = "font-size: 26.667vw";
          }
        }
      }, 400);

      this.inner_height = window.innerHeight;

      // 动态设置属性--vh基准值
      this.handle_set_vh();
    },
    // 适配不同移动端网页视图高度
    handle_set_vh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
    // 限制屏幕宽度
    limit_rem() {
      let cW = document.documentElement.clientWidth,
        iW = window.innerWidth;
      let w = Math.max(cW, iW);
      let fz = Math.floor(w / 3.75),
        limit = 170;
      if (fz > limit) fz = limit;
      let onevh = window.innerHeight / 100;
      let html_ele = document.getElementsByTagName("html")[0];
      html_ele.style.cssText = `font-size:${fz}px;--vh:${onevh}px`;
      // 检查计算的font size与getComputedStyle计算的font size
      function setHtmlSize() {
        let realfz = window
          .getComputedStyle(html_ele)
          .fontSize.replace("px", "");
        realfz = Number(realfz);
        realfz = Math.floor(realfz);
        if (fz !== realfz) {
          html_ele.style.cssText = `font-size:${
            fz * (fz / realfz)
          }px;--vh:${onevh}px`;
        }
      }
      setHtmlSize();
    },
    /**
     * @description: touchstart事件方法体
     */
    touchstart_event_fun(event) {
      // 记录用户最后操作时间
      this.user_handle_last_time = new Date().getTime();
      this.get_is_user_no_handle && this.set_is_user_no_handle(false);
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    /**
     * @description: gesturestart事件方法体
     */
    gesturestart_event_fun(event) {
      event.preventDefault();
    },
    // 清除当前组件所有定时器
    clear_timer() {
      const timeout_timer_arr = [
        "timer_3",
        "timer_4",
        "timer_5",
        "timer_6",
        "timer_7",
      ];
      // interval定时器列表
      const interval_timer_arr = ["timer1_"];
      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer]);
        this[timer] = null;
      }
      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer]);
        this[timer] = null;
      }
    },
    /**
     * 生成事件监听
     */
    handle_generat_emitters() {
      let event_pairs = [
        // 投注数量
        {
          type: MITT_TYPES.EMIT_GO_TO_VENDER,
          callback: () => {
            this.$nextTick(() => {
              window.is_token_invalid_show = true;
              this.is_token_invalid_show = true;
            });
          },
        },
        {
          type: MITT_TYPES.EMIT_DOMAIN_ERROR_ALERT,
          callback: () => {
            this.$nextTick(() => {
              this.is_domain_invalid_show = true;
            });
          },
        },
      ];
      let { emitters_off } = useMittEmitterGenerator(event_pairs);
      this.emitters_off = emitters_off;
    },

    // //移除相应监听事件 //视图销毁钩子函数内执行
    // if(this.emitters_off){this.emitters_off()}
    // 添加相应监听事件
    on_listeners() {
      // 设置网络状态
      window.addEventListener("offline", this.offlineEvent);
      window.addEventListener("online", this.onlineEvent);

      // 阻止双击放大
      document.addEventListener("touchstart", this.touchstart_event_fun);
      // 阻止双指放大
      document.addEventListener("gesturestart", this.gesturestart_event_fun);
    },
    // 移除相应监听事件
    off_listeners() {
      document.removeEventListener("touchstart", this.touchstart_event_fun);
      document.removeEventListener("gesturestart", this.gesturestart_event_fun);
    },
  },
});

