<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页 或者 赛果  篮球足球公共组件，杯赛 联赛表格
-->
<template>
  <div class="football_standings" :class="{'football_standings-empty': no_data}">
    <div class="title" v-if="ranking_data.length>0">
      <!-- 联赛类别(0:其他,1联赛,2杯赛) -->
      {{ranking_data[0].tournamentType == 1 ? $root.$t('analysis_football_matches.league_points') : $root.$t('analysis_football_matches.cup_points') }}
    </div>
    <div class="title" v-if="ranking_data.length <= 0">{{$root.$t('analysis_football_matches.league_points') }}</div>
    <!-- 杯赛积分 联赛积分  二选一 -->
    <div class="table-score" v-if="ranking_data.length>0"
    :class="{'backball-table': get_detail_data.csid == 2}">
      <!-- 头部 -->
      <div class="header">
        <div class="col1">{{$root.$t('analysis_football_matches.rank') }}</div>
        <div class="col2">{{$root.$t('analysis_football_matches.team') }}</div>
        <div class="league tournamentName" v-if="ranking_data.length>0 && (ranking_data ? ranking_data[0].tournamentName : false) && get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.league') }}</div>
        <div class="col3" v-show="get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.game') }}</div>
        <div class="col3">{{$root.$t('analysis_football_matches.victory') }}</div>
        <div class="col3">{{$root.$t('analysis_football_matches.negative') }}</div>
        <div class="col3" v-show="get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.flat') }}</div>
        <div class="col4" v-show="get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.gain_loss') }}</div>
        <div class="col4" v-show="get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.net_win') }}</div>
        <div class="col5" v-show="get_detail_data.csid == 1">{{$root.$t('analysis_football_matches.integral') }}</div>
        <div class="col5" v-show="get_detail_data.csid == 2">{{$root.$t('home_popular.win_rate') }}</div>
      </div>
      <!-- 主内容 -->
      <div class="group-item">
        <div class="team-item" v-for="(item, i) in ranking_data" :key="i" v-show="item.isBoolean">
          <div class="col1">
            <span class="number" :class="`calculation_color${item.positionTotal}`">{{ item.positionTotal }}</span>
          </div>
          <!-- 球队 -->
          <div class="col2 ellipsis" :class="{col2_home: item.teamFlag == 't1', col2_away: item.teamFlag == 't2' }">{{ item.teamName }}</div>
          <div class="league tournamentName" v-if="item.tournamentName  && get_detail_data.csid == 1">{{ item.tournamentName }}</div><!-- 联赛 -->
          <div class="col3" v-show="get_detail_data.csid == 1">{{ item.matchCount }}</div>
          <div class="col3">{{ item.winTotal }}</div><!-- 胜 -->
          <div class="col3">{{ item.lossTotal }}</div>
          <div class="col3" v-show="get_detail_data.csid == 1">{{ item.drawTotal }}</div>
          <div class="col4" v-show="get_detail_data.csid == 1">{{ item.goalsForTotal }}/{{ item.goalsAgainstTotal }}</div><!-- 进/失 -->
          <div class="col4" v-show="get_detail_data.csid == 1">{{ item.goalDiffTotal }}</div>
          <div class="col5" v-show="get_detail_data.csid == 1">{{ item.pointsTotal }}</div><!-- 积分 -->
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
     <div v-if="no_data" class="no-list">{{ $root.$t('common.no_data') }}</div>
  </div>
</template>

<script>
import {api_result} from "src/project/api";
import {mapGetters} from "vuex";

export default {
  name: "",
  components: {
  },
  data() {
    return {
      ranking_data: [],
      btn_text: "",   //按钮名字
      direction: "",  //按钮图标的方向
      box_bool: "",  //是否展开
      no_data: false
    }
  },
  created() {
    this.get_list()
  },
  mounted() {
  },
  watch: {},
  computed: {
    ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
    // 是否展示按钮
    show_btn() {
      return this.ranking_data.length > 1
    },
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  methods: {
    percentage(item) {
      return ((item.winTotal / item.matchCount) * 100).toFixed(1) +'%'
    },
    async get_list(flag) {
      try {
        let parameter = {
          mid: this.match_id, //2282708 1925928
          flag: flag == 0 ? 0 : ''
        }
        let {code, data} = await api_result.get_vs_info(parameter)
        if (code == 200 && data.length > 0) {
          this.ranking_data = data
          this.no_data = false
          if(flag != 0){
            this.rules_normal();
            this.rules_a();
            this.rules_b();
            this.rules_c()
          }else{
            this.box_bool = !this.box_bool;
            if (this.box_bool == true) {
              [this.btn_text, this.direction] = [this.$root.$t("bet_record.pack_down"), "down"];
              this.toggle_rule_b();
            } else {
              [this.btn_text, this.direction] = [this.$root.$t("bet_record.pack_up"), ""];
              this.toggle_rule_a();
            }
          }
        } else {
          this.no_data = true
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
    //切换是否展开
    toggle_box() {
      if(this.direction === ''){
        this.get_list()
      }else{
        this.get_list(0)
      }
    },
    rules_normal() {
      [this.btn_text, this.direction, this.box_bool] = [
        this.$root.$t("bet_record.pack_up"),
        "",
        false
      ];
    },
    //表格数据长度大于等于2,默认收起,展示一条;
    rules_a() {
      if (this.ranking_data.length >= 2)
        [this.btn_text, this.direction, this.box_bool] = [
          this.$root.$t("bet_record.pack_down"),
          "down",
          true
        ];
    },

    rules_b() {
      if (this.ranking_data.length < 2) this.toggle_rule_a();
    },
    rules_c() {
      if (this.ranking_data.length >= 2) this.toggle_rule_b();
    },
    //小于2个时都展开
    toggle_rule_a() {
      _.map(this.ranking_data, (item, index) => {
        item.isBoolean = true;
        return item;
      });
    },
    //大于等于2个时，第一个和第二个展开
    toggle_rule_b() {
      _.map(this.ranking_data, (item, index) => {
        item.isBoolean = false;
        if (index == 0 || index == 1) {
          item.isBoolean = true;
        }
        return item;
      });
    }
  },
  destroyed() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
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
