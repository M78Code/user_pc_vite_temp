<!--
 * @Author:
 * @Date:
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算+预约）
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <div class="second-header flex">
      <p v-for="(item, index) in tabs" 
        :key="index" 
        @click="change_record(index)" 
        :class="BetRecordClass.selected == index && 'active-p'"
        > {{ item.title }}
      </p>
      <days-select @changeDays="changeDays" />
    </div>
    <!-- <div class="content-m" ref="record_box">
      <cathectic-item-all />
    </div> -->
  </template>
  
  <script setup>
  import BetRecordClass from "src/core/bet-record/bet-record.js";
  import { api_betting } from "src/api/index.js";
  //   import { mapGetters, mapMutations } from "vuex"
  import cathecticItemAll from "src/base-h5/components/cathectic/app-h5/cathectic-item-all.vue"
  import daysSelect from "src/base-h5/components/cathectic/ouzhou-h5/days-select.vue"
  import { onMounted, onUnmounted, ref, shallowRef, computed, provide, watch, nextTick } from 'vue'
  import lodash from 'lodash'
  import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
  import store from 'src/store-redux/index.js'
  import UserCtr from "src/core/user-config/user-ctr.js";
  import { i18n_t } from "src/boot/i18n.js";
  import {compute_css_obj} from "src/core/index.js"
  import { compute_css_variables } from "src/core/css-var/index.js"

  let { cathecticReducer, userInfoReducer, themeReducer } = store.getState()
  const store_cathectic = ref(cathecticReducer)
  
  // 待确认中的提前结算订单
  provide('queryorderpresettleconfirm_data', '')

  // 延时器
  const timer_1 = ref(null)
  // 待确认中的提前结算单
  const provided_ = ref({})

  const tabs = ref([
    { title: i18n_t('bet_record.no_account') },
    { title: i18n_t('bet_record.account') }
  ])

  const changeDays = (dayValue) => {
    console.log(dayValue);
  }
  // 锚点
  const unsettle_child = ref(null)
  const record_box = ref(null)
  // const unsettle = ref(null)
  const page_style = ref('')
  
  page_style.value = compute_css_variables({ category: 'component', module: 'cathectic' })
  
  
  
  // let unsubscribe = store.subscribe(() => {
  //     up_store_data()
  // })
  
  // const up_store_data = () => {
  //     // console.error('更新数据');
  // }
  
  //判断该商户是否有权限预约投注
  const authorityFlag = computed(() => {
    const bookBet = lodash.get(UserCtr, 'user_info.configVO.bookBet')
    return bookBet == 1
  })
  // watch(() => unsubscribe, () =>{
  //   console.error( store_cathectic);
  // })
  
  onMounted(() => {
    height_calc()
    // TODO: 后续修改调整
    window.onresize = height_calc
    // 查询待确认中的提前结算单
    api_betting.query_order_pre_settle_confirm().then(res => {
      let { code, data } = res || {}
      if (code == 200 && data) {
        // 待确认中的提前结算单
        provided_.value = { queryorderpresettleconfirm_data: data }
      }
      // 弹窗显示接口获取列表后延迟
      // timer_1.value = setTimeout(() => {
      //   let el = unsettle_child.value
      //   el.check_early_order()
      //   el.search_early_money()
      // }, 800);    
    })
  })
  //   ...mapMutations(['set_main_item']),
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
  onUnmounted(() => {
    store.dispatch({ type: "SET_MAIN_ITEM", data: 0 })
    // for (const key in $data) {
    //     $data[key] = null
    //   }
  })
  </script>
  
  <style lang="scss" scoped>
  template {
    display: block;
  }
  .second-header {
    height: 0.5rem;
    border-bottom: 1px solid var(--q-gb-bd-c-8);
    p {
      margin: 0 0.2rem;
      font-size: 0.16rem;
      font-weight: bold;
      line-height: 0.46rem;
      &.active-p {
        color: var(--q-gb-bd-c-8);
        border-bottom: 0.04rem solid var(--q-gb-bd-c-8);
      }
    }
  }
  </style>
  