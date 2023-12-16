<template>
  <div class="relative-position header-top" @touchmove.prevent>
    <!-- 队徽 -->
    <div class="row mx-30 top-style flex1">
      <div class="col-3 flex1 logo-double">
        <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
        <team-img
          v-if="!lodash.isEmpty(detail_data)"
          :type="0"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data, 'mhlu[0]')"
          :fr="lodash.get(detail_data, 'frmhn[0]')"
          :size="44"
        ></team-img>

        <team-img
          v-if="
            lodash.get(detail_data, 'mhlu.length') > 1 &&
            !lodash.isEmpty(detail_data)
          "
          :type="0"
          :csid="detail_data.csid"
          :url="detail_data.mhlu[1]"
          :fr="detail_data.frmhn[1]"
          :size="44"
          style="margin-left: -0.1rem"
        ></team-img>
        <div class="row name-wrap mhn">
        <div class="mhn-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'mhn', '').includes('/')">
            <div class="ellipsis">{{ detail_data.mhn.split(" / ")[0] }}/</div>
            <div class="ellipsis">{{ detail_data.mhn.split(" / ")[1] }}</div>
          </template>
          <template v-else>
            {{ detail_data.mhn }}
          </template>
        </div>
        <!-- 进球动画 -->
        <div class="goal-wrap" v-if="show_someone.is_show_home_goal">
          <div class="inner yb-flex-center left">
            <div class="yb-goal-gif yb-goal-yo"></div>
            <div class="gif-text">{{ i18n_t("match_result.goal") }}</div>
          </div>
        </div>
        <div class="red-gif" :class="{ flash: show_someone.is_show_home_red }">
          <div class="inner left"></div>
        </div>
      </div>
      </div>

      <div class="score-style col-3 flex1">
            <div class="col-6">
            <!-- 描述比赛进度相关start -->
            <team-text
              :detail_data="detail_data"
            ></team-text>
            <!-- 描述比赛进度相关end -->
          </div>
          <!-- 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 -->
          <!-- 比赛分数or开赛时间 -->
          <span v-if="detail_data.ms == 0">
            <span
              v-if="show_someone.start_time"
              class="fz_12"
              style="font-weight: 400"
            >
              <!-- 距离开赛时间小于一小时显示倒计时 -->
              {{ i18n_t("list.after_time_start", [longTime]) }}
            </span>
            <span v-else>
              <!--  | format_H_M -->
              {{ formatTime(+detail_data.mgt, "HH:MM") }}
            </span>
          </span>
          <!-- 赛前切滚球 ms=110时:显示即将开赛 -->
          <span v-if="detail_data.ms == 110" class="fz_12" style="font-weight: 400">
            {{ i18n_t(`ms[${detail_data.ms}]`) }}
          </span>
          <!-- 棒球的进攻方绿点在大比分两侧展示 -->
          <span
            v-if="detail_data.csid == '3' && detail_data.mat"
            :class="detail_data.mat == 'home' ? 's-active-dot' : 's-touming'"
            style="position: relative; bottom: 0.05rem"
          ></span>
          <span class="score1" v-if="[1, 2, 3, 4].includes(+detail_data.ms)">
            <!-- 引入相对应的formatUtil,使用其中的方法; -->
            {{ format_total_score(detail_data, 0) }} -
            {{ format_total_score(detail_data, 1) }}
          </span>
          <span
            v-if="detail_data.csid == '3' && detail_data.mat"
            :class="detail_data.mat == 'away' ? 's-active-dot' : 's-touming'"
            style="position: relative; bottom: 0.05rem"
          ></span>
        </div>
      <div class="col-3 flex1 logo-double">
        <!-- 右侧双打图标 type 1 表示客队,malu 客队的url -->
        <team-img
          :type="0"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data, 'malu[0]')"
          :fr="lodash.get(detail_data, 'frman[0]')"
          :size="44"
        ></team-img>
        <team-img
          v-if="lodash.get(detail_data, 'malu.length') > 1"
          :type="1"
          :csid="detail_data.csid"
          :url="detail_data.malu[1]"
          :fr="detail_data.frman[1]"
          :size="44"
          style="margin-left: -0.1rem"
        ></team-img>
        <div class="row name-wrap">
        <div class="red-gif" :class="{ flash: show_someone.is_show_away_red }">
          <div class="inner right"></div>
        </div>
        <!-- 进球动画 -->
        <div class="goal-wrap" v-if="show_someone.is_show_away_goal">
          <div class="inner yb-flex-center right">
            <div class="yb-goal-gif yb-goal-yo"></div>
            <div class="gif-text">{{ i18n_t("match_result.goal") }}</div>
          </div>
        </div>
        <div class="man-name ellipsis-2-lines">
          <template v-if="lodash.get(detail_data, 'man', '').includes('/')">
            <div class="ellipsis">{{ detail_data.man.split(" / ")[0] }}/</div>
            <div class="ellipsis">{{ detail_data.man.split(" / ")[1] }}</div>
          </template>
          <template v-else>
            {{ detail_data.man }}
          </template>
        </div>
      </div>
      </div>
    </div>



  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  defineComponent,
} from "vue";
import lodash from "lodash";
// 1-足球 2-篮球 3-棒球 4冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球 10-羽毛球
import TeamImg from "./team-img.vue";   // 详情页蓝色背景上的大型字母图标
import TeamText from "./team-text.vue";   // 中立场赛事展示
// import TeamName from "src/base-h5/components/details/team-name.vue";   // 详情页背景上的队伍名称

// import match_between_score from 'src/project/components/match/match_between_score.vue'  // 详情页显示赛事当前局比分以及绿色小圆点显示发球方
// import countingDown from 'src/base-h5/components/common/counting-down.vue'   // 赛事进行中每秒变化的计时器
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { i18n_t } from "src/boot/i18n.js"

const props = defineProps({
  detail_data: {
    type: Object,
    default: () => {},
  },
});
/** 赛事开始倒计时时间(赛事开始时间-当前时间) */
const longTime = ref("");
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
});
/** 比分和红牌数值变化时设置时间 */
const scoreTime = reactive({
  S1: 0,
  S11: 0,
});
/** 顶部赛事是否切换 */
const change_match = ref(false);

/** 初始化 */
const initEvent = () => {
  // mgt:赛事开始时间
  let now = new Date().getTime();
  // 赛事开始时间-当前时间 小于一小时并且大于0的时候显示 赛事倒计时
  let bool =
    +props.detail_data.mgt - now < 3600 * 1000 &&
    props.detail_data.mgt - now > 0
      ? true
      : false;
  // 赛事开始倒计时时间(整数)
  let _longTime = Math.floor((+props.detail_data.mgt - now) / 1000 / 60);
  // 赛事开赛时间倒计时为0的时候 让倒计时显示为1分钟
  if (_longTime == 0) {
    _longTime += 1;
  }
  // 此时true或者false 控制是否显示倒计时时间
  show_someone.start_time = bool;
  // 计算出来的倒计时时间赋值给data的变量显示在页面上
  longTime.value = _longTime;

  timerInterval.value = setInterval(() => {
    let now = new Date().getTime();
    // 判断赛事开始时间-当前时间 小于0的时候 清除定时器
    if (+props.detail_data.mgt - now < 0) {
      clear_timerInterval();
      // 不显示倒计时
      show_someone.start_time = false;
      // 此时同步更新match_stage组件的时间
      useMittEmit(MITT_TYPES.EMIT_MATCH_NOSTART);
    }
    // 同上注释
    let new_long_time = Math.floor((+props.detail_data.mgt - now) / 1000 / 60);
    if (new_long_time == 0) {
      new_long_time += 1;
    }
    longTime.value = new_long_time;
  }, 1000 * 1);
};
onMounted(initEvent);
watch(
  () => props.detail_data.mgt,
  () => initEvent()
);

/**
 * @Description 主比分
 * @param {object} undefined
 */
const s1_score = computed(() => {
  let score = {
    home: null,
    away: null,
  };
  lodash.forEach(props.detail_data.msc, (item) => {
    if (item.split("|")[0] == "S1") {
      score = {
        home: formatTotalScore(props.detail_data, 0),
        away: formatTotalScore(props.detail_data, 1),
      };
    }
  });
  return score;
});
/**
 *@description 根据不同赛事阶段取不同的比分
 *@param {Object} match 赛事数据对象
 *@param {Number} num 0-主队  1-客队
 *@return {Number} 主队或客队得分
 */
const formatTotalScore = (match, num) => {
  try {
    if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
    let score_,
      mscmap = new Map(
        match.msc.map((item) => [
          item.split("|")[0],
          item.split("|")[1].split(":"),
        ])
      );
    if (match.csid == "1" || match.csid == "11") {
      //足球和手球
      switch (String(match.mmp)) {
        //  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
        case "41":
        case "33":
        case "42":
        case "110":
          score_ = mscmap.get("S7");
          break;
        // 50 点球大战  120 点球大战结束
        case "50":
        case "120":
          score_ = mscmap.get("S170");
          break;
        // 即将加时和等待点球的阶段固定取0
        case "32":
        case "34":
          score_ = 0;
          break;
        //全场结束,取点球大战比分，加时赛比分或者全场比分
        case "999":
          score_ = mscmap.get("S170") || mscmap.get("S7") || mscmap.get("S1");
          break;
        default:
          score_ = mscmap.get("S1");
          break;
      }
    } else {
      score_ = mscmap.get("S1");
    }
    return (score_ && score_[num]) || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

/**
 * @Description 监听主比分变化
 * @param {undefined} undefined
 */
watch(
  () => s1_score.value,
  (new_, old_) => {
    if (props.detail_data.csid != 1) return;
    // 当前赛事，若比分未变化，则提前退出，不展示进球动画
    if (
      new_.home === old_.home &&
      new_.away === old_.away &&
      !change_match.value
    )
      return;
    // 顶部切换赛事时，禁止进球动画显示
    if (change_match.value) {
      change_match.value = false;
      return;
    }
    // 若主(客)队比分数值变化，则更新对应时间
    if (new_.home > 0 || new_.away > 0) scoreTime.S1 = Date.now();
    // 主队比分数值
    if (new_.home > 0 && new_.home >= new_.away) {
      show_someone.is_show_home_goal = scoreTime.S1 > scoreTime.S11;
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_home_goal();
      change_match.value = false;
    } else {
      show_someone.is_show_home_goal = false;
    }
    // 客队比分数值
    if (new_.away > 0 && new_.away >= new_.home) {
      show_someone.is_show_away_goal = scoreTime.S1 > scoreTime.S11;
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_away_goal();
      change_match.value = false;
    } else {
      show_someone.is_show_away_goal = false;
    }
  }
);
/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
 */
const hide_home_goal = lodash.debounce(() => {
  show_someone.is_show_home_goal = false;
}, 5000);
/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
 */
const hide_away_goal = lodash.debounce(() => {
  show_someone.is_show_away_goal = false;
}, 5000);

/**
 * @Description 红牌比分
 * @param {object} undefined
 */
const s11_score = computed(() => {
  let score = {
    home: null,
    away: null,
  };
  lodash.forEach(props.detail_data.msc, (item) => {
    if (item.split("|")[0] == "S11") {
      score = {
        home: item.split("|")[1].split(":")[0] || 0,
        away: item.split("|")[1].split(":")[1] || 0,
      };
    }
  });
  return score;
});
/**
 * @Description 监听红牌比分变化
 * @param {undefined} undefined
 */
watch(
  () => s11_score.value,
  (new_, old_) => {
    if (props.detail_data.csid != 1) return;
    // 当前赛事，若比分未变化，则提前退出，不展示红牌动画
    if (
      new_.home === old_.home &&
      new_.away === old_.away &&
      !change_match.value
    )
      return;
    // 顶部切换赛事时，禁止红牌动画显示
    if (change_match.value) {
      change_match.value = false;
      return;
    }
    // 若主(客)队红牌数值变化，则更新对应时间
    if (new_.home > 0 || new_.away > 0) scoreTime.S11 = Date.now();
    // 主队红牌数值
    if (new_.home > 0 && new_.home >= new_.away) {
      show_someone.is_show_home_red =
        !show_someone.is_show_home_goal && scoreTime.S11 > scoreTime.S1;
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_home_red();
    } else {
      show_someone.is_show_home_red = false;
    }
    // 客队红牌数值
    if (new_.away > 0 && new_.away >= new_.home) {
      show_someone.is_show_away_red =
        !show_someone.is_show_away_goal && scoreTime.S11 > scoreTime.S1;
      /**
       * ?迷之debounce操作 ???
       * !PC内存泄漏优化-节流和防抖优化01
       */
      hide_away_red();
    } else {
      show_someone.is_show_away_red = false;
    }
  }
);

/**
 * @Description 隐藏主队红牌动画
 * @param {undefined} undefined
 */
const hide_home_red = lodash.debounce(() => {
  show_someone.is_show_home_red = false;
}, 5000);
/**
 * @Description 隐藏客队红牌动画
 * @param {undefined} undefined
 */
const hide_away_red = lodash.debounce(() => {
  show_someone.is_show_away_red = false;
}, 5000);

const eports_scoring = computed(() => {
  //比分判断处理
  let scoring = false;
  //如果是电竞，则进行比分判定处理
  return scoring;
});

/**
 * ?轮训
 */
const timerInterval = ref(null);
const clear_timerInterval = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};
/** 延时器 */
onBeforeUnmount(clear_timerInterval);
const timer1_ = ref(null);
const clear_timer1_ = () => {
  if (timerInterval.value) {
    clearTimeout(timer1_.value);
    timer1_.value = null;
  }
};
onBeforeUnmount(clear_timer1_);

/** 视频播放 */
const icon_click = () => {
  const data = {
    media_src: props.detail_data.vurl,
    active: "muUrl",
  };
  const ua = navigator.userAgent.toLowerCase();
  // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
  // 判断是否是苹果手机，是则是true
  const isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
  if (isIos) {
    data.media_src = props.detail_data.vurl;
  } else {
    data.media_src = props.detail_data.varl || props.detail_data.vurl;
  }

  clear_timer1_();
  timer1_.value = setTimeout(() => set_iframe_onload(true), 2000);
};

const { off } = useMittOn(MITT_TYPES.EMIT_MATCH_TIME_SHOW_INIT, initEvent);
onBeforeUnmount(off);
/**
 *@description 根据不同赛事阶段取不同的比分
 *@param {Object} match 赛事数据对象
 *@param {Number} num 0-主队  1-客队
 *@param {String} key 比赛结束显示指定比分
 *@return {Number} 主队或客队得分
 */
const format_total_score = function (match, num, key) {
  try {
    if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
    let score_,
      mscmap = new Map(
        match.msc.map((item) => [
          item.split("|")[0],
          item.split("|")[1].split(":"),
        ])
      );
    if (match.csid == "1" || match.csid == "11") {
      //足球和手球
      switch (String(match.mmp)) {
        //  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
        case "41":
        case "33":
        case "42":
        case "110":
          score_ = mscmap.get("S7");
          break;
        // 50 点球大战  120 点球大战结束
        case "50":
        case "120":
          score_ = mscmap.get("S170");
          break;
        // 即将加时和等待点球的阶段固定取0
        case "32":
        case "34":
          score_ = 0;
          break;
        //全场结束,取点球大战比分，加时赛比分或者全场比分
        case "999":
          score_ = mscmap.get("S170") || mscmap.get("S7") || mscmap.get("S1");
          key && key.includes("S") && (score_ = mscmap.get(key));
          break;
        default:
          score_ = mscmap.get("S1");
          break;
      }
    } else {
      score_ = mscmap.get("S1");
    }
    return (score_ && score_[num]) || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
/**
 * @description: 格式化时间
 * @param {Number} timestamp 时间戳
 * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
 * @return {String} 格式好的时间
 */
 const formatTime = (timestamp, fmt) => {
  try {
    // const date = new Date(parseInt(timestamp))
    const date = new Date(format_time_zone_millisecond(parseInt(timestamp)));
    let ret;
    let opt = {
      "Y+":
        fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "y+":
        fmt.lastIndexOf("y") - fmt.indexOf("y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "D+": date.getDate().toString(), // 日
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "h+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString(), // 秒
      "s+": date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  } catch (error) {}
};
</script>

<script>
export default defineComponent({
  name: "header-top",
});
</script>
<style scoped lang="scss">
/****************** 横屏投注弹窗*******************/
@import "./header-top.scss";
</style>
