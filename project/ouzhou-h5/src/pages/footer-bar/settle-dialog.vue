<!--
 * @Author:
 * @Date:
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算）
-->
<template>
  <div class="settle-dialog">

    <div class="row items-center yb_fontsize16 head-top" @touchmove.prevent>
      <div class="row col items-center justify-center">
        <p class="yb_mr10" @click="change_record(0)" :class="get_main_item == 0 && 'active-p'">{{i18n_t('bet_record.no_account')}}<span></span></p>
        <p class="yb_ml10 yb_mr10" @click="change_record(1)" :class="get_main_item == 1 && 'active-p'">{{i18n_t('bet_record.account')}}<span></span></p>
        <p class="yb_ml10" v-if="authorityFlag" @click="change_record(2)" :class="get_main_item == 2 && 'active-p'">{{i18n_t('pre_record.book')}}<span></span></p>
      </div>
      <div class="col-2 close">
        <span class="close-click-padding" @click="close_show">
          <img class="img" :src="compute_img_url('icon-close')" >
        </span>
      </div>
    </div>

    <div class="content-m" ref="record_box">
      <!--未结算-->
      <unsettle v-show="!get_main_item == 0" ref="unsettleChild"></unsettle>
      <!--已结算-->
      <!-- <settle v-show="get_main_item == 1"></settle> -->
      <!--预约-->
      <!-- <preRecord v-show="get_main_item == 2"></preRecord> -->
    </div>
  </div>
</template>

<script setup>
//   import { api_betting } from "src/api/index.js";
//   import { mapGetters, mapMutations } from "vuex"
import unsettle from "./unsettle.vue"
//   import settle from "src/project/pages/cathectic/settle.vue"
//   import pre_record from "src/project/pages/cathectic/pre_record.vue"
import { onMounted, onUnmounted, ref, computed } from 'vue'
import lodash from 'lodash'
import store  from "src/store-redux"
//   import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
// import { useRoute } from 'vue-router'

import {compute_img_url} from "src/output/index.js"
//国际化

  // provide(){
  //   return {
  //     queryorderpresettleconfirm_data: '',  // 待确认中的提前结算订单
  //   }
  // },
  // 延时器
  let timer_1 = ref(null)
  // 待确认中的提前结算单
  let _provided = ref({})
  // 锚点
  let unsettleChild = ref(null)
  let store_data = ref(store.getState())
  // computed: {
  //   ...mapGetters(['get_main_item',,'UserCtr']),

  // },
  //判断该商户是否有权限预约投注
  // const authorityFlag = computed(() => {
  //     const bookBet = lodash.get(UserCtr, 'user_info.configVO.bookBet')
  //     return bookBet == 1
  // })

  // onMounted(() => {
  //   over_body(true)
  //   height_calc()
  //   TODO: 后续修改调整
  //   window.onresize = height_calc
      // 查询待确认中的提前结算单
  //   api_betting.query_order_pre_settle_confirm().then(res => {
  //     let {code,data} = res || {}
  //     if(code == 200 && data) {
        // 待确认中的提前结算单
      //   _provided.value = {queryorderpresettleconfirm_data:data}
      // }
      // 弹窗显示接口获取列表后延迟
  //     timer_1.value = setTimeout(() => {
  //       unsettleChild.value.check_early_order()
  //       unsettleChild.value.search_early_money()
  //     }, 800);


  //   })
  // })
  //   ...mapMutations(['set_main_item']),
    /**
     *@description 高度计算
     *@return {Undefined} undefined
     */
  // const height_calc = () => {
  //     let ele = $refs.record_box
  //     if (!ele) return
  //     let rem_1 = window.innerWidth * 100 / 375;
  //     ele.style['height'] = window.innerHeight - rem_1 + 'px';
  //   }
    /**
     *@description 投注记录弹出时解决滑动穿透，记录body的滚动位置
     *@param {Boolean} value 投注记录弹框是否弹出
     *@return {Undefined} undefined
     */
  const over_body = (value) => {
      let dom_ = document
      if (value) {
        // scroll_top = dom_.scrollingElement.scrollTop;    //记录此时滚动条位置
        // dom_.body.style.position = "fixed";   // 使body固定定位，脱离文档流
        // dom_.body.style.top = -scroll_top + 'px';    // 把脱离文档流的body拉上去！否则页面会回到顶部！
      } else {
        // dom_.body.style.position = "static";   // body去除固定定位，回到了文档流中
        // dom_.scrollingElement.scrollTop = scroll_top;
      }
    }
    /**
     *@description 关闭弹层
     *@return {Undefined} undefined
     */
  // const close_show = () => {
  //     useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
  //   }
  // const change_record = (key) => {
      //已选中状态下不能点击
  //     if (get_main_item === key) return;
  //     set_main_item(key);
  //   }
    // 清除当前组件所有定时器
  // const clear_timer = () => {
  //     clearTimeout(timer_1)
  //     timer_1.value= null
  //   }
  // onUnmounted(() => {
  //   over_body(false)
  //   set_main_item(0);
  //   for (const key in $data) {
  //     $data[key] = null
  //   }
  // })
</script>

<style lang="scss" scoped>
.settle-dialog {
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
  background-color: var(--q-cathectic-page-bg-color);
  color: var(--q-cathectic-fs-defalut-color)
}

.head-top {
  height: 0.5rem;
  position: relative;
  border-bottom: 1px solid var(--q-cathectic-border-bottom-color-1);

  .close {
    position: absolute;
    right: 0;

    .close-click-padding {
      padding: 0.08rem 0.04rem;
    }

    img {
      width: 0.24rem;
      opacity: 0.7;
      border: 0.06rem solid transparent;
      transform: translateY(0.02rem);
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

      transform: translateX(-50%);
      border-radius: 0.08rem;
    }

    &.active-p {
      font-weight: 600;
      color: var(--q-cathectic-fs-active-color);
      span {
        border-color: var(--q-cathectic-underline-border-color);
        background:var(--q-cathectic-underline-bg-color);
      }
    }
  }
}
</style>