<!--
* @Author: Dolphin
* @Description: 15分 玩法
-->

<template>
  <div class="gameplay_page">
    <header>15 Mins</header>
    <section>
      <div class="item" v-for="item in timeEvents" :key="item.mid">
        <!-- 标题 -->
        <div class="title">
          <sport_icon size="14" :status="true" :sport_id="item.icon" />
          <span class="span">{{ item.title }}</span>
        </div>
        <!-- 赛事名称 -->
        <div class="game-name">
          <div>{{ item.mhn }}</div>
          <div>{{ item.man}}</div>
        </div>
        <div class="score f_family">
          <template v-if="item.oddsData.length > 0">
            <span v-for=" s in item.oddsData" :key="s.ot" @click="show_betting({payload:item,ol:s},active_score === `${item.id}${s.oid}`)" :class="{active: active_score === `${item.id}${s.oid}` }">
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
import sport_icon from "src/project-ouzhou/components/common/sport_icon.vue"
import { storage_bet_info } from 'src/public/utils/bet/bet_info.js'
import EMITTER from  "src/global/mitt.js"
const props = defineProps({
  timeEvents: {
    type: Array,
    default: () => []
  }
})
onMounted(() => {
  EMITTER.on("clear_score_active", () => {
    clear_score_active()
  })
})
const active_score = ref('')

const show_betting = (payload,score) => {
  // 锁盘状态return
  if (payload.ol.os !== 1) return
  // 清空上次选中
  EMITTER.emit("clear_score_active")
  // 相同投注项隐藏投注
  if(score){
    EMITTER.emit("show_bet_dialog", false)
    active_score.value = ''
    return
  }
  active_score.value = `${payload.id}${payload.ol.oid}`
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
.gameplay_page{
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
    padding: 11px 0 0;
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
        height: 94px;
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
        margin: 7px 0px 0px;
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
      .score{
        position: relative;
        top: 4px;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        > span.active{
          color: #fff;
          background: #FF7000;
          border-radius: 2px;
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
  }
}
</style>
