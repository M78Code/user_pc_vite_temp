<template>
  <div class="c-match-list-filter" :class="{
    'date-filter': menu_config.menu_root == 3,
    early: menu_config.menu_root == 3
  }" >
  <!-- v-if="menu_config.left_menu_result.jinri_zaopan == 3" -->
    <!-- 早盘-日期 -->
    <DateTab />
  </div>
</template>

<script setup>
import DateTab from "src/base-pc/components/tab/date-tab/yz_index.vue";
import menu_config from "src/core/menu-pc-yazhou/menu-data-class.js";
</script>

<style lang="scss" scoped>
.c-match-list-filter {
  width: 100%;
  height: 48px;
  padding-bottom: 1px;

  .more-btn {
    z-index: 10;
    width: 30px;
    height: 100%;
    cursor: pointer;
  }

  .filter-sports {
    overflow: hidden;

    .item {
      max-width: 140px;
      min-width: 80px;
      height: 30px;
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px 3px;

      .icon-wrap {
        position: relative;

        .menu-new-icon {
          position: absolute;
          top: 0;
          left: 30px;
        }

        .icon-select {
          visibility: hidden;
          bottom: -6px;
          right: -5px;
        }
      }

      .count-text {
        padding-left: 2px;
        padding-right: 3px;
      }

      .text-active {
        color: var(--q-gb-t-c-1);
      }

      .menu-inline {
        display: inline-block;
      }

      .name-margin-left {
        margin-left: 5px;
      }

      .name {
        margin-top: 1px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 13px;

        .count {
          display: inline-block;
        }
      }

      &.active {
        .icon-select {
          visibility: visible;
        }
      }

    }
  }

  &.date-filter {
    height: 50px;
    font-size: 14px;
  }
}</style>
