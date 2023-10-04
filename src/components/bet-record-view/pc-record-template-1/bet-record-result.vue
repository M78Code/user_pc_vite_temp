<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录，投注结果部分
-->
<template>
  <div>
    <div class="row">
      <div class="col bet-money">
        <template v-if="[0,1].includes(selected)">
          <!--投注额-->
          {{in8n_t('common.bets_val')}}
        </template>
        <template v-else-if="selected==2">
          <!-- 预约投注额 -->
          {{in8n_t("bet.bet_book_stake")}}
        </template>
        <!-- 投注额 -->
      </div>
      <div class="col-auto bet-money">
        <!--最高可赢-->
        <template v-if="[0,2].includes(selected)">{{in8n_t('common.maxn_amount_val')}}</template>
        <!--返还金额-->
        <template v-if="selected==1">{{in8n_t('common.donate_win')}}</template>
        <!-- 可赢额 -->
      </div>
    </div>
    <div class="row bet-win-input">
      <div class="col bet-value">
       {{ format_currency(order_amount) }}
      </div>
      <div class="col-auto bet-value" :class="{'red-text':(out_come=='4' || out_come=='5')}">
        <template v-if="[0,2].includes(selected)">
          {{  format_currency(win_amount) }}
        </template>
        <template v-if="selected==1">
          {{ format_currency(back_amount) }}
        </template>
      </div>
    </div>
    <template v-if="addition != '0.00'">
      <div class="row bet-win-money yb-fontsize12">
        <div class="col">
          <div class="bet-addition">
            [{{addition}}]
          </div>
        </div>
        <!--¥300.00-->
        <div class="col-auto"></div>
      </div>
    </template>
    <!--
      专业版单关 未结算 可以提前结算
    -->
    <template v-if="item_obj.seriesType=='1'">
      <div class="info-wrap">
        <!--选择的是未结算 且settleSwitch开关为1且enablePreSettle为true 且initPresettleWs为true（优先级高过且enablePreSettle 且结算状态不等于-2）-->
        <template v-if="selected==0 && vx_get_user.settleSwitch && item_obj.enablePreSettle && item_obj.initPresettleWs && item_obj.cash_out_status!=-2">
          <!--账户有钱且是开盘状态且结算状态为1-->
          <template v-if="amount > 1 && _.get(item_obj,'orderVOS.0.hs')==0 && item_obj.cash_out_status==1">
            <!--settleType 1 未发生提前结算(支持全额)4已发生 部分提前部分结算(支持部分),5 已发生提前全结算(支持全部),3 提前结算取消-->
            <template v-if="bet_pre_code!='0400524' || [4,5].includes(item_obj.settleType) || item_obj.pre_settle_order_status==2">
              <div class="row">
                <!--提前结算提示语-->
                <div class="col bet-pre-title">
                  <template v-if="bet_pre_code>1 && bet_pre_code!='0400524'">
                    <span style="color:red">
                      <template v-if="bet_pre_code=='0400527'">
                        <!--功能暂停中，请稍后再试-->
                        {{in8n_t('bet_record.pre_suspend')}}
                      </template>
                      <template v-else-if="bet_pre_code=='0400537'">
                        <!--提前结算金额调整中，请再试一次-->
                        {{in8n_t('bet_record.pre_amount_change')}}
                      </template>
                      <template v-else>
                        <!--提前结算申请未通过-->
                        {{in8n_t('bet_record.pre_not_approved')}}
                      </template>
                    </span>
                  </template>
                  <template v-else>
                    <!--提前结算金额已包含本金-->
                    <span>{{in8n_t('bet_record.pre_bet_include_money')}}</span>
                  </template>
                </div>
              </div>
            </template>
            <!--提前结算开始-->
            <!---提前结算按钮状态不存在或者为default时显示提前结算按钮--->
            <template v-if="!item_obj.bet_status || item_obj.bet_status == 'default'">
              <div class="row">
                <div class="bet-pre-wrap">
                  <!-- 提前结算按钮-->
                  <div class="bet-pre-btn" @click.stop="start_bet_pre()">
                    <!-- 提前结算-->
                    <div class="bet-row-1">{{in8n_t("bet_record.settlement_pre")}} </div>
                    <div class="bet-row-2">{{amount | format_balance}}
                    </div>
                  </div>
                  <!--提前结算按钮右侧icon按钮,点击可以展开提前结算滑块显示-->
                  <div class="bet-pre-handle"
                    @click.stop="show_bet_pre(index)" v-if="vx_get_user.pcs=='1'">
                    <icon name="icon-bet_pre" class="bet-pre-info" size="14px" :class="{'bet-pre-over':cur_bet_pre.show_operate=='bet_pre'}"/>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="item_obj.bet_status=='start_bet_pre'">
              <div class="row" :class="{'mt0': item_obj.settleType==1}">
                <!--提前结算确认中 、确认提前结算-->
                <div class="col bet-pre-confirming-btn" @click="bet_handle(item_obj.orderNo)">
                  <div class="bet-pre-left">
                    <!-- 确认中...|确认提前结算 -->
                    <div class="bet-row-1">{{item_obj.bet_confirm?in8n_t("bet_record.confirm"):in8n_t("bet_record.confirm_bet_pre")}}</div>
                    <div class="bet-row-2">{{amount | format_balance}}</div>
                  </div>
                  <div class="bet-pre-right" v-if="item_obj.bet_confirm">
                    <template v-if="['theme01','theme02'].includes(vx_get_theme)">
                      <img :src="(`/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                    <template v-else>
                      <img :src="(`/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_pre_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <!--提前结算结算成功按钮显示-->
            <template  v-else-if="item_obj.bet_status=='end_bet_pre'">
              <div class="bet-pre-complete-btn" :class="{'mt0': item_obj.settleType==1}">
                <div class="bet-pre-left">
                  <!-- 已提前结算 成功 item_obj.probabilities-->
                  <div class="bet-row-1">{{in8n_t("bet_record.finish_bet_pre")}}</div>
                  <div class="bet-row-2">{{amount | format_balance}}</div>
                </div>
                <div class="bet-pre-right">
                  <icon name="icon-success" size="18px" color="#FFF"/>
                </div>
              </div>
            </template>
            <!--提前结算提示及滑块显示-->
            <template v-if="cur_bet_pre.show_operate=='bet_pre' && more_index == index">

            <template v-if="show_count_operate">
                <div class="row">
                  <!-- 结算投注额 -->
                  <div class="col bet-pre-money">
                    {{in8n_t('bet_record.pre_bet_money')}}:<span class="bet-money">{{money_obj.money|format_currency}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 bet-compute-money">
                    <!--提前结算滑块展示-->
                    <vue-slider
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
                    </vue-slider>
                  </div>

                </div>
            </template>
                <!--提前结算提示部分-->
              <template>
                <div class="col-12 bet-pre-Remaining">
                      <!-- 注单剩余本金 -->
                      {{in8n_t("bet_record.settlement_bet_remaining")}}: {{ _.get(item_obj,'preSettleBetAmount')|format_currency }}
                    </div>
                    <div class="col-12 bet-pre-count">
                      <!-- 提前结算可用次数 -->
                      {{in8n_t("bet_record.settlement_bet_count")}}: {{ betPreCount }}
                    </div>
                <div v-if="!show_count_operate" class="row">
                  <icon
                    name="icon-tips"
                    class="bet-info"
                    size="14px"
                  />
                  <div class="col bet-tips-info">
                    <!-- TIPS:部分结算后,剩余本金不支持再次提前结算! -->
                    <span>
                      <template>
                         <!--仅支持全额结算-->
                        {{in8n_t('bet_record.settlement_only_full')}}
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </template>
          </template>
          <!--暂停提前结算-->
          <template v-else-if="amount<1 || _.get(item_obj,'orderVOS.0.hs')!=0 || item_obj.cash_out_status==-1">
            <!--当点击提前结算的时候遇到封关盘 给个提示提前结算申请未通过-->
            <div class="bet-pre-stop-tip" v-if="is_cancel"> {{in8n_t('bet_record.pre_not_approved')}}</div>
            <div class="row">
              <!--暂停提前结算-->
              <div class="col bet-pre-wrap bet-pre-stop">
                <div class="bet-pre-btn">
                  {{in8n_t('bet_record.pre_bet_stop')}}
                </div>
                <div class="bet-pre-handle" v-if="vx_get_user.pcs=='1'">
                  <icon name="icon-bet_pre" class="bet-pre-info" size="14px" color="#99A3B1"/>
                </div>
              </div>
            </div>
          </template>
        </template>
        <!--已结算下部分提前结算和全部结算显示分隔符-->
        <hr class="bet-result-separator" v-if="selected==1 && [4,5].includes(item_obj.settleType)" />
        <!--部分以及全部结算展示与隐藏按钮切换-->
        <template v-if="[3,4,5].includes(item_obj.settleType)">
          <div class="row" @click="show_bet_pre_info(item_obj.orderNo)">
            <div class="col yb-fontsize12 yb-flex-between cursor-pointer" >
              <span>{{in8n_t('bet_record.settlement_pre_info')}}</span>
              <span>
                <icon
                  name="icon-triangle"
                  size="16px"
                  :class="{'icon-pull-down': cur_bet_pre.show_detail, 'icon-pull-up': !cur_bet_pre.show_detail}"
                />
              </span>
            </div>
          </div>
        </template>
        <!--提前结算详情部分-->
        <template v-if="cur_bet_pre.show_detail && pre_order_list">
          <template v-for="(obj, order_index) in pre_order_list">
            <div :key="'head-'+order_index" class="row" :class="{'pt10': order_index>0}">
              <div class="col yb-fontsize12 yb-flex-between cursor-pointer">
                <template v-if="obj.type==3">
                  <!--剩余本金结算显示-->
                  <span class="orange">{{in8n_t('bet_record.settlement_pre_surplus')}}</span>
                </template>
                <template v-else>
                  <!--点击拷贝订单号图标-->
                  <span class="order-copy">
                    <span class="order-no">{{obj.preOrderNo}}</span>
                    <span
                      class="copy"
                      @click="copy(obj.preOrderNo)"
                    >
                      <icon name="icon-icon_copy"/>
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
                  <span class="red-bg">{{in8n_t("common.cancel")}}</span>
                </div>
              </div>
            </template>
            <div :key="'content-'+order_index" class="bet-detail-info">
              <div class="row">
                <!--结算本金-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{in8n_t('bet_record.settlement_money')}}<template v-if="obj.type==1">({{in8n_t('bet_record.part')}})</template></span>
                  <span>{{(obj.orderStatus==2?0.00:obj.preBetAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--返还金额-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{in8n_t('common.donate_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.settleAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--输/赢-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{in8n_t('bet_record.lose_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.profit)|format_currency}}</span>
                </div>
              </div>
              <template v-if="obj.type==1 && obj.orderStatus!=2">
                <!--剩余本金-->
                <div class="row">
                  <div class="col yb-fontsize12 yb-flex-between">
                    <span>{{in8n_t('bet_record.surplus')}}</span>
                    <span>{{obj.remainingBetAmount|format_currency}}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <!--已复制弹出框-->
      <div class="toast" v-if="toast">{{in8n_t("bet_record.copyed")}}</div>
    </template>
  </div>
</template>
<script>
import bet_record_result from "src/public/mixins/bet_record_view/bet_record_result.js";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import Template0 from 'src/project/yabo/components/match_details/list/template0.vue';
export default {
  mixins: [bet_record_result],
  components: {
    VueSlider,
    Template0
  },
  data() {
    return {
    
    }
  },
};
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
          color: #ffffff !important;
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
