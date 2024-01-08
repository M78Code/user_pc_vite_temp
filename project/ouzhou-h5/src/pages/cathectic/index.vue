<!--
 * @Author:
 * @Date:
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算+预约）
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <div class="content-warp">
      <div class="second-header flex">
        <img :src="compute_local_project_file_path('/image/bet/my-bets.png')">
        <p v-for="(item, index) in tabs" 
          :key="index" 
          @click="change_record(index)" 
          :class="BetRecordClass.selected == index && 'active-p'"
          > {{ item.title }}
        </p>
        <days-select v-if="BetRecordClass.selected == 1" @changeDays="changeDays" />
      </div>
      <div class="content-m">
        <cathectic-item-all ref="cathecticItem" />
      </div>
    </div>
  </template>
  
  <script setup>
  import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
  import { enum_order_by, enum_time_type } from "src/core/bet-record/h5/util.js";
  import { api_betting } from "src/api/index.js";
  import cathecticItemAll from "src/base-h5/components/cathectic/ouzhou-h5/cathectic-item-all.vue"
  import daysSelect from "src/base-h5/components/cathectic/ouzhou-h5/days-select.vue"
  import { onMounted, onUnmounted,  ref, provide } from 'vue'
  import { i18n_t } from "src/boot/i18n.js";
  import {compute_local_project_file_path} from "src/output/index.js"
  import { compute_css_variables } from "src/core/css-var/index.js"
  

  // 待确认中的提前结算单
  const provided_ = ref(null)
  // 待确认中的提前结算订单
  provide('queryorderpresettleconfirm_data', provided_)

  const tabs = ref([
    { title: i18n_t('bet_record.no_account') },
    { title: i18n_t('bet_record.account') }
  ])

  // 已结算页面切换时间，获取新列表
  const cathecticItem = ref(null)

  // 时间切换 (今天、昨日、七日内、一月内)
  const changeDays = (dayValue) => {
    const $el = cathecticItem.value
    if($el.timeType === dayValue) return
    $el.timeType = dayValue
    $el.init_data(1)
  }

  // 已结算、未结算切换
  const change_record = (key) => {
    //已选中状态下不能点击
    if (BetRecordClass.selected === key) return;
    // 已结算页面切换=>未结算页面，重置未结算页面筛选条件
    if(key === 0) {
      const $el = cathecticItem.value
      $el.timeType = enum_time_type[0]
      $el.sortChange(enum_order_by[1], true)
    }
    BetRecordClass.set_selected(key);  
  }

  const page_style = ref('')
  page_style.value = compute_css_variables({ category: 'component', module: 'cathectic' })
    
  onMounted(() => {
    // 查询待确认中的提前结算单
    api_betting.query_order_pre_settle_confirm().then(res => {
      let { code, data } = res || {}
      if (code == 200 && data) {
        // 待确认中的提前结算单
        provided_.value = data
      } 
    })
  })
 
  </script>
  
  <style lang="scss" scoped>
  template {
    display: block;
  }
  .content-warp {
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }
  .second-header {
    height: 0.5rem;
    border-bottom: 1px solid var(--q-gb-bg-c-1);
    position: relative;
    p {
      margin: 0 0.2rem;
      font-size: 0.16rem;
      font-weight: bold;
      line-height: 0.46rem;
      color: var(--q-gb-t-c-3);
      &.active-p {
        color: var(--q-gb-t-c-1);
        border-bottom: 0.04rem solid var(--q-gb-bg-c-1);
      }
    }
    img {
      position: absolute;
      height: 100%;
      width: auto;
      right: 0;
      opacity: 0.2;
    };
  }
  .content-m {
    flex: 1;
    height: 0;
    background-color: var(--q-gb-bg-c-10);
  }
  </style>