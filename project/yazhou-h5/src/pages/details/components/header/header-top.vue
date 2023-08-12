<template>
  <div class="relative-position header-top"  @touchmove.prevent :class="[get_menu_type==3000 && 'header_DJ']">
    <!-- 队徽 -->
    <div class="row mx-30 top-style">
      <div class="col-3 logo-double">
        <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
        <team-img :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[0]" :fr="get_menu_type != 3000 ? detail_data.frmhn[0]: detail_data.frmhn" :size="44"></team-img>
        <team-img v-if="detail_data.mhlu.length > 1 && get_menu_type != 3000" :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[1]" :fr="detail_data.frmhn[1]" :size="44" style="margin-left:-0.1rem;"></team-img>
      </div>
      <div class="col-6">
        <!-- 描述比赛进度相关start -->
        <team-text :detail_data="detail_data" v-if="get_menu_type!=3000"></team-text>
        <!-- 描述比赛进度相关end -->
      </div>
      <div class="col-3 logo-double">
        <!-- 右侧双打图标 type 1 表示客队,malu 客队的url -->
        <team-img :type="0" :csid="detail_data.csid" :url="detail_data.malu[0]" :fr="get_menu_type != 3000 ? detail_data.frman[0]: detail_data.frman" :size="44"></team-img>
        <team-img v-if="detail_data.malu.length > 1 && get_menu_type != 3000" :type="1" :csid="detail_data.csid" :url="detail_data.malu[1]" :fr="detail_data.frman[1]" :size="44" style="margin-left:-0.1rem;"></team-img>
      </div>
    </div>
    <!-- 电竞相关的 头部信息样式  集中在这里-->
    <div class="DJ-score-information" v-if="get_menu_type==3000">
      <!-- 展示比分信息-->
      <div class="eports_scoring_tip" v-if="eports_scoring">{{$root.$t('mmp.eports_scoring')}}</div>
      <div class="information-score" v-else-if="[1,2,3,4].includes(+detail_data.ms)">
        <span>{{s1_score.home}}</span>
        <div class="collect-icon"  @click="icon_click" v-if="+detail_data.mms > 1 && detail_data.vurl"></div>
        <span class="line-Bar" v-else>-</span>
        <span>{{s1_score.away}}</span>
      </div>
      <div class="round-time">
        <!-- 开赛时间 -->
        <span v-if="detail_data.ms == 0">
          <span v-if="start_time" class="fz_12" style="font-weight:400">
            <!-- 距离开赛时间小于一小时显示倒计时 -->
            {{$root.$t("list.after_time_start",[longTime])}}
          </span>
          <template v-else>
            <div class="sj-time-day">{{utils.format_time_zone(+detail_data.mgt).Format($root.$t('time3'))}}</div>
            <span class="sj-time-soon">{{utils.format_time_zone_time(+detail_data.mgt) | format_H_M }}</span>
          </template>
        </span>
        <!-- 赛前切滚球 ms=110时:显示即将开赛 -->
        <span v-else-if="detail_data.ms == 110" class="fz_12" style="font-weight:400">
          {{$root.$t(`ms[${detail_data.ms}]`)}}
        </span>
        <template v-else>
          <span>{{$root.$t('mmp')[detail_data.csid][detail_data.mmp]}}</span>
          <!-- 倒/正计时组件 -->
          <!-- <counting-down
            :title="null"
            :mmp="detail_data.mmp"
            :m_id="detail_data.mid"
            :second="detail_data.mst"
            :match="detail_data"
            :is_add="[100,101,102,103,104].includes(+detail_data.csid)"
          /> -->
        </template>
      </div>
    </div>

    <div class="score-style" v-if="get_menu_type!=3000">
      <!-- 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 -->
      <!-- 比赛分数or开赛时间 -->
      <span v-if="detail_data.ms == 0">
        <span v-if="start_time" class="fz_12" style="font-weight:400">
          <!-- 距离开赛时间小于一小时显示倒计时 -->
          {{$root.$t("list.after_time_start",[longTime])}}
        </span>
        <span v-else>
          {{utils.format_time_zone_time(+detail_data.mgt) | format_H_M }}
        </span>
      </span>
      <!-- 赛前切滚球 ms=110时:显示即将开赛 -->
      <span v-if="detail_data.ms == 110" class="fz_12" style="font-weight:400">
        {{$root.$t(`ms[${detail_data.ms}]`)}}
      </span>
      <!-- 棒球的进攻方绿点在大比分两侧展示 -->
      <span v-if="detail_data.csid == '3' && detail_data.mat" :class="detail_data.mat == 'home'?'s-active-dot':'s-touming'" style="position:relative;bottom:0.05rem;"></span>
      <span class="score1" v-if="[1,2,3,4].includes(+detail_data.ms)">
        <!-- 引入相对应的formatUtil,使用其中的方法; -->
        {{detail_data | format_total_score(0)}} - {{detail_data | format_total_score(1)}}
      </span>
      <span v-if="detail_data.csid == '3' && detail_data.mat" :class="detail_data.mat == 'away'?'s-active-dot':'s-touming'" style="position:relative;bottom:0.05rem;"></span>

      <!-- 局间比分 -->
      <!-- <match-between-score :detail_data="detail_data"></match-between-score> -->
    </div>

    <!-- 队名 -->
    <div class="mx-4 row team-name">
      <div class="row name-wrap mhn">
        <div class="mhn-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'mhn', '').includes('/')">
            <div class="ellipsis">{{detail_data.mhn.split(' / ')[0]}}/</div>
            <div class="ellipsis">{{detail_data.mhn.split(' / ')[1]}}</div>
          </template>
          <template v-else>
            {{detail_data.mhn}}
          </template>
        </div>
        <!-- 进球动画 -->
        <div class="goal-wrap" v-if="is_show_home_goal">
          <div class="inner yb-flex-center left">
            <div class="yb-goal-gif" :class="{'yb-goal-yo':get_theme.includes('y0')}"></div>
            <div class="gif-text">{{$root.$t('match_result.goal')}}</div>
          </div>
        </div>
        <div class="red-gif" :class="{flash:is_show_home_red}">
          <div class="inner left"></div>
        </div>
      </div>
      <div class="row name-wrap">
        <div class="red-gif" :class="{flash:is_show_away_red}">
          <div class="inner right"></div>
        </div>
        <!-- 进球动画 -->
        <div class="goal-wrap" v-if="is_show_away_goal">
          <div class="inner yb-flex-center right">
            <div class="yb-goal-gif" :class="{'yb-goal-yo':get_theme.includes('y0')}"></div>
            <div class="gif-text">{{$root.$t('match_result.goal')}}</div>
          </div>
        </div>
        <div class="man-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'man', '').includes('/')">
            <div class="ellipsis">{{detail_data.man.split(' / ')[0]}}/</div>
            <div class="ellipsis">{{detail_data.man.split(' / ')[1]}}</div>
          </template>
          <template v-else>
            {{detail_data.man}}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 1-足球 2-篮球 3-棒球 4冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球 10-羽毛球
import team_img from "src/components/details/team-img/team-img-template-1/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import team_text from "src/components/details/team-text/team-text-template-1/index.vue";   // 中立场赛事展示
import team_name from "src/components/details/team-name/team-name-template-1/team-name.vue";   // 详情页背景上的队伍名称
// import msc from "src/public/mixins/common/msc.js";    // 国际化比赛阶段比分转换工具
// import match_between_score from 'src/project/components/match/match_between_score.vue'  // 详情页显示赛事当前局比分以及绿色小圆点显示发球方
// import counting_down from 'src/project/components/common/counting-down'   // 赛事进行中每秒变化的计时器
import utils from "src/core/utils/utils.js";    // 公共方法
// #TODO vuex 
// import {mapGetters, mapMutations} from "vuex";
import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_KEY } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "details_tab",
  // #TODO mixins 
  // mixins: [msc],
  props: {
    detail_data: {
      type: Object
    }
  },
  components: {
    // 队徽
    "team-img": team_img,
    // 状态描述
    "team-text": team_text,
    // 队名
    "team-name": team_name,
    // 局间比分
    // "match-between-score": match_between_score,
    // "counting-down": counting_down,
  },
  setup(props, evnet) {
    const data = reactive({
      emitters: [],
      // 赛事开始倒计时时间(赛事开始时间-当前时间)
      longTime: '',
      // 赛事开赛时间倒计时是否显示
      start_time: true,
      // 是否显示主队进球动画
      is_show_home_goal:false,
      // 是否显示客队进球动画
      is_show_away_goal:false,
      // 是否显示主队红牌动画
      is_show_home_red:false,
      // 是否显示客队红牌动画
      is_show_away_red:false,
      // 比分和红牌数值变化时设置时间
      scoreTime: {
        S1: 0,
        S11: 0
      },
      // 顶部赛事是否切换
      changeMatch: false,
      utils
    });
    // #TODO vuex 
    // computed:{
    // ...mapGetters([
    //   "get_menu_type",
    //   'get_goto_detail_matchid',
    //   'get_theme',
    // ]),
    /**
     * @Description 主比分
     * @param {object} undefined
    */
    const s1_score = computed(() => {
      let score = {
        home:null,
        away:null
      }
      lodash.forEach(detail_data.msc, item =>{
        if(item.split("|")[0] == "S1"){
          score = {
            /*home:item.split("|")[1].split(":")[0] || 0,
            away:item.split("|")[1].split(":")[1] || 0*/
            home: formatTotalScore(detail_data, 0),
            away: formatTotalScore(detail_data, 1)
          }
        }
      })
      return score
    });
    /**
     * @Description 红牌比分
     * @param {object} undefined
    */
    const s11_score = computed(() => {
      let score = {
        home:null,
        away:null
      }
      lodash.forEach(detail_data.msc, item =>{
        if(item.split("|")[0] == "S11"){
          score = {
            home:item.split("|")[1].split(":")[0] || 0,
            away:item.split("|")[1].split(":")[1] || 0
          }
        }
      })
      return score
    })
    const eports_scoring = computed(() => {
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if(get_menu_type == 3000) {
        const mmp_state = detail_data.mmp || 1
        if(mmp_state != (Number(s1_score.home) + Number(s1_score.away) +1)) {
          scoring = true
        }
      }
      return scoring
    })
    // 监听到赛事开始时间发生变化及时更新时间
    watch(
      () => detail_data.mgt,
      () => {
        initEvent();
      }
    );
    /**
     * @Description 监听主比分变化
     * @param {undefined} undefined
    */
    watch(
      () => s1_score,
      (new_,old_) => {
        if(detail_data.csid != 1) return

        // 当前赛事，若比分未变化，则提前退出，不展示进球动画
        if (
            (new_.home === old_.home && new_.away === old_.away) &&
            !changeMatch
        ) {
          return
        }

        // 顶部切换赛事时，禁止进球动画显示
        if (changeMatch) {
          changeMatch = false
          return
        }

        // 若主(客)队比分数值变化，则更新对应时间
        if (new_.home > 0 || new_.away > 0) {
          $set(scoreTime, 'S1', Date.now())
        }

        // 主队比分数值
        if(new_.home > 0 && new_.home >= new_.away){
          is_show_home_goal = scoreTime.S1 > scoreTime.S11
          hide_home_goal()
          changeMatch = false
        } else {
          is_show_home_goal = false
        }

        // 客队比分数值
        if(new_.away > 0 && new_.away >= new_.home){
          is_show_away_goal = scoreTime.S1 > scoreTime.S11
          hide_away_goal()
          changeMatch = false
        } else {
          is_show_away_goal = false
        }
      }
    );
    /**
     * @Description 监听红牌比分变化
     * @param {undefined} undefined
    */
    watch(
      () => s11_score,
      (new_,old_) => {
        if(detail_data.csid != 1) return

        // 当前赛事，若比分未变化，则提前退出，不展示红牌动画
        if (
            (new_.home === old_.home && new_.away === old_.away) &&
            !changeMatch
        ) {
          return
        }

        // 顶部切换赛事时，禁止红牌动画显示
        if (changeMatch) {
          changeMatch = false
          return
        }

        // 若主(客)队红牌数值变化，则更新对应时间
        if (new_.home > 0 || new_.away > 0) {
          $set(scoreTime, 'S11', Date.now())
        }

        // 主队红牌数值
        if(new_.home > 0 && new_.home >= new_.away){
          is_show_home_red = !is_show_home_goal && scoreTime.S11 > scoreTime.S1
          hide_home_red()
        } else {
          is_show_home_red = false
        }

        // 客队红牌数值
        if(new_.away > 0 && new_.away >= new_.home){
          is_show_away_red = !is_show_away_goal && scoreTime.S11 > scoreTime.S1
          hide_away_red()
        } else {
          is_show_away_red = false
        }
      }
    );
    // 监听到赛事开始时间发生变化及时更新时间
    watch(
      () => get_goto_detail_matchid,
      (matchId) => {
        changeMatch = true
      }
    );
    // #TODO vuex 
    // methods: {
    // ...mapMutations(['set_video_url', 'set_show_video','set_toast','set_iframe_onload']),
    /**
     *@description 根据不同赛事阶段取不同的比分
     *@param {Object} match 赛事数据对象
     *@param {Number} num 0-主队  1-客队
     *@return {Number} 主队或客队得分
     */
    const formatTotalScore = (match, num) => {
      try {
        if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
        let score_, mscmap = new Map(match.msc.map(item => [item.split('|')[0], item.split('|')[1].split(':')]));
        if (match.csid == "1" || match.csid == "11") {    //足球和手球
          switch (String(match.mmp)) {
              //  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
            case '41': case '33': case '42': case '110':
              score_ = mscmap.get('S7')
              break;
              // 50 点球大战  120 点球大战结束
            case '50': case '120':
              score_ = mscmap.get('S170')
              break;
              // 即将加时和等待点球的阶段固定取0
            case '32': case '34':
              score_ = 0
              break;
              //全场结束,取点球大战比分，加时赛比分或者全场比分
            case '999':
              score_ = mscmap.get('S170') || mscmap.get('S7') || mscmap.get('S1')
              break;
            default:
              score_ = mscmap.get('S1')
              break;
          }
        } else {
          score_ = mscmap.get('S1')
        }
        return score_ && score_[num] || 0
      } catch (error) {
        console.error(error)
        return 0
      }
    };
    /**
     * @Description 隐藏主队进球动画
     * @param {undefined} undefined
    */
    const hide_home_goal = () => {
      is_show_home_goal = false
    };
    /**
     * @Description 隐藏客队进球动画
     * @param {undefined} undefined
    */
    const hide_away_goal = () => {
      is_show_away_goal = false
    };
    /**
     * @Description 隐藏主队红牌动画
     * @param {undefined} undefined
    */
    const hide_home_red = () => {
      is_show_home_red = false
    };
    /**
     * @Description 隐藏客队红牌动画
     * @param {undefined} undefined
    */
    const hide_away_red = () => {
      is_show_away_red = false
    };
    const initEvent = () => {
      // mgt:赛事开始时间
      let now = new Date().getTime();
      // 赛事开始时间-当前时间 小于一小时并且大于0的时候显示 赛事倒计时
      let bool = (+detail_data.mgt - now < 3600 * 1000) && (detail_data.mgt - now >0) ? true:false;
      // 赛事开始倒计时时间(整数)
      let longTime = Math.floor( (+detail_data.mgt -now ) / 1000 / 60 );
      // 赛事开赛时间倒计时为0的时候 让倒计时显示为1分钟
      if(longTime == 0){ longTime += 1 }
      // 此时true或者false 控制是否显示倒计时时间
      start_time = bool;
      // 计算出来的倒计时时间赋值给data的变量显示在页面上
      longTime = longTime;

      timerInterval = setInterval(()=>{
        let now = new Date().getTime();
        // 判断赛事开始时间-当前时间 小于0的时候 清除定时器
        if(+detail_data.mgt - now < 0 ){
          clearInterval(timerInterval);
          // 不显示倒计时
          start_time = false;
          // 此时同步更新match_stage组件的时间
          // #TODO emit 
          useMittEmit(MITT_KEY.EMIT_MATCHINFO_LOADING);
          // $root.$emit(emit_cmd.EMIT_MATCH_NOSTART);
        }
        // 同上注释
        let longTime = Math.floor( (+detail_data.mgt - now )/ 1000 / 60);
        if(longTime == 0){ longTime += 1 }
        longTime = longTime;
      }, 1000 * 1)
    };
    //视频播放
    const icon_click = () => {
      let data = {
        media_src: detail_data.vurl,
        active:'muUrl',
      };
      let ua = navigator.userAgent.toLowerCase();
      // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
      // 判断是否是苹果手机，是则是true
      let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
      if(isIos){
        data.media_src = detail_data.vurl
      }else{
        data.media_src = detail_data.varl || detail_data.vurl
      }
      set_video_url(data);
      set_show_video(true);
      set_iframe_onload(false);
      clearTimeout(timer1_)
      timer1_ = setTimeout(()=>{
        set_iframe_onload(true);
      },2000)
    };
    onMounted(() => {
      // 原created
      // 延时器
      timerInterval=0;
      timer1_ = null;
      hide_home_goal = debounce(hide_home_goal,5000)
      hide_away_goal = debounce(hide_away_goal,5000)
      hide_home_red = debounce(hide_home_red,5000)
      hide_away_red = debounce(hide_away_red,5000)
      initEvent();
      // #TODO emit 
      emitters = [
        useMittOn.on(MITT_KEY.EMIT_MATCH_TIME_SHOW_INIT, initEvent).off,
      ]
      // $root.$on(emit_cmd.EMIT_MATCH_TIME_SHOW_INIT, initEvent);
    })
    onUnmounted(() => {
      debounce_throttle_cancel(hide_home_goal);
      debounce_throttle_cancel(hide_away_goal);
      debounce_throttle_cancel(hide_home_red);
      debounce_throttle_cancel(hide_away_red);

      clearInterval(timerInterval); // 清除相对应的定时器;
      timerInterval = null

      clearTimeout(timer1_)
      timer1_ = null

      // #TODO emit 
      emitters.map((x) => x())
      // $root.$off(emit_cmd.EMIT_MATCH_TIME_SHOW_INIT, initEvent);
    })
    return {
      ...toRefs(data),
      s1_score,
      s11_score,
      eports_scoring,
      formatTotalScore,
      hide_home_goal,
      hide_away_goal,
      hide_home_red,
      hide_away_red,
      initEvent,
      icon_click,
    }
  }
})
</script>
<style lang="scss" scoped>
.header-top {
  width: 100%;
  min-height: 0.96rem !important;
  line-height: 1.3;
  padding-top: .02rem;
  position: relative;

  &.header_DJ {
    margin-top: 0.25rem;
  }
}

.top-style {
  height: 0.44rem;
}

.DJ-score-information {
  position: absolute;
  top: 0.06rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0.6rem;

  .eports_scoring_tip {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.1rem;
    font-family: dinMedium;
    font-size: 0.16rem;
    color: var(--q-color-com-fs-color-8);
  }
  .information-score {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.1rem;

    > span {
      font-family: dinMedium;
      font-size: 0.36rem;
      color: var(--q-color-com-fs-color-8);

      &.line-Bar {
        margin: 0 0.1rem;
      }
    }

    .collect-icon {
      width: 0.32rem;
      height: 0.32rem;
      margin: 0 0.14rem;
      background-size: 100% 100%;
    }
  }

  .round-time {
    font-family: PingFangSCr;
    font-size: 0.12rem;
    color: var(--q-color-com-fs-color-32);
    display: flex;

    .sj-time-day {
      font-family: dinMedium;
      text-align: center;
      margin-bottom: 0.05rem;
      color: var(--q-color-com-fs-color-8);
    }

    .sj-time-soon {
      font-family: dinMedium;
      font-size: 0.26rem;
      color: var(--q-color-com-fs-color-8);
      letter-spacing: 0;
      text-align: center;
      font-weight: 500;
    }

    ::v-deep.counting-down-wrap {
      position: relative;
      top: 0.01rem;
      width: 0.52rem !important;
      justify-content: center;

      .counting {
        font-family: dinMedium;
        color: var(--q-color-com-fs-color-32);
      }
    }
  }
}

.score-style {
  font-size: 0.26rem;
  color: var(--q-color-com-fs-color-8);
  letter-spacing: 0;
  text-align: center;
  font-weight: 500;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.28rem;
}

.team-name {
  font-size: 0.14rem;
  color: var(--q-color-com-fs-color-8);
  height: 0.5rem;
  padding: 0 0.2rem;
  justify-content: space-between;
  padding-top: 0.13rem;
}

.name-wrap {
  display: flex;
  justify-content: center;
  width: 0.9rem;
  flex-wrap: nowrap;
  text-align: center;
}

.goal-wrap {
  width: 0px;
  position: relative;

  .inner {
    height: 0.24rem;
    position: absolute;
    top: 0;

    &.left {
      left: 0;
    }

    &.right {
      right: 3px;
    }
  }
}

.red-gif {
  width: 0;
  display: none;
  position: relative;
  animation: 1s text-flash linear infinite normal;

  .inner {
    width: 0.11rem;
    height: 0.14rem;
    background: #e02020;
    border-radius: 0.02rem;
    margin: 0 0.03rem;
    margin-top: 0.03rem;
    position: absolute;
    top: 0;

    &.left {
      left: 0;
    }

    &.right {
      right: 3px;
    }
  }

  &.flash {
    display: block;
  }
}

.gif-text {
  white-space: nowrap;
  margin-left: 3px;
  color: var(--q-color-fs-color-50);
  animation: 1s text-flash linear infinite normal;
  font-size: 12px;
}

.logo-double {
  display: flex;
}

/*************** 发球方绿色小点 *************** -S*/
.s-active-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/*************** 发球方绿色小点 *************** -E*/
/*************** 不显示绿色小点 *************** -S*/
.s-touming {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/*************** 不显示绿色小点 *************** -S*/
</style>
