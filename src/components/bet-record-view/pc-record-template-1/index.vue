<!--
 * @Description: 投注记录菜单 未结算 已结算 预约
-->
<template>
  <!--投注记录内容-->
  <div class="bet-record-container" data-container="bet-record-container">
    <!--投注记录卡片-->
    <q-card flat class="bet-record-card full-width">
      <template v-for="(item, index) in ref_data.record_data.records" :key="index">
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
            <template v-if="[0, 1].includes(selected)">
              <div v-for="(order, order_index) in item.orderVOS" :key="'bet-item-' + index + '-' + order_index"
                class="bet-item  relative-position" :class="{ 'cursor-pointer': show_arrow(item, order) }"
                @click="go_match(item, order)">
                <!--卡片内容-->
                <q-card-section>
                  <!--投注记录中投注项 selected是否被选择 appoint_order_status预约状态 order_status订单状态pre_bet_amount提前结算金额-->
                  <bet-record-item :selected="selected" :appoint_order_status="appoint_order_status" :item="item" :index="index" :order="order"></bet-record-item>
                </q-card-section>
              </div>
            </template>
       
      
          </template>
          <q-card-section class="bet-item-separator"
            :class="{ 'bet-item-separator-last': (index == (record_data.records.length - 1)) }" :key="index"></q-card-section>
        </div>
      </template>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";

import BetRecordItem from "./bet-record-item.vue";
// import BetBookItem from "./bet-book-item.vue";
// import BetRecordResult from "./bet-record-result.vue";

import { api_betting } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js"
import lodash_ from "lodash"

onMounted(() => {
  get_record_list()
})

const ref_data = reactive({
  cur_page:1,
  page_size: 20,
  // 0:未结算 1:已结算 2: 预约
  selected: 0,
  load_data_state: 'loading',
  get_cashout_num:0,
  is_more_show:false,
  total_page:20,
  record_data:[],
  orderNo_list:[]

})

const send_cashout = null

/**
   * @description: 获取记录列表
   * @param {Number} cur_page 当前页 默认为第一页
   * @return {undefined} undefined
   */
const get_record_list = (cur_page = 1) => {
  let params = {
    page: cur_page,
    size: ref_data.page_size,
    orderStatus: ref_data.selected,
    timeType: 5  // 一个账务日
    // beginTime: this.begin_time,
    // endTime: this.end_time
  };
  ref_data.cur_page = cur_page
  ref_data.load_data_state = "loading";

  api_betting.post_getOrderList(params).then(res => {
    let code = lodashlodash_.get(res, 'code')
    let data = lodashlodash_.get(res,'data')
    if (code == 200) {
      // 投注记录
      let record_data = data;
      let record_fields;
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
        // 当前在第一页
        if (ref_data.cur_page == 1) {
          // 保存投注记录到变量
          ref_data.record_data = data;
          record_fields = lodash_.cloneDeep(data);
          record_fields.records = [];
          Object.assign(ref_data.record_data, record_fields);
          ref_data.record_data.records = [];
          ref_data.orderNo_list = []
        }
        if (!records) {
          // 投注记录不存在设置加载状态为empty
          ref_data.load_data_state = "empty";
          return;
        }
        // 最新数据替换，不同数据拼接在一起
        let orderNo_list_ = lodash_.map(ref_data.record_data.records, 'orderNo')
        lodash_.forEach(records, item => {
          if (lodash_.includes(orderNo_list_, item.orderNo)) {
            let index = lodash_.findIndex(ref_data.record_data.records, ['orderNo', item.orderNo]);
            // this.$set(ref_data.record_data.records, index, item)
          } else {
            ref_data.record_data.records.push(item)
          }
        })
        // this.record_data.records.push(...records);
        let record_list = lodash_.cloneDeep(ref_data.record_data.records);
        // 如果是已结算
        if (ref_data.selected) {
          // 投注记录对象话
          // get_record_obj(record_list);
        } else if (ref_data.selected == 0 && UserCtr.user_info.settleSwitch) {
          // 如果是未结算 且结算开关打开的调用提前结算确认中接口
        //  query_order_pre_settle_confirm(record_list);
          // 提前结算实时查询，取里面orderNo，做提前结算实时查询最新数据处理
        //  get_order_no()
        } else {
          // 其他情况投注记录对象话
          // get_record_obj(record_list);
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

</script>
<style lang="scss" scoped>
/**投注记录内容样式*/
.bet-record-container {
  ::v-deep .empty-wrap .img {
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

  /* ::v-deep .load-data-wrap
    &.not-list
      // margin-top: 80% */
  .right-arrow {
    position: absolute;
    margin-left: 190px;
  }

  ::v-deep .empty-wrap {
    margin-top: -200px;

    img {
      width: 100px !important;
    }
  }
}
</style>