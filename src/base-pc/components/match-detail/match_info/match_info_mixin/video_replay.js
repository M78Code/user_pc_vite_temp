  import SliderX from "src/base-pc/components/match-detail/match_info/slider_x.vue"
  import { UserCtr ,MatchDetailCalss,MITT_TYPES,useMittOn} from "src/output/index";
  import { TabWapper as Tabs } from "src/components/common/tab"
  import { api_details, api_analysis } from "src/api/index";
import { useMittEmit } from "src/output";

import BUILDIN_CONFIG from "app/job/output/env/index.js";
 
  export default {
      components: {
          SliderX,
          Tabs
      },
      data() {
          // 精彩回放数据请求定时器
          this.replayDataTimer = null
          this.hide_replay_fullscreen_btn_timer = null
          return {
              off_mitt:null,
              media_src_temp:'',//播放地址零时url
              // 是否展示精彩回放列表
              is_expand_video_list: false,
              // 精彩事件列表
              events_list: [],
              // 当前精彩事件类型
              current_events_type: 0,
              // 当前重播
              current_replay: null,
              // 精彩回放tab筛选
              tab_list: [],
              // 是否显示精彩回播
              show_video_replay: false,
              // 视频播放地址是否有效存在
              is_exist_media: true,
              // 是否第一次请求历史接口数据
              is_first_time_get_history_list: true,
              // 回播赛事event_id
              replay_event_id: 0,
              // 回播是否有数据
              has_replay_data: false,
              //播放类型
              vx_play_media:MatchDetailCalss.play_media,
              vx_get_user:UserCtr.get_user(),
              //用户类版本号
              user_version:UserCtr.user_version, 
              //仓库版本号
              details_data_version:MatchDetailCalss.details_data_version,  
            }
      },
      // computed: {
      //   ...mapGetters({
      //     //视屏播放类型
      //     vx_play_media: "get_play_media",
      //     vx_get_user: "get_user",
      //   }),
      // },
      watch: {
        /**
         * 监听路由变化大视频和全屏切换
         */
        "$route.params.video_size"(n){
          // 大屏
          if (n == 1) {
            this.get_video_replay()
          } else {
            // 不是大屏的时候，重置回播数据
            this.reset_replay_data();
          }
        },
        // 赛事ID改变
        "match_info.mid"() {
          // 关闭精彩回顾展开
          this.is_expand_video_list = false
          // 关闭正在重播的
          this.current_replay = null
          // 清空回放列表
          this.events_list = []
          // 获取最新回放数据
          if (this.show_video_replay) {
            // 延迟加载防止赛事组件加载慢问题
            clearTimeout(this.get_video_replay_timer);
            this.get_video_replay_timer = setTimeout(() => {
              this.has_replay_data = false
              this.get_video_replay()
            }, 600);
          }
        },
        //监听详情类的版本号
        "details_data_version.version": {
          handler(res) {
            this.vx_play_media = MatchDetailCalss.play_media
          }
        },
          //监听user类的版本号
        "user_version.version": {
          handler(res) {
            this.vx_get_user = UserCtr.get_user()
       
            }
          },
        // 精彩回播配置信息
        'vx_get_user.merchantEventSwitchVO':{
          handler(res) {
            if(!res) return
            // 开启关闭
            if(res?.eventSwitch) {
              this.get_video_replay()
              this.replayDataTimer && clearInterval(this.replayDataTimer)
              this.replayDataTimer = setInterval(() => this.get_video_replay(), 60 * 1000)
              this.show_video_replay = true
            } else {
              this.replayDataTimer && clearInterval(this.replayDataTimer)
              this.show_video_replay = false
            }

            // tab按钮开关
            let _tab_list = [
              {title: i18n_t('replay_video.all'), code: 0},
              {title:i18n_t('replay_video.goal'), code: 1},
            ]
            if (res.cornerEvent) {
              _tab_list.push({title:i18n_t('replay_video.corner_kick'), code: 2})
            }
            if (res.penaltyEvent) {
              _tab_list.push({title:i18n_t('replay_video.punish'), code: 3})
            }
            // 当角球和罚牌都没有时不显示tab
            // if (!res.cornerEvent && !res.penaltyEvent) {
            //   _tab_list = []
            // }
            this.tab_list = _tab_list
          },
          immediate: true,
        },
        //视屏播放类型
        'vx_play_media.media_type': {
          handler(res) {
            this.is_expand_video_list = false
            this.current_replay = null
            if (res === 'video') {
              this.get_video_replay()
              this.replayDataTimer && clearInterval(this.replayDataTimer)
              this.replayDataTimer = setInterval(() => this.get_video_replay(), 60 * 1000)
            } else {
              this.replayDataTimer && clearInterval(this.replayDataTimer)
            }
          }
        }
      },
      created() {
        this.get_video_replay();
       let {off} =  useMittOn(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD_END, this.video_event); 
      //  this.$once('hook:beforeDestroy', () => {
      //   alert
      //  });
       this.off_mitt = off
      },
      mounted(){
      },
 
      beforeDestroy() {
       this.off_mitt()
        this.replayDataTimer && clearInterval(this.replayDataTimer)
        this.hide_replay_fullscreen_btn_timer && clearTimeout(this.hide_replay_fullscreen_btn_timer)
        clearTimeout(this.get_video_replay_timer);
      },
      methods: {
      /**
       * @description 切换精彩回放视频
       * @param item 目标视频信息
       */
      change_event_video(item) {
          let live_type =this.$route.params.play_type

          // mp4 拼接格式
          // http://lsprelivepc.sportxxx13ky.com/videoReplay.html?src=http://test-playback.d965r6f.com/video/8045e066c41cdb269e126a892c648ffe.mp4
          let live_domains = lodash.get(BUILDIN_CONFIG.DOMAIN_RESULT,"live_domains[0]") || lodash.get(this.vx_get_user,'oss.live_pc');
          // 显示返回按钮
          const back_but = this.$route.params.video_size !=1 ? 1 : 0
          // 隐藏全屏按钮
          const hide_full_screen = this.$route.params.video_size ==1 ? 1 : 0;
          const lang = window.reset_lang || UserCtr.lang || "zh";
          this.media_src = `${live_domains}/videoReplay.html?lang=${lang}&c_f_s=1&title=${`${item.homeAway} ${this.event_name(item.eventCode)}: ${item.firstNum}`}&back_but=${back_but}&hide_full_screen=${hide_full_screen}&src=${item.fragmentVideo}`
          let lang_obj={full_screen:i18n_t('video.full_screen_mode'), back:i18n_t('common.back'), back_live:i18n_t('video.back_live')}
          if(this.$route.name == "home"){
            lang_obj.full_screen = '';
            lang_obj.back = '';
            this.media_src=`${this.media_src}&head=2`;
          } else {
            this.media_src=`${this.media_src}&head=1`;
          }
          this.media_src=`${this.media_src}&txt=${JSON.stringify(lang_obj)}`;
          this.show_type = 'play-video'
          this.current_replay = {
            ...item,
            titleInfo: `${item.homeAway} ${this.event_name(item.eventCode)}: ${item.firstNum}`
          }
          // 检查地址是否有效存在
          // this.is_exist_media = url_exists(this.media_src)
          // if (!this.is_exist_media) {
          //   return false
          // }
          // 直播大屏页回播隐藏全屏
          // if (this.$route.params.video_size == 1) {
          //   this.hide_replay_fullscreen_btn_timer && clearTimeout(this.hide_replay_fullscreen_btn_timer)
          //   this.hide_replay_fullscreen_btn_timer = setTimeout(() => {
          //     video.send_message({
          //       cmd: 'replay_video_jq_cmd',
          //       val: "$('.dplayer-full .dplayer-icon-content').css({'display':'none'});"
          //     })
          //   }, 800)
          // }
        },
        iframe_status(res){
          if(!res.ok){
            
          }
        },
        // 切换精彩回顾列表类型
        change_video_history_list({tab, index}) {
          this.current_events_type = tab.code
          this.get_video_replay(tab.code)
        },
        /**
         * 获取精彩回放事件
         */
        get_video_replay() {
          if (!this.match_info?.mid) {
            return false
          }
          const params = {
            mid: this.match_info.mid,
            device: 'PC',
            eventCode: this.current_events_type
          }
          api_analysis.post_playback_video_url(params)
              .then(( data ) => {
                if (data.code == 200 && data.data.eventList) {
                  this.events_list = data.data.eventList
                  // 全部tab下是否有数据
                  if (this.current_events_type === 0 && this.events_list.length) {
                    this.has_replay_data = true
                  }
                  console.log('===replay', this.is_first_time_get_history_list, this.$route.params)
                  if (this.is_first_time_get_history_list && this.$route.params.video_size == 1) {
                    this.is_first_time_get_history_list = false
                    // 获取重播赛事id
                    if (this.$route.params && this.$route.params.replay_id) {
                      const replay_id = this.$route.params.replay_id
                      this.replay_event_id = replay_id;
                      const replay_video_info = this.events_list.find(v => v.eventId == replay_id)
                      console.log('===replay info',  replay_video_info)
                      if (replay_video_info) {
                        this.change_event_video(replay_video_info)
                      }
                    }
                  }
                }
              })
              .catch(err => {
                console.error(err)
              })
              .finally(() => {
                // const demo_data = {
                //   "eventList": [
                //     {
                //       "eventCode": "corner",   //事件类型
                //       "eventId": "43430459",   //事件ＩＤ
                //       "eventTime": "1682421379000",//事件时间
                //       "extraInfo": "",
                //       "firstNum": 1,  //第几次（角球、进球、罚牌）
                //       "fragmentCode": "7193bceee84347012bdead96f180ad9d",
                //       "fragmentId": "42111",//赛事集锦id
                //       "fragmentPic": "http://test-playback.d965r6f.com/pic/ccca5f82bca03431f2f8d0bcd3d25f2c.jpg", //回播背景图片
                //       "fragmentVideo": "http://test-playback.d965r6f.com/video/7193bceee84347012bdead96f180ad9d.mp4", //回播地址
                //       "homeAway": "Ulsan Hyundai",  //主客队名称
                //       "mid": "3465851", //赛事ＩＤ
                //       "secondsFromStart": 2700,// 比赛进行时长
                //       "t1": 0, //主队比分
                //       "t2": 1 //客队比分
                //     }
                //   ],
                //   "playBackUrl": "http://test-playback.d965r6f.com",
                //   "referUrl": "http://testliveh5.sportxxx13ky.com",//域名验签
                //   "serverTime": "1682485323358"
                // }
                // const _temp = new Array(15).fill(...demo_data.eventList)
                // this.events_list = _temp.map((v, index) => {
                //   return {
                //     ...v,
                //     fragmentId: index,
                //     firstNum: index,
                //     t1: index
                //   }
                // })
                // console.log('this.events_list', this.events_list)
          })
        },
        event_name(type) {
          let event_name
          switch (type) {
            case 'goal': event_name = i18n_t('replay_video.goal'); break;  // 进球
            case 'corner': event_name = i18n_t('replay_video.corner_kick'); break;  // 角球
            case "red_card": event_name = i18n_t('icon_tips.red_card'); break;  // 红牌
            case "yellow_card": event_name = i18n_t('icon_tips.yellow_card'); break;  // 黄牌
            case "yellow_red_card": event_name = i18n_t('icon_tips.red_card'); break;  // 黄红牌
            default: event_name = ''; break;
          }
          return event_name;
        },
        // 重置回播数据状态
        reset_replay_data() {
          this.replay_event_id = 0
          this.current_replay = null
          this.is_first_time_get_history_list = true
        },
        // 重播
        changeVideo2Live() {
          if (this.replay_event_id) {
            useMittEmit(MITT_TYPES.EMIT_EXIT_FULL_SCREEN_MSG_EVENT, 'xl');

            // 弹出新视频
            if(this.$route.name != 'home'){
              useMittEmit(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD, {
                cmd: 'play',
                url: this.current_replay.fragmentVideo,
                video_info: this.current_replay,
                match: this.match_info,
                no_init_window_xy:1,
              });
            }
            // 重置回播id
            this.reset_replay_data();
            // 重置视频url
            this.media_src = ''
          } else {
            this.media_src = this.media_src_temp
            this.current_replay = null
          }
        },
        // 精彩回放按钮点击
        toggleVideoReplay() {
          this.current_events_type = 0
          this.is_expand_video_list = !this.is_expand_video_list
          // 开启时，重新拉取最新的
          if (this.is_expand_video_list) {
            this.get_video_replay()
          }
        },
        // 视频关闭通知
        video_event(data) {
          // console.log('data', data)
          if (data && data.cmd == 'video_replay_back_but_event') {
            this.changeVideo2Live()
          }
        }
      }
    };