<!--
* @Author: Dolphin
* @Description: 特色比赛
-->

<template>
  <div class="matches_page">
    <header>{{ matchesInfo.title }}</header>
    <section>
      <div class="item" v-for="item, index in matchesInfo.children" :key="index" :style="{backgroundImage: `url(${item.image})`}">
        <!-- 标题 -->
        <div class="title">
          <span class="name">{{ item.tn }}</span>
          <span class="time"> {{list.course}} {{ list.mstValue }} <span>{{ item.mstValueTime }}</span> </span>
        </div>
        <!-- 赛事名称 -->
        <div class="game-name">
          <div> <span>{{ item.mhn }}</span> <span class="span">{{ item.mscValue && item.mscValue[0] || 0 }}</span> </div>
          <div> <span>{{ item.man }}</span> <span class="span">{{ item.mscValue && item.mscValue[1] || 0 }}</span> </div>
        </div>
        <!-- 比分 -->
        <div class="score f_family">
          <template v-if="item.panel.length > 0">
            <span v-for="s, sIndex in item.panel" :key="sIndex" @click="show_betting({payload:item,ol:s},active_score === s.oid)" :class="{active: active_score === s.oid }"> 
              <span v-if="s.os === 1">{{ s.ot }} <span> {{ s.ov }} </span></span>
              <img v-else class="lock" src="~assets/images/top_events/lock.png" alt="">
            </span>
          </template>
          <template v-else>
            <span v-for="s in 3" :key="s"> <img class="lock" src="~assets/images/top_events/lock.png" alt=""> </span>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storage_bet_info } from 'src/public/utils/bet/bet_info.js'
import EMITTER from  "src/global/mitt.js"

const props = defineProps({
  matchesInfo: {
    type: Object,
    default: () => ({
      title: '',
      children: []
    })
  }
})
onMounted(() => {
  EMITTER.on("clear_score_active", () => {
    clear_score_active()
  })
})
const active_score = ref('')
const show_betting = (payload,score) =>{
  if (payload.ol.os !== 1) return
  // 清空上次选中
  EMITTER.emit("clear_score_active")
   // 相同投注项隐藏投注
   if(score){
    EMITTER.emit("show_bet_dialog", false)
    active_score.value = ''
    return
  }
  active_score.value = payload.ol.oid
  storage_bet_info(payload)
  EMITTER.emit("show_bet_dialog", true)
}
const clear_score_active = () => {
  active_score.value = ''
}
onUnmounted(() => {
  EMITTER.off('clear_score_active')
})
</script>
 
<style scoped lang="scss">
.matches_page{
  header {
    height: 47px;
    padding: 0 15px;
    line-height: 55px;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    background: #E2E2E2;
  }
  section {
    height: 117px;
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
        padding-bottom: 5px;
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
}
</style>