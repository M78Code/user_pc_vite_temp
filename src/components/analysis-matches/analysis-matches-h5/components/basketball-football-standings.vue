<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页 或者 赛果  篮球足球公共组件，杯赛 联赛表格
-->
<template>
  <div class="football_standings" :class="{'football_standings-empty': no_data}">
    <div class="title" v-if="ranking_data.length>0">
      <!-- 联赛类别(0:其他,1联赛,2杯赛) -->
      {{ranking_data[0].tournamentType == 1 ? i18n.t('analysis_football_matches.league_points') : i18n.t('analysis_football_matches.cup_points') }}
    </div>
    <div class="title" v-if="ranking_data.length <= 0">{{i18n.t('analysis_football_matches.league_points') }}</div>
    <!-- 杯赛积分 联赛积分  二选一 -->
    <div class="table-score" v-if="ranking_data.length>0"
    :class="{'backball-table': get_detail_data.csid == 2}">
      <!-- 头部 -->
      <div class="header">
        <div class="col1">{{i18n.t('analysis_football_matches.rank') }}</div>
        <div class="col2">{{i18n.t('analysis_football_matches.team') }}</div>
        <div class="league tournamentName" v-if="ranking_data.length>0 && (ranking_data ? ranking_data[0].tournamentName : false) && get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.league') }}</div>
        <div class="col3" v-show="get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.game') }}</div>
        <div class="col3">{{i18n.t('analysis_football_matches.victory') }}</div>
        <div class="col3">{{i18n.t('analysis_football_matches.negative') }}</div>
        <div class="col3" v-show="get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.flat') }}</div>
        <div class="col4" v-show="get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.gain_loss') }}</div>
        <div class="col4" v-show="get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.net_win') }}</div>
        <div class="col5" v-show="get_detail_data.csid == 1">{{i18n.t('analysis_football_matches.integral') }}</div>
        <div class="col5" v-show="get_detail_data.csid == 2">{{i18n.t('home_popular.win_rate') }}</div>
      </div>
      <!-- 主内容 -->
      <div class="group-item">
        <div class="team-item" v-for="(item, i) in ranking_data" :key="i" v-show="item.isBoolean">
          <div class="col1">
            <span class="number" :class="`calculation_color${item.positionTotal}`">{{ item.positionTotal }}</span>
          </div>
          <!-- 球队 -->
          <div class="col2 ellipsis" :class="{col2_home: item.teamFlag == 't1', col2_away: item.teamFlag == 't2' }">{{ item.teamName }}</div>
          <!-- 联赛 -->
          <div class="league tournamentName" v-if="item.tournamentName  && get_detail_data.csid == 1">{{ item.tournamentName }}</div>
          <div class="col3" v-show="get_detail_data.csid == 1">{{ item.matchCount }}</div>
          <div class="col3">{{ item.winTotal }}</div><!-- 胜 -->
          <div class="col3">{{ item.lossTotal }}</div>
          <div class="col3" v-show="get_detail_data.csid == 1">{{ item.drawTotal }}</div>
          <!-- 进/失 -->
          <div class="col4" v-show="get_detail_data.csid == 1">{{ item.goalsForTotal }}/{{ item.goalsAgainstTotal }}</div>
          <div class="col4" v-show="get_detail_data.csid == 1">{{ item.goalDiffTotal }}</div>
          <!-- 积分 -->
          <div class="col5" v-show="get_detail_data.csid == 1">{{ item.pointsTotal }}</div>
          <div class="col5" v-show="get_detail_data.csid == 2">{{percentage(item)}}</div>
        </div>
      </div>
      <!-- 大于2条时,显示 展开收起按钮-->
      <span class="btn_style" @click="toggle_box" v-if="show_btn">
        <span class="text_c">{{ btn_text }}</span>
        <img src="image/wwwassets/bw3/list/league-collapse-icon.svg" alt="" :class="direction">
      </span>
    </div>
    <!-- 没有数据 组件 -->
     <div v-if="no_data" class="no-list">{{ i18n.t('common.no_data') }}</div>
  </div>
</template>

<script setup>
import {api_analysis} from "src/project/api";
import { computed, onUnmounted } from "vue";
import loadsh from 'lodash'
import { useRoute } from 'vue-router'

// TODO: 后续修改调整
// import {mapGetters} from "vuex";

  const ranking_data = ref([])
  //按钮名字
  const btn_text =ref('')
  //按钮图标的方向
  const direction =ref('')
  //是否展开
  const box_bool =ref('')
  const no_data =ref(false)
  // 路由
  const route = useRoute()

  get_list()
  
  const show_btn = computed(() => {
    // 是否展示按钮
    return ranking_data.length > 1
  })
  const match_id = computed( () => {
    // 赛事id
    return route.params.mid || get_detail_data.mid
  })
  // computed: {
    // TODO: 后续修改调整
  //   ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
  // },
  const percentage = (item) => {
    return ((item.winTotal / item.matchCount) * 100).toFixed(1) +'%'
  }
  const get_list = async (flag) => {
    try {
      let parameter = {
        mid: match_id, //2282708 1925928
        flag: flag == 0 ? 0 : ''
      }
      let {code, data} = await api_analysis.get_vs_info(parameter)
      if (code == 200 && data.length > 0) {
        ranking_data = data
        no_data = false
        if(flag != 0){
          rules_normal();
          rules_a();
          rules_b();
          rules_c()
        }else{
          box_bool = !box_bool;
          if (box_bool == true) {
            // TODO: 国际化后续修改调整
            [btn_text, direction] = [i18n.t("bet_record.pack_down"), "down"];
            toggle_rule_b();
          } else {
            [btn_text, direction] = [i18n.t("bet_record.pack_up"), ""];
            toggle_rule_a();
          }
        }
      } else {
        no_data = true
      }
    } catch (error) {
      no_data = true
      console.error(error);
    }
  }
  //切换是否展开
  const toggle_box = () => {
    if(direction === ''){
      get_list()
    }else{
      get_list(0)
    }
  }
  const rules_normal = () => {
    [btn_text, direction, box_bool] = [
      // TODO: 后续修改调整
      i18n.t("bet_record.pack_up"),
      "",
      false
    ];
  }
  //表格数据长度大于等于2,默认收起,展示一条;
  const rules_a = () => {
    if (ranking_data.length >= 2)
      [btn_text, direction, box_bool] = [
        // TODO: 后续修改调整
        i18n.t("bet_record.pack_down"),
        "down",
        true
      ];
  }

  const rules_b = () => {
    if (ranking_data.length < 2) toggle_rule_a();
  }
  const rules_c = () => {
    if (ranking_data.length >= 2) toggle_rule_b();
  }
  //小于2个时都展开
  const toggle_rule_a = () => {
    loadsh.map(ranking_data, (item, index) => {
      item.isBoolean = true;
      return item;
    });
  }
  //大于等于2个时，第一个和第二个展开
  const toggle_rule_b = () => {
    loadsh.map(ranking_data, (item, index) => {
      item.isBoolean = false;
      if (index == 0 || index == 1) {
        item.isBoolean = true;
      }
      return item;
    });
  }
  onUnmounted(() => {})
  // beforeUnmount() {
  //   for (const key in $data) {
  //     $data[key] = null
  //   }
  // }
</script>

<style lang="scss" scoped>
.football_standings {

  margin-bottom: 0.25rem;

  &.football_standings-empty {
    margin-bottom: 0;
  }

  .title {
    height: 0.4rem;
    line-height: 0.45rem;
    padding-left: 0.24rem;

    font-size: 0.14rem;

    letter-spacing: 0;

    font-weight: bold;
    position: relative;

    &:before {
      content: '';
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.15rem;

      border-radius: 1.5px;
    }
  }

  .table-score {
    position: relative;
    // 头部
    &.backball-table {
      .header {

      }

      .group-item {

      }

      .col2 {
        width: 1.7rem;
      }

      .col3 {
        flex: 1;
      }
    }

    .header {
      height: 0.32rem;
      display: flex;
      text-align: center;
      line-height: 0.32rem;
      padding: 0 0.1rem;

      > div {

        font-size: 0.1rem;
      }
    }

    .group-item {
      .team-item {
        border-bottom: 1px solid var(--q-color-border-color-56);

        &:last-child {
          border-bottom: 0;
        }
      }
    }

    .team-item {
      display: flex;
      align-items: center;
      padding: 0 0.1rem;
      font-size: 0.13rem;
      height: 0.48rem;
      text-align: center;

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
      width: 0.4rem;

      .number {
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 50%;
        font-size: 0.12rem;
        letter-spacing: 0;
        text-align: center;
        line-height: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.calculation_color1 {
          background: var(--q-color-com-fs-color-23);
          color: var(--q-color-com-fs-color-8) !important;
        }

        &.calculation_color2 {
          background: var(--q-color-com-bg-color-30);
          color: var(--q-color-com-fs-color-8) !important;
        }

        &.calculation_color3 {
          background: var(--q-color-com-bg-color-23);
          color: var(--q-color-com-fs-color-8) !important;
        }
      }
    }

    .col2 {
      width: 0.7rem;
      text-align: left;
      display: unset !important;

      &.col2_home {

        font-weight: bold;
      }

      &.col2_away {

        font-weight: bold;
      }
    }

    // 避免flex 没有显示省略号
    // 3~8 总宽度220px

    .col3 {
      width: 0.28rem;
    }

    .league {
      width: 0.42rem;

      &.tournamentName {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }

    .col4 {
      width: 0.32rem;
      white-space: nowrap;
    }

    .col5 {
      flex: 1;
    }

    .col6 {
      flex: 1;
      height: 100%;
      text-align: center;
    }

    .btn_style {
      position: absolute;
      bottom: -0.18rem;
      left: 50%;
      transform: translateX(-50%);
      height: 0.18rem;
      line-height: 0.18rem;
      font-size: 0.1rem;
      padding: 0 0.08rem;


      box-shadow: var(--q-color-com-box-shadow-2);
      border-radius: 0.04rem;
      border-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      img {
        width: 0.06rem;
        margin-left: 2px;
        vertical-align: middle;
      }

      .down {
        transform: scale(-1);
      }
    }

    .down {
      transform: scale(-1);

      .text_c {

      }
    }
  }

  .no-list {
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    padding-top: 0.05rem !important;


    font-size: 12px;
  }
}
</style>
