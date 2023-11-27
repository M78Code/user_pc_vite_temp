<!--
* @Description: 15分 玩法
-->

<template>
  <div class="time-play-page">
    <section>
      <div class="item" v-for="item in time_events" :key="item.mid">
        <TimeEventEvents :item="item" />
      </div>
    </section>
  </div>
</template>
<script setup>
import TimeEventEvents from './time-events-item.vue'

const props = defineProps({
  time_events: {
    type: Array,
    default: () => []
  }
})

</script>

<style scoped lang="scss">
.time-play-page{
  :deep(section) {
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
        //color: #FF7000;
        color: var(--q-gb-t-c-1);
        font-weight: 500;
        padding: 0 12px;
        height: 21px;
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
        color: var(--q-gb-t-c-4);
        > div {
          height: 21px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      :deep(.score-list) {
         .odd-item {
          height: 39px;
          line-height: 39px;
         }
      }
    }
  }
}
</style>
