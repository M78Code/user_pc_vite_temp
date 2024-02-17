<template>
  <div
    class="relative-position header-top"
    @touchmove.prevent
    :class="[MenuData.get_menu_type() == 3000 && 'header_DJ']"
  >
    <!-- 队徽 -->
    <div class="row mx-30 top-style">
      <div class="col-3 logo-double">
        <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
        <team-img
          v-if="!lodash.isEmpty(detail_data)"
          :type="0"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data,'mhlu[0]')"
          :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
          :size="44"
        ></team-img>
        <team-img
          v-if="lodash.get(detail_data,'mhlu.length') > 1 && MenuData.get_menu_type() != 3000 && !lodash.isEmpty(detail_data)"
          :type="0"
          :csid="detail_data.csid"
          :url="detail_data.mhlu[1]"
          :fr="detail_data.frmhn[1]"
          :size="44"
          style="margin-left:-0.1rem;"
        ></team-img>
      </div>
      <div class="col-6">
        <!-- 描述比赛进度相关start -->
        <team-text
          :detail_data="detail_data"
          v-if="MenuData.get_menu_type() != 3000"
        ></team-text>
        <!-- 描述比赛进度相关end -->
      </div>
      <div class="col-3 logo-double">
        <!-- 右侧双打图标 type 1 表示客队,malu 客队的url -->
        <team-img
          :type="1"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data,'malu[0]')"
          :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frman[0]') : detail_data.frman"
          :size="44"
        ></team-img>
        <team-img
          v-if="lodash.get(detail_data,'malu.length') > 1 && MenuData.get_menu_type() != 3000"
          :type="1"
          :csid="detail_data.csid"
          :url="detail_data.malu[1]"
          :fr="detail_data.frman[1]"
          :size="44"
          style="margin-left:-0.1rem;"
        ></team-img>
      </div>
    </div>
    <!-- 电竞相关的 头部信息样式  集中在这里-->
    <div
      class="DJ-score-information"
      v-if="MenuData.get_menu_type() == 3000"
    >
      <!-- 展示比分信息-->
      <div
        class="eports_scoring_tip"
        v-if="eports_scoring"
      >{{ i18n_t('mmp.eports_scoring') }}</div>
      <div
        class="information-score"
        v-else-if="[1, 2, 3, 4].includes(+detail_data.ms)"
      >
        <span>{{ s1_score.home }}</span>
        <div
          class="collect-icon"
          @click="icon_click"
          v-if="+detail_data.mms > 1 && detail_data.vurl"
        ></div>
        <span
          class="line-Bar"
          v-else
        >-</span>
        <span>{{ s1_score.away }}</span>
      </div>
      <div class="round-time">
        <!-- 开赛时间 -->
        <span v-if="detail_data.ms == 0">
          <span
            v-if="show_someone.start_time"
            class="fz_12"
            style="font-weight:400"
          >
            <!-- 距离开赛时间小于一小时显示倒计时 -->
            {{ i18n_tc("list.after_time_start", [longTime]) }}
          </span>
          <template v-else>
            <!-- .Format(i18n_t('time3'))  | format_H_M -->
            <div class="sj-time-day">{{ format_time_zone(+detail_data.mgt) }}</div>
            <span class="sj-time-soon">{{ format_time_zone_time(+detail_data.mgt)}}</span>
          </template>
        </span>
        <!-- 赛前切滚球 ms=110时:显示即将开赛 -->
        <span
          v-else-if="detail_data.ms == 110"
          class="fz_12"
          style="font-weight:400"
        >
          {{ i18n_t(`ms[${detail_data.ms}]`) }}
        </span>
        <template v-else>
          <span>{{ i18n_t('mmp')[detail_data.csid][detail_data.mmp] }}</span>
          <!-- 倒/正计时组件 -->
          <counting-down
            :title="null"
            :mmp="detail_data.mmp"
            :m_id="detail_data.mid"
            :second="detail_data.mst"
            :match="detail_data"
            :is_add="[100, 101, 102, 103, 104].includes(+detail_data.csid)"
          />
        </template>
      </div>
    </div>
    <div
      class="score-style"
      v-if="MenuData.get_menu_type() != 3000"
    >
      <!-- 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 -->
      <!-- 比赛分数or开赛时间 -->
      <span v-if="detail_data.ms == 0">
        <span
          v-if="show_someone.start_time"
          class="fz_12"
          style="font-weight:400"
        >
          <!-- 距离开赛时间小于一小时显示倒计时 -->
          {{ i18n_tc('list.after_time_start', [longTime]) }}
        </span>
        <span v-else>
          <!--  | format_H_M -->
          {{ formatTime(+detail_data.mgt, 'HH:MM') }}
        </span>
      </span>
      <!-- 赛前切滚球 ms=110时:显示即将开赛 -->
      <span
        v-if="detail_data.ms == 110"
        class="fz_12"
        style="font-weight:400"
      >
        {{ i18n_t(`ms[${detail_data.ms}]`) }}
      </span>
      <!-- 棒球的进攻方绿点在大比分两侧展示 -->
      <span
        v-if="detail_data.csid == '3' && detail_data.mat"
        :class="detail_data.mat == 'home' ? 's-active-dot' : 's-touming'"
        style="position:relative;bottom:0.05rem;"
      ></span>
      <span
        class="score1"
        v-if="[1, 2, 3, 4].includes(+detail_data.ms)"
      >
        <!-- 引入相对应的formatUtil,使用其中的方法; -->
        {{ format_total_score(detail_data,0) }} - {{ format_total_score(detail_data,1) }}
      </span>
      <span
        v-if="detail_data.csid == '3' && detail_data.mat"
        :class="detail_data.mat == 'away' ? 's-active-dot' : 's-touming'"
        style="position:relative;bottom:0.05rem;"
      ></span>

      <!-- 局间比分 -->
      <match-between-score :detail_data="detail_data"></match-between-score>
    </div>

    <!-- 队名 -->
    <div class="mx-30 row team-name">
      <div class="row name-wrap mhn col-3">
        <div class="mhn-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'mhn', '').includes('/')">
            <div class="ellipsis">{{ detail_data.mhn.split(' / ')[0] }}/</div>
            <div class="ellipsis">{{ detail_data.mhn.split(' / ')[1] }}</div>
          </template>
          <template v-else>
            {{ detail_data.mhn }}
          </template>
        </div>
        <!-- 进球动画 -->
        <div
          class="goal-wrap"
          v-if="show_someone.is_show_home_goal"
        >
          <div class="inner yb-flex-center left">
            <div
              class="yb-goal-gif yb-goal-yo"
            ></div>
            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
          </div>
        </div>
        <div
          class="red-gif"
          :class="{ flash: show_someone.is_show_home_red }"
        >
          <div class="inner left"></div>
        </div>
      </div>
<!--      保证队伍名称和logo居中对齐-->
      <div class="col-6">&nbsp;</div>
      <div class="row name-wrap col-3">
        <div
          class="red-gif"
          :class="{ flash: show_someone.is_show_away_red }"
        >
          <div class="inner right"></div>
        </div>
        <!-- 进球动画 -->
        <div
          class="goal-wrap"
          v-if="show_someone.is_show_away_goal"
        >
          <div class="inner yb-flex-center right">
            <div
              class="yb-goal-gif yb-goal-yo"
            ></div>
            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
          </div>
        </div>
        <div class="man-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'man', '').includes('/')">
            <div class="ellipsis">{{ detail_data.man.split(' / ')[0] }}/</div>
            <div class="ellipsis">{{ detail_data.man.split(' / ')[1] }}</div>
          </template>
          <template v-else>
            {{ detail_data.man }}
          </template>
        </div>
      </div>
    </div>
    <!-- mng 是否中立场   1:是中立场，0:非中立场-->
    <!-- <div class="midfield-container" v-if="![5, 10, 7, 8, 13].includes(Number(detail_data.csid)) && detail_data.mng * 1" >
        <img class="neutral-icon-btn l-bottom" :src='midfield_icon_app' />
    </div> -->
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, defineComponent } from "vue";
import lodash from "lodash";
// 1-足球 2-篮球 3-棒球 4冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球 10-羽毛球
import TeamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import TeamText from "src/base-h5/components/details/team-text.vue";   // 中立场赛事展示
// import TeamName from "src/base-h5/components/details/team-name.vue";   // 详情页背景上的队伍名称
// import msc from "src/base-h5/mixins/common/msc.js";    // 国际化比赛阶段比分转换工具
 import matchBetweenScore from 'src/base-h5/components/match/match-between-score.vue'  // 详情页显示赛事当前局比分以及绿色小圆点显示发球方
import countingDown from 'src/base-h5/components/common/counting-down.vue'   // 赛事进行中每秒变化的计时器
// 公共方法
import { MenuData, UserCtr } from "src/output/index.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { format_total_score, format_time_zone_time, format_time_zone, formatTime } from "src/output/index.js"
import { i18n_t,i18n_tc } from "src/boot/i18n.js"
import { midfield_icon_app } from 'src/base-h5/core/utils/local-image.js'
const props = defineProps({
  detail_data: {
    type: Object,
    default: () => { }
  }
})
/** 赛事开始倒计时时间(赛事开始时间-当前时间) */
const longTime = ref('')
const show_someone = reactive({
  /** 赛事开赛时间倒计时是否显示 */
  start_time: true,
  /** 是否显示主队进球动画 */
  is_show_home_goal: false,
  /** 是否显示客队进球动画 */
  is_show_away_goal: false,
  /** 是否显示主队红牌动画 */
  is_show_home_red: false,
  /** 是否显示客队红牌动画 */
  is_show_away_red: false,
})
/** 比分和红牌数值变化时设置时间 */
const scoreTime = reactive({
  S1: 0,
  S11: 0
})
/** 顶部赛事是否切换 */
const change_match = ref(false)

/** 初始化 */
const initEvent = () => {
  // mgt:赛事开始时间
  let now = new Date().getTime();
  // 赛事开始时间-当前时间 小于一小时并且大于0的时候显示 赛事倒计时
  let bool = (+props.detail_data.mgt - now < 3600 * 1000) && (props.detail_data.mgt - now > 0) ? true : false;
  // 赛事开始倒计时时间(整数)
  let _longTime = Math.floor((+props.detail_data.mgt - now) / 1000 / 60);
  // 赛事开赛时间倒计时为0的时候 让倒计时显示为1分钟
  if (_longTime == 0) { _longTime += 1 }
  // 此时true或者false 控制是否显示倒计时时间
  show_someone.start_time = bool;
  // 计算出来的倒计时时间赋值给data的变量显示在页面上
  longTime.value = _longTime;

  timerInterval.value = setInterval(() => {
    let now = new Date().getTime();
    // 判断赛事开始时间-当前时间 小于0的时候 清除定时器
    if (+props.detail_data.mgt - now < 0) {
      clear_timerInterval()
      // 不显示倒计时
      show_someone.start_time = false;
      // 此时同步更新match_stage组件的时间
      useMittEmit(MITT_TYPES.EMIT_MATCH_NOSTART);
    }
    // 同上注释
    let new_long_time = Math.floor((+props.detail_data.mgt - now) / 1000 / 60);
    if (new_long_time == 0) { new_long_time += 1 }
    longTime.value = new_long_time;
  }, 1000 * 1)
}
onMounted(initEvent)
watch(() => props.detail_data.mgt, () => initEvent())



/**
 * @Description 主比分
 * @param {object} undefined
 */
const s1_score = computed(() => {
  let score = {
    home: null,
    away: null
  }
  lodash.forEach(props.detail_data.msc, item => {
    if (item.split("|")[0] == "S1") {
      score = {
        home: formatTotalScore(props.detail_data, 0),
        away: formatTotalScore(props.detail_data, 1),
        // 添加上mid ,为了判断赛事切换是不是同一场赛事显示进球
        mid:props.detail_data.mid   
      }
    }
  })
  return score
})
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
}

/**
 * @Description 监听主比分变化
 * @param {undefined} undefined
 */
watch(
  () => s1_score.value,
  (new_, old_) => {
    // 两场赛事不一样，直接返回，不需要监听显示
    if (new_.mid!=old_.mid) return
    if (props.detail_data.csid != 1) return
    // 当前赛事，若比分未变化，则提前退出，不展示进球动画
    if (new_.home === old_.home && new_.away === old_.away && !change_match.value) return
    // 顶部切换赛事时，禁止进球动画显示
    if (change_match.value) {
      change_match.value = false
      return
    }
    // 若主(客)队比分数值变化，则更新对应时间
    if (new_.home > 0 || new_.away > 0) scoreTime.S1 = Date.now()
    // 主队比分数值
    if (new_.home > 0 && new_.home >= old_.home) {
      show_someone.is_show_home_goal = scoreTime.S1 > scoreTime.S11
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_home_goal()
      change_match.value = false
    } else {
      show_someone.is_show_home_goal = false
    }
    // 客队比分数值
    if (new_.away > 0 && new_.away >= old_.away) {
      show_someone.is_show_away_goal = scoreTime.S1 > scoreTime.S11
      /**
      * ?迷之debounce操作 ???
      * !PC内存泄漏优化-节流和防抖优化01
      */
      hide_away_goal()
      change_match.value = false
    } else {
      show_someone.is_show_away_goal = false
    }
  }
)
/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
 */
const hide_home_goal = lodash.debounce(() => {
  show_someone.is_show_home_goal = false
}, 5000)
/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
*/
const hide_away_goal = lodash.debounce(() => {
  show_someone.is_show_away_goal = false
}, 5000)


/**
 * @Description 红牌比分
 * @param {object} undefined
 */
const s11_score = computed(() => {
  let score = {
    home: null,
    away: null
  }
  lodash.forEach(props.detail_data.msc, item => {
    if (item.split("|")[0] == "S11") {
      score = {
        home: item.split("|")[1].split(":")[0] || 0,
        away: item.split("|")[1].split(":")[1] || 0
      }
    }
  })
  return score
})
/**
 * @Description 监听红牌比分变化
 * @param {undefined} undefined
 */
watch(
  () => s11_score.value,
  (new_, old_) => {
    if (props.detail_data.csid != 1) return
    // 当前赛事，若比分未变化，则提前退出，不展示红牌动画
    if (new_.home === old_.home && new_.away === old_.away && !change_match.value) return
    // 顶部切换赛事时，禁止红牌动画显示
    if (change_match.value) {
      change_match.value = false
      return
    }
    // 若主(客)队红牌数值变化，则更新对应时间
    if (new_.home > 0 || new_.away > 0) scoreTime.S11 = Date.now()
    // 主队红牌数值
    if (new_.home > 0 && new_.home >= new_.away) {
      show_someone.is_show_home_red = !show_someone.is_show_home_goal && scoreTime.S11 > scoreTime.S1
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_home_red()
    } else {
      show_someone.is_show_home_red = false
    }
    // 客队红牌数值
    if (new_.away > 0 && new_.away >= new_.home) {
      show_someone.is_show_away_red = !show_someone.is_show_away_goal && scoreTime.S11 > scoreTime.S1
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_away_red()
    } else {
      show_someone.is_show_away_red = false
    }
  }
)

/**
 * @Description 隐藏主队红牌动画
 * @param {undefined} undefined
 */
const hide_home_red = lodash.debounce(() => {
  show_someone.is_show_home_red = false
}, 5000)
/**
 * @Description 隐藏客队红牌动画
 * @param {undefined} undefined
 */
const hide_away_red = lodash.debounce(() => {
  show_someone.is_show_away_red = false
}, 5000)


const eports_scoring = computed(() => {
  //比分判断处理
  let scoring = false
  //如果是电竞，则进行比分判定处理
  if (MenuData.get_menu_type() == 3000) {
    const mmp_state = props.detail_data.mmp || 1
    scoring = mmp_state != (Number(s1_score.value.home) + Number(s1_score.value.away) + 1)
  }
  return scoring
})

/** 
 * ?轮训 
 */
const timerInterval = ref(null)
const clear_timerInterval = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}
/** 延时器 */
onBeforeUnmount(clear_timerInterval)
const timer1_ = ref(null)
const clear_timer1_ = () => {
  if (timerInterval.value) {
    clearTimeout(timer1_.value)
    timer1_.value = null
  }
}
onBeforeUnmount(clear_timer1_)




// const set_video_url = (data) => store.dispatch({ type: 'videoReducer.set_video_url', data })
// const set_show_video = (data) => store.dispatch({ type: 'videoReducer.set_show_video', data })
// const set_iframe_onload = (data) => store.dispatch({ type: 'videoReducer.set_iframe_onload', data })
/** 视频播放 */
const icon_click = () => {
  const data = {
    media_src: props.detail_data.vurl,
    active: 'muUrl',
  };
  const ua = navigator.userAgent.toLowerCase();
  // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
  // 判断是否是苹果手机，是则是true
  const isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
  if (isIos) {
    data.media_src = props.detail_data.vurl
  } else {
    data.media_src = props.detail_data.varl || props.detail_data.vurl
  }
  set_video_url(data);
  set_show_video(true);
  set_iframe_onload(false);
  clear_timer1_()
  timer1_.value = setTimeout(() => set_iframe_onload(true), 2000)
}

const { off } = useMittOn(MITT_TYPES.EMIT_MATCH_TIME_SHOW_INIT, initEvent)
onBeforeUnmount(off)

</script>

<script>
export default defineComponent({
  name: "header-top",
}) 
</script>
<style scoped lang="scss">
/****************** 横屏投注弹窗*******************/
@import "../../styles/header-top.scss";
.midfield-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.logo-double{
  :deep(.team-img){
    .img-style{
      background-position-y: inherit !important;
    }
  }
}
</style>