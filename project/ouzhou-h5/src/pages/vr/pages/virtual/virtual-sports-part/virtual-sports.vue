<!--
 * @Author: Cronus
 * @Date: 2020-12-22 18:07:03
 * @Description: 虚拟体育首页主文件
-->
<template>
  <div class="virtual-sports">
    <virtual-skeleton v-show="virtual_data_loading">
    </virtual-skeleton>
    <!--联赛tab-->
    <div class="fixed-head">
      <div class="tab-wrapper">
        <div class="tab-item" :class="{active:i == tab_item_i}" v-for="(tab_item,i) of tab_items"
          :key="i" @click="tab_item_click_handle(i,null,'user_change')">
          <div>{{tab_item.name}}</div>
        </div>
      </div>
    </div>
    <div class="virtual-content-wrapper">
      <div class="virtual-sports-card">
        <div class="virtual-sports-card-content">
          <div>
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
            <div class="test-line" v-if="show_debug">
              {{current_match.mid}}
            </div>
          </div>
        </div>
      </div>

      <!--赛事轮|期菜单-->
      <match-tab
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
          @change_tab="change_tab"
        ></match-tab>

        <!-- {{ current_sub_menu }} -->
        <!-- {{ sub_menu_type }} -->
      <div class="virtual-sports-card">
       <div  class="virtual-sports-card-content" :class="{'virtual-sports-card-simple': standard_edition === 1}">
          <!--  虚拟体育主列表页面  -->
          <div
              class="v-sports-main-list"
              :class="{'v-sports-main-list-style': standard_edition === 1}"
              :style="{'padding-bottom': '0'}"
          >

            <!-- 虚拟体育足球赛事列表 -->
            <v-s-match-list v-if="tabs_name == 'list' && [1001,1004].includes(sub_menu_type)" :virtual_match_list="match_list_by_no"
              :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
              @switch_match="switch_match_handle"  @start="match_start_handle"
              :lengue_name="lengue_name">
            </v-s-match-list>


            <!-- 排行榜页面,小组赛淘汰赛页面    从vr详情(project\ouzhou-h5\src\pages\vr\pages\virtual\virtual-sports-details.vue)中 复制过的  start -->
            <div v-if="tabs_name == 'rank'" class="list-wrapper">
              <!-- {{ sub_menu_type }} -->
              <div v-if="[1001,1004].includes(sub_menu_type)">
                <!--  足球小组赛,淘汰赛页面  -->
                <group-knockout
                  v-if="current_league ? current_league.field3 != '': false"
                  :tid="current_league.field1"
                  :current_match="current_match"
                />
                <!--  足球排行榜页面  -->
                <football-ranking-list v-else :tid="current_league.field1"/>
              </div>
              <!--  非足球排行榜页面  -->
              <ranking-list-start v-else :mid="current_match.mid"/>
            </div>
            <!-- 从vr详情(project\ouzhou-h5\src\pages\vr\pages\virtual\virtual-sports-details.vue)中 复制过的  end -->


            <div v-if="current_match.match_status == 0">
              <!-- 赛马切换玩法集tab组件 -->
              <virtual-sports-tab
                :batch="current_match_id"
                v-if="![1001,1004].includes(sub_menu_type)">
              </virtual-sports-tab>
              <!-- 打印请勿删除 -->
              <!-- <div><span>赛事状态</span>{{current_match.match_status}}</div> -->
              <!-- 赛马投注区域 -->
              <div v-if="match_list_by_no && match_list_by_no.length && ![1001,1004].includes(sub_menu_type)">
                <virtual-sports-category
                    :top_menu_changed="top_menu_changed"
                    :current_match="match_list_by_no[0]"
                    source='sports'
                    @top_menu_change="handle_top_menu_change"
                />
              </div>
            </div>

            <!-- 注释勿删除 -->
            <div class="v-sports-ranking" v-if="![1001,1004].includes(sub_menu_type)">
              <!-- 打印请勿删除 -->
              <!-- <div><span>赛事状态</span>{{current_match.match_status}}</div> -->
              <!-- 赛马的动态排名---赛马在比赛过程的时候显示 -->
              <dynamic-ranking v-if="current_match.match_status == 1" :virtual_match_list="[current_match]" />
              <!-- 赛马的结果展示页---赛马开奖结束后显示赛果 -->
              <result-page v-if="current_match.match_status == 2" :match_mid="current_match.mid" :current_match="current_match" @send_virtual_result_rank_data='send_virtual_result_rank_data'/>
            </div>
            
          </div>
       </div>
      </div>
      </div>
      <!-- <no-data v-else which='noMatch' height='500'></no-data> -->
  </div>
</template>
<script>
import virtual_sports_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-mixin.js";
import noData from "project_path/src/pages/vr/components/common/vr-sport-no-data.vue";
import matchTab from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/match-tab.vue"
import v_s_match_list from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-list.vue"
import virtual_sports_category from "project_path/src/pages/vr/pages/virtual/details/children/virtual-sports-category.vue"
import virtual_sports_stage from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-stage.vue"
import dynamic_ranking from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/dynamic-ranking.vue"
import result_page from "project_path/src/pages/vr/pages/result/result-page.vue"
import virtual_skeleton from "project_path/src/pages/vr/components/skeleton/virtual-sports/virtual.vue"
import { IconWapper } from 'src/components/icon'
import virtual_sports_tab from 'src/base-h5/vr/components/virtual-sports-tab.vue'
import ranking_list_start from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/ranking-list-start.vue"
import football_ranking_list from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/football-ranking-list.vue"
import group_knockout from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/group-knockout.vue"

export default {
  mixins:[virtual_sports_mixin],
  components:{
    'virtual-sports-category':virtual_sports_category,
    'match-tab':matchTab,
    'v-s-match-list':v_s_match_list,
    'virtual-sports-stage':virtual_sports_stage,
    'dynamic-ranking': dynamic_ranking,
    'result-page': result_page,
    noData,
    'icon-wapper': IconWapper,
    'virtual-skeleton':virtual_skeleton,
    'virtual-sports-tab':virtual_sports_tab,
    'ranking-list-start':ranking_list_start,
    'football-ranking-list':football_ranking_list,
    'group-knockout':group_knockout,
  },
  data(){
    return {
      tabs_name: 'list'
    }
  },
  methods: {
    /**
     * 提前10秒通知封盘-覆盖mixin
     * @params {Object} mid 赛事id,batchNo 期号
     */
     arrived10_handle({mid,batchNo}){
      if(this.match_list_by_no && this.match_list_by_no.length){
        this.match_list_by_no.forEach(m => {
          if(m.batchNo == batchNo){
            m.mhs = 1;
          }
        });
      }
      if(this.sub_menu_type == 1004 && !this.singleton_10second){
        this.singleton_10second = true;
        this.get_score_basket_ball();
      }
    },
    change_tab(tabs){
      // console.log("tabs=======", tabs);
      this.tabs_name = tabs
    },
  }
}
</script>

<style lang="scss" scoped>

.fixed-head {
  position: sticky;
  top: 0rem;
  background: var(--q-gb-bg-c-21);
  z-index: 100;
}

/*  联赛菜单 */
.tab-wrapper {
  height: 0.32rem;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  align-items: center;
  padding: 0 0.08rem;
  background-color: var(--q-gb-bg-c-27);

  .tab-item {
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    padding: 0 0.1rem;
    flex-shrink: 0;
    color:var(--q-gb-t-c-24);
    position: relative;
    &.active {
      color: var(--q-gb-t-c-1);
      &:after {
        content: "";
        display: block;
        width: 0.32rem;
        height: 0.02rem;
        background: var(--q-gb-t-c-1);
        position: absolute;
        bottom: -0.03rem;
        left: 50%;
        margin-left: -0.16rem;
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
    color: var(--q-gb-t-c-18);
    font-weight: 600;
    padding-left: 0.07rem;
  }.status{
    .num {
      color: var(--q-gb-t-c-18);
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
    color: var(--q-gb-t-c-18);;
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
  color: #1A1A1A;
  // background: #F2F2F6;
}
.virtual-sports-card {
  &-content {
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

.v-sports-main-list-style {
  padding-bottom: .48rem;
}

.virtual-video-play-team {
    display: flex;
    padding: .1rem;
    padding-bottom: 0;
    background: var(--q-gb-bg-c-28);
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    border-bottom-left-radius: .04rem;
    border-bottom-right-radius: .04rem;
    .vsm-options {
      width: 49%;
      height: 0.52rem;
      background: var(--q-gb-bg-c-18);
      border-radius: .04rem;
      margin-bottom: .08rem;
      display: flex;
      align-items: start;
      justify-content: center;
      flex-direction: column;
      font-size: .12rem;
      padding: .02rem .12rem;
      &.active {
        background: var(--q-gb-bg-c-37);
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
        .teams {
          color: var(--q-gb-t-c-30);
        }
      }
      .teams {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_mixin.js