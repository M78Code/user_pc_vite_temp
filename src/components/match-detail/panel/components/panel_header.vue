<!--
 * @Author: MasterJ
 * @Date: 2022-08-22 17:10
 * @Description 详情面板header
-->
<template>
  <div class="panel-header" @click.stop="$emit('set_fold')">
    <div class="panel-header-left">
      <template v-if="typeof icon === 'string'">
      <div class="panel-header-icon" :class="`icon-${icon}`"></div>
      <span class="panel-title">{{ title }}</span>
    </template>
    <template v-else>
      <div 
        v-for="(item, index) in icon" 
        class="item-tab-panel" 
        @click="tab_panel_click(item, index)"
      >
        <div class="panel-header-icon" :class="[`icon-${item}`, {[`icon-${item}2`]: index !== curr_tab_panel_index}]"></div>
        <span class="panel-title">{{ title[index] }}</span>
      </div>
    </template>
  </div>
  <div class="panel-header-right">
    <slot name="append" />
  </div>  
  </div>
</template>

<script>
export default {
  name: "panel_header",
  props: {
    icon: {
      type: String | Array,
      default: ''
    },
    title: {
      type: String | Array,
      default: ''
    }
  },
  data() {
    return {
      curr_tab_panel_index: 0
    }
  },
  methods: {
    tab_panel_click(tab_panel, index) {
      this.curr_tab_panel_index = index
      this.$emit('tab-panel', tab_panel)
    }
  }
}
</script>

<style scoped lang="scss">
.panel-header {
  display: flex;
  align-items: center;
  padding: 15px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  justify-content: space-between;
  cursor: pointer;
  .panel-header-left{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .panel-header-icon {
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 6px;
  }
  .item-tab-panel {
    display: flex;
    align-items: center;
    margin-right: 24px;
    cursor: pointer;
    .panel-title {
      font-size: 12px;
    }
  }
}
</style>