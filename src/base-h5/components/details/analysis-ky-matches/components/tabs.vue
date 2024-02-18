<template>
  <div class="tabs-wrapper hairline-border">
    <div
      class="item hairline-border"
      :class="{
        'active': i == tab_index,
        'no-border-r': i == tab_index - 1,
      }"
      v-for="(tab, i) in tabs"
      :key="i"
      @click="handle_item_click(tab, i)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
  let tab_index = ref(0)
  let props =defineProps({
    tabs: {
      type: Array,
      default: () => ([])
    },
    isChange: {
      type: Boolean,
      default: false
    }
  })
  // TODO: $emit 后续修改调整
  const handle_item_click = (tab, index) => {
      if(!isChange){
        tab_index.value = index
      }
      emit('click', {tab, index})
    }
    // TODO: 暂时注释
  const changeTabIndex = (index) => {
      tab_index.value = index
    }
</script>

<style scoped lang="scss">
.tabs-wrapper {
  display: flex;
  align-items: center;
  height: .2rem;
  color: var(--q-gb-t-c-18);
  background: var(--q-color-com-bg-color-32);
  backdrop-filter: blur(2px);
  &.hairline-border {
    &::after {
      border-color: var(--q-color-com-border-color-22) !important;
    }
  }
  .item {
    height: 0.2rem;
    line-height: .2rem;
    padding: 0 .1rem;
    font-size: .12rem;
    z-index: 1;
    &.hairline-border {
      &::after {
        border-radius: 0;
        border: 0 !important;
        border-right: 1px solid var(--q-color-com-border-color-22) !important;
      }
      &:first-child.active {
        &::after {
          border-top-left-radius: .16rem;
          border-bottom-left-radius: .16rem;
        }
      }
      &:last-child.active {
        &::after {
          border-top-right-radius: .16rem;
          border-bottom-right-radius: .16rem;
        }
      }
    }
    &.active {
      font-weight: bold;
      &.hairline-border {
        &::after {
          border: 1px solid var(--q-match-fs-color-135) !important;
        }
      }
    }
    &:last-child {
      &.hairline-border:not(.active) {
        &::after {
          border: 0 !important;
        }
      }
    }
    &.no-border-r::after {
      border-right: 0 !important;
    }
  }
}

</style>