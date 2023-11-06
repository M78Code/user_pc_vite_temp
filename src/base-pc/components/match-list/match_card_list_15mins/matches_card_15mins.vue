<!--
 * @Author: lockie
 * @Date: 2023-07-01 13:38:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-17 14:45:30
 * @FilePath: \user-pc-vue3\src\components\match_list\match_card_list_15mins\matches_card_15mins.vue
-->
<template>
  <div class="sport">
    <div class="competing-time">
      <sport_icon :size="'12px'" :status="true" :sport_id="current_tab.csid" class="sport-icon" />
      <div class="matches-time">
        <div class="begin-time din_font">{{ (current_tab.matches_15mins_obj || {}).title }}</div>
      </div>
    </div>
    <div class="club-name">
      {{ current_tab.mhn }}
    </div>
    <div class="union-name">
      {{ current_tab.man }}
    </div>
    <div class="odds-box din_font">
      <div class="odds-box-item" 
        v-for="item in (current_tab.current_ol[0] || {}).ol || []" 
        :key="item.oid"
        @click="checked_current_td({payload: current_tab, hps: current_tab.current_ol[0], ol: item, is15mins: true})"
        :class="{checked: item.oid == current_check_betId }"
      >
        <span>{{ item.ot }}</span>
        <span>{{ Math.floor(item.ov / 1000) / 100 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

  import { ref } from 'vue';
  import _ from 'lodash';

  // import store from 'src/store-redux-vuex/index.js';
  // import { storage_bet_info, storage_bet_id } from 'src/utils/bet_info.js'

  import sport_icon from "src/base-pc/components/match-list/sport_icon.vue";

  // let state = store.getState();
  const props = defineProps({
    current_tab: {
      type: [ Object, Array ],
      default: () => {},
    },
  });
  
  // const current_check_betId = ref(state.betInfoReducer.current_check_betId);

  // // 监听 当前投注项ID的变化
  // store.subscribe(() => {
  //   state = store.getState()
  //   current_check_betId.value = state.betInfoReducer.current_check_betId;
  // });

  // // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
  // const checked_current_td = payload => {
  //   // 锁盘状态不高亮
  //   if (payload.hps.hs) {
  //     return;
  //   }
  //   if (payload.ol.oid !== current_check_betId.value) {
  //     storage_bet_info(payload);
  //   }
  //   storage_bet_id(payload.ol.oid);
  // }
  
</script>

<style lang="scss" scoped>
  .sport {
    height: 100%;
    width: 260px;
  }
  .competing-time {
    display: flex;
    align-items: center;
    margin: 0 0 5px 16px;
  }
  .sport-icon {
    margin-right: 5px;
  }
  .matches-time {
    color: #FF7000;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    .begin-time {
      font-family: DIN;
      line-height: 17px;
      letter-spacing: 0px;
    }
    .end-time {
      font-family: PingFang SC;
      line-height: 20px;
      letter-spacing: 0px;
    }
  }
  .club-name {
    color: #3D3B37;
    font-size: 14px;
    margin-bottom: 6px;
    font-family: "Roboto";
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    margin-left: 16px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .union-name {
    color: #1A1A1A;
    font-size: 14px;
    margin-bottom: 8px;
    font-family: "Roboto";
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    margin-left: 16px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .odds-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: DIN;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0px;
    .odds-box-item {
      cursor: pointer;
      width: 73px;
      height: 40px;
      line-height: 17px;
      letter-spacing: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: rgba(255, 112, 0, 0.1);
      }
    }
    div:last-of-type {
      margin: 0;
    }
    span {
      font-size: 14px;
      &:first-child {
        color: #8A8986;
        margin-right: 7px;
      }
      &:last-child {
        color: #FF7000;
      }
    }
    .checked {
      background: #FF7000;
      color: #FFFFFF;
      span {
        color: #FFFFFF;
      }
      &:hover {
        background: #FF7000;
      }
    }
  }
</style>
