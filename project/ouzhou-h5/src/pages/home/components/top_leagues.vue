<!--
* @Author: Dolphin
* @Description: 顶级赛事 -- 国家
-->

<template>
  <div class="top_leagues_page">
    <collapse v-for="item, index in leaguesInfo" :key="index" :title="item.national" v-model="item.visible">
      <!-- 图片 -->
      <template v-slot:title_icon>
        <img class="national_icon" :src="item.nationalIcon" alt="">
      </template>
      <!-- 右侧 -->
      <template v-slot:title_right>
        <span v-show="!item.visible">{{ item.children.length }}</span>
      </template>
      <template v-slot:content>
        <div class="game" v-for="game, index in item.children" :key="index">
          <span> <img src="~assets/images/top_events/collect.png" alt=""> {{ game.title }} </span>
          <span>{{ game.value }}</span>
        </div>
      </template> 
    </collapse>
  </div>
</template>
 
<script setup>
import collapse from "src/project-ouzhou/components/collapse/index.vue"
const props = defineProps({
  leaguesInfo: {
    type: Array,
    default: () => [],
    required: true
  }
})

</script>
 
<style scoped lang="scss">
.top_leagues_page{
  background: #fff;
  :deep(.collapse_page){
    &:not(:last-child){
      border-bottom: 10px solid #F1F1F1;
    }
    .title{
      height: 50px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #FF7000;
      .national_icon{
        width: 24px;
        height: 15px;
        margin-right: 10px;
      }
    }
    .game{
      height: 50px;
      display: flex;
      font-weight: 400;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px 0 15px;
      border-bottom: 1px solid #eee;
      > span {
        font-size: 14px;
        display: flex;
        align-items: center;
        > img {
          width: 13px;
          height: 12px;
          margin-right: 8px;
        }
      }
      > span:last-child{
        font-weight: 500;
      }
    }
  }
}

</style>