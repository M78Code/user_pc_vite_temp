/*
 * @Author: Supermark
 * @Date: 2021-06-19 22:38:24
 * @Description: 虚拟篮球详情页视频区域.赛事(进行中+完赛)组件
 */
import { api_v_sports } from "src/api/index.js";
// import common from 'src/base-h5/vr/mixin/constant/module/common.js';
import { get_now_server } from 'src/core/utils/common/module/other.js'

export default {
  name: "virtual_basketball",
  // mixins:[common],
  props: {
    // 赛事信息
    current_match:Object,
    basketball_status:Number,
  },
  data() {
    return {
      playing: false,
      // 篮球线性进度宽度
      basketball_line_width: this.current_match.mmp == 'INGAME' ? 100 : 0,
      basketball_line_width2:0,
      // 篮球赛前距离结束时间
      basketball_end_time: this.current_match.mmp == 'INGAME' ? '00:00' : '10:00',
      // 是否结束
      is_end:false,
      score:{
        home:this.current_match.homeScore,
        away:this.current_match.awayScore,
      },
    }
  },
  created() {
    // 延时器
    this.timer1_ = null;
    this.timer2_ = null;
    if(this.basketball_status == 2){
      this.is_end = true
      this.basketball_line_width2 = 100
      this.score = {
        home:this.current_match.home,
        away:this.current_match.away,
      }
      return
    }
    let rest_time = get_now_server() - this.current_match.mgt
    let _time = 0
    if(rest_time < 0){
      _time = Math.abs(rest_time) + 100
    }
    if(this.timer1_) { clearTimeout(this.timer1_) }
    this.timer1_ = setTimeout(() => {
      this.start_animation_b()
    },_time)
    if(this.current_match.mmp == 'PREGAME'){


    }else{
      this.get_virtual_video_process()
    }

  },
  methods: {
    /**
     * @Description 启动篮球橙色线性进度条动画
     * @param {undefined} undefined
    */
    start_animation_b(){
      if(this.current_match.mmp == 'PREGAME'){
        if(this.timer2_) { clearTimeout(this.timer2_) }
        this.timer2_ = setTimeout(() => {
          // 延迟1秒  避免拿不到数据
          this.get_basketball_score()
        },500)
      }
      if(this.interval_id_b){
        clearInterval(this.interval_id_b)
      }
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
      let start_time = this.start_time + (new Date() * 1 - this.init_time_b)

      if(this.current_match.mmp == 'INGAME'){
        if(start_time < 60000){
          this.basketball_line_width2 = parseInt(start_time / 60000 * 10000) / 100
          let home = parseInt(this.basketball_score.home || 0)
          let away = parseInt(this.basketball_score.away || 0)
          this.score.home = Math.ceil(this.basketball_line_width / 100 * Math.max(home - this.current_match.homeScore*1,0)) + this.current_match.homeScore
          this.score.away = Math.ceil(this.basketball_line_width / 100 * Math.max(away - this.current_match.awayScore*1,0)) + this.current_match.awayScore
        }else{
          this.basketball_line_width2 = 100
          this.is_end = true
          clearInterval(this.interval_id_b)
        }
      }else{
        if(start_time < 6000){
          this.basketball_end_time = this.get_rest_time_str(600000 - parseInt(start_time * 90))
          this.basketball_line_width = parseInt(start_time / 6000 * 10000) / 100

          let score = lodash.get(this.basketball_score,`${this.current_match.mid}.score`) || [0,0]
          this.score.home = Math.ceil(this.basketball_line_width / 100 * score[0])
          this.score.away = Math.ceil(this.basketball_line_width / 100 * score[1])

        }else{
          this.basketball_end_time = "01:00"
          this.basketball_line_width = 100
          clearInterval(this.interval_id_b)
        }
      }
    },
    /**
     * @Description 获取篮球赛前比分
     * @param {boolean} is_init 是否初始化
     * @param {undefined} undefined
    */
    get_basketball_score(){
      let params = {
        mids:this.current_match.mid
      }
      api_v_sports.get_v_match_score_api(params).then( res => {
        let code = lodash.get(res,'code')
        let basketball_score = lodash.get(res,'data')
        if(code == 200 && basketball_score[this.current_match.mid]){
          lodash.each(basketball_score, item => {
            if(item.S1){
              item.score = item.S1.split(':')
            }
          })
          this.basketball_score = basketball_score
          let rest_time = get_now_server() - this.current_match.mgt
          if(rest_time > 6000){
            let score = lodash.get(this.basketball_score,`${this.current_match.mid}.score`) || [0,0]
            this.score.home = score[0]
            this.score.away = score[1]
          }
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
    /**
     * @Description 获取滚球比分
     * @param {undefined} undefined
    */
    get_virtual_video_process(){
      let params = {
        batchNo: this.current_match.batchNo,
        csid: "1004",
        orderNo: this.current_match.orderNo,
        tid: this.current_match.tid
      }
      api_v_sports.get_virtual_video_process(params).then(res => {
        if(lodash.get(res,'code') == 200){
          let score_list = lodash.get(res,`data.detail.${this.current_match.mid}.list`) || []
          if(score_list.length > 0){
            this.basketball_score = score_list[score_list.length-1]

            let rest_time = get_now_server() - this.current_match.mgt
            if(rest_time > 60000){
              this.score.home = this.current_match.homeScore
              this.score.away = this.current_match.awayScore
            }
          }
        }
      });
    },
    // 清除当前组件所有定时器
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        'timer1_',
        'timer2_',
      ]

      // interval定时器列表
      const interval_timer_arr = [
        'interval_id_b'
      ]

      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }

      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
      }
    },
  },
  unmounted() {
    this.clear_timer()
  }
}