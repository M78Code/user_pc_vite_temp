<!--
 * @
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛果足球
-->
<template>
  <div class="wrap-table">
    <div class="table-header">{{ results_list }}1111
      <div class="table-col cursor" @click="change_sort">
        <span>{{ i18n_t("results.date") }}</span>
        <div class="sort icon" :class="{ up: is_sortUp }"></div>
      </div>
      <div class="table-col">{{ i18n_t("results.league") }}</div>
      <div class="table-col">{{ i18n_t("results.competition") }}</div>
      <!-- 黄牌上 -->
      <div class="table-col">
        <div class="yellow_card_up icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.yellow_card_up") }}</q-tooltip
          >
        </div>
      </div>
      <!-- 黄牌 下 -->
      <div class="table-col">
        <div class="yellow_card_down icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.yellow_card_down") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <div class="yellow_card icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.yellow_card") }}</q-tooltip
          >
        </div>
      </div>
      <!-- 红牌上 -->
      <div class="table-col">
        <div class="red_card_up icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.red_card_up") }}</q-tooltip
          >
        </div>
      </div>
      <!-- 红牌下 -->
      <div class="table-col">
        <div class="red_card_down icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.red_card_down") }}</q-tooltip
          >
        </div>
      </div>
      <!-- 红牌 -->
      <div class="table-col">
        <div class="red_card icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.red_card") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <!-- 上半场角球 -->
        <div class="rs_jiao_shang icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.first_half_corner") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <!-- 下半场角球 -->
        <div class="rs_jiao_xia icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.second_half_corner") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <!-- 全场角球 -->
        <div class="rs_jiao_quan icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >
            <template v-if="lang == 'vi'"> Phạt góc cả trận </template>
            <!-- 全场角球 -->
            <template v-else>
              {{ i18n_t("icon_tips.overall") }} {{ i18n_t("list.corner") }}
            </template>
          </q-tooltip>
        </div>
      </div>
      <div class="table-col goal">
        <!-- 上半场进球 -->
        <div class="rs_jin_up icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.first_half_goal") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <!-- 下半场进球 -->
        <div class="rs_jin_down icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.second_half_goal") }}</q-tooltip
          >
        </div>
      </div>
      <div class="table-col">
        <!-- 全场进球 -->
        <div class="rs_jin_quan icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >
            <template v-if="lang == 'vi'"> Bàn thắng cả trận </template>
            <!-- 全场进球 -->
            <template v-else>
              {{ i18n_t("icon_tips.overall")
              }}{{ i18n_t("icon_tips.goal") }}
            </template>
          </q-tooltip>
          <!-- <icon name="icon-rs_jin_quan" size="16px" /> -->
        </div>
      </div>
      <!-- 加时赛进球 -->
      <div class="table-col goal">
        <div class="rs_add_time icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.overtime_goal") }}</q-tooltip
          >
        </div>
      </div>
      <!-- 点球大战 -->
      <div class="table-col">
        <div class="rs_dian icon">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ i18n_t("icon_tips.penalty_shootout") }}</q-tooltip
          >
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
import results from "src/core/match-results/match-results-mixin/index";
import { i18n_t} from 'src/core/index.js' 
import UserCtr from "src/core/user-config/user-ctr.js";
console.log(UserCtr.user_info,'UserCtr.user_info.merchantEventSwitchVO');
// import Tabs from "../components/playback_tabs.vue";
// import SliderX from "../components/playback_slider.vue";
// import no_data from "src/components/no_data/no_data";
export default {
  mixins: [results],
  components: {
    // Tabs,
    // SliderX,
    // "no-data": no_data
  },
  computed:{

    show_play_back(){
      return !!(UserCtr.user_info.merchantEventSwitchVO && UserCtr.user_info.merchantEventSwitchVOt.eventSwitch)
    }
  },
  data() {
    return {
      UserCtrInfo:UserCtr.user_info.merchantEventSwitchVO,
      i18n_t,
      tab_list: [
        // { title: i18n_t("replay_video.all"), code: "0" },
        // { title: i18n_t("replay_video.goal"), code: "1" },
        // { title: i18n_t("replay_video.corner_kick"), code: "2" },
        // { title: i18n_t("replay_video.punish"), code: "3" },
      ],
      // 当前精彩事件类型
      current_events_type: "0",
      is_expand_video_list: false,
      slideWidth: "1000px",
      slide: "style",
      lorem:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo provident incidunt ducimus iusto perferendis porro earum. Totam, numquam?",
    };
  },
  methods: {
    // 切换精彩回顾列表类型
    change_video_history_list({ tab, index }) {
      this.current_events_type = tab.code;
      this.change_playback_type(tab);
      if (this.$refs.drag_scroll && this.$refs.drag_scroll[0]) {
        this.$refs.drag_scroll[0].isShowBtn()
      }
    },
    handle_item_click(item) {
      // 弹出新视频
      let title = item.homeAway+' '+this.format_second_ms(item.secondsFromStart)+' '+this.show_code_name(item.eventCode)+': '+item.firstNum;
      this.$root.$emit("VIDEO_ZONE_EVENT_CMD", {
        cmd: "resultPlay",
        url: item.fragmentVideo,
        video_info:item,
        title,
      });
    },
    show_code_name(type) {
      let event_name;
      switch (type) {
        case "goal":
          event_name = i18n_t("replay_video.goal");
          break; // 进球
        case "corner":
          event_name = i18n_t("replay_video.corner_kick");
          break; // 角球
        case "red_card":
          event_name = i18n_t("icon_tips.red_card");
          break; // 红牌
        case "yellow_card":
          event_name = i18n_t("icon_tips.yellow_card");
          break; // 黄牌
        case "yellow_red_card":
          event_name = i18n_t("icon_tips.red_card");
          break; // 黄红牌
        default:
          event_name = "";
          break;
      }
      return event_name;
    },
    resize() {
      if (document.querySelector(".wrap-table")) {
        this.slideWidth =
          document.querySelector(".wrap-table").offsetWidth+'px';
      }
    },
    change_current_events_type() {
      this.current_events_type = "0"
    },
  },
  mounted() {
    debugger
    this.current_events_type = "0"
    // this.resize();
    // window.addEventListener("resize", this.resize);
  },
  destroyed() {
    // Window.removeEventListener("resize", this.resize);
  },
  watch: {
    // 精彩回播配置信息
    // 精彩回播配置信息
    // UserCtrInfo:{
    //     handler(res) {
    //       debugger
    //       // tab按钮开关
    //       let _tab_list = [
    //         {title: i18n_t('replay_video.all'), code: '0'},
    //         {title:i18n_t('replay_video.goal'), code: '1'},
    //       ]
    //       if (res.cornerEvent) {
    //         _tab_list.push({title:i18n_t('replay_video.corner_kick'), code: '2'})
    //       }
    //       if (res.penaltyEvent) {
    //         _tab_list.push({title:i18n_t('replay_video.punish'), code: '3'})
    //       }
    //       // 当角球和罚牌都没有时不显示tab
    //       if (!res.cornerEvent && !res.penaltyEvent) {
    //         // _tab_list = []
    //       }
    //       this.tab_list = _tab_list
    //     },
    //     immediate: true,
    //   },
  }
};
</script>
<style lang="scss" scoped>
.table-col {
  position: relative;
  &:first-child {
    display: flex;
    align-items: center;
    width: 13%;
  }
  &:nth-child(2) {
    padding-left: 20px;
    width: 18%;
  }
  &:nth-child(3) {
    padding-left: 20px;
    width: 18%;
  }
  /*  比分显示部分统一宽度 */
  &:nth-child(n + 4) {
    display: flex;
    justify-content: space-around;
    width: 3.5%;
  }
  .rs_jiao_shang,
  .rs_jiao_xia,
  .rs_jiao_quan,
  .rs_jin_up,
  .rs_jin_down,
  .rs_jin_quan,
  .rs_add_time,
  .yellow_card_up,
  .yellow_card_down,
  .yellow_card,
  .red_card_up,
  .red_card_down,
  .red_card {
    width: 16px;
    height: 16px;
    background-size: cover;
  }
  .rs_dian {
    width: 18px;
    height: 18px;
    background-size: cover;
  }
  .playback-logo {
    position: absolute;
    right: 0;
    top: 0;
    width: 12px;
    height: 12px;
    background-image: var(--qq--match-result-live-icon-bg);
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
.no-data-bg{
  background-image: var(--qq--no-data-icon-bg);
  width: 141px;
  height: 80px;
  background-repeat: no-repeat;
  background-size: 100%;
}
.video-history-item {
  cursor: pointer;
  width: 130px;
  margin-right: 15px;
  .video-history-item_bg {
    width: 130px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 6px;
    position: relative;
    margin-bottom: 3px;
    .play_icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background-image: var(--qq--match-result-play_icon);
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .match_score {
      margin-left: 4px;
      font-size: 16px;
      color: #ffffff;
      font-weight: 700;
    }
  }
  .video-history-item-content{
    background: rgba(51, 51, 51, 0.5);
    width: 100%;
    height: 100%;
    // border: 2px solid transparent;
    border-radius: 6px;
    position: relative;
    margin-bottom: 3px;
  }
  .video-history-item_bg:hover{
    border: 2px solid var(--qq--y0-btn-hover);
    // filter: grayscale(0%);
  }
}
.tab_change_content {
  padding: 15px 0 0 15px;
  border-left: 1px solid var(--qq--yb-border-color7);
  display: inline-block;
}
.play_back_event {
  height: 140px;
  padding: 10px 51px 15px 51px;
  border-left: 1px solid var(--qq--yb-border-color7);
  border-bottom: 1px solid var(--qq--yb-border-color7);
}
/* ************** 赛果详情 *************** -S */
.table-tr-detail {
  .tr-detail-title {
    width: 36.5%;
  }
  .tr-detail-item {
    .item {
      &:nth-child(odd) {
        width: 51.33%;
      }
    }
  }
}

/* ************** 赛果详情 *************** -E */
</style>