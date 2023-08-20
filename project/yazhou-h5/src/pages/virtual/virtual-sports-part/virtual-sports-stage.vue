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
      <div v-if="!m_status || m_status == 0"
        class="row justify-center items-center timetop">
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
            <img  src="image/wwwassets/bw3/list/basket_ball_video_playing.svg" alt="">
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
            class="match-over">{{$root.$t('collect.match_end')}}</div>
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
            <div class="match-end">{{$root.$t('collect.match_end')}}</div>
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
              <!--  {{$root.$t('mmp[1][50]')}}:&nbsp;-->
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
        <div class="mmp-status row justify-center items-center" v-show="next_batch_title || next_match_time">
          <div class="inner">
            <div class="stage">{{next_batch_title}}</div>
            <div class="times">{{next_match_time}}</div>
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 虚拟篮球列表 -->
    <dateMatchList :current_match="current_match" :v_m_status="m_status"
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
// #TODO 
// import {mapGetters,mapMutations} from 'vuex';
import virtualSportsTimer from "project_path/pages/virtual/virtual_sports_part/virtual_sports_timer.vue";
import common from "project_path/mixins/constant/module/common.js";
import settleDialog from "project_path/components/footer_bar/settle_dialog.vue";
import loading from 'project_path/components/common/loading.vue';
import dateMatchList from 'project_path/pages/virtual/virtual_sports_part/date_match_list.vue'
import virtualBasketball from 'project_path/pages/details/children/virtual_basketball.vue'

import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_KEY } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "virtual_sports_stage",
  // #TODO mixins
  // mixins:[common],
  components:{
    'virtual-sports-timer':virtualSportsTimer,
    dateMatchList,
    settleDialog,
    loading,
    virtualBasketball
  },
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
  
  setup(props, evnet) {
    const data = reactive({
      // 事件集合
      emitters: [],
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
      // 初始化
      timer_super28: 0,
      timer_super29: 0,
      timer_super30: 0,
      set_loading_time: 0,
      // 视频播放器初始化时钟
      init_player_timeout: 0,
        // 完赛显示结束时钟
      match_ended_timer: 0,
        // 下一轮赛事开赛倒计时时钟
      next_match_timer: 0,
    })

    // 初始化
    timer_super28 = 0;
    timer_super29 = 0;
    timer_super30 = 0;
    set_loading_time = 0;
    // 视频播放器初始化时钟
    init_player_timeout = 0;
      // 完赛显示结束时钟
    match_ended_timer = 0;
      // 下一轮赛事开赛倒计时时钟
    next_match_timer = 0;
    // 轮号国际化字符串
    next_batch_no = $root.$t('virtual_sports.next_batch_no');
    // 期号国际化字符串
    next_date_no = $root.$t('virtual_sports.next_date_no');

    // #TODO EMIT 事件
    emitters = [
      useMittOn.on(MITT_KEY.EMIT_IS_ALL_END_NOTICE, all_ended_handle).off,
      useMittOn.on(MITT_KEY.EMIT_SYNC_VIDEO_DATA, sync_video_data_handle).off,
      useMittOn.on(MITT_KEY.EMIT_CURRENT_VIDEO_PROCESS_INITED, set_init_video_on).off,
      useMittOn.on(MITT_KEY.EMIT_VIRTUAL_MATCH_LOADING, set_loading_state).off,
      useMittOn.on(MITT_KEY.EMIT_PRE_COUNTING_EDN, pre_counting_end_handle).off,
      useMittOn.on(MITT_KEY.EMIT_VISIBILITYCHANGE_EVENT, visibilitychange_handle).off,
    ]
    // $root.$on(MITT_TYPES.EMIT_IS_ALL_END_NOTICE,all_ended_handle);
    // $root.$on(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,sync_video_data_handle);
    // $root.$on(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED,set_init_video_on);
    // $root.$on(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,set_loading_state);
    // $root.$on(MITT_TYPES.EMIT_PRE_COUNTING_EDN,pre_counting_end_handle)
    // $root.$on(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT,visibilitychange_handle)


    timer_super28 = setTimeout(() => {
      video_process_init_video();
    },500);
    set_loading_state();
    user_destroy_resource();

    onUnmounted(() => {
      emitters.map((x) => x())
    })
    // #TODO VUEX ACTIONS 
    // ...mapMutations([
    //   'set_settle_dialog_bool',
    //   'set_prev_v_sports_params',
    //   'set_is_show_menu'
    // ]),

    // #TODO VUEX getters
    // computed:{
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   current_league: 'get_current_league',
    //   current_batch: 'get_current_batch',
    //   video_process_data: 'get_video_process_data',
    //   get_is_show_settle_tab: 'get_is_show_settle_tab',
    //   get_prev_v_sports_params:'get_prev_v_sports_params',
    //   // 抽屉菜单显示状态
    //   right_menu_show: 'get_is_show_menu'
    // }),

    /**
     *@description 计算类名
     *@param {Number} rank_i 编号
     *@param {Number} sport_menu_type 球类type
     *@return {String} 类名
     */
    const get_rank_background = (rank_i, sport_menu_type) => {
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
    };
    /**
     *@description 监听页面可见性，当页面不可见时关闭视频声音
     */
    const visibilitychange_handle = () => {
      if (document.visibilityState == 'hidden' && video_voice && ($route.name == 'virtual_sports' || $route.name == 'virtual_sports_details')) {
        player.video.muted = true
        video_voice = false
      }
    };
    /***
     * 篮球早盘倒计时结束显示比分列表
     */
    const pre_counting_end_handle = () => {
      is_pre_counting_end = true;
    };
    /**
     * @description: 视频同步函数
     */
    const set_init_video_on = (video_data) => {
      video_process_init_video("v_p_d_got",video_data);
    };
    /**
    *@description:虚拟体育详情页返回
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    const detail_back = () => {
      $router.push({name: 'matchList'});
    };
    /**
    *@description:点击注单icon显示注单历史
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    const open = (position) => {
      useMittEmit(MITT_KEY.EMIT_CHANGE_RECORD_SHOW, true);
      // $root.$emit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true)
    };
    /**
    *@description:关闭投注记录显示
    *@param{Undefined}
    *@return{Undefined}undefined
    */
    const change_settle_status = () => {
      set_settle_dialog_bool(false)
      timer_super29 = setTimeout(() => {
        dialog = false
      }, 100);
    };
    /**
     * 所有赛事结束通知
     */
    const all_ended_handle = () => {
      next_match_time_counting_down();
      get_next_batch_no();
    };
    /**
     * 时钟计时结束
     */
    const timer_ended_handle = (mid) => {
      video_process_init_video();
      if(sub_menu_type == 1004){
        if(current_batch.mmp == 'INGAME'){
          $emit('time_ended','is_basketball_playing');
        }
        else{
          $emit('time_ended','is_basketball_pre');
        }

      }
      else{
        match_started = true;
        $emit('time_ended',mid);
      }
    };
    const user_destroy_resource = () => {
      if(player){
        player.destroy();
        player = null;
        video_process_init_video();
      }
    };
    /**
     * 初始化视频播放器
     */
    const init_video_player = () => {
      if(!current_match || !current_match.thirdMatchVideoUrl || m_status != 1 || video_play_stauts == 2) return;
      let video_wrap_dom = document.querySelector('.video-playing-er');

      if(!video_wrap_dom){
        timer_super30 = setTimeout(() => {
          init_video_player();
        },500);
        return;
      }
      if(player && video_play_stauts == 1){
        video_wrap_dom = null
        return;
      }
      player = new DPlayer({
        container:video_wrap_dom,
        live:true,
        autoplay:true,
        video:{
          url:current_match.thirdMatchVideoUrl,
          type:'hls',
          autoplay:true,
        }
      });
      if(current_match.mgt){
        let time_ = get_now_server()-Number(current_match.mgt);
        if(time_>0){
          player.seek(time_/1000);
          seek_to_target = time_/1000;
        }
      }
      video_voice = false
      // 监听视频可以播放
      player.on('canplaythrough', () => {
        if(!player) return;
        if(!video_voice){
          player.video.muted = true;
          player.video.setAttribute('autoplay','autoplay');
        }

        // 右侧菜单为显示状态则暂停视频播放
        if (!right_menu_show) {
          player.play()
        } else {
          player.pause()
        }
      });
      // 播放
      player.on('play',() => {
        video_play_stauts = 0;
      });
      // 播放中
      player.on('playing',() => {
        video_play_stauts = 1;
      });
      // 视频结束
      player.on('ended',() => {
        video_play_stauts = 2;
      });
      // 视频中断
      player.on('abort',() => {
        video_play_stauts = 2;
      });
      // 开始播放时,设置视频时长
      player.on('seeking',(res)=>{
        if(player && isFinite(player.video.duration) && player.video.duration>Number(current_match.totalTime))
        {
          try {
            current_match.totalTime=player.video.duration;
          } catch (error) {
            console.error(error);
          }
          if(set_current_match_assign){
            set_current_match_assign((current_match)=>{
            current_match.totalTime=player.video.duration;
          });
          }
        }
      })

      video_wrap_dom = null
    };
    /**
     * @Description 设置视频声音
     * @param {undefined} undefined
    */
    const set_video_voice = () => {
      player.video.muted = video_voice;
      video_voice = !video_voice
    };
    /**
     * 下一轮开赛倒计时
     */
    const next_match_time_counting_down = () => {
      if(video_process_data && video_process_data.nextTime){

        let start = Number(video_process_data.nextTime);
        let now = get_now_server();
        let sub_time = start - now;

        if(next_match_timer){
          clearTimeout(next_match_timer)
        }

        if(sub_time < 1){
          return
        }
        let time_obj = new Date(sub_time);
        let minutes = String(time_obj.getMinutes());
        let seconds = String(time_obj.getSeconds());
        minutes = minutes.padStart(2,'0');
        seconds = seconds.padStart(2,'0');
        next_match_time = `${minutes}'${seconds}"`;
        next_match_timer = setTimeout(() => {
          next_match_time_counting_down();
        },1000);
      }
    };
    /**
     * 获取下一轮赛事轮号或期号
     */
    const get_next_batch_no = () => {
      let result = '';
      if(video_process_data){
        let n_no = Number(video_process_data.nextNo);
        //展示下一轮号
        if(n_no){
          if(next_batch_no){
            result = next_batch_no.replace('%s',video_process_data.nextNo);
          } 
        }
        //展示下一期号
        else{
          let n_date_no = Number(video_process_data.nextBatchNo);
          if(n_date_no && next_date_no){
            result = next_date_no.replace('%s',video_process_data.nextBatchNo);
          }
        }
      }
      next_batch_title = result;
      clearTimeout(match_ended_timer);
      let delay_time = 30000;
      //虚拟篮球10秒后获取下一期
      if(sub_menu_type == 1004) {
        delay_time = 1000 * 14;
      }

      match_ended_timer = setTimeout(() => {
        $emit('update_next_batch_match');
      },delay_time);

    };
    /**
     * 同步视频数据到赛事
     * @param {Object} params 同步所需数据
     */
    const sync_video_data_handle = (params) => {
      if(current_match.mid == params.sport_data.mid){
        seek_to_target = params.upd_time;
        try {
          if(player && Math.abs(player.video.currentTime-params.upd_time)>=5)
          { // 对视频进行校对
            player.seek(seek_to_target);
          }
        } catch (error) {
          console.error(error)
        }
      }
    };
    /**
     * 获取赛马最终结果
     */
    const get_score_list = () => {
      let res = [];
      if(current_match && current_match.list && current_match.list.length){
        let last_win_obj = current_match.list[current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      if(virtual_result_rank_data.length && sub_menu_type == 1009) {
        let arr = lodash.sortBy(virtual_result_rank_data, 'ranking')
        for (const item of arr) {
          res.push(item.no)
        }
      }
      return res;
    };
    /**
     * 获取到视频进程数据
     */
    const video_process_init_video = (type_s) => {
      clearTimeout(init_player_timeout);
      init_player_timeout = setTimeout(() => {
        let new_ = current_match;
        let video_data = video_process_data;
        if(!new_ || !new_.mid || !video_data) return;
        if(new_.match_status == 0){
          seek_to_target = 0;
          if(player){
            player.destroy();
            player = null;
          }
        }
        else if(new_.match_status == 1){
          init_video_player();
        }
        else if(new_.match_status == 2){
          if(player){
            player.destroy();
            player = null;
          }
          seek_to_target = 0;
          next_match_time_counting_down();
          get_next_batch_no();
        }
        if(typeof new_.match_status == 'undefined'){
          random_inited = false;
        }
        if(type_s === 'is_process_update'){
          random_inited = true;
        }
        if(current_league){
          let p = lodash.cloneDeep(get_prev_v_sports_params);
          let p_key = `${sub_menu_type}-${current_league.menuId}`;
          p[p_key] = lodash.cloneDeep(new_);
          set_prev_v_sports_params(p);
        }
      },500);
    };
    /**
     * 设置数据加载状态
     */
    const set_loading_state = (v) => {
      let r = true;
      if(!current_match || !current_match.mid){
        r = true;
      }else{
        r = false;
      }
      virtual_match_list_data_loading = r;
      if(typeof v != 'undefined'){
        virtual_match_list_data_loading = v;
      }

      if(virtual_match_list_data_loading){
        clearTimeout(set_loading_time);
        set_loading_time = setTimeout(() => {
          virtual_match_list_data_loading = false;
        },1000);
      }
    };
    // 清除当前组件所有定时器
    const clear_timer = () => {
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
        clearTimeout(timer_arr[key])
        timer_arr[key] = null
      }
    };

    // 主队名
    const home_name = computed(() => {
      let result = '';
      if(current_match && current_match.teams && current_match.teams[0]){
        result = current_match.teams[0];
      }
      return result;
    });
    // 客队名
    const away_name = computed(() => {
      let result = '';
      if(current_match && current_match.teams && current_match.teams[1]){
        result = current_match.teams[1];
      }
      return result;
    });
    // 主队得分
    const home_score = computed(() => {
      let result = 0;
      if(current_match && current_match.home){
        result = current_match.home;
      }
      return result;
    });
    // 客队得分
    const away_score = computed(() => {
      let result = 0;
      if(current_match && current_match.away){
        result = current_match.away;
      }
      return result;
    });

    watch(
      () => props.virtual_result_rank_data.length,
      () => {
        get_score_list()
      }
    );
    watch(
      () => props.v_match_router_ente,
      () => {
        user_destroy_resource();
      }
    );
    watch(
      () => props.is_before_destroy,
      () => {
        if(player){
        player.destroy();
        player = null;
      }
      }
    );
    watch(
      () => props.match_process_update,
      (new_) => {
        if(new_){
          video_process_init_video();
        }
        set_loading_state();
        is_pre_counting_end = false;
      }
    );
    watch(
      () => props.m_status,
      (state) => {
        // 播放中且右侧菜单为显示状态， 则再次触发右侧菜单显示状态变更
        if (state === 1 && right_menu_show) {
          set_is_show_menu(false)
          $nextTick(() => {
            set_is_show_menu(true)
          })
        }

        if(state != 1){
          if(player){
            player.destroy();
            player = null;
          }
        }
        if(state == 2){
          seek_to_target = 0;
          next_match_time_counting_down();
          get_next_batch_no();
          if(sub_menu_type == 1004){
            $emit('basketball_end');
          }
        }
        video_process_init_video();
      }
    );
    watch(
      () => props.source,
      () => {
        video_process_init_video();
      }
    );

    // #TODO watch vuex 
    // watch(
      // if(current_match){
      //   video_process_init_video();
      // }
    // );
    // #TODO watch vuex 
    // watch(
    //   () => props.right_menu_show,
    //   (val) => {
      // 若视频未播放则提前退出
      // if (m_status !== 1) return

      // // 获取视频dom
      // let video = document.querySelector('.dplayer-video-wrap video')

      // if (!video) {
      //   // 当m_status为1且视频为黑屏加载状态时，隐藏视频外层容器,防止视频弹出遮挡右侧菜单
      //   if ($refs['video-playing-er']) {
      //     $refs['video-playing-er'].style.display = 'none'
      //   }
      // } else {
      //   $refs['video-playing-er'].style.display = 'block'
      // }

      // // 右侧菜单显示，并且视频为播放中,则暂停并隐藏视频
      // if (val && m_status === 1 && video) {
      //   video.style.display = 'none'
      //   player && player.pause()
      // } else if (!val && m_status === 1 && video) {
      //   video.style.display = 'block'
      //   player && player.play()
      // }

      // video = null
    //   }
    // );
    return {
      ...toRefs(data),
      get_rank_background,
      visibilitychange_handle,
      pre_counting_end_handle,
      set_init_video_on,
      detail_back,
      open,
      change_settle_status,
      all_ended_handle,
      timer_ended_handle,
      user_destroy_resource,
      init_video_player,
      set_video_voice,
      next_match_time_counting_down,
      get_next_batch_no,
      sync_video_data_handle,
      get_score_list,
      video_process_init_video,
      set_loading_state,
      clear_timer,
      home_name,
      away_name,
      home_score,
      away_score
    }
  }
});
</script>
<style scoped lang="scss">
  @import "../styles/virtual-sports-stage.scss";
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
