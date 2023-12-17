<template>
  <div class="virtual-sports-stage" :data-mid="'mid-'+current_match.mid" :data-mstatus="'status-'+m_status">
    <div class="banner" :class="{
      horse:current_sub_menu_id == 1011,
      dog: [1002, 1010, 1009].includes(current_sub_menu_id),
      basketball:current_sub_menu_id == 1004,
      motorcycle: [1010, 1009].includes(current_sub_menu_id),
      dirt_motorcycle:current_sub_menu_id == 1009
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
        <div v-if="[1001,1004].includes(current_sub_menu_id)"
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
          <div v-if="current_sub_menu_id != 1004" class="c-s-timer-w row justify-center items-center">
            {{current_match.show_time}}'
            <div class="update-timer">
              {{match_process_update}}
            </div>
          </div>
          <div v-if="current_sub_menu_id == 1004" class="c-s-timer-w basketball row justify-center items-center">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/basket_ball_video_playing.svg`" alt="">
          </div>
        </div>
      </div>
      <!-- 2:赛事结束显示对阵 -->
      <div v-if="m_status == 2 && get_score_list().length && current_sub_menu_id != 1004" class="fat-box ended">
      <!--<div  class="fat-box ended">-->

        <!-- 赛马/赛狗赛事结束对阵 -->
        <div v-if="![1001,1004].includes(current_sub_menu_id)" class="score row justify-center items-center">
          <!-- 已完赛 -->
          <div :style="{visibility: ![1002, 1011, 1010, 1009].includes(current_sub_menu_id) ? 'hidden':'visible'}"
            v-if="source != 'detail'"
            class="match-over">{{ i18n_t('collect.match_end')}}</div>
          <div v-for="(score,i) in get_score_list()" :key="i">
            <div class="score-box row justify-center items-center" :class="get_rank_background(score,current_sub_menu_id)"></div>
          </div>
        </div>
        <!-- 足球赛事结束对阵 -->
        <div v-else class="football-score row justify-center items-center">
          <div class="name-wrap left">
            <div class="match-name ellipsis">{{home_name}}</div>
            <img v-img="([lodash.get(current_match,'mhlu'), lodash.get(current_match,'frmhn')])" />
          </div>
          <div class="msc-wrap yb-flex-center">
            <div class="match-end">{{ i18n_t('collect.match_end')}}</div>
            <div class="match-msc">
              <span>{{home_score}}</span>
              <span class="heng">-</span>
              <span>{{away_score}}</span>
            </div>
            <div
                v-show="current_match && (current_match.s170_home > 0 || current_match.s170_away > 0)"
                class="match-msc match-penalty" >
              <!--<span>-->
              <!--  {{ i18n_t('mmp[1][50]')}}:&nbsp;-->
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
      v-if="basketball_status == 0 && current_sub_menu_id == 1004 && (match_started && !is_video_playing || m_status == 2 || is_pre_counting_end)" />
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
import virtualSportsTimer from "src/base-h5/components/virtual/virtual-sports-timer.vue";
import settleDialog from "src/base-h5/components/footer-bar/settle-dialog.vue";
import loading from 'src/base-h5/components/common/loading.vue';
import dateMatchList from 'src/base-h5/components/virtual/date-match-list.vue'
import virtualBasketball from 'src/base-h5/components/details/children/virtual-basketball.vue'
import VirtualData from 'src/core/match-list-h5/virtual-sports/virtual-data.js'
import VirtualVideo from 'src/core/match-list-h5/virtual-sports/virtual-video.js'

import lodash from "lodash"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { get_now_server } from 'src/core/utils/common/module/other.js'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "virtual-sports-stage",
  components:{
    virtualSportsTimer,
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
  data() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  
  setup(props, evnet) {
    const state = reactive({
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
    })

    // 初始化
    let timer_super28 = 0;
    let timer_super29 = 0;
    let timer_super30 = 0;
    let set_loading_time = 0;
    // 视频播放器初始化时钟
    let init_player_timeout = 0;
      // 完赛显示结束时钟
    let match_ended_timer = 0;
      // 下一轮赛事开赛倒计时时钟
    let next_match_timer = 0;
    // 轮号国际化字符串
    let next_batch_no = i18n_t('virtual_sports.next_batch_no');
    // 期号国际化字符串
    let next_date_no = i18n_t('virtual_sports.next_date_no');

    // #TODO EMIT 事件
    let emitters = []

    const current_sub_menu_id = computed(() => {
      return Number(lodash.get(VirtualData.current_sub_menu, 'menuId', 0))
    })
    onMounted(() => {
      set_loading_state();
      user_destroy_resource();
      timer_super28 = setTimeout(() => {
        get_current_match_video_process();
      },500);
      emitters = [
        useMittOn(MITT_TYPES.EMIT_IS_ALL_END_NOTICE, all_ended_handle).off,
        useMittOn(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, sync_video_data_handle).off,
        useMittOn(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED, set_init_video_on).off,
        useMittOn(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING, set_loading_state).off,
        useMittOn(MITT_TYPES.EMIT_PRE_COUNTING_EDN, pre_counting_end_handle).off,
        useMittOn(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, visibilitychange_handle).off,
      ]
    })
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
    //   current_league: 'get_current_league',
    //   current_batch: 'get_current_batch',
    //   VirtualVideo.video_process_data: 'get_video_process_data',
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
      if (document.visibilityState == 'hidden' && state.video_voice && ($route.name == 'virtual_sports' || $route.name == 'virtual_sports_details')) {
        state.player.video.muted = true
        state.video_voice = false
      }
    };
    /***
     * 篮球早盘倒计时结束显示比分列表
     */
    const pre_counting_end_handle = () => {
      state.is_pre_counting_end = true;
    };
    /**
     * @description: 视频同步函数
     */
    const set_init_video_on = (video_data) => {
      VirtualVideo.get_current_match_video_process("v_p_d_got",video_data);
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
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
      // useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true)
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
      get_current_match_video_process();
      if(current_sub_menu_id.value == 1004){
        if(current_batch.mmp == 'INGAME'){
          $emit('time_ended','is_basketball_playing');
        }
        else{
          $emit('time_ended','is_basketball_pre');
        }

      }
      else{
        state.match_started = true;
        $emit('time_ended',mid);
      }
    };
    const user_destroy_resource = () => {
      if(state.player){
        state.player.destroy();
        state.player = null;
        get_current_match_video_process();
      }
    };
    /**
     * 初始化视频播放器
     */
    const init_video_player = () => {
      if(!props.current_match|| !props.current_match.thirdMatchVideoUrl || m_status != 1 || state.video_play_stauts == 2) return;
      let video_wrap_dom = document.querySelector('.video-playing-er');

      if(!video_wrap_dom){
        timer_super30 = setTimeout(() => {
          init_video_player();
        },500);
        return;
      }
      if(state.player && state.video_play_stauts == 1){
        video_wrap_dom = null
        return;
      }
      state.player = new DPlayer({
        container:video_wrap_dom,
        live:true,
        autoplay:true,
        video:{
          url:props.current_match.thirdMatchVideoUrl,
          type:'hls',
          autoplay:true,
        }
      });
      if(props.current_match.mgt){
        let time_ = get_now_server()-Number(props.current_match.mgt);
        if(time_>0){
          state.player.seek(time_/1000);
          state.seek_to_target = time_/1000;
        }
      }
      state.video_voice = false
      // 监听视频可以播放
      state.player.on('canplaythrough', () => {
        if(!state.player) return;
        if(!state.video_voice){
          state.player.video.muted = true;
          state.player.video.setAttribute('autoplay','autoplay');
        }

        // 右侧菜单为显示状态则暂停视频播放
        if (!right_menu_show) {
          state.player.play()
        } else {
          state.player.pause()
        }
      });
      // 播放
      state.player.on('play',() => {
        state.video_play_stauts = 0;
      });
      // 播放中
      state.player.on('playing',() => {
        state.video_play_stauts = 1;
      });
      // 视频结束
      state.player.on('ended',() => {
        state.video_play_stauts = 2;
      });
      // 视频中断
      state.player.on('abort',() => {
        state.video_play_stauts = 2;
      });
      // 开始播放时,设置视频时长
      state.player.on('seeking',(res)=>{
        if(state.player && isFinite(state.player.video.duration) && state.player.video.duration>Number(props.current_match.totalTime))
        {
          try {
            props.current_match.totalTime=state.player.video.duration;
          } catch (error) {
            console.error(error);
          }
          if(set_current_match_assign){
            set_current_match_assign((current_match)=>{
            props.current_match.totalTime=state.player.video.duration;
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
      state.player.video.muted = state.video_voice;
      state.video_voice = !state.video_voice
    };
    /**
     * 下一轮开赛倒计时
     */
    const next_match_time_counting_down = () => {
      if(VirtualVideo.video_process_data && VirtualVideo.video_process_data.nextTime){

        let start = Number(VirtualVideo.video_process_data.nextTime);
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
        state.next_match_time = `${minutes}'${seconds}"`;
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
      if(VirtualVideo.video_process_data){
        let n_no = Number(VirtualVideo.video_process_data.nextNo);
        //展示下一轮号
        if(n_no){
          if(next_batch_no){
            result = next_batch_no.replace('%s',VirtualVideo.video_process_data.nextNo);
          }
        }
        //展示下一期号
        else{
          let n_date_no = Number(VirtualVideo.video_process_data.nextBatchNo);
          if(n_date_no && next_date_no){
            result = next_date_no.replace('%s',VirtualVideo.video_process_data.nextBatchNo);
          }
        }
      }
      state.next_match_time = result;
      clearTimeout(match_ended_timer);
      let delay_time = 30000;
      //虚拟篮球10秒后获取下一期
      if(current_sub_menu_id.value == 1004) {
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
      if(props.current_match.mid == params.sport_data.mid){
        state.seek_to_target = params.upd_time;
        try {
          if(state.player && Math.abs(state.player.video.currentTime-params.upd_time)>=5)
          { // 对视频进行校对
            state.player.seek(state.seek_to_target);
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
      if(props.current_match && props.current_match.list && props.current_match.list.length){
        let last_win_obj = props.current_match.list[props.current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      if(virtual_result_rank_data.length && current_sub_menu_id.value == 1009) {
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
    const get_current_match_video_process = (type_s) => {
      clearTimeout(init_player_timeout);
      init_player_timeout = setTimeout(() => {
        let new_ = props.current_match;
        let video_data = VirtualVideo.video_process_data;
        if(!new_ || !new_.mid || !video_data) return;
        if(new_.match_status == 0){
          state.seek_to_target = 0;
          if(state.player){
            state.player.destroy();
            state.player = null;
          }
        }
        else if(new_.match_status == 1){
          init_video_player();
        }
        else if(new_.match_status == 2){
          if(state.player){
            state.player.destroy();
            state.player = null;
          }
          state.seek_to_target = 0;
          next_match_time_counting_down();
          get_next_batch_no();
        }
        if(typeof new_.match_status == 'undefined'){
          state.random_inited = false;
        }
        if(type_s === 'is_process_update'){
          state.random_inited = true;
        }
        if(current_league){
          let p = lodash.cloneDeep(get_prev_v_sports_params);
          let p_key = `${current_sub_menu_id.value}-${current_league.menuId}`;
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
      if(!props.current_match || !props.current_match.mid){
        r = true;
      }else{
        r = false;
      }
      state.virtual_match_list_data_loading = r;
      if(typeof v != 'undefined'){
        state.virtual_match_list_data_loading = v;
      }

      if(state.virtual_match_list_data_loading){
        clearTimeout(set_loading_time);
        set_loading_time = setTimeout(() => {
          state.virtual_match_list_data_loading = false;
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
      if(props.current_match && props.current_match.teams && props.current_match.teams[0]){
        result = props.current_match.teams[0];
      }
      return result;
    });
    // 客队名
    const away_name = computed(() => {
      let result = '';
      if(props.current_match && props.current_match.teams && props.current_match.teams[1]){
        result = props.current_match.teams[1];
      }
      return result;
    });
    // 主队得分
    const home_score = computed(() => {
      let result = 0;
      if(props.current_match && props.current_match.home){
        result = props.current_match.home;
      }
      return result;
    });
    // 客队得分
    const away_score = computed(() => {
      let result = 0;
      if(props.current_match && props.current_match.away){
        result = props.current_match.away;
      }
      return result;
    });

    watch( () => props.virtual_result_rank_data.length, () => {
        get_score_list()
      }
    );
    watch( () => props.v_match_router_ente, () => {
        user_destroy_resource();
      }
    );
    watch(
      () => props.is_before_destroy,
      () => {
        if(state.player){
        state.player.destroy();
        state.player = null;
      }
      }
    );
    watch(
      () => props.match_process_update,
      (new_) => {
        if(new_){
          get_current_match_video_process();
        }
        set_loading_state();
        state.is_pre_counting_end = false;
      }
    );
    watch( () => props.m_status, (state) => {
        // 播放中且右侧菜单为显示状态， 则再次触发右侧菜单显示状态变更
        if (state === 1 && right_menu_show) {
          set_is_show_menu(false)
          $nextTick(() => {
            set_is_show_menu(true)
          })
        }

        if(state != 1){
          if(state.player){
            state.player.destroy();
            state.player = null;
          }
        }
        if(state == 2){
          state.seek_to_target = 0;
          next_match_time_counting_down();
          get_next_batch_no();
          if(current_sub_menu_id.value == 1004){
            VirtualData.get_score_basket_ball();
          }
        }
        get_current_match_video_process();
      }
    );
    watch( () => props.source,
      () => {
        get_current_match_video_process();
      }
    );

    // #TODO watch vuex
    // watch(
      // if(props.current_match){
      //   get_current_match_video_process();
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
      //   state.player && state.player.pause()
      // } else if (!val && m_status === 1 && video) {
      //   video.style.display = 'block'
      //   state.player && state.player.play()
      // }

      // video = null
    //   }
    // );
    return {
      ...toRefs(state),
      get_rank_background,
      visibilitychange_handle,
      pre_counting_end_handle,
      set_init_video_on,
      detail_back,
      open,
      current_sub_menu_id,
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
      get_current_match_video_process,
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
  @import "./styles/virtual-sports-stage-2.scss";
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