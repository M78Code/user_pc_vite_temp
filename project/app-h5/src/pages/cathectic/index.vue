<!--
 * @Author:
 * @Date:
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算+预约）
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <div class="settle-dialog" :style="page_style">
      <div v-if="BetRecordClass.selected != 3" class="row items-center yb_fontsize16 head-top" @touchmove.prevent>
        <div class="row col items-center justify-center">
          <p v-for="(item, index) in tabs.slice(0, 3)"
            :key="index"
            @click="change_record(index)"
            :class="BetRecordClass.selected == index && 'active-p'"
            > {{ item.title }}
          </p>
        </div>
      </div>

      <div class="content-m" ref="record_box">
        <!-- 未结注单(未结算、预约中、已失效)、已结算注单 -->
        <cathectic-item-all />
      </div>
    </div>
  </template>
  
  <script setup>
  import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
  import { api_betting } from "src/api/index.js";
  import cathecticItemAll from "src/base-h5/components/cathectic/app-h5/cathectic-item-all.vue"
  import { onMounted, onUnmounted, ref, shallowRef, computed, provide, watch, nextTick } from 'vue'
  import lodash from 'lodash'
  import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
  import UserCtr from "src/core/user-config/user-ctr.js";
  import { i18n_t } from "src/boot/i18n.js";
  import { compute_css_variables } from "src/core/css-var/index.js"
    
  // 延时器
  const timer_1 = ref(null)
  // 待确认中的提前结算单
  const provided_ = ref(null)
  // 待确认中的提前结算订单
  provide('queryorderpresettleconfirm_data', provided_)

  const tabs = ref([
    { title: i18n_t('bet_record.no_account') },
    { title: i18n_t('pre_record.booking') },
    { title: i18n_t('pre_record.expired') },
    { title: i18n_t('bet_record.account') }
  ])
  // 锚点
  const unsettle_child = ref(null)
  const record_box = ref(null)
  // const unsettle = ref(null)
  const page_style = ref('')
  
  page_style.value = compute_css_variables({ category: 'component', module: 'cathectic' })
  
  
  
  //判断该商户是否有权限预约投注
  const authorityFlag = computed(() => {
    const bookBet = lodash.get(UserCtr, 'user_info.configVO.bookBet')
    return bookBet == 1
  })

  onMounted(() => {
    // height_calc()
    // TODO: 后续修改调整
    // window.onresize = height_calc
    // 查询待确认中的提前结算单
    api_betting.query_order_pre_settle_confirm().then(res => {
      let { code, data } = res || {}
      if (code == 200 && data) {
        // 待确认中的提前结算单
        provided_.value = data
      }  
    })
  })
  /**
   *@description 高度计算
   *@return {Undefined} undefined
   */
  const height_calc = () => {
    let ele = record_box.value
    if (!ele) return
    // 未结算页面不显示切换栏，所以高度可以高些
    const baseHeight = BetRecordClass.selected === 3 ? 700: 375
    let rem_1 = window.innerWidth * 100 / baseHeight;
    ele.style['height'] = window.innerHeight - rem_1 + 'px';
  }
  
  /**
   *@description 关闭弹层
   *@return {Undefined} undefined
   */
  const close_show = () => {
    useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
  }
  const change_record = (key) => {
    //已选中状态下不能点击
    if (BetRecordClass.selected === key) return;
    BetRecordClass.set_selected(key);  
  }
  // 清除当前组件所有定时器
  const clear_timer = () => {
    clearTimeout(timer_1.value)
    timer_1.value = null
  }
  </script>
  
  <style lang="scss" scoped>
  template {
    display: block;
  }
  .settle-dialog {
    position: relative;
    overflow: hidden;   
    color: var(--q-cathectic-color-19);
    .content-m {
        padding-top: 0.2rem;
      }
  }
  
  .head-top {
    height: 0.4rem;
    background-color:var(--q-gb-bg-c-23);
    border-radius: 1rem;
  
    & > div {
      justify-content: space-between;
      padding: 0.03rem;
    }
  
    p {
      text-align: center;
      border-radius: 1rem;
      height: 0.34rem;
      line-height: 0.34rem;
      width: 30%;
      color: var(--q-gb-t-c-24);
      font-size: 0.12rem;
      &.active-p {
        background: var(--q-gb-bg-c-13);
        color: var(--q-gb-t-c-14);
      }
    }
  }
  </style>
  