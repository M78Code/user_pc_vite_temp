<!--
 * @Author: cooper
 * @Date: 2023-06-27 16:43:55
 * @Description: 注单历史表格组件部分
-->
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
          <div class="no-data">
            <img :src="no_data" alt="" srcset="">
            <div style="text-align: center;color:#A1A3A5;font-weight: 500;">No Data</div>
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
                formatTime(props.row.betTime, "yyyy-mm-dd hh:MM:ss")
              }}</span>
              <div>
                <span class="datails-order">{{ props.row.orderNo }}</span>
                <img :src="bet_copy" alt="" class="copy_icon" title="copy" @click="hand_copy(props.row.orderNo)">
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
              <div v-for="(item, index) in props.row.orderVOS" class="record-detail">
                <div class="record-detail-icon">
                  <sport_icon :sport_id="item.sportId" :status="false" size="18px" class="icon" style="margin:0 10px" />
                </div>

                <span> {{ item.matchName }}</span>
                <span style="color:#8A8986">{{ item.matchInfo }}</span>
                <span>{{ item.playName }}</span>
                <div>
                  <span>{{ item.marketValue }}</span>
                  <span style="margin-left:15px;color:#ff7000">{{ item.oddFinally }}</span>
                </div>


                <!-- <span style="color:#8A8986">bet closed:{{
                  formatTime(item.beginTime, "yyyy-mm-dd hh:MM:ss")
                }}
                </span> -->
              </div>
            </q-td>
            <!-- 投注额 -->
            <q-td key="totalStake" :props="props">
              <span>
                {{ utils.format_balance(props.row.orderAmountTotal) }}</span>
            </q-td>
            <!-- 最高可赢 -->
            <q-td key="highestWin" :props="props">
              <span> {{ utils.format_balance(props.row.maxWinAmount) }}</span>
            </q-td>
            <!-- 返回金额 return -->
            <q-td key="return" :props="props">
              <span> {{ utils.format_balance(props.row.maxWinAmount) }}</span>
            </q-td>
            <!-- 状态 -->
            <q-td key="status" :props="props">
              <span>Bet Placed</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!--分页组件-->

      <Pagination v-if="tableData.length > 0" class="record-pagination" :count="total" :betTotalAmount="40"
        @pageChange="changePage(arguments)">
      </Pagination>


    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useGetOrderList } from "./tableConfig";
import { formatTime } from "src/public/utils/time_format";
import { utils } from "src/public/utils/utils";
import Pagination from "src/components/Pagination.vue";
import football_icon from 'src/assets/images/football_icon.png'
import no_data from 'src/assets/images/no_data.png'
import bet_copy from 'src/assets/images/bet_copy.png'
import sport_icon from "src/components/sport_icon.vue";
import store from "src/store-redux-vuex/index.js";

const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  }
})
const match_type = {
  1: 'Prematch',
  2: 'In-Play',
  3: 'Outrights',
}

const { columns, tableData, total, loading, handle_fetch_order_list } = useGetOrderList();
const labelClick = (row) => {
  console.log(row);
};
// 监听tab 切换表格头数据
watch(() => props.current_tab, (newVal) => {
  tableData.value = []
  if (newVal == 'settled') {
    columns.value[5] = {
      name: "return",
      label: "Return",
      align: "center",
      field: "return",
    }
    handle_fetch_order_list({orderStatus:1})
  } else {
    columns.value[5] = {
      name: "highestWin",
      label: "Highest Win",
      align: "center",
      field: "highestWin",
    }
    handle_fetch_order_list({orderStatus:0})

  }
})

const getTableData = (params)=>{
  handle_fetch_order_list(params)
}


defineExpose({getTableData})
// 页码变化
const changePage = (arv) => {
  //  console.log(1111111111,arv)
}
const hand_copy = (data) => {
  let oInput = document.createElement("input");
  oInput.value = data;
  document.body.appendChild(oInput);
  oInput.select();
  // this.toast = true;
  // clearTimeout(this.timeout_toast);
  // this.timeout_toast = setTimeout(() => {
  //   this.toast = false;
  // }, 1500);
  document.execCommand("Copy");
  oInput.remove();
  store.dispatch({
    type: "TIP_SHOW_STATE",
    data: true,
  })
}
</script>

<style lang="scss" scoped>
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
    width: 1442px;
    transform: translate(-50%, 0);
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
      color: $basic-color;
    }
  }
}

.record-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-left: 18px;

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
  // width: 100%;
  position: absolute;
  left: 50%;
  top: 200%;
  transform: translate(-50%, 0);
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
