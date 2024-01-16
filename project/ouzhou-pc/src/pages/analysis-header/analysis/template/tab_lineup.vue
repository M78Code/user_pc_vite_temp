<!--
 * @Author: Yellow
 * @Description: 足篮赛事分析---阵容
-->
<template>
  <div class="q-pb-md">
    <div class="tab" v-if="$route.name !== 'analysis_header'">
      <!-- 主队 -->
      <span :class="{'active':tabIndex==1}" @click="tabClick(1)">{{match.mhn}}</span>
      <!-- 客队 -->
      <span :class="{'active':tabIndex==2}" @click="tabClick(2)">{{match.man}}</span>
    </div>
    <div class="lineup-bg  relative-position">
      <div class="panel" >
        <!-- 主队/客队 -->
        <div v-if="$route.name !== 'analysis_header'" class="panel-title">{{tabIndex==1 ? match.mhn : match.man}}</div>
      
        <img :src="`${$g_image_preffix}/image/yabo/png/analysis-lineup-${match.csid}.png`" alt="" class="lineup-img" />
      </div>
      <div class="lineup-bg-wrap" :class="{'basketball': match.csid=='2'}">
        <!-- 主队 -->
        <div class="home" v-if="($route.name === 'analysis_header') || ($route.name !== 'analysis_header' && tabIndex == 1)" :class="`lineup-${lodash.get(lineupData, 'home.homeFormation')}`">
          <div class="lineup-item">
            <div class="lineup-col" v-for="(item,index) in first_home_lineup" :key="index">
              <div class="player" v-for="(list,i) in item" :key="i">
                <div class="player-num" :class="$route.name === 'analysis_header' ? 'player-num-width36' : 'player-num-width18'">{{list.shirtNumber}}</div>
                <span>{{list.thirdPlayerName}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 客队 -->
        <div class="away" v-if="($route.name === 'analysis_header') || ($route.name !== 'analysis_header' && tabIndex == 2)" :class="`lineup-${lodash.get(lineupData, 'away.awayFormation')}`">
          <div class="lineup-item">
            <div class="lineup-col" v-for="(item,index) in first_away_lineup" :key="index">
              <div class="player" v-for="(list,i) in item" :key="i">
                <div class="player-num" :class="$route.name === 'analysis_header' ? 'player-num-width36' : 'player-num-width18'">{{list.shirtNumber}}</div>
                <span>{{list.thirdPlayerName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lineup-wrap">
      <!-- 主队 S -->
      <div class="lineup-item home" v-if="($route.name === 'analysis_header') || ($route.name !== 'analysis_header' && tabIndex == 1)">
        <div class="panel">
          <!-- 首发阵容 -->
          <div class="panel-title">{{i18n_t('analysis.starting_lineup')}} {{match.csid=='1'?lodash.get(lineupData, 'home.homeFormation'):''}}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{i18n_t('analysis.position')}}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{i18n_t('analysis.name')}}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{i18n_t('analysis.number')}}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item,index) in lodash.get(lineupData,'home.up')" :key="index">
              <div class="d-table-td" :class="{'multiple-pos': lodash.get(lineupData,'home.up').filter(item => item.positionName.length > 4).length}">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{item.positionName}}</span>
              </div>
              <div class="d-table-td">
                <span class='user-name'>{{item.thirdPlayerName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.shirtNumber}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <!-- 替补阵容 -->
          <div class="panel-title">{{i18n_t('analysis.bench_lineup')}} {{match.csid=='1'?lodash.get(lineupData, 'home.homeFormation'):''}}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{i18n_t('analysis.position')}}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{i18n_t('analysis.name')}}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{i18n_t('analysis.number')}}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item,index) in lodash.get(lineupData,'home.down')" :key="index">
              <div class="d-table-td" :class="{'multiple-pos': lodash.get(lineupData,'home.down').filter(item => item.positionName.length > 4).length}">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{item.positionName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.thirdPlayerName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.shirtNumber}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主队 E -->

      <!-- 客队 S -->
      <div class="lineup-item away" v-if="($route.name === 'analysis_header') || ($route.name !== 'analysis_header' && tabIndex == 2)">
        <div class="panel">
          <!-- 首发阵容 -->
          <div class="panel-title">{{i18n_t('analysis.starting_lineup')}} {{match.csid=='1'?lodash.get(lineupData,'away.awayFormation'):''}}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{i18n_t('analysis.position')}}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{i18n_t('analysis.name')}}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{i18n_t('analysis.number')}}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item,index) in lodash.get(lineupData,'away.up')" :key="index">
              <div class="d-table-td" :class="{'multiple-pos': lodash.get(lineupData,'away.up').filter(item => item.positionName.length > 4).length}">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{item.positionName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.thirdPlayerName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.shirtNumber}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <!-- 替补阵容 -->
          <div class="panel-title">{{i18n_t('analysis.bench_lineup')}} {{match.csid=='1'?lodash.get(lineupData,'away.awayFormation'):''}}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{i18n_t('analysis.position')}}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{i18n_t('analysis.name')}}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{i18n_t('analysis.number')}}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item,index) in lodash.get(lineupData,'away.down')" :key="index">
              <div class="d-table-td" :class="{'multiple-pos': lodash.get(lineupData,'away.down').filter(item => item.positionName.length > 4).length}">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{item.positionName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.thirdPlayerName}}</span>
              </div>
              <div class="d-table-td">
                <span>{{item.shirtNumber}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 客队 E -->
    </div>
  </div>
</template>

<script>
import { api_analysis } from 'src/api/index'
import analysisData  from 'src/public/mixins/analysis/analysis'
export default {
  data() {
    return {
      tabIndex:1,
      params:{}, // 接口请求参数
      lineupData: {},
      first_home_lineup: [],//主队首发阵容
      first_away_lineup: [],//客队首发阵容
    };
  },
  mixins: [analysisData],
  created() {
    this.get_lineup()
  },
  methods: {
    tabClick(index){
      this.tabIndex = index
      this.params.sonMenuId = index
      // this.get_data()
    },
    /**
    * @description: 阵容数据
    */
    get_lineup(){
      api_analysis.get_lineupList({matchInfoId: this.match.mid}).then(({data}) =>{
        if(data.code == 200){
          let lineupData = data.data
          let lineup_formation = {
            home: lodash.get(data, 'data.home.homeFormation'),
            away: lodash.get(data, 'data.away.awayFormation'),
          }
          if(this.match.csid == '2'){
            lineup_formation.home = '2-2'
            lineup_formation.away = '2-2'
          }

          let home_up = lodash.get(data, 'data.home.up', [])
          let away_up = lodash.get(data, 'data.away.up', [])
          // 过滤掉教练位置
          home_up = home_up.filter(item => !item.positionEnName.toLowerCase().includes('coach'))
          away_up = away_up.filter(item => !item.positionEnName.toLowerCase().includes('coach'))
          
          if (lodash.get(lineupData, 'home.up')) {
            lineupData.home.up = home_up
          }
          if (lodash.get(lineupData, 'away.up')) {
            lineupData.away.up = away_up
          }
          
          this.lineupData = lineupData

          this.first_home_lineup = this.get_first_lineup(home_up, lineup_formation.home, 'home')
          this.first_away_lineup = this.get_first_lineup(away_up, lineup_formation.away, 'away')
        }
      })
    },
    /**
    * @description: 格式化首发阵容
    */
    get_first_lineup(data,lineup, type){
      if(!data.length || !lineup) return []
      
      let linup_num = lineup.split("-")
      let arr = [[data[0]]]

      if(type == 'home'){
        let i = 1
        linup_num.map(item=>{
          item = parseInt(item)
          arr.push(data.slice(i, i+= item))
        })
      } else {
        let i = 0
        data.reverse()
        linup_num.reverse()
        arr = []
        linup_num.map(item=>{
          item = parseInt(item)
          arr.push(data.slice(i, i+= item))
        })
        arr.push([data[data.length-1]])
      }
      
      return arr
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  height: 34px;
  color: var(--qq--y0-text-color5);
  margin-bottom: 10px;
  border-radius: 0 0 8px 8px;
  border-left: 1px solid var(--qq--match-border-color5);
  border-right: 1px solid var(--qq--match-border-color5);
  background: var(--qq--match_details_analysis_title);
  span {
    // width: 150px;
    height: 28px;
    margin: 0 10px;
    line-height: 28px;
    cursor: pointer;
    text-align: center;
    font-weight: 600;
    // border: 1px solid var(--qq--analysis-bd-color-2);
    overflow: hidden;
    // &:first-child {
    //   border-radius: 8px 0 0 8px;
    //   border-right: 0 none;
    // }
    // &:last-child {
    //   border-radius: 0 8px 8px 0;
    //   border-left: 0 none;
    // }
    &.active {
      // background-image: var(--qq--analysis-bg-gradient-2);
      // color: var(--qq--analysis-text-color-13);
      color: var(--qq--theme-color-handicap-item-title);
      border-bottom: 2px solid var(--qq--theme-color-handicap-item-title);
    }
  }
}
/*  阵容图 */
.lineup-bg {
  // min-width: 950px;
  .lineup-img {
    width: 100%;
    // margin: 20px 0;
  }
  .lineup-bg-wrap {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: var(--qq--analysis-text-color-13);
    // padding: 20px 0;
    padding-top: 30px;
    .home,
    .away {
      flex: 1;
      width: 50%;
      .lineup-item {
        display: flex;
        height: 100%;
        .lineup-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .player {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .player-num {
              width: 18px;
              height: 18px;
              font-size: 12px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
              font-weight: bold;
              border: 1px solid #fff;
            }
            .player-num-width36 {
              width: 36px;
              height: 36px;
              font-size: 16px;
              border-radius: 18px;
            }
            .player-num-width18 {
              width: 18px;
              height: 18px;
              font-size: 12px;
              border-radius: 10px;
            }
          }
        }
      }
    }
    .home {
      .player-num {
        background: var(--qq--analysis-bg-color-12-1);
      }
    }
    .away {
      .player-num {
        background: var(--qq--analysis-bg-color-13-1);
      }
    }
    &.basketball {
      .home .lineup-col:last-child,
      .away .lineup-col:first-child {
        justify-content: center;
        .player {
          flex: unset;
          &:first-child {
            margin-bottom: 50px;
          }
        }
      }
    }
  }
}
/*  阵容数据 */
.lineup-wrap {
  display: flex;
  justify-content: space-between;
  // min-width: 950px;
  width: 100%;
  .lineup-item {
    flex: 1;
    min-width: 470px;
    &:first-child {
      margin-right: 10px;
    }
    .panel {
      &:first-child {
        margin-bottom: 10px;
      }
      .d-table {
        background: var(--qq--y0-bg-color12);
        // border: 1px solid var(--qq--match-border-color5);
        border-top: 0;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
        .d-table-h {
          display: flex;
          align-items: center;
          height: 28px;
          //background: var(--qq--y0-bg-color12);
          background: var(--qq--match_details_analysis_pannel_title);
          color: var(--qq--y0-text-color5);
          &:last-child {
            border-radius: 0 0 8px 8px;
          }
        }
        .d-tabel-tr {
          display: flex;
          align-items: center;
          height: 40px;
          border-bottom: 1px solid var(--qq--match-border-color5);
          &:last-child {
            border-bottom: transparent;
          }
          .d-table-td
          {
            &:first-child {
              position: relative;
            &::after{
              position: absolute;
              content: '';
              right: 0;
              top:50%;
              margin-top: -7px;
              height: 14px;
              width: 1px;
              background-color: var(--qq--match-border-color5);
            }
          }
            
            &:nth-child(2){
            border-right: 1px solid var(--qq--match-border-color5);
          }
          }
          
        }
        .d-table-td {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--qq--y0-text-color5);
          &:first-child {
            width: 100px;
          }
          
          &.multiple-pos {
            padding: 0 5px;
            justify-content: space-between;
          }
          &:nth-child(2) {
            min-width: 240px;
          }
          &:last-child {
            min-width: 50px;
            text-align: center;
            border-right: transparent;
          }
          .logo {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          .user-name{
          font-weight: bold;
        }
          .player-name {
            color: var(--qq--y0-text-color5);
            min-width: 24px;
            text-align: right;
          }
        }
      }
    }
  }
}
.home {
  .panel-title:before {
    background: var(--qq--analysis-bg-color-12-1) !important;
  }
}
.away {
  .panel-title:before {
    background: var(--qq--analysis-bg-color-12-1) !important;
  }
}
</style>
