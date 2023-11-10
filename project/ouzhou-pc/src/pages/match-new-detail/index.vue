<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-15 19:17:42
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-17 20:20:33
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\detail\index.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: cooper
 * @Date: 2023-05-17 14:13:55
 * @Description: 赛事详情页
-->
<template>
  <div class="detail-page">
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
            :src="neutral"
            alt=""
            srcset=""
            style="margin: 0 10px; height: 14px"
            v-if="sportId == 1"
          />
          <span class="leagal-time" v-if="sportId == 1 && detail_info.ms == 0">
            {{ detail_info.mgt }}</span
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
  <!-- <div class="detail-loading" v-show="detail_loading">
      <loading></loading>
    </div> -->
</template>

<script setup>
import { onMounted, ref, provide } from "vue";
import { utils, MenuData, LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";
// import neutral from 'src/assets/images/neutral.png'
import odds_info from "./components/odds_info.vue";
import analysis from "./analysis/index.vue";
import tabs from "./components/tabs.vue";
import breadcrumbs from "./components/breadcrumbs.vue";
import { usedetailData } from "./index";
// import down_arrow_fold from 'src/assets/images/down_arrow_fold.png'
// import detail_top from 'src/assets/images/detail-top.png'
// import detail_refresh from 'src/assets/images/detail-fresh.png'
// import { formatTime } from "src/public/utils/time_format";
import loading from "./components/loading/index.vue";
// import store from "src/store-redux-vuex/index.js";

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const expansion_ref = ref(null);
const refresh_data = ref(false);

console.log(route);

const {
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
} = usedetailData(route);

provide("all_hl_item", all_hl_item);

const match_click = (item) => {
  console.log(111111, item);
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
// const go_analyse = () => {
//       store.dispatch({
//         type: "TIP_SHOW_STATE",
//         data: true,
//     })

//     }
</script>

<style lang="scss" scoped>
.detail-page {
  background: #e2e2e2;
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
    background: linear-gradient(to right, #3b3b3b, #9c9c9c);
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
        background-color: #d9d9d9;
      }
    }
  }

  .match-detail-head {
    position: relative;
    height: 80px;

    padding: 15px 0 16px 14px;
    background: linear-gradient(
      90.05deg,
      rgba(255, 255, 255, 0.81) 0.04%,
      rgba(204, 204, 204, 0.6) 99.96%
    );

    .detail-head-leagal {
      display: flex;
      // justify-content: center;
      align-items: center;

      .leagal-time {
        background-color: #d9d9d9;
        color: #1a1a1a;
        padding: 2px 10px;
      }
    }

    .match-detail-head-name {
      font-size: 13px;
      line-height: 18px;
      color: #1a1a1a;
      opacity: 0.6;
    }

    .home-vs-away {
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
      color: #1a1a1a;
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
    background: #ffffff;
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
    background-color: #cccccc;
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
  // background-image: url('src/assets/images/icon_sport_bg.png');
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
  color: #ffffff;
  text-align: center;
  line-height: 45px;

  &:hover {
    background-color: #939393;
  }
}

.active-nav {
  color: #ff7000;
  background-color: #626262;
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
}
.match-name-list {
  background-color: #7b7b7b;
  width: 75%;
  z-index: 1000;
  margin-top: -10px;
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 4px;
  }
}
</style>
