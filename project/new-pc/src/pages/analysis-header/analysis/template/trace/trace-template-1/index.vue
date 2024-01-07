<template>
  <div>
    <div class="event-item  relative-position" v-for="(item, index) in event_data" :key="index">
      <div class="time">
        <template v-if="match.csid == '1'">{{ formatTime(item.secondsFromStart) }}</template>
        <template v-else>{{ formatTime(item.createTime, 'MM\'ss\"') }}</template>
      </div>
      <div class="sign relative-position" :class="'team-' + item.team"></div>
      <div class="info">
        <!-- 足球 -->
        <template v-if="match.csid == '1'">
          <img :src="`/image/yabo/svg/analysis-${item.icon}.svg`" alt="" class="sign-icon"
            v-if="item.icon" width="14" style="vertical-align: middle">
        </template>
        <!-- 篮球 -->
        <template v-else>
          <span>{{ item.scores }}</span>
        </template>
        <span :class="{ 'status-default': item.team == 3 }">{{ item.cnText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
import { formatTime } from 'src/output/index.js'
</script>

<style lang="scss" scoped>
.event-item {
  color: var(--q-analysis-color-5);
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid var(--q-analysis-color-10);
  border-left: 1px solid var(--q-analysis-color-10);
  border-right: 1px solid var(--q-analysis-color-10);

  &:last-child {
    border-bottom: 1px solid var(--q-analysis-color-10);
    border-radius: 0 0 8px 8px;
  }

  .time {
    width: 58px;
    text-align: center;
  }

  .sign {
    width: 7px;
    height: 7px;
    border-radius: 7px;
    background: var(--q-analysis-color-12);

    &.team-1 {
      background: var(--q-analysis-color-2);
    }

    &.team-2 {
      background: var(--q-analysis-color-14);
    }

    &:before {
      content: "";
      position: absolute;
      bottom: 7px;
      left: 3px;
      height: 17px;
      width: 1px;
      background: var(--q-analysis-color-12);
    }

    &:after {
      content: "";
      position: absolute;
      top: 7px;
      left: 3px;
      height: 17px;
      width: 1px;
      background: var(--q-analysis-color-12);
    }
  }

  .info {
    margin-left: 8px;

    &>span {
      margin-right: 8px;
    }

    .sign-icon {
      margin-right: 8px;
    }

    .status-default {
      color: var(--q-analysis-color-0);
    }
  }

  &:first-child {
    .sign:before {
      display: none;
    }
  }

  &:last-child {
    .sign:after {
      display: none;
    }
  }
}</style>