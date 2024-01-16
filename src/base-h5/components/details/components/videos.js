import { api_common, api_analysis } from 'src/project/api/index.js';
import video from "src/base-h5/utils/video/video.js"   // 视频相关公共方法`
import uid from "src/core/uuid/index.js"
import lodash from "lodash";
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt"
import { format_total_score } from "src/core/format/common/index.js"
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";
import { nextTick } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output";
export const video_info = () => {
  const router = useRouter();
  const route = useRoute();
  const component_data = reactive({
    tips_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_b.svg`,
    tips_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_a.svg`,
    voice_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_i.svg`,
    voice_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_h.svg`,
    // nail_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_f.svg`,
    // nail_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_e.svg`,
    donghua: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/v-donghua.svg`,
    // 直播 切换的图标
    shipin: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/v-shipin.svg`,
    // 演播厅 切换的图标
    studio_icon: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/studio_icon.svg`,
    // 赛前直播的
    lvs_icon_pre: `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-before.svg`,
    // ding1: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/ding1.svg`,
    // ding2: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/ding2.svg`,
    bet: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/bet.svg`,
    analyze: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse.svg`,
    analyze2: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse2.svg`,
    analyze_yo: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse2_y0.svg`,
    analyze2_y0: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse_y0.svg`,
    select_item: -1,
    voice: true,
    nail: true,
    show_icons: false, //控制图标默认展示
    iframe_src: '',
    title: {
      mhn: '',//主队名称
      man: '',//客队名称
      msc: '0 v 0',//比分
    },
    video_iframe_status: '',
    rotate: false,
    video_line_list: [],
    video_line_index: 0,
    // iframe_onload:false,
    // 用户第一次登陆，第一次显示视频时，提示 指引页
    first_login: false,
    mapFrame: null,
    // 视频加载错误标识（抱歉，暂时无法加载资源）
    load_error: false,
    //是不是需要6秒后消失
    is_need_timer: true,
    // 是否显示长时间未操作页面
    is_show_no_handle: false,
    // 事件列表
    events_list: [],
    // 是否展示slider列表(全屏)
    is_expand_video_list: false,
    // 事件类型菜单选项
    tab_list: [
      { title: i18n_t('footer_menu.all') },
      { title: i18n_t('match_result.goal') },
      { title: i18n_t('match_result.corner_kick') },
      { title: i18n_t('football_playing_way.penalty_cards') },
    ],
    // 当前播放视频信息
    current_event_video: {
      totalTime: 0,
      voice: true,
      status: 0,
    },
    // 用户是否控制开启声音
    is_user_voice: true,
    // 是否显示控件
    is_controller_show: true,
    // 当前是否为精彩回放视频
    is_playing_replay: false,
    // 当前选中事件类型
    tabIndex: 0,
    // 精彩回放视频url
    replay_url: '',
    // 精彩回放视频是否加载失败
    is_replay_load_error: false,
  });
  // 收藏菜单为6
  const get_menu_type = computed(() => {
    return ""
  });
  const get_change_count = computed(() => {
    return ""
  });
  const get_is_user_no_handle = computed(() => {
    return ""
  });
  // 视频url信息
  const get_video_url = computed(() => {
    return ""
  });
  // 视频显示状态
  const get_show_video = computed(() => {
    return ""
  });
  // 详情页的数据
  const get_detail_data = computed(() => {
    return ""
  });
  // 用户令牌信息
  // const get_user_token = computed(() => {
  //   return ""
  // });
  // 视频单页是否已加载     作用：防止白屏
  const get_iframe_onload = computed(() => {
    return ""
  });
  // 置顶按钮是否高亮
  const get_zhiding = computed(() => {
    return ""
  });
  // 点击视频或者是动画的时候玩法集是否固定
  const get_tab_fix = computed(() => {
    return ""
  });
  // 用户信息,用户金额,userId 需要监听变化
  // const get_user = computed(() => {
  //   return ""
  // });
  // 是否全屏
  const get_is_full_screen = computed(() => {
    return ""
  });
  // 是否横屏
  const get_is_hengping = computed(() => {
    return ""
  });
  // 是否显示横屏全屏下投注弹窗
  const get_bet_show = computed(() => {
    return ""
  });
  // 获取分析赛事状态（显示和不显示）
  const get_analyze_show = computed(() => {
    return ""
  });
  // 获取当前主题颜色
  const get_theme = computed(() => {
    return ""
  });
  // 标清0 高清1
  const get_hd_sd = computed(() => {
    return ""
  });
  const get_lang = computed(() => {
    return ""
  });
  const get_is_dp_video_full_screen = computed(() => {
    return ""
  });
  // 鉴权域名 + 回放视频url（拼接后的最终url）
  const replay_video_src = computed(() => {
    const host_url = window.BUILDIN_CONFIG.live_domains[0] || _.get(this.UserCtr, 'user_info.oss.live_h5')
    return `${host_url}/videoReplay.html?src=${this.replay_url}&lang=${this.get_lang}&volume=${this.is_user_voice ? 1 : 0}`

    // const host_url = 'http://localhost:4000/videoReplay.html?'
    // return `${host_url}src=${this.replay_url}&volume=${this.is_user_voice ? 1 : 0}`
  });
  // 展示lvs 图标
  const show_lvs = computed(() => {
    return this.get_detail_data.lvs != -1 && this.get_video_url.active != 'lvs' && ['string', 'number'].includes(typeof _.get(this.get_detail_data, 'lss')) && ['zh', 'tw', 'hk'].includes(this.get_lang)
  });
  // 判断此商户是否属于乐天
  const is_letian = computed(() => {
    // letian = 乐天  oubao = 欧宝
    if (this.UserCtr.user_info.merchantCode) {
      return this.UserCtr.user_info.merchantCode == 'letian'
    }
  });
  const iframe_show = computed(() => {
    if (this.get_video_url.active == 'animationUrl' || this.get_iframe_onload) {
      return true
    }
    return false
  });
  // 动画下显示tips icon
  const show_animation = computed(() => {
    return this.get_detail_data.mvs > -1 && this.get_video_url.active == 'animationUrl'
  });
  // 媒体类型
  const media_type = computed(() => {
    const { lss } = this.get_detail_data
    const { active } = this.get_video_url

    // 专题视频，mp4等带有可控制进度条
    if (lss === 0 && active === 'lvs') {
      return 'progress_bar_video'
    } else {
      // 其他类别，可扩展
      return 'others'
    }
  });
  // 赛事id
  const match_id = computed(() => {
    return this.$route.params.mid || this.get_detail_data.mid
  });
  // 赛事id
  const score = computed(() => {
    return {
      home: "",
      away: ""
      // home: format_total_score(this.detail_data, 0),
      // away: format_total_score(this.detail_data, 1)
    }
  });
  const eports_scoring = computed(() => {
    //比分判断处理
    let scoring = false
    //如果是电竞，则进行比分判定处理
    if (this.get_menu_type == 3000) {
      const mmp_state = this.detail_data.mmp || 1
      if (mmp_state != (Number(this.score.home) + Number(this.score.away) + 1)) {
        scoring = true
      }
    }
    return scoring
  });
  // 事件列表（非全屏）
  const events_list_vertical = computed(() => {
    const curr_tab_index = this.tabIndex
    let events_list
    if (curr_tab_index === 0) {
      events_list = _.cloneDeep(this.events_list)
    } else if (curr_tab_index === 1) {
      events_list = this.events_list.filter(item => item.eventCode === 'goal')
    } else if (curr_tab_index === 2) {
      events_list = this.events_list.filter(item => item.eventCode === 'corner')
    } else {
      events_list = this.events_list.filter(item => !['goal', 'corner'].includes(item.eventCode))
    }
    return events_list.reverse()
  });
  // 事件列表（全屏）
  const slider_events_list = computed(() => {
    return _.cloneDeep(this.events_list_vertical).reverse()
  });
  // 精彩回放视频开关是否开启
  const is_replay_switch = computed(() => {
    const { configValue, eventSwitch } = _.get(this.UserCtr, 'user_info.merchantEventSwitchVO', {})
    return configValue == 1 && eventSwitch == 1
  });
  // slider列表长度是否小于屏幕横屏宽度
  const is_slider_in_screen = computed(() => {
    const full_screen_width = this.get_is_hengping ? innerWidth : innerHeight
    const font_size = (this.get_is_hengping ? innerHeight : innerWidth) * 100 / 375

    return this.slider_events_list.length * Math.ceil(1.44 * font_size) < full_screen_width
  });
  /**
   * 电竞赛事url加参数前缀检测函数
  */
  const dj_http_fix = (url) => {
    let res = '&';
    let str = url;
    str = str.replace('?http', '');
    console.log(str);
    if (str.indexOf('?') == -1) {
      res = '?';
    } else {
      res = '&';
    }
    return res;
  };
  /**
   * 点击遮罩层，做取反操作，显示或隐藏遮罩层
  */
  const click_mask = () => {
    console.log('点击遮罩层，做取反操作');
    this.show_icons = !this.show_icons
    this.$emit('change_go_back', this.show_icons)
    if (this.show_icons) {
      this.sendMessage2({ cmd: 'show_icon' })
    } else {
      this.sendMessage2({ cmd: 'hide_icon' })
    }
    this.fade_icons();
    this.set_bet_show(false);
    this.set_analyze_show(false);
    this.select_item = -1;
  };

  /**
   *@description 监听页面可见性，当页面不可见时关闭视频声音
   */
  const visibilitychange_handle = () => {
    if (this.$route.name != 'category') return;
    if (document.visibilityState == 'hidden') {
      this.iframe_src = ''
    }
    if (document.visibilityState == 'visible') {
      this.reload_create_fun()
    }
  };
  /**
   * @description 切换精彩回放视频
   * @param item 目标视频信息
   * @param index 目标视频索引
   */
  const change_event_video = (item, index) => {
    this.is_replay_load_error = false
    this.iframe_rdm = Date.now()
    this.is_user_voice = this.current_event_video.voice
    this.replay_url = item.fragmentVideo
    // this.replay_url = 'http://localhost:3000/replay.mp4'

    this.check_replay_url(this.replay_video_src)
    // 滚动目标到屏幕显示区域
    nextTick(() => {
      this.$tab_move(index, this.$refs.slider_video.$refs.slider_x, this.$refs.slider_video.$refs.item_wrapper, true)
    })


    this.is_playing_replay = true
    // 静音当前播放媒体
    this.video_volume({ volume: 0 })
  };
  // iframe加载成功后，通知子iframe
  const handle_replay_video_loaded = (e) => {
    if (this.get_is_hengping) {
      const data = {
        cmd: 'full_screen_landscape',
        full_screen_landscape: 1
      }

      document.getElementById('replayIframe').contentWindow.postMessage(data, '*')

    }
  };
  // 检测精彩回放视频资源加载状态
  const check_replay_url = (url) => {
    api_common.get_full_url(url)
      .then((v) => {
        console.log('精彩回放视频加载成功...')
        this.is_replay_load_error = false
      })
      .catch(err => {
        console.error('精彩回放视频加载失败...')
        this.is_replay_load_error = true
      })
  };
  // 横屏下精彩回放的事件tab切换
  const get_video_list = ({ tab, index }) => {
    if (this.tabIndex === index) return
    console.log(tab, '---tab')
    this.tabIndex = index
    this.update_variable_event_n()
  };
  // 控制info弹窗说明
  const change_info = () => {
    this.set_info_show(true)
    this.set_analyze_show(false);
    this.select_item = 1;
    this.is_need_timer = true;
  };
  // 弹出高清和标清的页面
  const show_HD_SD = () => {
    this.set_info_show(true)
    this.set_hd_sd_show(true)
  };
  const change_bet = () => {
    this.set_analyze_show(false);
    this.set_bet_show(true)
    this.select_item = 2;
    this.is_need_timer = true;
  };
  const change_analyze = () => {
    if (![1, 2].includes(this.get_detail_data.csid * 1)) return;
    this.clear_timer();
    if (this.select_item == 3) {
      this.set_analyze_show(false);
      this.select_item = -1;
    } else {
      this.select_item = 3;
      this.set_analyze_show(true);
    }
    this.set_info_show(false)
    this.show_icons = true;
    this.is_need_timer = false;
  };
  const get_msc = () => {
    !_.isEmpty(this.get_detail_data) && this.get_detail_data.msc.map(item => {
      if (item.indexOf('S1|') > -1) {
        this.title.msc = item.split('|')[1].split(':').join(' v ')
      }
    })
  };
  /**
   * @Description 设置全屏
   * @param {undefined} undefined
   */
  const set_full_screen = () => {
    if (this.get_is_full_screen) {
      this.set_is_hengping(false)
      this.exit_browser_full_screen()
      if(lodash.get(window,'screen.orientation.unlock')){
        window.screen.orientation.unlock()
      }
      if (this.get_video_url.active === 'lvs') {
        this.sendMessage2({
          cmd: 'record_play_info',
          val: {
            record_play_time: true
          }
        })
      }

      clearTimeout(this.reload_iframe_timer)
      this.reload_iframe_timer = setTimeout(() => {
        // 部分iPhone safari退出全屏后，视频高度不正确，重载iframe更新
        this.set_iframe_onload(false)
        nextTick(() => {
          this.set_iframe_onload(true)
        })
      }, 300)
    } else {
      this.get_replay_video()
      this.set_is_hengping(true)
      this.browser_full_screen()
      if(lodash.get(window,'screen.orientation.lock')){
        window.screen.orientation.lock('landscape')
      }
    }
    this.set_is_full_screen(!this.get_is_full_screen)
  };
  // （精彩/收起）回放按钮点击处理
  const toggle_slider_btn = () => {
    this.update_variable_event_n()
    this.is_expand_video_list = !this.is_expand_video_list
  };
  // 更新event_n变量值
  const update_variable_event_n = () => {
    if (this.is_slider_in_screen) {
      // 若橫屏下，slider列表长度小于屏幕横屏宽度，则设置动态属性--event_n，用于slider列表居中计算
      document.documentElement.style.setProperty('--event_n', this.slider_events_list.length)
    }
  };
  /**
   * @Description 设置视频声音
   * @param {undefined} undefined
   */
  const set_video_voice = () => {
    this.current_event_video.voice = !this.current_event_video.voice
    const data = {
      cmd: 'replay_volume_video',
      volume: this.current_event_video.voice ? 1 : 0
    }
    document.getElementById('replayIframe').contentWindow.postMessage(data, '*')
  };
  const exit_full_screen = () => {
    this.is_playing_replay = false
    this.is_expand_video_list = false
    this.is_replay_load_error = false
  };
  /**
   * @Description 浏览器全屏
   * @param {undefined} undefined
   */
  const browser_full_screen = () => {
    let video_dm = document.documentElement;
    let rfs = video_dm.requestFullscreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
    if (rfs) {
      rfs.call(video_dm);
    }
  };
  /**
   * @Description 退出浏览器全屏
   * @param {undefined} undefined
   */
  const exit_browser_full_screen = () => {
    let video_dm = document;
    let cfs = video_dm.cancelFullscreen || video_dm.webkitCancelFullScreen || video_dm.mozCancelFullScreen || video_dm.exitFullscreen;
    if (cfs) {
      cfs.call(video_dm);
    }
  };
  // 接收精彩回放iframe消息
  const handle_replay_message = (e) => {
    const data = e.data;

    switch (data.cmd) {
      case 'icon':
        this.is_controller_show = data.val
        break;
    }
  };
  // 接受iframe消息
  const handleMessage = (e) => {
    let status_text = ['loading', 'success', 'error']

    var data = e.data;
    switch (data.cmd) {
      case 'icon':
        //处理业务逻辑
        this.show_icons = !this.show_icons;
        if (!this.show_icons) {
          this.sendMessage2({ cmd: 'hide_icon' })
        } else {
          this.sendMessage2({ cmd: 'show_icon' })
        }
        this.fade_icons();

        if (this.get_bet_show) {
          this.set_bet_show(false)
        }
        if (this.get_analyze_show) {
          this.set_analyze_show(false)
        }
        break;
      case 'double_click':
        // 如果是 视频的情况下，双击全屏事件
        if (this.get_video_url.active == 'muUrl') {
          this.set_full_screen()
        }
        break;
      case 'video_quality':
        // 处理业务逻辑
        this.video_line_list = data.val
        break;
      case 'video_line_index':
        // 处理业务逻辑
        this.voice = true
        this.video_line_index = data.val
        break;
      case 'onload':
        // 处理业务逻辑,代表 显示video 单页 视频了
        this.set_iframe_onload(true);
        break;
      case 'error_message':
        console.log(data);
        break;
    }

    // 视频加载错误，则隐藏相应交互按钮
    if (data.cmd === 'error_message' || (data.testmsg && data.data.includes('404'))) {
      this.load_error = true
    } else if (data.testmsg && data.data === '可以播放') {
      this.load_error = false
    }

    if (data.video_iframe_msg && status_text.includes(data.msg)) {
      this.video_iframe_status = data.msg
    }
  };
  // 父向子传参方式二
  const sendMessage = (data) => {
    if (this.mapFrame.attachEvent) {  //兼容浏览器判断
      this.mapFrame.attachEvent("onload", function () {
        this.sendMessage2(data)
      })
    } else {
      this.mapFrame.onload = function () {
        this.sendMessage2(data)
      }
    }
  };
  // 向子iframe发送message
  const sendMessage2 = (data) => {
    if (document.getElementById('bdIframe')) {
      // let iframeWin = this.mapFrame.contentWindow;
      // iframeWin && iframeWin.postMessage(data, '*');
      document.getElementById('bdIframe').contentWindow.postMessage(data, '*')
    }
  };
  /**
  * @Description:设置视频音量
  * @return {undefined} undefined
  */
  const video_volume = (obj) => {
    this.sendMessage2({ cmd: 'volume_video', volume: _.get(obj, 'volume', 0) });
  };
  const toggle_click = (num, val) => {
    // 开启/关闭声音
    if (num == 2) {
      this.voice = !this.voice;
      this.sendMessage2({ cmd: 'voice', val: this.voice })
    }
    if (num == 4) {
      if (this.get_video_url.active === 'lvs') {
        this.sendMessage2({
          cmd: 'record_play_info',
          val: {
            record_play_time: true
          }
        })
      }

      clearTimeout(this.media_type_change_timer)
      this.media_type_change_timer = setTimeout(() => {
        this.set_change_count(this.get_change_count + 1);
        this.icon_click(val);
      }, 50)
    }
  };
  // 全屏点击
  const bg_click = (e) => {
    // 点击隐藏投注弹框
    if (this.get_is_hengping && this.get_bet_show) {
      this.set_bet_show(false)
    }
    if (this.get_is_hengping && this.get_analyze_show) {
      this.set_analyze_show(false)
      this.select_item = -1;
      this.is_need_timer = true;
    }
  };
  // 全屏手势滑动
  const bg_touchmove = ({ direction, isFinal }) => {
    this.sendMessage2({ cmd: 'show_icon' })
    if (!isFinal && [1, 2].includes(this.get_detail_data.csid * 1) && this.get_is_full_screen && this.get_video_url.active == 'muUrl' && this.get_is_hengping) {
      if ('left' == direction) {
        !this.get_bet_show && this.set_analyze_show(true)
        this.show_icons = true;
        this.select_item = 3;
        this.is_need_timer = false;
      } else if ('right' == direction) {
        this.set_analyze_show(false)
        this.show_icons = false;
        this.select_item = -1;
        this.is_need_timer = true;
      }
    }
  };
  const switch_video = (index) => {
    if (index == this.video_line_index) {
      return
    }
    this.sendMessage2({ cmd: 'switch', val: index })
  };
  const close_video = () => {
    this.set_is_full_screen(false)
    this.exit_browser_full_screen();

    // iPhone Safari 不兼容screen.orientation
    if(lodash.get(window,'screen.orientation.unlock')){
      window.screen.orientation.unlock()
   }
    this.set_tab_fix(false);
    this.set_is_close_video(Math.random());
    this.set_show_video(false);
    this.set_zhiding_info(false);
    this.set_is_in_play('');
  };
  const fade_icons = () => {
    if (this.is_letian) return;  //乐天商户不需要6秒消失
    this.clear_timer()
    if (this.is_need_timer) {
      this.timer1_ = setTimeout(() => {
        this.show_icons = false;
        this.sendMessage2({ cmd: 'hide_icon' })
      }, 6000)
    }
  };
  const clear_timer = () => {
    clearTimeout(this.timer1_);
  };
  // 如果是电竞，点击显示返回按钮
  const show_DJ_back = () => {
    if (this.get_menu_type == 3000) {
      this.show_icons = true;
      this.fade_icons();
    }
  };
  const reload_video_methods = () => {
    this.rotate = !this.rotate;
    this.timer2_ = setTimeout(() => {
      this.rotate = false;
      this.icon_click();
    }, 1000)
  };
  const icon_click = (arg) => {
    let which = arg || this.get_video_url.active;
    switch (which) {
      case 'lvs':
        this.icon_click_lvs()
        break;
      case 'muUrl':
        this.icon_click_muUrl()
        break;
      case 'animationUrl':
        this.icon_click_animationUrl()
        break;
      default:
        break;
    }
  };
  /**
   * 点击直播
   * @param {number} hd_sd  0标清, 1 高清
   */
  const icon_click_lvs = (hd_sd) => {
    let params = {
      mid: this.match_id,
      device: 'H5'
    };
    api_common.getliveVideoUrl(params).then((res) => {
      let { code, data } = res
      if (code == 200) {
        // "chatRoomId": "1001",//聊天室ID
        // "crs": 1,  //聊天室开关 0 ：关闭  1：开启
        // hdUrl : "rtmp://test-pull-live.wafqa2.com/live/123456"  //直播视频高清播放地址
        // liveState : 1
        // programPath : ""  //赛前节目播放地址
        // referUrl : "http://testliveh5.sportxxx13ky.com"//域名
        // sdUrl : "rtmp://test-pull-live.wafqa2.com/live/654321"  //直播视频标清地址
        // serverTime : "1663733773446"
        // 如果是数字，代表点击切换了
        if (typeof hd_sd == 'number') {
          // 设置高清或者标清
          this.set_hd_sd(hd_sd)
        }
        let media_src = video.get_video_url(res, params.mid, 3, hd_sd = this.get_hd_sd);
        let data = {
          media_src,
          active: 'lvs',
        };
        this.set_video_url(data);
        this.timer4_ = setTimeout(() => {
          this.clear_timer(); // 清除相关计时器操作;
          this.reload_create_fun();
        }, 500)
        this.set_show_video(true);
      }
    })
  };
  const icon_click_muUrl = () => {
    //   let check =  this.get_detail_data.mms >=2 || this.get_detail_data.mvs > -1
    // if(!check){return false }
    let params = {
      mid: this.match_id,
      type: 'Video'
    };
    this.is_show_no_handle = false
    api_common.getMatchUserIsLogin().then(res => {
      if (res && res.code == 200 && res.data.isLogin) {
        let referUrl = window.BUILDIN_CONFIG.live_domains[0];
        let media_src
        if (referUrl) {
          media_src = video.get_video_url({ data: { referUrl } }, params.mid, 1);
          let data = {
            media_src,
            active: 'muUrl',
          };
          this.set_video_url(data);
          this.timer3_ = setTimeout(() => {
            this.clear_timer(); // 清除相关计时器操作;
            this.reload_create_fun();
          }, 500)
          this.set_show_video(true);
        } else {
          let param = {}
          this.send_gcuuid = uid();
          param.gcuuid = this.send_gcuuid;
          api_common.getVideoReferurl(param).then(res => {
            if (this.send_gcuuid != res.gcuuid) return;
            if (res.code == 200) {
              let media_src = video.get_video_url(res, params.mid, 1)
              let data = {
                media_src,
                active: 'muUrl',
              };
              this.set_video_url(data);
              this.timer4_ = setTimeout(() => {
                this.clear_timer(); // 清除相关计时器操作;
                this.reload_create_fun();
              }, 500)
              this.set_show_video(true);
            }
          });
        };
      } else {
        let data = {};
        data.active = 'muUrl';
        this.set_video_url(data);
        this.set_show_video(true);
        this.set_change_count(this.get_change_count - 1);
      }
    });
  };
  const icon_click_animationUrl = () => {
    // let check =   this.get_detail_data.mms >=2 || this.get_detail_data.mvs > -1
    // if(!check){return false }
    let params = {
      mid: this.match_id,
      type: 'Animation'
    };
    this.send_gcuuid = uid();
    params.gcuuid = this.send_gcuuid;
    this.is_show_no_handle = false
    api_common.videoAnimationUrl(params).then((res) => {
      const { data } = res
      if (this.send_gcuuid != res.gcuuid) return;
      if (!data.animationUrl) {
        this.set_toast({
          txt: i18n_t("match_info.m_anima_not_start"),
        });
        return
      }
      let animationUrl = ''
      //足篮棒网使用3.0动画  其他使用2.0
      if ([1, 2, 3, 5].includes(this.get_detail_data.csid * 1)) {
        let animation3Url = data.animation3Url || []
        animation3Url.forEach(item => {
          if (item.styleName.indexOf('day') >= 0) {
            animationUrl = item.path
          }
        })
      }
      animationUrl = animationUrl || data.animationUrl
      data.animationUrl = animationUrl.replace(/https?:/, "") // 动画
      data.referUrl = data.referUrl && (data.referUrl.replace(/http:|https:/, '')) // 视频
      data.active = 'animationUrl';
      data.referUrl = `${location.protocol}${data.referUrl}`;
      let CTime = this.get_detail_data.mgt;
      let STime = data.serverTime;
      this.set_video_url(data);
      this.timer6_ = setTimeout(() => {
        this.clear_timer(); // 清除相关计时器操作;
        this.reload_create_fun()
      }, 500)
    })
  };
  const icon_click_sdd = (arg) => {
    let which = arg || this.get_video_url.active;
    let params = {
      mid: this.match_id,
      type: val == 'muUrl' ? 'Video' : 'Animation'
    };
    this.is_show_no_handle = false
    if (val == 'muUrl') {

    } else {

    }
  };
  const reload_create_fun = () => {
    if (["muUrl", "lvs"].includes(this.get_video_url.active)) {
      if ([100, 101, 102, 103].includes(+this.get_detail_data.csid)) {
        this.iframe_src = this.get_video_url.media_src + this.dj_http_fix(this.get_video_url.media_src) + 'controls=1'
      } else {
        this.iframe_src = this.get_video_url.media_src + '&controls=1';
      }
    } else {
      if ((this.get_video_url.active == "muUrl" && this.get_video_url.referUrl == '') || (this.get_video_url.active == "animationUrl" && this.get_video_url.animationUrl == '')) {
        this.video_iframe_status = 'error';
      }
      this.iframe_src = this.get_video_url.animationUrl
    }
    this.fade_icons();
    window.addEventListener("message", handleMessage);
    this.title.mhn = this.get_detail_data.mhn;
    this.title.man = this.get_detail_data.man;
    this.get_msc()
  };
  const get_replay_video = () => {
    const { configValue, eventSwitch } = _.get(this.UserCtr, 'user_info.merchantEventSwitchVO', {})
    if (configValue == 1 && eventSwitch == 1 && _.get(this.get_detail_data, 'csid') == '1') {
      this.get_football_replay(0)
      this.$load_player_js()
      clearInterval(this.get_replay_video_timer)
      this.get_replay_video_timer = setInterval(() => {
        this.get_football_replay(0)
      }, 60 * 1000)
    }
  };
  /**
   * 获取精彩回放事件
   * @param {String} event_code 事件code
   */
  const get_football_replay = (event_code) => {
    const params = {
      mid: _.get(this.get_detail_data, 'mid'),
      device: 'H5',
      eventCode: event_code
    }
    api_analysis.post_playback_video_url(params)
      .then(res => {
        if (res.code == 200 && _.get(res.data, 'eventList.length')) {
          this.events_list = res.data.eventList
          this.set_event_list(res.data.eventList)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {

      })
  };
  // 精彩回放列表显示的事件文案
  const event_name = (type) => {
    let event_name
    switch (type) {
      case 'goal': event_name = i18n_t('highlights.type.goal'); break;  // 进球
      case 'corner': event_name = i18n_t('highlights.type.corner'); break;  // 角球
      case "red_card": event_name = i18n_t('highlights.type.card_red'); break;  // 红牌
      case "yellow_card": event_name = i18n_t('highlights.type.card_yellow'); break;  // 黄牌
      case "yellow_red_card": event_name = i18n_t('highlights.type.card_yellow_red'); break;  // 黄红牌
      default: event_name = ''; break;
    }
    return event_name;
  };
  // 点击精彩回放视频时，控件显示状态变更
  const click_video_screen = (e) => {
    this.is_controller_show = !this.$refs.video_wrapper.classList.contains('dplayer-hide-controller')
  };

  onUnmounted(() => {
    window.removeEventListener("message", handleMessage);
  })
  return {
    component_data,
  }
}