<template>
  <div class="tabs-wrapper">
    <div
      class="item1"
      :class="{
        active1: tab.code === value,
      }"
      v-for="(tab, i) in tabs"
      :key="tab.code"
      @click.stop="handle_item_click(tab, i)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "tabs",
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {};
  },
  methods: {
    handle_item_click(tab, index) {
      this.$emit("click", { tab, index });
    },
  },
};
</script>

<style scoped lang="scss">
.tabs-wrapper {
  display: flex;
  align-items: center;
  border-radius: 30px;
  color: var(--qq--list-replay-number-text-color);
  border: 0.5px solid var(--qq--yb-border-color7);
  background: var(--qq--bg-replay-tab);
  overflow: hidden;
  width: auto;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  .item1 {
    font-size: 12px;
    z-index: 1;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    // width: 50px;
    // height: 20px;
    padding: 2px 10px;
    // border: 0.5px solid var(--qq--yb-border-color7);
    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: "";
      // border: 0.5px solid var(--qq--yb-border-color7);
      border-right: none;
      border-left: none;
    }
    &:first-child {
      &:after {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        border-right: 0.5px solid var(--qq--yb-border-color7);
      }
    }
    &:last-child {
      &:after {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        border-left: 0.5px solid var(--qq--yb-border-color7);
        overflow: hidden;
      }
    }
    &:nth-child(2) {
      border-right: 0.5px solid var(--qq--yb-border-color7);
    }
    &.active1 {
      // color: var(--qq--list-replay-number-text-color);
      color: #fff;
      overflow: hidden;
      background: var(--qq--theme-bg-results-search-btn);
      &:after {
        // border: 1px solid var(--qq--video-history-btn-border-color);
      }
      & + .item1 {
        &:after {
          border-left: none;
        }
      }
    }
  }
}
</style>