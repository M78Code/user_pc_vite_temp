<!--
 * @Author: ledron
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育 小组赛页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="group-rank">

    <!-- 小组 -->
    <div class="group-item hairline-border" v-for="(detail_list,index) in group_stage_list" :key="index" v-show="!no_data">
      <div class="group-name">
        <span></span>
        <span>
          {{lang == 'vi' ? (i18n_t('virtual_sports.group')+ '  ' + detail_list.groupId) : (detail_list.groupId+ '  ' +i18n_t('virtual_sports.group'))}}
        </span>
      </div>
      
      <!-- header -->
      <div class="header">
        <div class="col1"></div>
        <div class="col2">{{ i18n_t('virtual_sports.team') }}</div>
        <div class="col3">{{ i18n_t('virtual_sports.game') }}</div>
        <div class="col4">{{ i18n_t('virtual_sports.win_tie_loss') }}</div>
        <div class="col5">{{ i18n_t('virtual_sports.advance') }}</div>
        <div class="col6">{{ i18n_t('virtual_sports.lose') }}</div>
        <div class="col7">{{ i18n_t('virtual_sports.goal_difference') }}</div>
        <div class="col8">{{ i18n_t('virtual_sports.integral') }}</div>
      </div>

      <div class="team-item" v-for="(item,i) in detail_list.sVirtualSportXZTeamRankingDetailPOList" :key="i">
        <div class="col1">{{+i + 1}}</div>
        <div class="col2">
          <div class="ellipsis yb-absolute-fit">{{item.virtualTeamName}}</div>
        </div>
        <div class="col3">{{item.totalCount}}</div>
        <div class="col4">{{ item.winDrawLostDescription}}</div>
        <div class="col5">{{item.goalsScored}}</div>
        <div class="col6">{{item.goalsConceded}}</div>
        <div class="col7">{{item.goalsWinning}}</div>
        <div class="col8">{{item.points}}</div>
      </div>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>

<script>
import { api_v_sports } from "src/api/index.js";
import no_data from "src/base-h5/vr/components/common/vr_sport_no_data.vue";
import { lang } from 'src/base-h5/mixin/userctr.js'

export default {
  name: "group_matches",
  components: {
    "no-data": no_data
  },
  computed: {
    // ...mapGetters(['get_lang']),
    // get_lang(){ return 'zh' }
  },
  props:{
    tid: Number|String,
    current_match: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      group_stage_list: [],
      no_data: false,
      lang
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
        let {code , data} = await api_v_sports.get_virtual_sport_XZ_team_ranking({tid: this.tid})
        if(code == 200) {
          if(data && data.length > 0){
            this.group_stage_list = data
          }else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
  },
  destroyed () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};
</script>

<style lang="scss" scoped>
.group-rank {
  // width: 3.5rem;
  // height: 2.22rem;
  width: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background-color: yellowgreen;
  background-color: #F8F9FA;

  .col1 {
    width: 10%;
  }

  .col2 {
    width: 23%;
    height: 100%;
    text-align: left;

    .ellipsis {
      // width: 1rem;
      width: 100%;
    }
  }

  /*  3~8 总宽度220px */
  .col3 {
    width: 10%;
  }

  .col4 {
    width: 20%;
  }

  .col5 {
    width: 10%;
  }

  .col6 {
    width: 10%;
  }

  .col7 {
    width: 10%;
  }

  .col8 {
    width: 10%;
  }

  /*  头部 */
  .header {
    width: 100%;
    height: 0.32rem;

    display: flex;
    text-align: center;
    line-height: 0.32rem;
    padding-right: 0.05rem;

    > div {
      font-size: 0.1rem;
      font-weight: 400;
      color: #949AB6;
      &.col2 {
        // width: 1.084rem;
        width: 23%;
      }
    }
  }

  .group-item {
    // width: 3.5rem;
    width: 98vw;
    position: relative;
    margin-bottom: 0.08rem;
    background-color: #fff;

    // background-color: yellow;
    box-shadow: 0rem 0rem 0.02rem 0.01rem var(--q-gb-bg-c-18);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  .group-name {
    width: 98vw;
    height: 0.28rem;
    line-height: 0.24rem;
    
    font-size: 0.12rem;
    font-weight: 600;
    border-bottom: 0.01rem solid var(--q-gb-bd-c-19);

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    span {
      &:nth-child(1){
        display: inline-block;
        height: 0.12rem;
        width: 0.02rem;
        background-color: #179CFF;
      }
      &:nth-child(2){
        padding-left: 0.06rem;
      }
    }
  }

  .team-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 0.05rem;
    font-size: 0.12rem;
    height: 0.34rem;
    line-height: 0.34rem;
    text-align: center;
    border-bottom: 0.01rem solid var(--q-gb-bd-c-19);


    > div {
      font-size: 0.12rem;
      font-weight: 400;
      color: #303442;
    }

    &:last-child {
      border-bottom: unset;
    }

    .col1 {
      font-weight: 500;
      text-align: right;
      padding-right: 0.145rem;
    }

    .col2 {
      font-weight: 500;
    }
  }
}
</style>
