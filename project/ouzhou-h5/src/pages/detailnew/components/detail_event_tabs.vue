<template>
  <div class="match-detail-tabs">
    <div class="tabs-wrap">
      <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
        :class="[{ 'is-active': item.id === active }, 'tabs-item']">{{ item.label
        }}

        </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const tabList = ref([
  { label: 'Match', id: 1 },
  { label: 'Data', id: 2 },
  { label: 'Lineup', id: 3 },
  { label: 'Inteligence', id: 4 },
  { label: 'Odds', id: 5 },
]);
const emit = defineEmits(['change'])
// 事件执行函数

const active = ref(1)


const tabClick = (item) => {
  active.value = item.id
  emit('change', item)
}


onMounted(() => {

});
</script>

<style lang="scss" scoped>
.match-detail-tabs {
  height: 50px;
  background: #FFFFFF;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid #FF7000;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .tabs-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 16px;
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
    color: #1A1A1A;
    cursor: pointer;

  }

  .is-active {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-transform: capitalize;
    // color: #FF7000;
    background: #FF7000;
    color: #fff;
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
      background: #FF7000;
      position: fixed;
      width: 100vw;
    }
  }
}
</style>
