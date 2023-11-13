<template>
  <div class="record-table">
    <div>

      <q-table :rows="tableData" style="max-height:calc(100vh - 17rem)" :rows-per-page-options="[0]" :columns="columns"
               row-key="orderNo
" separator="cell" hide-pagination :table-header-style="{
  backgroundColor: '#F1F1F1',
  height: '28px',
  color: '#2A2925',
  fontSize: '12px',
}">
        <template v-slot:no-data>
          <div class="detail-loading" v-if="loading">
            <q-circular-progress indeterminate rounded size="80px" :thickness="0.1" color="opt-basic" class="q-ma-md" />
          </div>
          <div class="no-data" style="height:calc(100vh - 17rem)">
            <div class="c">
              <img class="no-data-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no-data.svg`" alt="" srcset="">
              <div style="text-align: center;color:#A1A3A5;font-weight: 500;">No Data</div>
            </div>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- 编号 -->
            <q-td key="sn" :props="props">
              <span @click="labelClick(props)">{{ props.rowIndex + 1 }}</span>
            </q-td>
            <!-- 投注详情 -->
            <q-td key="datails" :props="props">
              <span>{{
                  formatTime(props.row.betTime, 'yyyy-mm-dd hh:MM:ss')
                }}</span>
              <div>
                <span class="datails-order">{{ props.row.orderNo }}</span>
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/bet_copy.png`" alt="" class="copy_icon"
                     title="copy" @click="hand_copy(props.row.orderNo)">
                <!-- <img :src="bet_copy" alt="" class="copy_icon" title="copy"  @click="utils.copy(props.row.orderNo)" > -->
                <!-- <i class="icon-icon_copy copy" color="red" @copy_iconclick="utils.copy(props.row.orderNo)"></i> -->
              </div>
            </q-td>
            <!-- 投注玩法 -->
            <q-td key="bettingType" :props="props">
              <template v-for="(item, index) in props.row.orderVOS">
                <div>{{ match_type[item.matchType] }}</div>
                <span>{{ item.playName }}</span>
              </template>
            </q-td>
            <!-- 投注选项 -->
            <q-td key="detail" :props="props">
              <div class="detail-options">
                <div class="record-detail-list">
                  <div v-for="(item, index) in props.row.orderVOS" class="record-detail">
                    <div class="record-detail-item">
                      <div class="record-detail-icon">
                        <sport_icon :sport_id="item.sportId" :status="false" size="18px" class="icon"
                                    style="margin:0 10px" />
                      </div>

                      <span> {{ item.matchName }}</span>
                      <span style="color:#8A8986">{{ item.matchInfo }}</span>
                      <span>
                          <span v-if="item.matchType != 3 && ![1001,1002,1009,1010,1011].includes(item.sportId*1)">{{matchType(item.matchType, props.row.langCode)}}</span>
                        {{ item.playName }}
                      </span>
                      <div>
                        <span>{{ item.marketValue }}</span>
                        <span style="margin-left:15px;color:#ff7000">{{ item.oddFinally }}</span>
                      </div>


                      <!-- 10/20 15:30 -->
                      <span
                        class="time"
                        v-if="!props.row.acCode && item.beginTime"
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
<!--                      <template v-if="['0','1'].includes(props.row.orderStatus) && props.row.seriesType != '1'">-->
<!--                        &lt;!&ndash; betstatus无效 &ndash;&gt;-->
<!--                        <template v-if="[3, 4].includes(item.betStatus)">-->
<!--                              <span-->
<!--                                v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"-->
<!--                                class="bet-result lose-color"-->
<!--                              >-->
<!--                                {{ item_cancelType(item.cancelType) }}-->
<!--                              </span>-->
<!--                          <span v-else class="bet-result lose-color">{{ $root.$t('bet.invalid') }}</span>-->
<!--                        </template>-->
<!--                        &lt;!&ndash; 其他 &ndash;&gt;-->
<!--                        <span-->
<!--                          v-if="item.betStatus==1"-->
<!--                          class="bet-result"-->
<!--                          :class="item_class(item.betResult)"-->
<!--                        >{{ item_status(item.betResult) }}</span>-->
<!--                      </template>-->
                      <!-- 未结算串关、已结算串关 -->
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
                 v-if="current_tab==='settled'"
               >
                 {{ format_balance(tool_selected === 'settled' ? props.row.maxWinAmount : props.row.backAmount) }}
               </span>
              <span v-else>- -</span>
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
              <!--              <span v-if="tool_selected=='settled'" class="bet-pre-color">-->
              <!--                      <template v-if="props.row.settleType==4">{{$root.$t('bet_record.settlement_pre_part2')}}</template>-->
              <!--                      <template v-else-if="props.row.settleType==5">{{$root.$t('bet_record.settlement_pre_all2')}}</template>-->
              <!--                    </span>-->
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!--分页组件-->

      <Pagination v-if="tableData.length > 0" class="record-pagination" :count="total" :betTotalAmount="40"
                  @pageChange="changePage">
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
import { formatTime } from 'src/core/format/index.js'
import { UserCtr, format_balance, LOCAL_PROJECT_FILE_PREFIX,i18n_t } from 'src/core/index.js'
import Pagination from 'project_path/src/components/Pagination.vue'
// import { PaginationWrapper } from "src/components/pagination/index.js";
import sport_icon from './sport_icon.vue'
// import football_icon from 'src/assets/images/football_icon.png'
// import { copyToClipboard } from 'quasar'
import GlobalSwitchClass from 'src/core/global/global.js'
const lang = computed(() => {
  return UserCtr.lang;
})
const emit = defineEmits(['itemFilter'])
const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  }
})

const match_type = {
  1: i18n_t("bet.morning_session"),
  2: i18n_t("list.list_today_play_title"),
  3: i18n_t("menu.match_winner")
}
const { columns, tableData, total, loading, handle_fetch_order_list } = useGetOrderList()
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
    handle_fetch_order_list({ orderStatus: 1 })
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
 * @下注赛事阶段
 * @param type: records.matchType
 */
const matchType = (type, langCode=UserCtr.lang) => {
  let res = "";
  if(type && langCode) {
    res = match_type[type]
  }
  return res;
}
const order_status = (orderStatus) => {
  let str = ''
  switch (parseInt(orderStatus)) {
    case 0:
    case 1:
      str = 'Bet Placed' //"投注成功";
      break
    case 2:
      str = 'Bet Voided' //"注单无效";
      break
    case 3:
      str = 'Processing' //"确认中";
      break
    case 4:
      str = 'Betting Failed' //"投注失败";
      break
    default:
      break
  }
  return str
}
// 页码变化
const changePage = (arv) => {
  const { current } = arv
  console.log(1111111111, arv)
  emit('itemFilter', { page: current })
}
const hand_copy = (data) => {
  // copyToClipboard(data)
  GlobalSwitchClass.set_tip_show_state(true)
}
</script>

<style lang="scss" scoped>
.time{
  color: #8A8986;
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
      width: 45px;
      height: 24px;
      font-size: 12px;
      border-radius: 20px;
      color: #8A8986;
      border: 1px solid #8A8986;

      &.win-color {
        color: #FF4646;
        border: 1px solid #FF4646;
      }
    }
  }
}

.win-color {
  color: #FF4646
}

.no-data-icon {
  width: 200px;
  height: 200px;
}

.record-table {
  position: relative;
  margin-top: 10px;

  &:deep(.q-table) {
    // min-height: 650px !important;

  }

  &:deep(.q-table__card) {
    box-shadow: none;
    // height: 650px !important;
    border-bottom: none;

  }

  &:deep(.q-table td) {

    border-bottom: 1px solid #e2e2e2;

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
    left: 50%;
    width: 1430px;
    transform: translate(-50%, 0);
    background-color: #fff;
    box-shadow: 0 -4px 8px #f5f5f5;

    :deep(.q-pagination .q-btn-item.q-btn--standard) {
      background-color: #ff7000 !important;
    }
  }

}

.datails-order {
  color: #8a8986;
}

.copy {
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    &:before {
      color: #FF7000;
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
