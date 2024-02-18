<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育淘汰赛积分榜
-->

<template>
  <div class="elimination-rank">
    <!-- 积分榜tab -->
    <div class="tab" :class="{'is-finals':vsport_ctr.elimination_tab == 'final'}">
      <div 
        v-for="(item,key) in vsport_ctr.elimination_tabs" :key="key"
        class="item" 
        :class="{
          active:vsport_ctr.elimination_tab == item.key,
          disable:vsport_ctr.elimination_disable.includes(item.key),
          'active-bg':vsport_ctr.elimination_tab_bg.includes(item.key)
        }" 
        @click="vsport_ctr.set_elimination_tab(item.key)"
      >{{item.value}}</div>
    </div>
    <!-- 赛事 -->
    <div class="match-item" v-for="(item,index) in vsport_ctr.elimination_rank" :key="index">
      <div class="left-line" :class="{'no-border':vsport_ctr.elimination_tab == 'q8'}"></div>
      <div class="col">
        <div class="team relative-position" v-for="(match,key) in item.match_list" :key="key">
          <div class="number">{{match.number / 2}}</div>
          <div class="name relative-position">
            <div class="ellipsis ">{{match.name}}</div>
          </div>
          <div class="score" :class="{none:score == ''}" v-for="(score,score_key) in match.score" :key="score_key">{{score}}</div>
        </div>
      </div>
      <div class="right-line"></div>
      <div class="semifinals relative-position yb-flex-center">
        <div class="name">{{item.type}}</div>
        <div class="number">{{index+1}}</div>
      </div>
    </div>
    <!-- 决赛 -->
    <div class="finals" v-if="vsport_ctr.elimination_tab == 'final'">
      <div class="col ellipsis home">{{vsport_ctr.final.homeName}}</div>
      <div class="vs">VS</div>
      <div class="col ellipsis">{{vsport_ctr.final.awayName}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "eliminationRank",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  created(){
    this.vsport_ctr.set_elimination_rank(true)
  }
};
</script>

<style lang="scss" scoped>
.elimination-rank {
  overflow: hidden;
}

/*  积分榜tab */
.tab {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
  .item {
    flex: 1;
    height: 100%;
    text-align: center;
    cursor: pointer;
    &.active {
      background-position: right center;
    }
    &.disable {
      cursor: not-allowed;
    }
  }
}

/*  赛事 */
.match-item {
  display: flex;
  margin-bottom: 64px;
  align-items: center;

  /*  左边线条 */
  .left-line {
    width: 46px;
    height: 130px;
  }

  /*  右边线条 */
  .right-line {
    width: 60px;
    height: 130px;
    display: flex;
    align-items: center;
    &:before {
      content: "";
      width: 50%;
      height: 100%;
      border-left: none !important;
    }
    &:after {
      content: "";
      width: 50%;
      height: 1px;
    }
  }

  /*  战队信息 */
  .team {
    display: flex;
    height: 32px;
    align-items: center;
    &:nth-of-type(odd) {
      height: 33px;
      .number {
        display: none;
      }
    }
    &:nth-child(3) {
      margin-top: 64px;
    }
    .number {
      width: 30px;
      text-align: center;
      position: absolute;
      left: 0;
      top: -33px;
      height: 65px;
      line-height: 65px;
    }
    .name {
      flex: 1;
      height: 100%;
      line-height: 32px;
      margin-left: 30px;
    }
    .score {
      width: 13%;
      max-width: 40px;
      min-width: 28px;
      min-height: 1px;
      text-align: center;
      &.none:before {
        content: "";
        display: block;
        margin: auto;
        width: 8px;
        height: 1px;
      }
    }
  }

  /*  半决赛 */
  .semifinals {
    width: 17%;
    max-width: 90px;
    height: 64px;
    flex-direction: column;
    line-height: 18px;
    margin-right: 46px;
  }
}

/*  决赛 */
.finals {
  width: 80%;
  height: 90px;
  margin: 40px auto;
  background-repeat: no-repeat;
  background-position: center bottom;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 13px;
  .home {
    text-align: right;
  }
  .vs {
    width: 122px;
    text-align: center;
  }
}
</style>
