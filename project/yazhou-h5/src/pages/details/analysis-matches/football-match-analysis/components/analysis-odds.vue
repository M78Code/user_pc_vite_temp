<!--
 * @Author:
 * @Date:
 * @Description: 详情页足球赛事分析赔率页面
-->
<template>
  <div class="analysis-odds">
    <div class="heade-wrapper">
      <div class="heade">
        <span v-for="(item,i) in tab_list" :key="i" :class="{'is-active' : tabIndex == i}" @click="radioButton(i)">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="content" :class="tabIndex == 1 && 'ouzhi'">
      <div class="tittle row align_items">
        <template v-if="tabIndex != 1">
          <span class="t1">{{ $root.$t('analysis_football_matches.company') }}</span>
          <span class="t2">{{  tabIndex == 2 ? $root.$t('analysis_football_matches.big') : $root.$t('analysis_football_matches.Main_win') }}</span>
          <span class="t3">{{$root.$t('analysis_football_matches.handicap') }}</span>
          <span class="t4">{{ tabIndex == 2 ? $root.$t('analysis_football_matches.small') : $root.$t('analysis_football_matches.away_win') }}</span>
        </template>
        <template v-else>
          <div class="t1 row items-center justify-between">
            <div class="ellipsis" style="width:0.5rem">{{ $root.$t('analysis_football_matches.company') }}</div>
            <div class="yb_ml6" style="visibility: hidden">
              <span>{{ $root.$t('analysis_football_matches.Initial_offer') }}</span>
              <span>1</span>
            </div>
          </div>
          <i class="t2">{{ $root.$t('analysis_football_matches.home_win1') }}</i>
          <i class="t3">{{ $root.$t('analysis_football_matches.flat') }}</i>
          <i class="t4">{{ $root.$t('analysis_football_matches.away_win') }}</i>
          <i class="t4">{{ $root.$t('analysis_football_matches.Main_win_rate') }}</i>
          <i class="t4">{{ $root.$t('analysis_football_matches.Customer_win_rate') }}</i>
          <i class="t4">{{ $root.$t('analysis_football_matches.Return_rate') }}</i>
        </template>
      </div>
      <div class="sliding" v-if="data_list.length">
        <div class="detail row" v-for="(item,index) in data_list" :key="index">
          <div class="t1 row items-center justify-between">
            <div class="ellipsis" style="width:0.5rem">{{item.bookName}}</div>
            <div class="yb_ml6">
              <span>{{ $root.$t('analysis_football_matches.Initial_offer') }}</span>
              <span>{{ $root.$t('analysis_football_matches.immediate') }}</span>
            </div>
          </div>
          <div class="t2 column justify-center">
            <span>{{item.handicapOddsDTOList[0].value0}}</span>
            <span :class="{'red':item.handicapOddsDTOList[1].directions0 == 1,'green':item.handicapOddsDTOList[1].directions0 == -1}">
              {{item.handicapOddsDTOList[1].value0}}
              <i class="odd yb_ml4"></i>
            </span>
          </div>
          <div class="t3 column justify-center">
            <span>{{item.handicapOddsDTOList[0].handicapVal}}</span>
            <span :class="{'red':item.handicapOddsDTOList[1].directions.handicapVal == 1,'green':item.handicapOddsDTOList[1].directions.handicapVal == -1}">
              {{item.handicapOddsDTOList[1].handicapVal}}
              <i class="odd yb_ml4"></i>
            </span>
          </div>
          <div class="t4 column justify-center">
            <span>{{item.handicapOddsDTOList[0]}}</span>
            <span :class="{'red':item.handicapOddsDTOList[1].directions == 1,'green':item.handicapOddsDTOList[1].directions == -1}">
              {{item.handicapOddsDTOList[1]}}
              <i class="odd yb_ml4"></i>
            </span>
          </div>
          <template v-if="tabIndex == 1">
            <div class="t4 column justify-center">
              <span>{{item.handicapOddsDTOList[0].value0WinRate}}%</span>
              <span
                :class="{'red':item.handicapOddsDTOList[1].directions0WinRate == 1,'green':item.handicapOddsDTOList[1].directions0WinRate == -1}">{{item.handicapOddsDTOList[1].value0WinRate}}%</span>
            </div>
            <div class="t4 column justify-center">
              <span>{{item.handicapOddsDTOList[0].value0WinRate}}%</span>
              <span
                :class="{'red':item.handicapOddsDTOList[1].directionsWinRate == 1,'green':item.handicapOddsDTOList[1].directionsWinRate == -1}">{{item.handicapOddsDTOList[1].value0WinRate}}%</span>
            </div>
            <div class="t4 column justify-center">
              <span>{{item.handicapOddsDTOList[0].returnRate}}%</span>
              <span
                :class="{'red':item.handicapOddsDTOList[1].directions.returnRate == 1,'green':item.handicapOddsDTOList[1].directions.returnRate == -1}">{{item.handicapOddsDTOList[1].returnRate}}%</span>
            </div>

          </template>
        </div>
      </div>
      <div v-if="!data_list.length && is_done" class="yb_py18 text-center no-list">{{ $root.$t('common.no_data') }}</div>
    </div>

  </div>
</template>

<script setup>
import { defineComponent, ref, nextTick, onUnmounted } from 'vue'
import { api_result } from "src/project/api";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { useRoute } from 'vue-router'

// TODO: 后续修改调整
// import { mapGetters } from "vuex";
    // 国际化后续修改调整
    let tab_list = ref([
        { name: $root.$t('footer_menu.rangqiu') },
        { name: $root.$t('analysis_football_matches.European_Finger') },
        { name: $root.$t('analysis_football_matches.size') },
      ])
    let tabIndex = ref(0)
    //详细赔率数据
    let data_list= ref([])
    //数据加载完成
    let is_done = ref(false)

    // 添加监听 赛事分析刷新事件 TODO: 后续修改调整 $root emit
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)

    get_list()

    /**
     *@description 按钮切换
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const radioButton = (index) => {
      if(tabIndex == index) return
      tabIndex = index
      data_list = []
      get_list()
    }
    const get_list = async () => {
      try {
        is_done = false
        let parameter = {
          standardMatchId: match_id,
          parentMenuId: 5,  //父菜单类型:(2数据;3阵容4情报;5赔率)
          sonMenuId: tabIndex + 1
        }
        let { code, data } = await api_result.get_match_analysise_data(parameter)
        if (code == 200 && data && data.sThirdMatchHistoryOddsDTOList.length) {
          data_list = data.sThirdMatchHistoryOddsDTOList
        }
        is_done = true
      } catch (error) {
        console.error(error);
      }
    }
    // 刷新 当前赛事分析信息
    const refresh_match_analysis = () => {
      const tabIndex = tabIndex
      tabIndex = -1

      nextTick(() => {
        radio_button(tabIndex)
      })
    }

    const search_list_high = computed(() => {
      let rem_1 = window.innerWidth * 100 / 375;
      return {height : window.innerHeight - rem_1 - 90 + 'px'}
    })
    // 赛事id
    const match_id = computed(() => {
      // get_detail_data.mid  后续修改调整
      return route.params.mid || get_detail_data.mid
    })
    onUnmounted(() => {
      // 移除监听 赛事分析刷新事件 TODO: $root emit 后续修改调整
      $root.$off(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)
      // 国际化后续修改调整
     tab_list = ref([
        { name: $root.$t('footer_menu.rangqiu') },
        { name: $root.$t('analysis_football_matches.European_Finger') },
        { name: $root.$t('analysis_football_matches.size') },
      ])
     tabIndex = ref(0)
    //详细赔率数据
     data_list = ref([])
    //数据加载完成
     is_done = ref(false)
    })
  // computed: {
    //  TODO: 后续修改调整
  //   ...mapGetters(['get_goto_detail_matchid', 'get_detail_data']),
  // },

</script>

<style lang="scss" scoped>
.analysis-odds {

  height: calc(100% - 0.5rem);

  .heade-wrapper {
    width: 100%;
    height: auto;
    margin: 0 auto;

    position: sticky;
    top: 1.21rem;
    padding: 0.15rem 0.48rem;
    z-index: 100;

    .heade {
      position: relative;

      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.08rem;

      &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid var(--q-color-border-color-25);
        border-radius: 0.16rem;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }

      > span {
        height: 0.3rem;
        line-height: 0.3rem;
        flex: 1;
        letter-spacing: 0;
        text-align: center;
        font-size: 0.14rem;
        border-radius: 0.08rem;

        &:nth-child(2) {
          position: relative;

          &:before {
            content: '';
            width: 0.01rem;
            height: 0.14rem;
            position: absolute;
            left: 0;
            top: 0.08rem;
          }

          &:after {
            content: '';
            width: 0.01rem;
            height: 0.14rem;
            position: absolute;
            right: 0;
            top: 0.08rem;
          }
        }

        &.is-active {
          height: 0.29rem;

          &:nth-child(2) {
            &:before, &:after {
              display: none;
            }
          }

          border-radius: 0.08rem;
        }
      }
    }
  }

  .content {
    .tittle {
      position: sticky;
      top: 1.81rem;
      padding: 0 0.05rem 0.1rem 0.2rem;
      z-index: 80;

      i {
        font-style: normal;
        flex: 1;
      }
    }

    .detail {
      height: 0.52rem;

      //padding-left: 0.2rem;
      padding: 0 0.05rem 0 0.2rem;

      span {
        display: block;
      }
    }

    .t1 {
      margin-right: auto;
    }

    .t2, .t3 {
      width: 0.86rem;
    }

    .t4 {
      width: 0.5rem;
      margin-left: .02rem;
    }

    &.ouzhi {
      .t2, .t3, .t4 {
        flex: 1;
      }

      .detail {
        .t1 {
          margin-right: 0.08rem;
        }
      }
    }
  }

  .odd {
    display: inline-block;
    width: 0.06rem;
    height: 0.08rem;
    margin-left: 0;
  }

  .red {

    i {

      -webkit-clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
      clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
    }
  }

  .green {

    i {

      -webkit-clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
      clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
    }
  }
}

.sliding {

  overflow-x: hidden;
  overflow-y: auto;
}
</style>
