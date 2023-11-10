<!--
* @Author: Dolphin
* @Description: 特色比赛
-->

<template>
  <div class="matches_page">
    <div class="item" v-for="item, index in featured_matches" :key="index">
      <!-- 标题 -->
      <div class="title">
        <span class="name">{{ item.tn }}</span>
        <!-- <span class="time"> {{list.course}} {{ list.mstValue }} <span>{{ item.mstValueTime }}</span> </span> -->
      </div>
      <!-- 赛事名称 -->
      <div class="game-name">
        <div> <span>{{ item.mhn }}</span> <span class="span">{{ item.home_score }}</span> </div>
        <div> <span>{{ item.man }}</span> <span class="span">{{ item.away_score }}</span> </div>
      </div>
      <!-- 比分 -->
      <ScoreList :match_info="item" :score_length="3" height="39px" />
    </div>
  </div>
</template>
 
<script setup>
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';

const props = defineProps({
  featured_matches: {
    type: Array,
    default: () => []
  }
})

</script>
 
<style scoped lang="scss">
.matches_page{
  height: 120px;
  overflow: hidden;
  display: flex;
  overflow-x: auto;
  padding: 0 10px 0 15px;
  background: #E2E2E2;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .item{
    width: 240px;
    overflow: hidden;
    flex-shrink: 0;
    padding-top: 3px;
    background: #fff;
    margin-right: 10px;
    border-radius: 3px;
    background-repeat: no-repeat;
    background-size: 90px;
    background-position: top right; 
    
    .title{
      display: flex;
      padding: 3px 10px 0;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #8A8986;
      .name{
        width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time{
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      > span {
        > span {
          color: #1A1A1A;
          font-weight: 500;
        }
      }
    }
    .game-name{
      height: 48px;
      padding: 0 10px;
      color: #1A1A1A;
      margin-bottom: 4px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      > div {
        display: flex;
        font-size: 14px;
        font-weight: 400;
        justify-content: space-between;
        > span:first-child{
          width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .span{
          font-weight: 500;
        }
      }
    }
    .score{
      position: relative;
      top: 4px;
      font-size: 15px;
      display: flex;
      padding: 0px 5px 0;
      justify-content: space-between;
      > span.active{
        color: #fff;
        border-radius: 2px;
        background: #FF7000;
        > span > span {
          color: #fff;
        }
      }
      > span {
        padding: 7px 3px;
        flex: 1;
        flex-shrink: 0;
        text-align: center;
        color: #8A8986;
        border-radius: 3px;
        > span {
          > span {
            color: #FF7000;
            font-weight: 500;
          }
        }
      }
      .lock{
        width: 16px;
        height: 16px;
        position: relative;
        top: 2px;
      }
    }
  }
  > .item:last-child{
    margin-right: 0;
  }
}
</style>