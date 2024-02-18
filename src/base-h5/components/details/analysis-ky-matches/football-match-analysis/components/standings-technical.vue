<template>
  <div class="standings_technical football_standings recent_record">
    <!-- TODO: 此代码待确认 -->
    <!-- <template v-if="false">
      <div class="title">
        {{ i18n_t('analysis_football_matches.Turning_trend') }}
      </div>
      <div class="standings-technical-home" v-for="(item, index) in 2" :key="index+'title'">
        <div class="technical-home">
          <team-img :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[0]" :fr="detail_data.frmhn[0]" :size="22"></team-img>
          <team-img v-if="detail_data.mhlu.length > 1" :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[1]" :fr="detail_data.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ detail_data.mhn }}</span>
        </div>
        <div>
          <div class="table-score">
            <div class="standings_technical_header">
              <div class="col1 flex_start"></div>
              <div class="col2">0-15’</div>
              <div class="col1">15-30’</div>
              <div class="col1">30-45’</div>
              <div class="col1">45-60’</div>
              <div class="col1">60-75’</div>
              <div class="col1">75-90’</div>
            </div>
            <div class="group-item">
              <div class="team-item" v-for="(item,index) in 3" :key="index+'score'">
                <div class="col1 flex_start">{{ i18n_t('analysis_football_matches.total_all') }}</div>
                <div class="col2 ellipsis">24</div>
                <div class="col1">29</div>
                <div class="col1">21</div>
                <div class="col1">3</div>
                <div class="col1">5</div>
                <div class="col1">61/21</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template> -->
    <div class="title">
      {{ i18n_t('analysis_football_matches.Coach_data') }}
    </div>
    <div class="standings-technical-home" v-for="(item, index) in homeAwayGoal_and_coach_map" :key="index+'h'">
      <!-- 主队客队的 图标 及 名称 -->
      <div class="technical-home team-recent">
        <template v-if="index == 1">
          <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
          <team-img :type="0"  :csid="detail_data.csid" :url="detail_data.mhlu[0]" :fr="detail_data.frmhn[0]" :size="22"></team-img>
          <team-img v-if="detail_data.mhlu.length > 1" :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[1]" :fr="detail_data.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
        </template>
        <template v-if="index == 2">
          <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
          <team-img :type="1" :csid="detail_data.csid" :url="detail_data.malu[0]" :fr="detail_data.frman[0]" :size="22"></team-img>
          <team-img v-if="detail_data.malu.length > 1" :type="1" :csid="detail_data.csid" :url="detail_data.malu[1]" :fr="detail_data.frman[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
        </template>
        <span class="team-name">{{ item && item[0] && item[0].coachName }}</span>
      </div>

      <!-- item有数据再走下面逻辑 -->
      <div v-if="item&&item.length>0">
        <div class="table-score" >
          <div class="standings_technical_header">
            <div class="col1 flex_start">{{ i18n_t('analysis_football_matches.age') }}</div>
            <div class="col1">{{ i18n_t('analysis_football_matches.Tactical_division') }}</div>
            <div class="col1">{{ i18n_t('analysis_football_matches.Points_per_game') }}</div>
            <div class="col-go-war">{{ i18n_t('analysis_football_matches.Go_to_war') }}</div>
          </div>
          <div class="group-item">
            <div class="team-item" v-for="(content,index) in item" :key="index+'team'">
              <div class="col1 flex_start">{{ calculate_age(content.coachBirthdate) || '-' }}</div>
              <div class="col1">{{ content.coachStyle|| '-' }}</div>
              <div class="col1">{{ content.score|| '-' }}</div>
              <div class="col-go-war" v-if="content.coachGameCount">{{ content.coachGameCount }} (胜{{content.winCount}}平{{content.drawCount}}负{{content.loseCount}})</div>
              <div class="col-go-war" v-else> {{ i18n_t('common.no_data') }} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(homeAwayGoal_and_coach_map).length <= 0" class="no-list">{{ i18n_t('common.no_data') }}</div>
  </div>
</template>

<script setup>
// import {mapGetters} from "vuex";
// 详情页蓝色背景上的大型字母图标
import teamImg from "src/base-h5/components/details/team-img.vue";
import { i18n_t } from "src/boot/i18n.js";;
//国际化

  const props = defineProps({
    homeAwayGoal_and_coach_map: {
      type: Object,
    },
    detail_data: {
      type: Object,
      default: () => {}
    }
  })
  // components: {
  //   "team-img": team_img,
  // },
  const calculate_age = (day) => {
      let birthday = new Date(day.replace(/-/g, "\/"));
      let d=new Date();
      let age = d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()|| d.getMonth()==birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
      return age
    }


  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters(['get_goto_detail_matchid', ])
  // },
  // methods:{

  // }
</script>

<style lang="scss" scoped>
.standings_technical.football_standings {
  background-color: var(--q-gb-bg-c-23);
    .title {
    height: 0.4rem;
    line-height: 0.45rem;
    padding-left: 0.24rem;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: bold;
    position: relative;
    color: var(--q-analysis-text-color-20);
    border-bottom: 1px solid var(--q-analysis-bd-color-3);
    background-color: var(--q-gb-bg-c-23);

    &:before {
      content: '';
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.15rem;
      border-radius: 1.5px;
      background: var(--q-gb-bg-c-13);
    }
  }

    .standings-technical-home {
      .technical-home {
        height: 0.4rem;
        background-color: var(--q-gb-bg-c-15)!important;
        display: flex;
        align-items: center;
        padding-left: 0.1rem;

        :deep(.team-img) {
          width: 0.2rem;
          height: 0.2rem;
          margin: 0.05rem;

          img {
            width: 0.2rem;
            height: 0.2rem;
            position: relative;
            border-radius: 50%;
          }
        }

        .team-name {
          font-size: 0.12rem;
          color: var(--q-gb-t-c-4);
          font-weight: bold;
          line-height: 0.12rem;
        }
      }
    }

    .table-score {
      position: relative;
      background-color: var(--q-gb-bg-c-15);
      .standings_technical_header {
        height: 0.32rem;
        display: flex;
        text-align: center;
        line-height: 0.32rem;
        padding: 0 0.1rem;
        background-color: var(--q-gb-bg-c-15);
        color: var(--q-analysis-text-color-32);
        border-bottom: 1px solid var(--q-analysis-bd-color-3);
        border-top: 1px solid var(--q-analysis-bd-color-3);
      }

      .team-item {
        display: flex;
        align-items: center;
        padding: 0 0.1rem;
        font-size: 0.12rem;
        height: 0.48rem;
        text-align: center;

        div {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.12rem;
          color: var(--q-analysis-text-color-20)!important;
        }
      }

      .col1 {
        flex: 1;
        justify-content: center !important;

        &.flex_start {
          flex: unset;
          width: 0.35rem;
        }
      }

      .col2 {
        flex: 1;
      }

      .col3 {
        width: 0.4rem;
      }

      .col4 {
        width: 0.4rem;
      }

      .col5 {
        flex: 1;
      }

      .col-go-war {
        flex: 1.3;
      }
    }

    .no-list {
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      padding-top: 0.05rem !important;


      font-size: 12px;
    }
  .no-list {
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    padding-top: 0.05rem !important;
    font-size: 12px;
    background-color: var(--q-gb-bg-c-23);
    color: var(--q-analysis-text-color-14);
  }
}

</style>
