<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育小组赛积分榜
-->

<template>
  <div class="group-rank">
    <!-- header -->
    <div class="header">
      <div class="col1"></div>
      <!-- 球队 -->
      <div class="col2">{{i18n_t('vsport.gtab1')}}</div>
      <!-- 比赛 -->
      <div class="col3">{{i18n_t('vsport.gtab2')}}</div>
      <!-- 胜/平/负 -->
      <div class="col4">{{i18n_t('vsport.gtab3')}}</div>
      <!-- 进 -->
      <div class="col5">{{i18n_t('vsport.gtab4')}}</div>
      <!-- 失 -->
      <div class="col6">{{i18n_t('vsport.gtab5')}}</div>
      <!-- 净胜球 -->
      <div class="col7">{{i18n_t('vsport.gtab6')}}</div>
      <!-- 积分 -->
      <div class="col8">{{i18n_t('vsport.gtab7')}}</div>
    </div>
    <!-- 小组 -->
    <div class="group-item" v-for="(item,index) in vsport_ctr.group_rank_list" :key="index">
      <div class="group-name">{{i18n_t('vsport.xgroup').replace('%s',item.groupId)}}</div>
      <div class="team-item" v-for="(match,key) in item.sVirtualSportXZTeamRankingDetailPOList" :key="key">
        <div class="col1 din-medium">{{match.ranking}}</div>
        <div class="col2 relative-position">
          <div class="ellipsis yb-absolute-fit">{{match.virtualTeamName}}</div>
        </div>
        <div class="col3">{{match.totalCount}}</div>
        <div class="col4">{{match.win}}/{{match.draw}}/{{match.lost}}</div>
        <div class="col5">{{match.goalsScored}}</div>
        <div class="col6">{{match.goalsConceded}}</div>
        <div class="col7">{{match.goalsWinning}}</div>
        <div class="col8">{{match.points}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "groupRank",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  created(){
    this.vsport_ctr.set_group_rank_list()
  },
  destroyed(){
    this.vsport_ctr.group_rank_list = []
  }
};
</script>

<style lang="scss" scoped>
.group-rank {
  .col1 {
    width: 40px;
  }
  .col2 {
    flex: 1;
    height: 100%;
    text-align: left;
  }
  .col3 {
    width: 54px;
  }
  .col4 {
    width: 75px;
  }
  .col5 {
    width: 44px;
  }
  .col6 {
    width: 44px;
  }
  .col7 {
    width: 46px;
  }
  .col8 {
    width: 54px;
  }

  @media (max-width: 1500px) {
    .col3 {
      width: 44px;
    }
    .col4 {
      width: 75px;
    }
    .col5 {
      width: 34px;
    }
    .col6 {
      width: 34px;
    }
    .col7 {
      width: 36px;
    }
    .col8 {
      width: 44px;
    }
  }
}

/*  头部 */
.header {
  height: 32px;
  display: flex;
  text-align: center;
  line-height: 32px;
  padding-right: 5px;
}
.group-item {
  padding-bottom: 7px;
}
.group-name {
  height: 32px;
  line-height: 32px;
  padding-left: 15px;
  font-size: 14px;
  margin-bottom: 7px;
}
.team-item {
  display: flex;
  padding-right: 5px;
  font-size: 13px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  .col1 {
    font-size: 12px;
    text-align: right;
    padding-right: 14.5px;
  }
  .col2 {
    font-size: 14px;
  }
}
</style>
