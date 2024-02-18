<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 详情区--篮球滚球-比分面板
-->
<template>
  <div
    :class="{ 'w-100': lodash.get(match_info, 'msc_obj.S7') }"
    class="basketball-after"
    v-if="isRouterAlive"
  >
    <div class="info-time">
      <!-- 正计时 -->
      <div class="match-date">
        <match-process :match="match_info" show_page="match-list" :rows="1" />
      </div>
      <!-- 中立场 -->
      <span v-if="match_info.mng" class="icon-neutral q-icon c-icon"
        ><span class="path1"></span><span class="path2"></span
      ></span>
      <div class="col"></div>
      <div class="score-wrap">
        <!-- 左滚动按钮 S -->
        <span
          v-if="is_scroll"
          class="scroll-arrow"
          @click="scorll(0)"
          @mouseenter="enter(0)"
          @mouseleave="leave"
        >
          <icon-wapper
            name="icon-arrow-left"
            size="10px"
            :color="el_active == 'left' ? '#FF7000' : '#6D7278'"
            v-show="more_left_icon"
          />
        </span>
        <!-- 左滚动按钮 E -->
        <!-- 不同赛制的小节展示区 -->
        <template v-if="lodash.get(match_info, 'mle') != 73">
          <div
            class="time-node"
            :class="[`stage-${match_info.mmp}`, screen_class]"
            ref="scroll_handel"
          >
            <!-- 篮球 -->
            <template v-if="lodash.get(match_info, 'csid') == '2'">
              <!-- 上下半场赛制 -->
              <template v-if="lodash.get(match_info, 'mle') == '17'">
                <span>H1</span>
                <span>H2</span>
              </template>

              <!-- 四节赛制 -->
              <template v-else>
                <span>Q1</span>
                <span>Q2</span>
                <!-- 半场 -->
                <span>{{ i18n_t("common.half_") }}</span>
                <span>Q3</span>
                <span>Q4</span>
              </template>
            </template>

            <!-- 美足 -->
            <template v-else>
              <span>1</span>
              <span>2</span>
              <!-- 半场 -->
              <span>{{ i18n_t("common.half_") }}</span>
              <span>3</span>
              <span>4</span>
            </template>
          </div>
          <!-- 右滚动按钮 S -->
          <span
            v-if="is_scroll"
            class="scroll-arrow arrow-right"
            @click="scorll(1)"
            @mouseenter="enter(1)"
            @mouseleave="leave"
          >
            <icon-wapper
              name="icon-arrow-right"
              size="10px"
              :color="el_active == 'right' ? '#FF7000' : '#6D7278'"
              v-show="more_right_icon"
            />
          </span>
          <!-- 右滚动按钮 E -->

          <!-- 加时 -->
          <span
            class="common-score"
            v-if="lodash.get(match_info, 'msc_obj.S7')"
            >{{ i18n_t("common.add_time") }}</span
          >
        </template>
        <!-- 总分 -->
        <span class="common-score score">{{ i18n_t("common.total") }}</span>
      </div>
    </div>

    <!-- 对阵信息 -->
    <div class="info-both">
      <!-- 主队 开始 -->
      <div class="both-home">
        <div class="wrap-logo">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            v-img="[
              lodash.get(match_info, 'mhlu[0]'),
              lodash.get(match_info, 'frmhn[0]'),
            ]"
            class="both-logo"
          />
          <span
            class="ellipsis allow-user-select"
            v-tooltip="{ content: lodash.get(match_info, 'mhn'), overflow: 1 }"
            >{{ lodash.get(match_info, "mhn") }}</span
          >
        </div>

        <div class="score-wrap">
          <template v-if="lodash.get(match_info, 'mle') != 73">
            <div
              class="info-data"
              :class="[`stage-${match_info.mmp}`, screen_class]"
              ref="scroll_home"
              :style="{
                margin:
                  more_left_icon || more_right_icon ? '0px 19px 0 14px' : '0',
              }"
            >
              <template v-if="lodash.get(match_info, 'mle') == '17'">
                <!-- 上半场比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S2.home") }}</span>
                <!-- 下半场比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S3.home") }}</span>
              </template>
              <template v-else>
                <!-- 第一节比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S19.home") }}</span>
                <!-- 第二节比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S20.home") }}</span>
                <span class="time-half">{{
                  lodash.get(match_info, "msc_obj.S2.home")
                }}</span>
                <!-- 第三节比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S21.home") }}</span>
                <!-- 第四节比分 -->
                <span>{{ lodash.get(match_info, "msc_obj.S22.home") }}</span>
              </template>
            </div>
            <span
              class="common-score"
              v-if="lodash.get(match_info, 'msc_obj.S7')"
              >{{ lodash.get(match_info, "msc_obj.S7.home") }}</span
            >
          </template>
          <span class="common-score score">{{
            lodash.get(match_info, "msc_obj.S1.home")
          }}</span>
        </div>
      </div>
      <!-- 主队 结束 -->

      <!-- 客队 开始 -->
      <div class="both-away">
        <div class="wrap-logo">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            v-img="[
              lodash.get(match_info, 'malu[0]'),
              lodash.get(match_info, 'frman[0]'),
            ]"
            class="both-logo"
          />
          <span
            class="ellipsis allow-user-select"
            v-tooltip="{ content: lodash.get(match_info, 'man'), overflow: 1 }"
            >{{ lodash.get(match_info, "man") }}</span
          >
        </div>
        <div class="score-wrap">
          <template v-if="lodash.get(match_info, 'mle') != 73">
            <div
              class="info-data"
              :class="[`stage-${match_info.mmp}`, screen_class]"
              ref="scroll_away"
              :style="{
                margin:
                  more_left_icon || more_right_icon ? '0px 19px 0 14px' : '0',
              }"
            >
              <template v-if="lodash.get(match_info, 'mle') == '17'">
                <span>{{ lodash.get(match_info, "msc_obj.S2.away") }}</span>
                <span>{{ lodash.get(match_info, "msc_obj.S3.away") }}</span>
              </template>
              <template v-else>
                <span>{{ lodash.get(match_info, "msc_obj.S19.away") }}</span>
                <span>{{ lodash.get(match_info, "msc_obj.S20.away") }}</span>
                <span class="time-half">{{
                  lodash.get(match_info, "msc_obj.S2.away")
                }}</span>
                <span>{{ lodash.get(match_info, "msc_obj.S21.away") }}</span>
                <span>{{ lodash.get(match_info, "msc_obj.S22.away") }}</span>
              </template>
            </div>

            <span
              class="common-score"
              v-if="lodash.get(match_info, 'msc_obj.S7')"
              >{{ lodash.get(match_info, "msc_obj.S7.away") }}</span
            >
          </template>
          <span class="common-score score">{{
            lodash.get(match_info, "msc_obj.S1.away")
          }}</span>
        </div>
      </div>
      <!-- 客队 结束 -->
    </div>
    <!-- 对阵信息 -->
  </div>
</template>

<script>
// import format from "src/project/yabo/mixins/match_details/index";
import BetCommonHelper from "src/core/bet/common-helper/index.js";
import lodash from "lodash";
import store from "src/store-redux/index.js";
import { IconWapper } from "src/components/icon";
import { nextTick } from "vue";
import LayOutMain from "src/core/layout/index.js";
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js";

export default {
  components: {
    IconWapper,
    matchProcess,
  },
  // mixins: [format],
  props: {
    match_info: Object,
    right: Boolean,
  },
  data() {
    return {
      lodash,
      el_active: "default", //左右滚动条active， right | left
      more_left_icon: false, //向左箭头显隐
      more_right_icon: false, //向右箭头显隐
      one_item_width: 36, //滚动一次的距离
      timestamp: 0, //当前时间戳
      format_date: "", //倒计时秒数
      timer: null,
      default: {
        //初始化比分
        home: 0,
        away: 0,
      },
      isRouterAlive: true, //重载页面开关
      screen_class: "",
      is_scroll: false, //是否出现比分滚动
      scrollTimer: null, // 定时器
      un_subscribe: null,
    };
  },
  mounted() {},
  methods: {
    /**
     * 鼠标移入
     */
    enter(type) {
      type ? (this.el_active = "right") : (this.el_active = "left");
    },
    /**
     * 鼠标移出
     */
    leave() {
      this.el_active = "default";
    },

    /**
     * @description: 比分扳左右滚动
     * @param {Number} type 0左滚动 1右滚动
     * @return {undefined} undefined
     */
    scorll(type) {
      // 根据 Type 值判断类型，计算滚动距离
      if (type) {
        if (!this.more_right_icon) {
          return;
        }
        BetCommonHelper.get_refs_info("scroll_handel", null, this).scrollLeft +=
          this.one_item_width;
        BetCommonHelper.get_refs_info("scroll_home", null, this).scrollLeft +=
          this.one_item_width;
        BetCommonHelper.get_refs_info("scroll_away", null, this).scrollLeft +=
          this.one_item_width;
      } else {
        if (!this.more_left_icon) {
          return;
        }
        BetCommonHelper.get_refs_info("scroll_handel", null, this).scrollLeft -=
          this.one_item_width;
        BetCommonHelper.get_refs_info("scroll_home", null, this).scrollLeft -=
          this.one_item_width;
        BetCommonHelper.get_refs_info("scroll_away", null, this).scrollLeft -=
          this.one_item_width;
      }

      let offset = 3;
      let _scroll_left = BetCommonHelper.get_refs_info(
        "scroll_handel",
        "scrollLeft",
        this
      );
      let _msc_length = 5 * this.one_item_width;
      let _max_scroll = _msc_length - this.one_item_width * offset;

      // 更多-左图标 显隐
      this.more_left_icon = _scroll_left > 0;
      // 更多-右图标 显隐
      this.more_right_icon = _scroll_left < _max_scroll;
    },

    /**
     * @description: 重置比分扳滚动条件
     * @return {}
     * 初始化滚动距离
     */
    init_scroll() {
      let scroll_left = this.one_item_width * 2;
      BetCommonHelper.get_refs_info("scroll_handel", null, this).scrollLeft =
        scroll_left;
      BetCommonHelper.get_refs_info("scroll_home", null, this).scrollLeft =
        scroll_left;
      BetCommonHelper.get_refs_info("scroll_away", null, this).scrollLeft =
        scroll_left;
      this.more_left_icon = true;
    },
    /**
     * @description: 重载组件
     * @return {undefined} undefined
     */
    reload_data() {
      this.isRouterAlive = false;
      nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },

  beforeUnmount() {
    clearTimeout(this.scrollTimer);
  },

  watch: {
    match_info: {
      handler(res, old) {
        this.reload_data();
        let dict = {
          13: "S19",
          14: "S20",
          301: "S20",
          15: "S21",
          302: "S21",
          16: "S22",
          303: "S22",
          1: "S2",
          2: "S3",
          31: "S3",
          40: "S7",
        };
        for (var k in dict) {
          if (k == res.mmp) {
            res.msc[dict[k]] =
              lodash.get(res, `msc[${dict[k]}]`) || this.default;
          }
        }

        if (
          this.$route.name == "home" &&
          lodash.get(res, "msc_obj.S7") &&
          LayOutMain.layout_content_width < 1430
        ) {
          this.is_scroll = true;
        } else {
          this.is_scroll = false;
        }

        // 比分滚动条配置偏移量
        if (this.is_scroll) {
          if (this.scrollTimer) clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(() => {
            nextTick(() => {
              this.init_scroll();
            });
          }, 10);
        }
      },
      immediate: true,
    },
    LayOutMain: {
      handler(res) {
        if (this.$route.name == "home") {
          if (res.width < 1430 && lodash.get(this.match_info, "msc_obj.S7")) {
            if (!this.is_scroll) {
              this.screen_class = "is_min_screen";
              this.is_scroll = true;
              this.init_scroll();
            }
          } else {
            this.screen_class = "";
            this.is_scroll = false;
            this.more_left_icon = false;
            this.more_right_icon = false;
          }
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-match-list {
  .basketball-after {
    width: 370px;
  }
}
.screen-medium {
  .expand-match-list {
    .basketball-after {
      width: 370px;
    }
  }
}
.screen-min {
  .expand-match-list {
    .basketball-after {
      width: 386px;
    }
  }
}
.screen-medium {
  .basketball-after {
    width: 506px;
  }
}
.screen-min {
  .basketball-after {
    width: 528px;
  }
}
.basketball-after {
  overflow: hidden;
  border-radius: 2px;
  color: #d1d1d1;
  font-size: 12px;
  width: 506px;
  .info-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 19px 0 27px;
    height: 40px;
    background: #1f2129;
    // line-height: 40px;
    .match-date {
      display: flex;
      color: var(--q-gb-t-c-1);
      .no_cuntdowm {
        :deep(.c-match-date) {
          display: none;
        }
      }
    }
    .time-node {
      overflow-x: auto;
      white-space: nowrap;
      -moz-scrollbar-width: none;
      -webkit-scrollbar-width: none;
      scrollbar-width: none;
      scrollbar-width: none;
      &.is_min_screen {
        max-width: 108px;
      }
      &::-webkit-scrollbar {
        display: none;
      }

      span {
        display: inline-block;
        margin-right: 10px;
        width: 26px;
        text-align: center;
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
      padding: 8px 19px 8px 27px;
    }
    .both-home {
      border-bottom: 1px solid rgba(225, 225, 225, 0.08);
    }
    .wrap-logo {
      display: flex;
      flex: 1;
      align-items: center;
      min-width: 1px;
      color: var(--q-gb-bd-c-13);
      height: 28px;
      overflow: hidden;
    }
    .both-logo {
      flex-shrink: 0;
      margin-right: 11px;
      width: 28px;
    }
    .info-data {
      overflow-x: auto;
      white-space: nowrap;
      -moz-scrollbar-width: none;
      -webkit-scrollbar-width: none;
      scrollbar-width: none;
      scrollbar-width: none;
      &.is_min_screen {
        max-width: 108px;
      }
      &::-webkit-scrollbar {
        display: none;
      }

      span {
        display: inline-block;
        margin-right: 10px;
        width: 26px;
        color: #999;
        text-align: center;
        font-size: 13px;
      }
      .time-half {
        color: #d1d1d1;
      }
    }
  }
  .score-wrap {
    display: flex;
    .common-score {
      width: 26px;
      text-align: center;
      margin-right: 10px;
    }
  }
  .scroll-arrow {
    display: flex;
    align-items: center;
    margin: 0;
    width: 13px;
    cursor: pointer;
  }
  .arrow-right {
    margin-left: 6px;
  }
}
.c-main-content {
  .page-right {
    .basketball-after {
      width: 90%;
    }
    .w-100 {
      width: 100% !important;
    }
  }
}
</style>
