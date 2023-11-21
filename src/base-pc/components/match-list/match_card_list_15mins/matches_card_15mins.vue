<template>
  <div class="sport">
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
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
    <div class="odds-box din_font" v-if="current_tab?.current_ol?.length">
      <div class="odds-box-item" 
        v-for="item in (current_tab.current_ol[0] || {}).ol || []" 
        :key="item.oid"
        @click.stop="checked_current_td({payload: current_tab, hps: current_tab.current_ol[0], ol: item, is15mins: true})"
        :class="{checked: BetData.bet_oid_list.includes(item.oid) }"
      >
        <span>{{ item.onb }}</span>
        <span>{{ Math.floor(item.ov / 1000) / 100 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

  import { onMounted, ref, watch } from 'vue';
  import sport_icon from "src/base-pc/components/match-list/sport_icon.vue";
  // import { get_15mins_odds_list } from "src/core/match-list-pc/list-template/module/template-101.js"
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
  import { MenuData } from "src/core/index.js"

  const props = defineProps({
    current_tab: {
      type: [ Object, Array ],
      default: () => {},
    },
  });
  const current_check_betId = ref(MenuData.current_check_betId.value);
  // const ols = ref([])

  // // 监听 当前投注项ID的变化
  watch(
    MenuData.current_check_betId,
      () => {
        current_check_betId.value= MenuData.current_check_betId.value
      },
    )

  // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
  const checked_current_td = payload => {
    MenuData.current_check_betId.value = payload.ol.oid
    let params = {
      oid: payload.ol.oid, // 投注项id ol_obj
      _hid: payload.hps.hid, // hl_obj 
      _hn: payload.hps.hn,  // hn_obj
      _mid: payload.payload.mid  //赛事id mid_obj
    }
    console.log(params, 'params', payload)
    set_bet_obj_config(params,{})
  }
  
</script>

<style lang="scss" scoped>
  .sport {
    height: 100%;
    width: 250px;
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
    color: var(--q-gb-t-c-2);
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
    color: var(--q-gb-t-c-5);
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
        color: var(--q-gb-t-c-8);
        margin-right: 7px;
      }
      &:last-child {
        color: var(--q-gb-t-c-2);
      }
    }
    .checked {
      background: var(--q-gb-bg-c-1);
      color: var(--q-gb-t-c-1);
      span {
        color: var(--q-gb-t-c-1);
      }
      &:hover {
        background: var(--q-gb-bg-c-1);
      }
    }
  }
</style>
