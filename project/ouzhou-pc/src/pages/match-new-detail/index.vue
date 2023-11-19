<template>
  <div class="detail-page" v-show="!detail_loading">
    <div class="match-detail-container">
      <div class="match-detail-bread">
        <!-- 详情页面包屑 -->
        <breadcrumbs :detail_info="detail_info || {}" />
        <div class="bread-right">
          <img
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/detail_top.png`"
            alt=""
            srcset=""
            class="signal"
            @click="go_analyse"
          />
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
            v-if="sportId == 1"
          />
          <span class="leagal-time" v-if="sportId == 1 && detail_info.ms == 0">
            {{ formatTime(detail_info.mgt, 'dd/mm hh:MM')  }}</span
          >
        </div>
        <div>
          <q-expansion-item
            ref="expansion_ref"
            expand-separator
            :expand-icon-toggle="false"
            :hide-expand-icon="true"
          >
            <template v-slot:header>
              <div
                style="
                  width: 100%;
                  line-height: 35px;
                  font-weight: 500;
                  display: flex;
                "
              >
                <div @click="show_item">
                  <span class="home-vs-away">{{ detail_info.mhn }} </span>
                  <span class="match-detail-head-name m-10">v</span>
                  <span class="home-vs-away">{{ detail_info.man }}</span>
                </div>
                <img
                  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/down_arrow.png`"
                  alt=""
                  srcset=""
                  class="expand-icon"
                />
              </div>
            </template>
            <q-card class="match-name-list">
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
          </q-expansion-item>
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
  <div class="detail-loading" v-show="detail_loading">
      <loading></loading>
    </div>
</template>

<script>
import { onMounted, ref, provide } from "vue";
import { utils, MenuData, LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";
import odds_info from "./components/odds_info.vue";
import analysis from "./analysis/index.vue";
import tabs from "./components/tabs.vue";
import breadcrumbs from "./components/breadcrumbs.vue";
import { usedetailData } from "./index";
import { formatTime } from 'src/core/format/index.js'
import loading from "./components/loading/index.vue";
import { useRouter, useRoute } from "vue-router";
export default{
  components: {
    tabs,
    breadcrumbs,
    analysis,
    odds_info,
    loading
  },
  setup(ctx){
    const router = useRouter();
    const route = useRoute();
    const expansion_ref = ref(null);
    const refresh_data = ref(false);
    const sportId = route.params.csid
    console.log(route);
    const {
      tabList,
      detail_list,
      current_key,
      detail_loading,
      detail_info,
      // sportId,
      all_hl_item,
      init,
      show_close_thehand,
      matchDetailList,
      current_id,
      refresh,
      get_match_detail
    } = usedetailData(route);

    provide("all_hl_item", all_hl_item);

    const match_click = (item) => {
      current_id.value = item.mid;
      const { mid, tid, csid } = item;
      const params = {
        mid,
        tid,
        csid,
      };

      router.push({
        name: "details",
        params,
      });
      expansion_ref.value.hide();
      setTimeout(() => {
        refresh();
      }, 200);
    };

    const refresh_click = () => {
      refresh_data.value = true;
      init();
      setTimeout(() => {
        refresh_data.value = false;
      }, 1000);
    };

    const sport_ball_type = {
      1: 0,
      2: 90,
      3: 450,
      5: 540,
      7: 1170,
      8: 180,
      9: 270,
    };
    return{
      tabList,
      detail_list,
      current_key,
      detail_loading,
      detail_info,
      sportId,
      all_hl_item,
      init,
      show_close_thehand,
      matchDetailList,
      current_id,
      refresh,
      sport_ball_type,
      expansion_ref,
      refresh_data,
      LOCAL_PROJECT_FILE_PREFIX,
      formatTime,
      match_click,
      refresh_click
    }
  }
}


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
    background: linear-gradient(to right, #3B3B3B, #9C9C9C);
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

  .match-detail-head {
    position: relative;
    height: 80px;

    padding: 15px 0 16px 14px;
    background: var(--q-gb-bg-lg-4);

    .detail-head-leagal {
      display: flex;
      // justify-content: center;
      align-items: center;

      .leagal-time {
        background-color: var(--q-gb-bg-c-10);
        color: var(--q-gb-t-c-5);
        padding: 2px 10px;
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
  width: 18px;
  height: 18px;
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
  background-image:url($SCSSPROJECTPATH + "/image/png/icon_sport_bg.png"); 
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
  &::v-deep{
    .loading_box {
      padding-top: 330px;
    }
  }
}
.match-name-list {
  background-color: var(--q-gb-bg-c-8);
  width: 75%;
  z-index: 1000;
  margin-top: -10px;
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }
}
</style>
