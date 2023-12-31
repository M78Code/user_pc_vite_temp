<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 足球进程
-->

<template>
  <div class="footbal-replay din-medium" :class="{active:get_vsport_params.mid == match.mid,first:match_index == 0,'soccer':match.csid == 1001 && vsport_ctr.status != 0 && vsport_ctr.info.isc == 1, 'footbal':match.csid == 1001,'basketball':match.csid == 1004}" @click="vsport_ctr.switch_footbal(match.mid)">
    <div class="yb-flex-center replay">
      <div class="number">{{match_index+1}}</div>
      <div class="name home col ellipsis">{{match.home_name}}</div>
      <div class="score" v-if="(match.csid == 1001 && vsport_ctr.status == 0) || (match.csid == 1004 && match.mmp == 'PREGAME' && vsport_ctr.status == 0)">VS</div>
      <div class="score size14" v-else>{{match.home}}&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;{{match.away}}</div>
      <div class="name away col ellipsis">{{match.away_name}}</div>
      <div class="right-col yb-flex-center">
        <!-- 篮球 -->
        <template v-if="vsport_ctr.info.csid == 1004">
          <!-- 赛前 -->
          <template v-if="vsport_ctr.info.mmp == 'PREGAME'">
            <div class="time" v-if="vsport_ctr.basketball_line_width == 100">60''</div>
            <div class="b-live" v-else-if="vsport_ctr.status != 0"></div>
          </template>
          <!-- 滚球 -->
          <template v-else>
            <div class="whistle" v-if="vsport_ctr.status == 1 && match.status == 2"></div>
            <div class="b-live" v-if="vsport_ctr.status == 1 && match.status == 1"></div>
            <div class="yb-icon-arrow" :class="{active:match.show_result}" v-if="vsport_ctr.status == 2"></div>
          </template>
        </template>
        <!-- 足球 -->
        <template v-else>
          <div class="yb-icon-arrow" :class="{active:match.show_result}" v-if="vsport_ctr.status == 2"></div>
          <div class="whistle" v-if="vsport_ctr.status == 1 && match.status == 2"></div>
          <div class="time" v-if="vsport_ctr.status == 1 && match.status == 1">{{match.show_time}}'</div>
        </template>
      </div>
    </div>
     <!-- 点球比分  开赛-->
    <div class="penalty yb-flex-center" v-if="vsport_ctr.info.csid == 1001 && vsport_ctr.status != 0 && vsport_ctr.info.isc == 1">
        <div class="number"></div>
        <!-- 图标 -->
      <div class="col icon-wrap"><icon-wapper class="icon" :name="`img:${img_grey_point}`" size="13px"   v-tooltip="{content:i18n_t('icon_tips.penalty_kick'),overflow:1}" /></div>
      <!-- 比分 -->
      <div class="score size14" >{{ match.status == 2 && match.penalty_score_home ?  `${match.penalty_score_home} : ${match.penalty_score_away}` :'-'}}</div>
      <div class="col"></div>
    </div>
    <!-- 赛果 -->
    <q-menu v-if="vsport_ctr.status == 2" content-class="m-footbal-result" :content-style="vsport_ctr.result_style" v-model="match.show_result">
      <q-scroll-area>
        <div class="result-item" v-for="(item,key) in match.result" :key="key">
          <div class="name ellipsis">{{item.playName}}</div>
          <div class="handicap-wrap" v-for="(ol,index) in item.ol" :key="index">
            <div class="value ellipsis">{{ol.on}}</div>
            <div class="odds">{{compute_value_by_cur_odd_type(ol.ov / 100000,'',item.hsw)}}</div>
          </div>
        </div>
      </q-scroll-area>
    </q-menu>
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters, mapActions } from "vuex"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
import { IconWapper } from 'src/components/icon'

export default defineComponent({
  name: "eliminationRank",
  components: {
    IconWapper,
  },
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object,
    // 赛事
    match: Object,
    // 赛事索引
    match_index: Number,
  },
  setup(props, evnet) {
    const component_data = reactive({
      img_grey_point :require('public/image/yabo/svg/grey-point.svg')
    });
    onMounted(() => {
      vsport_ctr.set_elimination_rank(true)
    });
    // ...mapGetters({
    //   // 获取右侧参数
    //   get_vsport_params: "get_vsport_params",
    // }),
    const get_vsport_params = computed(() => {
      return "";
    })
    // 监听赛事状态
    watch(
      () => vsport_ctr.status,
      (res) => {
        // 已完赛
        if(res == 2 && component_data.vsport_ctr.info.mmp != 'PREGAME'){
          component_data.vsport_ctr.set_match_result(component_data.match.mid,component_data.match_index)
        }
      },
      {
        immediate: true,
      }
    );
    // #TODO vuex 
    // methods:{
    //   ...mapActions({
    //     set_vsport_params_mid: "set_vsport_params_mid"
    //   }),
    // }
    const set_vsport_params_mid = () => {

    }
    return {
      ...toRefs(component_data),
      get_vsport_params,
      set_vsport_params_mid
    }
  }
})
</script>
<style lang="scss" scoped>
.footbal-replay {
  &.soccer{
     .number{
        line-height: 44px;
     }
     .replay {
       height: 30px;
     }
     .penalty {
        height: 22px;
        margin-right: 44px;
        .number{
          height: 100%;
        }
        .icon-wrap{
          display: flex;
          justify-content: flex-end;
        }
     }
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
  .replay{
      display: flex;
      height: 33px;
      align-items: center;
      cursor: pointer;
  }
  .number {
    width: 44px;
    height: 100%;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    font-family: DIN-Medium;
    font-weight: 500;
  }
  .name.home {
    text-align: right;
  }
  .score {
    width: 64px;
    text-align: center;
    &.size14 {
      size: 14px;
    }
  }
  .right-col {
    width: 44px;
    .yb-icon-arrow {
      transform: rotate(90deg);
      &.active {
        transform: rotate(270deg);
      }
    }
    .whistle {
      width: 16px;
      height: 16px;
      background-size: 100% 100%;
    }
    .time {
      font-size: 14px;
    }
    .b-live {
      width: 23px;
      height: 8px;
    }
  }
}
</style>
<style lang="scss">
/*  足球赛果 */
.m-footbal-result {
  width: 352px;
  padding: 3px 0;
  .q-scrollarea {
    width: 100%;
    height: 300px;
    max-height: 300px;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    .scroll {
      height: auto !important;
    }
    .q-scrollarea__thumb {
      opacity: 0.7;
      width: 6px;
      border-radius: 4px;
      right: 2px;
    }
    .absolute.full-width {
      position: relative;
    }
  }
  .result-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    .name {
      flex: 1;
      min-width: 68px;
      padding-left: 11px;
    }
    .handicap-wrap {
      display: flex;
      height: 22px;
      min-width: 68px;
      max-width: 170px;
      align-items: center;
      justify-content: flex-end;
      .value {
        text-align: right;
        padding-right: 5px;
      }
      .odds {
        min-width: 36px;
      }
    }
  }
}
</style>
