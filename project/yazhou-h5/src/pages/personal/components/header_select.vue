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
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  rule_headle_info: {
    type: Array,
    default: () => [],
  },
});

let tab_index = ref(0);

const select_index = (index) => {
  tab_index.value = index;
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
    color: var(--q-gb-t-c-5);
  }
}
</style>
