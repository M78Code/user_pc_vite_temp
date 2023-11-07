<template>
    <div class="league-rank">
        <template v-if="list_data.length > 0" >
            <div class="title"><span>{{$root.$t('vsport.rank')}}</span></div>
            <div class="header" ref="league_rank_header">
                <div class="col1">{{$root.$t('vsport.gtab9')}}</div>
                <div class="col2">{{$root.$t('vsport.gtab1')}}</div>
                <div class="col3">{{$root.$t('vsport.gtab2')}}</div>
                <div class="col4">{{$root.$t('vsport.gtab3')}}</div>
                <div class="col5">{{$root.$t('vsport.gtab7')}}</div>
            </div>
        </template>
        <div
            v-for="(item,key) in list_data"
            :key="key"
            class="match-item"
            :class="{three:item.ranking < 4,'din-medium':item.ranking < 4}"
            >
        <div class="col1">
            <div class="number" :class="'number'+item.ranking">{{item.ranking}}</div>
        </div>
        <div class="col2 relative-position">
            <div class="ellipsis yb-absolute-fit">{{item.virtualTeamName}}</div>
        </div>
        <div class="col3">{{item.totalCount}}</div>
        <div class="col4">{{item.win}}/{{item.draw}}/{{item.lost}}</div>
        <div class="col5">{{item.points}}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, defineProps } from 'vue';

const props = defineProps({
  list_data: {
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
});
</script>
<style lang="scss" scoped>
.title {
  height: 40px;
  line-height: 40px;
  padding-left: 35px;
  position: unset;
  font-family: PingFangSC-Medium;
  font-size: 13px;
  span {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 11px;
      height: 14px;
      position: absolute;
      top: 3px;
      left: -21px;
    }
  }
}
.col1 {
  width: 20%;
  min-width: 55px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col2 {
  flex: 1;
  height: 100%;
  text-align: left;
}
.col3 {
  width: 11%;
  min-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col4 {
  width: 18%;
  min-width: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col5 {
  width: 11%;
  min-width: 83px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*  头部 */
.header {
  height: 32px;
  display: flex;
  text-align: center;
  line-height: 32px;
  // padding: 0 10px;
  margin-bottom: 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
}

/*  赛事 */
.match-item {
  display: flex;
  // padding-right: 10px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  &.three {
    font-size: 13px;
    .col2 {
      font-size: 14px;
    }
  }

  /*  赛事排名 */
  .number {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    text-align: center;
    line-height: 16px;
  }
  .col1 {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .col2 {
    font-size: 13px;
  }
  .col6 {
    font-size: 12px;
    letter-spacing: 4px;
  }
}
</style>
