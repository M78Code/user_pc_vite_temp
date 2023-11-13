<!--
 * @Author: Cable
 * @Date: 2020-09-04 15:08:18
 * @Description: 大视频比分数据-战队信息
-->
<template>
  <!-- 球队名 -->
  <div class="team-info column-between">
    <div class="text-wrap">
      <div class="point"></div>
      <match-date class="text" :match_props="{match:match_info}" />
    </div>
    <!-- 棒球 客队在上 -->
    <template v-if="match_info.csid == 3">
      <div class="text-wrap">
        <div class="point" :class="{active:match_info.mat == 'away'}"></div>
        <div class="text  relative-position">
          <div class="ellipsis" v-tooltip="{content:match_info.man,overflow:1}">{{match_info.man}}</div>
        </div>
      </div>
      <div class="text-wrap">
        <div class="point" :class="{active:match_info.mat == 'home'}"></div>
        <div class="text  relative-position">
          <div class="ellipsis" v-tooltip="{content:match_info.mhn,overflow:1}">{{match_info.mhn}}</div>
        </div>
      </div>
    </template>
    <!-- 其他球种  主队在上 -->
    <template v-else>
      <div class="text-wrap">
        <div class="point" :class="{active:match_info.mat == 'home'}"></div>
        <div class="text  relative-position">
          <div class="ellipsis" v-tooltip="{content:match_info.mhn,overflow:1}">{{match_info.mhn}}</div>
        </div>
      </div>
      <div class="text-wrap">
        <div class="point" :class="{active:match_info.mat == 'away'}"></div>
        <div class="text  relative-position">
          <div class="ellipsis" v-tooltip="{content:match_info.man,overflow:1}">{{match_info.man}}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import MatchDate from "src/public/components/match_process/match_process.vue";
export default {
  name:'TeamInfo',
  components:{
    MatchDate
  },
  props:{
    //赛事详情信息
    match_info:{
      type:Object,
      default:{}
    }
  }
}
</script>

<style lang="scss" scoped>
/* 战队信息 */
.team-info {
  flex: 1;
  .text-wrap {
    height: 18px;
    line-height: 18px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    /* 发球方 */
    .point {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .text {
      flex: 1;
      height: 100%;
      .ellipsis {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    ::v-deep .date-wrap {
      padding: 0;
    }
    ::v-deep .process-name {
      margin-right: 8px;
    }
  }
}
</style>