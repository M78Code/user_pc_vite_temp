<!--
 * @Description: 虚拟体育详情页最外层父组件
-->
<template>
  <div class="virtual-detail row justify-between" ref="virtual_detail_box">

    <div class="virtual-detail-wrap">
      <!-- 头部 -->
      <div class="match-detail-bread">
        <!-- 详情页面包屑 -->
        <breadcrumbs :detail_info="match || {}" v-if="match" />
        <div class="bread-right">
        <!-- // vr 没有赛事分析 -->
          <!-- <q-img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_top.png`"
            alt=""
            srcset=""
            class="signal"
            @click="go_analyse"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[40, 10]"
            >
              {{ i18n_t("common.analysis") }}
            </q-tooltip>
          </q-img> -->
          <q-img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_fresh.png`"
            alt=""
            srcset=""
            :class="['refresh', refreshing && 'refreshing']"
            @click="vir_refresh"
          ></q-img>
        </div>
      </div>
      <div class="match-detail-head" v-if="match">
        <div class="detail-head-leagal">
          <span class="match-detail-head-name">{{ match.tn }}</span>
          <img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/neutral.png`"
            alt=""
            srcset=""
            style="margin: 0 10px; height: 14px"
            v-if="match.mng"
          />
          <span class="leagal-time">
            <match-process
              :match="match"
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
              <span class="home-vs-away" :title="match.mhn">{{ match.teams[0] }} </span>
              <span class="match-detail-head-name m-10">v</span>
              <span class="home-vs-away" :title="match.man">{{ match.teams[1] }}</span>
            </div>
          </div>
        </div>
        <div
          class="header_banne sport_bg"
          :style="`background-position:0 -${sport_ball_type[1]}px`"
        ></div>
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
      </div>
    </div>

    <!--视频，tab和玩法集部分-->
    <div>
      <div class="detail-header">
        <div class="title">
          {{ match.tn }} {{ match.no }}
        </div>
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

      <!-- vr详情页右侧区域，包括足蓝队伍比分，赛马队伍和赛果 -->
      <virtual-sports-right v-if="match" :current_match="match" :match_list_by_no="match_list_by_no" :switch_match_handle="()=>{}" />

      <!-- 排行榜页面,小组赛淘汰赛页面  -->
      <div v-if="match" class="list-wrapper">
        <div v-if="sub_menu_type == 1001">
          <!--  足球小组赛,淘汰赛页面  -->
          <group-knockout
            v-if="current_league ? current_league.field3 != '': false"
            :tid="current_league.field1"
            :current_match="current_match"
          />
          <!--  足球排行榜页面  -->
          <football-ranking-list v-else :tid="current_league.field1"/>
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
import football_ranking_list from "src/base-pc/vr/pages/virtual/virtual-sports-part/football-ranking-list.vue"
import group_knockout from "src/base-pc/vr/pages/virtual/virtual-sports-part/group-knockout.vue"
import virtual_match_statistic from 'src/base-pc/vr/components/virtual-match-statistic.vue'
import breadcrumbs from "src/base-pc/vr/pages/virtual/details/children/breadcrumbs.vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js";
import virtual_sports_right from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-right.vue"
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import {api_v_sports} from "src/api/index.js";
import details from "src/core/match-list-pc/details-class/details.js";

export default {
  mixins:[virtual_sports_details_mixin],
  name:'virtual_sports_details',
  components: {
    'virtual-sports-tab': virtual_sports_tab,
    'virtual-match-statistic': virtual_match_statistic,
    'virtual-sports-stage': virtual_sports_stage,
    'virtual-sports-category': virtual_sports_category,
    'virtual-sports-detail-tab': virtual_sports_detail_tab,
    'football-ranking-list':football_ranking_list,
    'group-knockout':group_knockout,
    'match-process': matchProcess,
    'virtual-sports-right':virtual_sports_right,
    breadcrumbs
  },
  data(){
    return {
      match_list_by_no: [],
      LOCAL_PROJECT_FILE_PREFIX,
      sport_ball_type: {
      1: 0,
      2: 450,
      3: 450,
      4: 980,
      5: 2790,
      6: 90,
      7: 2430,
      8: 890,
      9: 1440,
      10: 1900,
      11: 1990,
      12: 540,
      14: 180,
    }
    }
  },
  mounted(){
    // 获取队伍列表
    this.get_virtual_sport_local()
  },
  methods: {
    /**
     * @description: 获取虚拟体育赛事列表
     */
     get_virtual_sport_local(){
      let params = {
        csid: this.sub_menu_type,
        tid: this.current_league.menuId
      };
      api_v_sports.get_virtual_sport_list(params).then(res => {
        if(res.code == 200 && res.data && res.data.length){
          // 获取当前轮次赛事
          let found = res.data.filter(vm => {
            return this.match.batchNo == vm.batchNo;
          })[0];
          if(found){
            this.match_list_by_no = found.matchs;
          }
        }
      }).catch((e) => {
     
      });
    },
    //  打开赛事分析
    go_analyse() {
      details.sr_click_handle(this.current_match);
    }
  },
  computed:{
    current_league(){return VR_CTR.state.current_league},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
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
      .refreshing {
          animation: 0.7s loading-ring-animate linear;
        }
    }
  }

  .match-detail-head {
    width: 770px;
    position: relative;
    height: 80px;

    padding: 15px 0 16px 14px;
    background: var(--q-gb-bg-lg-4);

    :deep(.q-item) {
      padding: 8px 0px;
    }

    .detail-head-leagal {
      display: flex;
      // justify-content: center;
      align-items: center;

      .leagal-time {
        margin-left: 5px;
        // background-color: var(--q-gb-bg-c-10);
        // color: var(--q-gb-t-c-5);
        padding: 2px 5px 2px 0px;
        :deep(.date-wrap) {
          display: flex;
        }
        :deep(.c-match-process) {
          background-color: var(--q-gb-bg-c-10);
          color: var(--q-gb-t-c-5);
        }
      }
    }

    .match-detail-head-name {
      font-size: 13px;
      line-height: 18px;
      color: var(--q-gb-t-c-5);
      opacity: 0.6;
    }

    .home-vs-away {
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
      color: var(--q-gb-t-c-5);
      margin-top: 6px;
      display: inline-block;
      max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }

    .m-10 {
      margin: 0 10px;
      font-size: 18px;
    }

    .match-detail-head-bc {
      position: absolute;
      right: 0;
      top: 0;
      // opacity: 0.3;
      height: 100%;
    }
  }

  
  .signal,.refresh {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }
  
  
  .sport_bg {
    width: 226px;
    height: 80px;
    background-image: url($SCSSPROJECTPATH + "/image/png/icon_sport_bg.png");
    background-size: 226px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .detail-main {
    width: 770px;
  }
  .virtual-sports-stage {
    width: 400px;
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
  width: 100%;

  .title {
    height: 40px;
    line-height: 40px;
    background: #fff;
    color: #1A1A1A;
    padding-left: 10px;
  }

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

.list-wrapper {
  background: var(--q-gb-bg-c-4);
}
</style>

