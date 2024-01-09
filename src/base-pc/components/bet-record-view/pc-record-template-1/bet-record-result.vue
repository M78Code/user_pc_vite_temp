<!--

 * @Description: 投注记录，投注结果部分
-->
<template>
  <div>
    <div class="row">
      <div class="col bet-money">
        <template v-if="[0,1].includes(BetRecordLeft.selected)">
          <!--投注额-->
          {{i18n_t('common.bets_val')}}
        </template>
        <template v-else-if="BetRecordLeft.selected==2">
          <!-- 预约投注额 -->
          {{i18n_t("bet.bet_book_stake")}}
        </template>
        <!-- 投注额 -->
      </div>
      <div class="col-auto bet-money">
        <!--最高可赢-->
        <template v-if="[0,2].includes(BetRecordLeft.selected)">{{i18n_t('common.maxn_amount_val')}}</template>
        <!--返还金额-->
        <template v-if="BetRecordLeft.selected==1">{{i18n_t('common.donate_win')}}</template>
        <!-- 可赢额 -->
      </div>
    </div>
    <div class="row bet-win-input">
      <div class="col bet-value">
       {{ format_currency(item.orderAmount) }}
      </div>
      <div class="col-auto bet-value" :class="{'red-text':(item.outcome=='4' || item.outcome=='5')}">
        <template v-if="[0,2].includes(BetRecordLeft.selected)">
          {{  format_currency(item.maxWinAmount) }}
        </template>
        <template v-if="BetRecordLeft.selected==1">
          {{ format_currency(item.backAmount) }}
        </template>
      </div>
    </div>
    <template v-if="item.addition!= '0.00'">
      <div class="row bet-win-money yb-fontsize12">
        <div class="col">
          <div class="bet-addition">
            [{{item.addition}}]
          </div>
        </div>
        <!--¥300.00-->
        <div class="col-auto"></div>
      </div>
    </template>
    <!-- 专业版单关 未结算 可以提前结算 -->
    <template v-if="item.seriesType=='1'">
      <div class="info-wrap">
        <!--选择的是未结算 且settleSwitch开关为1且enablePreSettle为true -->
        <template v-if="BetRecordLeft.selected==0 && UserCtr.settleSwitch && item.enablePreSettle">
          <!--账户有钱且是开盘状态且结算状态为1-->
          <template v-if="ref_data.amount > 1 && lodash_.get(item,'orderVOS.0.hs')==0 && item.cash_out_status==1">
            <!--settleType 1 未发生提前结算(支持全额)4已发生 部分提前部分结算(支持部分),5 已发生提前全结算(支持全部),3 提前结算取消-->
            <template v-if="ref_data.bet_pre_code!='0400524' || [4,5].includes(item.settleType) || item.pre_settle_order_status==2">
              <div class="row">
                <!--提前结算提示语-->
                <div class="col bet-pre-title">
                  <template v-if="ref_data.bet_pre_code>1 && ref_data.bet_pre_code!='0400524'">
                    <span style="color:red">
                      <template v-if="ref_data.bet_pre_code=='0400527'">
                        <!--功能暂停中，请稍后再试-->
                        {{i18n_t('bet_record.pre_suspend')}}
                      </template>
                      <template v-else-if="ref_data.bet_pre_code=='0400537'">
                        <!--提前结算金额调整中，请再试一次-->
                        {{i18n_t('bet_record.pre_amount_change')}}
                      </template>
                      <template v-else>
                        <!--提前结算申请未通过-->
                        {{i18n_t('bet_record.pre_not_approved')}}
                      </template>
                    </span>
                  </template>
                  <template v-else>
                    <!--提前结算金额已包含本金-->
                    <span>{{i18n_t('bet_record.pre_bet_include_money')}}</span>
                  </template>
                </div>
              </div>
            </template>
            <!--提前结算开始-->
            <!---提前结算按钮状态不存在或者为default时显示提前结算按钮--->
            <template v-if="!item.bet_status || item.bet_status == 'default'">
              <div class="row">
                <div class="bet-pre-wrap">
                  <!-- 提前结算按钮-->
                  <div class="bet-pre-btn" @click.stop="start_bet_pre()">
                    <!-- 提前结算-->
                    <div class="bet-row-1">{{i18n_t("bet_record.settlement_pre")}} </div>
                    <div class="bet-row-2">{{ format_balance(ref_data.amount) }}
                    </div>
                  </div>
                  <!--提前结算按钮右侧icon按钮,点击可以展开提前结算滑块显示-->
                  <div class="bet-pre-handle"
                    @click.stop="show_bet_pre(index)" v-if="UserCtr.pcs=='1'">
                    <!-- <icon name="icon-bet_pre" class="bet-pre-info" size="14px" :class="{'bet-pre-over':ref_data.cur_bet_pre.show_operate=='bet_pre'}"/> -->
                  </div>
                </div>
              </div>
            </template>
            <template v-if="item.bet_status=='start_bet_pre'">
              <div class="row" :class="{'mt0': item.settleType==1}">
                <!--提前结算确认中 、确认提前结算-->
                <div class="col bet-pre-confirming-btn" @click="bet_handle(item.orderNo)">
                  <div class="bet-pre-left">
                    <!-- 确认中...|确认提前结算 -->
                    <div class="bet-row-1">{{item.bet_confirm?i18n_t("bet_record.confirm"):i18n_t("bet_record.confirm_bet_pre")}}</div>
                    <div class="bet-row-2">{{ format_balance(ref_data.amount) }}</div>
                  </div>
                  <div class="bet-pre-right" v-if="item.bet_confirm">
                    <template v-if="['theme01','theme02'].includes(UserCtr.theme)">
                      <img :src="(`/image/wwwassets/yabo/gif/${UserCtr.theme}/${UserCtr.theme}_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                    <template v-else>
                      <img :src="(`/image/wwwassets/yabo/gif/${UserCtr.theme}/${UserCtr.theme}_pre_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <!--提前结算结算成功按钮显示-->
            <template v-else-if="item.bet_status=='end_bet_pre'">
              <div class="bet-pre-complete-btn" :class="{'mt0': item.settleType==1}">
                <div class="bet-pre-left">
                  <!-- 已提前结算 成功 item.probabilities-->
                  <div class="bet-row-1">{{i18n_t("bet_record.finish_bet_pre")}}</div>
                  <div class="bet-row-2">{{ format_balance(ref_data.amount) }}</div>
                </div>
                <div class="bet-pre-right">
                  <!-- <icon name="icon-success" size="18px" color="#FFF"/> -->
                </div>
              </div>
            </template>
            <!--提前结算提示及滑块显示-->
            <template v-if="false">
              <template v-if="show_count_operate">
                  <div class="row">
                    <!-- 结算投注额 -->
                    <div class="col bet-pre-money">
                      {{i18n_t('bet_record.pre_bet_money')}}:<span class="bet-money">{{money_obj.money|format_currency}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 bet-compute-money">
                      <!--提前结算滑块展示-->
                      <!-- <vue-slider
                        :ref="`vue-slider-${index}`"
                        :adsorb="true"
                        :minRange="money_obj.min_money"
                        :maxRange="money_obj.max_money"
                        v-model="money_obj.money"
                        :data="money_obj.bet_amount_data"
                        :data-value="'id'"
                        :data-label="'name'"
                        :dot-options="[{tooltip:'none'}]"
                        @change="change_slider"
                        >
                        <template v-slot:label="{ label, active }">
                          <div :class="['vue-slider-mark-label', 'custom-label', {active}]">{{ label }}%</div>
                        </template>
                      </vue-slider> -->
                    </div>

                  </div>
              </template>
                <!--提前结算提示部分-->
              <template>
                <div class="col-12 bet-pre-Remaining">
                      <!-- 注单剩余本金 -->
                      {{i18n_t("bet_record.settlement_bet_remaining")}}: {{ lodash_.get(item,'preSettleBetAmount')|format_currency }}
                    </div>
                    <div class="col-12 bet-pre-count">
                      <!-- 提前结算可用次数 -->
                      {{i18n_t("bet_record.settlement_bet_count")}}: {{ betPreCount }}
                    </div>
                <div v-if="!show_count_operate" class="row">
                  <!-- <icon name="icon-tips" class="bet-info" size="14px" /> -->
                  <div class="col bet-tips-info">
                    <!-- TIPS:部分结算后,剩余本金不支持再次提前结算! -->
                    <span>
                      <template>
                         <!--仅支持全额结算-->
                        {{i18n_t('bet_record.settlement_only_full')}}
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </template>
          </template>

          <!--暂停提前结算-->
          <template v-else-if="false">
            <!--当点击提前结算的时候遇到封关盘 给个提示提前结算申请未通过-->
            <div class="bet-pre-stop-tip" v-if="is_cancel"> {{i18n_t('bet_record.pre_not_approved')}}</div>
            <div class="row">
              <!--暂停提前结算-->
              <div class="col bet-pre-wrap bet-pre-stop">
                <div class="bet-pre-btn">
                  {{i18n_t('bet_record.pre_bet_stop')}}
                </div>
                <div class="bet-pre-handle" v-if="UserCtr.pcs=='1'">
                  <!-- <icon name="icon-bet_pre" class="bet-pre-info" size="14px" color="#99A3B1"/> -->
                </div>
              </div>
            </div>
          </template>
        </template>
        <!--已结算下部分提前结算和全部结算显示分隔符-->
        <hr class="bet-result-separator" v-if="BetRecordLeft.selected==1 && [4,5].includes(item.settleType)" />
        <!--部分以及全部结算展示与隐藏按钮切换-->
        <template v-if="[3,4,5].includes(item.settleType)">
          <div class="row" @click="show_bet_pre_info(item.orderNo)">
            <div class="col yb-fontsize12 yb-flex-between cursor-pointer" >
              <span>{{i18n_t('bet_record.settlement_pre_info')}}</span>
              <span>
                <!-- <icon
                  name="icon-triangle"
                  size="16px"
                  :class="{'icon-pull-down': ref_data.cur_bet_pre.show_detail, 'icon-pull-up': !ref_data.cur_bet_pre.show_detail}"
                /> -->
              </span>
            </div>
          </div>
        </template>
        <!--提前结算详情部分-->
        <template v-if="ref_data.cur_bet_pre.show_detail && pre_order_list">
          <template v-for="(obj, order_index) in pre_order_list" :key="'head-'+order_index"> 
            <div  class="row" :class="{'pt10': order_index>0}">
              <div class="col yb-fontsize12 yb-flex-between cursor-pointer">
                <template v-if="obj.type==3">
                  <!--剩余本金结算显示-->
                  <span class="orange">{{i18n_t('bet_record.settlement_pre_surplus')}}</span>
                </template>
                <template v-else>
                  <!--点击拷贝订单号图标-->
                  <span class="order-copy">
                    <span class="order-no">{{obj.preOrderNo}}</span>
                    <span
                      class="copy"
                      @click="copy(obj.preOrderNo)"
                    >
                      <!-- <icon name="icon-icon_copy"/> -->
                    </span>
                  </span>
                </template>
                <!--结算时间展示-->
                <span>{{formatTime(obj.createTime,'hh:MM')}}</span>
              </div>
            </div>
            <template v-if="obj.orderStatus==2">
              <div :key="'tip-'+order_index" class="row">
                <div class="col">
                  <span class="red-bg">{{i18n_t("common.cancel")}}</span>
                </div>
              </div>
            </template>
            <div class="bet-detail-info">
              <div class="row">
                <!--结算本金-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('bet_record.settlement_money')}}<template v-if="obj.type==1">({{i18n_t('bet_record.part')}})</template></span>
                  <span>{{(obj.orderStatus==2?0.00:obj.preBetAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--返还金额-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('common.donate_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.settleAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--输/赢-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('bet_record.lose_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.profit)|format_currency}}</span>
                </div>
              </div>
              <template v-if="obj.type==1 && obj.orderStatus!=2">
                <!--剩余本金-->
                <div class="row">
                  <div class="col yb-fontsize12 yb-flex-between">
                    <span>{{i18n_t('bet_record.surplus')}}</span>
                    <span>{{obj.remainingBetAmount|format_currency}}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <!--已复制弹出框-->
      <div class="toast" v-if="toast">{{i18n_t("bet_record.copyed")}}</div>
    </template>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue"
import { format_odds, format_currency, formatTime } from "src/output/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"

import lodash_ from "lodash"
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {},
  order: {},
})

const toast = ref(false)

const ref_data = reactive({
 bet_pre_code: 0, // 提前结算编码 0 未结算 1 结算成功 其他结算失败 0400524(提示结算为通过审核) 0400500(按钮置灰)
 amount: 1.00, // 按钮上的显示金额
 cur_bet_pre: {},
 more_index: -1,//查看更多按钮index
})
</script>
<style lang="scss" scoped>
.pt10 {
  padding-top: 10px;
}
.mt0 {
  margin-top: 0;
}
.info-wrap {
  .row {
    margin-top: 10px;
  }
  /*提前结算提示语*/
  .bet-pre-title,
  .bet-pre-money {
    font-size: 12px;
    text-align: center;
  }
  .bet-pre-money {
    text-align: left;
  }
  .bet-tips-info {
    font-size: 12px;
  }
  .record-item {
    margin-top: 10px;
  }
  .red-bg {
    display: inline-block;
    margin-right: 5px;
    width: 38px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
  }
  .bet-info {
    cursor: pointer;
    margin-right: 5px;
    margin-top: -2px;
  }
  /* 提前结算 */
  .bet-pre-wrap {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 0px;
    .bet-pre-btn {
      flex: 1;
      height: 40px;
      font-size: 12px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      div {
        height: 20px;
        &.bet-row-1 {
          margin-top: 6px;
        }
        &.bet-row-2 {
          margin-top: -3px;
        }
      }
      &:hover {
        cursor: pointer;
        .bet-row-1,
        .bet-row-2 {
          color: var(--q-gb-t-c-1) !important;
        }
      }
    }
    .bet-pre-handle {
      width: 30px;
      cursor: pointer;
      .bet-pre-info {
        margin-left: 10px;
      }
    }
    &.bet-pre-stop {
      .bet-pre-btn {
        border: 0px;
        border-radius: 4px;
        cursor: not-allowed;
        line-height: 40px;
      }
    }
  }
  .bet-pre-confirming-btn,
  .bet-pre-complete-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    column-count: 3;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    .bet-pre-left {
      width: 80%;
      height: 100%;
      text-align: center;
      div {
        height: 20px;
        &.bet-row-1 {
          margin-top: 5px;
        }
        &.bet-row-2 {
          margin-top: -3px;
        }
      }
    }
    .bet-pre-right {
      margin-top: 3px;
    }
  }
  .bet-pre-complete-btn {
    margin-top: 10px;
    cursor: unset;
  }
  .bet-money {
    margin-left: 5px;
  }
  .bet-result-separator {
    margin-top: 10px;
    border: 0;
  }
  .bet-compute-money {
    margin-bottom: 25px;
    :deep(.vue-slider) {
      cursor: pointer;
      .vue-slider-rail {
        .vue-slider-marks {
          .vue-slider-mark {
            .custom-label {
              width: 22px;
              height: 10px;
              font-family: PingFangSC-Regular;
              font-size: 10px;
              margin-left: -5px;
            }
            &:first-child {
              .custom-label {
                opacity: 0;
              }
            }
            &:last-child {
              .custom-label {
                margin-left: -20px;
              }
            }
          }
        }
      }
      .vue-slider-mark-step {
        width: 1px;
        height: 3px;
        margin-top: 6px;
        border-radius: 0;
      }
    }
  }
  .bet-detail-info {
    .row {
      padding: 5px 10px;
      margin-bottom: -9px;
    }
    &:last-child {
      margin-bottom: 10px;
    }
  }

  /*  箭头向下样式 */
  .icon-pull-down:before {
    transform: rotate(180deg);
    margin-left: 6px;
  }
  /*  箭头向上样式 */
  .icon-pull-up:before {
    transform: rotate(0deg);
    margin-left: 6px;
  }
  .order-copy {
    display: flex;
    flex-wrap: nowrap;
    .order-no {
      display: block;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.toast {
  position: fixed;
  top: 50%;
  left: 110px;
  padding: 0 20px;
  height: 36px;
  border-radius: 2px;
  text-align: center;
  line-height: 36px;
  transform: translate(-50%, -50%);
  z-index: 3;
}
.bet-pre-stop-tip{
  text-align: center;
  color: #f00;
  margin-right: 15px;
  padding: 10px 0 0px 0;
}


</style>