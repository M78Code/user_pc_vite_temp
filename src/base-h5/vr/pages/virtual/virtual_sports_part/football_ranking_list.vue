<!--
 * @Author: ladron
 * @Date: 2020-12-27 11:34:53
 * @Description: 球类 排行榜页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="ranking_list hairline-border">
    <span class="navigation-title">{{ i18n_t('virtual_sports.leaderboard') }}</span>
    <!-- header -->
    <div class="header">
      <div class="col1"></div>
      <div class="col2">{{ i18n_t('virtual_sports.team') }}</div>
      <div class="col3">{{ i18n_t('virtual_sports.game') }}</div>
      <div class="col4">{{ i18n_t('virtual_sports.win_tie_loss') }}</div>
      <div class="col5">{{ i18n_t('virtual_sports.integral') }}</div>
    </div>
    <!-- 小组 -->
    <div class="group-item" v-if="!no_data">
      <div class="team-item" v-for="(item, i) in ranking_data" :key="i">
        <div class="col1">{{+i + 1}}</div>
        <div class="col2 ellipsis">
          {{item.virtualTeamName}}
        </div>
        <div class="col3">{{ item.totalCount }}</div>
        <div class="col4">{{ item.winDrawLostDescription }}</div>
        <div class="col5">{{ item.points }}</div>
      </div>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>

<script>
import {api_v_sports} from "src/base-h5/vr/api";
import no_data from "src/base-h5/vr/components/common/no_data.vue";

export default {
  name: "ranking_list",
  components: {
    "no-data": no_data
  },
  props:{
    tid: Number|String
  },
  data() {
    return {
      ranking_data: [],
      no_data: false
    }
  },
  mounted() {
  },
  watch: {
    tid: {
      handler: 'get_list',
      immediate: true,
    }
  },
  methods: {
    async get_list() {
      try {
        let {code , data} = await api_v_sports.get_virtual_sport_team_ranking({tid: this.tid})
        if(code == 200) {
          if (data && data.length > 0) {
            this.ranking_data = data
          }else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    }
  },
  destroyed () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },

};
</script>

<style lang="scss" scoped>
.ranking_list {
  padding-top: 0.15rem;

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

  .col1 {
    width: 0.4rem;
  }

  .col2 {
    width: 0.94rem;
    text-align: left;
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
  .header {
    height: 0.32rem;

    display: flex;
    text-align: center;
    line-height: 0.32rem;
    margin: 0 0.1rem;

    > div {

      font-size: 0.12rem;
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
    margin: 0 0.1rem;
    font-size: 0.13rem;
    height: 0.48rem;
    text-align: center;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.13rem;
    }

    &:nth-child(-n+3) {

      font-weight: bold;

      div {
        font-size: 0.14rem;
        color: var(--q-color-fs-color-3);
      }
    }

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
