<!--
 * @Description: 投注记录菜单 未结算 已结算 预约
-->
<template>
  <!-- 投注记录 -->
  <v-scroll-area ref="ref_bet_scroll_area_history" position="bet_history" :observer_area="3" :observer_middle="true">
    <!-- 滚动：头部 --------------------------------->
    <template v-slot:header>
      <div class="left-bg-box"></div>
      <bet-record-header />
    </template>
    <!-- 滚动：内容 --------------------------------->
    <!--投注记录内容-->
    <div class="bet-record-container" data-container="bet-record-container">
      <!--投注记录卡片-->
      <q-card flat class="bet-record-card full-width">
        <template v-for="(item, index) in ref_data.record_data" :key="index">
          <!--单关start (0:未结算,1:已结算,2:注单取消,3:确认中,4:投注失败)-->
          <div class="border-shq-card-actionsadow">
            <!--卡片标题-->
            <q-card-actions :class="{ 'bet-separator': !item.is_expand }" :key="'actions-' + index"
              @click="change_handle(item)">
              <!--单关还是串关-->
              <div class="bet-record-title">{{ item.seriesValue }}</div>
              <div class="bet-record-title">
                <!--输赢结算状态2是走水，3-输，4-赢，5-半赢，6-半输，7赛事取消，8赛事延期 -->
                <!--订单状态(0:未结算,1:已结算,2:注单取消,3:确认中,4:投注失败)-->
                <span :class="order_class(item.orderStatus)">{{ order_status(item.orderStatus) }}</span>
              </div>
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
                <bet-record-result :index="index" :item="item" :orderNo_data_list="ref_data.orderNo_data_list"
                  :orderNo_data_obj="ref_data.orderNo_data_obj" ></bet-record-result>
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
import BetBookItem from "./bet-book-item.vue";
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

onMounted(() => {
  get_record_list({
    orderStatus: 0,
    timeType: 5 
  })
  useMittOn(MITT_TYPES.EMIT_GET_RECORD_LIST, get_record_list).on
})

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_GET_RECORD_LIST, get_record_list).off
})

const ref_data = reactive({
  cur_page: 1,
  page_size: 20,
  load_data_state: 'loading',
  get_cashout_num: 0,
  is_more_show: false,
  total_page: 20,
  record_data: [],
  orderNo_data_obj:[],
  orderNo_data_list:[],
  send_cashout:null,

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

  BetRecordLeft.api_url(params).then(res => {

    let code = lodash_.get(res, 'code')
    let data = lodash_.get(res, 'data')
    if (code == 200) {

      // 过滤订单未结算状态
      ref_data.orderNo_data_obj = lodash_.filter(data, {'orderStatus': 0});
      ref_data.orderNo_data_list = lodash_.map(ref_data.orderNo_data_obj, 'orderNo');
      // 判断每5秒实时拉取新的投注额maxout是否为null，是则重新拉取列表数据
      count_cashout(ref_data.orderNo_data_obj)

      // 投注记录
      let record_data = data;
      let records = data && data.records;
      // 当maxcashout为null时，定时1秒重新拉次数据，最多查询5次
      let records_ = lodash_.filter(records, { 'enablePreSettle': true, 'orderStatus': '0', 'initPresettleWs': true });
      let maxcashout_list = lodash_.map(records_, 'maxCashout')
      // 判断提前结算实时查询返回集合数据的投注额有null
      // 投注额有null时，拉取数据，超过4次都为null，不再拉取
      if (lodash_.includes(maxcashout_list, null)) {
        ref_data.get_cashout_num++;
        if (ref_data.get_cashout_num <= 4) {
          // 清除重新拉取投注记录定时器
          clear_send_cashout()
          send_cashout = setTimeout(() => {
            // 重新拉取列表数据
            get_record_list(ref_data.cur_page);
          }, 1000)
        } else {
          ref_data.get_cashout_num = 0
        }
      } else {
        ref_data.get_cashout_num = 0
      }
      // get_cashout_num ===0是代表提前结算的单子里面maxcashout没有 null
      if (ref_data.get_cashout_num === 0) {
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

        if (!records) {
          // 投注记录不存在设置加载状态为empty
          ref_data.load_data_state = "empty";
          return;
        }
        // 切换后需要置空
        if (cur_page == 1) {
          ref_data.record_data = []
        }
        // 最新数据替换，不同数据拼接在一起
        let orderNo_list_ = lodash_.map(ref_data.record_data, 'orderNo')
        lodash_.forEach(records, item => {
          if (lodash_.includes(orderNo_list_, item.orderNo)) {
            // this.$set(ref_data.record_data, index, item)
          } else {
            ref_data.record_data.push(item)
          }
        })
        // 如果是已结算
        // 提前结算开关打开时订阅提前结算注单
        if (BetRecordLeft.selected == 0 && UserCtr.settleSwitch) {
          // 订阅C21
          // this.SCMD_C21();
        }
      }
    } else {
      if (code == '0401038') {
        ref_data.load_data_state = "api_limited";
      } else {
        ref_data.load_data_state = "empty";
      }
      //清除提前结算实时查询定时器
      clear_timer_get_cashout()
    }
  }).catch(err => { console.error(err) });
}

/**
 * @description: 判断没5秒拉取新的投注额maxout是否为null，是则重新拉取列表数据
 */
const count_cashout = (orderNo_data_obj) => {
  // 当返回preSettleMaxWin为null时，定时1秒重新拉次数据
  let maxcashout_list =lodash_.map(orderNo_data_obj, 'preSettleMaxWin')
  // 判断提前结算实时查询返回集合数据的投注额maxout有null
  if (lodash_.includes(maxcashout_list, null)) {
    // 清除重新拉取投注记录定时器
    clear_send_cashout()
    ref_data.send_cashout = setTimeout(() => {
      // 重新拉取列表数据
      get_record_list(ref_data.cur_page);
    }, 1000)
  }
}
// 清除重新拉取投注记录定时器
const clear_timer_get_cashout = () => {
  if (ref_data.send_cashout) {
    clearTimeout(ref_data.send_cashout);
    ref_data.send_cashout = undefined
  }
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

    i {
      position: absolute;
      top: 8px;
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
</style>

