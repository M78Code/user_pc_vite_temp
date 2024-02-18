/*
 * @Description:当前选中的赛事的阶段组件包含视频,进行中,完赛
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { get_now_server } from 'src/core/utils/common/module/other.js'
import { LOCAL_PROJECT_FILE_PREFIX,calc_win, project_name, i18n_t } from 'src/output/index.js'


export default {
  name:'VirtualSportsStage',
  props:{
    current_match:Object,
    dialog:false,
    position: 'top',
    source:String,
    is_before_destroy:Number,
    match_process_update:Number,
    m_status:Number,
    basketball_status:{
      type:Number,
      default:0
    },
    virtual_match_list:Array,
    is_video_playing:Boolean,
    v_match_router_ente:Number,
    // 虚拟赛事结果排名数据，目前只有泥地摩托车用到
    virtual_result_rank_data: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  setup() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  data(){
    return {
      // 零时变量暂时控制显示
      show:false,
      // 视频播放器
      player:null,
      // 下一轮赛事时间
      next_match_time:'',
      // 下一轮赛事轮或期标题
      next_batch_title:'',
      // 视频快进到的时间点
      seek_to_target:0,
      // 倒计时剩余时间(毫秒)
      start_now_sub:0,
      // 轮号国际化字符串
      next_batch_no:'',
      // 期号国际化字符串
      next_date_no:'',
      // 虚拟赛事列表数据加载中
      virtual_match_list_data_loading:false,

      // 视频是否已经初始化
      random_inited:false,
      // 视频声音
      video_voice:false,
      // 视频状态 0 1 2
      video_play_stauts:0,
      // 赛事已开赛
      match_started:false,
      // 篮球早盘倒计时结束
      is_pre_counting_end:false,
      //子组件进度条宽度
      round_line_width: 0
    }
  },
  mounted(){
    this.timer_super28 = 0;
    this.timer_super29 = 0;
    this.timer_super30 = 0;
    this.set_loading_time = 0;
    // 视频播放器初始化时钟
    this.init_player_timeout = 0;
      // 完赛显示结束时钟
    this.match_ended_timer = 0;
      // 下一轮赛事开赛倒计时时钟
    this.next_match_timer = 0;
    // 轮号国际化字符串
    this.next_batch_no = i18n_t('virtual_sports.next_batch_no');
    // 期号国际化字符串
    this.next_date_no = i18n_t('virtual_sports.next_date_no');
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_IS_ALL_END_NOTICE, this.all_ended_handle).off,
      useMittOn(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, this.sync_video_data_handle).off,
      useMittOn(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED, this.set_init_video_on).off,
      useMittOn(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, this.set_loading_state).off,
      useMittOn(MITT_TYPES.EMIT_PRE_COUNTING_EDN, this.pre_counting_end_handle).off,
      useMittOn(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, this.visibilitychange_handle).off,
    ]
    this.timer_super28 = setTimeout(() => {
      this.video_process_init_video();
    },500);
    this.set_loading_state();
    this.user_destroy_resource();
  },
  methods:{
    set_line_width(width){ this.round_line_width = width},
    set_is_show_menu(data){VR_CTR.state.is_show_menu = data},
    set_prev_v_sports_params(data){VR_CTR.state.prev_v_sports_params = data},

    /**
     *@description 计算类名
     *@param {Number} rank_i 编号
     *@param {Number} sport_menu_type 球类type
     *@return {String} 类名
     */
    get_rank_background(rank_i, sport_menu_type){
      let s_type = 'dog';//赛马horse或赛狗dog
      let virtual_sports_1= ''
      if(sport_menu_type == 1011){  // 赛马
        s_type = 'horse'
      }
      else if([1002, 1010, 1009].includes(sport_menu_type)){ // 赛狗 摩托车 泥地摩托车
        s_type = 'dog'
      } else {
        return null
      }
      if([1010].includes(sport_menu_type)){
        virtual_sports_1 = `motorcycle${rank_i}`
      }
      if([1009].includes(sport_menu_type)){
        virtual_sports_1 = `dirt_motorcycle${rank_i}`
      }
      return `match-${s_type}${rank_i} ${virtual_sports_1}`;
    },
    /**
     *@description 监听页面可见性，当页面不可见时关闭视频声音
     */
    visibilitychange_handle(){
      if (document.visibilityState == 'hidden' && this.video_voice && (this.$route.name == 'virtual_sports' || this.$route.name == 'virtual_sports_details')) {
        this.player.video.muted = true
        this.video_voice = false
      }
    },
    /***
     * 篮球早盘倒计时结束显示比分列表
     */
    pre_counting_end_handle(){
      this.is_pre_counting_end = true;
    },
    /**
     * @description: 视频同步函数
     */
    set_init_video_on(video_data){
      this.video_process_init_video("v_p_d_got",video_data);
    },
    /**
    *@description:虚拟体育详情页返回
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    detail_back(){
      this.$router.push({name: 'matchList'});
    },
    /**
    *@description:点击注单icon显示注单历史
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    open(position){
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
    *@description:关闭投注记录显示
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    change_settle_status(){
      this.timer_super29 = setTimeout(() => {
        this.dialog = false
      }, 100);
    },
    /**
     * 所有赛事结束通知
     */
    all_ended_handle(){
      this.next_match_time_counting_down();
      this.get_next_batch_no();
    },
    /**
     * 时钟计时结束
     */
    timer_ended_handle(mid){
      this.video_process_init_video();
      if(this.sub_menu_type == 1004){
        if(this.current_batch.mmp == 'INGAME'){
          this.$emit('time_ended','is_basketball_playing');
        }
        else{
          this.$emit('time_ended','is_basketball_pre');
        }
      }
      else{
        this.match_started = true;
        this.$emit('time_ended',mid);
      }
    },
    user_destroy_resource(){
      if(this.player){
        this.player.destroy();
        this.player = null;
        this.video_process_init_video();
      }
    },
    /**
     * 初始化视频播放器
     */
    init_video_player(){
      if(!this.current_match || !this.current_match.thirdMatchVideoUrl || this.m_status != 1 || this.video_play_stauts == 2) return;
      let video_wrap_dom = document.querySelector('.video-playing-er');

      if(!video_wrap_dom){
        clearTimeout(this.timer_super30);
        this.timer_super30 = setTimeout(() => {
          this.init_video_player();
        },500);
        return;
      }
      if(this.player && this.video_play_stauts == 1){
        video_wrap_dom = null
        return;
      }
      this.player = new DPlayer({
        container:video_wrap_dom,
        live:true,
        autoplay:true,
        video:{
          url:this.current_match.thirdMatchVideoUrl,
          type:'hls',
          autoplay:true,
        }
      });
      if(this.current_match.mgt){
        let time_ = get_now_server()-Number(this.current_match.mgt);
        if(time_>0){
          this.player.seek(time_/1000);
          this.seek_to_target = time_/1000;
        }
      }
      this.player.video.muted = true;
      this.video_voice = false
      //监听视频可以播放  右侧菜单为显示状态则暂停视频播放
      // 播放
      this.player.on('play',() => {
        this.video_play_stauts = 0;
      });
      // 播放中
      this.player.on('playing',() => {
        this.video_play_stauts = 1;
      });
      // 视频结束
      this.player.on('ended',() => {
        this.video_play_stauts = 2;
      });
      // 视频中断
      this.player.on('abort',() => {
        this.video_play_stauts = 2;
      });
      // 开始播放时,设置视频时长
      this.player.on('seeking',(res)=>{
        if(this.player && isFinite(this.player.video.duration) && this.player.video.duration>Number(this.current_match.totalTime))
        {
          try {
            this.current_match.totalTime=this.player.video.duration;
          } catch (error) {
            console.error(error);
          }
          if(this.set_current_match_assign){
            this.set_current_match_assign((current_match)=>{
            current_match.totalTime=this.player.video.duration;
          });
          }
        }
      })

      video_wrap_dom = null
    },
    /**
     * @Description 设置视频声音
     * @param {undefined} undefined
    */
    set_video_voice(){
      this.player.video.muted = this.video_voice;
      this.video_voice = !this.video_voice
    },
    /**
     * 下一轮开赛倒计时
     */
    next_match_time_counting_down(){
      if(this.video_process_data && this.video_process_data.nextTime){

        let start = Number(this.video_process_data.nextTime);
        let now = get_now_server();
        let sub_time = start - now;

        if(this.next_match_timer){
          clearTimeout(this.next_match_timer)
        }

        if(sub_time < 1){
          return
        }
        let time_obj = new Date(sub_time);
        let minutes = String(time_obj.getMinutes());
        let seconds = String(time_obj.getSeconds());
        minutes = minutes.padStart(2,'0');
        seconds = seconds.padStart(2,'0');
        this.next_match_time = `${minutes}'${seconds}"`;
        this.next_match_timer = setTimeout(() => {
          this.next_match_time_counting_down();
        },1000);
      }
    },
    /**
     * 获取下一轮赛事轮号或期号
     */
    get_next_batch_no(){
      let result = '';
      if(this.video_process_data){
        let n_no = Number(this.video_process_data.nextNo);
        //展示下一轮号
        if(n_no){
          if(this.next_batch_no && typeof this.next_batch_no == "string"){
            result = this.next_batch_no.replace('%s',this.video_process_data.nextNo);
          } 
        }
        //展示下一期号
        else{
          let n_date_no = Number(this.video_process_data.nextBatchNo);
          if(n_date_no && this.next_date_no){
            result = this.next_date_no.replace('%s',this.video_process_data.nextBatchNo);
          }
        }
      }
      this.next_batch_title = result;
      clearTimeout(this.match_ended_timer);
      let delay_time = 30000;
      //虚拟篮球10秒后获取下一期
      if(this.sub_menu_type == 1004) {
        delay_time = 1000 * 14;
      }

      this.match_ended_timer = setTimeout(() => {
        this.$emit('update_next_batch_match');
      },delay_time);

    },
    /**
     * 同步视频数据到赛事
     * @param {Object} params 同步所需数据
     */
    sync_video_data_handle(params){
      if(this.current_match.mid == params.sport_data.mid){
        this.seek_to_target = params.upd_time;
        try {
          if(this.player && Math.abs(this.player.video.currentTime-params.upd_time)>=5)
          { // 对视频进行校对
            this.player.seek(this.seek_to_target);
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    /**
     * 获取赛马最终结果
     */
    get_score_list(){
      let res = [];
      if(this.current_match && this.current_match.list && this.current_match.list.length){
        let last_win_obj = this.current_match.list[this.current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      if(this.virtual_result_rank_data.length && this.sub_menu_type == 1009) {
        let arr = lodash.sortBy(this.virtual_result_rank_data, 'ranking')
        for (const item of arr) {
          res.push(item.no)
        }
      }
      return res;
    },
    /**
     * 获取到视频进程数据
     */
    video_process_init_video(type_s){
      clearTimeout(this.init_player_timeout);
      this.init_player_timeout = setTimeout(() => {
        let new_ = this.current_match;
        let video_data = this.video_process_data;
        if(!new_ || !new_.mid || !video_data) return;
        if(new_.match_status == 0){
          this.seek_to_target = 0;
          if(this.player){
            this.player.destroy();
            this.player = null;
          }
        }
        else if(new_.match_status == 1){
          this.init_video_player();
        }
        else if(new_.match_status == 2){
          if(this.player){
            this.player.destroy();
            this.player = null;
          }
          this.seek_to_target = 0;
          this.next_match_time_counting_down();
          this.get_next_batch_no();
        }
        if(typeof new_.match_status == 'undefined'){
          this.random_inited = false;
        }
        if(type_s === 'is_process_update'){
          this.random_inited = true;
        }
        if(this.current_league){
          let p = lodash.cloneDeep(this.get_prev_v_sports_params);
          let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
          p[p_key] = lodash.cloneDeep(new_);
          this.set_prev_v_sports_params(p);
        }
      },500);
    },
    /**
     * 设置数据加载状态
     */
    set_loading_state(v){
      let r = true;
      if(!this.current_match || !this.current_match.mid){
        r = true;
      }else{
        r = false;
      }
      this.virtual_match_list_data_loading = r;
      if(typeof v != 'undefined'){
        this.virtual_match_list_data_loading = v;
      }

      if(this.virtual_match_list_data_loading){
        clearTimeout(this.set_loading_time);
        this.set_loading_time = setTimeout(() => {
          this.virtual_match_list_data_loading = false;
        },1000);
      }
    },
    // 清除当前组件所有定时器
    clear_timer() {
      const timer_arr = [
          'timer_super28',
          'timer_super29',
          'timer_super30',
          'next_match_timer',
          'match_ended_timer',
          'init_player_timeout',
          'set_loading_time'
      ]

      for (const key of timer_arr) {
        clearTimeout(this[key])
        this[key] = null
      }
    },
  },
  computed:{
    //抽屉菜单显示状态
    current_league(){return VR_CTR.state.current_league},
    current_batch(){return VR_CTR.state.current_batch},
    video_process_data(){return VR_CTR.state.video_process_data},
    get_prev_v_sports_params(){return VR_CTR.state.prev_v_sports_params},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
    right_menu_show(){return VR_CTR.state.is_show_menu},

    // 主队名
    home_name(){
      let result = '';
      if(this.current_match && this.current_match.teams && this.current_match.teams[0]){
        result = this.current_match.teams[0];
      }
      return result;
    },
    // 客队名
    away_name(){
      let result = '';
      if(this.current_match && this.current_match.teams && this.current_match.teams[1]){
        result = this.current_match.teams[1];
      }
      return result;
    },
    // 主队得分
    home_score(){
      let result = 0;
      if(this.current_match && this.current_match.home){
        result = this.current_match.home;
      }
      return result;
    },
    // 客队得分
    away_score(){
      let result = 0;
      if(this.current_match && this.current_match.away){
        result = this.current_match.away;
      }
      return result;
    },
  },
  watch:{
    'virtual_result_rank_data.length'(){
      this.get_score_list()
    },
    v_match_router_ente(){
      this.user_destroy_resource();
    },
    is_before_destroy(){
      if(this.player){
        this.player.destroy();
        this.player = null;
      }
    },
    match_process_update(){
      if(!this.random_inited){
        this.video_process_init_video('is_process_update');
      }
    },
    current_match(new_){
      if(new_){
        this.video_process_init_video();
      }
      this.set_loading_state();
      this.is_pre_counting_end = false;
    },
    'm_status'(state){
      // 播放中且右侧菜单为显示状态， 则再次触发右侧菜单显示状态变更
      if (state === 1 && this.right_menu_show) {
        this.set_is_show_menu(false)
        this.$nextTick(() => {
          this.set_is_show_menu(true)
        })
      }

      if(state != 1){
        if(this.player){
          this.player.destroy();
          this.player = null;
        }
      }
      if(state == 2){
        this.seek_to_target = 0;
        this.next_match_time_counting_down();
        this.get_next_batch_no();
        if(this.sub_menu_type == 1004){
          this.$emit('basketball_end');
        }
      }
      this.video_process_init_video();
    },
    source(){
      this.video_process_init_video();
    },
    video_process_data(){
      if(this.current_match){
        this.video_process_init_video();
      }
    },
    right_menu_show(val) {
      // 若视频未播放则提前退出
      if (this.m_status !== 1) return

      // 获取视频dom
      let video = document.querySelector('.dplayer-video-wrap video')

      if (!video) {
        // 当m_status为1且视频为黑屏加载状态时，隐藏视频外层容器,防止视频弹出遮挡右侧菜单
        if (this.$refs['video-playing-er']) {
          this.$refs['video-playing-er'].style.display = 'none'
        }
      } else {
        this.$refs['video-playing-er'].style.display = 'block'
      }

      // 右侧菜单显示，并且视频为播放中,则暂停并隐藏视频
      if (val && this.m_status === 1 && video) {
        video.style.display = 'none'
        this.player && this.player.pause()
      } else if (!val && this.m_status === 1 && video) {
        video.style.display = 'block'
        this.player && this.player.play()
      }

      video = null
    }
  },
  unmounted(){
    if(this.player){
      this.player.destroy();
      this.player = null;
    }
    this.emitters.map((x) => x());
    this.clear_timer();

    // 清除数据
    for (const key in this.$data) {
      this.$data[key] = null;
    }
  }
}