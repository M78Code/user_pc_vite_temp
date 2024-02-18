<template>
  <div class="header_select">
    <div
      v-for="(item, index) in rule_headle_info"
      :key="item.id"
      @click="select_index(index)"
      :class="{ fous: tab_index == index }"
    >
      {{ item.name }}
    </div>

    <div
      v-for="(item, index) in announcement_headle_info"
      :key="item.id"
      @click="announcement_index(index)"
      :class="{ fous: list_index == index }"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  rule_headle_info: {
    type: Array,
    default: () => [],
  },
  announcement_headle_info:{
    type: Array,
    default: () => [],
  }
});

let tab_index = ref(0);
let list_index = ref(0);

const select_index = (index) => {
  tab_index.value = index;
};
const announcement_index = (index) => {
  list_index.value = index;
};
</script>

<style scoped lang="scss">
.header_select {
  height: 44px;
  width: 100%;
  background: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 13px;
  color: #8a8986;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  div {
    flex-shrink: 0;
    padding: 0 15px;
    border-right: 0.5px solid #d9d9d9;
  }
  .fous {
    font-weight: 500;
    color: #1a1a1a;
     position: relative;
      &::after{
      content: '';
      background: linear-gradient(180deg, #FF7000 0%, rgba(255, 112, 0, 0) 100%);
      position: absolute;
      width: 8px;
      height: 8px;
      top: 26px;
      left: 40%;
      border-radius: 4px;
    }
    &::before{
      content: '';
      width: 4px;
      height: 4px;
      background: linear-gradient(180deg, #FF2B2B 0%, #FF7000 100%);
      position: absolute;
      right:  8px;
      top: 0px;
      border-radius: 50%;
  }
  }
}
</style>
