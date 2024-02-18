<template>
  <div class="tabs-wrapper">
    <div 
      class="item"
      :class="{
        'active': tab.code === value,
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
      default: () => ([])
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handle_item_click(tab, index) {
      this.$emit('click', {tab, index})
    },
  }
}
</script>

<style scoped lang="scss">
.tabs-wrapper {
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: 30px;
  color: var(--q-gb-t-c-1);
  background: rgba(0, 0, 0, 0.4);
  .item {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    font-size: 12px;
    z-index: 1;
    cursor: pointer;
    position: relative;
    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      border: 0.5px solid rgba(255, 255, 255, 0.5);
      border-right: none;
    }
    &:first-child {
      &:after {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
      }
    }
    &:last-child {
      &:after {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        border-right: 0.5px solid rgba(255, 255, 255, 0.5);
      }
    }
    &.active {
      color: var(--qq--video-history-video-border-color);
      &:after {
        border: 1px solid var(--qq--video-history-video-border-color);  
      }
      & + .item {
        &:after {
          border-left: none;
        }
      }
    }
  }
}

</style>