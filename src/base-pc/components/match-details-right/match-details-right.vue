<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 列表|详情 右侧
-->
<template>
  <!-- 详情右侧 -->

  <div
    class="right_details_wrap relative-position"
    :class="route.params.video_size == 1 && 'full-screen'"
    v-show="route.params.video_size != 1 || get_is_show_full_bet"
    :style="page_style"
  >
    <!-- 加载数据 -->
    <load-data
      v-show="show_load_status"
      :class="[
        'details_data_load',
        { details_loading: load_detail_statu == 'loading' },
      ]"
      :state="load_detail_statu"
      :style="{ 'margin-top': headerHeight + 'px' }"
      :is_detail="true"
    />
    <div style="display:none">{{LayOutMain_pc.layout_version}}</div>
    <div class="screen" :class="{ 'video-page': route.name == 'video' }">
      <!-- 滚动区域 -->
      <v-scroll-area
        :observer_area="1"
        @on_scroll="useMittOn(MITT_TYPES.EMIT_RIGHT_DETAILS_ON_SCROLL, $event)"
        ref="v_scroll"
        page_type="right_details"
        class="right_details_wrap"
      >
        <template v-slot:header>
          <!-- 全屏模式玩法集tab -->
          <div
            class="full-video-tab"
            v-if="
              route.params.video_size == 1 &&
              handicap_this &&
              get_is_show_full_bet
            "
          >
            <Tab
              :list="handicap_this.category_list"
              tab_name_key="marketName"
              @onclick="switchTabs"
              :currentIndex="currentIndex"
              :is_drag="handicap_this.category_list.length > 4"
              is_show_line
            />
            <div
              class="tab-arraw"
              :class="handicap_this.panel_status == 'hide' && 'hide'"
              @click="handicap_this.toggle_panel"
            ></div>
          </div>
          <!-- 非全屏模式-->
          <div
            class="right_details_header"
            :class="{ 'no-bottom-border': route.name != 'details', is_esports }"
            v-else
          >
            <!-- bet 体育竞猜 -->
            <div class="sports-guessing" v-if="route.name == 'video'">
              <div>
                <template v-if="is_iframe">
                  <!-- <sport-icon :sport_id="route.params.csid" :is_esports="is_esports" size="18px" class="icon sport-img-new" status="2" />  todo 雪碧图组件 -->
                  <span class="home-vs-away">
                    <span>{{ match_infoData.mhn }}</span>
                    <span class="vs">v</span>
                    <span>{{ match_infoData.man }}</span>
                  </span>
                </template>
                <template v-else>
                  <span>{{ i18n_t("common.sports_guessing") }}</span>
                </template>
              </div>
              <!-- 刷新按钮 -->
              <div class="refresh">
                <refresh-component
                  :other_icon="true"
                  icon_name="icon-balance_refresh"
                  :loaded="refresh_loading"
                  @click="refresh"
                />
              </div>
            </div>
            <!-- 多媒体控制头 -->
            <video-ctrl
              :match_info="match_infoData"
              :refresh_loading="refresh_loading"
              @refresh="refresh"
              @setfoldStatus="setfoldStatus"
              v-if="route.name != 'video' && !is_esports && match_infoData"
            />
            <!-- 电竞多媒体控制头 -->
            <!-- <video-ctrl-esports :match_info="match_infoData" v-if="route.name != 'video' && is_esports" /> -->
            <!-- 战队信息 start -->

            <match-info
              v-if="route.name != 'video'"
              v-show="get_is_fold_status || is_esports"
              :screen="LayOutMain_pc.cur_expand_layout"
              :match_info="match_infoData"
              :refresh_time="refresh_time"
              :background_img="background_img"
              :mid="mid"
            />
            <!-- 精彩回放 -->
            <video-history-line
               v-if="show_video_replay && lodash.get(match_infoData,'cds')!='C01'"
               :match_info="match_infoData"
               :mid="mid"
               :mmp="+lodash.get(match_infoData,'mmp')"
               :matchTime="+lodash.get(match_infoData,'mst')" />
            <!-- 玩法tab -->
            <handicap-tabs-bar
              v-if="
              (LayOutMain_pc.layout_current_path.cur !== 'details' && !is_esports) ||route.name == 'video'"
              :handicap_this="handicap_this"
              :match_info="match_infoData"
              @get_mattch_details="get_mattch_details"
              @on_go_top="on_go_top"
              @change-loading-state="change_loading_state"
              whitchDetail="rightDetails"
            />
          </div>
        </template>

        <!-- 【列表】 ------------->
        <!-- <template
   
        > -->
        <!-- 盘口模板start -->
    
        <template v-if="(LayOutMain_pc.layout_current_path.cur !== 'details' && !is_esports) || route.name == 'video'">
          <match-handicap
            :match_info="match_infoData"
            :category_list="category_list"
            :match_details="match_details"
            :plays_list="plays_list"
            :currentRound="round"
            :is_list="true"
            :mid="mid"
            @set_handicap_this="set_handicap_this"
            :close_all_handicap="close_all_handicap"
            :handicap_state="handicap_state"
            pageType="right_details"
            load_type="details"
          />
          <!-- 盘口模板end -->
        </template>

        <!-- 电竞 有视频赛事列表 -->
        <!-- <esports-match-list v-if="is_esports &&route.name != 'video'" /> -->

        <!-- 【详情信息】 ------------->
        <div
          v-if="show_more && route.params.video_size != 1"
          class="detail_right_model"
        >
          <!-- 聊天室 -->
          <!-- <chatroom v-if="show_chatroom" :chatroom_info.sync="chatroom_info" :chatroom_height="chatroom_height"/> -->

          <!-- 如果当前赛事盘口关闭，就给200px 上边距，用来展示 盘口关闭的提示图 -->
          <div
            class="wrap-total total"
            :class="route.name !== 'details' && load_detail_statu"
            :style="{ 'margin-top': is_show_margin ? '200px' : '4px' }"
          >
            <div class="w-sub-item">
              <div class="item-title">
                <div class="panel-title"></div>
                <!-- 统计 -->
                <span>{{ i18n_t("common.panel_total") }}</span>
              </div>
              <chart class="total_chart" :match_info="match_infoData" />
            </div>
          </div>
          <!-- 撑起盘口关闭高度的 -->
          <div
            v-if="get_version != 2"
            :style="{
              'margin-top':
                (!is_show_margin ||
                  !(
                    match_infoData.mcg == 1 &&
                    [1, 2, 3, 4, 6, 5, 7, 9, 10].includes(
                      +lodash.get(match_infoData, 'csid')
                    )
                  )) &&
                !is_esports &&
                LayOutMain_pc.layout_current_path.cur !== 'details'
                  ? '200px'
                  : 'auto',
            }"
          ></div>
          
          <!-- 热门推荐 -->
          <hot  v-if="GlobalSwitchClass.global_switch.hot_recommend"/>
          <!-- 近期关注 -->
          <recents v-if="!is_esports && GlobalSwitchClass.global_switch.recent_switch" />
        </div>
        <!--晒单列表-->
        <!-- <saidan-list
         v-if="is_display_saidai"
         :share_order_time.sync="share_order_time"
         @qingkong="is_display_saidai=false"
         /> -->
      </v-scroll-area>
      <!-- 全屏投注区域 -->

      <div
        v-if="
          route.params.video_size == '1' &&
          ((!is_esports && vx_get_bet_single_list.length == 1) ||
            (is_esports && vx_get_virtual_bet_list.length == 1))
        "
      >
        <div class="big-cathectic-zone">
          <div class="cathectic-shade" v-if="bet_this && bet_this.bet_loadding">
            <div class="shade-fixed">
              <div class="loading-wrap">
                <div
                  class="img-loading-y0 img-loading"
                ></div>
                <div
                  class="text-center loading-text flex items-end justify-center"
                >
                  {{ i18n_t("bet.bet_loading") }}
                </div>
              </div>
            </div>
          </div>
          <!--组件头部-->
          <div class="bet-scorll-header">
            <q-separator class="bet-top-separator"></q-separator>
            <div class="bet-zone-head" @click.stop="toggle_handle">
              <div class="left">{{ i18n_t("common.bets_single") }}</div>
              <div class="right">
                {{ i18n_t("common.balance") }}
                <span class="balance">{{
                  (vx_get_user.balance || 0) | format_balance
                }}</span>
              </div>
            </div>
          </div>
          <template v-if="is_esports">
            <!-- <esports-bet-single @set_scroll_this="set_scroll_this" /> -->
          </template>
          <template v-else>
            <!-- <bet-single @set_scroll_this="set_scroll_this" /> -->
          </template>
          <!-- <bet-scroll-footer :bet_this="bet_this" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue";
import recents from "src/base-pc/components/match-detail/panel/recents.vue";
import {
  i18n_t,
  MITT_TYPES,
  useMittOn,
  MatchDataWarehouse_PC_Detail_Common as MatchDetailsData,
  MatchDetailCalss,
  GlobalSwitchClass,
  useMittEmit,
  
  UserCtr
} from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import  videoHistoryLine  from "src/base-pc/components/video-replay/video-history-line.vue";
import matchHandicap from "src/base-pc/components/match-detail/match-handicap/match-handicap.vue";
import { TabWapper as Tab } from "src/components/common/tab";
import { useRightDetails } from "./match-details-right-config";
import refreshComponent from "src/components/refresh/refresh.vue";
import videoCtrl from "src/base-pc/components/match-detail/match_info/video_ctrl.vue";
import matchInfo from "src/base-pc/components/match-detail/match_info/match_info.vue";
import handicapTabsBar from "src/base-pc/components/match-detail/match_info/handicap_tabs_bar.vue";
import chart from "src/base-pc/components/match-detail/match_info/chart.vue";
import hot from "src/base-pc/components/match-detail/panel/hot.vue"
//引入组件样式
import { compute_css_variables } from "src/core/css-var/index.js";
import { useRoute } from "vue-router";
import { computed, reactive, ref, watch } from "vue";
const route = useRoute();
import LoadData from "src/base-pc/components/load-data/load-data.vue";
import lodash from "lodash";
import BetData from "src/core/bet/class/bet-data-class.js";
const bet_item_lock  = ref(BetData.bet_item_lock) 

// 2专业/1新手
const get_version = ref(UserCtr.standard_edition)
//获取用户信息
const vx_get_user = ref(UserCtr.get_user())
//获取参数信息
const details_params =ref(MatchDetailCalss.params)  

const page_style = ref(null);
page_style.value = compute_css_variables({
  category: "component",
  module: "match-details",
});
const {
  handicap_this,
  show_load_status,
  // match_infoData,
  // match_details,
  is_esports,
  get_is_fold_status,
  getLoading,
  load_detail_statu,
  headerHeight,
  refresh_time,
  background_img,
  handicap_state,
  category_list,
  plays_list,
  round,
  close_all_handicap,
  refresh_loading,
  MatchDataWarehouseInstance,
  // mid,
  /* func */
  get_mattch_details,
  on_go_top,
  change_loading_state,
  set_handicap_this,
  setfoldStatus,
  refresh
  /* func */
} = useRightDetails({ route });
// 是否显示 统计版块
const show_wrap_total = computed(() => {
  return (
    match_infoData.value.mcg == 1 &&
    [1, 2, 3, 4, 6, 5, 7, 9, 10].includes(
      +lodash.get(match_infoData.value, "csid")
    ) &&
    GlobalSwitchClass.global_switch.statistics_switch &&
    match_infoData.value.cds !== "C01"
  );
});
// 是否显示 聊天室
const show_chatroom = computed(() => {
  return (
    route.name === "details" &&
    vx_get_chatroom_available &&
    ["zh", "tw"].includes(get_lang)
  );
});
// 是否显示精彩回播
const show_video_replay = computed(() => {
  // 配置信息
  const replayInfo = vx_get_user.value.merchantEventSwitchVO;
  return (
    replayInfo &&
    replayInfo.eventSwitch &&
    route.name === "details" &&
    get_is_fold_status &&
    details_params.value.media_type === "video" &&
    Number(match_infoData.value.csid) === 1
  );
});
// 展示热门推荐、近期关注等
const show_more = computed(() => {
  // 当前在详情页或者电竞页的时候展示
  if (
    (route.name == "details" || (is_esports.value && route.name != "video")) &&
    route.name !== "search"
  ) {
    return true;
  } else {
    // 如果不在详情页，就在关盘的时候展示
    return ["new_empty", "all_empty"].includes(handicap_state.value) && mid.value;
  }
});
// 聊天室高度
const chatroom_height = () => {
  // 内嵌右侧
  if (is_iframe) {
    return vx_get_layout_size.content_height - headerHeight - 7;
  }
};

/**
 * @description: 通过mid获取从仓库获取最新的数据
 * @param {*} val  mid参数
 * @return {*}
 */
const update_data = (val) => {
  if(!val) return
  //  console.log(111111111115,val)
  // console.log(111111111115,MatchDetailsData.get_quick_mid_obj(val))
  match_infoData.value = MatchDetailsData.get_quick_mid_obj(val);
  match_details.value = [MatchDetailsData.get_quick_mid_obj(val)];
 
};

/*
 **监听数据仓库版本号
 */
const match_infoData = ref({});
const match_details = ref([]);
watch(
  () => MatchDetailsData.data_version,
  (val, oldval) => {
    if (val.version) {
      update_data(mid.value);
    }
  },
  { deep: true }
);
/*
 ** 监听MatchDetailCalss的版本号  获取最新的mid
 */
const mid = ref(null);
watch(
  () => MatchDetailCalss.details_data_version.version,
  (val) => {
    if (val) {
      details_params.value =  MatchDetailCalss.params
      mid.value = MatchDetailCalss.mid;
      // console.log(111111111116,MatchDetailCalss.mid)
       update_data(MatchDetailCalss.mid);
    }
  },
  { deep: true }
);
/*
 ** 监听UserCtr的版本号  获取最新的mid
 */
// watch(
//   () => UserCtr.user_version.version,
//   (val) => {
//     if (val) {
     
//     }
//   },
//   { deep: true }
// );
/*
 ** 监听mid 触发右侧更新  
 */
watch(
  () => mid.value,
  (val,old) => {
    // 初始化加载的时候为了不触发两次右侧更新   老mid(old)为null的时候说明是第一次加载 点击列表的时候 右侧已经通过列表mitt触发加载了一次  
    if (val!=old && old) {
     
      // MatchDetailCalss.set_play_media( {
      //         mid: MatchDetailCalss.params.mid,
      //         media_type:MatchDetailCalss.params.media_type,
      //         play_id:MatchDetailCalss.params.play_id,
      //         time: new Date() * 1,
      //       })
				// useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, MatchDetailCalss.params);
    }
  },
  { deep: true }
);
// 是否展示右侧热门推荐处的margin
const is_show_margin = computed(() => {
  return (
    ["new_empty", "all_empty"].includes(load_detail_statu) &&
    route.name !== "details"
  );
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
@import "../match-details/match-details.scss";
</style>