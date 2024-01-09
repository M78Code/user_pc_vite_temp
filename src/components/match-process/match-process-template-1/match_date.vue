<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事日期【列表、详情】
-->
<template>
  <div class="c-match-date text-center" :class="{ column: rows === 2 }">
    <!-- 今日赛事(mcg:3) 早盘(mcg:4) || 1小时内开赛超时 -->
    <template
      v-if="
        ([3, 4].includes(Number(match.mcg)) ||
          before_timeout ||
          is_eports_csid(match.csid)) &&
        !get_match_status(match.ms)
      "
    >
        <span style="min-width: 60px"
          >{{ computed_today_early_date[0] }}
          <br v-if="date_show_type === 'br'" />
        </span>
        <span>{{ computed_today_early_date[1] }}</span>
    </template>
    <!-- 1小时内开赛(mcg:2) && !1小时内开赛超时-->
    <template v-if="match.mcg == 2 && !before_timeout">
      <timer
        :tconfig="{
          match: match,
          time: Number(match.mgt),
          step: -1,
          timer_ms: 1000,
          on_time_change: before_start_timer_change,
        }"
        :date_show_type="date_show_type"
        :match="match"
      />
    </template>
    <!-- 滚球(ms:1) -->
    <template v-if="get_match_status(match.ms, [110])">
      <!-- 计时器  -->
      <timer
        v-if="inplay_match_type == 1"
        :tconfig="{
          match: match,
          time: cur_timer(),
          time_format: (second) => format_second_ms(second, 'default'),
          step: match.mess == 0 ? 0 : get_inplay_timer_step,
          timer_ms: 1000,
          on_time_change: inplay_timer_change,
        }"
        :date_show_type="date_show_type"
        :match="match"
      />

      <!-- 显示:00:00 || 节制  -->
      <span v-show="[0, 2].includes(inplay_match_type)">{{
       counting_time_ctr_show_format(match, inplay_match_content)
      }}</span>
    </template>
  </div>
</template>

<script>
import timer from "src/components/timer/timer.vue";
import {get_match_status,i18n_t,get_remote_time } from 'src/output/index.js';
import { counting_time_ctr_show_format_ouzhou,format_second_ms ,counting_time_ctr_show_format ,format_time_zone_millisecond,format_date_base_obj} from "src/core/format/common/index.js"

import {is_eports_csid}  from "src/core/constant/common/module/csid-util.js";
import lodash from "lodash";
// ;
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/";
export default {
  name: "MatchDate",
  components: {
    timer,
  },
  props: {
    // 当前赛事信息
    match: {
      type: Object,
      default: () => {}
    },
    // 行数
    rows: {
      type: Number,
      default: 1,
    },
     // 日期是否换行
    date_show_type: {
      type: String,
      default: 'br',
    },
    match_list_data: Object, // 传入赛事数据 15分钟玩法计算时段需要
  },

  data() {
    return {
      is_eports_csid,
      get_match_status,
      format_second_ms,
      counting_time_ctr_show_format,
      counting_time_ctr_show_format_ouzhou,
      // 滚球显示类型 -1：不显示, 0：00:00, 1：计时器, 2：节制  3：不显示
      inplay_match_type: 1,
      // 滚球显示00:00 || 节制
      inplay_match_content: "",
      // 定时对象
      timer_obj: null,
      // 1小时内开赛时间已过
      before_timeout: false,
    };
  },
  created() {
    // C01赛事使用mstrc字段数据赋值mst
    let mstrc = lodash.get(this.match, "mstrc");
    if (lodash.get(this.match, "cds") == "C01" && mstrc) {
      this.match.mst = mstrc;
    }
  },
  computed: {
    // 今日&&早盘时间
    computed_today_early_date() {
      let _mgt = format_time_zone_millisecond(
        Number(this.match.mgt)
      );
      var date_obj = format_date_base_obj(_mgt);
      let rs_date = i18n_t("time.time_date_5")
        .replace("mm", date_obj.m)
        .replace("dd", date_obj.d)
        .replace("hh", date_obj.h)
        .replace("ii", date_obj.mm);
      return rs_date.split(" ");
    },

    // 滚球 timer-dom 组件 步长
    get_inplay_timer_step() {
      let { csid, mmp, mle } = this.match;

      let timer_step = false;
      csid = parseInt(csid);
      mmp = parseInt(mmp);
      let mmps = "";
      switch (csid) {
        // 足球 | 手球
        case 1:
        case 11:
          // 上半场,下半场,加时赛上半场,加时赛下半场
          mmps = [6, 7, 41, 42];
          if (mmps.includes(mmp)) {
            timer_step = 1;
            // C01赛事显示倒计时优化(使用每场比赛90分钟进行换算)
            if (
              lodash.get(this.match, "cds") == "C01" &&
              csid == 1
            ) {
              switch (lodash.get(this.match, "mle") + "") {
                case "57": // 2 * 4分钟 加中场休息时间4分钟=>按照720秒换算
                  timer_step = 7.5;
                  break;
                case "66": // 2 * 5分钟 加中场休息时间4分钟=>按照840秒换算
                  timer_step = 6.428571;
                  break;
                case "55": //2 * 6分钟 (10.5s累加1分钟)
                  timer_step = 5.7142;
                  break;
                default:
                  break;
              }
            }
          }
          break;

        // 篮球
        case 2:
          // 上半场,下半场,第一节,第二节,第三节,第四节,加时赛
          mmps = [1, 2, 13, 14, 15, 16, 40];

          // 篮球 3*3 的 mmp 为 21 也开始计时
          if (mle == 73) {
            mmps.push(21);
          }

          if (mmps.includes(mmp)) {
            timer_step = -1;
          }
          break;

        // 冰球
        case 4:
          // 第一局 第二局 第三局 加时赛 点球大战
          mmps = [1, 2, 3, 40, 50];
          if (mmps.includes(mmp)) {
            timer_step = 1;
          }
          break;

        // 美式足球
        case 6:
          // 第一节 第二节 第三节 第四节 加时赛
          mmps = [13, 14, 15, 16, 40];
          if (mmps.includes(mmp)) {
            timer_step = -1;
          }
          break;

        // 橄榄球
        case 14:
          // 上半场,下半场, 加时上半场, 加时下半场
          mmps = [6, 7, 41, 42];
          if (mmps.includes(mmp)) {
            // 倒计时：1--7人制 正计时：0--15人制  2--10人制
            timer_step = mle == 1 ? -1 : 1;
          }
          break;

        // 曲棍球
        case 15:
          // 第一节 第二节 第三节 第四节 加时赛
          mmps = [13, 14, 15, 16, 40];
          if (mmps.includes(mmp)) {
            timer_step = -1;
          }
          break;

        // 水球
        case 16:
          // 第一节 第二节 第三节 第四节
          mmps = [13, 14, 15, 16];
          if (mmps.includes(mmp)) {
            timer_step = -60;
          }
          break;
      }
      // 电竞
      if (is_eports_csid(csid)) {
        // 第一节 第二节 第三节 第四节 .....
        mmps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        if (mmps.includes(mmp)) {
          timer_step = 1;
        }
      }

      return timer_step;
    },
  },

  watch: {
    //赛事阶段 对应 code： http://172.18.178.153:8090/pages/viewpage.action?pageId=10165063
    "match.mmp": {
      handler(cur) {
        this.set_ininplay_match(cur);
      },
      deep: true,
      immediate: true,
    },

    "match.ms": {
      handler(cur) {
        this.set_ininplay_match(this.match.mmp);
      },
    },

    "match.mess": {
      handler(cur, pre) {
        if (cur == "0" && this.match.csid == 2) {
          this.timer_obj && this.timer_obj.clear();
        } else if (cur == 1 && pre != 1) {
          if (this.timer_obj) {
            this.set_ininplay_match(this.match.mmp);

            this.timer_obj.replay = true;
            this.timer_obj = this.timer_obj.start();
          }
        }
      },
    },
  },
  methods: {
    //热门推荐计算准确时间
    cur_timer() {
      //防止时间变成NaN
      let timer = Number(this.match.mst || 0); 
      // C01赛事使用mstrc字段数据
      let mstrc = lodash.get(this.match, "mstrc");
      if (lodash.get(this.match, "cds") == "C01" && mstrc) {
        timer = Number(mstrc);
      }
      if (this.match.cur_timer) {
        return (
          timer +
          Math.round(
            (new Date().getTime() - this.match.cur_timer) / 1000
          )
        );
      } else {
        return timer;
      }
    },

    /**
     * @description 滚球 timer-dom 组件 时间变化时触发
     * @param  {object} obj  时间对象
     * @return {undefined} undefined
     */
    inplay_timer_change(obj) {
      this.timer_obj = obj;
      let _cur_time = Number(obj.tconfig.time);
      if (_cur_time + obj.timer_tmp < 1) {
        obj.time_str = `00:00`;
        obj.clear();
      }
      let {
        csid,
        tab_play_keys = "",
        tpl_id,
        mid,
      } = this.match || {};
      // 水球（16）显示为  < X分钟
      if (csid == 16) {
        let mins = _cur_time / 60;
        obj.time_str = i18n_t("match_info.match_date_format").replace("%s", mins);
      }
      // 足球计算15分钟玩法阶段 根据倒计时计算15分钟玩法阶段 避免时间改变赛事阶段切换延迟
      if (
        (tab_play_keys.includes("Minutes") || tpl_id == 24) &&
        this.match_list_data
      ) {
        let mst = parseInt(obj.tconfig.time) + obj.timer_tmp;
        this.match_list_data.set_min15(this.match, mst, () => {
          useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, { mids: [mid] });
        });
      }
    },

    /**
     * @description 1小时内开赛 timer-dom 组件
     * @param  {object} obj  时间对象
     * @return {undefined} undefined
     */
    before_start_timer_change(obj) {
      let now_time = get_remote_time();
      let match_start_time =
        parseInt(obj.tconfig.time) + parseInt(obj.timer_tmp);
      // 判断是否已开赛
      if (now_time >= match_start_time) {
        this.before_timeout = true;

        obj.clear();
        return;
      }

      let time_tmp = (match_start_time - now_time) / 1000;
      if (time_tmp < 60) {
        //一分钟之内
        obj.time_str = 1 + i18n_t("list.after_time_start2");
      } else {
        //大于一分钟的提示
        obj.time_str =
          Math.floor(parseInt(time_tmp / 60)) +
          " " +
          i18n_t("list.after_time_start2");
      }
    },

    /**
     * @description 设置赛事阶段显示
     * @param  {number} mmp  阶段码
     * @return {undefined} undefined
     */
    set_ininplay_match(mmp) {
      mmp = Number(mmp);
      let { match } = this ;
      let csid = Number(match.csid);
      /** 足球 | 手球 | 橄榄球************************************* */
      if (get_match_status(match.ms)) {
        if ([1, 11, 14].includes(csid)) {
          // [中场休息,即将加时,加时中场休息,点球大战,准备点球大战,比赛中断,比赛放弃时,	第四节结束,加时赛结束,点球大战结束]——不显示
          if ([31, 32, 33, 34, 50, 80, 90, 110, 120].includes(mmp)) {
            this.inplay_match_type = -1;
            // [未开赛,下半场结束]
          } else if ([0].includes(mmp)) {
            this.inplay_match_type = 0;
            this.inplay_match_content = "00:00";
          } else if (mmp == 100) {
            this.inplay_match_type = 3;
          } else {
            this.inplay_match_type = 1;
          }

          /** 篮球||冰球||美式足球|曲棍|水球************************************* */
        } else if ([2, 4, 6, 15, 16].includes(csid)) {
          // 篮球中场休息 || 非冰球等待加时 || 美足为加时赛(40)且 mst为0 不显示时间||冰球-等待点球(34) 点球大战(50)|| 冰球、曲棍、水球-等待点球(34) 点球大战(50)
          let not_show =
            (csid == 2 && mmp == 31) ||
            (csid != 4 && mmp === 32) ||
            (csid === 6 && match.mst == 0 && mmp == 40) ||
            ([4, 15, 16].includes(csid) && [34, 50].includes(mmp));

          if (not_show) {
            this.inplay_match_type = -1;
          }

          // 节制：(未开赛，第一节休息，第二节休息，第三节休息)
          else if ([0, 301, 302, 303].includes(mmp)) {
            this.inplay_match_type = 2;
            this.inplay_match_content = match.mlet;

            // 第4节结束 || 开赛时间为 0 || 冰球为等待加时
          } else if (
            mmp == 100 ||
            match.mst == 0 ||
            (csid == 4 && [32].includes(mmp))
          ) {
            this.inplay_match_type = 0;
            this.inplay_match_content = "00:00";
          } else {
            this.inplay_match_type = 1;
          }
        } else if (is_eports_csid(csid)) {
          //  未开赛    开赛时间为 0
          if (mmp == 0 || match.mst == 0) {
            this.inplay_match_type = 0;
            this.inplay_match_content = "00:00";
          } else {
            this.inplay_match_type = 1;
          }
        }
      }
    },
  },
};
</script>
src/core/constant/common/module/csid-util