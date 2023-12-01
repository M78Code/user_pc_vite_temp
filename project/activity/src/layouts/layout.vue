<template>
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="flex flex-center">
       <component :is="currentComponent"></component>
  </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  
  
  
  import { defineComponent, defineAsyncComponent } from "vue";
  import userStore from "project/activity/src/store/module/user/index.js";
  import langStore from "project/activity/src/store/module/languages/languages.js";
  import themeStore from "project/activity/src/store/module/theme/theme.js";
  // import globalStore from "project/activity/src/public/store/module/global/global.js";
  import _ from 'lodash';
  import utils from 'project/activity/src/utils/utils.js';
  import userCtr from 'project/activity/src/utils/user/userCtr.js';
  
  export default defineComponent({
    name: "IndexPage",
    data() {
      return {
        // 活动链接进入移动端还是 pc 端
        currentComponent: null,
        // 下面是原 user-pc/user-h5 里面的 layout 里的一部分逻辑
        activity_layerimg: "", // 活动弹层的图片url
        video_src: "", // 预加载视频地址
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
    computed: {
      user: () => userStore.getters.get_user(),
      get_lang: () => langStore.getters.get_lang(),
      get_user_token: () => userStore.getters.get_user_token(),
      get_theme: () => themeStore.getters.get_theme(),
    },
    created() {
      let url_search = new URLSearchParams(location.search);
      let token_ =
        url_search.get("token") ||
        this.get_user_token ||
        this.get_url_param(window.location.href).token;
      if (token_) {
        let i = token_.indexOf("#");
        if (i != -1) {
          token_ = token_.substring(0, i);
        }
        this.set_user_token(token_);
      }
  
      // html宽度基准值不为375的商户(如：外层样式宽度为750)
      this.wpx = url_search.get("wpx");
      this.inner_height = window.innerHeight;
  
      let url = "";
      // 删除  api,rdm,token参数
      if (url_search.get("keep_url")) {
        url = utils.remove_url_param(["rdm", "clearcache"]);
      } else {
        url = utils.remove_url_param(["api", "rdm", "token", "clearcache"]);
      }
      // 设置最新url地址
      // history.replaceState(null, null, url);
      // 从URL 地址栏或者缓存信息中获取用户语种和盘口偏好
      let _info2 = url_search.get("lg");
      window.url_param_lg = _info2;
      let _info = userCtr.get_user_base_info();
      let _info3 = url_search.get("mk");
      this.set_lang(_info2 || (_info && _info.languageName) || "");
      let foo =
        (_info3 && _info3.toLowerCase()) || (_info && _info.userMarketPrefer);
      // foo && this.set_cur_odd(foo == "hk" ? "HK" : "EU");
      // 设置全局变量this
      window.vue = this;
      this.user_handle_last_time = new Date().getTime();
      this.set_is_user_no_handle(false);
  
      // api_common.get_time_server().then((res) => {
      //   let server_time = res.data;
      //   let local_time_init = new Date().getTime();
      //   this.init_local_server_time({
      //     server_time,
      //     local_time_init,
      //   });
      // });
  
      this.fetch_actimg = _.throttle(this.fetch_actimg, 1000, {
        leading: true,
        trailing: false,
      });
      this.fetch_resourcesimg = _.throttle(this.fetch_resourcesimg, 1000, {
        leading: true,
        trailing: false,
      });
      // 客户端-获取紧急开关配置
      // this.getAccessConfig();
      // 电竞图片域名 获取
      // this.set_e_sports_domain_img();
      // 获取var事件国际化
      // this.get_var_event_i18n();
    },
    mounted() {
      function ismobile() {
        return navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
      }
      this.currentComponent = defineAsyncComponent(() =>
        ismobile()
          ? import("../pages/yazhou-h5/index.vue")
          : import("project/activity/src/pages/yazhou-pc/index.vue")
      );
    },
    methods: {
      set_lang(...arg) {
        return langStore.mutations.set_lang(...arg);
      },
      set_user(...arg){
        return userStore.mutations.set_user(...arg);
      },
      set_user_token(...arg) {
        return userStore.mutations.set_user_token(...arg);
      },
      // set_cur_odd(...arg) {
      //   return globalStore.mutations.set_cur_odd(...arg);
      // },
      set_uuid(...arg) {
        return userStore.mutations.set_uuid(...arg);
      },
      set_is_user_no_handle(...arg) {
        return userStore.mutations.set_is_user_no_handle(...arg);
      },
      // set_var_event_i18n(...arg) {
      //   return globalStore.mutations.set_var_event_i18n(...arg);
      // },
      set_theme(...arg) {
        return themeStore.actions.set_theme(...arg);
      },
      handle_img_load_error(e) {
        this.float_btnobj = "";
        e.target.onerror = null;
      },
      // 本地测试黄色版本，蓝色版本版用
      to_theme(item) {
        this.set_theme(item.value);
      },
      // 页面刷新操作
      before_unload_page(e) {
        // 恢复动画资源为未缓存状态
        this.set_preload_animation_url(false);
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
          const curr_user_id = this.user.userId;
          //当前缓存的主题设置
          let ct = local_theme[curr_user_id];
          //主题色 重设 和强制纠正
          //有用户信息
          if (this.user) {
            //用户信息内 主题蓝色
            if (this.user.stm === "blue") {
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
            this.set_theme(ct);
          } else {
            // 默认主题设置
            this.set_default_theme();
          }
        } else {
          // 初次进入页面时 默认主题设置
          this.set_default_theme();
        }
      },
      /**
       * @description 默认主题设置
       */
      set_default_theme() {
        // 默认 白色版
        const default_theme = _.get(this.user, "configVO.h5Default", 1);
        // 商户 主题色系
        let is_y0 = localStorage.getItem("merchant_style") == "y0";
        if (is_y0) {
          this.set_theme(`theme0${default_theme}_y0`);
        } else {
          this.set_theme(`theme0${default_theme}`);
        }
      },
      /**
       * @description: 设置电竞图片资源域名
       */
      set_e_sports_domain_img() {
        try {
          // 获取持久化的电竞图片域名
          window.env.config.e_sports.domain_img = localStorage.getItem(
            "e_sports_domain_img"
          );
          let param = {};
          this.send_gcuuid = uid();
          param.gcuuid = this.send_gcuuid;
          api_common
            .get_games_imgDomain(param)
            .then((res) => {
              if (this.send_gcuuid != res.gcuuid) return;
              if (res && res.data) {
                // 请求成功,获取服务器返回的数据
                let temp = _.get(res, "data");
                // 切除域名后面多余的/
                if (temp && _.endsWith(temp, "/")) {
                  temp = temp.substring(0, temp.length - 1);
                }
                // 持久化电竞图片域名
                localStorage.setItem("e_sports_domain_img", temp);
                // 设置全局电竞图片域名信息
                window.env.config.e_sports.domain_img = temp;
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } catch (error) {
          console.error(error);
        }
      },
      //  添加预加载程序， 预加载图片
      all_img_preloading() {
        let images = new Array();
        function preload11(arr_img) {
          for (let i = 0; i < arr_img.length; i++) {
            images[i] = new Image();
            images[i].src = arr_img[i];
          }
        }
        // 添加全局预加载图片
        let preloading_imgs_list = [
          "image/wwwassets/bw3/menu/sport_menu_01.png",
          "image/wwwassets/bw3/menu/sport_menu_02.png",
          "image/bw3/menu/menu-top-background-dota.jpg",
          "image/bw3/menu/menu-top-background-lol.jpg",
          "image/bw3/menu/menu-top-background-wangzhe.jpg",
          "image/bw3/menu/menu-top-background-csgo.jpg",
          "image/bw3/menu/team_logo_02.png",
          "image/bw3/menu/team_logo_01.png",
          "image/bw3/png/no_record.png",
          "image/bw3/svg/no_record2.svg",
          "image/common/slot_machine/machine_silver.png",
          "image/common/slot_machine/machine_gold.png",
          "image/common/slot_machine/machine_diamond.png",
        ];
        //  拼接完整的 url 请求地址
        // origin +  BUILD_VERSION + '/image/common/slot_machine/machine_diamond.png'
        for (let i = 0, len = preloading_imgs_list.length; i < len; i++) {
          // 针对 require 的图片处理
          let is_images = preloading_imgs_list[i].startsWith("images");
          if (is_images) {
            preloading_imgs_list[i] =
              location.origin +
              (this.$g_image_preffix ? "" : "/") +
              preloading_imgs_list[i];
          }
        }
        preload11(preloading_imgs_list);
      },
      //  geruserinfo  接口数据 解析
      jiexi_getuserinfo_res_process(res, _this) {
        //用户信息的 gr 分组参数 判定 流程
        _this.reload_flg = userCtr.check_getuserinfo_gr(res);
        // 用户信息的  内的 视频多久 无操作 时间判定  计算
        let setting_no_handle_time =
          userCtr.compute_video_no_handle_time(res);
        //  用户信息的  内的 视频多久 无操作 有真值 则 执行 相关流程
        setting_no_handle_time &&
          this.check_user_no_handle(setting_no_handle_time);
        //用户投注习惯
        let userBetPrefer = _.get(res.data, "userBetPrefer");
        _this.set_is_accept(userBetPrefer);
        // 用户默认赔率
        let userMarketPrefer = res.data.userMarketPrefer || "EU";
        // _this.set_cur_odd(userMarketPrefer);
        let lang =
          ([
            "zh",
            "en",
            "tw",
            "vi",
            "th",
            "ms",
            "ad",
            "ko",
            "mya",
            "es",
            "pt",
          ].includes(res.data.languageName) &&
            res.data.languageName) ||
          "zh";
        let fun = () => {
          _this.set_user(res.data);
          _this.set_loaded_user_id(res.data.userId);
          // 发送用户基本信息到服务器
          _this.$root.$emit(_this.emit_cmd.EMIT_API_USER_PRO_INFO_CMD);
          // 配置埋点信息
          _utils.gtag_config_send(res.data.userId);
          // 加载诸葛埋点sdk js
          _utils.zhuge_load_sdk_js(res.data.mId);
          // 埋点采集，为了保持对用户的跟踪，记录一个识别码
          _utils.zhuge_identify(res.data.userId, {
            name: res.data.userName, //预定义属性
            m_id: res.data.mId, // 商户id
          });
  
          !_this.get_lang && _this.set_lang("zh");
          //网页基础配置
          _userCtr.set_web_meta_by_config();
        };
  
        if (lang != _this.get_lang || !this.$i18n.messages[lang]) {
          // 异步获取国际化数据,并设置
          loadLanguageAsync(lang)
            .then()
            .finally(() => {
              _this.set_lang(lang);
              this.$i18n.local = lang;
              fun();
            });
        } else {
          fun();
        }
      },
      // 商户 设置 预览 流程
      handle_merchant_setup_preview_process(_this) {
        !_this.get_lang && this.set_lang("zh");
        _userCtr.handle_merchant_setup_preview();
      },
      // 客户端-获取紧急开关配置
      getAccessConfig() {
        let param = {};
        this.send_gcuuid2 = uid();
        param.gcuuid = this.send_gcuuid2;
        api_common.getAccessConfig(param).then((res) => {
          if (this.send_gcuuid2 != res.gcuuid) return;
          console.log(res);
          if (_.get(res, "code") == 200 && _.size(res, "data")) {
            this.set_access_config(_.get(res, "data"));
          }
        });
      },
      // 获取var事件国际化
      get_var_event_i18n() {
        api_common.get_var_event_i18n().then((res) => {
          if (res.code !== 200) return;
          // this.set_var_event_i18n(res.data);
        });
      },
      // userinfo  用户信息接口调用
      user_info_data(_this, one_more_time) {
        _this.reload_flg = false;
        api_admin
          .get_user_info_bytoken({ token: _this.get_user_token })
          .then((res) => {
            // 成功拉取用户接口后，预加载图片
            if (one_more_time != "one_more_time") {
              clearTimeout(this.all_img_preloading_timer1);
              this.all_img_preloading_timer1 = setTimeout(() => {
                this.all_img_preloading();
              }, 2000);
            }
            // 从   userCtr 拿到数据
            let userinfo = _userCtr.get_getuserinfo_data();
            if (userinfo) {
              // 解析用户信息
              _this.jiexi_getuserinfo_res_process(userinfo, _this);
            } else {
              // 商户 设置 预览 流程
              _this.handle_merchant_setup_preview_process(_this);
            }
            if (_.get(res, "code") == 200) {
              // 设置语言
              if (window.url_param_lg) {
                api_admin
                  .get_set_user_language({ languageName: window.url_param_lg })
                  .then()
                  .catch((err) => console.error(err));
                window.url_param_lg = "";
              }
              this.$root.$emit(this.emit_cmd.EMIT_USER_LOGON_OK_EVENT, {
                type: "get_user_info_bytoken",
              });
            }
          })
          .catch((e) => {
            let userinfo = userCtr.get_getuserinfo_data();
            if (userinfo) {
              _this.jiexi_getuserinfo_res_process(userinfo, _this);
            } else {
              // 商户 设置 预览 流程
              _this.handle_merchant_setup_preview_process(_this);
              clearTimeout(_this.user_info_timer1);
              // _this.$root.$emit(_this.emit_cmd.EMIT_GO_TO_VENDER);
              _this.user_info_timer1 = setTimeout(() => {
                // 如果加载超过3次了，则return 掉
                if (_this.user_info_number >= 2) {
                  this.user_info_number = 0;
                  return;
                }
                _this.user_info_number++;
                _this.user_info_data(_this, "one_more_time");
              }, 1000);
              !_this.get_lang && _this.set_lang("zh");
            }
          })
          .finally(() => {
            // 设置主题色  // 放在
            _this.handle_init_theme();
            if (!_this.reload_flg) {
              document.getElementById("loading-root-ele").style.visibility =
                "hidden";
            }
            _this.reload_flg = true;
            _this.fetch_balance(); //用户余额以这个接口为准
            this.show_router_view = true;
          });
      },
      //小屏幕rem适配方案，(375的设计稿，16px，可写成.16rem)
      onResize() {
        let html_ele = document.documentElement;
        this.$root.$emit(this.emit_cmd.EMIT_WINDOW_RESIZE);
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
                document.getElementById("q-app").classList.add("max_limit_w750");
              } else {
                document
                  .getElementById("q-app")
                  .classList.remove("max_limit_w750");
              }
            } else {
              if (max_width > 500) {
                this.limit_rem();
                document.getElementById("q-app").classList.add("max_limit_rem");
              } else {
                document
                  .getElementById("q-app")
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
        // 活动页面比较简单，不用延时触发
        if (this.$route.name == "activity_task") {
          this.inner_height = window.innerHeight;
        }
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
       * 获取资源配置(商户后台配置的图片、跳转链接)
       */
      fetch_resourcesimg() {
        _.delay(() => {
          let param = {
            token: this.get_user_token,
          };
          this.send_gcuuid3 = uid();
          param.gcuuid = this.send_gcuuid3;
          api_common.queryFestivalBanner(param).then((res) => {
            // console.log('qwe', res)
            if (this.send_gcuuid3 != res.gcuuid) {
              return;
            }
            const data = _.get(res, "data");
            if (res && res.code == 200 && data) {
              const stime = this.get_now_server();
              const {
                img11,
                img11Type,
                img11Url,
                img12,
                img12Type,
                img12Url,
                startTime,
                endTime,
              } = data;
              if (stime <= endTime && stime >= startTime) {
                if (img11) {
                  this.set_resources_obj({
                    is_show: true,
                    theme01: {
                      img_src: this.get_file_path(img11),
                      type: img11Type,
                      jump_url: img11Url,
                    },
                  });
                }
                if (img12) {
                  this.set_resources_obj({
                    is_show: true,
                    theme02: {
                      img_src: this.get_file_path(img12),
                      type: img12Type,
                      jump_url: img12Url,
                    },
                  });
                }
              } else {
                this.set_resources_obj({
                  is_show: false,
                  theme02: {},
                  theme01: {},
                });
              }
            }
          });
        }, 1000);
      },
      /**
       * @description 获取运营位活动相关的配置图片, 延迟触发以优化首屏加载速度
       * @return {Undefined} undefined
       */
      fetch_actimg() {
        _.delay(() => {
          let param = {
            token: this.get_user_token,
          };
          this.send_gcuuid4 = uid();
          param.gcuuid = this.send_gcuuid4;
          api_home
            .get_bannerList(param)
            .then((res) => {
              if (this.send_gcuuid4 != res.gcuuid) return;
              if (res && _.get(res, "code") == 200 && _.get(res, "data")) {
                let arr = _.cloneDeep(_.get(res, "data")),
                  arr1 = [],
                  arr2 = [],
                  obj3 = "",
                  obj4 = "";
                arr.forEach((item) => {
                  if (item.tType == 3 && !obj3) {
                    obj3 = item;
                  } else if (item.tType == 4 && !obj4) {
                    obj4 = item;
                    // 去掉一个自然日展示一次的判断，有值就展示
                    if (sessionStorage.getItem("showActivityTime")) {
                      // 判断日期如果不在同一天就展示弹窗
                      if (
                        new Date(
                          +sessionStorage.getItem("showActivityTime")
                        ).getDate() != new Date().getDate()
                      ) {
                        this.showActivity = true;
                      }
                    } else {
                      this.showActivity = true;
                      sessionStorage.setItem(
                        "showActivityTime",
                        new Date().getTime()
                      );
                    }
                  } else if (item.tType == 1) {
                    arr1.push(item);
                    localStorage.setItem(
                      "home_banner_default",
                      this.get_file_path(item.imgUrl)
                    );
                  } else if (item.tType == 2) {
                    arr2.push(item);
                  }
                });
                // 左下角浮层图标
                this.float_btnobj = obj3;
                if (obj4) {
                  // 首页中间弹窗
                  this.activity_layerimg = obj4.imgUrl;
                }
                // 类型：1-首页banner  2-列表banner  3-左下角浮层图标   4-首页中间弹窗
                let obj = {
                  type1: arr1,
                  type2: arr2,
                  type3: obj3,
                  type4: obj4,
                };
                this.set_banner_obj(obj);
  
                // 首页banner没有数据，则展示默认banner
                if (!arr1.length) {
                  this.$root.$emit(this.emit_cmd.EMIT_SHOW_DEFAULT_BANNER_EVENT);
                }
              }
              // T弹框5秒之后 自动关闭
              let time = 5;
              this.userBannerTimer = this.$root
                .$t("common.auto_close")
                .replace("%s", time);
              this.timer1_ = setInterval(() => {
                time--;
                this.userBannerTimer = this.$root
                  .$t("common.auto_close")
                  .replace("%s", time);
                if (time == 0) {
                  this.showActivity = false;
                  clearInterval(this.timer1_);
                }
              }, 1000);
            })
            .catch((err) => {
              console.error(err);
  
              // 接口错误 则首页轮播展示默认banner
              this.$root.$emit(this.emit_cmd.EMIT_SHOW_DEFAULT_BANNER_EVENT);
            })
            .finally(() => {
              // 热门、视频直播页需关闭语言切换状态
              if (this.get_home_tab_item.index !== 0) {
                this.set_is_language_changing(false);
              }
            });
        }, 1000);
      },
      /**
       *@description 点击活动左下角的跳转图标
       * urlType '0'-无链接 '1'-内部跳转链接（目前支持跳转到详情页，'details/3403089/1'、 'details/36858678123944596/100'...） '2'-外部跳转链接（'http://www.example.com'）
       *@return {Undefined} undefined
       */
      activity_click() {
        const fbh = this.float_btnobj.hostUrl;
        if (this.float_btnobj.comfirmTxt && this.user.activityList) {
          // 弹出确认弹框
          this.set_activity_msg(this.float_btnobj);
        } else if (fbh == "act" && this.user.activityList) {
          this.$router.push({
            name: "activity_task",
            query: { rdm: new Date().getTime() },
          });
        } else if (fbh.startsWith("http") && this.float_btnobj.urlType === "2") {
          window.open(fbh, "_blank");
        } else if (fbh && this.float_btnobj.urlType === "1") {
          if (/#*\/*details/.test(fbh) && this.$route.name != "category") {
            const {
              groups: { mid, csid },
            } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(fbh) || {
              groups: {},
            };
            if (mid && csid) {
              if ([100, 101, 102, 103].includes(+csid)) {
                // 如果是电竞赛事，需要设置菜单类型
                this.set_menu_type(3000);
              }
              this.set_goto_detail_matchid(mid);
              this.set_details_item(0);
              this.$router.push({ name: "category", params: { mid, csid } });
            }
          }
          if (fbh.startsWith("hot")) {
            let tid = fbh.split("/")[1];
            let is_existtid =
              this.get_hot_list_item &&
              this.get_hot_list_item.subList &&
              this.get_hot_list_item.subList.find((item) => {
                return item.field2 == tid;
              });
            if (tid && is_existtid) {
              this.set_home_tab_item({
                component: "hot",
                index: 1,
                name: "热门",
              });
              this.set_hot_tab_item({ field2: tid });
              this.$router.push({ name: "home" });
            }
          }
        }
      },
      /**
       * @Description 设置视频预加载地址
       * @param {undefined} undefined
       */
      set_video_src(obj) {
        this.video_src = obj.video_src;
        this.animation_src = obj.animation_src;
        // 延迟10s销毁预加载iframe
        this.load_video_js_timer = setTimeout(() => {
          this.video_src = "";
          this.animation_src = "";
        }, 10000);
      },
      // 跳转第三方提供商链接
      goto_vender_url() {
        let url = this.user.getCallbackTokenUrl;
        if (url) {
          this.$nextTick(() => {
            location.href = url;
          });
        } else {
          console.warn("跳转地址不存在！");
        }
      },
      // 跳转第三方提供商链接
      isgo_vender_url(value) {
        this.is_token_invalid_show = false;
        window.is_token_invalid_show = false;
        this.set_user_token("");
        if (value) this.goto_vender_url();
      },
      // 获取地址栏token
      get_url_param(url) {
        // url = 'https://user-h5-baowang-one.sportxxxwo8.com/?token=c5cca01d5bb48528368102b15c289801221381e4&tag=01';
        let ret_obj = {};
        let i = -1;
        let str = "";
        i = url.indexOf("?");
        if (i != -1) {
          str = url.substr(i + 1);
          str.split("&").forEach(function (param) {
            let arr = param.split("=");
            if (arr && arr.length > 1) {
              ret_obj[arr[0]] = arr[1];
            }
          });
        }
        return ret_obj;
      },
      /**
       * @description 投注记录显示开关
       * @param {Boolean} val
       * @return {Undefined} undefined
       */
      change_settle_status(val) {
        this.set_virtual_video_show(!val);
        if (val) {
          this.record_show = true;
          this.$nextTick(() => {
            this.set_settle_dialog_bool(true);
          });
        } else {
          this.set_settle_dialog_bool(false);
          this.timer_3 = setTimeout(() => {
            this.record_show = false;
          }, 300);
        }
      },
      // 监听搜索框状态
      change_select_dialog(val) {
        this.select_dialog = val;
      },
      /**
       * @Description 设置虚拟体育视频显示隐藏
       * @param {boolean} val true：显示   false：隐藏
       * @param {undefined} undefined
       */
      set_virtual_video_show(val) {
        let video_dm = document.querySelector(".virtual-sports video");
        if (!video_dm) return;
        if (val) {
          video_dm.style.visibility = "visible";
        } else {
          video_dm.style.visibility = "hidden";
        }
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
       * @Description 定时器检查用户是否长时间未操作
       * @param {number} setting_no_handle_time 后台设定的长时间未操作时间
       * @param {undefined} undefined
       */
      check_user_no_handle(setting_no_handle_time) {
        // 距离上次操作时间
        let since_last_time = new Date().getTime() - this.user_handle_last_time;
        if (since_last_time >= setting_no_handle_time) {
          since_last_time = 0;
        }
        let timing = setting_no_handle_time - since_last_time + 100;
        this.check_user_no_handle_timer = setTimeout(() => {
          since_last_time = new Date().getTime() - this.user_handle_last_time;
          // 如果距离上次操作时间 大于后台设定的长时间未操作时间 则设置用户长时间未操作
          if (since_last_time > setting_no_handle_time) {
            this.set_is_user_no_handle(true);
          }
          this.check_user_no_handle(setting_no_handle_time);
        }, timing);
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
          "load_video_js_timer",
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
       * 获取首页热门赛事数据
       */
      async get_hotlist() {
        try {
          let parameter = {
            menuType: 12, // 菜单类型  12热门赛事
            disabled: 1, // 是否移除三级菜单  默认：(null)空=展开 ,1=移除
            lang: "JC", // 名称简称传：JC  ，默认为空
          };
          let { code, data } = await api_home.get_hot_list(parameter);
          if (code == 200 && data.length > 0) {
            // 设置缓存数据
            sessionStorage.setItem(
              "hot_list_data",
              JSON.stringify({ code, data })
            );
            // 过滤掉赛事场数为0的二级联赛菜单
            data[0].subList = data[0].subList.filter((item) => item.count !== 0);
            this.set_hot_list_item(data[0]);
          }
        } catch (error) {
          console.error(error);
        }
      },
      // 添加相应监听事件
      on_listeners() {
        // 设置网络状态
        window.addEventListener("offline", this.offlineEvent);
        window.addEventListener("online", this.onlineEvent);
        // 监听页面刷新
        window.addEventListener("beforeunload", (e) =>
          this.before_unload_page(e)
        );
        this.$root.$on(this.emit_cmd.EMIT_IS_FIRST_LOADED, () => {
          //冠军玩法没有串关
          this.set_betbar_show({ menu: this.get_is_champion(this) ? 0 : 1 });
        });
        this.$root.$on(this.emit_cmd.EMIT_GO_TO_VENDER, () => {
          this.$nextTick(() => {
            window.is_token_invalid_show = true;
            this.is_token_invalid_show = true;
          });
        });
        this.$root.$on(this.emit_cmd.EMIT_DOMAIN_ERROR_ALERT, () => {
          this.$nextTick(() => {
            this.is_domain_invalid_show = true;
          });
        });
        //监听投注记录弹框是否展示
        this.$root.$on(
          this.emit_cmd.EMIT_CHANGE_RECORD_SHOW,
          this.change_settle_status
        );
        this.$root.$on(this.emit_cmd.EMIT_SET_PRE_VIDEO_SRC, this.set_video_src);
        // 监听搜索弹框是否展示
        this.$root.$on(
          this.emit_cmd.EMIT_CHANGE_SELECT_DIALOG,
          this.change_select_dialog
        );
        // 阻止双击放大
        document.addEventListener("touchstart", this.touchstart_event_fun);
        // 阻止双指放大
        document.addEventListener("gesturestart", this.gesturestart_event_fun);
      },
      // 移除相应监听事件
      off_listeners() {
        window.removeEventListener("beforeunload", this.before_unload_page);
        this.$root.$off(this.emit_cmd.EMIT_IS_FIRST_LOADED);
        this.$root.$off(this.emit_cmd.EMIT_GO_TO_VENDER);
        this.$root.$off(this.emit_cmd.EMIT_GET_USER_ACCOUNT1);
        this.$root.$off(this.emit_cmd.EMIT_SET_PRE_VIDEO_SRC, this.set_video_src);
        this.$root.$off(
          this.emit_cmd.EMIT_CHANGE_SELECT_DIALOG,
          this.change_select_dialog
        );
        this.$root.$off(
          this.emit_cmd.EMIT_CHANGE_RECORD_SHOW,
          this.change_settle_status
        );
        document.removeEventListener("touchstart", this.touchstart_event_fun);
        document.removeEventListener("gesturestart", this.gesturestart_event_fun);
      },
    },
  });
  </script>
  