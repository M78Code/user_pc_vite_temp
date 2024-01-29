<template>
  <div class="record-table">
    <div style="display: none;">{{ BetRecordHistory.bet_record_version }}</div>
    <div class="changing" v-if="BetRecordHistory.loading">{{ i18n_t('common.loading') }}</div>
    <div v-else>
      <q-table :rows="BetRecordHistory.table_data" 
      style="max-height:calc(100vh - 17rem)" 
      :rows-per-page-options="[0]" 
      :columns="BetRecordHistory.columns"
      :bordered="false"
      row-key="orderNo" hide-pagination >
        <template v-slot:no-data>
          <div class="detail-loading" v-if="loading">
            <q-circular-progress indeterminate rounded size="80px" :thickness="0.1" color="opt-basic" class="q-ma-md" />
          </div>
          <div class="no-data" style="height:calc(100vh - 17rem)">
            <div class="c">
              <img class="no-data-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/no_data_02.png`" alt="" srcset="">
              <div style="text-align: center;color:#A1A3A5;font-weight: 500;">{{i18n_t('common.no_data')}}</div>
            </div>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- 编号 -->
            <q-td key="sn" :props="props">
              <span @click="labelClick(props)">
                {{getRowIndex(props.rowIndex)}}
              </span>
            </q-td>
            <!-- 投注详情 -->
            <q-td key="datails" :props="props">
              <span>{{
                  formatTime(props.row.betTime, 'yyyy-mm-dd hh:MM:ss')
                }}</span>
              <div class="copy-warp">
                <span class="datails-order">{{ props.row.orderNo }}</span>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/copy.svg`" alt="" class="copy_icon"
                     :title="i18n_t('ouzhou.record.copy')" @click="hand_copy(props.row.orderNo)">
              </div>
            </q-td>
            <!-- 投注玩法 -->
            <q-td key="bettingType" :props="props">
              <!-- 串关 -->
              <template v-if="props.row.seriesType != '1' || props.row.seriesType == '3'">{{props.row.seriesValue}}</template>
              <!-- 单关 -->
              <template v-else>
                <template v-for="(item, index) in data_list(props.row)" :key="index">
                  <div>{{matchType(item.matchType, props.row.langCode)}}</div>
                  <span>
                  {{ item.playName }}
                  <span
                    v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'"
                    :key="index"
                  >({{format_score(item.scoreBenchmark) }})</span>
                </span>
                </template>
              </template>
            </q-td>
            <!-- 投注选项 -->
            <q-td key="detail" :props="props">
              <div class="detail-options">
                <div class="record-detail-list">
                  <div v-for="(item, index) in data_list(props.row)" :key="index" class="record-detail">
                    <div class="record-detail-item">
                      <div class="record-detail-icon">
                        <sport-icon :sport_id="cts_mid.includes(props.row.managerCode*1) ? item.sportId == 1 ? '90': 91  : item.sportId" key_name="pc-left-menu-bg-image" size="18" class="icon"  style="margin:0 10px"/>
                      </div>
                      <span> {{ item.matchName }}</span>
                      <span v-if="item.matchType !=3" style="color:#8A8986">{{ item.matchInfo }}</span>
                      <span>
                          <span v-if="item.matchType != 3 && ![1001,1002,1009,1010,1011].includes(item.sportId*1)">{{matchType(item.matchType, props.row.langCode)}}</span>
                        {{ item.playName }}
                        <!-- （1-1） -->
                          <span v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'">({{format_score(item.scoreBenchmark)}})</span>
                        <!-- [欧洲盘]-->
                          <span>[{{marketType(item.marketType, props.row.langCode)}}]</span></span>
                      <div>
                        <span v-if="item.marketValue" style="margin-right:15px;">{{ item.marketValue }}</span>
                        <span style="color:#ff7000;">@{{ item.oddFinally }}</span>
                      </div>

                      <div class="play-type settle-score" v-if="BetRecordHistory.selected == 1 && item.settleScore">
                        <!-- 赛果比分 -->
                        <span>{{item.settleScore}}</span>
                      </div>
                      <!-- 10/20 15:30 -->
                      <span
                        class="time"
                        v-if="!props.row.acCode && item.beginTime&&props.row.seriesType!=3"
                      >{{formatTime(item.beginTime, lang=='vi'?'hh:MM dd/mm':'mm/dd hh:MM')}}</span>

                      <!-- <span style="color:#8A8986">bet closed:{{
                        formatTime(item.beginTime, "yyyy-mm-dd hh:MM:ss")
                      }}
                      </span> -->
                      <!-- 提前结算 -->
                      <bet-early-settle v-if="BetRecordHistory.selected == 0" :item="props.row"></bet-early-settle>
                    </div>
                    <!-- 赢 -->
                    <!-- 投注项结算状态展示条件，未处理，已处理，注单无效
                    未结算串关、已结算串关
                    已结算+单关+betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输)
                    已结算注单无效
                    v-if="data.outcome"如果outcome等于null或者undefined就不显示
                    -->
                    <div class="item-result" v-if="props.row.outcome">
<!--                    <span-->
<!--                      class="bet-result"-->
<!--                      :class="{-->
<!--                        'win-color': 0-->
<!--                      }"-->
<!--                    >-->
<!--                      win-->
<!--                    </span>-->
                      <!-- 未结算串关、已结算串关 -->
                      <template v-if="['0','1'].includes(props.row.orderStatus) && props.row.seriesType != '1'">
                        <!-- betstatus无效 -->
                        <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                          <span v-else class="bet-result lose-color">{{i18n_t("bet.invalid")}}</span>
                        </template>
                        <!-- 其他 -->
                        <span
                          v-if="item.betStatus==1"
                          class="bet-result"
                          :class="item_class(item.betResult)"
                        >{{item_status(item.betResult)}}</span>
                      </template>
                      <!-- 未结算串关、已结算串关 -->

                      <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->
                      <template v-if="props.row.preBetAmount>0">
                          <span
                            v-if="props.row.orderStatus=='1' && props.row.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(props.row.outcome)"
                          >{{item_status(props.row.outcome)}}</span>
                      </template>
                      <template v-else>
                          <span
                            v-if="props.row.orderStatus=='1' && props.row.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(item.betResult)"
                          >{{item_status(item.betResult)}}</span>
                      </template>
                      <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->

                      <!-- 已结算注单无效 -->
                      <template v-if="props.row.orderStatus=='2'">
                        <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                          <span v-else class="bet-result lose-color">{{props.row.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
                        </template>
                        <template v-if="item.betStatus ==1">
                            <span
                              v-if="[7,8,11,12,15].includes(item.betResult)"
                              class="bet-result lose-color"
                            >{{item_status(item.betResult)}}</span>
                          <span
                            v-else
                            class="bet-result lose-color"
                          >{{props.row.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
                        </template>
                      </template>
                      <!-- 已结算注单无效 -->
                    </div>
                  </div>
                </div>
              </div>
            </q-td>
            <!-- 投注额 -->
            <q-td key="totalStake" :props="props">
              <span>
                {{ format_balance(props.row.orderAmountTotal) }}</span>
            </q-td>
            <!-- 最高可赢 -->
            <q-td key="highestWin" :props="props">
              <span> {{ format_balance(props.row.maxWinAmount) }}</span>
            </q-td>
            <!-- 返回金额 return -->
            <q-td key="return" :props="props">
               <span :class="{'win-color': [4,5].includes(props.row.outcome)}">
                 {{ format_balance(BetRecordHistory.selected === 1 ? props.row.backAmount : props.row.maxWinAmount ) }}
               </span>
            </q-td>
            <!-- 状态 -->
            <q-td key="status" :props="props">
              <!-- 预约 -->
              <template v-if="BetRecordHistory.selected == 2">
                <!-- 预约失败 -->
                <span v-if="[2, 3].includes(props.row.preOrderStatus)">{{ i18n_t('bet.bet_book_failed') }}</span>
                <!-- 已取消 -->
                <span v-else-if="[4].includes(props.row.preOrderStatus)">{{ i18n_t('bet.bet_book_canceled') }}</span>
                <!-- 预约中 -->
                <div v-else class="pre-redording win-color">
                  <span>{{ i18n_t('bet.bet_booking') }}</span>
                  <bet-cancel-pre type="history" :item="props.row" @success="cancelSuccess"></bet-cancel-pre>
                </div>
              </template>
              <!-- 未结算、已结算 -->
              <template v-else>
                  <!--
                   0:待处理,1:已处理,2:取消交易,3:待确认,4:已拒绝
                   0、3未结算
                   1、2、4已结算
                 -->
                <span :class="status_class(props.row.orderStatus)">{{ order_status(props.row.orderStatus) }}</span>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      
      <div class="table-footer-bar">
        <span>
          {{ i18n_t('bet_record.total_count') }}
          <!-- 总计单数 -->
          ：
          <span class="footer-text">{{ BetRecordHistory.records.total }}</span>
        </span>
        <span>
          {{ BetRecordHistory.selected == 2 ? i18n_t('bet.bet_book_total') : i18n_t('bet_record.total_v') }}
          <!-- 总投注额/预约总投资额 -->
          ：
          <span class="footer-text">{{ BetRecordHistory.records.betTotalAmount }}</span>
          <!-- <span class="footer-text">{{ format_balance(betTotalAmount) }}</span> -->
        </span>
        <div>
          <!-- 目前屏蔽有效流水展示 -->
          <span v-if="0">
            {{ i18n_t('bet_record.effective_water') }}
            <!-- 有效流水 -->
            <!-- ：{{ effectiveFlow }} -->
          </span>
          <span v-if="BetRecordHistory.selected == 1">
            {{ BetRecordHistory.records.profit.indexOf("-") != -1 ? i18n_t('bet_record.lose') : i18n_t('bet_record.win') }}：
            <span class="footer-text" >{{ BetRecordHistory.records.profit }}</span>
          </span>
          <!-- <span>{{profit.indexOf("-")!=-1?'输':'赢'}}：{{profit}}</span> -->
        </div>
      </div>
      <!--分页组件-->
      <Pagination v-if="BetRecordHistory.table_data.length > 0" class="record-pagination" 
                  :count="BetRecordHistory.records.total" 
                  @pageChange="changePage"
                  @pageSizeChange="pageSizeChange"
                  @goPageChange="goPageChange"
                  :reset_pagination="BetRecordHistory.params.page">
      </Pagination>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { useGetOrderList } from './tableConfig'
import { formatTime } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { format_balance, LOCAL_PROJECT_FILE_PREFIX,i18n_t } from 'src/output/index.js'
import Pagination from 'project_path/src/components/Pagination.vue'
// import Table from 'project_path/src/pages/bet-record/compoments/table.vue'
import sportIcon from "src/components/sport_icon/sport-icon.vue";
// import { PaginationWrapper } from "src/components/pagination/index.js";
import sport_icon from './sport_icon.vue'
// import football_icon from 'src/assets/images/football_icon.png'
import { copyToClipboard } from 'quasar'
import GlobalSwitchClass from 'src/core/global/global.js'
import BetRecordHistory from "src/core/bet-record/pc/bet-record-history.js"
import betEarlySettle from "src/base-pc/components/bet-record/bet-early-settle.vue"
import betCancelPre from "src/base-pc/components/bet-record/bet-cancel-pre.vue"

const lang = computed(() => {
  return UserCtr.lang;
})

const getRowIndex = (rowIndex) => {
  return (BetRecordHistory.params.page - 1) * BetRecordHistory.params.size + rowIndex + 1;
}


const cts_mid = ref([15,27,28,23,31,32,24,33,34])

const emit = defineEmits(['itemFilter'])
const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  },
  timeType: {
    type: [ String, Number ],
    default: ''
  }
})

console.error('sss',props)

const match_type = {
  1: i18n_t("bet.morning_session"),
  2: i18n_t("list.list_today_play_title"),
  3: i18n_t("menu.match_winner")
}
const { columns, tableData, loading, handle_fetch_order_list } = useGetOrderList()
const labelClick = (row) => {
  console.log(row)
}

// 监听tab 切换表格头数据
watch(() => props.current_tab, (newVal) => {
  tableData.value = []
  if (newVal == 'settled') {
    columns.value[5] = {
      name: 'return',
      label: i18n_t("common.donate_win"),
      align: 'center',
      field: 'return'
    }
    handle_fetch_order_list({ orderStatus: 1, timeType: 1 })
  } else {
    columns.value[5] = {
      name: 'highestWin',
      label: i18n_t("common.maxn_amount_val"),
      align: 'center',
      field: 'highestWin'
    }
    handle_fetch_order_list({ orderStatus: 0 })
  }
})
const getTableData = (params) => {
  handle_fetch_order_list(params)
}
defineExpose({ getTableData })
const status_class = (orderStatus) => {
  let str = ''
  switch (parseInt(orderStatus)) {
    case 0:
      str = '' //"投注成功";
      break
    case 1:
      str = '' //"投注成功";
      break
    case 2:
      str = 'lose-color' //"注单无效";
      break
    case 3:
      str = '' //确认中
      break
    case 4:
      str = 'win-color' //投注失败
      break
    default:
      break
  }
  return str
}
/**
 * 比分格式设置
 */
const format_score = (res) => {
  let str = "";
  if (res.indexOf("|") != -1) {
    let arr = res.split("|");
    str = arr[1].split(":");
  } else if (res.indexOf(":") != -1) {
    str = res.split(":");
  }
  return `${str[0]} - ${str[1]}`;
}
/**
 * @输赢状态calss
 * @param betResult: records.orderVOS.betResult
 */
const item_class = (betResult) => {
  switch (parseInt(betResult)) {
    case 2:
      return "lose-color"; //"走水";
    case 3:
      return "lose-color"; //输
    case 4:
      return "win-color"; //赢
    case 5:
      return "win-color"; //"赢半";
    case 6:
      return "lose-color"; //"输半";
    case 7:
      return "lose-color"; //"赛事取消";
    case 8:
      return "lose-color"; //"赛事延期";
    case 11:
      return "lose-color"; //"比赛延迟";
    case 12:
      return "lose-color"; //"比赛中断";
    case 13:
      return "lose-color"; //"无效";
    case 16:
      return "lose-color"; //"无效";
    case 15:
      return "lose-color"; //"比赛放弃";
  }
  return "";
}
/**
 * @description: 取消原因
 * @param {srting} cancelType: 取消类型
 * @return {string}
 */
const item_cancelType = (cancelType) =>{
  switch (parseInt(cancelType)) {
    case 1:
      return i18n_t("bet_record.match_cancel2"); //"比赛取消";;
    case 2:
      return i18n_t("bet_record.match_delay"); //"比赛延期";
    case 3:
      return i18n_t("bet_record.match_interrupt"); //"比赛中断";
    case 4:
      return i18n_t("bet_record.match_rematch"); //比赛重赛
    case 5:
      return i18n_t("bet_record.match_waist"); //"比赛腰斩";
    case 6:
      return i18n_t("bet_record.match_give_up"); //"比赛放弃";
    case 17:
      return i18n_t("bet_record.match_advance"); //"赛事提前";
    case 20:
      return i18n_t("bet_record.match_delay2"); //"比赛延迟";
    default:
      return i18n_t("bet.invalid") //注单无效
  }
}
/**
 * @description:输赢状态
 * @param {srting} type: records.orderVOS.betResult
 * @return{string} 盘口类型
 */
const item_status =(type) => {
  switch (parseInt(type)) {
    case 2:
      return i18n_t("bet_record.effective_water_"); //"走水";
    case 3:
      return i18n_t("bet_record.lose"); //输

    case 4:
      return i18n_t("bet_record.win"); //赢
    case 5:
      return i18n_t("bet_record.win_half"); //"赢半";
    case 6:
      return i18n_t("bet_record.lose_half"); //"输半";
    case 7:
      return i18n_t("bet_record.match_cancel2"); //"赛事取消";
    case 8:
      return i18n_t("bet_record.match_delay"); //"赛事延期";
    case 11:
      return i18n_t("bet_record.match_delay2"); //"比赛延迟";
    case 12:
      return i18n_t("bet_record.match_interrupt"); //"比赛中断";
    case 13:
      return i18n_t("bet.invalid"); //"无效";
    case 16:
      return i18n_t("bet.invalid"); //"无效";
    case 15:
      return i18n_t("bet_record.match_give_up"); //"比赛放弃";
  }
}
/**
 * @description:盘口类型
 * @param {sting} type: records.marketType字段
 * @param {sting} langCode: 多语言 默认是中文
 * @return{string} 盘口类型
 */
const marketType = (type, langCode='zh') => {
  var res = "";
    if(type && langCode) {
    switch (type) {
      case "EU":
        res = i18n_t(`odds.${langCode}.EU`); //"欧洲盘";
        break;
      case "HK":
        res = i18n_t(`odds.${langCode}.HK`); //"香港盘";
        break;
      case "US":
        res = i18n_t(`odds.${langCode}.US`); //"美式盘";
        break;
      case "ID":
        res = i18n_t(`odds.${langCode}.ID`); //"印尼盘";
        break;
      case "MY":
        res = i18n_t(`odds.${langCode}.MY`); //"马来盘";
        break;
      case "GB":
        res = i18n_t(`odds.${langCode}.GB`); //"英式盘";
        break;
      default:
        res = "";
        break;
    }
  }
  return res;
}
/**
 * @下注赛事阶段
 * @param type: records.matchType
 */
const matchType = (type, langCode=UserCtr.lang) => {
  let res = "";
  // if(type && langCode) {
  //   res = match_type[type]
  // }

  if(type && langCode) {
        switch (parseInt(type)) {
          case 1:
            res = i18n_t(`odds.${langCode}.morning_session`); //"赛前";
            break;
          case 2:
            res = i18n_t(`odds.${langCode}.list_today_play_title`);//"滚球";
            break;
          case 3:
            res =i18n_t(`odds.${langCode}.match_winner`); //"冠军";
            break;
        }
      }
      return res;

}
/**
 * 投注状态
 * @param orderStatus
 * @returns {string}
 */
const order_status = (orderStatus) => {
  let str = ''
  switch (parseInt(orderStatus)) {
    case 0:
    case 1:
      str = i18n_t("bet.bet_suc"); //"投注成功";
      break;
    case 2:
      str = i18n_t("bet.betting_cancel"); //"注单无效";
      break;
    case 3:
      str = i18n_t("bet.bet_loading"); //"确认中";
      break;
    case 4:
      str = i18n_t("bet.bet_fail"); //"投注失败";
      break
    default:
      break
  }
  return str
}
// 页码变化
const changePage = (arv) => {
  const { current } = arv
  Object.assign(BetRecordHistory.params, {
    page: current
  })
  BetRecordHistory.handle_fetch_order_list()
}
const goPageChange = (v) => {
  Object.assign(BetRecordHistory.params, {
    page: v
  })
  BetRecordHistory.handle_fetch_order_list()
}
const pageSizeChange = (v) => {
  Object.assign(BetRecordHistory.params, {
    size: v.value
  })
  BetRecordHistory.handle_fetch_order_list()
}
/**
 * 复制id
 * @param data
 */
const hand_copy = (data) => {
  copyToClipboard(data)
  GlobalSwitchClass.set_tip_show_state(true, {
    text: i18n_t('bet_record.copyed')
  })
}

/**
 *  0:未结算 1:已结算 数据源 orderVOS
 *  2: 预约 数据源 detailList
 * @param {*} item 
 */
 const data_list = (item) => {
  // 0:未结算 1:已结算 2: 预约
  if([0, 1].includes(BetRecordHistory.selected)) {
    return item.orderVOS
  } else {
    return item.detailList
  }
}
/**
 * 取消预约成功
 */
const cancelSuccess = () => {
  Object.assign(BetRecordHistory.params, {
    page: 1
  })
  BetRecordHistory.handle_fetch_order_list()
}

</script>

<style lang="scss" scoped>
.time{
  color: var(--q-gb-t-c-8);
}

.table-footer-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  height: 50px;
  font-size: 14px;
  background-color: var(--q-gb-bg-c-25);

  span {
    margin-left: 20px;

    .footer-text {
      margin: 0;
      font-weight: 500;
    }
  }
}

.detail-options {
  width: 100%;

  .record-detail-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    margin-left: 18px;
  }

  .item-result {
    display: flex;
    flex-direction: column-reverse;

    .bet-result {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 45px;
      padding: 0 10px;
      height: 24px;
      font-size: 12px;
      border-radius: 20px;
      color: var(--q-gb-t-c-8);
      border: 1px solid var(--q-gb-t-c-8);

      &.win-color {
        color: var(--q-gb-t-c-7);
        border: 1px solid var(--q-gb-t-c-7);
      }
    }
  }
}

.win-color {
  color: var(--q-gb-t-c-7)
}
.pre-redording {
  display: flex;
  flex-direction: column;
}

.no-data-icon {
  width: 200px;
  height: 200px;
}

.record-table {
  position: relative;
  padding: 20px;
  padding-top: 0;
  .changing {
    text-align: center;
    padding-top: 50px;
  }
  &:deep(.q-table) {
    background-color: var(--q-gb-bg-c-22);
    // border-collapse: collapse;
    thead tr{
      background-color: var(--q-gb-bg-c-25);
    }
    tr{
      td:first-child{
        border-radius: 8px 0 0 8px;
      }
      td:last-child {
        border-radius: 0 8px 8px 0;
      }
      td {
        background-color: var(--q-gb-bg-c-25);
        border-bottom-width: 4px;
        border-top-width: 4px;
        border-bottom-color: var(--q-gb-bg-c-22);
        border-top-color: var(--q-gb-bg-c-22);
        border-right-width: 1px;
        border-right-color: var(--q-gb-bg-c-23);
        &:last-child {
          border-right: none;
        }
      }
    }
    th{
      border-top: 2px solid #fff;
      border-bottom: 2px solid #fff;
      &:first-child{
        border-left: 2px solid #fff;
      }
      &:last-child{
        border-right: 2px solid #fff;
      }
    }
  }
  &:deep(.q-table__card) {
    border-radius: 6px;
    box-shadow: none;
    // height: 650px !important;
    border-bottom: none;

  }


  &:deep(.q-table__bottom) {
    border-top: none;
  }

  &:deep(thead tr th) {
    position: sticky;
    z-index: 1
  }

  &:deep(thead tr:first-child th) {
    top: 0
  }

  .record-pagination {
    position: fixed;
    bottom: 0;
    left: calc(50% - 5px);
    width: 1430px;
    transform: translate(-50%, 0);
    :deep(.q-pagination .q-btn-item.q-btn--standard) {
      background-color: var(--q-gb-bg-c-1) !important;
    }
  }

}

.datails-order {
  color: var(--q-gb-t-c-8);
}

.copy {
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    &:before {
      color: var(--q-gb-t-c-2);
    }
  }
}

.record-detail {
  display: flex;
  .record-detail-icon {
    position: absolute;
    top: 0;
    left: -32px;
  }
}

.detail-loading {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, 0);
}
.copy-warp {
  display: flex;
  align-items: center;
}
.copy_icon {
  height: 15px;
  width: 15px;
  cursor: pointer;
  margin-left: 5px;

}

.no-data {
  position: relative;
  width: 100%;
  //margin-left: 50%;
  //transform: translate(-50%, 0);
  .c {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
}

// .my-sticky-header-table{

//   thead tr th{
//     position: sticky;
//     z-index: 1
//   }
//   thead tr:first-child th{
//     top: 0
//   }
//   //   position: sticky
//   //   z-index: 1
//   // thead tr:first-child th
//   //   top: 0
// }</style>