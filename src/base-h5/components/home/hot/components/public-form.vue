<!--
 * @Description: 首页热门足球和 篮球的 公共榜单表格
-->
<template>
  <div class="hot_public_form">
    <!-- 球队 东部及西部 联盟-->
    <template v-if="tab_name_index == 1 && liat_data && liat_data.length>0">
      <div class="table-score-wrapper">
        <div class="table-score">
          <!-- 球队榜7 下边的  西部联盟8     东部联盟9 -->
          <div class="tab-league-wrapper">
            <div class="tab row align_items justify-center" v-if="allianc_list.length > 0">
          <span
              v-for="(tab, index) in allianc_list" :key="index"
              class="row align_items justify-center"
              :class="[allianc_list_index == index ? 'active' : '']"
              @click="alliancTab(tab, index)"
          >{{ tab.key }}</span>
            </div>
          </div>
          <!-- 头部 -->
          <div class="header">
            <div class="col1">{{ i18n_t('analysis_football_matches.rank') }}</div>
            <div class="col2">{{ i18n_t('analysis_football_matches.team') }}</div>
            <div class="alliance—col3">{{ i18n_t('analysis_football_matches.victory') }}</div>
            <div class="alliance—col3">{{ i18n_t('analysis_football_matches.negative') }}</div>
            <div class="col5">{{ i18n_t('home_popular.win_rate') }}</div>
          </div>
          <!-- 主内容 -->
          <div class="group-item">
            <div class="team-item" :class="{'font-bold': i < 3}" v-for="(item, i) in liat_data" :key="i" >
              <div class="col1">
                <img v-if="i<3" class="img-Avatar" :src=" item.teamLogo ? get_server_file_path(item.teamLogo) : compute_img_url('league-avatar-dedault')" @error="league_icon_error" alt="">
                <span v-else class="number" :class="`calculation_color${+i+ 1}`">{{ +i+ 1 }}</span>
              </div>
              <!-- 球队 -->
              <div class="col2 ellipsis">{{ item.teamName }}</div>
              <div class="alliance—col3">{{ item.winTotal }}</div><!-- 胜 -->
              <div class="alliance—col3">{{ item.lossTotal }}</div>
              <div class="col5">{{ Math.round(item.winRate * 100) +'%' }}</div><!-- 胜率 -->
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- ["篮球": 下边的 得分 助攻  篮板]  或者   ["足球":下边的 积分  射手  助攻]-->
    <template v-if="tab_name_index == 2 && liat_data && liat_data.length>0">
      <div class="table-score-wrapper">
        <div class="table-score">
          <!-- 头部 -->
          <div class="header">
            <div class="col1">{{ i18n_t('analysis_football_matches.rank') }}</div>
            <div class="col2">{{ i18n_t('home_popular.player') }}</div>
            <div class="rebounds—col3">{{ i18n_t('analysis_football_matches.team') }}</div>
            <div class="col5">
              {{public_form_title.type == '2' ? i18n_t('home_popular.assist') : public_form_title.type == '5' ? i18n_t('match_result.goal') : i18n_t('home_popular.average')}}
            </div>
          </div>
          <!-- 主内容 -->
          <div class="group-item">
            <div class="team-item" v-for="(item, i) in liat_data" :key="i" :class="{ 'black-font':  i<3}">
              <div class="col1">
                <img v-if="i<3" class="img-Avatar" :src=" item.playerLogo ? get_server_file_path(item.playerLogo) : compute_img_url('league-avatar-dedault')" @error="league_icon_error" alt="">
                <span v-else class="number" :class="`calculation_color${+i+ 1}`">{{ +i+ 1 }}</span>
              </div>
              <!-- 球队 -->
              <div class="col2 ellipsis">{{ item.playerCnName }}</div>
              <div class="rebounds—col3">{{ item.teamCnName }}</div><!-- 胜 -->
              <div class="col5">{{ item.rankingValue }}</div><!-- 积分 -->
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 积分榜 -->
    <template v-if="tab_name_index == 3 && liat_data && liat_data.length>0">
      <div class="table-score-wrapper">
        <div class="table-score">
          <!-- 头部 -->
          <div class="header">
            <div class="col1">{{ i18n_t('analysis_football_matches.rank') }}</div>
            <div class="col2">{{ i18n_t('analysis_football_matches.team') }}</div>
            <div class="col3">{{ i18n_t('analysis_football_matches.game') }}</div>
            <div class="col3">{{ i18n_t('analysis_football_matches.victory') }}</div>
            <div class="col3">{{ i18n_t('analysis_football_matches.negative') }}</div>
            <div class="col3">{{ i18n_t('analysis_football_matches.flat') }}</div>
            <div class="col4">{{ i18n_t('analysis_football_matches.gain_loss') }}</div>
            <div class="col4">{{ i18n_t('analysis_football_matches.net_win') }}</div>
            <div class="col5">{{ i18n_t('analysis_football_matches.integral') }}</div>
          </div>
          <!-- 主内容 -->
          <div class="group-item">
            <div class="team-item" v-for="(item, i) in liat_data" :key="i" :class="{ 'black-font':  i<3}">
              <div class="col1">
                <img v-if="i<3" class="img-Avatar" :src=" item.teamLogo ? get_server_file_path(item.teamLogo) : compute_img_url('league-avatar-dedault')"  @error="league_icon_error" alt="">
                <span v-else class="number" :class="`calculation_color${+i+ 1}`">{{ +i+ 1 }}</span>
              </div>
              <!-- 球队 -->
              <div class="col2 ellipsis">{{ item.teamCnName }}</div>
              <div class="col3">{{ item.matchCount }}</div>
              <div class="col3">{{ item.winTotal }}</div><!-- 胜 -->
              <div class="col3">{{ item.lossTotal }}</div>
              <div class="col3">{{ item.drawTotal }}</div>
              <div class="col4">{{ item.goalsForTotal }}/{{ item.goalsAgainstTotal }}</div><!-- 进/失 -->
              <div class="col4">{{ item.goalAll }}</div>
              <div class="col5">{{ item.rankingValue }}</div><!-- 积分 -->
            </div>
          </div>
        </div>
      </div>
    </template>

    <no_data class="no-list" v-if="!_.get(liat_data, 'length', 0)" which='noMatch' height='400'></no_data>
  </div>
</template>

<script setup>
import no_data from "src/base-h5/components/common/no-data.vue";    // 无网络展示组件
import { useMittEmit, useMittOn, MITT_TYPES,compute_img_url } from "src/output/index.js"
import { ref} from 'vue';


const props = defineProps({
    allianc_list_index: {
      type: Number | String,
      default: 0
    },
    allianc_list: {
      type: Array,
      default: () => []
    },
    liat_data: {
      type: Number | String | Array | Object,
      default: null,
      require: true
    },
    public_form_title:{
      type: Number | String | Array | Object,
      default: null,
      require: true
    },
    // 篮球     球队榜7 (西部联盟8     东部联盟9)   得分榜1       篮球助攻榜6      篮板榜3
    // 足球     积分榜4      足球助攻榜2      射手榜5
    /**
     *@description tab_name_index
     * 1代表的是 篮球的球队 东部及西部 联盟
     * 2 代表的是 得分 助攻  篮板
     * 3 代表的是足球的积分榜
     */
    tab_name_index: {
      type: Number | String,
      default: null,
      require: true
    }
})

let default_index = ref(0)
let default_url =  ("image/bw3/png/home_page/Avatar.png") //默认图片地址
// 无联赛logo图标黑色版
let none_league_icon_black =  ("image/bw3/png/home_page/Avatar_black.png")



 // 东西部联盟切换
 const alliancTab = (tab, index) => {
      $emit('allianc-tab', {tab, index})
  }
    /**
     * @description: 联赛联赛图标出错
     * @param {Object} $event 错误事件对象
     */
    const league_icon_error = ($event) => {
      
        $event.target.src=compute_img_url('league-avatar-dedault');
     
      $event.target.onerror = null
    }


</script>

<style lang="scss" scoped>
.hot_public_form {
  padding-bottom: 0.1rem;

  .table-score-wrapper {
    padding: 0 0.069rem;

    .table-score {
      position: relative;
      border-radius: 0.04rem;
      overflow: hidden;

      &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid var(--q-gb-bd-c-3) !important;
        border-radius: 0.08rem;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }
    }

		/*  头部 */
    .header {
      height: 0.32rem;
      display: flex;
      text-align: center;
      line-height: 0.32rem;

      > div {
        font-size: 0.1rem;
      }
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        border-bottom: 1px solid var(--q-gb-bd-c-3);
        width: 100%;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
    }

    .team-item {
      display: flex;
      align-items: center;
      font-size: 0.13rem;
      height: 0.48rem;
      text-align: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        border-bottom: 1px solid var(--q-gb-bd-c-3);
        width: 100%;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }

      &.font-bold {
        font-weight: bold;
      }

      &.black-font {
        font-weight: bold;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.12rem;
      }

      .col1 {
        font-size: 0.12rem;
        text-align: right;
      }

      .col2 {
        justify-content: inherit;
      }
    }

    .col1 {
      width: 0.45rem;

      .number {
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 50%;
        font-size: 0.12rem;
        letter-spacing: 0;
        text-align: center;
        line-height: 0.22rem;
      }

      .img-Avatar {

        height: 0.2rem;
      }
    }

    .col2 {
      flex: 2;
      text-align: left;
      display: unset !important;
    }

    .col3 {
      width: 0.28rem;
    }

    .alliance—col3 {
      flex: 1;
    }

    .rebounds—col3 {
      flex: 1;
      text-align: left;
      justify-content: start !important;
    }

    .col4 {
      width: 0.32rem;
    }

    .col5 {
      flex: 1;
    }

    .col6 {
      flex: 1;
      height: 100%;
      text-align: center;
    }

    .tab-league-wrapper {
      .tab {
        height: 0.34rem;
        box-shadow: unset;
        position: relative;

        span {
          flex: 1;
          position: relative;
          height: 100%;

          &.active {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>