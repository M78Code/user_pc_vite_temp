<!--
 * @Author: Cronus
 * @Date: 2020-12-22 18:07:03
 * @Description: 虚拟体育首页主文件
-->
<template>
  <div class="virtual-sports">
    <virtual-skeleton v-show="virtual_data_loading">
    </virtual-skeleton>
    <!-- <setting list_type="vr"/> -->
    <!--联赛tab-->
    <!--只有足球展示多个联赛菜单 -->
    <div class="fixed-head">
      <div class="tab-wrapper">
        <div class="tab-item" :class="{active:i == tab_item_i}" v-for="(tab_item,i) of tab_items"
          :key="i" @click="tab_item_click_handle(i,null,'user_change')">
          <div>{{tab_item.name}}</div>
        </div>
      </div>
    </div>
    <div class="virtual-content-wrapper">
      <div class="virtual-sports-top">
        <!--选中的赛事阶段组件包含赛前倒计时,赛中视频,完赛等状态-->
        <!--此组件:key去除后有问题, 赛事倒计时时钟颜色红黄错乱-->
        <virtual-sports-stage ref="virtual_sports_stage"
          :is_before_destroy="is_before_destroy"
          :key="current_match.mid"
          :m_status="current_match.match_status"
          :virtual_match_list="match_list_by_no"
          :current_match="current_match" source='list'
          :is_video_playing="is_video_playing"
          :v_match_router_ente="v_match_router_ente"
          :virtual_result_rank_data="virtual_result_rank_data"
          @basketball_end="basketball_end_handle"
          @time_ended="timer_ended_handle"
          @update_next_batch_match="update_n_batch_handle">
        </virtual-sports-stage>
        <!-- vr右侧区域，包括足蓝队伍比分，赛马队伍和赛果 -->
        <div v-if="current_match.csid">
          <div class="team-title"  v-if="current_match.csid == 1001 || current_match.csid == 1004">
            <div class="info">
            </div>
            <div class="title">
                {{ lengue_name }} {{ current_match.no }}
            </div>
          </div>
          <div class="team-title horse-title" v-else>
              <div class="info"></div>
              <div class="title">
                  {{ lengue_name }} {{ current_match.no }}
              </div>
              <!-- 冠军 -->
              <div class="horse-col">{{ i18n_t('list.virtual_match_type_title.type1011.bet_col.0') }}</div>
              <!-- 前二 -->
              <div class="horse-col">{{ i18n_t('list.virtual_match_type_title.type1011.bet_col.1') }}</div>
              <!-- 前三 -->
              <div class="horse-col" v-if="current_match.csid != '1009'">
                  {{ i18n_t('list.virtual_match_type_title.type1011.bet_col.2') }}</div>
          </div>
          <virtual-sports-right v-if="current_match" :current_match="current_match" :match_list_by_no="match_list_by_no" :switch_match_handle="switch_match_handle" />
        </div>
        
        <!-- 赛马：当前赛事展示，展示赔率、排行、赛果 -->
        <template v-if="0">
            <!-- 赛马的动态排名---赛马在比赛过程的时候显示 -->
            <dynamic-ranking v-if="current_match.match_status == 0 || current_match.match_status == 1" :virtual_match_list="[current_match]" />
            <!-- 赛马的结果展示页---赛马开奖结束后显示赛果 -->
            <result-page v-if="current_match.match_status == 2" :match_mid="current_match.mid" :current_match="current_match" @send_virtual_result_rank_data='send_virtual_result_rank_data'/>
        </template>
      </div>
      <div class="virtual-sports-card" v-for="(match_item_batch, i) in match_list_all_batches" :key="i">
       <div v-if="match_item_batch.remaining_time > 0" class="virtual-sports-card-content" :class="{'virtual-sports-card-simple': standard_edition === 1}">
        <template v-if="match_item_batch.is_expend">
            <!--  虚拟体育主列表页面  -->
            <div
                class="v-sports-main-list"
                :class="{'v-sports-main-list-style': standard_edition === 1}"
                :style="{'padding-bottom': '0'}"
            >
              <!-- 虚拟体育足球赛事列表 -->
              <v-s-match-list v-if="sub_menu_type && [1001,1004].includes(sub_menu_type)" :virtual_match_list="match_item_batch.matchs"
                :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
                :match_item_batch="match_item_batch"
                @switch_match="switch_match_handle"  @start="match_start_handle">
              </v-s-match-list>

              <!-- 虚拟体育赛马类赛事列表 -->
              <v-s-match-list2 v-if="sub_menu_type && ![1001,1004].includes(sub_menu_type)" :virtual_match_list="match_item_batch.matchs"
                :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
                :match_item_batch="match_item_batch"
                @switch_match="switch_match_handle"  @start="match_start_handle">
              </v-s-match-list2>
            </div>
        </template>
       </div>
      </div>

      <template v-if="!no_virtual_match">
        <!--赛事轮|期菜单-->
        <match-tab
          style="display: none;"
          :is_reset_tab_i="is_reset_tab_i"
          :no_list="no_title_list"
          :is_user_switch_league="is_user_switch_league"
          :auto_change_tab_i_first="auto_change_tab_i_first"
          :current_league="tab_items[tab_item_i]"
          :current_match="current_match"
          :is_basket_ball_next_no="is_basket_ball_next_no"
          :v_menu_changed="v_menu_changed"
          :before_match_tab_trend="before_match_tab_trend"
          @sub_nav_change="sub_nav_changed"
          @trend_event_change="trend_event_change"
          @time_ended="timer_ended_handle"
          @update_next_batch_match="v_basket_ball_update_n"
        ></match-tab>
        <!-- 占位撑开高度 -->
      </template>
      </div>
      <!-- <no-data v-else which='noMatch' height='500'></no-data> -->
  </div>
</template>
<script>
import virtual_sports_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-mixin.js";
import noData from "src/base-pc/vr/components/common/vr-sport-no-data.vue";
import matchTab from "src/base-pc/vr/pages/virtual/virtual-sports-part/match-tab.vue"
import v_s_match_list from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-list.vue"
import v_s_match_list2 from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-list2.vue"
import virtual_sports_category from "src/base-pc/vr/pages/virtual/details/children/virtual-sports-category.vue"
import virtual_sports_stage from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-stage.vue"
import dynamic_ranking from "src/base-pc/vr/pages/virtual/virtual-sports-part/dynamic-ranking.vue"
import result_page from "src/base-pc/vr/pages/result/result-page.vue"
import virtual_skeleton from "src/base-pc/vr/components/skeleton/virtual-sports/virtual.vue"
import virtual_sports_right from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-right.vue"
import { IconWapper } from 'src/components/icon'

export default {
  mixins:[virtual_sports_mixin],
  components:{
    'virtual-sports-category':virtual_sports_category,
    'match-tab':matchTab,
    'v-s-match-list':v_s_match_list,
    'v-s-match-list2':v_s_match_list2,
    'virtual-sports-stage':virtual_sports_stage,
    'dynamic-ranking': dynamic_ranking,
    'result-page': result_page,
    noData,
    'icon-wapper': IconWapper,
    'virtual-skeleton':virtual_skeleton,
    'virtual-sports-right':virtual_sports_right
  },
}
</script>

<style lang="scss" scoped>

.virtual-sports-top {
  display: flex;
  height: 324px;
  >div {
    width: 50%;
  }
}

.fixed-head {
  position: sticky;
  top: 0px;
  background: #fff;
  z-index: 100;
  height: 44px;
}

/*  联赛菜单 */
.tab-wrapper {
  height: 44px;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  align-items: center;
  background-color: var(--q-gb-bg-c-27);

  .tab-item {
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    padding: 0 0.1rem;
    flex-shrink: 0;
    color: #777777;
    position: relative;
    font-weight: 400;
    cursor: pointer;
    &.active {
      color: #1A1A1A;
      font-weight: 500;
      &:after {
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        background: var(--q-gb-bg-c-1);
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -4px;
        border-radius: 50%;
      }
    }
  }
}

.tab-title{
  height: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 9px;
  &.tab-border {
    border-bottom: 1px solid var(--q-gb-bd-c-4);
  }
  .league-name{
    color: var(--q-gb-t-c-5);
    font-weight: 600;
    padding-left: 0.07rem;
  }.status{
    .num {
      color: var(--q-gb-t-c-2);
    }
  
    .state{
      margin: 0 5px;
      color: #fff;
      padding: 0 6px;
      border-radius: 3px;
      font-size: 0.11rem;
      display: inline-block;
      background: #7981A4;
      min-width: 0.48rem;
      text-align: center;
    }
    .icon{
      transform: rotate(180deg);
      &.expend_icon {
        transform: rotate(90deg);
      }
    }
  }
}

.all-leagues {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.15rem;
  height: 0.27rem;
  border-top: 0.02rem solid var(--q-gb-bd-c-3);
  background-color: var(--q-gb-bg-c-25);;

  .left {
    font-size: 0.12rem;
    color: var(--q-gb-t-c-5);;
    display: flex;
    align-items: center;
    img {
      width: 0.12rem;
      height: 0.12rem;
      margin-right: 0.04rem;
    }
  }
  .right {
    display: flex;
    align-items: center;
    div {
      width: 0.2rem;
      height: 0.16rem;
      &.expend_all_league {
        transform: rotate(-90deg);
      }
    }
  }
}
.virtual-content-wrapper {
  padding: 0.08rem 0.05rem 0;
  color: var(--q-gb-t-c-2);
  // background: #F2F2F6;
  background-color: var(--q-gb-bd-c-2) ;
  padding-bottom: 0.66rem;
}
.virtual-sports-card {
  &-content {
    background: var(--q-gb-bg-c-18);
    border-radius: .08rem;
    margin-bottom: .08rem;
  }
  &:last-of-type {
    padding-bottom: 0.7rem;
  }
  &-simple{
    background: var(--q-gb-bg-c-28);
  }
}


.list-wrapper {
  margin: 0.04rem 0;
  padding: 0 0.07rem;
}
.v-sports-main-list {
  margin-top: 10px;
  border-top: 1px solid #FF7000;
}
.v-sports-main-list-style {
  padding-bottom: .48rem;
}

.team-title {
  height: 34px;
  display: flex;
  align-items: center;
  color: #fff;
  background: linear-gradient(to right, #3B3B3B 0%, #9C9C9C);
  .info {
    width: 30px;
    height: 34px;
    background-color: var(--q-gb-bg-c-1);
  }
  .title {
    padding-left: 10px;
  }
}
.horse-title {
  display: flex;
  align-items: center;
  padding-right: 5px;
  position: relative;
  .title {
    flex: 10000 1 0%;
  }
  .horse-col {
      font-size: 12px;
      width: 18%;
      max-width: 96px;
      text-align: center;
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_mixin.js