<!--
 * @Author: Coopoer
 * @Date: 2020-08-15 17:13:55
 * @Description: 玩法模板条件加载 详情页面 玩法集下面的玩法 列表
-->
<template>
  <div class="wrap-handicap relative-position">
    <div class="template-handicap" id="_handicap_list_wrap">
      <!-- 详情玩法列表容器，盘口关闭时会隐藏 -->
      <div class="details_data" v-if="showDetails">
        <div
          class="group-flex"
          id="_handicap_list"
          :class="{ double: get_layout_statu }"
        >
          <!-- waterfall 外层循环控制1栏布局和2栏布局 -->
          <div
            class="group-template"
            v-for="(list, index) in waterfall"
            :key="index"
          >
            <!--<div v-for="(item, i) in list" :key="`${index}_${i}`" class="template">-->
            <div
              v-for="item in list"
              :key="`hpid_${item.hpid}_topKey_${item.topKey}`"
              class="template"
            >
              <!-- <div>{{ plays_list }}----{{ item.hpid }}---{{ item.chpid }}---{{ item.hpn }}---{{ currentRound }}</div> -->
              <div v-show="is_component_show(item)">
                <!--修改全场让球赛果为有附加盘时不出现的问题 item.hpt == 1|| ['3'].includes(item.hpid)-->
                <component
                  v-if="
                    item.show_hl &&
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 51].includes(
                      +item.hpt
                    )
                  "
                  :is="`template${item.hpt}`"
                  :key="`hpid_${item.hpid}_topKey_${item.topKey}`"
                  :item_details="item"
                  :match_info="match_info"
                  :index="item.index"
                  :reset_toggle="reset_toggle"
                  :is_highlight="item.hlf"
                  @sort_index="sort_index"
                  :panel_status="panel_status"
                  :class="{ is_rang: rang.includes(item.hpid * 1) }"
                ></component>
              </div>
            </div>
          </div>
        </div>
        <!-- 详情页下方文案和返回顶部按钮 -->
        <div
          v-show="
            ['details', 'virtual_details'].includes($route.name) &&
            _.get(waterfall, '[0].length')
          "
          style="margin-top: 20px"
        >
          <div style="height: 152px">
            <go-top
              v-if="has_thumb"
              @on_go_top="on_go_top"
              class="to-top"
            ></go-top>
          </div>
        </div>
        <div class="null-bg" v-show="$route.name != 'details'"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  defineProps,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  nextTick,
} from "vue";
import match_handicap from "src/components/match-detail/match_handicap.js";
import store from "src/store-redux/index.js";
import details from "src/core/match-detail-pc/match-detail.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
import lodash from "lodash";
export default defineComponent({
  mixins: [match_handicap], //引入玩法组件
  props: {
    // 判断当前在哪个详情页
    pageType: String,
    // 详情数据
    match_info: Object,
    //页面展开的对象
    is_list: Boolean,
    //玩法集
    category_list: Array,
    //盘口详情
    match_details: Array,
    // 关闭全部玩法
    close_all_handicap: Boolean,
    // 数据加载状态
    handicap_state: String,
    refs_tabs_bar: HTMLDivElement,
    // 组件加载类型
    load_type: String,
    // 选中玩法集的盘口玩法集
    plays_list: Array,
    // 电竞当前回合
    currentRound: {
      type: [Object, Number],
    },
  },
  setup(props, event) {
    //  ============================数据===================
    const state = reactive({
      sportId: null,
      details_data: [], //拼接数据
      reset_toggle: 0,
      // 当前 loading 状态
      load_detail_statu: "loading",
      layout_statu: true, // 单双列样式
      waterfall: [], // 单双列数据
      // 是否开了滚球盘
      had_play_handicap: true,
      // 玩法展开状态
      panel_status: "default",
      has_thumb: false, //是否有滚动条
      handle_: [], // 用户操作过的数据
    });
    const emit = defineEmits(["set_handicap_state"]);

    const showDetails = ref(false);
    //  ============================store===================
    const store_state = store.getState();
    // 获取页面宽高信息 --可以废弃，废弃改动较大
    const get_layout_list_size = ref(
      store_state.layoutReducer.layout_list_size
    );
    // 详情页玩法列表单双列 0单列， 1双列
    const get_layout_statu = ref(store_state.matchesReducer.layout_statu);
    // 获取用户uid
    const get_uid = store_state.userReducer.uuid;
    // 当前所选的玩法集子项id
    const get_tabs_active_id = ref(
      store_state.matchesReducer.tabs_active_index
    );
    // 获取当前页路由信息
    const vx_layout_cur_page = ref(store_state.layoutReducer.layout_cur_page);
    // 获取指定的玩法id
    const get_top_id = ref(store_state.matchesReducer.topId);
    // 获取指定的玩法id
    const get_right_zoom = ref(store_state.matchesReducer.zoom);

    //  ============================watch===================

    watch(
      () => props.load_detail_statu,
      (val) => {
        // 盘口关闭时隐藏详情列表
        if (["all_empty", "new_empty", "refresh", "404"].includes(n)) {
          showDetails.value = false;
          document.querySelector(".wrap-handicap").style.height = "auto";
        } else {
          showDetails.value = true;
        }
        // 右侧详情加载进行优化
        let s = n == "loading" ? "right_details_loading" : n;
        // 发送当前 loading 状态
        this.$root.$emit("change_loading_status_details", s);
        if (this.pageType == "right_details") {
          this.$root.$emit("change_loading_status_right_details", s);
        }
      }
    );
    // 页面宽高变化
    watch(get_layout_list_size, (val) => {
      if (get_layout_statu.value) {
        state.waterfall = details.set_waterfall(state.details_data);
      } else {
        state.waterfall = [state.details_data];
      }
      int_is_show();
      set_go_top_show();
    });
    // 监听关闭全部玩法
    watch(
      () => props.close_all_handicap,
      (res) => {
        if (res) {
          if (props.load_type == "details") {
            emit("set_handicap_state", "empty");
          } else {
            state.load_detail_statu = "empty";
          }
        }
      },
      { immediate: true }
    );
       // 加载状态
      watch(
      () => props.handicap_state,
      (res) => {
        state.load_detail_statu = res;
      }
    );
    /**
     * @Description:监听玩法是否展开
     * @return {undefined} undefined
     */
    watch(
      () => state.panel_status,
      (res) => {
        switch (res) {
          case "open":
            set_is_show_all(true);
            break;
          case "hide":
            set_is_show_all(false);
            break;
        }
      }
    );
    watch(
      () => mmp.value,
      (cur) => {
        if (cur == "999") {
          if (props.load_type == "details") {
            emit("set_handicap_state", "empty");
          } else {
            state.load_detail_statu = "empty";
          }
        }
      }
    );
    // watch(get_right_zoom, (val) => {
    //   this.wrap_tabs_width = this.$refs.warp.offsetWidth;
    // });

    //  ============================computed===================
    const current_list = computed(() => {
      let list = [];
      props.plays_list.forEach((element) => {
        list.push(element + "-" + props.currentRound);
      });
      return list;
    });
    const mmp = computed(() => {
     return props.match_info.mmp
    });
    //  ============================methods===================
    /**
     * @Description:初始化玩法是否展开
     * @return {undefined} undefined
     */
    const int_is_show = () => {
      // let show_title = "hide"
      state.waterfall.forEach((list) => {
        list.forEach((item) => {
          //是否有附加盘
          if (item.hmm == 1 && lodash.get(item, "hl.length") > 1) {
            item.has_plus = true;
          } else {
            item.has_plus = false;
          }
          item.is_show = state.panel_status == "hide" ? false : true;
          item.is_show_plus = state.panel_status == "hide" ? false : true;
        });
      });
    };
    /**
     * @Description:设置是否显示返回按钮
     * @return {Undefined} Undefined
     */
    const set_go_top_show = () => {
      nextTick(() => {
        let obj =
          document.querySelector(".details .v-scrollarea .scroll") ||
          document.querySelector(".virtual_details .v-scrollarea .scroll");
        if (obj) {
          state.has_thumb = obj.scrollHeight > obj.clientHeight;
        }
      });
    };

    /**
     * @Description:设置所有玩法集是否展开
     * @param {boolean} status 设置的状态
     * @return {undefined} undefined
     */
    const set_is_show_all = (status) => {
      state.waterfall.forEach((list) => {
        list.forEach((item) => {
          item.is_show = status;
          item.is_show_plus = status;
        });
      });
    };
    onMounted(() => {
      rang.value = [
        3, 4, 19, 33, 46, 52, 58, 64, 69, 71, 113, 121, 128, 130, 143, 154, 155,
        163, 172, 176, 181, 185, 232, 243, 249, 253, 268, 269, 270, 278, 280,
        294, 306, 308, 324, 327, 334, 20003, 20004, 20015,
      ];
    });
  },

  // watch: {
  //   // 详情没数据时隐藏容器
  //   "waterfall.length": {
  //     handler(n) {
  //       this.showDetails = n > 0;
  //     },
  //   },
  // },
  // created() {
  //   // 角球玩法id
  //   this.rang = [
  //     3, 4, 19, 33, 46, 52, 58, 64, 69, 71, 113, 121, 128, 130, 143, 154, 155,
  //     163, 172, 176, 181, 185, 232, 243, 249, 253, 268, 269, 270, 278, 280, 294,
  //     306, 308, 324, 327, 334, 20003, 20004, 20015,
  //   ];
  // },
});
</script>

<style lang="scss" scoped>
.wrap-handicap {
  display: flex;
  flex: 1;
  flex-flow: column;
  height: 100%;
  border-right: none !important;
  &::-webkit-scrollbar {
    display: none;
  }
  .details_data {
    width: 100%;
  }
  .details_data_load {
    width: 100%;
    height: 100%;
    z-index: 1;
    flex: 1;
  }
  ::v-deep {
    .load-data-wrap {
      width: 100% !important;
      .yb-flex-center {
        justify-content: start;
      }
    }
    .go-top-btn {
      height: 24px;
      .msg {
        margin-left: 5px;
      }
    }
  }
}
/*  玩法集 */
.wrap-tabs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  height: 40px;
  border-bottom: 1px solid rgba(40, 43, 55, 0.5);
  background: #191c24;
  font-size: 12px;
  .tabs-bar {
    z-index: 1;
    display: flex;
    width: 1000px;
    .tabs-item-wrap {
      display: flex;
    }
    .tabs-item {
      padding: 0 14px;
      height: 36px;
      text-align: center;
      white-space: nowrap;
      line-height: 38px;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
      &.active {
        color: #fff;
      }
    }
    .tabs-line {
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 24px;
      height: 2px;
      border-radius: 2px;
      background-color: var(--qq--yb-text-color1);
      transition: all 0.3s;
    }
  }
  /*  玩法集左右滚动 icon */
  .tabs-icons {
    position: absolute;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 40px;
    background-color: #1f222b;
    cursor: pointer;
  }
  .tabs-icons-left {
    left: 0;
    .yb-icon-arrow {
      transform: rotate(180deg);
    }
  }
  .tabs-icons-right {
    right: 0;
  }
  .tabs-handel {
    z-index: 2;
  }
  .right-icons {
    position: relative;
    z-index: 2;
    margin-right: 10px;
    cursor: pointer;
  }
  .icon-toggle {
    margin-right: 10px;
    cursor: pointer;
    &:before {
      color: #999;
    }
    &:hover:before {
      color: #d1d1d1;
    }
    &.active:before {
      color: var(--qq--yb-text-color1);
    }
  }
}
/*  玩法模板 title */
.template ::v-deep .template-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: 32px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    .set_top {
      display: block !important;
    }
  }
  .set_top {
    margin-right: 5px;
    padding-left: 20px;
    height: 100%;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }
  .play-name {
    display: flex;
    align-items: center;
    height: 14px;
    font-weight: 600;
    &::before {
      display: inline-block;
      margin-right: 10px;
      height: 14px;
      border-radius: 1.5px;
      content: "";
      width: 3px;
      background: var(--qq--theme-bg-play-name-before);
    }
  }
}
.template ::v-deep {
  .template0,
  .template2,
  .template4,
  .template6,
  .template7,
  .template51 {
    .os-3 {
      display: none !important;
    }
  }
  /*  玩法模板 */
  .handicap {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    line-height: 34px;
    .handicap-item {
      height: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.sub-title-2 {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8px;
      }
    }
    .layout-line {
      .handicap-item {
        //border-left: 1px solid rgba(40, 43, 55, 0.5);
      }
    }
    .os-1 {
      &:hover {
        .c-bet-item {
          border-color: transparent;
          .bet-item {
            color: var(--qq--theme-color-handicap-item-bet-hover);
          }
        }
      }
      .c-bet-item.active {
        .bet-item {
          color: var(--qq--theme-color-handicap-item-bet-active) !important;
        }
        &:hover {
          .odds {
            color: var(--qq--theme-color-handicap-item-bet-active) !important;
          }
        }
      }
      &.sub-title-2:hover {
        border-color: rgba(0, 0, 0, 0.1);
      }
      .handicap-name {
        color: #999;
      }
      .odds {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        .odds-item {
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;
          .odds-num {
            color: #d1d1d1;
          }
          .odds-pre {
            margin-right: 8px;
          }
        }
      }
    }
  }
  /*  投注项 */
  .c-bet-item {
    padding: 0 20px 0 15px;
  }
}
/*  玩法列表 */
.template-handicap {
  display: flex;
  flex: 1;
  position: unset;
  /*  加载状态样式 */
  ::v-deep .load-data-wrap.is-detail .empty-wrap {
    padding-top: 100px !important;
    .text-center {
      padding-bottom: 50px;
    }
  }
  ::v-deep .load-data-wrap.is-detail .loading-wrap {
    padding-top: 100px;
    .text-center {
      padding-bottom: 50px;
    }
  }
  ::v-deep .load-data-wrap.is-detail .refresh.fit {
    padding-top: 80px;
  }
  .double {
    display: flex;
    .group-template {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 50%;
      &:first-child {
        margin-right: 2px;
      }
      .template {
        width: 100%;
      }
    }
  }
  .group-template {
    .template {
      .wrap-template {
        margin-top: 4px;
        border-radius: 8px;
        overflow: hidden;
      }
      .template6 {
        ::v-deep .main-handicap {
          .group {
            &:last-child {
              border-radius: 0 0 8px 8px;
              overflow: hidden;
            }
          }
        }
      }
      .template0,
      .template2,
      .template3,
      .template7 {
        ::v-deep .main-handicap {
          .handicap:last-child {
            border-radius: 0 0 8px 8px;
            overflow: hidden;
          }
        }
      }
      .template10 {
        & > ::v-deep div:last-child {
          border-radius: 0 0 8px 8px;
          overflow: hidden;
        }
      }
      /*  红升绿降样式 */
      ::v-deep .c-bet-item {
        .odds-icon {
          top: auto;
          bottom: auto;
          &:before {
            display: none;
          }
        }
      }
    }
  }
  ::v-deep .handicap-wrap {
    flex: 1;
    min-width: 1px;
    .bet-item {
      display: flex;
      align-items: center;
      .bet-ellipsis {
        min-width: 1px;
      }
    }
    .bet_handicap {
      margin-left: 6px;
      .handicap-value {
        flex: 1;
      }
      .item-label:first-child {
        margin-right: 6px;
      }
    }
    .ranking-nos {
      display: flex;
    }
    .rank-no {
      width: 16px;
      height: 16px;
    }
  }
}
/*  红升绿降样式 */
.template {
  ::v-deep .c-bet-item.up {
    background: rgba(233, 61, 61, 0.05);
    &.normal,
    &.active {
      .odds {
        color: #e93d3d;
        &:after {
          display: block;
          content: "";
          width: 6px;
          height: 10px;
          position: absolute;
          right: -10px;
          background: url("~public/image/common/svg/red_up.svg") no-repeat
            center;
        }
      }
    }
  }
  ::v-deep .c-bet-item.down {
    background: rgba(80, 192, 66, 0.05);
    &.normal,
    &.active {
      .odds {
        color: #50c042;
        &:after {
          display: block;
          content: "";
          width: 6px;
          height: 10px;
          position: absolute;
          right: -10px;
          background: url("~public/image/common/svg/green_down.svg") no-repeat
            center;
        }
      }
    }
  }
}
.null-bg {
  height: 100px;
}
</style>
