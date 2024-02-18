<!--
 * @Author:
 * @Date:
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算+预约）
-->
<template>
    <div class="settle-dialog" :style="page_style">
      <div class="row items-center yb_fontsize16 head-top" @touchmove.prevent>
        <div class="row col items-center justify-center">
          <p class="yb_mr10" @click="change_record(0)" :class="main_item == 0 && 'active-p'">
            {{ i18n_t('bet_record.no_account') }}<span></span></p>
          <p class="yb_ml10 yb_mr10" @click="change_record(1)" :class="main_item == 1 && 'active-p'">
            {{ i18n_t('bet_record.account') }}<span></span></p>
          <p class="yb_ml10" v-if="authorityFlag" @click="change_record(2)"
            :class="main_item == 2 && 'active-p'">{{ i18n_t('pre_record.book') }}<span></span></p>
        </div>
        <div class="col-2 close">
          <span class="close-click-padding" @click="close_show">
            <template v-if="lodash.get(UserCtr, 'theme').includes('day')">
              <img :src="compute_css_obj({key: 'h5-img-bet-record-close', theme: 'local_dev', type: 'img'})">
              <!-- <div :style="compute_css_obj({key: 'h5-img-bet-record-close', theme: 'local_dev'})"></div> -->
              </template>
            <template v-else>
              <img :src="compute_css_obj({key: 'h5-img-bet-record-close', theme: 'local_dev', type: 'img'})">
              <!-- <div :style="compute_css_obj({key: 'h5-img-bet-record-close', theme: 'local_dev'})"></div> -->
            </template>
          </span>
        </div>
      </div>
  
      <div class="content-m" ref="record_box">
        <!--未结算  -->
          <unsettle ref="unsettle_child" v-show="main_item == '0'" :main_item="main_item"></unsettle>      
        <!--已结算-->
        <settle v-show="main_item == '1'" :main_item="main_item"></settle>
        <!--预约-->
        <preRecord v-show="main_item == '2'" :main_item="main_item"></preRecord>
      </div>
    </div>
  </template>
  
  <script setup>
  import { api_betting } from "src/api/index.js";
  //   import { mapGetters, mapMutations } from "vuex"
  import unsettle from "src/base-h5/components/cathectic/unsettle.vue"
  import settle from "src/base-h5/components/cathectic/settle.vue"
  import preRecord from "src/base-h5/components/cathectic/pre-record.vue"
  import { onMounted, onUnmounted, ref, computed, provide, watch, nextTick } from 'vue'
  import lodash from 'lodash'
  import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
  //import store from 'src/store-redux/index.js'
  import UserCtr from "src/core/user-config/user-ctr.js";
  import { i18n_t } from "src/boot/i18n.js";
  import {compute_css_obj} from "src/output/index.js"
  import { compute_css_variables } from "src/core/css-var/index.js"
  
  // let { cathecticReducer, userInfoReducer, themeReducer } = store.getState()
  // const store_cathectic = ref(cathecticReducer)
  
  // 待确认中的提前结算订单
  provide('queryorderpresettleconfirm_data', '')
  
  // 延时器
  const timer_1 = ref(null)
  // 待确认中的提前结算单
  const provided_ = ref({})
  // 选中tab的下标
  const main_item = ref('0')
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
        timer_1.value = setTimeout(() => {
        let el = unsettle_child.value
        el.check_early_order()
        el.search_early_money()
      }, 800);    
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
    let rem_1 = window.innerWidth * 100 / 375;
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
    if (main_item.value === key) return;
    main_item.value = key
    // store.dispatch({ type: "SET_MAIN_ITEM", data: key })
  
  }
  // 清除当前组件所有定时器
  const clear_timer = () => {
    clearTimeout(timer_1.value)
    timer_1.value = null
  }
  onUnmounted(() => {
    // store.dispatch({ type: "SET_MAIN_ITEM", data: 0 })
    // for (const key in $data) {
    //     $data[key] = null
    //   }
  })
  </script>
  
  <style lang="scss" scoped>
  .settle-dialog {
    border-radius: 16px 16px 0 0;
    position: relative;
    overflow: hidden;
    background:var(--q-gb-bg-c-15);
    color: var(--q-cathectic-color-1);
    .content-m {
        background: var(--q-cathectic-color-7);
      }
  }
  
  .head-top {
    height: 0.5rem;
    position: relative;
    border-bottom: 1px solid var(--q-gb-bd-c-13);
  
    .close {
      position: absolute;
      right: 0;
      // width: 0.14rem;
      // height: 0.14rem;
      padding-right: 0.34rem !important;
      .close-click-padding {
        // padding: 0.08rem 0.04rem;
      }
  
      div {
        width: 0.14rem;
        height: 0.14rem;
        background-repeat: no-repeat;
      }
    }
  
    & div:last-child {
      text-align: right;
      padding-right: 0.14rem;
      font-size: 0.14rem;
    }
  
    p {
      position: relative;
  
      span {
        position: absolute;
        display: block;
        width: 36%;
        height: 0;
        left: 50%;
        border: 0.015rem solid transparent;
        transform: translateX(-50%);
        border-radius: 0.08rem;
      }
  
      &.active-p {
        font-weight: 600;
        color: inherit;
        span {
          border-color: var(--q-gb-bd-c-10);
          background: var(--q-gb-bd-c-13);
        }
      }
    }
  }
  </style>
  src/output/index.js