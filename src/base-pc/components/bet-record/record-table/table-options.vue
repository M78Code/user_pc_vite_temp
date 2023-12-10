<!--
 * @Author: Cooper
 * @Date: 2023-08-16 14:13:55
 * @Description: 投注记录表单 选项组件
-->

<template>
  <div>
    <div>
      <div class="ceil-options" v-for="(item, j) in data.orderVOS" :key="j">
        <div style="flex: 1">
          <!-- [足球]  世界杯2022亚洲外围赛 item.outrightYear-->
          <div>
            <div class="row appoint-status">
              <div class="col">
                [{{ item.sportName }}]{{ item.matchName }}&nbsp;&nbsp;
              </div>
              <div v-if="data.preOrder" class="col text-right">
                {{ i18n_t("bet.bet_book_confirm") }}
              </div>
            </div>

            <template v-if="[1001, 1004].includes(item.sportId * 1)"
              >{{ item.matchDay }} {{ item.batchNo }}</template
            >
            <template
              v-if="[1011, 1002, 1009, 1010].includes(item.sportId * 1)"
              >{{ item.batchNo }}</template
            >
          </div>
          <!--赛马信息-->
          <div class="match-name-wrap">
            <!-- 赛马名字 -->
            <div
              v-if="[1011, 1002, 1009, 1010].includes(item.sportId * 1)"
              class="ranking-bg"
            >
              <template
                v-if="
                  !isNaN(item.playOptions) ||
                  item.playOptions.indexOf('/') != -1
                "
              >
                <div
                  v-for="(list, i) in item.playOptions.split('/')"
                  :key="i"
                  :class="`ranking-bg-style1-${list} csid-${item.sportId}`"
                ></div>
              </template>
              <template v-else>
                <span class="market_value">{{ item.marketValue }}</span>
              </template>
            </div>
            <!-- 云达不莱梅 -0.5 -->
            <span v-else class="market_value">{{ item.marketValue }}</span>
            <!-- 1.98 -->
            <span
              class="market-value-text"
              :class="{
                'text-blue':
                  item.oddFinally.indexOf('-') != -1 &&
                  (data.marketType == 'MY' || data.marketType == 'ID'),
                'text-orange':
                  item.oddFinally.indexOf('-') > -1 &&
                  (data.marketType == 'MY' || data.marketType == 'ID'),
              }"
            >
              <span>{{ format_odds(item.oddFinally)   }}</span>
            </span>
          </div>
          <!-- 赛前 全场赛果 -->
          <div class="play-type" v-if="!data.acCode">
            <span
              v-if="
                item.matchType != 3 &&
                ![1001, 1002, 1009, 1010, 1011].includes(item.sportId * 1)
              "
              >{{ matchType(item.matchType, data.langCode) }}</span
            >
            <span>{{ item.playName }}</span>
            <!-- （1-1） -->
            <span
              v-if="
                item.matchType != 1 &&
                item.scoreBenchmark &&
                item.playId != '334'
              "
              >({{ format_score_t(item.scoreBenchmark) }})</span
            >
            <!-- [欧洲盘]-->
            <!-- <span>{{ '[' + marketType(item.marketType, data.langCode) + ']' }}</span> -->
            <!--冠军玩法 截止投注 -->
            <!-- <div v-show="item.matchType === 3">
                            <span>{{ i18n_t("list.bet_close") }}:</span>
                            <span style="margin:0 5px">
                            {{
                              formatTime(
                                ['zh','tw'].includes(UserCtr.lang) ? "yyyy-mm-dd hh:MM" : "dd/mm/yyyy hh:MM"
                              )
                            }}</span>                     
                          </div> -->
          </div>

          <div class="play-type both-item" v-if="item.matchType != 3">
            <!-- 拜仁慕尼黑 v 云达不莱梅 -->
            <span v-if="item.sportId * 1 < 1002 || item.sportId == '1004'">
              {{
                item.matchInfo.indexOf("(")
                  ? item.matchInfo.split("(")[0]
                  : item.matchInfo
              }}
              <span
                v-if="item.matchInfo.indexOf('(') > -1"
                @mouseover="show_score_info = true"
                @mouseout="show_score_info = false"
                >{{ "(" + item.matchInfo.split("(")[1] }}</span
              >
              <!--对阵信息后面需加上一个提示  当鼠标移上去显示，移出去就消失-->
              <q-tooltip
                content-class="bet-bg-tooltip"
                anchor="bottom left"
                self="top left"
                :offset="[-30, 5]"
                v-if="show_score_info == true"
              >
                <div class="score_info_style">
                  {{ i18n_t("bet.score_info") }}
                </div>
              </q-tooltip>
            </span>
            <!-- 10/20 15:30 -->
            <span v-if="!data.acCode && item.beginTime">{{
              formatTime(
                item.beginTime,
                UserCtr.lang == "vi" ? "hh:MM dd/mm" : "mm/dd hh:MM"
              )
            }}</span>
          </div>
          <div
            class="play-type settle-score"
            v-if="tool_selected == '1' && item.settleScore"
          >
            <!-- 赛果比分 -->
            <span>{{ item.settleScore }}</span>
          </div>
          <!--提前结算按钮-->
          <template
            v-if="
              tool_selected == '0' &&
              get_user.settleSwitch &&
              data.enablePreSettle &&
              data.initPresettleWs &&
              data.cash_out_status != -2 &&
              data.seriesType == '1'
            "
          >
            <!-- 全场比分 2-0 -->
            <div class="info-wrap">
              <!--
                              计算金额大于1
                              cash_out_status = 1
                              盘口状态 hs=0
                              show_operate!=invalid(有效)
                            -->
              <template
                v-if="
                  data.computed_bet_amount > 1 &&
                  lodash.get(data, 'orderVOS.0.hs') == 0 &&
                  data.cash_out_status == 1
                "
              >
                <template
                  v-if="
                    lodash.get(cur_bet_pre, `${i}.bet_pre_code`) != '0400524' ||
                    [3, 4, 5].includes(data.settleType) ||
                    data.pre_settle_order_status == 2
                  "
                >
                  <div class="text-center">
                    <template
                      v-if="
                        lodash.get(cur_bet_pre, `${i}.bet_pre_code`) > 1 &&
                        lodash.get(cur_bet_pre, `${i}.bet_pre_code`) !=
                          '0400524'
                      "
                    >
                      <span style="color: red">
                        <template
                          v-if="
                            lodash.get(cur_bet_pre, `${i}.bet_pre_code`) ==
                            '0400527'
                          "
                        >
                          <!--功能暂停中，请稍后再试-->
                          {{ i18n_t("bet_record.pre_suspend") }}
                        </template>
                        <template
                          v-else-if="
                            lodash.get(cur_bet_pre, `${i}.bet_pre_code`) ==
                            '0400537'
                          "
                        >
                          <!--提前结算金额调整中，请再试一次-->
                          {{ i18n_t("bet_record.pre_amount_change") }}
                        </template>
                        <template v-else>
                          <!--提前结算申请未通过-->
                          {{ i18n_t("bet_record.pre_not_approved") }}
                        </template>
                      </span>
                    </template>
                    <template v-else>
                      <!--提前结算金额已包含本金-->
                      <span>{{ i18n_t("bet_record.pre_bet_include_money") }}</span>
                    </template>
                  </div>
                </template>
                <!--提前结算按钮-->
                <div
                  class="bet-pre-wrap"
                  v-if="!data.bet_status || data.bet_status == 'default'"
                >
                  <div class="bet-pre-btn" @click.stop="start_bet_pre(i)">
                    <!-- 提前结算 -->
                    <div class="bet-row-1">
                      {{ i18n_t("bet_record.settlement_pre") }}
                    </div>
                    <!--提前结算金额展示-->
                    <div class="bet-row-2">
                      {{ format_btn_balance(data.computed_bet_amount) }}
                    </div>
                  </div>
                  <!--提前结算按钮后面那个两杠的图标-->
                  <div
                    @click.stop="show_bet_pre(data, i)"
                    :ref="`bet_pre_${data.orderNo}`"
                    @mouseover.stop="bet_pre_over(i)"
                    @mouseout.stop="bet_pre_out(i)"
                    class="bet-pre-handle"
                    v-if="get_user.pcs == '1'"
                  >
                    <icon-wapper
                      name="icon-bet_pre"
                      class="bet-pre-info"
                      :class="{
                        'bet-pre-over':
                          lodash.get(cur_bet_pre, `${i}.show_operate`) ==
                          'bet_pre',
                      }"
                      size="14px"
                    />
                  </div>
                  <!--去掉移入事件，一直保持高亮-->
                  <!-- <div @click.stop="show_bet_pre(data, i)"
                                  :ref="`bet_pre_${data.orderNo}`"
                                  class="bet-pre-handle"
                                  v-if="get_user.pcs=='1'">
                                    <icon-wapper name="icon-bet_pre" :class="['bet-pre-info','bet-pre-over']"  size="14px"/>
                                </div> -->
                </div>
                <template
                  v-if="
                    lodash.get(cur_bet_pre, `${i}.show_operate`) == 'bet_pre'
                  "
                >
                  <template
                    v-if="
                      data.setBetAmount >
                      lodash.get(money_obj, `${i}.min_money`, 0)
                    "
                  >
                    <!-- 结算投注额 -->
                    <div>
                      {{ i18n_t("bet_record.settlement_bet_money")
                      }}<span class="bet-money">{{
                        format_balance(lodash.get(money_obj, `${i}.money`))
                      }}</span>
                    </div>
                    <div class="bet-compute-money">
                      <!--提前结算滑块展示-->
                      <!-- <vue-slider
                        :ref="`vue-slider-${i}`"
                        :adsorb="true"
                        :minRange="money_obj[i].min_money"
                        :maxRange="money_obj[i].max_money"
                        v-model="money_obj[i].money"
                        :data="money_obj[i].bet_amount_data"
                        :data-value="'id'"
                        :data-label="'name'"
                        :dot-options="[{ tooltip: 'none' }]"
                        @change="change_slider($event, i)"
                      >
                        <template v-slot:label="{ label, active }">
                          <div
                            :class="[
                              'vue-slider-mark-label',
                              'custom-label',
                              { active },
                            ]"
                          >
                            {{ label }}%
                          </div>
                        </template>
                      </vue-slider> -->
                    </div>
                  </template>

                  <!-- TIPS:部分结算后,剩余本金不支持再次提前结算! -->
                  <!-- <template v-if="[4,5].includes(data.settleType) || data.setBetAmount<=lodash.get(money_obj, `${i}.min_money`, 0)"> -->
                  <template>
                    <div class="mt5">
                      <!-- 注单剩余本金 -->
                      {{ i18n_t("bet_record.settlement_bet_remaining") }}:
                      {{ format_balance(betPreRemaining(data)) }}
                    </div>
                    <div class="mt10">
                      <!-- 提前结算可用次数 -->
                      {{ i18n_t("bet_record.settlement_bet_count") }}:
                      {{ betPreCount(data, i) }}
                    </div>
                    <div
                      v-if="
                        data.setBetAmount <=
                        lodash.get(money_obj, `${i}.min_money`, 0)
                      "
                      class="bet-tips-info"
                    >
                      <icon-wapper name="icon-tips" class="bet-info" size="14px" />
                      <span class="tips-info">
                        <template>
                          <!--仅支持全额结算-->
                          {{ i18n_t("bet_record.settlement_only_full") }}
                        </template>
                      </span>
                    </div>
                  </template>
                </template>
                <!--提前结算确认中 、确认提前结算 -->
                <div
                  class="bet-pre-confirming-btn"
                  v-if="data.bet_status == 'start_bet_pre'"
                  @click="bet_handle(i, data.orderNo)"
                >
                  <div class="bet-pre-left">
                    <!-- 确认中...|确认提前结算 -->
                    <div class="bet-row-1">
                      {{
                        data.bet_confirm
                          ? i18n_t("bet_record.confirm")
                          : i18n_t("bet_record.confirm_bet_pre")
                      }}
                    </div>
                    <!--data.amount存在的话优先使用，否则使用计算后的-->
                    <div class="bet-row-2">
                      {{ format_btn_balance(data.computed_bet_amount) }}
                    </div>
                  </div>
                  <div class="bet-pre-right" v-if="data.bet_confirm">
                    <template
                      v-if="['day'].includes(UserCtr.get_theme)"
                    >
                      <img
                        :src="`/image/wwwassets/yabo/gif/${UserCtr.get_theme}/${UserCtr.get_theme}_confirming.gif`"
                        style="height: 18px; width: 18px"
                      />
                    </template>
                    <template v-else>
                      <img
                        :src="`/image/wwwassets/yabo/gif/${UserCtr.get_theme}/${UserCtr.get_theme}_pre_confirming.gif`"
                        style="height: 18px; width: 18px"
                      />
                    </template>
                  </div>
                </div>
                <div
                  class="bet-pre-complete-btn"
                  v-if="data.bet_status == 'end_bet_pre'"
                >
                  <div class="bet-pre-left">
                    <!-- 已提前结算 -->
                    <div class="bet-row-1">
                      {{ i18n_t("bet_record.finish_bet_pre") }}
                    </div>
                    <div class="bet-row-2">
                      {{ format_btn_balance(data.computed_bet_amount) }}
                    </div>
                  </div>
                  <div class="bet-pre-right">
                    <icon-wapper name="icon-success" size="18px" color="#FFF" />
                  </div>
                </div>
              </template>
              <template
                v-else-if="
                  data.computed_bet_amount < 1 ||
                  lodash.get(data, 'orderVOS.0.hs') != 0 ||
                  data.cash_out_status == -1
                "
              >
                <!--暂停提前结算-->
                <div class="bet-pre-wrap bet-pre-stop">
                  <div class="bet-pre-btn">
                    {{ i18n_t("bet_record.pre_bet_stop") }}
                  </div>
                  <div
                    :ref="`bet_pre_${data.orderNo}`"
                    class="bet-pre-handle"
                    v-if="get_user.pcs == '1'"
                  >
                    <icon-wapper
                      name="icon-bet_pre"
                      class="bet-pre-info"
                      size="14px"
                      color="#99A3B1"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
        <!-- 赢 -->
        <!-- 投注项结算状态展示条件，未处理，已处理，注单无效
                      未结算串关、已结算串关
                      已结算+单关+betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输)
                      已结算注单无效
                      -->
        <div class="item-result">
          <!-- 未结算串关、已结算串关 -->
          <template
            v-if="
              ['0', '1'].includes(data.orderStatus) && data.seriesType != '1'
            "
          >
            <!-- betstatus无效 -->
            <template v-if="[3, 4].includes(item.betStatus)">
              <span
                v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                class="bet-result lose-color"
              >
                {{ item_cancelType(item.cancelType) }}
              </span>
              <span v-else class="bet-result lose-color">{{
                i18n_t("bet.invalid")
              }}</span>
            </template>
            <!-- 其他 -->
            <span
              v-if="item.betStatus == 1"
              class="bet-result"
              :class="item_class(item.betResult)"
              >{{ item_status(item.betResult) }}</span
            >
          </template>
          <!-- 未结算串关、已结算串关 -->

          <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->
          <template v-if="data.preBetAmount > 0">
            <span
              v-if="data.orderStatus == '1' && data.seriesType == '1'"
              class="bet-result"
              :class="item_class(data.outcome)"
              >{{ item_status(data.outcome) }}</span
            >
          </template>
          <template v-else>
            <!-- :class="item_class(item.betResult)" -->
            <span
              v-if="data.orderStatus == '1' && data.seriesType == '1'"
              class="bet-result"
              :class="item_class(item.betResult)"
              >{{ item_status(item.betResult) }}</span
            >
            <!-- item_status(item.betResult) -->
          </template>
          <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->

          <!-- 已结算注单无效 -->
          <template v-if="data.orderStatus == '2'">
            <template v-if="[3, 4].includes(item.betStatus)">
              <span
                v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                class="bet-result lose-color"
              >
                {{ item_cancelType(item.cancelType) }}
              </span>
              <span v-else class="bet-result lose-color">{{
                data.seriesType == "1" ? "" : `${i18n_t("bet.invalid")}`
              }}</span>
            </template>
            <template v-if="item.betStatus == 1">
              <span
                v-if="[7, 8, 11, 12, 15].includes(item.betResult)"
                class="bet-result lose-color"
                >{{ item_status(item.betResult) }}</span
              >
              <span v-else class="bet-result lose-color">{{
                data.seriesType == "1" ? "" : `${i18n_t("bet.invalid")}`
              }}</span>
            </template>
          </template>
          <!-- 已结算注单无效 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  format_score_t,
  format_balance,
  formatTime,
  format_btn_balance,
  formete_date,
  format_odds
} from "src/output/index.js";
// import vueSlider from "vue-slider-component";
import { CANCEL_TYPE } from "./config";
import { ref } from "vue";
import { IconWapper } from 'src/components/icon/index.js'
// import "vue-slider-component/theme/default.css";
import lodash from "lodash";
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  money_obj: {
    type: Object,
    default: () => {},
  },
  tool_selected: {
    type: String,
    default: '0',
  },
  matchType:{
    type: Function,
    default: () => {}
  },
  item_class:{
    type: Function,
    default: () => {}
  },
  item_status:{
    type: Function,
    default: () => {}
  },
  get_user:Object
});

const show_score_info = ref(false); //比分提示默认隐藏
const emit = defineEmits([
  "start_bet_pre",
  "show_bet_pre",
  "bet_pre_out",
  "bet_pre_over",
  "change_slider",
  "bet_handle",
]);

const start_bet_pre = (i) => {
  emit("start_bet_pre", i);
};
const bet_pre_over = (i) => {
  emit("bet_pre_over", i);
};
const bet_pre_out = (i) => {
  emit("bet_pre_out", i);
};
const show_bet_pre = (arg) => {
  emit("show_bet_pre", arg);
};
const change_slider = (arg) => {
  emit("change_slider", arg);
};

/**
 * @description: 单剩余本金
 */
const betPreRemaining = (item) => {
  return mathjs.subtract(item.orderAmountTotal, item.preBetAmount || 0);
};

/**
 * @description: 提前结算可用次数
 */
const betPreCount = (item, index) => {
  let min_money = lodash.get(props.money_obj, `${index}.min_money`);
  let preSettleBetAmount = item.preSettleBetAmount;
  if (preSettleBetAmount <= min_money) {
    return 1;
  } else {
    return item.preBetAmount ? 1 : 2;
  }
};
/**
 * @description: 确认提前结算
 * @return {}
 */
const bet_handle = (arg) => {
  emit("bet_handle", arg);
};
/**
 * @description: 取消原因
 * @param {Srting} cancelType: 取消类型
 * @return {string}
 */
const item_cancelType = (cancelType) => {
  if ([1, 2, 3, 4, 5, 6, 17, 20].includes(parseInt(cancelType))) {
    return CANCEL_TYPE[parseInt(cancelType)];
  } else {
    return i18n_t("bet.invalid"); //注单无效
  }
};
</script>

<style lang="scss" scoped>
.ceil-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  width: 100% !important;
  line-height: 23px;
  //赛马信息
  .match-name-wrap {
    display: flex;
    align-items: center;
    .ranking-bg {
      margin-right: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        width: 12px;
        height: 12px;
        margin-right: 2px;
      }
    }
    .market_value {
      margin-right: 20px;
    }
  }
  .both-item {
    line-height: 16px;
  }
  .item-result {
    margin-right: 20px;
    width: 48px;
    text-align: right;
  }
  &:last-child {
    margin: 0;
  }
}
//注单号
.order-no {
  display: flex;
  margin-top: 2px;
  .copy {
    display: flex;
    align-items: center;
    margin-left: 5px;
    cursor: pointer;
  }
}
.bet-pre-detail {
  cursor: pointer;

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
}
</style>