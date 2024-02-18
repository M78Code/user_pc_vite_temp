<!--
 * @
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛果足球
-->
<template>
  <div class="wrap-table">
    <div class="table-header" style="color: #000;">
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
            <template v-if="UserCtr.lang == 'vi'"> Phạt góc cả trận </template>
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
            <template v-if="UserCtr.lang == 'vi'"> Bàn thắng cả trận </template>
            <!-- 全场进球 -->
            <template v-else>
              {{ i18n_t("icon_tips.overall")
              }}{{ i18n_t("icon_tips.goal") }}
            </template>
          </q-tooltip>
          <!-- <icon-wapper name="icon-rs_jin_quan" size="16px" /> -->
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
    <load-data :state="load_data_state" color="light">
      <q-scroll-area ref="scrollArea" class="rule-scroll-area" :style="{ height: '100%'}">
        <div class="tbale-body">
          <div v-for="(item, index) in results_list" :key="item.tnameCode + index">
            <div class="table-tr-td" :class="{ active: index == activeIndex }" @click="get_tr_detail(item, index)">
              <!-- 日期 -->
              <div class="table-col_date">
                <div class="browser" :class="{ del: index == activeIndex }" ></div>
                <div class="time-wrap">
                  <div> {{ formatTime( item.matchTime, UserCtr.lang == "vi" ? "hh:MM dd/mm/yyyy" : "yyyy-mm-dd hh:MM" ) }} </div>
                  <div class="match-stage" :class="item.matchStatus == 1 ? 'roll' : 'cancel'"
                    v-if=" format_mmp(item.matchPeriodId, item.matchStatus) != '' "
                  >
                    {{ format_mmp(item.matchPeriodId, item.matchStatus) }}
                  </div>
                </div>
              </div>
              <!-- 联赛 -->
              <div class="table-col">
                <!-- <img v-img="[lodash.get(item,'iconUrl')]" class="playback-logo" alt="" v-if="item.playBack"> -->
                <!-- 如果返回精彩回放就显示这个icon -->
                <!-- <div class="playback-logo" v-if="item.playBack&&show_play_back"></div> -->
                <img v-img="[lodash.get(item, 'iconUrl')]" class="tournament-logo" alt=""/>
                <span class="ellipsis-line-2">{{ item.tournamentName }}</span>
                <span v-if="item.playBack && show_play_back" class="wonderful-replay-icon-box"></span>
              </div>
              <!-- 赛事 -->
              <div class="table-col">
                <div class="ellipsis">{{ item.homeName }}</div>
                <div class="ellipsis">{{ item.awayName }}</div>
              </div>
              <!-- 黄牌 -->
              <div class="table-col">
                <!-- 黄牌上 -->
                <div>
                  <div>{{ item.matchStatus == 1 ? lodash.get(item, "scoreResult.S14.home", "") : lodash.get(item, "scoreResult.S14.home", "-")}}</div>
                  <div>{{ lodash.get(item, "scoreResult.S14.away", "-") }}</div>
                </div>
              </div>
              <div class="table-col">
                <!-- 黄牌下 -->
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1402.home", "")
                        : lodash.get(item, "scoreResult.S1402.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1402.away", "")
                        : lodash.get(item, "scoreResult.S1402.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 黄牌 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S12.home", "")
                        : lodash.get(item, "scoreResult.S12.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S12.away", "")
                        : lodash.get(item, "scoreResult.S12.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 红牌 上 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S13.home", "")
                        : lodash.get(item, "scoreResult.S13.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S13.away", "")
                        : lodash.get(item, "scoreResult.S13.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 红牌下 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1302.home", "")
                        : lodash.get(item, "scoreResult.S1302.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1302.away", "")
                        : lodash.get(item, "scoreResult.S1302.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 红牌 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S11.home", "")
                        : lodash.get(item, "scoreResult.S11.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S11.away", "")
                        : lodash.get(item, "scoreResult.S11.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 角球上半场 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S15.home", "")
                        : lodash.get(item, "scoreResult.S15.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S15.away", "")
                        : lodash.get(item, "scoreResult.S15.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 角球下半场 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S16.home", "")
                        : lodash.get(item, "scoreResult.S16.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S16.away", "")
                        : lodash.get(item, "scoreResult.S16.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 角球 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S555.home", "")
                        : lodash.get(item, "scoreResult.S555.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S555.away", "")
                        : lodash.get(item, "scoreResult.S555.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 进球 上半场 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S2.home", "")
                        : lodash.get(item, "scoreResult.S2.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S2.away", "")
                        : lodash.get(item, "scoreResult.S2.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 进球 下半场 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S3.home", "")
                        : lodash.get(item, "scoreResult.S3.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S3.away", "")
                        : lodash.get(item, "scoreResult.S3.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 全场进球 -->
              <div class="table-col">
                <div class="color-highlight">
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1.home", "")
                        : lodash.get(item, "scoreResult.S1.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S1.away", "")
                        : lodash.get(item, "scoreResult.S1.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 加时赛进球 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S7.home", "")
                        : lodash.get(item, "scoreResult.S7.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S7.away", "")
                        : lodash.get(item, "scoreResult.S7.away", "-")
                    }}
                  </div>
                </div>
              </div>
              <!-- 点球 -->
              <div class="table-col">
                <div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S170.home", "")
                        : lodash.get(item, "scoreResult.S170.home", "-")
                    }}
                  </div>
                  <div>
                    {{
                      item.matchStatus == 1
                        ? lodash.get(item, "scoreResult.S170.away", "")
                        : lodash.get(item, "scoreResult.S170.away", "-")
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="index == activeIndex" class="wrap-load">
              <!-- v-if="item.playBack&&show_play_back" -->
              <div v-if="item.playBack&&show_play_back" class="tab_change_content">
                <tabs :value="current_events_type" :tabs="tab_list" @click="change_video_history_list"></tabs>
              </div>
              <!-- 精彩回放视频滚动列表 -->
              <div class="play_back_event" v-if="item.playBack&&show_play_back">
                <slider-x ref="drag_scroll" v-if="item.playBack && results_playback_list.length">
                  <section v-for="(slotProps,index) in results_playback_list" :key="index">
                    <div class="video-history-item"  @click="handle_item_click(slotProps)">
                      <div class="video-history-item_bg" :style="`background:url(${slotProps.fragmentPic}); background-size: cover;`">
                        <div
                          class="video-history-item-content"
                        >
                          <div class="match_score">
                            {{ slotProps.t1 }}:{{ slotProps.t2 }}
                          </div>
                          <div class="play_icon"></div>
                        </div>
                      </div>
                        <div>{{ slotProps.homeAway }}</div>
                        <div>
                          <!-- {{ format_second_ms(slotProps.secondsFromStart) }} -->
                          {{ show_code_name(slotProps.eventCode) }}:
                          {{ slotProps.firstNum }}
                        </div>
                    </div>
                  </section>
                </slider-x>
                <no-data v-else :width="'141px'" :height="'80px'"></no-data>
                <!-- <div style="width: 100%; height: 100%" class="flex   yb-flex-center" v-else>
                  <div class="no-data-bg"></div>
                </div> -->
              </div>
              <load-data :state="details_load" color="light">
                <div v-for="(list, i) in results_order_list" :key="i">
                  <div
                    class="table-tr-detail"
                    v-if="list.posrList.length"

                  >
                    <div class="tr-detail-title">{{ list.playName }}</div>
                    <div class="tr-detail-item">
                      <div
                        v-for="(list2, j) in list.posrList"
                        class="item"
                        :key="j"
                      >
                        <span>{{ list2.playOptionName }}</span>
                        <span :class="format_name(list2.scoreResult).class">{{
                          format_name(list2.scoreResult)["name"]
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </load-data>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </load-data>
  </div>
</template>

<script>
import results from "src/core/match-results/match-results-mixin/index";
import UserCtr from "src/core/user-config/user-ctr.js";
import loadData from "src/components/load_data/load_data.vue"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { IconWapper } from 'src/components/icon'
import { format_second_ms } from "src/output/index.js";
import Tabs from "../select/components/playback_tabs.vue";
import SliderX from "../select/components/playback_slider.vue";
import no_data from "src/components/no_data/no_data";
export default {
  mixins: [results],
  components: {
    loadData,
    IconWapper,
    Tabs,
    SliderX,
    "no-data": no_data
  },
  computed:{
    show_play_back(){
      return !!(lodash.get(UserCtr,"user_info.merchantEventSwitchVO") && lodash.get(UserCtr,"user_info.merchantEventSwitchVO.eventSwitch"))
    }
  },
  data() {
    return {
      UserCtr,
      UserCtrInfo:UserCtr.user_info.merchantEventSwitchVO,
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
      tooltip_style:'', // 不知道干嘛的 先这样写 自己改
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
      let title = item.homeAway+' '+format_second_ms(item.secondsFromStart)+' '+this.show_code_name(item.eventCode)+': '+item.firstNum;
      useMittEmit(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD, {
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
      this.current_events_type = "0";
    },
  },
  mounted() {
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
.table-col,.table-col_date {
  position: relative;
  &:first-child {
    display: flex;
    align-items: center;
    width: 13%;
  }
  &:nth-child(2) {
    //padding-left: 20px;
    padding-left: 8px;
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
      color: var(--q-gb-t-c-1);
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
  //border-left: 1px solid var(--qq--yb-border-color7);
  //border-bottom: 1px solid var(--qq--yb-border-color7);
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


.wonderful-replay-icon-box{
  width: 18px;
  height: 18px;
  margin: 0px 4px;
  display: block;
  flex-shrink: 0;
  img{
    width: 16px;
    height: 16px;
  }
  background: var(--qq--match-results-wonderful-replay-icon);
  background-size: 90% 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>