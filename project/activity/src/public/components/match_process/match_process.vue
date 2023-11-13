<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 比赛进程
-->
<template>
  <div
    class="c-match-process text-center"
    :class="rows == 1 ? 'row a-row' : 'column'"
  >
    <div
      v-show="match_props.match.mcid && show_page == 'match-list'"
      class="jingcai"
    >
      {{ match_props.match.mcid }}
    </div>
    <!-- ms值3-比赛结束 4-比赛关闭 -->
    <!-- 内嵌版时间信息显示 -->
    <template  v-if="is_iframe">
      <template v-if="right">
        <div :class="is_iframe ?'show_row':''">
            <div
            v-show="
              $utils.get_match_status(match_props.match.ms)  || [3,4].includes(1*match_props.match.ms) ||
              (match_props.match.mcid && match_props.match.mmp != 0)
            "
            class="process-name"
          >
              <div v-html="computed_process_name"></div>
              <q-tooltip
                anchor="top middle"
                self="center middle"
                :content-style="tooltip_style"
              >{{computed_process_name}}</q-tooltip>
          </div>
          <match-date
            :rows="date_rows"
            v-if="computed_show_date"
            :match_props="match_props"
            :match_list_data="match_list_data"
            class="date-wrap"
          />
        </div>
      </template>
      <template v-else>
          <div v-show="
              $utils.get_match_status(match_props.match.ms)  || [3,4].includes(1*match_props.match.ms) ||
              (match_props.match.mcid && match_props.match.mmp != 0)
            "
            class="process-name"
          >
              <div v-html="computed_process_name"></div>
              <q-tooltip
                anchor="top middle"
                self="center middle"
                :content-style="tooltip_style"
              >{{computed_process_name}}</q-tooltip>
          </div>
          <match-date
            :rows="date_rows"
            v-if="computed_show_date"
            :match_props="match_props"
            :match_list_data="match_list_data"
            class="date-wrap"
          />
      </template>
    </template>
    <!-- 非内嵌版时间信息显示 -->
      <div
        v-if="!is_iframe"
        v-show="
          $utils.get_match_status(match_props.match.ms)  || [3,4].includes(1*match_props.match.ms) ||
          (match_props.match.mcid && match_props.match.mmp != 0)
        "
        class="process-name"
      >
        <div v-html="computed_process_name"></div>
        <q-tooltip
          anchor="top middle"
          self="center middle"
          :content-style="tooltip_style"
        >{{computed_process_name}}</q-tooltip>
      </div>
      <match-date
        :rows="date_rows"
        v-if="computed_show_date &&!is_iframe"
        :match_props="match_props"
        :match_list_data="match_list_data"
        class="date-wrap"
      />
  
    <!--补充时间-->
    <!-- <template v-if="show_fill_time">
      第二行显示的时间阶段时间+补时分钟数
      <div :class="{'fill-time': match_props.source=='detail'}">{{format_second_ms(cur_mmp_time,'default')}} + {{cur_fill_second}}'</div>
      第三行补时倒计时部分
      <div class="c-match-date text-center date-wrap" :class="{'count-down': match_props.source=='detail'}">
        <timer :tconfig="{
          time:Number(cur_fill_time),
          time_format:(second)=>format_second_ms(second,'default'),
          step:-1,
          timer_ms:1000,
          on_time_change:count_down_change,
          source: (match_props.source)
        }"
      />
      </div>
    </template>
    <template v-else> -->
  
    <!-- </template> -->
  </div>
</template>

<script>
import global_mixin from "src/public/mixins/global/global_mixin.js";
import msc_mixin from "src/public/mixins/common/msc.js";
import matchDate from "src/public/components/match_date/match_date.vue";
import time_format_mixin from "src/public/mixins/common/time_format";
import timer from "src/public/components/timer.vue";
import licia_format from 'licia-es/format';

export default {
  name: "MatchProcess",
  mixins: [global_mixin, msc_mixin, time_format_mixin],
  data() {
    return {
      is_iframe: window.is_iframe,
      // 增加阶段对应的正常时间
      mmp_time_obj: {
        // key: 球种id value: 阶段对应的时间(秒数)
        "1": {
          "6": 45 * 60, // 上半场
          "7": 90 * 60, // 下半场
          "41": 105 * 60, // 加时赛上半场
          "42": 120 * 60 // 加时赛下半场
        }
      },
      // 当前阶段时间(秒数)
      cur_mmp_time: 0,
      // 补充时间(秒数)
      cur_fill_time: 0,
      // 补充的分钟
      cur_fill_second: 0
    }
  },
  components: {
    matchDate,
    timer
  },

  props: {
    // 当场赛事信息
    match_props: Object,
    match_list_data: Object,
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
    right:Boolean,
  },
  created() {
    this.$root.$on(this.emit_cmd.EMIT_INIT_FILL_TIME_CMD,this.init_fill_time);
    this.init_fill_time();
  },
  computed: {
    // 获取阶段名称
    computed_process_name() {
      let { match } = this.match_props;
      let process_name = this.get_mmp_name(match.csid, match.mmp) || "";
      
      // 即将开赛
      if(match.ms == 110){
        process_name = this.$root.$t("common.match_soon");
      }
      // 滚球 && 未开赛
      else if (this.$utils.get_match_status(match.ms) && match.mmp == 0) {
        switch (Number(match.csid)) {
          // 足
          case 1:
            process_name = this.$root.$t("common.up_half");
            break;
          // 篮
          case 2:
            process_name =
              match.mle == 17
                ? this.$root.$t("common.up_half")
                : this.$root.$t("common.first_match");
            break;
          //棒球
          case 3:
            process_name = this.$root.$t("mmp.3.401");
            break;
          //冰球
          case 4:
            process_name = this.$root.$t("mmp.4.1");
            break;
          // 网球
          case 5:
            process_name = this.$root.$t("mmp.5.8");
            break;
          // 美式足球
          case 6:
            process_name = this.$root.$t("mmp.6.13");
            break;
          // 斯诺克
          case 7:
            process_name = this.covert_mct(match);
            break;
          // 乒乓球
          case 8:
          // 排球
          case 9:
          // 羽毛球
          case 10:
            process_name = this.$root.$t("mmp.10.8");
            break;
        }

        // 电竞
        if(this.$utils.is_eports_csid(match.csid)){
          process_name = this.$root.$t("mmp.100.1");
        }
      
      }else {
        // 篮球(2) && 赛制为 17分钟 && 第四节(100) ====> 阶段名称显示 "下半场"
        if (match.csid == 2 && match.mle == 17 && match.mmp == 100) {
          process_name = this.$root.$t("mmp.2.2");
        }

        // 斯诺克(7) 的滚球(21)
        if (match.csid == 7 && match.mmp == 21) {
          process_name = this.covert_mct(match);
        }
      }
      // 篮球3X3滚球时显示"全场"
      if(match.csid == 2 && match.mle == 73 && this.$utils.get_match_status(match.ms)) {
        if(match.ms != 110){
          process_name = this.$root.$t("mmp.2.21");
        }
      }
      //是否列表页棒球第X局，换行显示
      if (
        this.match_props.match.csid == 3 &&
        this.show_page == "match-list" &&
        process_name.indexOf("第") == 0
      ) {
        return process_name.replace(" ", "<br/>");
      } else {
        return process_name;
      }
    },

    // 是否赛事显示时间
    computed_show_date() {
      let { mmp, csid, ms, mlet } = this.match_props.match;
      csid = Number(csid);
      let show = false;
 
      // 全场结束 || 即将开赛 时不显示时间组件
      if (mmp == 999 || ms == 110) {
        show = false;
      }
        // 足、篮、冰、美足、手、拳、沙排、英式橄榄球、曲棍球、水球 时才显示【赛事日期】
        // 电竞赛事未开赛也展示赛事日期
      else if ([1, 2, 4, 6, 11, 12, 13, 14, 15, 16].includes(csid) || this.$utils.is_eports_csid(csid)) {
        show = true;

        // 冰、美足 mlet 为空时不显示
        if ([4, 6].includes(csid) && mlet == "") {
          show = false;
        }
      } else {
        // 非足、篮、冰、美足  不是滚球时才显示【赛事日期】
        show = !this.$utils.get_match_status(ms);
      }

      return show;
    },
    /**
     * 显示补时时间
     */
    show_fill_time() {
      let {match, source} = this.match_props;
      // 足球需要显示不是时间的阶段 6:上半场 7:下半场 41:加时赛上半场 42:加时赛下半场
      let football_mmp = ['6', '7', '41', '42'];
      return source &&(match.csid==1 && this.$utils.get_match_status(match.ms,[110]) && football_mmp.includes(match.mmp) && match.mststs==1);
    }
  },

  watch: {
    computed_process_name: {
      handler() {
        // 【网羽乒斯】比分处理
        this.score_switch_handle(this.match_props.match);        
      },
      immediate: true,
    },
    show_fill_time() {
      // 显示补时的时候重新获取下最新的补时时间
      this.init_fill_time();
    },
    "match_props.match.mstst"() {
      this.init_fill_time();
    },
    "match_props.match.mststi"() {
      this.init_fill_time();
    }
  },

  methods: {
    /**
     * @description 将 mct 转成相应的 阶段名称
     * @param  {object} match  当场赛事信息
     * @return {string} 转换后的阶段名称
     */
    covert_mct({ mct, mmp, ms }) {
      // 已开赛但接口没给 mmp 时显示第一局
      if (ms == 1 && mmp == 0) {
        mct = "1";
      } else {
        mct = mct.toString();
      }

      let lang = _.get(window.vue,"lang") || 'en'
     // console.error(lang)

      let new_num = mct;

      if(lang=="zh"){
        
        new_num = this.$utils.numberToChinese(mct);
      }

      let rs = licia_format(this.$root.$t("mmp.7.x"), new_num);
      return rs

    },
    /**
     * 倒计时计时器
     */
    count_down_change(obj) {
      this.timer_obj = obj;
      let _cur_time = Number(obj.tconfig.time)
      if (_cur_time + obj.timer_tmp < 1) {
        obj.time_str = `00:00`;
        obj.clear();
      } 
    },
    /**
     * 初始化补充时间
     */
    init_fill_time(skt_mid) {
      let {mid, mmp, csid } = this.match_props.match;
      if((skt_mid && skt_mid != mid) || !this.show_fill_time) {
        return;
      }
      // 补充时间(倒计时部分)
      this.cur_fill_time = _.get(this.match_props, 'match.mstst') || 0;
      // 当前阶段对应的正常时间(在第多少分钟时结束)
      this.cur_mmp_time = this.mmp_time_obj[csid][mmp];
      // 补充时间(+分钟部分) (补时多少分钟)
      this.cur_fill_second = _.get(this.match_props, 'match.mststi') || 0;
    }
  },
  destroyed() {
    this.mmp_time_obj = {};
    this.cur_mmp_time = null;
    this.cur_fill_time = null;
    this.cur_fill_second = null;
    this.$root.$off(this.emit_cmd.EMIT_INIT_FILL_TIME_CMD, this.init_fill_time);
  }
};
</script>

<style lang="scss" scoped>
.row {
  &.a-row{
    flex-shrink: 0;
    .date-wrap {
      padding: 0 10px;
      ::v-deep .timer-layout {
        padding: 0;
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
.fod_show .football-after .info-time .match-date .show_row{
display: flex;
  }
</style>
