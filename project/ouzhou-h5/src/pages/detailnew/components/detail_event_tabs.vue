<template>
  <div class="match-detail-tabs component detail-event-tabs">
    <div class="tabs-wrap">
      <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
            class="tabs-item"
            :class="[{ 'is-active': item.id === active }]">
          {{ item.label }}
        </span>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
const tabList = ref([
  { label: i18n_t('analysis_football_matches.analysis_information'), id: 6, subassembly: 'Information' },       // 资讯
  { label: i18n_t('analysis_football_matches.match') , id: 1, subassembly: 'Match' },     // 赛况
  { label: i18n_t('analysis_football_matches.analysis_data'), id: 2, subassembly: 'Figures' },      // 数据
  { label: i18n_t('analysis_football_matches.line_up'), id: 3, subassembly: 'Lineup' },        // 阵容
  { label: i18n_t('analysis_football_matches.intelligence'), id: 4, subassembly: 'Intelligence' },       // 情报
  { label: i18n_t('analysis_football_matches.Odds'), id: 5, subassembly: 'Odds' },       // 赔率
]);

const emit = defineEmits(['change'])

// 事件执行函数
const active = ref(1)

const tabClick = (item) => {
  active.value = item.id
  emit('change', item)
}
onMounted(()=>{
    tabClick(tabList.value[1])
})
</script>

<style lang="scss" scoped>
.match-detail-tabs {
  height: 50px;
  background-color: var(--q-gb-bg-c-2);
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid var(--q-gb-bd-c-1);
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .tabs-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 16px;
    width:100%;
  }

  .tabs-item {
    margin-right: 10px;
     display: block;
    //  min-width: 50px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    width: auto;
    text-transform: capitalize;
    color: var(--q-gb-t-c-4);
    cursor: pointer;
    flex:1;
    text-align:center;
  }

  .is-active {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-transform: capitalize;
    // color: #FF7000;
    //background: #FF7000;
    background-color: var(--q-gb-bg-c-1);
    //color: #fff;
    color: var(--q-gb-t-c-2); 
    position: relative;
    border-radius: 15px;
    padding: 4px 7px;
    // &::before{
    //   content:'';
    //   position: absolute;
    //   bottom: -14px;
    //   left: 5%;
    //   right:5%;
    //   width:90%;
    //   height: 3px;
    //   background: #FF7000;
    // }
    .match-detail-line {
      height: 1px;
      //background: #FF7000;
      background-color: var(--q-gb-bg-c-1);
      position: fixed;
      width: 100vw;
    }
  }
}
</style>
