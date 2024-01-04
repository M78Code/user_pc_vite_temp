/*
 * @Description: 虚拟体育篮球相关组件
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
// import common from 'src/base-h5/vr/mixin/constant/module/common.js';
import { api_v_sports } from "src/api/index.js";
import { emitter, useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { get_now_server } from 'src/core/utils/common/module/other.js'

export default {
  // mixins:[common],
  props:{
    v_m_status:Number,
    current_match:Object,
    virtual_match_list:Array,
    source:String,
    match_status:String,
    is_pre_counting_end:Boolean,
  },
  data(){
    return {
      m_status:0,
      started_second:0,
      match_ended:null,
      counting_down_time:10,
      match_score_map:{},
      show_score_frame_i:0,
      match_current_frame:{},
      match_list:[],
      // 篮球线性进度宽度
      basketball_line_width: this.current_match.mmp == 'INGAME' ? 100 : 0,
      // 篮球赛前距离结束时间
      basketball_end_time: this.current_match.mmp == 'INGAME' ? '00:00' : '10:00',
    }
  },
  created(){
    // 定时器变量
    this.second_timeout=0;
    this.timer1=0;
    this.timer2=0;
    this.timer3=0;
    this.timer4=0;
    this.timer5=0;
    this.timer6=0;
    this.timer7=0;
    this.set_match_list()
    if(this.current_match.mmp == 'PREGAME'){
      this.m_status = 0
    }else{
      this.m_status = 2
    }
  },
  mounted(){
    if(this.current_match.mmp == 'PREGAME'){
      let rest_time = get_now_server() - this.current_match.mgt
      let _time = 0
      if(rest_time < 0){
        _time = Math.abs(rest_time) + 100
      }
      this.timer1 = setTimeout(() => {
        this.start_animation_b()
      },_time)
    }else{
      if(this.v_m_status == 2){
        this.set_match_ended_m();
        this.timer2 = setTimeout( () => {
          useMittEmit(MITT_TYPES.EMIT_INGAME_RESULT_SHOW_END);
        },14000)
      }
    }
  },
  methods:{
    /**
     * @Description 启动篮球橙色线性进度条动画
     * @param {undefined} undefined
    */
    start_animation_b(){
      this.timer3 = setTimeout(() => {
        // 延迟1秒  避免拿不到数据
        this.get_basketball_score()
      },1000)
      if(this.interval_id_b){
        clearInterval(this.interval_id_b)
      }
      let mgt = get_now_server()
      this.start_time = get_now_server() - this.current_match.mgt
      this.init_time_b = new Date() * 1
      this.interval_id_b = setInterval(()=>{
        this.animation_b()
      },16);
    },
    /**
     * @Description 篮球橙色线性进度条动画
     * @param {undefined} undefined
    */
    animation_b(){
      if(this.current_match.mmp == 'INGAME'){
        clearInterval(this.interval_id_b)
        return
      }
      let start_time = this.start_time + (new Date() * 1 - this.init_time_b)
      if(start_time < 6000){
        this.basketball_end_time = this.get_rest_time_str(600000 - parseInt(start_time * 90))
        this.basketball_line_width = parseInt(start_time / 6000 * 10000) / 100
        this.match_list.forEach( match => {
          let score = lodash.get(this.basketball_score,`${match.mid}.score`) || [0,0]
          match.home = Math.ceil(this.basketball_line_width / 100 * score[0])
          match.away = Math.ceil(this.basketball_line_width / 100 * score[1])
        })
      }else{
        this.basketball_end_time = "01:00"
        this.basketball_line_width = 100
        this.$emit('update_line_width', this.basketball_line_width)
        this.m_status = 1
        clearInterval(this.interval_id_b)
        this.timer4 = setTimeout( () => {
          useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
        },4000)
        this.timer5 = setTimeout( () => {
          useMittEmit(MITT_TYPES.EMIT_INGAME_RESULT_SHOW_END);
        },6000)
      }
    },
    /**
     * @Description 获取篮球赛前比分
     * @param {boolean} is_init 是否初始化
     * @param {undefined} undefined
    */
    get_basketball_score(){
      let mids = []
      this.match_list.forEach( match => {
        mids.push(match.mid)
      })
      let params = {
        mids:mids.join(',')
      }
      api_v_sports.get_v_match_score_api(params).then( res => {
        let code = lodash.get(res,'code')
        let basketball_score = lodash.get(res,'data')
        if(code == 200 && basketball_score[mids[0]]){
          lodash.each(basketball_score, item => {
            if(item.S1){
              item.score = item.S1.split(':')
            }
          })
          this.basketball_score = basketball_score
        }
      })
    },
    /**
     * @Description 获取剩余时间 字符串格式
     * @param {number} time 剩余时间毫秒
     * @param {string}
    */
    get_rest_time_str(time){
      let minute = parseInt(time / 1000 / 60).toString().padStart(2,0)
      let second = parseInt(time / 1000 % 60).toString().padStart(2,0)
      return `${minute}:${second}`
    },
    set_match_list(){
      let match_list = []
      this.virtual_match_list.forEach( match => {
        match_list.push(lodash.clone(match))
      })
      this.match_list = match_list
    },
    set_match_ended_m(){
      if(this.virtual_match_list){
        this.match_ended = this.virtual_match_list[0];
      }
      else{
        this.match_ended = this.current_match;
      }
      this.timer6 = setTimeout(() => {
        this.match_ended = null;
      },4000);
    },
    get_process_stage(){
      //开赛后6秒
      if(this.started_second < 6){
        // this.m_status = 0;
      }
      //开赛后6到10秒
      else if(this.started_second >= 6 && this.started_second < 10){
        // this.m_status = 1;
      }
      else
      {
        useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
        this.started_second = 0;
        return;
      }

      this.timer7 = setTimeout(() => {
        this.started_second++;
        this.get_process_stage();
      },1000);
    },
    /**
     * 比赛结束切换到下一轮倒计时
     */
    ended_counting_down(){
      if(this.counting_down_time > 0){
        this.counting_down_time--;
      }
      else{
        useMittEmit(MITT_TYPES.EMIT_INGAME_RESULT_SHOW_END);
        return;
      }
      clearTimeout(this.second_timeout);
      this.second_timeout = setTimeout(() => {
        this.ended_counting_down();
      },1000);
    },
    // 清除当前组件全部定时器
    clear_timer() {
      const timer_arr = [
          'timer1',
          'timer2',
          'timer3',
          'timer4',
          'timer5',
          'timer6',
          'timer7',
          'second_timeout',
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
      // 增加未被清除的定时器
      clearTimeout(this.interval_id_b);
      this.interval_id_b=null;
      clearTimeout(this.second_timeout);
      this.second_timeout=null;
    },
  },
  computed:{
  	get_current_batch(){return VR_CTR.state.current_batch}
  },
  unmounted () {
    this.clear_timer()

    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}