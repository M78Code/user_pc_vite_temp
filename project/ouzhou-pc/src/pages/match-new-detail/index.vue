<template>
  <div class="detail-page" v-if="!detail_loading">
    <div class="match-detail-container">
      <div class="match-detail-bread">
        <!-- 详情页面包屑 -->
        <breadcrumbs :detail_info="detail_info || {}" />
        <div class="bread-right">
          <q-img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_top.png`"
            alt=""
            v-if="is_show_sr_flg(detail_info) && IS_FOR_NEIBU_TEST"
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
          </q-img>
          <img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_fresh.png`"
            alt=""
            srcset=""
            :class="{ balance_refresh: true, route_btn: refresh_data }"
            @click="refresh_click"
          />
        </div>
      </div>
      <div class="match-detail-head">
        <div class="detail-head-leagal">
          <span class="match-detail-head-name">{{ detail_info.tn }}</span>
          <img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/neutral.png`"
            alt=""
            srcset=""
            style="margin: 0 10px; height: 14px"
            v-if="detail_info.mng"
          />
          <!--
            赛事详情
            sportId 球类ID
            ms 赛事状态：0未开赛，1 进行中
            <span class="leagal-time" v-if="sportId == 1 && detail_info.ms == 0">
            {{ formatTime(detail_info.mgt, 'dd/mm hh:MM')  }}
            </span>
          -->
          <span class="leagal-time">
            <match-process
              :match="detail_info"
              show_page="match-list"
              :rows="1"
            />
            <!-- <span v-if="detail_info.ms==0"> {{ formatTime(detail_info.mgt, 'mm月dd日 hh:MM')  }}</span>
              <span v-else >
                <match-process :match="detail_info" show_page="match-list" :rows="1" />
              </span> -->
          </span>
        </div>
        <div>
          <div
            class="expansion_ref_slotHeader expansion-vs"
            @click.stop="show_item"
          >
            <div style="display: flex; align-items: center">
              <span class="home-vs-away" :title="detail_info.mhn"
                >{{ detail_info.mhn }}
              </span>
              <span class="match-detail-head-name m-10">v</span>
              <span class="home-vs-away" :title="detail_info.man">{{
                detail_info.man
              }}</span>
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
      <!-- tabs 玩法分类切换 -->
      <tabs :tab_options="tabList" v-model="current_key" />

      <!-- 玩法模板 -->
      <odds_info
        :show_close_thehand="show_close_thehand"
        :matchDetail="detail_list"
        :loading="detail_loading"
        :detail_info="detail_info || {}"
      />
    </div>
    <!-- 赛事分析页 -->
    <!-- <div class="detail-analysis">
      <analysis :detail_info="detail_info || {}" />
    </div> -->
  </div>
  <div class="detail-loading" v-if="detail_loading">
    <loading></loading>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, computed } from "vue";
import {
  MenuData,
  LOCAL_PROJECT_FILE_PREFIX,
  useMittOn,
  MITT_TYPES,
} from "src/output/index.js";
import odds_info from "./components/odds_info.vue";
import analysis from "./analysis/index.vue";
import tabs from "./components/tabs.vue";
import breadcrumbs from "./components/breadcrumbs.vue";
import { usedetailData } from "./index";
import {
  formatTime,
  is_show_sr_flg,
  format_M_D_PC,
  MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance,
} from "src/output/index.js";
import loading from "./components/loading/index.vue";
import { useRouter, useRoute } from "vue-router";
import details from "src/core/match-list-pc/details-class/details.js";
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
export default {
  components: {
    tabs,
    breadcrumbs,
    analysis,
    odds_info,
    loading,
    matchProcess,
  },
  setup(ctx) {
    const router = useRouter();
    const route = useRoute();
    const refresh_data = ref(false);
    const sportId = route.params.csid;
    const {
      tabList,
      detail_list,
      current_key,
      detail_loading,
      detail_info,
      init,
      show_close_thehand,
      matchDetailList,
      current_id,
      refresh,
      get_match_detail,
    } = usedetailData(route);

    const showDetailList = ref(false);
    const match_click = (item) => {
      current_id.value = item.mid;
      const { mid, tid, csid } = item;
      const params = {
        mid,
        tid,
        csid,
      };

      router.replace({
        name: "details",
        params,
      });
    };
    //  打开赛事分析
    const go_analyse = () => {
      details.sr_click_handle(detail_info.value);
    };

    const refresh_click = lodash.debounce(() => {
      refresh_data.value = true;
      init({
        isNeedLoading: false,
      });
      setTimeout(() => {
        refresh_data.value = false;
      }, 1000);
    }, 500);

    const show_item = () => {
      showDetailList.value = !showDetailList.value;
    };
    const detail_mitt = useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, init).off;
    function mousedown_fun(e) {
      if (
        e.target.className != "home-vs-away" &&
        e.target.className != "expand-icon"
      ) {
        showDetailList.value = false;
      }
      // expansion_ref.value&&expansion_ref.value.hide();
    }
    onMounted(() => {
      window.addEventListener("mousedown", mousedown_fun);
    });

    onUnmounted(() => {
      detail_mitt();
      window.removeEventListener("mousedown", mousedown_fun);
    });

    const sport_ball_type = {
      1: 0,
      2: 450,
      3: 450,
      4: 980,
      5: 2790,
      6: 90,
      7: 2430, // 斯诺克
      8: 890, // 乒乓球
      9: 1440,
      10: 1900,
      11: 1990,
      12: 540,
      14: 180,
      100: 1340, // 英雄联盟
      101: 3420, // dota
      102: 3510, // cs
      103: 3600, // 王者荣耀
    };

    const { IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG;
    return {
      tabList,
      detail_list,
      current_key,
      detail_loading,
      detail_info,
      sportId,
      // all_hl_item,
      init,
      show_close_thehand,
      matchDetailList,
      current_id,
      refresh,
      sport_ball_type,
      MatchDataWarehouseInstance,
      refresh_data,
      LOCAL_PROJECT_FILE_PREFIX,
      formatTime,
      match_click,
      refresh_click,
      show_item,
      showDetailList,
      go_analyse,
      is_show_sr_flg,
      IS_FOR_NEIBU_TEST,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail-page {
  background: var(--q-gb-bg-c-6);
  display: flex;
  width: 100%;
  padding-bottom: 50px;
  // margin-left: 10px;

  :deep(.q-item__label) {
    line-height: 35px !important;
  }
}
.match-detail-container {
  flex: 1;
  overflow: hidden;

  // height: calc(100vh - 60px);
  // width: 63%;
  .match-detail-bread {
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
  :deep(.temp) {
    padding: 0 16px;
    .oid-width {
      margin: 0px;
    }
    .temp-on {
      margin-left: 4px;
    }
  }
  .match-detail-head {
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

  .match-detail-tab {
    height: 50px;
    background: var(--q-gb-bg-c-4);
  }
}

.detail-analysis {
  margin: 0 0px 9px 9px;
  width: 404px;
  height: calc(100vh - 87px);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }
}

.signal {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;

  // background: url('../../../assets/images/detail_refresh.png') no-repeat;
  // // transform: scale(0.55);
  // background-position: -16px 10px;
  // // 不同规格的icon在一张精灵图里边因此需根据不同需求控制背景尺寸
  // background-size: 81px 17px;
  margin-right: 15px;
}

.balance_refresh {
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 18px;
  // background: url('../../../assets/images/detail_refresh.png') no-repeat;
  // // transform: scale(0.55);
  // background-position: -63px 10px;
  // // 不同规格的icon在一张精灵图里边因此需根据不同需求控制背景尺寸
  // background-size: 81px 17px;
  margin-right: 15px;
  // transition: all 0.5 linear;
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

.expand-icon {
  height: 10px;
  margin-left: 10px;
  margin-top: 12px;
}

.card-item {
  cursor: pointer;
  height: 45px;
  color: var(--q-gb-t-c-1);
  text-align: center;
  line-height: 45px;

  &:hover {
    background-color: var(--q-gb-bg-c-7);
  }
}

.active-nav {
  color: var(--q-gb-t-c-2);
  background-color: var(--q-gb-bg-c-9);
}

.route_btn {
  animation: rotate-ani 1s linear infinite;
  transform-origin: center center;
}

@keyframes rotate-ani {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.detail-loading {
  height: 100%;

  & :deep(.loading_box) {
    padding-top: 330px;
  }
}
.match-name-list {
  background-color: var(--q-gb-bg-c-8);
  width: 75%;
  z-index: 1000;
  // margin-top: -8px;
  // max-height: 500px;
  overflow-y: auto;
  transition: all 0.3s linear;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }
}

.expansion_ref_slotHeader {
  width: 100%;
  line-height: 35px;
  font-weight: 500;
  display: flex;
}

:deep(.q-expansion-item) {
  .q-focus-helper {
    visibility: hidden;
  }
}
.expansion-vs {
  cursor: pointer;
}
//q-item-type row no-wrap q-item--clickable q-link cursor-pointer q-focusable q-hoverable

// 这里添加的css为了修复Bug：49115 【UAT】【欧洲版二期】【PC】足篮赛事详情页顶部栏赛事开赛时间/赛事进行时间偏上没有居中展示
.leagal-time {
  padding: 4px 10px 2px 10px !important;
}
.leagal-time :deep(.date-wrap) {
  padding: 0 0 0 5px !important;
  .timer-layout2 {
    padding: 0 0 0 0 !important;
  }
  .timer-layout0 {
    padding: 0 0 0 0 !important;
  }
}
</style>
