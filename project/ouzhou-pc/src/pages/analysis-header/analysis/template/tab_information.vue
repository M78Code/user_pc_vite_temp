<!--
 * @Author: Yellow
 * @Description: 足篮赛事分析---情报
-->
<template>
  <div class="information">
    <div class="tab">
      <!-- 主队 -->
      <span :class="{'active':tabIndex==1}" @click="tabClick(1)">{{match.mhn}}</span>
      <!-- 客队 -->
      <span :class="{'active':tabIndex==2}" @click="tabClick(2)">{{match.man}}</span>
    </div>

    <div class="panel">
      <!-- 有利情报 -->
      <div class="panel-title color50C042">{{i18n_t('analysis.Favorable_information')}}</div>
      <div class="item" v-for="(item,index) in lineupData[0]" :key="index">{{item.content}}</div>
    </div>

    <div class="panel">
      <!-- 不利情报 -->
      <div class="panel-title E93D3D">{{i18n_t('analysis.Unfavorable_information')}}</div>
      <div class="item" v-for="(item,index) in lineupData[1]" :key="index">{{item.content}}</div>
    </div>

    <div class="panel">
      <!-- 中立情报 -->
      <div class="panel-title">{{i18n_t('analysis.Neutral_Information')}}</div>
      <div class="item" v-for="(item,index) in lineupData[2]" :key="index">{{item.content}}</div>
    </div>
  </div>
</template>

<script>
import analysisData  from './analysis'
export default {
  data() {
    return {
      tabIndex:1,
      params:{}, // 接口请求参数
      lineupData: [], // 情报数据
    };
  },
  mixins: [analysisData],
  created() {
    this.params = {parentMenuId: 4, sonMenuId: 1, standardMatchId: this.match.mid}
    this.get_data()
  },
  methods: {
    tabClick(index){
      this.tabIndex = index
      this.params.sonMenuId = index
      this.get_data()
    },
    /**
    * @description: 情报数据
    */
    get_data(){
      this.get_analysiseData(this.params, (res)=>{
        let data = res.sThirdMatchInformationDTOList
        let lineupData = [[],[],[]] 
        // 0主队中立,1客队中立，2 主队有利，3客队有利,  4主队不利,   5客队不利,  6无用
        data.map(item =>{
          if(this.tabIndex == 1){//主队
            if(item.benefit == 2){
              lineupData[0].push(item)
            } else if(item.benefit == 4){
              lineupData[1].push(item)
            } else if(item.benefit == 0){
              lineupData[2].push(item)
            }
          } else {
            if(item.benefit == 3){
              lineupData[0].push(item)
            } else if(item.benefit == 5){
              lineupData[1].push(item)
            } else if(item.benefit == 1){
              lineupData[2].push(item)
            }
          }
        })
        this.lineupData = lineupData
      })
    }
  },
  destroyed() {
    this.params = null;
    this.lineupData = null;
  }
};
</script>

<style lang="scss" scoped>
.information {
  .tab {
    display: flex;
    align-items: center;
    height: 34px;
    color: #414655;
    margin-bottom: 10px;
    border-radius: 0 0 8px 8px;
    border-left: 1px solid #E4EAFF;
    border-right: 1px solid #E4EAFF;
    background: linear-gradient(94.17deg, rgba(255, 112, 0, 0.3) -25.38%, rgba(255, 112, 0, 0) 22.77%),
linear-gradient(0deg, #FFFFFF, #FFFFFF);
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
        color: #ff7000;
        border-bottom: 2px solid #ff7000;
      }
    }
  }
  .panel {
    margin-bottom: 10px;
    .panel-title.E93D3D:before {
      background: #E93D3D;
    }
    .panel-title.color50C042:before {
      background: #50C042;
    }
    .item {
      padding: 14px 30px;
      // border: 1px solid var(--qq--analysis-bd-color-2);
      border-top: 0 none;
      border-radius: 0 0 8px 8px;
    }
  }
}
</style>