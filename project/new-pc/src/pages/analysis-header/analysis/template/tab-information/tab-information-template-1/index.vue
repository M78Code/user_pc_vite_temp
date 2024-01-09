<template>
  <div class="information">
    <div class="tab">
      <!-- 主队 -->
      <span :class="{ 'active': tabIndex == 1 }" @click="tabClick(1)">{{ match.mhn }}</span>
      <!-- 客队 -->
      <span :class="{ 'active': tabIndex == 2 }" @click="tabClick(2)">{{ match.man }}</span>
    </div>

    <div class="panel">
      <!-- 有利情报 -->
      <div class="panel-title">{{ i18n_t('analysis.Favorable_information') }}</div>
      <div class="item" v-for="(item, index) in lineupData[0]" :key="index">{{ item.content }}</div>
    </div>

    <div class="panel">
      <!-- 不利情报 -->
      <div class="panel-title FF7373">{{ i18n_t('analysis.Unfavorable_information') }}</div>
      <div class="item" v-for="(item, index) in lineupData[1]" :key="index">{{ item.content }}</div>
    </div>

    <div class="panel">
      <!-- 中立情报 -->
      <div class="panel-title">{{ i18n_t('analysis.Neutral_Information') }}</div>
      <div class="item" v-for="(item, index) in lineupData[2]" :key="index">{{ item.content }}</div>
    </div>
  </div>
</template>

<script setup>
// import analysisData  from 'src/public/mixins/analysis/analysis'
// mixins: [analysisData],

import { ref, onUnmounted } from 'vue';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { api_analysis } from 'src/api/index'
useRegistPropsHelper(component_symbol, need_register_props)

const props = defineProps(['match'])
const tabIndex = ref(1);
const lineupData = ref([]); // 情报数据
let params = {}
params = { parentMenuId: 4, sonMenuId: 1, standardMatchId: props.match.mid }
get_data()

function tabClick(index) {
  tabIndex.value = index
  params.sonMenuId = index
  get_data()
}

/**
* @description: 情报数据
*/

function get_data() {
  api_analysis.get_match_analysise_data(params).then((res) => {
    res = res.data
    let data = res.sThirdMatchInformationDTOList
    let lineupInfo = [[], [], []]
    // 0主队中立,1客队中立，2 主队有利，3客队有利,  4主队不利,   5客队不利,  6无用
    data.map(item => {
      if (tabIndex.value == 1) {//主队
        if (item.benefit == 2) {
          lineupInfo[0].push(item)
        } else if (item.benefit == 4) {
          lineupInfo[1].push(item)
        } else if (item.benefit == 0) {
          lineupInfo[2].push(item)
        }
      } else {
        if (item.benefit == 3) {
          lineupInfo[0].push(item)
        } else if (item.benefit == 5) {
          lineupInfo[1].push(item)
        } else if (item.benefit == 1) {
          lineupInfo[2].push(item)
        }
      }
    })
    lineupData.value = lineupInfo;
  })
}

onUnmounted(() => {
  params = null;
  lineupData.value = null;
})

</script>

<style lang="scss" scoped>
.information {
  
  // 复制的重复代码，.datum .tab 等待抽象
  .tab {
    display: flex;
    align-items: center;
    height: 34px;
    margin-bottom: 10px;
    border-radius: 0 0 8px 8px;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
    span {
      position: relative;
      margin: 0 10px;
      height: 28px;
      line-height: 28px;
      color: #555;
      cursor: pointer;
      text-align: center;
      &.active {
        font-weight: 600;
        color: #179CFF;
      }
      &.active::before {
        position: absolute;
        content: "";
        width: 90%;
        height: 6px;
        border-radius: 15px;
        background: #179CFF;
        bottom: -6px;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }

  .panel {
    margin-bottom: 20px;

    .panel-title.FF7373:before {
      background: #E93D3D;;
    }

    .item {
      padding: 14px 30px;
      border: 1px solid #DEE4F2;
      border-top: 0 none;
      border-radius: 0 0 8px 8px;
    }
  }
}</style>