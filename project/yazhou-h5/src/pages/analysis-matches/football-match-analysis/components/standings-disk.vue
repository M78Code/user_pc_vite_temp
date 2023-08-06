<!--
 * @Author:
 * @Date: 2021-05-15 21:00:29
 * @Description:
-->
<template>
  <div class="standings_technical football_standings recent_record" v-if="matchHistory_battle_dto_map">
    <div class="title">
      {{ $root.$t('analysis_football_matches.Turning_trend') }}
    </div>
    <div class="standings-technical-home" v-for="(main, index) in matchHistory_battle_dto_map" :key="index+'qi'">
      <!-- 主队客队的 图标 及 名称 -->
      <div class="technical-home team-recent">
        <template v-if="index == 1">
          <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
          <team-img :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[0]" :fr="get_detail_data.frmhn[0]" :size="22"></team-img>
          <team-img v-if="get_detail_data.mhlu.length > 1" :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[1]" :fr="get_detail_data.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ get_detail_data.mhn }}</span>
        </template>
        <template v-if="index == 2">
          <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
          <team-img :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[0]" :fr="get_detail_data.frman[0]" :size="22"></team-img>
          <team-img v-if="get_detail_data.malu.length > 1" :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[1]" :fr="get_detail_data.frman[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ get_detail_data.man }}</span>
        </template>
      </div>

      <div>
        <div class="table-score" v-if="_.get(main, 'matchHistoryBattleDetailDTOList')">
          <div class="header">
            <div class="item-1st">
              <!--<div class="col1"></div>-->
              <div class="col1 text-right pad-r5">{{ $root.$t('analysis_football_matches.game') }}</div>
            </div>
            <div class="item-2nd">
              <div class="col1">{{ $root.$t('analysis_football_matches.win_plate') }}</div>
              <div class="col1">{{ $root.$t('analysis_football_matches.Move_plate') }}</div>
              <div class="col1">{{ $root.$t('analysis_football_matches.Lose_plate') }}</div>
              <div class="col4">{{ $root.$t('analysis_football_matches.Win_rate') }}</div>
            </div>
            <div class="item-3rd">
              <div class="col1">{{ $root.$t('analysis_football_matches.big_ball') }}</div>
              <div class="col4">{{ $root.$t('analysis_football_matches.Big_ball_rate') }}</div>
              <div class="col1">{{ $root.$t('analysis_football_matches.small_ball') }}</div>
              <div class="col4">{{ $root.$t('analysis_football_matches.small_ball_rate') }}</div>
            </div>
          </div>
          <div class="group-item">
            <div class="team-item" v-for="(item,index) in main.matchHistoryBattleDetailDTOList" :key="index+'y'">
              <div class="item-1st">
                <div class="col1">{{item.postionFlag ==1 ? $root.$t('analysis_football_matches.total_all') : item.postionFlag ==2 ? $root.$t('analysis_football_matches.main') : item.postionFlag ==3 ? $root.$t('analysis_football_matches.customer') : ''}}</div>
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
      </div>
      <div class="recent-games" v-if="main && main.handicapResultList">
        <span class="item-1st text-center" style="white-space: nowrap;">{{ $root.$t('analysis_football_matches.field', [main.handicapResultList.length])}}</span>
        <div class="item-2nd">
          <span v-html="results" v-for="(results, i) in title_calculation(main, 'handicapResultList')" :key="i+'title'"></span>
        </div>
        <div class="item-3rd">
          <span v-html="results" v-for="(results, i) in title_calculation(main, 'overunderResultList')" :key="i+'title_'"></span>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(matchHistory_battle_dto_map).length <= 0" class="no-list">{{ $root.$t('common.no_data') }}</div>
  </div>
</template>

<script>
// TODO 后续修改调整
// import {mapGetters} from "vuex";
import { defineComponent, ref } from 'vue'
import team_img from "src/project/components/details/team_img";   // 详情页蓝色背景上的大型字母图标

export default defineComponent({
  name: "standings_disk",
  props: {
    // 盘面的数据
    matchHistory_battle_dto_map: {
      type: Object | Array
    }
  },
  components: {
    "team-img": team_img,
  },
  // TODO 后续修改调整
  // computed: {
  //   ...mapGetters(['get_goto_detail_matchid', 'get_detail_data'])
  // },
  setup(props, event) {
    // TODO 国际化后续修改调整
    // 赛事标题说明
    // handicapResultList 最近X 场输赢, 2平3输4赢
    // overunderResultList  最近X场大小, 2平3输4赢
    title_calculation = (main, name) => {
      let arr_list = []
      if(main && main.handicapResultList && name == 'handicapResultList') {
        main.handicapResultList.forEach( (item, i, arr) => {
          if(item == 2){
            arr_list.push(`<span style="color:#71C0F7;margin:0 .01rem">${$root.$t('analysis_football_matches.level')}</span>`)
          }
          if(item == 3){
            arr_list.push(`<span style="color:#8AD181;margin:0 .01rem">${$root.$t('analysis_football_matches.lose')}</span>`)
          }
          if(item == 4){
            arr_list.push(`<span style="color:#FF7979;;margin:0 .01rem">${$root.$t('analysis_football_matches.win')}</span>`)
          }
        })
        return arr_list
      }
      if(main && main.overunderResultList && name == 'overunderResultList') {
        main.overunderResultList.forEach( (item, i, arr) => {
          if(item == 2){
            arr_list.push(`<span style="color:#71C0F7;margin:0 .01rem">${$root.$t('analysis_football_matches.level')}</span>`)
          }
          if(item == 3){
            arr_list.push(`<span style="color:#8AD181;margin:0 .01rem">${$root.$t('analysis_football_matches.small')}</span>`)
          }
          if(item == 4){
            arr_list.push(`<span style="color:#FF7979;;margin:0 .01rem">${$root.$t('analysis_football_matches.big')}</span>`)
          }
        })
        return arr_list
      }
    }
    return {
      title_calculation,
    }
  },
  methods:{
    
    
  }
})
</script>

<style lang="scss" scoped>
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

.standings_technical {
  .standings-technical-home {
    .technical-home {
      height: 0.4rem;

      display: flex;
      align-items: center;
      padding-left: 0.1rem;

      ::v-deep .team-img {
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
        color: var(--q-color-fs-color-3);
        font-weight: bold;
        line-height: 0.12rem;
      }
    }

    .recent-games {
      height: 0.3rem;
      line-height: 0.3rem;
      display: flex;
      align-items: center;


      border-bottom: 1px solid var(--q-color-border-color-56);
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

  .table-score {
    position: relative;

    .header {
      height: 0.32rem;
      display: flex;
      text-align: center;
      line-height: 0.32rem;
      padding: 0 0.1rem;
    }

    .team-item {
      display: flex;
      align-items: center;
      padding: 0 0.1rem;
      font-size: 0.12rem;
      height: 0.48rem;
      text-align: center;
      border-bottom: 1px solid var(--q-color-border-color-56);

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.12rem;
      }
    }

    .col1 {
      flex: 1;

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
  }

  .item-2nd, .item-3rd {
    display: flex;
    flex: 0 0 44%;
    height: 100%;
  }

  .item-2nd {
    border-left: 1px solid var(--q-color-border-color-56);
    border-right: 1px solid var(--q-color-border-color-56);
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
}
</style>
