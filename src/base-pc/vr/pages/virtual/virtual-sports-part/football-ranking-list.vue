<!--
 * @Description: 球类 排行榜页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="ranking_list hairline-border">
    <!-- <span class="navigation-title">{{ i18n_t('virtual_sports.leaderboard') }}</span> -->
    <!-- header -->
    <div class="leaderboard">Leaderboard</div>
    <div class="header">
      <div class="col1 col-label"></div>
      <div class="col2 col-label">{{ i18n_t('virtual_sports.team') }}</div>
      <div class="col3 col-label">{{ i18n_t('virtual_sports.game') }}</div>
      <div class="col4 col-label">{{ i18n_t('virtual_sports.win_tie_loss') }}</div>
      <div class="col5 col-label">{{ i18n_t('virtual_sports.integral') }}</div>
    </div>
    <!-- 小组 -->
    <div class="group-item" v-if="!no_data">
      <div class="team-item" v-for="(item, i) in ranking_data" :key="i">
        <div class="col1 col-field" v-if="+i > 2">{{+i + 1}}</div>
        <div class="col1 col-field rank-img" :class="[`rank${+i+1}`]" v-else>
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/rank${+i+1}.png`"/>
        </div>
        <div class="col2 ellipsis col-field">
          {{item.virtualTeamName}}
        </div>
        <div class="col3 col-field">{{ item.totalCount }}</div>
        <div class="col4 col-field">{{ item.winDrawLostDescription }}</div>
        <div class="col5 col-field">{{ item.points }}</div>
      </div>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>
<script>
import football_ranking_list_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/football-ranking-list-mixin.js";
import no_data from "src/base-pc/vr/components/common/vr-sport-no-data.vue";
export default {
  mixins:[football_ranking_list_mixin],
  name:'ranking_list',
  components: {
    "no-data": no_data
  },
}
</script>

<style lang="scss" scoped>
.ranking_list {
  // padding-top: 0.15rem;

  .navigation-title {

    font-size: 0.15rem;

    display: block;
    position: relative;
    margin: 0 0 0.15rem;
    padding-left: 0.28rem;
    font-weight: 700;

    &:before {
      content: "";
      width: 0.03rem;
      height: 0.14rem;
      position: absolute;
      left: 0.17rem;
      top: 0.035rem;

      border-radius: 1.5px;
    }
  }

  .col-label{
    font-size: 0.1rem;
    color: var(--q-gb-t-c-8);
  }

  .col1 {
    width: 30px;
    height: 34px;
    background-color: var(--q-gb-bg-c-15);
  }

  .col2 {
    width: 0.94rem;
    text-align: left;
    padding-left: 12px;
    display: unset !important; /*  避免flex 没有显示省略号 */
  }
  /*  3~8 总宽度220px */
  .col3 {
    width: 0.5rem;
  }

  .col4 {
    width: 1rem;
  }

  .col5 {
    flex: 1;
  }

  .col6 {
    flex: 1;
    height: 100%;
    text-align: center;
  }

  /*  头部 */
  .leaderboard {
    height: 40px;
    background: #fff;
    line-height: 40px;
    font-weight: 500;
    padding-left: 20px;
    border-top: 1px solid var(--q-gb-bd-c-1);
    margin-top: 10px;
  }
  .header {
    height: 0.32rem;

    display: flex;
    text-align: center;
    line-height: 0.32rem;
    background-color: #F5F5F5;

    /* label字段 设计稿上是字体 10px，font-weight 400 */
    > div {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 0.10rem;
      // line-height: 0.14rem;
      letter-spacing: 0;
      // text-align: left;
    }
  }

  .group-name {
    height: 0.42rem;
    line-height: 0.42rem;
    padding-left: 0.15rem;
    font-size: 0.14rem;
    margin-bottom: 0.07rem;
  }

  .team-item {
    display: flex;
    align-items: center;
    font-size: 0.13rem;
    height: 34px;
    text-align: center;
    overflow: hidden;
    border-bottom: 1px solid var(--q-gb-bd-c-6);

    .rank-img {
      &.rank1 {
        background-color: #FDCACA;
      }
      &.rank2 {
        background-color: #FFEAD9;
      }
      &.rank3 {
        background-color: #E9E9E9;
      }
      img{
        width: 14px;
        height: 14px;
      }
    }

    /* 列字段 设计稿上是字体 12px，font-weight 500 */
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.12rem;
      font-weight: 500;
      color: var(--q-gb-t-c-5);
    }

    /*  .field{} */

    /*
    &:nth-child(-n+3) {

      font-weight: bold;

      div {
        font-size: 0.14rem;
        color: var(--q-color-fs-color-3);
      }
    }
    */

    .col1 {
      font-size: 0.12rem;
      text-align: right;
    }

    .col2 {
      justify-content: inherit;
    }
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/football_ranking_list_mixin.js