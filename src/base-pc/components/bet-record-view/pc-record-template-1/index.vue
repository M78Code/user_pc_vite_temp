<!--
 * @Description: 投注记录菜单 未结算 已结算 预约
-->
<template>
  <!-- 投注记录 -->
  <v-scroll-area ref="ref_bet_scroll_area_history" class="left-preview" position="bet_history" :observer_area="3" :observer_middle="true">
    <!-- 滚动：头部 --------------------------------->
    <template v-slot:header>
      <div class="left-bg-box"></div>
      <bet-record-header />
    </template>
    <!-- 滚动：内容 --------------------------------->
    <!--投注记录内容-->
    <div class="bet-record-container" data-container="bet-record-container">
      <div style="display: none;">{{ BetRecordLeft.bet_record_version }}</div>
      <div class="changing" v-if="ref_data.load_data_state === 'loading'">{{ i18n_t('common.loading') }}</div>
      <div class="changing" v-if="ref_data.load_data_state === 'empty'">{{ i18n_t('common.no_data') }}</div>
      <div class="changing" v-if="ref_data.load_data_state === 'api_limited'">{{ i18n_t('common.limited') }}</div>
      <!--投注记录卡片-->
      <q-card v-else flat class="bet-record-card full-width">
        <template v-for="(item, index) in ref_data.record_data" :key="index">
          <!--单关start (0:未结算,1:已结算,2:注单取消,3:确认中,4:投注失败)-->
          <div class="border-shq-card-actionsadow">
            <!--卡片标题-->
            <q-card-actions :class="{ 'bet-separator': !item.is_expand }" :key="'actions-' + index"
              @click="change_handle(item)">
              <!--单关还是串关-->
              <div class="bet-record-title">{{ item.seriesValue }}</div>
            </q-card-actions>
            <!--结算内容-->
            <template v-if="item.is_expand">
              <!-- 0:未结算 1:已结算 2: 预约 -->
              <div v-for="(order, order_index) in data_list(item)" :key="'bet-item-' + index + '-' + order_index"
                class="bet-item  relative-position" :class="{ 'cursor-pointer': show_arrow(item, order) }"
                @click="go_match(item, order)">
                <!--卡片内容-->
                <q-card-section>
                  <!--投注记录中投注项 selected是否被选择 appoint_order_status预约状态 order_status订单状态pre_bet_amount提前结算金额-->
                  <bet-record-item :item="item" :index="index" :order="order"></bet-record-item>
                </q-card-section>
              </div>
              <q-card-section class="bet-item-result" :key="'bet-result-' + index">
                <!--结算结果-->
                <bet-record-result :index="index" :item="item"></bet-record-result>
              </q-card-section>
            </template>
            <q-card-section class="bet-item-separator"
              :class="{ 'bet-item-separator-last': (index == (ref_data.record_data.length - 1)) }"
              :key="index"></q-card-section>
          </div>
        </template>
      </q-card>
    </div>
  </v-scroll-area>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";

import BetRecordItem from "./bet-record-item.vue";
import BetRecordResult from "./bet-record-result.vue";
// 通屏垂直滚动
import vScrollArea from "./v-scroll-area.vue";
import BetRecordHeader from './bet-record-header.vue'

import { api_betting } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import lodash_ from "lodash"
import BetRecordWs from "src/core/bet-record/bet-record-ws.js";
let wsObj = null
let useMitt = null
let timer = null

onMounted(() => {
  get_record_list({
    orderStatus: 0,
    timeType: 5 
  })
  // 监听tab切换，重新获取数据
  useMitt = useMittOn(MITT_TYPES.EMIT_GET_RECORD_LIST, get_record_list).off
  // ws监听
  wsObj = new BetRecordWs()
})

onUnmounted(() => {
  timer && clearInterval(timer)
  useMitt && useMitt()
  // 取消ws监听
  wsObj && wsObj.destroy()
  wsObj = null
})

const ref_data = reactive({
  cur_page: 1,
  page_size: 20,
  load_data_state: 'loading',
  is_more_show: false,
  total_page: 20,
  record_data: []
})

/**
 *  0:未结算 1:已结算 数据源 orderVOS
 *  2: 预约 数据源 detailList
 * @param {*} item 
 */
const data_list = (item) => {
  // 0:未结算 1:已结算 2: 预约
  if([0, 1].includes(BetRecordLeft.selected)) {
    return item.orderVOS
  } else {
    return item.detailList
  }
}

/**
 * @description: 获取记录列表
 * @param {Number} o_params 参数
 * @param {Number} cur_page 当前页 默认为第一页
 * @return {undefined} undefined
 */
const get_record_list = (o_params, cur_page = 1) => {
  let params = {
    page: cur_page,
    size: ref_data.page_size,
    ...o_params
  };
  ref_data.cur_page = cur_page
  ref_data.load_data_state = "loading";
  ref_data.record_data = []

  BetRecordLeft.api_url(params).then(res => {
    let code = lodash_.get(res, 'code')
    let data = lodash_.get(res, 'data')
    if (code == 200) {
      // 投注记录
      let record_data = data;
      let records = data && data.records;
      if (records && records.length) {
        records.forEach(item => {
          // 设置投注结算金额 默认为总的订单金额
          let setBetAmount = item.orderAmountTotal;
          // 如果提前结算过(结算数据存在)
          if (item.preBetAmount) {
            // 重新计算可以结算的投注金额
            setBetAmount = item.orderAmountTotal - item.preBetAmount;
          }
          Object.assign(item, { is_expand: true, setBetAmount });
        });
      }
      if (record_data.total > 20) {
        // 投注记录大于20条 设置加载更多按钮显示
        ref_data.is_more_show = true;
        // 从新计算总页数
        ref_data.total_page = parseInt(record_data.total / ref_data.page_size);
        ref_data.total_page = ((record_data.total % ref_data.page_size) == 0) ? ref_data.total_page : (ref_data.total_page + 1);
      }

      if (!records || records.length == 0) {
        // 投注记录不存在设置加载状态为empty
        ref_data.load_data_state = "empty";
        return;
      }
      ref_data.record_data = records
      ref_data.load_data_state = "";
      // 如果是已结算
      // 提前结算开关打开时订阅提前结算注单
      timer && clearInterval(timer)
      if(BetRecordLeft.selected == 0) {
        check_early_order()
        timer = setInterval(() => {
          if (document.visibilityState == 'visible') {
            check_early_order()
          }
        }, 5000)
      }
    } else {
      if (code == '0401038') {
        ref_data.load_data_state = "api_limited";
      } else {
        ref_data.load_data_state = "empty";
      }
    }
  }).catch(err => { console.error(err) });
}

  /**
   * @description 检查订单中是否存在符合条件的提前结算订单号
   * @description 如果存在， 则接口获取提前结算金额
   */
  const check_early_order = () =>  {
    // 如果用户未开启提前结算
    if (!UserCtr.user_info.settleSwitch) return;
    // 循环列表查询需要提前结算的单号
    let tempList = []
    lodash.forEach(ref_data.record_data, (value, key) => {
      lodash.forEach(value.data, (item) => {
        if(item.seriesType === '1') { //单关、足篮才有提前结算
          tempList.push(item.orderNo)
        }
      })
    })
    if (tempList.length === 0) return;
    // 如果有需要提前结算的订单，获取提前结算的金额
    let params = { orderNo: tempList.join(',') }
    api_betting.get_cashout_max_amount_list(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      // 通知提前结算组件 => 数据金额变化
      useMittEmit(MITT_TYPES.EMIT_EARLY_MONEY_LIST_CHANGE, res.data)
    })
  }



const change_handle = () => { }
const order_status = () => { }
const show_arrow = () => { }

const go_match = () => { }

const order_class = () => { }
</script>


<style lang="scss">
@import "./css/bet_record.scss";
</style>

<style lang="scss" scoped>
/**投注记录内容样式*/
.bet-record-container {
  :deep(.empty-wrap) .img {
    margin-top: 90px;
    margin-bottom: 0px;
    width: 110px !important;
  }
  .changing {
    text-align: center;
    padding-top: 50px;
  }
}

/**注记录卡片样式*/
.bet-record-card {

  /*  取消边框     */
  .bet-separator {
    margin-bottom: 1px;
  }

  /*  投注记录标题设置 */
  .bet-record-title {
    font-size: 13px;
    height: 34px;
    line-height: 34px;
    position: relative;
    padding-left: 8px;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      top: 9px;
      width: 4px;
      height: 14px;
      background-color: var(--q-gb-bg-c-4);
      border-radius: 0 3px 3px 0;
    }
  }

  .q-card__section {
    margin: 0;
    padding: 0;
    line-height: 1;
    width: 100%;
    padding: 0px 10px 15px;
    width: 100%;

    /**投注项结果*/
    &.bet-item-result {
      margin: 0;
      padding: 10px;
    }

    /*  设置投注项分隔线 */
    &.bet-item-separator {
      padding: 0;
    }

    /**最后一个*/
    &.bet-item-separator-last {
      padding: 0;
    }
  }

  /**整体样式*/
  .q-card__actions {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;
    cursor: pointer;
  }

  .right-arrow {
    position: absolute;
    margin-left: 190px;
  }

  :deep(.empty-wrap) {
    margin-top: -200px;

    img {
      width: 100px !important;
    }
  }
}

.left-bg-box {
  height: 40px;
}
.left-preview {
  &:deep(.q-scrollarea__content){
        width: 100%;
        background: var(--q-gb-bg-c-30);
  }
}
</style>

