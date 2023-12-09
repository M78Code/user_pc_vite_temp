<!--
 * @Author: Cronus
 * @Date: 2021-06-16 21:47:25
 * @Description:
-->
<template>
  <div class="v-match-l-wrapper">
    <div class="v-m-container" v-if="!match_ended">
      <!--  -->
      <div class="date-title" v-if="m_status != 2 && !is_pre_counting_end">
        {{get_current_batch.no}}
      </div>
      <!-- 滚球结束倒计时 -->
      <div class="date-title row justify-center items-center end">
        <div class="d-t-c" v-html="$root.$t('virtual_sports.match_status.x_to_ended').replace('%s',basketball_end_time)"></div>
      </div>

      <div class="data-wrapper-list">
        <div class="d-h-w">
          <div class="stage-wrapper row justify-center">
            <div class="s-w-title" :class="{focus:(status - 1) <= m_status}" v-for="(status, index) of 3" :key="index">
              {{$t(`virtual_sports.match_status[${status-1}]`)}}
            </div>
          </div>
          <!-- 线性进度 -->
          <div class="line-wrap">
            <div class="round active"></div>
            <div class="line">
              <div class="inner-line" :style="`width:${basketball_line_width}%`"></div>
            </div>
            <div class="round" :class="{active:basketball_line_width == 100 || current_match.mmp == 'INGAME'}"></div>
            <div class="line">
              <div class="inner-line" v-if="m_status == 2" style="width:100%"></div>
            </div>
            <div class="round" :class="{active:m_status == 2}"></div>
          </div>
        </div>
        <!-- 列表页 -->
        <div class="data-c-wrapper" v-if="match_list">
          <div class="row d-row-item" v-for="(item,i) of match_list" :key="i"
            v-show="i < 6">
            <div class="row team justify-between">
              <div class="league-avatar">
                <team-img v-if="item.mhlu" :csid="item.csid"
                  :type="1" :url="item.mhlu" :fr="item.frman[1]" :size="20" >
                </team-img>
              </div>
              <div>
                {{item.teams[0]}}
              </div>
              <div class="score">
                {{item.home}}
              </div>
            </div>
            <div class="row team justify-between">
              <div class="score">
                {{item.away}}
              </div>
              <div>
                {{item.teams[1]}}
              </div>
              <div class="league-avatar">
                <team-img v-if="item.malu" :csid="item.csid"
                  :type="1" :url="item.malu" :fr="item.frman[1]" :size="22" >
                </team-img>
              </div>
            </div>
          </div>
        </div>
        <!-- 单个赛事 -->
        <date-match-sdata v-if="source == 'detail'"
          :match_ended="current_match" source='end_0' />
        <!-- 单场赛事结束 -->
        <date-match-sdata v-if="source == 'detail'" :match_ended="match_ended" />
      </div>
    </div>
    <!-- 单场赛事结束 -->
    <date-match-sdata :match_ended="match_ended" />

  </div>
</template>

<script>
import { api_virtual } from "src/api/index.js";
import teamImg from 'src/base-h5/components/details/team-img.vue';
import dateMatchSdata from 'src/base-h5/components/virtual/date-match-s-data.vue'
export default {
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
      get_current_batch:0,
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
      let rest_time = this.get_now_server() - this.current_match.mgt
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
      let mgt = this.get_now_server()
      this.start_time = this.get_now_server() - this.current_match.mgt
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
      api_virtual.get_v_match_score_api(params).then( res => {
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

  },
  components:{
    'date-match-sdata':dateMatchSdata,
    'team-img':teamImg,
  },
  destroyed () {
    this.clear_timer()

    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}
</script>

<style lang="scss" scoped>
.v-match-l-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  .v-m-container {
    width: 3rem;
    margin: 0 auto;
    padding-top: 0.04rem;

    .date-title {
      width: 1.2rem;
      height: 0.18rem;
      line-height: 0.18rem;
      text-align: center;
      font-size: 0.1rem;
      color: #ffffff;
      margin: 0 auto;
      border-radius: 0.1rem;
      background-color: #FF0000;

      &.end {
        background-color: #5E88A7;
      }

      .d-t-c {
        margin-right: 0.05rem;
      }
    }

    .data-wrapper-list {
      width: 100%;
      margin-top: 0.04rem;
      border-radius: 0.08rem;
      overflow: hidden;

      .d-h-w {
        width: 100%;
        height: 0.32rem;
        background-color: #363F4F;

        .stage-wrapper {
          width: 100%;
          height: 0.21rem;
          color: #999999;

          .s-w-title {
            width: 0.74rem;
            font-size: 0.1rem;
            display: flex;
            justify-content: center;
            align-items: flex-end;

            &.focus {
              // color: #FFB001;
            }
          }
        }

        .stage-process {
          width: 100%;
          height: 0.07rem;
        }

        .line-wrap {
          display: flex;
          height: 0.07rem;
          align-items: center;
          justify-content: center;

          .round {
            width: 0.07rem;
            height: 0.07rem;
            border-radius: 50%;
            background-color: #999999;

            &.active {
              // background-color: #ffB001;
            }
          }

          .line {
            height: 0.01rem;
            background-color: #999999;
            width: 0.68rem;

            .inner-line {
              height: 100%;
              // background-color: #ffB001;
            }
          }
        }
      }

      .data-c-wrapper {
        width: 100%;
        height: auto;
        font-size: 0.1rem;
        padding: 0.06rem 0;
        background-color: rgba(255, 255, 255, 0.9);
      }

      .d-row-item {
        width: 100%;
        height: 0.2rem;
        padding: 0.02rem 0;

        .team {
          width: 50%;
          height: 0.16rem;
          padding-left: 0.12rem;
          padding-right: 0.03rem;

          .league-avatar {
            width: 0.16rem;
            height: 0.16rem;
            overflow: hidden;

            &:deep(.team-img) {
              width: 100%;
              height: 100%;

              .img-style {
                width: 100%;
                height: 100%;
              }
            }
          }

          .score {
            width: 0.27rem;
            height: 0.16rem;
            background-color: #17191D;
            color: #ffffff;
            line-height: 0.16rem;
            text-align: center;
          }

          &:last-child {
            padding-left: 0.03rem;
            padding-right: 0.12rem;
          }
        }
      }
    }
  }

  .match-single-end {
    width: 100%;
    left: 0;
    top: 0.42rem;
    height: auto;
    position: absolute;

    .i-c-m-s-w {
      width: 3rem;
      height: 0.78rem;
      margin: auto;

      .i-c-title {
        min-width: 1.2rem;
        height: 0.18rem;
        flex-wrap: nowrap;

        .angle {
          width: 0.13rem;
          height: 0.18rem;
        }

        .i-c-w {
          width: 0.94rem;
          height: 0.18rem;
          line-height: 0.18rem;
          text-align: center;
          // background-color: #FFB001;
          color: #000000;
          font-size: 0.12rem;
        }
      }

      .score-wrapper {
        width: 3rem;
        height: 0.6rem;
        border-radius: 0.04rem;
        background-color: rgba(255, 255, 255, 0.9);

        .s-c-inner-w {
          width: 3.3rem;
          height: 0.3rem;
          font-size: 0.14rem;
          flex-shrink: 0;

          .row {
            width: 50%;

            & :deep(.team-img-s) {
              margin: 0;
            }

            &:first-child {
              padding-right: 0.03rem;
            }

            &:last-child {
              padding-right: 0.03rem;
            }
          }

          .team-name {
            color: #000000;
          }

          .t-score {
            width: 0.36rem;
            height: 0.28rem;
            background-color: #17191D;
            color: #ffffff;
            line-height: 0.28rem;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
