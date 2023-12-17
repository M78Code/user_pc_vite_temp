<template>
  <div class="vir-bask">
    <!-- 期数区域 -->
    <div class="vir-bask-head" v-if="current_match.mmp == 'INGAME' && !is_end">
      <div>{{current_match.no}}</div>&nbsp;
      <div>{{i18n_t('virtual_sports.match_status.playing')}}</div>
    </div>
    <div class="vir-bask-head vir-end" v-if="current_match.mmp != 'INGAME'" v-html="i18n_t('virtual_sports.match_status.x_to_ended').replace('%s',basketball_end_time)"></div>
    <!-- 进度区域 -->
    <div class="progress" v-if="!is_end">
      <!-- 中文进度 -->
      <div class="row text-pro">
        <div class="col">{{i18n_t('virtual_sports.match_status.0')}}</div>
        <div class="col">{{i18n_t('virtual_sports.match_status.1')}}</div>
        <div class="col">{{i18n_t('virtual_sports.match_status.2')}}</div>
      </div>
      <!-- 线性进度 -->
      <div class="line-wrap">
        <div class="round active"></div>
        <div class="line">
          <div class="inner-line" :style="`width:${basketball_line_width}%`"></div>
        </div>
        <div class="round" :class="{active:basketball_line_width == 100 || current_match.mmp == 'INGAME'}"></div>
        <div class="line">
          <div class="inner-line" :style="`width:${basketball_line_width2}%`"></div>
        </div>
        <div class="round" :class="{active:basketball_line_width2 == 100}"></div>
      </div>
    </div>
    <!-- 比赛结束 -->
    <div v-if="is_end" class="vir-ending">{{i18n_t('virtual_sports.match_status.ended')}}</div>
    <!-- 对阵区域 -->
    <div class="against" :class="0 ? 'against-area':'against-area-end'">
      <!-- 主队icon -->
      <team-img :type="0" :csid="current_match.csid" :url="current_match.mhlu" :fr="current_match.frmhn" :size="22" />
      <!-- 主队名 -->
      <div class="vir-name">{{current_match.teams[0]}}</div>
      <!-- 主队得分 -->
      <div class="home-num" :class="0 ? 'home-number':'home-number-end'">{{score.home}}</div>
      <!-- 客队得分 -->
      <div class="away-num" :class="0 ? 'away-number': 'away-number-end'">{{score.away}}</div>
      <!-- 客队名 -->
      <div class="vir-name">{{current_match.teams[1]}}</div>
      <!-- 客队icon -->
      <team-img :type="1" :csid="current_match.csid" :url="current_match.malu" :fr="current_match.frman" :size="22" />
    </div>
  </div>
</template>

<script>
import { api_virtual } from "src/api/index.js";
// #TODO mixins
// import common from 'src/project/mixins/constant/module/common.js';
import { get_now_server } from 'src/core/utils/common/module/other.js'
import teamImg from "src/components/details/team-img/team-img-template-1/team-img.vue";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { t } from "src/boot/i18n.js";;
//国际化


export default defineComponent({
  name: "virtual_basketball",
  // #TODO mixins
  // mixins:[common],
  components:{
    teamImg,
  },
  props: {
    // 赛事信息
    current_match:Object,
    basketball_status:Number,
  },
  setup(props, evnet) {
    let data = reactive({
      playing: false,
      // 篮球线性进度宽度
      basketball_line_width: current_match.mmp == 'INGAME' ? 100 : 0,
      basketball_line_width2:0,
      // 篮球赛前距离结束时间
      basketball_end_time: current_match.mmp == 'INGAME' ? '00:00' : '10:00',
      // 是否结束
      is_end:false,
      score:{
        home:current_match.homeScore,
        away:current_match.awayScore,
      },
    });

    onMounted(() => {
      // 原 created
      // 延时器
      timer1_ = null;
      timer2_ = null;
      if(basketball_status == 2){
        is_end = true
        basketball_line_width2 = 100
        score = {
          home:current_match.home,
          away:current_match.away,
        }
        return
      }
      let rest_time = get_now_server() - current_match.mgt
      let _time = 0
      if(rest_time < 0){
        _time = Math.abs(rest_time) + 100
      }
      if(timer1_) { clearTimeout(timer1_) }
      timer1_ = setTimeout(() => {
        start_animation_b()
      },_time)
      if(current_match.mmp == 'PREGAME'){


      }else{
        get_virtual_video_process()
      }
    });
    /**
     * @Description 启动篮球橙色线性进度条动画
     * @param {undefined} undefined
    */
    const start_animation_b = () => {
      if(current_match.mmp == 'PREGAME'){
        if(timer2_) { clearTimeout(timer2_) }
        timer2_ = setTimeout(() => {
          // 延迟1秒  避免拿不到数据
          get_basketball_score()
        },500)
      }
      if(interval_id_b){
        clearInterval(interval_id_b)
      }
      start_time = get_now_server() - current_match.mgt
      init_time_b = new Date() * 1
      interval_id_b = setInterval(()=>{
        animation_b()
      },16);
    };
    /**
     * @Description 篮球橙色线性进度条动画
     * @param {undefined} undefined
    */
    const animation_b = () => {
      let start_time = start_time + (new Date() * 1 - init_time_b)

      if(current_match.mmp == 'INGAME'){
        if(start_time < 60000){
          basketball_line_width2 = parseInt(start_time / 60000 * 10000) / 100
          let home = parseInt(basketball_score.home || 0)
          let away = parseInt(basketball_score.away || 0)
          score.home = Math.ceil(basketball_line_width / 100 * Math.max(home - current_match.homeScore*1,0)) + current_match.homeScore
          score.away = Math.ceil(basketball_line_width / 100 * Math.max(away - current_match.awayScore*1,0)) + current_match.awayScore
        }else{
          basketball_line_width2 = 100
          is_end = true
          clearInterval(interval_id_b)
        }
      }else{
        if(start_time < 6000){
          basketball_end_time = get_rest_time_str(600000 - parseInt(start_time * 90))
          basketball_line_width = parseInt(start_time / 6000 * 10000) / 100

          let score = _.get(basketball_score,`${current_match.mid}.score`) || [0,0]
          score.home = Math.ceil(basketball_line_width / 100 * score[0])
          score.away = Math.ceil(basketball_line_width / 100 * score[1])

        }else{
          basketball_end_time = "01:00"
          basketball_line_width = 100
          clearInterval(interval_id_b)
        }
      }
    };
    /**
     * @Description 获取篮球赛前比分
     * @param {boolean} is_init 是否初始化
     * @param {undefined} undefined
    */
    const get_basketball_score = () => {
      let params = {
        mids:current_match.mid
      }
      api_virtual.get_v_match_score_api(params).then( res => {
        let code = _.get(res,'code')
        let basketball_score = _.get(res,'data')
        if(code == 200 && basketball_score[current_match.mid]){
          _.each(basketball_score, item => {
            if(item.S1){
              item.score = item.S1.split(':')
            }
          })
          basketball_score = basketball_score
          let rest_time = get_now_server() - current_match.mgt
          if(rest_time > 6000){
            let score = _.get(basketball_score,`${current_match.mid}.score`) || [0,0]
            score.home = score[0]
            score.away = score[1]
          }
        }
      })
    };
    /**
     * @Description 获取剩余时间 字符串格式
     * @param {number} time 剩余时间毫秒
     * @param {string}
    */
    const get_rest_time_str = (time) => {
      let minute = parseInt(time / 1000 / 60).toString().padStart(2,0)
      let second = parseInt(time / 1000 % 60).toString().padStart(2,0)
      return `${minute}:${second}`
    };
    /**
     * @Description 获取滚球比分
     * @param {undefined} undefined
    */
    const get_virtual_video_process = () => {
      let params = {
        batchNo: current_match.batchNo,
        csid: "1004",
        orderNo: current_match.orderNo,
        tid: current_match.tid
      }
      api_virtual.get_virtual_video_process(params).then(res => {
        if(_.get(res,'code') == 200){
          let score_list = _.get(res,`data.detail.${current_match.mid}.list`) || []
          if(score_list.length > 0){
            basketball_score = score_list[score_list.length-1]

            let rest_time = get_now_server() - current_match.mgt
            if(rest_time > 60000){
              score.home = current_match.homeScore
              score.away = current_match.awayScore
            }
          }
        }
      });
    };
    // 清除当前组件所有定时器
    const clear_timer = () => {
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
    };
    onUnmounted(() => {
      clear_timer()
    })
    return {
      ...toRefs(data),
      start_animation_b,
      animation_b,
      get_basketball_score,
      get_rest_time_str,
      get_virtual_video_process,
      clear_timer,
    }
  }
})
</script>
<style lang="scss" scoped>
.vir-bask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: 3;
}

.vir-bask-head {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2rem;
  height: 0.18rem;
  margin: 4px auto;
  background-color: #D4080B;
  border-radius: 8px;
  font-size: 0.1rem;
  color: var(--q-gb-t-c-18);

  &.vir-end {
    background-color: #5E88A7;
  }
}

.progress {
  width: 3rem;
  height: 0.32rem;
  margin: 0 auto;
  background: rgba(36, 45, 62, 0.9);
  border-radius: 4px 4px 0 0;
}

.vir-ending {
  width: 1.2rem;
  height: 0.18rem;
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  margin-top: 0.52rem;
  color: var(--q-gb-t-c-18);
  font-weight: 600;

  background-size: 100% 100%;
}

.text-pro {
  width: 2.3rem;
  margin: 0 auto;
  text-align: center;
  padding-top: 7px;
  font-size: 0.1rem;
  color: var(--q-color-fs-color-50);
  line-height: 0.1rem;
}

.line-wrap {
  width: 1.6rem;
  margin: auto;
  display: flex;
  height: 0.07rem;
  align-items: center;
  justify-content: center;
  margin-top: 5px;

  .round {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #999999;

    &.active {
      background-color: var(--q-gb-bd-c-13);
    }
  }

  .line {
    height: 0.01rem;
    background-color: #999999;
    flex: 1;

    .inner-line {
      height: 100%;
      background-color: var(--q-gb-bd-c-13);
    }
  }
}

.against {
  width: 3rem;
  height: 0.6rem;
  margin: auto;
  background: var(--q-color-com-bg-color-12);
  display: flex;
  align-items: center;
}

.against-area {
  border-radius: 0 0 4px 4px;
}

.against-area-end {
  border-radius: 4px 4px 4px 4px;
}

.home {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background-size: 100% 100%;
}

.home-icon {
  margin-left: 0.1rem;
  margin-right: 0.2rem;
}

.home-icon-end {
  margin-left: -0.12rem;
  margin-right: 0.24rem;
}

.away {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background-size: 100% 100%;
}

.away-icon {
  margin-left: 0.18rem;
}

.away-icon-end {
  position: absolute;
  top: 44%;
  right: 0.25rem;
}

.home-num {
  width: 0.36rem;
  height: 0.28rem;
  line-height: 0.28rem;
  text-align: center;
  margin-right: 0.1rem;
  font-size: 14px;
  color: var(--q-gb-t-c-18);
  background: var(--q-color-com-bg-color-33);
}

.home-number {
  margin-left: 0.13rem;
}

.home-number-end {
  margin-left: 0.3rem;
}

.away-num {
  width: 0.36rem;
  height: 0.28rem;
  line-height: 0.28rem;
  text-align: center;
  font-size: 14px;
  color: var(--q-gb-t-c-18);
  background: var(--q-color-com-bg-color-33);
}

.away-number {
  margin-right: 0.15rem;
}

.away-number-end {
  margin-right: 0.3rem;
}

.vir-name {
  max-width: 0.42rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.14rem;
  color: var(--q-color-com-fs-color-1);
  line-height: 14px;
  font-weight: 600;
}
</style>
src/core/utils/common/module/other.js