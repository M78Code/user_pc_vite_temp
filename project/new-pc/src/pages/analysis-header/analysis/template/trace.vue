<template>
  <div>
    <div class="event-item  relative-position" v-for="(item,index) in event_data" :key="index">
      <div class="time">
        <template v-if="match.csid=='1'">{{format_time(item.secondsFromStart)}}</template>
        <template v-else>{{formatTime(item.createTime, 'MM\'ss\"')}}</template>
      </div>
      <div class="sign relative-position" :class="'team-'+item.team"></div>
      <div class="info">
        <!-- 足球 -->
        <template v-if="match.csid=='1'">
          <img :src="`${$g_image_preffix}/image/yabo/svg/analysis-${item.icon}.svg`" alt="" class="sign-icon" v-if="item.icon" width="14" style="vertical-align: middle">
        </template>
        <!-- 篮球 -->
        <template v-else>
          <span>{{item.scores}}</span>
        </template>
        <span :class="{'status-default': item.team ==3}">{{item.cnText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import time_format from 'src/public/mixins/common/time_format'
export default {
  mixins:[time_format],
  data() {
    return {
      
    }
  },
  props:{
    event_data: Array,
    match: Object
  },
  methods: {
    // 格式化时间
    format_time(seconds){
      let m = parseInt(seconds/60).toString().padStart(2, 0)
      let s = (seconds%60).toString().padStart(2, 0)
      return `${m}'${s}"`
    }
  }
};
</script>

<style lang="scss" scoped>
.event-item {
  color: var(--qq--analysis-text-color-2);
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid var(--qq--analysis-bd-color-2);
  border-left: 1px solid var(--qq--analysis-bd-color-2);
  border-right: 1px solid var(--qq--analysis-bd-color-2);
  &:last-child {
    border-bottom: 1px solid var(--qq--analysis-bd-color-2);
    border-radius: 0 0 8px 8px;
  }
  .time {
    width: 58px;
    text-align: center;
  }
  .sign {
    width: 7px;
    height: 7px;
    border-radius: 7px;
    background: var(--qq--analysis-bg-color-16);
    &.team-1 {
      background: var(--qq--analysis-bg-color-13);
    }
    &.team-2 {
      background: var(--qq--analysis-bg-color-12);
    }
    &:before {
      content: "";
      position: absolute;
      bottom: 7px;
      left: 3px;
      height: 17px;
      width: 1px;
      background: var(--qq--analysis-bg-color-16);
    }
    &:after {
      content: "";
      position: absolute;
      top: 7px;
      left: 3px;
      height: 17px;
      width: 1px;
      background: var(--qq--analysis-bg-color-16);
    }
  }
  .info {
    margin-left: 8px;
    & > span {
      margin-right: 8px;
    }
    .sign-icon {
      margin-right: 8px;
    }
    .status-default {
      color: var(--qq--analysis-text-color-4);
    }
  }
  &:first-child {
    .sign:before {
      display: none;
    }
  }
  &:last-child {
    .sign:after {
      display: none;
    }
  }
}
</style>
