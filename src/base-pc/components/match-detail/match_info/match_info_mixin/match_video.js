/*
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧视频播放组件
 */

import info from "src/base-pc/components/match-detail/match_info/info.vue";
 import video  from "src/core/video/video.js"
import video_replay from "src/base-pc/components/match-detail/match_info/match_info_mixin/video_replay.js";
import LoadData from 'src/components/load_data/load_data.vue';
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { useMittEmit, MITT_TYPES,useMittEmitterGenerator,useMittOn } from  "src/core/mitt"
import {is_eports_csid,MatchDetailCalss,get_media_icon_index,GlobalSwitchClass,UserCtr, MatchDataWarehouse_PC_Detail_Common as MatchDetailsData } from "src/output/index"
import url_add_param  from "src/core/enter-params/util/index.js"
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import lodash from "lodash"
export default {
  components: {
    info,
    LoadData
  },
  props: {
    // match_info: Object, //赛事详情
    background_img: String,//比分板背景图片
    refresh_time: {
      type: Number,
      default: 0
    }, //刷新次数
    mid:String || Number,
    // 默认的展示类型
    show_type_default: {
      type: String,
      default: ''
    }
  },
  mixins: [video_replay],
  data() {
    this.moveTimerReplay = null // 移动定时器
    return {
      //批量关闭mitt
      offMitt:null,
      //当前路由信息
      vx_layout_cur_page:LayOutMain_pc.layout_current_path,
      //布局视口类的版本号
      layout_version:LayOutMain_pc.layout_version,
      // 获取当前菜单类型  
      vx_cur_menu_type:MenuData.menu_type,
      // 菜单数据
      menu_data: MenuData,
      video_height: "190px",//视频高度
      show_type: '',//显示类型   默认info
      media_src: "",//视频url地址
      callback_id:0,//回调ID 解决短时间内连续切换视频 回调错误
      show_loading:true, // 是否显示视频loading图片
      // 鼠标是否经过视频
      is_video_hover:false,
      // 视频是否加载完成
      is_video_load_done: false,
      is_show_content: false,//是否显示提示信息
      // 画中画是否开启
      is_open_pip: false,
      // 视频是否暂停
      is_video_pause: false,
      //是否限蘋
      is_limited:false,
      // 鼠标移动
      move_replay:false,
      // 视频全屏功能是否可用
      video_fullscreen_disabled: false,
      //仓库版本号
      details_data_version:MatchDetailCalss.details_data_version,  
      //视屏播放类型
      play_media:MatchDetailCalss.play_media,
      // 获取电竞视频 是否暂停  
      vx_is_pause_video:MatchDetailCalss.is_pause_video,  
      // 当前网站是否处于后台运行中
      get_vue_hidden_run:GlobalSwitchClass.vue_hidden_run,   
      //视频是否展开
      is_fold_status:GlobalSwitchClass.is_fold_status,
      //global版本号
      global_switch_version:GlobalSwitchClass.global_switch_version,
      // 获取用户信息
      vx_get_user:UserCtr.get_user(),
      // 获取模板主题
      get_theme:UserCtr.theme,
      //登录是否失效
      vx_is_invalid:UserCtr.is_invalid, 
      //用户类版本号
      user_version:UserCtr.user_version, 
       // 用户是否长时间未操作
      get_is_user_no_handle:UserCtr.get_is_user_no_handle(),
      //赛事详情对象
      match_info:{},
      //详情数据仓库版本号
      data_version: MatchDetailsData.data_version
    }
  },
  computed: {
    // 是否为电竞
    is_esports() {
      let is_esports_val
      // 详情页判断球种ID  其他页面取菜单
      if(this.$route.name == 'details'){
        is_esports_val = is_eports_csid(this.$route.params.csid)
      }else if(this.$route.name == 'search'){
        is_esports_val = false
      }else {
        is_esports_val = false
      }
      return is_esports_val;
    },
  },

  watch: {
    /**
     * 监听并修改设置的type
     * @param {'play-video'} value 
     */
    show_type_default(value) {
      if (value) {
        this.show_type = value;
      }
    },
    // //监听详情类的版本号
    // "layout_version.value": {
    //   handler(res) {
              
       
    //   },
    // },
    //监听详情类的版本号
    "details_data_version.version": {
      handler(res) {
      
        this.play_media = MatchDetailCalss.play_media
        this.vx_is_pause_video = MatchDetailCalss.is_pause_video
        // this.show_type =MatchDetailCalss.params.media_type
        let cur = MatchDetailCalss.play_media.time
        this.match_info = MatchDetailsData.get_quick_mid_obj(MatchDetailCalss.params.mid)
       
      },deep:true
    },
    //监听详情数据仓库类的版本号
    // "data_version.version": {
    //   handler(res) {
    //     this.match_info = MatchDetailsData.get_quick_mid_obj(MatchDetailCalss.params.mid)
    //   },deep:true
    // },
    //监听global开关的版本号
    "global_switch_version.version": {
      handler(res) {
        this.get_vue_hidden_run = GlobalSwitchClass.vue_hidden_run
        this.is_fold_status = GlobalSwitchClass.is_fold_status
      }
    },
      //监听user类的版本号
    "user_version.version": {
      handler(res) {
        this.vx_get_user = UserCtr.get_user()
        this.get_theme = UserCtr.themer
        this.vx_is_invalid = UserCtr.is_invalid
        }
      },
    // 监听用户是否长时间未操作
    get_is_user_no_handle(res){
      if(res && this.show_type == 'play-video' && this.play_media.media_type == 'video'){
        this.show_type = 'no-handle'
        video.send_message({cmd: 'destroy_video'})
      }
    },
    // 当前网站是否处于后台运行中
    get_vue_hidden_run(res){
      // 切换页签不可背景播放  0关、1开
      let is_video_background = lodash.get(this.vx_get_user, "videoManageVo.noBackgroundPlay", 0);
      // 视频流量管控开关 1开启、0关闭
      let config_video_switch = lodash.get(this.vx_get_user, "videoManageVo.videoSwitch", 0);
      // 系统级别视频流量管控总开关   '1'开启、'0'关闭
      let config_video_time = lodash.get(this.vx_get_user, 'videoManageVo.configValue', "0");
      if (config_video_time != '0' && config_video_switch != 0 && is_video_background != 0) {
        // 如果处于后台运行且不是画中画
        if(res && !this.is_open_pip){
          
          // 专题视频保留播放进度
          if (this.play_media.media_type === 'topic') {
            video.send_message({
              cmd: 'record_play_info',
              val: {
                record_play_time: true
              }
            })
          }

          clearTimeout(this.is_video_pause_change_timer)
          this.is_video_pause_change_timer = setTimeout(() => {
            // 不播放视频
            this.is_video_pause = true
          }, 50)
        }else{
          this.is_video_pause = false
        }
      }else {
        // 播放视频
        this.is_video_pause = false
      }
    },
    //切换主题时 重新加载动画
    get_theme(res){
      //如果当前播放动画 就切换
      if(this.show_type == 'play-video' && this.play_media.media_type == 'animation'){
        video.get_animation_url(this.match_info, (show_type,media_src) => {
          this.show_type = show_type
          this.media_src = media_src
        })
      }
      //给单页发送切换模板消息
      video.send_message({
        cmd: "update_style",
        val: res,
      })
    },
    //监听页面大小改变
    vx_get_layout_list_size() {
      this.set_height()
    },
    /**监听折叠状态 展开时重设高度 */
    is_fold_status(status){
        if(status){
          this.set_height()
        }
    },
    //监听登录是否失效
    vx_is_invalid(res) {
      if (res && this.show_type == 'play-video' && this.play_media.media_type == 'video') {
        this.show_type = 'no-login'
      }
    },
    //动画状态改变
    "match_info.mvs": {
      handler(res) {
        //如果推送关闭动画  并且正在播放动画
        if (res == -1 && this.show_type == 'play-video' && this.play_media.media_type == 'animation') {
          this.auto_play()
        }
      }
    },
    //视频状态改变
    "match_info.mms": {
      handler(res) {
        //如果推送关闭视频 并且正在播放视频
        if (res != 2 && this.show_type == 'play-video' && this.play_media.media_type == 'video') {
          this.auto_play()
        }
      }
    },
    //直播间视频状态改变
    "match_info.lvs": {
      handler(res) {
        //如果推送关闭视频 并且正在播放视频
        if (res != 2 && this.show_type == 'play-video' && this.play_media.media_type == 'studio') {
          this.auto_play()
        }
      }
    },
    // 赛事ID改变
    "mid"() {
      if(this.mid == -1 || !this.mid){
        this.show_type = 'no-video'
      }
      this.media_src = ''
      this.topic_is_playing = false;
      this.meida_update_time = 0;
    },

    // 设置直播类型 && 获取直播地址
    "play_media.time": {
      handler(cur) {
        // this.match_info =MatchDetailsData.get_quick_mid_obj(this.mid)
        if (!cur  ) return
        console.log(MatchDetailsData.get_quick_mid_obj(this.mid),'MatchDetailsData.get_quick_mid_obj(this.mid)');
        let ini_info = MatchDetailsData.get_quick_mid_obj(this.mid)
        this.show_loading = true
        // 10秒后隐藏loading图片
        clearTimeout(this.timer_id_1)
        this.timer_id_1 = setTimeout(()=>{
          this.show_loading = false
        },10000)
        
        this.callback_id++
        let callback_id = this.callback_id
        let { media_type } = this.play_media
      
        let  mid="" ; let mms="" ;let mvs=""; let varl="" ;let vurl=""; let  csid=""; let lvs=""
        if( this.match_info ) {
          mid= this.match_info.mid
          mms=this.match_info.mms
          mvs = this.match_info.mvs
          varl = this.match_info.varl
          csid= this.match_info.csid
          lvs= this.match_info.lvs
         }
        
        const {mid: last_mid, media_type: last_media_type} = this.last_media_info || {}
        
        // 非专题视频时需重置专题视频播放状态
        if (media_type !== 'topic') {
          this.topic_is_playing = false
        }
        // 由视频切换到其他媒体时，重置meida_update_time
        if (!['video','studio','anchor','topic'].includes(media_type)) {
          this.meida_update_time = 0
        }
        
        // 非首次加载视频
        if(this.mid == -1 ){
          this.show_type = 'no-video'
          return
        }
        // 电竞只有视频
        if(this.is_esports){
          let url = varl || vurl
          if(mms == 2 && url){
            this.media_src = url
            this.show_type = this.vx_is_pause_video ? 'pause' : 'play-video'
          }else{
            if(is_eports_csid(csid) || csid == -1){              
              this.show_type = 'no-video'
            }else{
              this.show_type = ''
            }
          }
          return
        }
    

        // 比分板信息
        if((media_type == 'auto' && this.$route.name == 'home') || media_type == 'info'){
          this.show_type = 'info'
          this.media_src = ''
          video.set_play_media(this.mid,'info')
          return
        }
        
        // 媒体类型auto进一步判断
        if (media_type == "auto") {
          if (mvs > -1) {
            media_type = "animation"
          }else{
            this.show_type = 'info'
            this.media_src = ''
            video.set_play_media(this.mid,'info')
            return
          }
        }
        
        // 视频、演播室、主播、专题等视频媒体相关状态处理
        if(['video','studio','anchor','topic'].includes(media_type) && this.match_info.mid){
          // isLogin接口触发时差调整（10s内触发的切断)
          if (
              last_mid === mid &&
              last_media_type === media_type &&
              this.meida_update_time && (cur - this.meida_update_time < 10000)
          ) {
            return
          }
        
          this.is_video_load_done = false
          if (media_type === 'topic' && this.topic_is_playing) {
            // 专题视频is_video_load_done状态更新
            this.is_video_load_done = true
          }
          
          this.show_type = 'play-video'
          // 目标赛事视频url相关信息获取
          video.get_video_url(this.match_info,this.$route,(show_type,media_src) => {
            // 未登录
            if(media_src === true && show_type === 'no-login'){
              this.is_limited = true
              this.show_type = show_type
              return
            }
            this.is_video_error = false
            //回调函数过期
            if(callback_id != this.callback_id){
              return
            }

            // 专题视频(mp4)正在播放中
            if (media_type === 'topic' && this.topic_is_playing) {
              return
            }
            video.set_play_media(this.match_info.mid,media_type)
            // 记录切换前 媒体相关信息
            this.last_media_info = lodash.cloneDeep(this.play_media)
            // 记录媒体切换时间
            this.meida_update_time = Date.now()
            
            if(show_type == 'play-video' && this.get_is_user_no_handle){
              show_type = 'no-handle'
            }
            
            this.show_type = show_type
            let live_type = get_media_icon_index(media_type)
            // 此处为最终处理后的视频url
            this.media_src = url_add_param(media_src,'video_type',window.video_type?window.video_type:1) + `&live_type=${live_type}&csid=${this.match_info.csid}&icons_right=163&pip_right=80`
            this.media_src_temp = this.media_src
            // 如果是在回放状态下，切换回播视频
            if (this.current_replay) {
              this.change_event_video(this.current_replay)
            }
            // 专题视频是否正在播放
            if (media_type === 'topic') {
              this.is_video_load_done = true
              this.topic_is_playing = true
            } else {
              this.topic_is_playing = false
            }
          })
          return
        } else {
          this.topic_is_playing = false
          this.meida_update_time = 0
        }
        if(media_type == 'animation' && this.match_info?.mid){
          // 目标赛事动画url相关信息获取
          video.get_animation_url(this.match_info, (show_type,media_src) => {
            //回调函数过期
            if(callback_id != this.callback_id){
              return
            }
         
            video.set_play_media(this.match_info.mid,'animation')
            this.show_type = show_type
            // 此处为最终的动画url
            this.media_src = media_src
          })
          this.set_height()
          return
        }
      },
      immediate: true
    },
    //显示类型改变
    show_type: {

      handler(cur){
        this.set_height()
        this.is_show_content = false
      }

    },
    //路由改变
    '$route.name'() {
      this.set_height()
      this.is_show_content = false
    },
    // 鼠标移动状态
    move_replay(n, o) {
      if (!n && o) {
        this.is_expand_video_list = false
      }
    },
    refresh_time() {
      const { mid, media_type } = this.play_media
      const time = Date.now()
      MatchDetailCalss.set_play_media( {
        mid,
        media_type,
        time
      });
    }
  },

  methods: {
    /**
     * @Description 点击视频播放按钮
     * @param {undefined} undefined
    */
    on_play_video(){
      // 设置电竞视频是否暂停
      MatchDetailCalss.set_is_pause_video(false)
      this.show_type = 'play-video'
    },
    /**
     * @Description:鼠标移入视频区域
     * @return {undefined} undefined
     */
    video_enter(){
      if(this.is_video_error && !this.is_esports){
        return
      }
      this.is_video_hover = true
      if(this.is_video_load_done){
        video.send_message({
          cmd:'show_controller',
          val:true
        })
      }
    },
    /**
     * @Description:鼠标离开视频区域
     * @return {undefined} undefined
     */
    video_leave(){
      this.is_video_hover = false
      video.send_message({
        cmd:'show_controller',
        val:false
      })
      video.send_message({
        cmd:'global_click',
        val:''
      })
      // 关闭精彩回放列表
      this.is_expand_video_list = false
    },
    /**
    * @Description:设置视频音量
    * @return {undefined} undefined
    */
    video_volume(obj){
      video.send_message({cmd:'volume_video',src:lodash.get(obj,'src',''),volume:lodash.get(obj,'volume',0)});
    },
    /**
    * @Description:发送iframe消息
    * @return {undefined} undefined
    */
    iframe_video_msg_event(obj){
      video.send_message(obj);
    },
    /**
     * @Description:接收单页传过来的消息
     * @param {object} e 消息内容
     * @return {undefined} undefined
     */
    handleMessage(e) {
      // 视频加载错误
      if(e.data.cmd == 'load_error'){
        this.is_video_error = true
        this.video_leave()
      }
      // 视频加载完成
      else if(e.data.cmd == 'load_done'){
        this.is_video_load_done = true
        if(this.is_video_hover){
          video.send_message({
            cmd:'show_controller',
            val:true
          })
        }
      }
      // 已开启视频画中画
      else if (e.data.cmd == "open_pip_done") {
        this.is_open_pip = true;
      // 已关闭视频画中画
      } else if (e.data.cmd == "colse_pip_done") {
        this.is_open_pip = false;
      }
      if(e.data.cmd == 'video_replay_full_srceen_event'){
        // 设置偏移量
        if(lodash.get(e.data,'val.type') == 1 && this.current_replay){
          this.$router.push({
            name: 'video',
            params: {
              mid:this.match_info.mid,
              tid:this.match_info.tid,
              csid:this.match_info.csid,
              play_type:1,
              video_size:'1',
              replay_id:lodash.get(this.current_replay,'eventId')
            }
          })
        }
      }
    },
    /**
     * @Description:自动播放  自动选择播放视频还是动画
     * @return {undefined} undefined
     */
    auto_play() {
      let { mid } = this.play_media
      let time = Date.now()
      MatchDetailCalss.set_play_media({
        mid,
        media_type: 'auto',
        time
      })
    },
    /**
     * @Description:设置视频高度
     * @return {undefined} undefined
     */
    set_height() {
      let el = this.$refs.video
      if (el) {
        let height = 0
        if (this.show_type == 'info') {
          height = 190 + 'px'
        } else {
          height = (el.offsetWidth * 0.5625) + 'px'
        }
        el.style.height = height
      }
    },
    // 鼠标移动
    onMousemove() {
      this.move_replay = true
      if(this.moveTimerReplay){
        clearTimeout(this.moveTimerReplay)
      }
      this.moveTimerReplay = setTimeout(()=>{
        this.move_replay = false
      },10000)
    },
    // 更改video的配置改变时更改配置
    video_status_change(data) {
      if (lodash.isBoolean(data.fullscreen_disabled)) {
        this.video_fullscreen_disabled = data.fullscreen_disabled
      }
    },
    // 回播视频关闭播放
    video_end(data) {
      if (data.cmd === 'play_end') {
        this.video_fullscreen_disabled = false
        video.send_message({
          cmd: 'replay_video_jq_cmd',
          val: "$('.dplayer .pip-icon').css({'opacity':'1'});index.pip_click_no_run=0;"
        });
      }
    }
  },

  mounted() {
    this.set_height()
  },
  created() {
    this.is_video_error = false
    this.auto_play = lodash.debounce(this.auto_play, 100)
    window.addEventListener("message", this.handleMessage);
    useMittOn(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD_END,()=>{
      
    })
    //todo
      /** 批量注册mitt */
  const { emitters_off } = useMittEmitterGenerator([
  
    // { type: MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, callback:  this.video_volume },
  
    // { type: MITT_TYPES.EMIT_IFRAME_VIDEO_STATUS_CHANGE, callback: this.video_status_change },


    // { type: MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD_END, callback:  this.video_end },

    // { type: MITT_TYPES.EMIT_IFRAME_VIDEO_MSG_EVENT, callback: this.iframe_video_msg_event },
  ]);
  this.offMitt = emitters_off

  },
  destroyed() {
    this.debounce_throttle_cancel(this.auto_play);
    window.removeEventListener("message", this.handleMessage);
    clearTimeout(this.timer_id_1)
    clearTimeout(this.is_video_pause_change_timer)
    this.offMitt()
  },
}
