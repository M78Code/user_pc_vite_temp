<template>
  <div class="record-table">
    <div>

      <q-table :rows="tableData" style="max-height:calc(100vh - 270px)" :rows-per-page-options="[0]" :columns="columns"
               row-key="orderNo" separator="cell" hide-pagination :class="current_tab === 'settled' ? 'settled' : 'unsettled'"
          :table-header-style="{
          backgroundColor: '#F1F1F1',
          height: '28px',
          color: '#2A2925',
          fontSize: '12px',
        }">
        <template v-slot:no-data>
          <div class="detail-loading" v-if="loading">
            <loading-ing />
          </div>
          <div class="no-data" style="height:calc(100vh - 270px)" v-else>
            <div class="c">
              <img class="no-data-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no-data.svg`" alt="" srcset="">
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
              <div>
                <span class="datails-order">{{ props.row.orderNo }}</span>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/bet_copy.png`" alt="" class="copy_icon"
                     :title="i18n_t('ouzhou.record.copy')" @click="hand_copy(props.row.orderNo)">
                <!-- <img :src="bet_copy" alt="" class="copy_icon" title="copy"  @click="copy(props.row.orderNo)" > -->
                <!-- <i class="icon-icon_copy copy" color="red" @copy_iconclick="copy(props.row.orderNo)"></i> -->
              </div>
            </q-td>
            <!-- 投注玩法 -->
            <q-td key="bettingType" :props="props">
              <!-- 串关 -->
              <template v-if="props.row.seriesType != '1' || props.row.seriesType == '3'">{{props.row.seriesValue}}</template>
              <!-- 单关 -->
              <template v-else>
                <template v-for="(item, index) in props.row.orderVOS" :key="index">
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
                  <div v-for="(item, index) in props.row.orderVOS" :key="index" class="record-detail">
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
                        <span>{{ item.marketValue }}</span>
                        <span style="margin-left:15px;color:#ff7000">@{{ item.oddFinally }}</span>
                      </div>

                      <div class="play-type settle-score" v-if="current_tab === 'settled' && item.settleScore">
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
               <span
                 :class="{'win-color': [4,5].includes(props.row.outcome)}"
               >
                 {{ format_balance(current_tab === 'unsettled' ? props.row.maxWinAmount : props.row.backAmount) }}
               </span>
<!--              <span v-else>- -</span>-->
            </q-td>
            <!-- 状态 -->
            <q-td key="status" :props="props">
              <!--
                   0:待处理,1:已处理,2:取消交易,3:待确认,4:已拒绝
                   0、3未结算
                   1、2、4已结算
                 -->
              <span :class="status_class(props.row.orderStatus)">{{ order_status(props.row.orderStatus) }}</span>
              <!--显示部分提前结算或者全额提前结算-->
              <!--              <span v-if="current_tab=='settled'" class="bet-pre-color">-->
              <!--                      <template v-if="props.row.settleType==4">{{i18n_t('bet_record.settlement_pre_part2')}}</template>-->
              <!--                      <template v-else-if="props.row.settleType==5">{{i18n_t('bet_record.settlement_pre_all2')}}</template>-->
              <!--                    </span>-->
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!--分页组件-->

      <Pagination v-if="tableData.length > 0" class="record-pagination" :count="records.total" 
                  :betTotalAmount="records.betTotalAmount"
                  @pageChange="changePage"
                  @pageSizeChange="pageSizeChange"
                  @goPageChange="goPageChange"
                  :profit="records.profit"
                  :reset_pagination="pageCurrent"
                  :is_bet_record="true"
                  :isUnsettled="current_tab === 'unsettled'"
      >
      </Pagination>
      <!--      <pagination-wrapper-->
      <!--        v-if="tableData.length > 0"-->
      <!--        class="record-pagination"-->
      <!--        :count="500"-->
      <!--        @pageChange="changePage"-->
      <!--        :is_bet_record="false"-->
      <!--      ></pagination-wrapper>-->


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
import sportIcon from "src/components/sport_icon/sport-icon.vue";
// 引入加载中的组件
import LoadingIng from "src/components/loading/loading.vue"

// import { PaginationWrapper } from "src/components/pagination/index.js";
import sport_icon from './sport_icon.vue'
// import football_icon from 'src/assets/images/football_icon.png'
import { copyToClipboard } from 'quasar'
import GlobalSwitchClass from 'src/core/global/global.js'
const lang = computed(() => {
  return UserCtr.lang;
})
const pageSize = ref('50')
const pageCurrent = ref('1')
const getRowIndex = (rowIndex) => {
  return (pageCurrent.value - 1) * pageSize.value + rowIndex + 1;
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
const { columns, tableData, loading, handle_fetch_order_list,records } = useGetOrderList()
const labelClick = (row) => {
  console.log(row)
}
watch(() => props.timeType, (newVal) => {
  pageCurrent.value = '1'
})
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
    console.log(tableData)
  } else {
    columns.value[5] = {
      name: 'highestWin',
      label: i18n_t("common.maxn_amount_val"),
      align: 'center',
      field: 'highestWin'
    }
    handle_fetch_order_list({ orderStatus: 0 })
    console.log(tableData)
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
  // console.log('type===langCode===', type,  langCode)
  // console.log('type===langCode=ccc==', `odds.${langCode}.morning_session`)
  if(type && langCode) {
        switch (parseInt(type)) {
          case 1:
            res = i18n_t(`odds.${UserCtr.lang}.morning_session`); //"赛前";
            break;
          case 2:
            res = i18n_t(`odds.${UserCtr.lang}.list_today_play_title`);//"滚球";
            break;
          case 3:
            res =i18n_t(`odds.${UserCtr.lang}.match_winner`); //"冠军";
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
  pageCurrent.value = current
  emit('itemFilter', {
    page: current,
    size: +pageSize.value,
    timeType: props.timeType
  })
}
const goPageChange = (v) => {
  pageCurrent.value = v
  emit('itemFilter', {
    page: v,
    size: +pageSize.value,
    timeType: props.timeType
  })
}
const pageSizeChange = (v) => {
  pageSize.value = v.value
  pageCurrent.value = '1'
  emit('itemFilter', {
    page: 1,
    size: v.value,
    timeType: props.timeType
  })
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
</script>

<style lang="scss" scoped>
.time{
  color: var(--q-gb-t-c-8);
}
.detail-options {
  width: 100%;

  .record-detail-list {
  }

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

.no-data-icon {
  width: 200px;
  height: 200px;
}

.record-table {
  position: relative;
  margin-top: 10px;

  .unsettled {
    padding-bottom: 50px;
  }
  .settled {
    padding-bottom: 62px;
  }

  &:deep(.q-table__card) {
    box-shadow: none;
    // height: 650px !important;
    border-bottom: none;

  }

  &:deep(.q-table td) {

    border-bottom: 1px solid var(--q-gb-bd-c-2);

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
    background-color: var(--q-gb-bg-c-4);
    box-shadow: 0 -4px 8px var(--q-gb-bg-c-15);

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
  padding-top: 150px;
  width: 100px;
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