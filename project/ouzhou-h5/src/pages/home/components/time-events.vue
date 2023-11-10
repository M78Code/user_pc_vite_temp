<!--
* @Author: Dolphin
* @Description: 15分 玩法
-->

<template>
  <div class="time_play_page">
    <header>15 Mins</header>
    <section>
      <div class="item" v-for="item in time_events" :key="item.mid">
        <!-- 标题 -->
        <div class="title">
          <!-- <sport_icon size="14" :status="true" :sport_id="item.icon" /> -->
          <span class="span">{{ item.title }}</span>
        </div>
        <!-- 赛事名称 -->
        <div class="game-name">
          <div>{{ item.mhn }}</div>
          <div>{{ item.man}}</div>
        </div>
        <ScoreList :match_info="item" :score_length="3" height="39" />
      </div>
    </section>
  </div>
</template>

<script setup>
// import sport_icon from "src/project-ouzhou/components/common/sport_icon.vue"
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';
const props = defineProps({
  time_events: {
    type: Array,
    default: () => []
  }
})

</script>

<style scoped lang="scss">
.time_play_page{
  header {
    height: 47px;
    line-height: 55px;
    padding: 0 15px;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    background: #E2E2E2;
  }
  section {
    height: 126px;
    padding: 8px 0 2px;
    overflow: hidden;
    display: flex;
    overflow-x: auto;
    background: linear-gradient(272.18deg, #FFF1E6 0%, #FFFFFF 100%);
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .item{
      width: 220px;
      overflow: hidden;
      flex-shrink: 0;
      padding: 0 5px 0 5px;
      position: relative;
      &::before{
        position: absolute;
        right: 0;
        top: 4px;
        content: "";
        width: 1px;
        height: 100px;
        background: #E2E2E2;
      }
      .title{
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #FF7000;
        font-weight: 500;
        padding: 0 12px;
        :deep(.q-icon){
          position: relative;
          top: 1px;
        }
        .span {
          position: relative;
          top: 1px;
          padding-left: 5px;
        }
        > img {
          width: 12px;
          height: 12px;
        }
      }
      .game-name{
        margin: 5px 0px 5px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 400;
        color: #1A1A1A;
        > div {
          height: 21px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      :deep(.score-list) {
         > span {
          height: 39px;
          line-height: 39px;
         }
      }
    }
  }
}
</style>
