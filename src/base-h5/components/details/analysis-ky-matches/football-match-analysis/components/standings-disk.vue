<!--
 * @Author:
 * @Date: 2021-05-15 21:00:29
 * @Description: 盘面
-->
<template>
  <div class="standings_technical football_standings recent_record" v-if="matchHistory_battle_dto_map">
    <div class="title">
      {{ i18n_t('analysis_football_matches.Turning_trend') }}
    </div>
    <div class="standings-technical-home" v-for="(main, index) in matchHistory_battle_dto_map" :key="index+'qi'">
      <!-- 主队客队的 图标 及 名称 -->
      <div class="technical-home team-recent">
        <template v-if="index == 1">
          <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
          <team-img :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[0]" :fr="detail_data.frmhn[0]" :size="22"></team-img>
          <team-img v-if="detail_data.mhlu.length > 1" :type="0" :csid="detail_data.csid" :url="detail_data.mhlu[1]" :fr="detail_data.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ detail_data.mhn }}</span>
        </template>
        <template v-if="index == 2">
          <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
          <team-img :type="1" :csid="detail_data.csid" :url="detail_data.malu[0]" :fr="detail_data.frman[0]" :size="22"></team-img>
          <team-img v-if="detail_data.malu.length > 1" :type="1" :csid="detail_data.csid" :url="detail_data.malu[1]" :fr="detail_data.frman[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ detail_data.man }}</span>
        </template>
      </div>

        <div class="table-score" v-if="lodash.get(main, 'matchHistoryBattleDetailDTOList')">
          <div class="header">
            <div class="item-1st">
              <!--<div class="col1"></div>-->
              <div class="col1 text-right pad-r5">{{ i18n_t('analysis_football_matches.game') }}</div>
            </div>
            <div class="item-2nd">
              <div class="col1">{{ i18n_t('analysis_football_matches.win_plate') }}</div>
              <div class="col1">{{ i18n_t('analysis_football_matches.Move_plate') }}</div>
              <div class="col1">{{ i18n_t('analysis_football_matches.Lose_plate') }}</div>
              <div class="col4">{{ i18n_t('analysis_football_matches.Win_rate') }}</div>
            </div>
            <div class="item-3rd">
              <div class="col1">{{ i18n_t('analysis_football_matches.big_ball') }}</div>
              <div class="col4">{{ i18n_t('analysis_football_matches.Big_ball_rate') }}</div>
              <div class="col1">{{ i18n_t('analysis_football_matches.small_ball') }}</div>
              <div class="col4">{{ i18n_t('analysis_football_matches.small_ball_rate') }}</div>
            </div>
          </div>
          <div class="group-item">
            <div class="team-item" v-for="(item,index) in main.matchHistoryBattleDetailDTOList" :key="index+'y'">
              <div class="item-1st">
                <div class="col1">{{item.postionFlag ==1 ? i18n_t('analysis_football_matches.total_all') : item.postionFlag ==2 ? i18n_t('analysis_football_matches.main') : item.postionFlag ==3 ? i18n_t('analysis_football_matches.customer') : ''}}</div>
                <div class="col1">{{+item.handicapResultWin + +item.handicapResultEqual + +item.handicapResultLose}}</div>
              </div>
              <div class="item-2nd">
                <div class="col1">{{ item.handicapResultWin }}</div>
                <div class="col1">{{ item.handicapResultEqual }}</div>
                <div class="col1">{{ item.handicapResultLose }}</div>
                <div class="col4">{{ (item.handicapResultWinRate * 100).toFixed(2) +'%' }}</div>
              </div>
              <div class="item-3rd">
                <div class="col1">{{ item.overunderResultWin }}</div>
                <div class="col4">{{ (item.overunderResultWinRate * 100).toFixed(2) +'%' }}</div>
                <div class="col1">{{ item.overunderResultLose }}</div>
                <div class="col4">{{ (item.overunderResultLoseRate * 100).toFixed(2) +'%' }}</div>
              </div>
            </div>
          </div>
        </div>
      <div class="recent-games" v-if="main && main.handicapResultList">
        <span class="item-1st text-center" style="white-space: nowrap;">{{ i18n_tc('analysis_football_matches.field', [main.handicapResultList.length])}}</span>
        <div class="item-2nd">
          <span v-html="results" v-for="(results, i) in title_calculation(main, 'handicapResultList')" :key="i+'title'"></span>
        </div>
        <div class="item-3rd">
          <span v-html="results" v-for="(results, i) in title_calculation(main, 'overunderResultList')" :key="i+'title_'"></span>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(matchHistory_battle_dto_map).length <= 0" class="no-list">{{ i18n_t('common.no_data') }}</div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
// 详情页蓝色背景上的大型字母图标
import teamImg from "src/base-h5/components/details/team-img.vue";
import { i18n_t, i18n_tc } from "src/boot/i18n.js";
import lodash from "lodash"


  const props = defineProps({
    // 盘面的数据
    matchHistory_battle_dto_map: {
      type: Object
    },
    // 详情页的数据
    detail_data: {
      type: Object,
      default: () => {},
    }
  })
  // components: {
  //   "team-img": team_img,
  // },
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters(['get_goto_detail_matchid'])
  // },
    // TODO: 国际化后续修改调整
    // 赛事标题说明
    // handicapResultList 最近X 场输赢, 2平3输4赢
    // overunderResultList  最近X场大小, 2平3输4赢
    const title_calculation = (main, name) => {
      let arr_list = []
      if(main && main.handicapResultList && name == 'handicapResultList') {
        main.handicapResultList.forEach( (item, i, arr) => {
          if(item == 2){
            arr_list.push(`<span style="color:#71C0F7;margin:0 .01rem">${i18n_t('analysis_football_matches.level')}</span>`)
          }
          if(item == 3){
            arr_list.push(`<span style="color:#8AD181;margin:0 .01rem">${i18n_t('analysis_football_matches.lose')}</span>`)
          }
          if(item == 4){
            arr_list.push(`<span style="color:#FF7979;;margin:0 .01rem">${i18n_t('analysis_football_matches.win')}</span>`)
          }
        })
        return arr_list
      }
      if(main && main.overunderResultList && name == 'overunderResultList') {
        main.overunderResultList.forEach( (item, i, arr) => {
          if(item == 2){
            arr_list.push(`<span style="color:#71C0F7;margin:0 .01rem">${i18n_t('analysis_football_matches.level')}</span>`)
          }
          if(item == 3){
            arr_list.push(`<span style="color:#8AD181;margin:0 .01rem">${i18n_t('analysis_football_matches.small')}</span>`)
          }
          if(item == 4){
            arr_list.push(`<span style="color:#FF7979;;margin:0 .01rem">${i18n_t('analysis_football_matches.big')}</span>`)
          }
        })
        return arr_list
      }
    }

</script>

<style lang="scss" scoped>
.football_standings.recent_record {
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
          //color: var(--q-gb-t-c-4);
          color: var(--q-analysis-text-color-20);
          font-weight: bold;
          line-height: 0.12rem;
        }
      }
     .table-score {
      position: relative;

      .header {
        height: 0.32rem;
        display: flex;
        text-align: center;
        line-height: 0.32rem;
        padding: 0 0.1rem;  
        color:var(--q-analysis-text-color-14);
        border-top: 1px solid var(--q-gb-bd-c-4);
        border-bottom: 1px solid var(--q-gb-bd-c-4);
      }

      .team-item {
        display: flex;
        align-items: center;
        padding: 0 0.1rem;
        font-size: 0.12rem;
        height: 0.48rem;
        text-align: center;
        border-bottom: 1px solid var(--q-gb-bd-c-4); 
        color: var(--q-analysis-text-color-20);

        div {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.12rem;
        }
      }

      .col1 {
         flex: 1;
      }

      .col3 {
         width: 0.3rem;
      }

      .col4 {
        width: 0.4rem;
        white-space: nowrap;
      }

      .col5 {
        flex: 1;
      }
    }
      .recent-games {
        height: 0.3rem;
        line-height: 0.3rem;
        display: flex;
        align-items: center;


        border-bottom: 1px solid var(--q-gb-bd-c-4); 
        padding: 0 0.1rem;

        > span {
          font-size: 0.12rem;
        }

        > div {
          font-size: 0.12rem;

          &.margin-95 {
            margin-right: 0.95rem;
          }
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

    .item-1st {
      flex: 0 0 12%;
      height: 100%;
      color: var(--q-analysis-text-color-20);
    }

    .item-2nd, .item-3rd {
      display: flex;
      flex: 0 0 44%;
      height: 100%;
    }

    .item-2nd {
      border-left: 1px solid var(--q-gb-bd-c-4); 
      border-right: 1px solid var(--q-gb-bd-c-4); 
      padding: 0 0.05rem;
    }

    .recent-games {
      .item-2nd, .item-3rd {
        > span {
          flex: 1;
          text-align: center;
        }
      }

      .item-3rd {
        padding-left: 0.05rem;
      }
    }

    .pad-r5 {
      padding-right: 0.05rem;
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
