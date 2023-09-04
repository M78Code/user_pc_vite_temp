<!--
 * @Author: Cooper
 * @Date: 2023-08-16 11:13:55
 * @Description: 投注记录表单 注单历史表格弹出的那个
-->
<template>
  <!--押注记录表单-->
  <div
    class="record-table col"
    :class="{ 'no-record-data': early_settlement_data.length == 0 }"
  >
    <div class="data-table column">
      <!--表单头部标题-->
      <div class="row head">
        <!--每一行-->
        <div class="ceil" v-for="item in lineList" :key="item.id">
          {{ item.label }}
          <!-- 编号 -->
        </div>
      </div>
      <!--表单内容-->
      <div class="data-table-content" ref="table">
        <!--加载组件-->
        <load-data
          class="fit"
          color="light"
          :state="data_state.load_data_state"
        >
          <!--quasar自定义滚动条-->
          <q-scroll-area
            ref="scrollArea"
            class="rule-scroll-area"
            :style="{ height: '100%' }"
          >
            <!---表单内容-->
            <div class="r-table">
              <template v-for="(data, i) of early_settlement_data" :key="i">
                <div
                  class="row"
                  :class="`status-${data.orderStatus} outcome-${data.orderOutCome}`"
                >
                  <!-- 编号 -->
                  <div
                    class="ceil"
                    :class="{
                      'bottom-hiden':
                        lodash.get(cur_bet_pre, `${i}.show_detail`, false) &&
                        lodash.get(pre_order_list_obj, i),
                    }"
                  >
                    {{ recordData.size * (recordData.current - 1) + i + 1 }}
                  </div>
                  <!-- 投注详情 -->
                  <div class="ceil">
                    <div>
                      {{
                        formatTime(
                          data.betTime,
                          lang == "vi"
                            ? "hh:MM:ss dd/mm/yyyy"
                            : "yyyy-mm-dd hh:MM:ss"
                        )
                      }}
                    </div>
                    <!--注单号-->
                    <div class="order-no">
                      <span>{{ data.orderNo }} {{ data.copy_color }}</span>
                      <span class="copy" @click="copy(data.orderNo)">
                        <!--copy图标-->
                        <icon name="icon-icon_copy" />
                      </span>
                    </div>
                    <!--单关，部分获取全额提前结算显示详情展示按钮-->
                    <template
                      v-if="
                        data.seriesType == '1' &&
                        [3, 4, 5].includes(data.settleType)
                      "
                    >
                      <div
                        class="bet-pre-detail"
                        @click="show_bet_pre_info(data.orderNo, i)"
                      >
                        <!--提前结算详情-->
                        <span>{{ i18n_t("bet_record.settlement_pre_info") }}</span>
                        <span>
                          <!--详情展示部分箭头-->
                          <icon
                            name="icon-triangle"
                            size="16px"
                            color="#99A3B1"
                            :class="{
                              'icon-pull-down': lodash.get(
                                cur_bet_pre,
                                `${i}.show_detail`,
                                false
                              ),
                              'icon-pull-up': !lodash.get(
                                cur_bet_pre,
                                `${i}.show_detail`,
                                true
                              ),
                            }"
                          />
                        </span>
                      </div>
                    </template>
                  </div>
                  <!-- 投注玩法 -->
                  <div class="ceil c134 play-name">
                    <div>
                      <!-- 串关 -->
                      <template
                        v-if="data.seriesType != '1' || data.seriesType == '3'"
                        >{{ data.seriesValue }}</template
                      >
                      <!-- 单关 -->
                      <template v-else>
                        <template v-for="(item, index) in data.orderVOS">
                          {{ matchType(item.matchType, data.langCode) }}
                          {{ item.playName }}
                          <span
                            v-if="
                              item.matchType != 1 &&
                              item.scoreBenchmark &&
                              item.playId != '334'
                            "
                            :key="index"
                            >({{ format_score_t(item.scoreBenchmark) }})</span
                          >
                        </template>
                      </template>
                    </div>
                  </div>
                  <!-- 选项 -->
                  <div class="ceil c135">
                    <table-options
                      :data="data"
                      :money_obj="money_obj"
                      :tool_selected="tool_selected"
                      :get_user="UserCtr.user_info"
                      :matchType="matchType"
                      @start_bet_pre="start_bet_pre"
                      @bet_pre_over="bet_pre_over"
                      @bet_pre_out="bet_pre_out"
                      @change_slider="change_slider"
                    ></table-options>
                  </div>
                  <!-- 投注额 -->
                  <div class="ceil font-family">
                    {{ format_balance(data.orderAmountTotal) }}
                    <span class="order-addtion" v-if="data.addition > 0">{{
                      `[+${format_balance(data.addition)}]`
                    }}</span>
                  </div>
                  <!-- 返还金额 -->
                  <div class="ceil font-family">
                    <!-- :class="outcome_class(data.orderOutCome)" -->
                    <span
                      :class="{ 'win-color': [4, 5].includes(data.outcome) }"
                      v-if="tool_selected === 0 || tool_selected === 1"
                      >{{
                        format_balance(
                          tool_selected === 0
                            ? data.maxWinAmount
                            : data.backAmount
                        )
                      }}</span
                    >
                    <span v-else>- -</span>
                  </div>
                  <!-- 状态 -->
                  <div class="ceil">
                    <!--
                      0:待处理,1:已处理,2:取消交易,3:待确认,4:已拒绝
                      0、3未结算
                      1、2、4已结算
                    -->
                    <span :class="status_class(data.orderStatus)">{{
                      order_status(data.orderStatus)
                    }}</span>
                    <!--显示部分提前结算或者全额提前结算-->
                    <span v-if="tool_selected == 1" class="bet-pre-color">
                      <template v-if="data.settleType == 4">{{
                        i18n_t("bet_record.settlement_pre_part2")
                      }}</template>
                      <template v-else-if="data.settleType == 5">{{
                        i18n_t("bet_record.settlement_pre_all2")
                      }}</template>
                    </span>
                  </div>
                </div>
                <!--提前结算详情Start-->
                <template
                  v-if="
                    data.seriesType == '1' &&
                    [3, 4, 5].includes(data.settleType) &&
                    lodash.get(cur_bet_pre, `${i}.show_detail`, false) &&
                    lodash.get(pre_order_list_obj, i)
                  "
                >
                  <div
                    class="row detail-row head"
                    :key="`detail-title-${i}-${lodash.get(
                      cur_bet_pre,
                      `${i}.show_detail`,
                      false
                    )}`"
                  >
                    <div class="ceil first-title top-hiden bottom-hiden"></div>
                    <div class="ceil"></div>
                    <div class="ceil"></div>
                    <div class="ceil"></div>
                    <div class="ceil">
                      {{ i18n_t("bet_record.settlement_money") }}
                    </div>
                    <div class="ceil">
                      {{ i18n_t("common.donate_win") }}
                    </div>
                    <div class="ceil">
                      {{ i18n_t("bet_record.lose_win") }}
                    </div>
                  </div>
                  <!--详情数据显示-->
                  <template
                    v-for="(obj, order_index) in lodash.get(
                      pre_order_list_obj,
                      i
                    )"
                    :key="`detail-content-${i}-${order_index}`"
                  >
                    <div
                      class="row"
                      :class="{
                        'show-bottom':
                          order_index ==
                          lodash.get(pre_order_list_obj, i, []).length - 1,
                      }"
                    >
                      <div
                        class="ceil first-title top-hiden bottom-hiden"
                      ></div>
                      <div
                        class="ceil right-hiden bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      >
                        <div>
                          {{
                            formatTime(
                              obj.createTime,
                              lang == "vi"
                                ? "hh:MM:ss dd/mm/yyyy"
                                : "yyyy-mm-dd hh:MM:ss"
                            )
                          }}
                        </div>
                        <template v-if="obj.preOrderNo">
                          <!--注单号-->
                          <div class="order-no">
                            <span
                              >{{ obj.preOrderNo }} {{ data.copy_color }}</span
                            >
                            <span class="copy" @click="copy(obj.preOrderNo)">
                              <!--copy图标-->
                              <icon
                                name="icon-icon_copy"
                                :color="color_list[i]"
                              />
                            </span>
                          </div>
                        </template>
                      </div>
                      <div
                        class="ceil right-hiden bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      ></div>
                      <div
                        class="ceil right-hiden bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      >
                        <template v-if="obj.orderStatus == 2">
                          <template v-if="obj.type == 1">
                            <span
                              >{{ i18n_t("bet_record.settlement_pre_part")
                              }}<span class="red-bg">{{
                                i18n_t("common.cancel")
                              }}</span></span
                            >
                          </template>
                          <template v-else-if="obj.type == 2">
                            <span
                              >{{ i18n_t("bet_record.settlement_pre_all")
                              }}<span class="red-bg">{{
                                i18n_t("common.cancel")
                              }}</span></span
                            >
                          </template>
                        </template>
                        <template v-else>
                          <span>
                            <span class="pre-bet-part">
                              <!---部分结算金额--->
                              <template v-if="obj.type == 1">
                                <div>
                                  {{ i18n_t("bet_record.settlement_pre_part") }}
                                </div>
                                <div>
                                  [{{ i18n_t("bet_record.surplus")
                                  }}{{
                                    format_balance(obj.remainingBetAmount)
                                  }}]
                                </div>
                              </template>
                              <!--全额结算-->
                              <template v-else-if="obj.type == 2">
                                <div>
                                  {{ i18n_t("bet_record.settlement_pre_all") }}
                                </div>
                              </template>
                              <!--剩余本金结算-->
                              <template v-else-if="obj.type == 3">
                                <div>
                                  {{ i18n_t("bet_record.settlement_pre_surplus") }}
                                </div>
                              </template>
                            </span></span
                          >
                        </template>
                      </div>
                      <div
                        class="ceil right-hiden bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      >
                        {{
                          obj.orderStatus == 2
                            ? 0.0
                            : format_balance(obj.preBetAmount)
                        }}
                      </div>
                      <div
                        class="ceil right-hiden bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      >
                        {{
                          obj.orderStatus == 2
                            ? 0.0
                            : format_balance(obj.settleAmount)
                        }}
                      </div>
                      <div
                        class="ceil bottom-hiden"
                        :class="{
                          'top-dashed': order_index > 0,
                          'shadow-bg': order_index % 2 != 0,
                        }"
                      >
                        {{
                          obj.orderStatus == 2
                            ? 0.0
                            : format_balance(obj.profit)
                        }}
                      </div>
                    </div>
                  </template>
                </template>
                <!--提前结算详情End-->
              </template>
            </div>
          </q-scroll-area>
        </load-data>
      </div>
    </div>
    <template v-if="parseInt(recordData.total)">
      <!--分页组件-->
      <PaginationWapper
        class="record-pagination"
        :count="recordData.total"
        :betTotalAmount="recordData.betTotalAmount"
        :effectiveFlow="recordData.effectiveFlow"
        :profit="recordData.profit"
        :recordType="recordData.orderStatus"
        :random="random"
        @pageChange="changePage(arguments)"
      ></PaginationWapper>
    </template>
    <!--复制样式 已复制-->
    <div class="toast fit-center" v-if="toast">
      {{ i18n_t("bet_record.copyed") }}
    </div>
  </div>
</template>

<script setup>
import tableOptions from "./table-options.vue"; // 选项组件
// import { PaginationWapper } from "src/components/pagination/indes.js";
import { useTableData } from "./use-table-data.js";
import { i18n_t } from "src/core/index.js";
import { formatTime,format_balance,format_score_t } from "src/core/format/index";
import loadData from "project_path/src/components/load-data/load-data.vue"
import {defineExpose} from 'vue';


const props = defineProps({
  record_obj: {
    type: Object,
    default: {},
  },
  order_list: {
    type: [Object, Array],
    default: () => {
      return {
        records: [],
      };
    },
  },
  orderNo_data_obj: {
    type: Array,
    default: () => [],
  },
  orderNo_data_list: {
    type: Array,
    default: () => [],
  },
  data_state: {
    type: Object,
    default: () => {
      return {
        load_data_state: "loading",
      };
    },
  },
  tool_selected: {
    type: Number,
    default: 0,
  },
  random: Number,
  // lang:{
  //   type: String,
  //   default: "zh"
  // }
});

console.error(props, props.record_obj);
const emit = defineEmits([
  "choosePage",
  "clear_timer_get_cashout",
  "res_timer_get_cashout",
]);
// 表格头部分
const lineList = [
  { label: i18n_t("bet_record.number"), id: 1 },
  { label: i18n_t("bet_record.betting_details"), id: 2 },
  { label: i18n_t("bet_record.betting_play"), id: 3 },
  { label: i18n_t("bet_record.options"), id: 4 },
  { label: i18n_t("bet_record.bets_forehead"), id: 5 },
  {
    label:
      props.tool_selected === 0
        ? i18n_t("common.maxn_amount_val")
        : i18n_t("common.donate_win"),
    id: 6,
  },
  { label: i18n_t("bet_record.status"), id: 7 },
];
const {
  recordData,
  toast,
  early_settlement_data,
  cur_bet_pre,
  pre_order_list_obj,
  money_obj,
  color_list,
  changePage,
  copy,
  show_bet_pre_info,
  matchType,
  status_class,
  order_status,
  start_bet_pre,
  bet_pre_over,
  bet_pre_out,
  change_slider,
  bet_handle,
  lodash,
} = useTableData({ props, emit });

defineExpose({
  recordData
})
</script>

<style lang="scss" scoped>
//押注记录表单
@import "./index.scss";
</style>

<style lang="scss">
div.q-menu {
  border: 0 none !important;
}

div.select-item {
  border-left: 1px solid rgb(208, 216, 222);
  border-right: 1px solid rgb(208, 216, 222);

  &:first-child {
    border-top: 1px solid rgb(208, 216, 222);
  }

  &:last-child {
    border-bottom: 1px solid rgb(208, 216, 222);
  }
}

//对阵信息后面需加上一个提示
.bet-bg-tooltip {
  background: #a3afbf;
  color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);

  /**提示信息样式*/
  .score_info_style {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    word-break: break-all;
  }
}
</style>
