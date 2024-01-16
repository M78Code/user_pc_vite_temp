<!--
 * @Description: 虚拟体育详情页最外层父组件
-->
<template>
  <div class="virtual-detail row justify-between" ref="virtual_detail_box">

    <div class="match-detail-bread">
      <!-- 详情页面包屑 -->
      <breadcrumbs :detail_info="match || {}" />
      <div class="bread-right">
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_top.png`"
          alt=""
          srcset=""
          class="signal"
          @click="()=>{}"
        />
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_fresh.png`"
          alt=""
          srcset=""
          :class="{ balance_refresh: true}"
          @click="()=>{}"
        />
      </div>
    </div>
    <div class="match-detail-head" v-if="0">
      <div class="detail-head-leagal">
        <span class="match-detail-head-name">{{ detail_info.tn }}</span>
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/neutral.png`"
          alt=""
          srcset=""
          style="margin: 0 10px; height: 14px"
          v-if="detail_info.mng"
        />
        <span class="leagal-time">
          <match-process
            :match="detail_info"
            show_page="match-list"
            :rows="1"
          />
        </span>
      </div>
      <div>
        <div
          class="expansion_ref_slotHeader expansion-vs"
          @click.stop="show_item"
        >
          <div style="display: flex;align-items: center;">
            <span class="home-vs-away" :title="detail_info.mhn">{{ detail_info.mhn }} </span>
            <span class="match-detail-head-name m-10">v</span>
            <span class="home-vs-away" :title="detail_info.man">{{ detail_info.man }}</span>
          </div>
          <img
          
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/down_arrow.png`"
            class="expand-icon"
          />
        </div>
        <!-- 显示赛事卡片 -->
        <q-card
          class="match-name-list"
          :style="{ maxHeight: showDetailList ? '500px' : '0px' }"
        >
          <div v-for="item in matchDetailList" :key="item.mid">
            <div
              :class="{
                'card-item': true,
                'active-nav': current_id == item.mid,
              }"
              @click="match_click(item)"
            >
              {{ item.mhn + " v " + item.man }}
            </div>
          </div>
        </q-card>
      </div>
      <div
        class="header_banne sport_bg"
        :style="`background-position:0 -${sport_ball_type[sportId]}px`"
      ></div>
    </div>

    <div class="row virtual-detail-wrap row justify-between">
      <!-- 头部 -->
    <div class="virtual-head" v-if="0">
      <div class="type-bg bg1001">
        <div class="back-wrap">
          <!-- 返回按钮 -->
          <div class="detail-back" @click="go_where({back_to: 'go_back_from_virtual_detail', route_name:route.name,route,router})"></div>
          <!-- 虚拟体育 -->
          <div class="col">{{current_league.name}}</div>
          <!--刷新按钮-->
          <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
        </div>
      </div>
    </div>
    
     <!--玩法集区域 -->
    <div class="detail-main" :class="{'detail-main2':get_betbar_show}">
      <!-- 赔率列表页面 -->
      <template  v-if="match && tabs_name == 'bet'">
        <virtual-sports-tab :mid="mid" />
        <virtual-sports-category :mid="mid" :current_match="match" :source="'virtual_sports_details'"/>
      </template>
      <!-- 历史战绩页面 -->
      <virtual-match-statistic v-if="match && tabs_name == 'lszj'" />
      <!-- 排行榜页面,小组赛淘汰赛页面  -->
      <div v-if="match && tabs_name == 'rank'" class="list-wrapper">
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
    </div>

    <!--视频，tab和玩法集部分-->
    <div>
      <div class="detail-header">
        <!--视频区域-->
        <div class="stage-wrapper">
          <virtual-sports-stage source='detail'
            :current_match="current_match" @update_next_batch_match="update_n_batch_handle"
            :match_process_update="match_process_update"
            :m_status="current_match.match_status"
            :basketball_status="basketball_status"
            @time_ended="timer_ended_handle">
          </virtual-sports-stage>
        </div>
        <!--历史战绩，投注，排行榜tab键-->
        <virtual-sports-detail-tab v-if="0" :current_match="current_match" @virtual_play_height="virtual_play_height" @change_tab="change_tab" />
        <div class="debug-test" v-if="show_debug">
          {{`batchNo:${current_batch.batchNo}-csid:${sub_menuid}-mid:${current_match.mid}`}}<br />
          {{`orderNo:${current_match.orderNo}-tid:${current_league.menuId}`}}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_details_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-details-mixin.js";
import virtual_sports_tab from 'src/base-pc/vr/components/virtual-sports-tab.vue'
import virtual_sports_stage from 'src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-stage.vue'
import virtual_sports_category from "src/base-pc/vr/pages/virtual/details/children/virtual-sports-category.vue"
import virtual_sports_detail_tab from 'src/base-pc/vr/pages/virtual/details/children/virtual-sports-detail-tab.vue'
import ranking_list_start from "src/base-pc/vr/pages/virtual/virtual-sports-part/ranking-list-start.vue"
import football_ranking_list from "src/base-pc/vr/pages/virtual/virtual-sports-part/football-ranking-list.vue"
import group_knockout from "src/base-pc/vr/pages/virtual/virtual-sports-part/group-knockout.vue"
import virtual_match_statistic from 'src/base-pc/vr/components/virtual-match-statistic.vue'
import breadcrumbs from "src/base-pc/vr/pages/virtual/details/children/breadcrumbs.vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

export default {
  mixins:[virtual_sports_details_mixin],
  name:'virtual_sports_details',
  components: {
    'virtual-sports-tab': virtual_sports_tab,
    'virtual-match-statistic': virtual_match_statistic,
    'virtual-sports-stage': virtual_sports_stage,
    'virtual-sports-category': virtual_sports_category,
    'virtual-sports-detail-tab': virtual_sports_detail_tab,
    'ranking-list-start':ranking_list_start,
    'football-ranking-list':football_ranking_list,
    'group-knockout':group_knockout,
    breadcrumbs
  },
  data(){
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  }
}
</script>

<style lang="scss" scoped>

.virtual-detail {
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;

  .match-detail-bread {
    width: 770px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    background: var(--q-gb-bg-lg-5);
    display: flex;
    justify-content: space-between;
    .bread-right {
      position: relative;
      display: flex;
      align-items: center;

      &::before {
        content: "";
        position: absolute;
        left: -20px;
        width: 2px;
        height: 20px;
        top: 9px;
        background-color: var(--q-gb-bg-c-10);
      }
    }
  }
  .detail-main {
    width: 770px;
  }
  .virtual-sports-stage {
    width: 400px;
  }
}
/*  头部 */
.virtual-head {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
  height: 0.44rem;

  .type-bg {
    height: 100%;
    background-size: 100% auto;
  }

  .back-wrap {
    display: flex;
    align-items: center;
    font-size: 16px;
    height: 0.44rem;

    .detail-back {
      width: 0.3rem;
      height: 100%;
      background: url($SCSSPROJECTPATH + '/image/common/go_back.svg') no-repeat center / 96% 96%;
      background-size: 0.1rem auto;
      margin-left: 0.05rem;
      & + div {
        color: #fff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    /*  刷新按钮 */
    @keyframes loading-ring-animate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .virtual-ref {
      width: 0.4rem;
      height: 100%;
      background: var(--q-color-com-img-bg-70) center no-repeat;
      background-size: 0.2rem auto;

      &.refreshing {
        animation: 0.7s loading-ring-animate linear;
      }
    }

    .no-single {
      width: 40px;
      height: 100%;
      background: var(--q-color-com-img-bg-85) center no-repeat;
      background-size: 0.2rem auto;
    }

    .set-menu {
      :deep(.filter-icon-wrapper) {
        width: 0.4rem;
        height: 0.44rem;
        margin-right: 0.1rem;

        .img {
          background-image: var(--q-color-com-img-bg-73);
        }
      }
    }
  }
}

.detail-header-bg {
  width: 100%;
  position: sticky;
  top: 0.44rem;
  z-index: 98;
  height: 0;

  &:after {
    content: '';
    position: fixed;
    height: 0.46rem;

    left: 0;
    top: 0.44rem;

    width: 100%;
  }
}

.detail-header {
  position: sticky;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 99;

  .stage-wrapper {
    width: 100%;
    min-height: 2rem;
  }

  .debug-test {
    bottom: -18px;
    left: 18px;
    position: absolute;
  }
}

.detail-main {
  margin-top: 0.04rem;

  &::-webkit-scrollbar {
    display: none;
  }

  overflow-x: scroll;
  overflow-y: hidden;
}

.detail-main2 {
  margin-bottom: 0.5rem;
}
:deep(.stage-wrapper .banner) {
  width: 100%;
  height: 2.54rem;
  border-radius: 0;
}
</style>

