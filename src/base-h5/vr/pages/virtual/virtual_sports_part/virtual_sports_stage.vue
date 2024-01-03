<!--
 * @Description: 当前选中的赛事的阶段组件包含视频,进行中,完赛
-->
<template>
  <div class="virtual-sports-stage" :data-mid="'mid-'+current_match.mid" :data-mstatus="'status-'+m_status">      
    <div class="banner" :class="{
      horse:sub_menu_type == 1011,
      dog: [1002, 1010, 1009].includes(sub_menu_type),
      basketball:sub_menu_type == 1004,
      motorcycle: [1010, 1009].includes(sub_menu_type),
      dirt_motorcycle:sub_menu_type == 1009
      }">
      <loading v-show="virtual_match_list_data_loading" class="wrapper-loading-c" />

      <!-- 0:代表开赛之前倒计时 -->
      <div v-if="(!is_pre_counting_end) && (!m_status || m_status == 0)" class="row justify-center items-center timetop">
        <virtual-sports-timer
          :title="current_match.no"
          :ms="start_now_sub"
          :mid="current_match.mid"
          :match="current_match"
          :source="source"
          @time_ended="timer_ended_handle" />
      </div>

      <!-- 1:赛事进行中(有视频播放中) -->
      <div class="video-playing-container" v-if="m_status === 1">
      <!--<div class="video-playing-container">-->
        <div class="video-wrapper">
          <div class="video-playing-er" ref="video-playing-er">
          </div>
          <!-- 视频声音 -->
          <div class="voice-wrap" @click="set_video_voice">
            <svg v-if="!video_voice"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
          </div>
        </div>
        <!-- 实时比分-->
        <div v-if="[1001,1004].includes(sub_menu_type)"
          class="current-score row justify-around items-center">
          <div class="score-info-wrapper">
            <div class="team-and-score">
              <div class="team-name">
                {{current_match.teams[0] ? current_match.teams[0] : 0}}
              </div>
              <div>
                {{current_match.home}}-{{current_match.away}}
              </div>
              <div class="team-name">
                {{current_match.teams[1] ? current_match.teams[1] : 0}}
              </div>
            </div>
            <div v-show="current_match && (current_match.s170_home > 0 || current_match.s170_away > 0)" class="penalty-score-wrapper">
              <div class="team-placeholder-wrapper">
                <div class="team-name-placeholder">
                  {{current_match.teams[0] ? current_match.teams[0] : 0}}
                </div>
                <i class="icon icon-penalty"></i>
              </div>
              <div class="penalty-score">
                {{current_match.s170_home ? current_match.s170_home : 0}}-{{current_match.s170_away ? current_match.s170_away : 0}}
              </div>
              <div class="team-name-placeholder">
                {{current_match.teams[1] ? current_match.teams[1] : 0}}
              </div>
            </div>
          </div>
          <!--<div>
            {{current_match.teams[0] ? current_match.teams[0] : 0}}
          </div>
          <div>
            {{current_match.home}}-{{current_match.away}}
          </div>
          <div>
            {{current_match.teams[1] ? current_match.teams[1] : 0}}
          </div>-->
          <div v-if="sub_menu_type != 1004" class="c-s-timer-w row justify-center items-center">
            {{current_match.show_time}}'
            <div class="update-timer">
              {{match_process_update}}
            </div>
          </div>
          <div v-if="sub_menu_type == 1004" class="c-s-timer-w basketball row justify-center items-center">
            <!-- <img  src="image/wwwassets/bw3/list/basket_ball_video_playing.svg" alt=""> -->
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/basket_ball_video_playing.svg`" alt="">
          </div>
        </div>
      </div>
      <!-- 2:赛事结束显示对阵 -->
      <div v-if="m_status == 2 && get_score_list().length && sub_menu_type != 1004" class="fat-box ended">
      <!--<div  class="fat-box ended">-->

        <!-- 赛马/赛狗赛事结束对阵 -->
        <div v-if="![1001,1004].includes(sub_menu_type)" class="score row justify-center items-center">
          <!-- 已完赛 -->
          <div :style="{visibility: ![1002, 1011, 1010, 1009].includes(sub_menu_type) ? 'hidden':'visible'}"
            v-if="source != 'detail'"
            class="match-over">{{i18n_t('collect.match_end')}}</div>
          <div v-for="(score,i) in get_score_list()" :key="i">
            <div class="score-box row justify-center items-center" :class="get_rank_background(score,sub_menu_type)"></div>
          </div>
        </div>
        <!-- 足球赛事结束对阵 -->
        <div v-else class="football-score row justify-center items-center">
          <div class="name-wrap left">
            <div class="match-name ellipsis">{{home_name}}</div>
            <img v-img="([lodash.get(current_match,'mhlu'), lodash.get(current_match,'frmhn')])" />
          </div>
          <div class="msc-wrap yb-flex-center">
            <div class="match-end">{{i18n_t('collect.match_end')}}</div>
            <div class="match-msc">
              <span>{{home_score}}</span>
              <span class="heng">-</span>
              <span>{{away_score}}</span>
            </div>
            <div
                v-show="current_match &&
                (current_match.s170_home > 0 || current_match.s170_away > 0)"
                class="match-msc match-penalty"
            >
              <!--<span>-->
              <!--  {{i18n_t('mmp[1][50]')}}:&nbsp;-->
              <!--</span>-->
              <i class="icon icon-penalty"></i>
              <div class="penalty-score">
                <span>{{current_match.s170_home ? current_match.s170_home : 0}}</span>
                <span class="heng">-</span>
                <span>{{current_match.s170_away ? current_match.s170_away : 0}}</span>
              </div>
            </div>
          </div>
          <div class="name-wrap right">
            <img v-img="([lodash.get(current_match,'malu'), lodash.get(current_match,'frman')])" />
            <div class="match-name ellipsis">{{away_name}}</div>
          </div>
        </div>
        <!-- 下一轮的时间 -->
        <div class="mmp-status row justify-end items-center" v-show="next_batch_title || next_match_time">
          <div class="inner">
            <div class="stage">{{next_batch_title}}</div>
            <div class="times">{{next_match_time}}</div>
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 虚拟篮球列表 v-if="basketball_status == 0 && sub_menu_type == 1004 && (match_started && !is_video_playing || m_status == 2 || is_pre_counting_end)" /> -->
    <dateMatchList @update_line_width="set_line_width" :current_match="current_match" :v_m_status="m_status"
      :virtual_match_list="virtual_match_list" :source="source"
      :is_pre_counting_end="is_pre_counting_end" :match_status="current_batch.mmp"
      v-if="basketball_status == 0 && sub_menu_type == 1004 && (match_started && !is_video_playing || m_status == 2 || is_pre_counting_end)" />

    <!-- 虚拟篮球详情组件 -->
    <virtualBasketball
      v-if="basketball_status > 0"
      :basketball_status="basketball_status"
      :current_match="current_match"
    />

  </div>
</template>

<script>
import virtualSportsTimer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_timer.vue";
import loading from 'src/base-h5/components/common/loading.vue';
import dateMatchList from 'src/base-h5/vr/pages/virtual/virtual_sports_part/date_match_list.vue'
import virtualBasketball from 'src/base-h5/vr/pages/virtual/details/children/virtual_basketball.vue'
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
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
    // ...mapMutations([
    //   'set_settle_dialog_bool',
    //   'set_is_show_menu'
    // ]),
    set_line_width(width){ this.round_line_width = width},
    set_settle_dialog_bool(){},
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
      this.set_settle_dialog_bool(false)
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
          if(this.next_batch_no){
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
    current_league(){return VR_CTR.state.current_league},
    current_batch(){return VR_CTR.state.current_batch},
    video_process_data(){return VR_CTR.state.video_process_data},
    get_prev_v_sports_params(){return VR_CTR.state.prev_v_sports_params},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
    get_is_show_settle_tab(){return 1},
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
  components:{
    'virtual-sports-timer':virtualSportsTimer,
    dateMatchList,
    // settleDialog,
    loading,
    virtualBasketball
  },
  destroyed(){
    if(this.player){
      this.player.destroy();
      this.player = null;
    }

    // this.$root.$off(this.emit_cmd.EMIT_IS_ALL_END_NOTICE,this.all_ended_handle);
    // this.$root.$off(this.emit_cmd.EMIT_SYNC_VIDEO_DATA,this.sync_video_data_handle);
    // this.$root.$off(this.emit_cmd.EMIT_VIRTUAL_MATCH_LOADING,this.set_loading_state);
    // this.$root.$off(this.emit_cmd.EMIT_CURRENT_VIDEO_PROCESS_INITED,this.set_init_video_on);
    // this.$root.$off(this.emit_cmd.EMIT_PRE_COUNTING_EDN,this.pre_counting_end_handle);
    // this.$root.$off(this.emit_cmd.EMIT_VISIBILITYCHANGE_EVENT,this.visibilitychange_handle)
    this.emitters.map((x) => x());
    this.clear_timer();

    // 清除数据
    for (const key in this.$data) {
      this.$data[key] = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.virtual-sports-stage {
  min-height: 1.9rem;
  position: relative;
  background: var(--q-gb-bg-c-28);
}

.voice-wrap {
  width: 0.4rem;
  height: 0.2rem;
  position: absolute;
  bottom: 0.04rem;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 0.2rem;
    height: 0.2rem;
    fill: rgba(255, 255, 255, 0.9);
  }
}

.banner {
  border-radius: 0.05rem;
  width: 100%;
  height: 1.9rem;
  margin: auto;
  overflow: hidden;
  background-image: url($SCSSPROJECTPATH+"/image/png/virtual_football.png"); //todo 后续上传到服务器
  background-size: 100% 100%;
  position: relative;

  &.horse {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_horse.png");
  }

  &.dog {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_dog.png");
  }

  &.basketball {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_basketball.png");
  }

  &.motorcycle {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_motorcycle.png");
  }

  &.dirt_motorcycle {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_virtual_match_motorcycle.png");
  }

  .wrapper-loading-c {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 40% !important;
    transform: translate(-50%, -50%);
    padding: 0;
  }

  .video-main {
    position: fixed;
    width: 100%;
    z-index: 2;
  }

  .current-score {
    width: 2.25rem;
    height: 0.36rem;
    border-radius: 0.04rem;
    background-color: rgba(0, 0, 0, 0.4);
    bottom: 0.04rem;
    left: calc(50% - 0.13rem);
    transform: translateX(-50%);
    position: absolute;
    z-index: 2;
    color: #ffffff;

    .score-info-wrapper {
      width: 100%;
      .team-and-score {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .team-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .penalty-score-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .team-placeholder-wrapper {
          position: relative;
          .icon-penalty {
            position: absolute;
            top: .03rem;
            right: 0;
            width: .11rem;
            height: .11rem;
            background:  var(--q-color-com-img-bg-114) no-repeat center / cover;
          }
        }

        /* 占位隐藏，目的是为了让图标定位准确 对齐 */
        .team-name-placeholder {
          max-height: .18rem;
          visibility: hidden;
        }
      }
    }

    .c-s-timer-w {
      width: 0.26rem;
      height: 100%;
      border-radius: 0.02rem;
      position: absolute;
      top: 0;
      right: -0.24rem;
      overflow: hidden;
      // background-color: rgb(242, 53, 13);
      // background-color: #179cff;
      background-color: var(--q-gb-bg-c-13);

      .update-timer {
        position: absolute;
        right: -100px;
        width: 1px;
      }

      &.basketball {
        border-top-left-radius: 0;
        border-top-right-radius: 0.04rem;
        border-bottom-right-radius: 0.04rem;
        border-bottom-left-radius: 0;
        // background-color: #FFB001;

        img {
          width: 0.21rem;
          height: auto;
          display: block;
        }
      }
    }
  }

  .video-wrapper {
    width: 100%;
    height: 100%;

    .video-playing-er {
      width: 100%;
      height: 100%;
    }
  }
}

.fat-box {
  overflow: hidden;
}

.timetop {
  height: 100%;
}

.video-playing-container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  &:deep(.dplayer-video-wrap .dplayer-video){
    object-fit: fill;
  }
}

.fit-box {
  padding-top: 0.15rem;
  padding-bottom: 0.19rem;
}

.score {
  width: 100%;
  height: 0.54rem;
  background: rgba(0,0,0, 0.6);
  background-size: 100% 100%;
  margin: auto;
  margin-top: 0.68rem;
  position: relative;
  border-radius: 0.04rem;

  .match-over {
    position: absolute;
    left: 50%;
    margin-left: -0.23rem;
    top: -0.43rem;
    width: 0.46rem;
    height: 0.24rem;
    line-height: 0.26rem;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 0.15rem;
    font-size: 0.1rem;
    font-weight: 600;
    color: #fff;
  }
}

.score-box {

  width: 0.36rem;
  height: 0.36rem;

  border-radius: 4px;
  font-size: 0.24rem;
  margin: 0 0.1rem;
  border-radius: 2px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  &.match-horse1,  &.match-dog1 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse1.png");
  }
  &.match-horse2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse2.png");
  }
  &.match-horse3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse3.png");
  }
  &.match-horse4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse4.png");
  }
  &.match-horse5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse5.png");
  }
  &.match-horse6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse6.png");
  }
  &.match-dog2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog2.png");
  }
  &.match-dog3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog3.png");
  }
  &.match-dog4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog4.png");
  }
  &.match-dog5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog5.png");
  }
  &.match-dog6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog6.png");
  }
  &.motorcycle5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_motorcycle5.png");
  }
  &.motorcycle6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_motorcycle6.png");
  }
  &.dirt_motorcycle1 {
  background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle1.png");
  }
  &.dirt_motorcycle2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle2.png");
  }
  &.dirt_motorcycle3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle3.png");
  }
  &.dirt_motorcycle4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle4.png");
  }
}

.mmp-status {
  margin-top: 0.3rem;
  margin-right: 0.12rem;

  .inner {
    display: flex;
    align-items: center;
    padding: 0 0.05rem 0 0.1rem;
    height: 0.24rem;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 0.08rem;

    .icon {
      width: 0.2rem;
      height: 0.2rem;
      margin-left: 6px;
      background: url($SCSSPROJECTPATH+"/image/png/clock.png") no-repeat;
      background-size: 100%;
    }
  }
}

.stage {

  font-size: 0.1rem;
  color: #F5F8FA;
  text-align: center;
}

.times {

  font-size: 0.1rem;
  color: #FEBE55;
  text-align: center;
  padding-left: 0.06rem;
}

/*  足球赛果 */
.football-score {
  background-color: rgba(0, 0, 0, 0.6);
  background-size: 100% 100%;
  height: 0.54rem;
  margin-top: 0.68rem;

  .name-wrap {
    flex: 1;
    display: flex;

    &.left {
      text-align: right;
      justify-content: flex-end;
    }

    img {
      width: 0.18rem;
      height: 0.18rem;
      margin: 0 0.04rem;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

.match-name {
  width: 1rem;

  font-size: 0.14rem;
  color: #FFFFFF;
}

.msc-wrap {
  width: 0.98rem;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  line-height: 1;

  .heng {
    font-size: 16px;
    margin: 0 .05rem .04rem .05rem;
  }

  .match-msc {
    font-size: 0.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    &.match-penalty {
      position: relative;
      width: 100%;
      font-size: .18rem;
      .icon-penalty {
        position: absolute;
        top: .03rem;
        left: -.18rem;
        width: .11rem;
        height: .11rem;
        background:  var(--q-color-com-img-bg-114) no-repeat center / cover;
      }
      .penalty-score {
        display: flex;
        align-items: center;
      }
    }
  }

  .match-end {
    text-align: center;
    font-size: 0.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.06rem;
    position: absolute;
    top: 0.36rem;
    background: rgba(0, 0, 0, 0.6);
    width: 0.46rem;
    height: 0.24rem;
    line-height: 0.24rem;
    border-radius: 0.04rem;
  }
}

/*************** 头部返回title开始 ***************-S*/
.title {
  height: 0.44rem;
  line-height: 0.44rem;
}

/*************** 头部返回title结束 ***************-E*/
/*************** 返回按钮弹性盒开始 ***************-S*/
.detail-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.15rem;
}

/*************** 返回按钮弹性盒结束 ***************-E*/
/*************** 返回按钮开始 ***************-S*/
.detail_back {
  width: 0.1rem;
  height: 0.18rem;
  background-image: var(--q-color-com-img-bg-3);
  background-size: 100% 100%;
}

/*************** 返回按钮结束 ***************-E*/
/*************** 联赛名开始 ***************-S*/
.text-style {

  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
}

/*************** 联赛名结束 ***************-E*/
/*************** 无注单开始 ***************-S*/
.no-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-95);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 无注单结束 ***************-E*/
/*************** 有注单开始 ***************-S*/
.have-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-85);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 有注单结束 ***************-E*/
/*************** 倒计时开始 ***************-S*/
.time-down {
  margin-top: 0.1rem;
}

/*************** 倒计时结束 ***************-E*/
</style>

<style lang="scss">
.dplayer-controller, .dplayer-menu, .dplayer-setting, .dplayer-bar-time,
.dplayer-notice, .dplayer-live-badge, .dplayer-mobile-play, .dplayer-mask,
.dplayer-controller-mask, .dplayer-info-panel {
  display: none !important;
}

.fat-box.ended {
  .dplayer-video-wrap {
    display: none !important;
  }
}
</style>
