<!--
 * @Author: ledron
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育 小组赛页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="group-rank">
    <!-- header -->
    <div class="header">
      <div class="col1"></div>
      <div class="col2">{{ $t('virtual_sports.team') }}</div>
      <div class="col3">{{ $t('virtual_sports.game') }}</div>
      <div class="col4">{{ $t('virtual_sports.win_tie_loss') }}</div>
      <div class="col5">{{ $t('virtual_sports.advance') }}</div>
      <div class="col6">{{ $t('virtual_sports.lose') }}</div>
      <div class="col7">{{ $t('virtual_sports.goal_difference') }}</div>
      <div class="col8">{{ $t('virtual_sports.integral') }}</div>
    </div>
    <!-- 小组 -->
    <div class="group-item hairline-border" v-for="(detail_list,index) in group_stage_list" :key="index" v-show="!no_data">
      <div class="group-name">{{get_lang == 'vi' ? (i18n_t('virtual_sports.group')+ '  ' + detail_list.groupId) : (detail_list.groupId+ '  ' +$t('virtual_sports.group'))}}</div>
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
import { api_virtual } from "src/api/index.js";
import noData from "src/base-h5/components/common/no-data.vue";
import 'src/base-h5/css/pages/virtual-group-matches.scss'

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "group_matches",
  components: {
    "no-data": noData
  },
  props:{
    tid: {
      type: Number|String,
      default: null,
      require: true
    },
    current_match: {
      type: Object,
      default: () => ({})
    }
  },
  
  setup(props, evnet) {
    const state = reactive({
      group_stage_list: [],
      no_data: false
    });
    // #TODO VUEX 
    // computed: {
    //   ...mapGetters(['get_lang']),
    // },
    const get_lang = computed(() => {
      return ""
    })
    watch(
      () => props.tid,
      () => {
        get_list();
      }
    );
    const get_list = async() => {
      try {
        let {code , data} = await api_v_sports.get_virtual_sport_XZ_team_ranking({tid: tid})
        if(code == 200) {
          if(data && data.length > 0){
            group_stage_list = data
          }else {
            no_data = true
          }
        }
      } catch (error) {
        no_data = true
        console.error(error);
      }
    };
    onUnmounted(() => {
      // #TODO $data 
      // for (const key in $data) {
      //   $data[key] = null
      // }
    })
    return {
      ...toRefs(state),
      get_list,
      get_lang,
    }
  }
})
</script>

<style lang="scss" scoped>
.group-rank {
  .col1 {
    width: 0.4rem;
  }

  .col2 {
    width: 1rem;
    height: 100%;
    text-align: left;

    .ellipsis {
      width: 1rem;
    }
  }

  /*  3~8 总宽度220px */
  .col3 {
    width: 0.34rem;
  }

  .col4 {
    width: 0.58rem;
  }

  .col5 {
    width: 0.35rem;
  }

  .col6 {
    width: 0.24rem;
  }

  .col7 {
    width: 0.46rem;
  }

  .col8 {
    width: 0.34rem;
  }

  /*  头部 */
  .header {
    height: 0.32rem;

    display: flex;
    text-align: center;
    line-height: 0.32rem;
    padding-right: 0.05rem;

    > div {

      font-size: 0.12rem;

      &.col2 {
        width: 1.084rem;
      }
    }
  }

  .group-item {
    position: relative;

    margin-bottom: 0.08rem;
  }

  .group-name {
    height: 0.42rem;
    line-height: 0.42rem;
    padding-left: 0.15rem;
    font-size: 0.14rem;
  }

  .team-item {
    display: flex;
    align-items: center;
    padding-right: 0.05rem;
    font-size: 0.12rem;
    height: 0.34rem;
    line-height: 0.34rem;
    text-align: center;

    &:last-child {
      border-bottom: unset;
    }

    .col1 {
      font-size: 0.12rem;
      text-align: right;
      padding-right: 0.145rem;
    }

    .col2 {
      font-size: 0.14rem;
    }
  }
}
</style>
