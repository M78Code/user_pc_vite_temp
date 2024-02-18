<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事详情--比分面板--足球-滚球
-->
<template>
  <div class="football-after" v-if="isRouterAlive">
    <div class="info-time">
      <div class="match-date">
        <match-date :match="match_info" source='detail' class="count_down" style="flex-flow: row;"></match-date>
      </div>
      <!-- 中立场 -->
      <span v-if="match_info.mng"   class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
      <div class="col"></div>
      <div class="time-node">
        <!-- 全角 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('list.corner')}}</q-tooltip>
          <!-- 角球 -->
          <div class="result-icon rs_jiao_quan"></div>
        </div>
        <!-- 全黄 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.yellow_card')}}</q-tooltip>
          <!-- 黄牌 -->
          <div class="result-icon yellow_card"></div>
        </div>
        <!-- 全红 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.red_card')}}</q-tooltip>
          <!-- 红牌 -->
          <div class="result-icon red_card"></div>
        </div>
        <!-- 常规赛点球 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.penalty_kick')}}</q-tooltip>
          <!-- 点球 -->
          <div class="result-icon rs_dian"></div>
        </div>
        <!-- 半场进球 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('common.half_1')}}</q-tooltip>
          <!-- 上半场 -->
          <div class="result-icon rs_jin_shang"></div>
        </div>
        <!-- 全场进球 -->
        <div class="result-icon-wrap">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.overall')}}</q-tooltip>
          <!-- 全场 -->
          <div class="result-icon rs_jin_quan"></div>
        </div>
        <!-- 加时赛进球 -->
        <div class="result-icon-wrap" v-show="lodash.get(match_info, 'score_obj.S7')">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.overtime_goal')}}</q-tooltip>
          <!-- 加时赛进球 -->
          <div class="result-icon add_time"></div>
        </div>
        <div class="result-icon-wrap" v-show="lodash.get(match_info, 'score_obj.S170')">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.penalty_shootout')}}</q-tooltip>
          <!-- 点球大战进球 -->
          <icon class="result-icon" name="icon-jia-dian" size="15px"></icon>
        </div>
      </div>
    </div>
    <!-- 对阵信息 -->
    <div class="info-both">
      <div class="both-home">
        <div class="wrap-logo">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            v-img="([lodash.get(match_info,'mhlu[0]'),lodash.get(match_info,'frmhn[0]')])"
            class="both-logo"
          />
          <span class="ellipsis allow-user-select" style="font-weight:400;" v-tooltip="{content:lodash.get(match_info,'mhn'),overflow:1}">{{lodash.get(match_info,'mhn')}}</span>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_home_goal">
            <div class="yb-goal-gif"></div>
            <!-- 进球 -->
            <div class="gif-text">{{ i18n_t('common.goal')}}</div>
          </div>
          <!-- 红牌动画 -->
          <img class="red-flash" :class="{active:is_show_home_red}" style="margin-left:5px" src="/image/yabo/svg/rs_hong.svg">
        </div>
        <div class="info-data">
          <!-- 角球总比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S5.home')}}</span>
          <!-- 黄牌比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S12.home')}}</span>
          <!-- 红牌比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S11.home')}}</span>
          <!-- 点球比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S10.home')}}</span>
          <!-- 上半场比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S2.home')}}</span>
          <!-- 全场比分 -->
          <span
            :class="{'mmp-active': !['32','41','33','42','34','50','120'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S1.home')}}</span>
          <!-- 加时赛比分 -->
          <span
            v-show="lodash.get(match_info, 'score_obj.S7.home')"
            :class="{'mmp-active': ['32','41','33','42'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S7.home')}}</span>
          <!-- 点球大战比分 -->
          <span
            v-show="lodash.get(match_info, 'score_obj.S170.home')"
            :class="{'mmp-active': ['34','50','120'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S170.home')}}</span>
        </div>
      </div>
      <div class="both-away">
        <div class="wrap-logo">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            v-img="([lodash.get(match_info,'malu[0]'),lodash.get(match_info,'frman[0]')])"
            class="both-logo"
          />
          <span class="ellipsis allow-user-select" style="font-weight:400;" v-tooltip="{content:lodash.get(match_info,'man'),overflow:1}">{{lodash.get(match_info,'man')}}</span>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_away_goal">
            <div class="yb-goal-gif"></div>
            <!-- 进球 -->
            <div class="gif-text">{{ i18n_t('common.goal')}}</div>
          </div>
          <!-- 红牌动画 -->
          <img class="red-flash" :class="{active:is_show_away_red}" style="margin-left:5px" src="/image/yabo/svg/rs_hong.svg">
        </div>
        <div class="info-data">
          <!-- 角球总比分 -->
          <span>{{lodash.get(match_info, 'score_obj.S5.away')}}</span>
          <!-- 黄牌 -->
          <span>{{lodash.get(match_info, 'score_obj.S12.away')}}</span>
          <!-- 红牌 -->
          <span>{{lodash.get(match_info, 'score_obj.S11.away')}}</span>
          <!-- 点球 -->
          <span>{{lodash.get(match_info, 'score_obj.S10.away')}}</span>
          <!-- 上半场 -->
          <span>{{lodash.get(match_info, 'score_obj.S2.away')}}</span>
          <!-- 全场比分 -->
          <span
            :class="{'mmp-active': !['32','41','33','42','34','50','120'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S1.away')}}</span>
          <!-- 加时赛比分 -->
          <span
            v-show="lodash.get(match_info, 'score_obj.S7.away')"
            :class="{'mmp-active': ['32','41','33','42'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S7.away')}}</span>
          <!-- 点球大战 -->
          <span
            v-show="lodash.get(match_info, 'score_obj.S170.away')"
            :class="{'mmp-active': ['34','50','120'].includes(lodash.get(match_info,'mmp'))}"
          >{{lodash.get(match_info, 'score_obj.S170.away')}}</span>
        </div>
      </div>
    </div>
    <!-- 对阵信息 -->
  </div>
</template>

<script>
// import format from "src/project/yabo/mixins/match_details/index";
import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { IconWapper } from 'src/components/icon'
import { nextTick } from "vue";
export default {
  components: {
    "match-date": MatchProcessFullVersionWapper,
    IconWapper,
  },
  name: "football_after",
  // mixins: [format],
  props: {
    match_info: Object,
  },
  data() {
    return {
      timestamp: 0,//当前时间戳
      format_date: "",//倒计时秒数
      percentage: "",//百分比
      timer: null,
      default: {//初始化比分
        home: "0",
        away: "0",
      },
      isRouterAlive: true,//重载页面开关
      // 是否显示主队进球动画
      is_show_home_goal:false,
      // 是否显示客队进球动画
      is_show_away_goal:false,
      // 是否显示主队红牌动画
      is_show_home_red:false,
      // 是否显示客队红牌动画
      is_show_away_red:false,
      off_: ''
    };
  },
  methods: {
    /**
     * @Description 隐藏主队进球动画
     * @param {undefined} undefined
    */
    hide_home_goal(){
      this.is_show_home_goal = false
    },
    /**
     * @Description 隐藏客队进球动画
     * @param {undefined} undefined
    */
    hide_away_goal(){
      this.is_show_away_goal = false
    },
    /**
     * @Description 隐藏主队红牌动画
     * @param {undefined} undefined
    */
    hide_home_red(){
      this.is_show_home_red = false
    },
    /**
     * @Description 隐藏客队红牌动画
     * @param {undefined} undefined
    */
    hide_away_red(){
      this.is_show_away_red = false
    },
    start_timer() {
      // let {off: this.off_} = useMittOn(
      //   MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD,
      //   this.start_timer_loop
      // );
    },
    start_timer_loop() {
      let date = this.timestamp++;
      this.format_date = this.formatSeconds(date);
    },
    /**
    * @description: 重载页面
    * @return {undefined} undefined
    */
    reload_data() {
      this.isRouterAlive = false;
      nextTick(()=> {
        this.isRouterAlive = true;
      });
    },
  },
  created(){
    this.hide_home_goal = this.debounce(this.hide_home_goal,5000)
    this.hide_away_goal = this.debounce(this.hide_away_goal,5000)
    this.hide_home_red = this.debounce(this.hide_home_red,5000)
    this.hide_away_red = this.debounce(this.hide_away_red,5000)
  },
  beforeUnmount() {
    this.debounce_throttle_cancel(this.hide_home_goal);
    this.debounce_throttle_cancel(this.hide_away_goal);
    this.debounce_throttle_cancel(this.hide_home_red);
    this.debounce_throttle_cancel(this.hide_away_red);
    // this.off_();
  },
  watch: {
    match_info: {
      handler(res, old) {
        this.match_change_time = new Date().getTime()
        this.reload_data();
        this.timestamp = 0;
        !lodash.get(res, 'score_obj.S1') && (res.score_obj.S1 = this.default);
        !lodash.get(res, 'score_obj.S5') && (res.score_obj.S5 = this.default);
        // 不确定是不是有地方要显示默认比分0:0，先只针对 S10(点球)做处理
        !lodash.get(res, 'score_obj.S10') && (res.score_obj.S10 = {
          home: '',
          away: ''
        });
        !lodash.get(res, 'score_obj.S11') && (res.score_obj.S11 = this.default);
        !lodash.get(res, 'score_obj.S12') && (res.score_obj.S12 = this.default);
        //加时赛
        if (["32", "41", "33", "42", "110"].includes(res.mmp) && !lodash.get(res, 'score_obj.S7')) {
          res.score_obj.S7 = this.default;
        }
        //点球大战
        if (["34", "50", "120"].includes(res.mmp) && !lodash.get(res, 'score_obj.S170')) {
          res.score_obj.S170 = this.default;
        }
        if (this.$get_match_status(res.ms) && ["6", "7"].includes(res.mmp)) {
          this.timestamp = parseInt(res.mst);
          this.start_timer();
        }
      },
      immediate: true,
    },
    /**
     * @Description 监听主比分变化
     * @param {undefined} undefined
    */
    'match_info.score_obj.S1'(new_,old_){
      let _time = new Date().getTime() - this.match_change_time
      if(_time < 100 || (!lodash.get(new_))){
        return
      }
      if(lodash.get(new_, 'home') > 0 && lodash.get(new_, 'home') != lodash.get(old_, 'home')){
        this.is_show_home_goal = true
        this.hide_home_goal()
      }
      if(lodash.get(new_, 'away') > 0 && lodash.get(new_, 'away') != lodash.get(old_, 'away')){
        this.is_show_away_goal = true
        this.hide_away_goal()
      }
    },
    /**
     * @Description 监听红牌比分变化
     * @param {undefined} undefined
    */
    'match_info.score_obj.S11'(new_,old_){
      let _time = new Date().getTime() - this.match_change_time
      if(_time < 100 || (!lodash.get(new_))){
        return
      }
      if(lodash.get(new_, 'home') > 0 && lodash.get(new_, 'home') != lodash.get(old_, 'home')){
        this.is_show_home_red = true
        this.hide_home_red()
      }
      if(lodash.get(new_, 'away') > 0 && lodash.get(new_, 'away') != lodash.get(old_, 'away')){
        this.is_show_away_red = true
        this.hide_away_red()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes text-flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
.gif-text {
  white-space: nowrap;
  color: var(--q-gb-t-c-2);
  padding-left: 3px;
  animation: 1s text-flash linear infinite normal;
}
.red-flash {
  animation: 1s text-flash linear infinite normal;
  display: none;
  &.active {
    display: block;
  }
}
.expand-match-list {
  .football-after {
    width: 370px;
  }
}
.screen-medium {
  .expand-match-list {
    .football-after {
      width: 370px;
    }
  }
  .page-match-detail {
    .c-match-process {
      flex-direction: column !important;
    }
  }
}
.screen-min {
  .expand-match-list {
    .football-after {
      width: 386px;
    }
  }
}
.screen-medium {
  .football-after {
    width: 506px;
  }
}
.screen-min {
  .football-after {
    width: 445px;
  }
}
.football-after {
  overflow: hidden;
  width: 560px;
  border-radius: 2px;
  color: #d1d1d1;
  font-size: 12px;
  .info-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 20px;
    height: 40px;
    background: #1f2129;
    .match-date {
      display: flex;
      color: var(--q-gb-t-c-1);
      .count_down {
        align-items: center;
        justify-content: center;
      }
    }
    .time-node {
      display: flex;
      align-items: center;
      scrollbar-width: none;
      scrollbar-width: none;
      .result-icon-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        width: 26px;
        height: 100%;
        &:last-child {
          margin-right: 0px;
        }
      }
      .result-icon {
        // 这里改成用精灵图
        background-image: url($SCSSPROJECTPATH+'/image/common/png/sports_play_icon.png');
        background-repeat: no-repeat;
        width: 14px;
        height: 14px;
        background-size: 100%;
        &.rs_jiao_quan {
          background-position: 0 -224px;
        }
        &.yellow_card {
          background-position: 0 -140px;
        }
        &.red_card {
          background-position: 0 -182px;
        }
        &.rs_dian {
          background-position: 0 -294px;
        }
        &.rs_jin_shang {
          background-position: 0 -238px;
        }
        &.rs_jin_quan {
          background-position: 0 -266px;
        }
        &.add_time {
          background-position: 0 -280px;
        }
        &:before {
          font-size: 16px;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .info-both {
    background: rgba(31, 33, 41, 0.8);
    .both-home,
    .both-away {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px 8px 20px;
    }
    .both-home {
      border-bottom: 1px solid rgba(225, 225, 225, 0.08);
    }
    .wrap-logo {
      display: flex;
      flex: 1;
      align-items: center;
      min-width: 1px;
      color: var(--q-gb-t-c-1);
      height: 28px;
      overflow: hidden;
    }
    .both-logo {
      flex-shrink: 0;
      margin-right: 11px;
      width: 28px;
    }
    .info-data {
      span {
        display: inline-block;
        margin-right: 10px;
        width: 26px;
        text-align: center;
        font-size: 13px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
