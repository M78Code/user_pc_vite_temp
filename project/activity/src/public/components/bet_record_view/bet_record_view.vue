<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录菜单 未结算 已结算 预约
-->
<template>
  <load-data :state="load_data_state" :no_data_msg="$root.$t('common.empty_data')">
    <!--投注记录内容-->
    <div class="bet-record-container" data-container="bet-record-container">
        <!--投注记录卡片-->
        <q-card flat class="bet-record-card full-width">
          <template v-for="(item, index) in record_data.records">
            <!--单关start (0:未结算,1:已结算,2:注单取消,3:确认中,4:投注失败)-->
            <div class="border-shq-card-actionsadow" :key="index">
            <!--卡片标题-->
              <q-card-actions
                :class="{'bet-separator': !item.is_expand}"
                :key="'actions-'+index"
                @click="change_handle(item)"
              >
                <!--单关还是串关-->
                <div class="bet-record-title seriesValue">{{item.seriesValue}}</div>
                <div class="bet-record-title">
                  <!--输赢结算状态2是走水，3-输，4-赢，5-半赢，6-半输，7赛事取消，8赛事延期 -->
                  <!--订单状态(0:未结算,1:已结算,2:注单取消,3:确认中,4:投注失败)-->
                  <span
                    :class="order_class(item.orderStatus)"
                  >{{order_status(item.orderStatus)}}</span>
                </div>
              </q-card-actions>
              <!--结算内容-->
              <template v-if="item.is_expand">
              <!-- 0:未结算 1:已结算 2: 预约 -->
                <template v-if="[0,1].includes(selected)">
                  <div v-for="(order, order_index) in item.orderVOS" :key="'bet-item-'+index+'-'+order_index" class="bet-item  relative-position" :class="{'cursor-pointer': show_arrow(item, order)}" @click="go_match(item, order)">
                    <!--卡片内容-->
                    <q-card-section>
                      <!--投注记录中投注项 selected是否被选择 appoint_order_status预约状态 order_status订单状态pre_bet_amount提前结算金额-->
                      <bet-record-item
                        :selected="selected"
                        :appoint_order_status="appoint_order_status"
                        :order_status="item.orderStatus"
                        :preOrder="item.preOrder"
                        :ac_code="item.acCode"
                        :series_type="item.seriesType"
                        :addition="item.addition"
                        :lang_code="item.langCode"
                        :pre_bet_amount="item.preBetAmount"
                        :out_come="item.outcome"
                        :index="index"
                        :order="order"
                      ></bet-record-item>
                    </q-card-section>
                  </div>
                </template>
                <!-- 预约项 -->
                <template v-else>
                  <div v-for="(order, order_index) in item.detailList" :key="'bet-item-'+index+'-'+order_index" class="bet-item  relative-position" :class="{'cursor-pointer': show_arrow(item, order)}" @click="go_match(item, order)">
                    <!--卡片内容-->
                    <q-card-section>
                      <!--投注记录中预约项-->
                      <bet-book-item
                        :selected="selected"
                        :appoint_status="item.preOrderStatus"
                        :appoint_order_status="appoint_order_status"
                        :order_status="item.orderStatus"
                        :ac_code="item.acCode"
                        :series_type="item.seriesType"
                        :addition="item.addition"
                        :lang_code="item.langCode"
                        :pre_bet_amount="item.preBetAmount"
                        :out_come="item.outcome"
                        :orderNo="item.orderNo"
                        :index="index"
                        :order="order"
                      ></bet-book-item>
                    </q-card-section>
                  </div>
                </template>
                <q-card-section
                  class="bet-item-result"
                  :key="'bet-result-'+index">
                  <!--结算结果-->
                  <bet-record-result
                    :index="index"
                    :selected="selected"
                    :item_obj="item"
                    :orderNo_data_list="orderNo_data_list"
                    :orderNo_data_obj="orderNo_data_obj"
                    :profit_amount="item.profitAmount"
                    :back_amount="item.backAmount"
                    :addition="item.addition"
                    :order_amount="item.orderAmountTotal"
                    :bet_pre_amount="item.setBetAmount"
                    :win_amount="item.maxWinAmount"
                    :out_come="item.outcome"
                    @res_timer_get_cashout = "res_timer_get_cashout"
                    @clear_timer_get_cashout="clear_timer_get_cashout"
                  ></bet-record-result>
                </q-card-section>
              </template>
              <q-card-section
              class="bet-item-separator"
              :class="{'bet-item-separator-last':(index==(record_data.records.length-1))}"
              :key="index"></q-card-section>
            </div>
          </template>
        </q-card>
    </div>
  </load-data>
</template>
<script>
import bet_record_view from "src/public/mixins/bet_record_view/bet_record_view.js";
export default {
  mixins: [bet_record_view]
};
</script>
<style lang="scss" scoped>
/**投注记录内容样式*/
.bet-record-container {
  background: var(--qq--bet-main-content-bg-color) !important;
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
   /*  设置伪元素样式 */
  .seriesValue{
    &::before {
        display: inline-block;
        height: 14px;
        border-radius:0 2px 2px 0;
        transform: translateX(-10px) translateY(2px);
        content: "";
        width: 3px;
        background: var(--qq--theme-bg-play-name-before);
      }
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
