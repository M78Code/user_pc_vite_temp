<template>
  <div
    class="c-match-process text-center"
    :class="rows == 1 ? 'row a-row' : 'column'"
  >
  <template v-if="match">
    <!-- 不展示额外时间 -->
    <!-- <div
      v-show="lodash.get(match, 'mcid') && lodash.get(match, 'mcid').trim() && show_page == 'match-list'"
      class="jingcai"
    >
      {{ lodash.get(match, 'mcid') }}
    </div> -->
    <!-- ms值3-比赛结束 4-比赛关闭 -->
    <div
      v-show="
        get_match_status(match.ms)  || [3,4].includes(1*match.ms) || (match.mcid && match.mmp != 0)
      "
      class="process-name"
      :class="[periodColor === 'gray' && 'gray-color']"
      v-if="computed_process_name?.length"
      v-html="computed_process_name"
    >
    </div>
    <match-date
      :rows="date_rows"
      v-if="computed_show_date"
      :match="match"
      :date_show_type="date_show_type"
      class="date-wrap"
    />
  </template>
  </div>
</template>
<script setup>
import { computed, ref, watch,onMounted, onUnmounted, inject } from "vue";
import matchDate from "src/components/match-process/match-process-template-1/match_date.vue";
import {
  get_match_status,
  i18n_t,
  format_string,
  is_eports_csid
} from "src/output/index.js"
import { get_mmp_name } from 'src/core/format/project/module/format-msc.js'
import lodash from "lodash";
const props = defineProps({
  source:{
    type:String,
  },
  // 当场赛事信息
  match:{
    type:Object,
    default: ()=> ({})
  },
  // 显示的页面
  show_page: {
    type: String,
    default: "",
  },
  // 行数
  rows: {
    type: Number,
    default: 1,
  },
  // 日期行数
  date_rows: {
    type: Number,
    default: 1,
  },
  // 日期是否换行
  date_show_type: {
    type: String,
    default: 'br',
  },
  // 场次颜色
  periodColor: {
    type: String,
    default: '',
  },
  right: Boolean,
});

const mmp_time_obj = ref({
  // key: 球种id value: 阶段对应的时间(秒数)
  1: {
    6: 45 * 60, // 上半场
    7: 90 * 60, // 下半场
    41: 105 * 60, // 加时赛上半场
    42: 120 * 60, // 加时赛下半场
  },
});
const cur_mmp_time = ref(0); // 当前阶段时间(秒数)
const cur_fill_time = ref(0); // 补充时间(秒数)
const cur_fill_second = ref(0); // 补充的分钟
// const matchs = inject('match');
/**
 * 显示补时时间
 */
 const show_fill_time = computed(() => {
  let match = lodash.get(props, 'match')
  let source = lodash.get(props, 'source')
  // 足球需要显示不是时间的阶段 6:上半场 7:下半场 41:加时赛上半场 42:加时赛下半场
  let football_mmp = ["6", "7", "41", "42"];
  return (
    source &&
    match.csid == 1 &&
    get_match_status(lodash.get(props, 'match.ms'), [110]) &&
    football_mmp.includes(match.mmp) &&
    match.mststs == 1
  );
});

/**
 * 初始化补充时间
 */
 const init_fill_time = (skt_mid) => {
  let { mid, mmp, csid } = props.match || {};
  if (!mid || (skt_mid && skt_mid != mid) || !show_fill_time.value) {
    return;
  }
  // 补充时间(倒计时部分)
  cur_fill_time.value = lodash.get(props.match, "mstst") || 0;
  // 当前阶段对应的正常时间(在第多少分钟时结束)
  cur_mmp_time.value = mmp_time_obj.value[csid][mmp];
  // 补充时间(+分钟部分) (补时多少分钟)
  cur_fill_second.value = lodash.get(props.match, "mststi") || 0;
};
// useMitt(MITT_TYPES.EMIT_INIT_FILL_TIME_CMD, init_fill_time);
// 获取阶段名称
const computed_process_name = computed(() => {
  let { match } = props || {};
  if(!match){
    return '';
  }
  let csid = lodash.get(props, 'match.csid')
  let mmp = lodash.get(props, 'match.mmp', '')
  let mle = lodash.get(props, 'match.mle')

  let process_name = Object.keys(get_mmp_name(csid, mmp)).length ? get_mmp_name(csid, mmp) : "";
  // 即将开赛
  if (!Object.keys(process_name).length) process_name = ''
  if (lodash.get(props, 'match.ms') == 110) {
    process_name = i18n_t("common.match_soon");
  }
  // 滚球 && 未开赛
  else if (get_match_status(lodash.get(props, 'match.ms')) && match.mmp == 0) {
    switch (Number(match.csid)) {
      // 足
      case 1:
        process_name = i18n_t("common.up_half");
        break;
      // 篮
      case 2:
        process_name =
          match.mle == 17 ? i18n_t("common.up_half") : i18n_t("common.first_match");
        break;
      //棒球
      case 3:
        process_name = i18n_t("mmp.3.401");
        break;
      //冰球
      case 4:
        process_name = i18n_t("mmp.4.1");
        break;
      // 网球
      case 5:
        process_name = i18n_t("mmp.5.8");
        break;
      // 美式足球
      case 6:
        process_name = i18n_t("mmp.6.13");
        break;
      // 斯诺克
      case 7:
        process_name = covert_mct(match);
        break;
      // 乒乓球
      case 8:
      // 排球
      case 9:
      // 羽毛球
      case 10:
        process_name = i18n_t("mmp.10.8");
        break;
    }

    // 电竞
    if (is_eports_csid(match.csid)) {
      process_name = i18n_t("mmp.100.1");
    }
  } else {
    // 篮球(2) && 赛制为 17分钟 && 第四节(100) ====> 阶段名称显示 "下半场"
    if (csid == 2 && mle == 17 && mmp == 100) {
      process_name = i18n_t("mmp.2.2");
    }

    // 斯诺克(7) 的滚球(21)
    if (csid == 7 && mmp == 21) {
      process_name = covert_mct(match);
    }
  }

  // 篮球3X3滚球时显示"全场"
  if (csid == 2 && mle == 73 && get_match_status(lodash.get(props, 'match.ms'))) {
    process_name = i18n_t("mmp.2.21");
  }
  //是否列表页棒球第X局，换行显示
  if (
    lodash.get(props, 'match.csid')== 3 &&
    props.show_page == "match-list" &&
    process_name.indexOf("第") == 0
  ) {
    //欧洲版，不用换行
    return props.date_show_type === 'inline' ? process_name : process_name.replace(" ", "<br/>");
  } else {
    return process_name;
  }
});

//是否赛事显示时间
const computed_show_date = computed(() => {
  let { mmp, csid, ms, mlet, mgt } = props.match || {};
  csid = Number(csid);
  let show = false;
  // 全场结束 || 即将开赛 时不显示时间组件
  if (mmp == 999 || ms == 110) {
    show = false;
  }
  // 足、篮、冰、美足、手、拳、沙排、英式橄榄球、曲棍球、水球 时才显示【赛事日期】
  // 电竞赛事未开赛也展示赛事日期
  // 欧洲版网球没有展示未开赛时间，在此处加了5
  else if (
    [1, 2, 4, 5, 6,7, 11, 12, 13, 14, 15, 16].includes(csid) ||
    (is_eports_csid(csid))
  ) {
    if (mgt) {
      show = true;
    }
    // 冰、美足 mlet 为空时不显示
    if ([4, 6].includes(csid) && mlet == "") {
      show = false;
    }
  } else {
    // 非足、篮、冰、美足  不是滚球时才显示【赛事日期】
    show = !get_match_status(ms);
  }
  return show;
});



const mstst = computed(() => {
  return lodash.get(props.match, 'mstst')
});

const mststi = computed(() => {
  return lodash.get(props.match, 'mststi')
});

// watch(
//   () => computed_process_name.value,
//   () => {
//     score_switch_handle(props.match);
//   },
//   { immediate: true }
// );
watch(
  () => [mststi.value,mstst.value,show_fill_time.value],
  () => {
    init_fill_time();
  }
);
/**
 * @description 将 mct 转成相应的 阶段名称
 * @param  {object} match  当场赛事信息
 * @return {string} 转换后的阶段名称
 */

const covert_mct = ({ mct, mmp, ms }) => {
  // 已开赛但接口没给 mmp 时显示第一局
  if (ms == 1 && mmp == 0) {
    mct = "1";
  } else {
    mct = mct.toString();
  }

  let lang = lodash.get(window.vue, "lang") || "en";
  // console.error(lang)

  let new_num = mct;

  if (lang == "zh") {
    new_num = numberToChinese(mct);
  }
  let rs = format_string(i18n_t("mmp.7.x"), new_num);
  return rs;
};

/**
 * 倒计时计时器
 */
const count_down_change = (obj) => {
  timer_obj.value = obj;
  let _cur_time = Number(obj.tconfig.time);
  if (_cur_time + obj.timer_tmp < 1) {
    obj.time_str = `00:00`;
    obj.clear();
  }
};

onMounted(() => {
  init_fill_time();
});


onUnmounted(() => {
  mmp_time_obj.value = {};
  cur_mmp_time.value = null;
  cur_fill_time.value = null;
  cur_fill_second.value = null;
});
</script>

<style lang="scss" scoped>
.row {
  &.a-row {
    flex-shrink: 0;

    .date-wrap {
        position: relative;
      padding: 0 10px;

      :deep(.timer-layout) {
        //padding: 0;
        //  display: inline-block;
          // background-color: var(--q-gb-bg-c-10);
      }
    }
  }
}

.fill-time {
  margin-left: 5px;
}

.count-down {
  .timer-layout {
    margin-left: -5px;
  }
}

.process-name.gray-color {
  color: var(--q-gb-t-c-8);
}
.c-match-process{
    position: relative;
}
</style>src/core/format/common/module/format-msc.js