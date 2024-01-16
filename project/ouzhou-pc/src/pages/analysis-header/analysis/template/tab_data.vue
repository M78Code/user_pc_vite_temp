<!--
 * @Author: Yellow
 * @Description: 足篮赛事分析---数据
-->
<template>
  <div class="datum" :class="{'mya_width_style': ['mya'].includes(lang)}">
    <div class="tab" v-if="match.csid=='1'">
      <!-- 基本面 -->
      <span :class="{'active':tabIndex==1}" @click="tabClick(1)">{{i18n_t('analysis.Fundamentals')}}</span>
      <!-- 盘面 -->
      <span :class="{'active':tabIndex==2}" @click="tabClick(2)">{{i18n_t('analysis.Disk')}}</span>
      <!-- 技术面 -->
      <span :class="{'active':tabIndex==3}" @click="tabClick(3)">{{i18n_t('analysis.Technical_side')}}</span>
    </div>
    <!-- 基本面 -->
    <template v-if="tabIndex == 1">
      <base-panel 
      :match="match" 
      :baseData="baseData" 
      :tournamentTypeFinish="tournamentTypeFinish"
      :vs_info="vs_info" 
      :vs_info_data="vs_info_data"
      :team_vs_history="team_vs_history" 
      :team_vs_other_team="team_vs_other_team"
      :team_vs_other_team_result="team_vs_other_team_result"
      :team_vs_history_result="team_vs_history_result"
      @selectedFn="selectedFn"
      @get_all_vsInfo="get_all_vsInfo"/>
    </template>

    <!-- 盘面 -->
    <template v-if="tabIndex == 2 && match.csid=='1'">
      <div class="panel disk analysis_disk">
        <!-- 盘路走势 -->
        <div class="panel-title">{{i18n_t('analysis.Turning_trend')}}</div>
        <div>
          <div class="match-info">
            <div class="team">
              <img v-img="([lodash.get(match,'mhlu[0]'),lodash.get(match,'frmhn[0]')])" class="logo" alt/>
              <span>{{match.mhn}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 总 -->
            <div class="d-td border_r">
              <div class="match_total">&nbsp;</div>
              <div class="match_total">{{i18n_t('vsport.gtab2')}}</div>
            </div>
            <!-- 赢盘 -->
            <div class="d-td">{{i18n_t('analysis.win_plate')}}</div>
            <!-- 走盘 -->
            <div class="d-td">{{i18n_t('analysis.Move_plate')}}</div>
            <!-- 输盘 -->
            <div class="d-td">{{i18n_t('analysis.Lose_plate')}}</div>
            <!-- 赢盘率 -->
            <div class="d-td border_r">{{i18n_t('analysis.Win_rate')}}</div>
            <!-- 大球 -->
            <div class="d-td">{{i18n_t('analysis.big_ball')}}</div>
            <!-- 大球率 -->
            <div class="d-td">{{i18n_t('analysis.Big_ball_rate')}}</div>
            <!-- 小球 -->
            <div class="d-td">{{i18n_t('analysis.small_ball')}}</div>
            <!-- 小球率 -->
            <div class="d-td">{{i18n_t('analysis.small_ball_rate')}}</div>
          </div>
          <div class="d-body d-tr" v-for="(item,index) in lodash.get(baseData,'1.matchHistoryBattleDetailDTOList')" :key="index">
            <!-- 总   主   客 -->
            <div class="d-td">
              <div class="match_num_total">
                {{item.postionFlag==1?i18n_t('analysis.total_all')
            :(item.postionFlag==2?i18n_t('analysis.main'):i18n_t('analysis.customer'))}}
              </div>
              <div class="match_num_total">{{parseInt(item.handicapResultWin) + parseInt(item.handicapResultEqual) + parseInt(item.handicapResultLose)}}</div>
            </div>
            <div class="d-td">{{item.handicapResultWin}}</div>
            <div class="d-td">{{item.handicapResultEqual}}</div>
            <div class="d-td">{{item.handicapResultLose}}</div>
            <div class="d-td">{{(item.handicapResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultWin}}</div>
            <div class="d-td">{{(item.overunderResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultLose}}</div>
            <div class="d-td">{{(item.overunderResultLoseRate*100).toFixed(2)}}%</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td color_83838a">{{i18n_t("analysis.last10games")}}</div>
            <div class="d-td match_status">
              <span 
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in lodash.get(baseData, '1.handicapResultList')"
                :key="index"
                >{{result_filter('resultLabel', item)}}</span>
            </div>
            <div class="d-td match_status">
              <span
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in lodash.get(baseData, '1.overunderResultList')"
                :key="index"
                >{{result_filter('overunderLabel', item)}}</span>
            </div>
          </div>
        </div>

        <div class="away">
          <div class="match-info">
            <div class="team">
              <img v-img="([lodash.get(match,'malu[0]'),lodash.get(match,'frman[0]')])" class="logo" alt/>
              <span>{{match.man}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 总 -->
            <div class="d-td border_r">
              <div class="match_total">&nbsp;</div>
              <div class="match_total">{{i18n_t('vsport.gtab2')}}</div>
            </div>
            <!-- 赢盘 -->
            <div class="d-td">{{i18n_t('analysis.win_plate')}}</div>
            <!-- 走盘 -->
            <div class="d-td">{{i18n_t('analysis.Move_plate')}}</div>
            <!-- 输盘 -->
            <div class="d-td">{{i18n_t('analysis.Lose_plate')}}</div>
            <!-- 赢盘率 -->
            <div class="d-td border_r">{{i18n_t('analysis.Win_rate')}}</div>
            <!-- 大球 -->
            <div class="d-td">{{i18n_t('analysis.big_ball')}}</div>
            <!-- 大球率 -->
            <div class="d-td">{{i18n_t('analysis.Big_ball_rate')}}</div>
            <!-- 小球 -->
            <div class="d-td">{{i18n_t('analysis.small_ball')}}</div>
            <!-- 小球率 -->
            <div class="d-td">{{i18n_t('analysis.small_ball_rate')}}</div>
          </div>
          <div class="d-body d-tr" v-for="(item,index) in lodash.get(baseData,'2.matchHistoryBattleDetailDTOList')" :key="index">
            <!-- 总   主   客 -->
            <div class="d-td">
              <div class="match_num_total">
                {{item.postionFlag==1?i18n_t('analysis.total_all')
            :(item.postionFlag==2?i18n_t('analysis.main'):i18n_t('analysis.customer'))}}
              </div>
              <div class="match_num_total">{{parseInt(item.handicapResultWin) + parseInt(item.handicapResultEqual) + parseInt(item.handicapResultLose)}}</div>
            </div>
            <div class="d-td">{{item.handicapResultWin}}</div>
            <div class="d-td">{{item.handicapResultEqual}}</div>
            <div class="d-td">{{item.handicapResultLose}}</div>
            <div class="d-td">{{(item.handicapResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultWin}}</div>
            <div class="d-td">{{(item.overunderResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultLose}}</div>
            <div class="d-td">{{(item.overunderResultLoseRate*100).toFixed(2)}}%</div>
          </div>
          <!-- 近10场 -->
          <div class="d-body d-tr">
            <div class="d-td color_83838a">{{i18n_t("analysis.last10games")}}</div>
            <div class="d-td match_status">
              <!-- 输赢 -->
              <span 
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in lodash.get(baseData, '2.handicapResultList')"
                :key="index"
                >{{result_filter('resultLabel', item)}}</span>
            </div>
            <div class="d-td match_status">
              <!-- 大小 -->
              <span
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in lodash.get(baseData, '2.overunderResultList')"
                :key="index"
                >{{result_filter('overunderLabel', item)}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 技术面 -->
    <template v-if="tabIndex == 3 && match.csid=='1'">
      <div class="panel disk technical">
        <!-- 教练数据 -->
        <div class="panel-title">{{i18n_t('analysis.Coach_data')}}</div>
        <div class="home" v-for="(item,index) in lodash.get(baseData,'sThirdMatchCoachDTOMap.1')" :key="`sThirdMatchCoachDTOMap${index}`">
          <div class="match-info">
            <div class="team">
              <img v-img="([lodash.get(match,'mhlu[0]'),lodash.get(match,'frmhn[0]')])" class="logo" alt/>
              <span>{{item.coachName}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 年龄 -->
            <div class="d-td">{{i18n_t('analysis.age')}}</div>
            <!-- 战术分格 -->
            <div class="d-td">{{i18n_t('analysis.Tactical_division')}}</div>
            <!-- 场均得分 -->
            <div class="d-td">{{i18n_t('analysis.Points_per_game')}}</div>
            <!-- 出站 -->
            <div class="d-td">{{i18n_t('analysis.Go_to_war')}}</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td">{{getAge(item.coachBirthdate)}}</div>
            <div class="d-td">{{item.coachStyle}}</div>
            <div class="d-td">{{item.score}}</div>
            <div class="d-td">{{item.coachGameCount}}</div>
          </div>
        </div>

        <div class="away" v-for="(item,index) in lodash.get(baseData,'sThirdMatchCoachDTOMap.2')" :key="`sThirdMatchCoachDTOMap-2${index}`">
          <div class="match-info">
            <div class="team">
              <img v-img="([lodash.get(match,'malu[0]'),lodash.get(match,'frman[0]')])" class="logo" alt/>
              <span>{{item.coachName}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 年龄 -->
            <div class="d-td">{{i18n_t('analysis.age')}}</div>
            <!-- 战术分格 -->
            <div class="d-td">{{i18n_t('analysis.Tactical_division')}}</div>
            <!-- 场均得分 -->
            <div class="d-td">{{i18n_t('analysis.Points_per_game')}}</div>
            <!-- 出站 -->
            <div class="d-td">{{i18n_t('analysis.Go_to_war')}}</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td">{{getAge(item.coachBirthdate)}}</div>
            <div class="d-td">{{item.coachStyle}}</div>
            <div class="d-td">{{item.score}}</div>
            <div class="d-td">{{item.coachGameCount}}</div>
          </div>
        </div>
        
      </div>
    </template>
  </div>
</template>

<script>
import basePanel from './base_panel.vue'
import analysisData  from 'src/public/mixins/analysis/analysis'
import { api_analysis } from 'src/api/index'
import { i18n_t,result_filter } from "src/output/index.js";
import { UserCtr } from "src/output/index.js";


export default {
  data() {
    return {
      tabIndex: 1, // 当前 tab 所在下标
      baseData: {},//基本面数据
      vs_info: [],//杯赛积分
      vs_info_data: [],//杯赛积分
      team_vs_history: [], // 基本面---历史交战数据
      team_vs_other_team: {}, // 近期战绩---格式化后的主客队比赛数据
      params:{}, // 接口请求参数
      team_vs_other_team_result: {},//近期战阵主客胜平负次数
      team_vs_history_result: {},//历史战阵主客胜平负次数
      tournamentTypeFinish: false,//联赛数据加载完成
    };
  },
  mixins: [analysisData],
  components:{
    basePanel
  },
  created() {
    //flag	1=同联赛, 2= 同主客,3=同主客+同联赛
    this.params = {mid: this.match.mid,cps: 5, flag: 0}
    this.getData() // 拉取数据
    this.get_vs_info()//杯赛积分
    this.get_team_vs_history()//历史交战
    this.get_team_vs_other_team()//近期战绩
    this.tournamentTypeFinish = false
  },
  computed:{
    lang(){
      return UserCtr.lang
    }

  },
  methods: {
    /**
    * @description: 切换基本面、盘面、技术面
    * @param {}
    * @return {}
    */
    tabClick(index){
      this.tabIndex = index
      this.getData()
      if(index == 1){
        this.get_vs_info()//杯赛积分
        this.get_team_vs_history()//历史交战
        this.get_team_vs_other_team()//近期战绩
      }else{
        //切换时还原数据
        this.params = {mid: this.match.mid,cps: 5, flag: 0}
      }
    },
    /**
    * @description: 数据 tab
    */
    getData(){
      let params = {parentMenuId: 2, sonMenuId: this.tabIndex, standardMatchId: this.match.mid}//
      this.get_analysiseData(params, (res)=>{
        // 基本面
        if(this.tabIndex == 1){
          if(Object.keys(res.basicInfoMap).length){
            // 未来赛程  // 伤停情况
            let _future = ['sThirdMatchFutureStatisticsDTOMap', 'sThirdMatchSidelinedDTOMap'];
            // 主客队数据个数不一样的情况下，补全数据少的那一边
            if (Object.keys(res.basicInfoMap).some(item => _future.includes(item))) {
              _future.forEach(key => {
                // 主队
                let _h = lodash.get(res.basicInfoMap, `${key}.1`) || [];
                // 客队
                let _a = lodash.get(res.basicInfoMap, `${key}.2`) || [];
                if (_h.length != _a.length && _h.length > _a.length) {
                  let _count = _h.length - _a.length;
                  for(let i = 0;i < _count;i ++) {
                    _a.push({})
                  }
                } else {
                  let _count = _a.length - _h.length;
                  for(let i = 0;i < _count;i ++) {
                    _h.push({})
                  }
                }
              })
            }

            this.baseData = res.basicInfoMap
          }
        // 盘面
        } else if(this.tabIndex == 2){
          this.baseData = res.matchHistoryBattleDTOMap
        // 技术面
        } else {
          this.baseData = res.homeAwayGoalAndCoachMap
        }
      })
    },
    /**
    * @description: 杯赛积分
    */
    get_vs_info(flag){
      api_analysis.get_vs_info({mid: this.match.mid, flag: 0}).then(({data}) =>{
        if(data.code == 200){
          this.tournamentTypeFinish = true
          this.vs_info_data = data.data
          if( data.data.length>0){
            this.vs_info = data.data.filter(item=>item.teamFlag!='')
          //   if (flag===0) {
          //   this.vs_info = data.data
          // }else{
          //   this.vs_info = data.data.filter(item=>item.teamFlag!='')
          // }
          }else{
            this.vs_info = []
          } 
        }
      })
    },
    /**
    * @description: 历史交战
    */
    get_team_vs_history(){
      api_analysis.get_team_vs_history(this.params).then(({data}) =>{
        if(data.code == 200 && data.data){
          this.team_vs_history = data.data
          let result = this.format_result(data.data)
          this.team_vs_history_result = {
            home: result,
            away: {
              dogfall: result.dogfall,
              lose: result.win,
              win: result.lose,
            }
          }
        }
      })  
    },
    /**
    * @description: 近期战绩
    */
    get_team_vs_other_team(){
      api_analysis.get_team_vs_other_team(this.params).then(({data}) =>{
        if(data.code == 200 && data.data){
          let results = lodash.get(data, "data");
          if (!results || !results.length) {return;}
          let findId = results[0].teamGroup
          let obj = {home: [],away: []}
          results.forEach(item =>{
            if(item.teamGroup == findId){
              obj.home.push(item)
            } else{
              obj.away.push(item)
            }
          })
          this.team_vs_other_team = obj
          this.team_vs_other_team_result = {
            home: this.format_result(obj.home),
            away: this.format_result(obj.away)
          }
        }
      })  
    },
    /**
    * @description: 计算胜平负次数
    */
    format_result(data){
      let obj = {
        win: 0,
        dogfall: 0,
        lose:0
      }
      data.forEach(item=>{
        if(item.result == 2){
          obj.dogfall += 1
        } else if(item.result == 3){
          obj.lose += 1
        } else if(item.result == 4){
          obj.win += 1
        }
      })
      return obj
    },
    /**
    * @description: 切换下拉菜单
    */
    selectedFn(data){
      let { name, cps , flag } = data[0]
      this.params.cps = cps
      this.params.flag = flag
      if(name == "vs"){//历史交战
        this.get_team_vs_history()
      } else {
        this.get_team_vs_other_team()
      }
    },
    /**
    * @description: 联赛积分全量数据
    */
    get_all_vsInfo(flag){
      // this.get_vs_info(flag?0:'')
      if (flag) {
            this.vs_info = this.vs_info_data
          }else{
            this.vs_info = this.vs_info_data.filter(item=>item.teamFlag!='')
          }
    },
    /**
    * @description: 通过出生日计算年龄
    */
    getAge(birthdate){
      if(!birthdate) return ''
      let date = new Date(birthdate).getFullYear()
      return new Date().getFullYear() - date
    }
  }
};
</script>

<style lang="scss" scoped>
.datum {
  width: 100%;
  overflow-x: auto;
  .tab {
    display: flex;
    min-width: 950px;
    align-items: center;
    height: 34px;
    color: var(--qq--y0-text-color5);
    margin-bottom: 10px;
    // width: 309px;
    // border-radius: 8px;
    border-radius: 0 0 8px 8px;
    // border: 1px solid var(--qq--match-border-color5);
    // border-bottom: 0;
    background: var(--qq--match_details_analysis_title);
    box-sizing: border-box;
    border-left: 1px solid var(--qq--match-border-color5);
    border-right: 1px solid var(--qq--match-border-color5);
    // background-image: linear-gradient(-40deg, #179CFF 12%, #179CFF 0);
    span {
      // width: 103px;
      margin: 0 10px;
      height: 28px;
      line-height: 28px;
      color: var(--qq--y0-text-color5);;
      cursor: pointer;
      text-align: center;
      font-weight: 600;
      // border: 1px solid var(--qq--match-border-color5);
      // &:first-child {
      //   border-radius: 8px 0 0 8px;
      // }
      // &:last-child {
      //   border-left: none;
      //   border-radius: 0 8px 8px 0;
      // }
      // &:nth-child(2) {
      //   border-left: none;
      // }
      // &:not(:last-child) {
      //   border-right: none;
      // }
      &.active {
        // background-image: var(--qq--analysis-bg-gradient-2);
        color: var(--qq--theme-color-handicap-item-title);
        border-bottom: 2px solid var(--qq--theme-color-handicap-item-title);
      }
    }
  }
  :deep(.panel) {
    min-width: 950px;
  }
  .panel {
    margin-bottom: 20px;
    min-width: 950px;
    // width: 100%;
    background: var(--qq--y0-bg-color12);
    .panel-title {
      display: flex;
      // background: #F4FAFF;
      justify-content: space-between;
      padding-right: 20px;
    }
  }

  /*  盘面 */
  .disk {
    background: var(--qq--y0-bg-color12);
    .match-info {
      padding: 20px 20px 10px;
      .team {
        display: flex;
        align-items: center;
        color: var(--qq--analysis-text-color-1);
        margin-bottom: 10px;
        .logo {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
      .result-wrap {
        display: flex;
        align-items: center;
        .info {
          display: flex;
          align-items: center;
          margin-right: 80px;
          .label {
            color: var(--qq--analysis-text-color-4);
            font-size: 16px;
            margin-right: 10px;
          }
        }
        .result {
          display: flex;
          .result-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 2px;
            color: var(--qq--analysis-text-color-13);
            margin-right: 6px;
          }
        }
      }
    }
    .d-tr {
      display: flex;
      .d-td {
        flex: 1;
        display: flex;
        align-items: center;
        border: 1px solid var(--qq--match-border-color5);
        color: var(--qq--y0-text-color5);
        justify-content: center;
        &:first-child {
          width: 84px;
          flex: unset;
          font-weight: 400;
        }
      }
    }
    .d-header {
      // background: var(--qq--y0-bg-color12);
      // color:  var(--qq--y0-text-color5);
      background: var(--qq--analysis-bg-color-16);
      color: var(--qq--y0-text-color5);
      border-bottom: none !important;
      .d-td {
        height: 28px;
      }
      .border_r {
        border: 1px solid var(--qq--match-border-color5);
        &:first-child {
          display: flex;
          justify-content: center;
          .match_total {
            width: 50%;
          }
        }
      }
    }
    .d-body {
      border-bottom: 1px solid var(--qq--match-border-color5);
      font-weight: 500;
      .color_83838a {
        color: var(--qq--y0-text-color5);
      }
      .d-td {
        height: 40px;
        border: 1px solid var(--qq--match-border-color5);
        &:last-child {
          border-right: transparent;
        }
        .match_num_total {
          width: 50%;
          display: flex;
          justify-content: center;
          &:first-child {
            color: var(--qq--y0-text-color5);
          }
        }
      }
      .match_status {
        .result-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;

          margin-right: 6px;
        }
      }
    }
    &.analysis_disk {
      .away {
        .d-body:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
    }
  }
  /*  技术面 */
  .technical {
    .panel-title:last-child {
      border-radius: 8px;
      border-bottom: 1px solid var(--qq--analysis-bd-color-4);
    }
    .match-info {
      padding: 10px 20px;
      .team {
        margin-bottom: 0;
      }
    }
    .d-header {
      border-bottom: 0 !important;
    }
    .away {
      .d-body:last-child {
        border-radius: 0 0 8px 8px;
      }
    }
  }
}
</style>