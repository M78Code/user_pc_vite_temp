<template>
  <div class="choose-carefully-wrapper" :style="{height:`${container_height}px`}">
    <div v-if="Object.keys(get_note_sheet_records_data).length > 0">
      <!-- 加载中 -->
      <div v-for="(value,name,index) in get_note_sheet_records_data" :key="index" >
        <div v-for="(item2,key) in value.data" :key="key" class="my-4">
          <common-cathectic-item :item_data="item2"></common-cathectic-item>
        </div>
      </div>
    </div>
    <!-- 去投注 -->
    <settle-void v-if="Object.keys(get_note_sheet_records_data).length <= 0"></settle-void>
  </div>
</template>

<script setup>
import commonCathecticItem from "src/base-h5/components/common/common-cathectic-item.vue";
// import {mapGetters} from "vuex";
import settleVoid from "src/base-h5/components/cathectic/settle-void.vue";
import { onMounted,provide,ref } from "vue";

// provide("queryorderpresettleconfirm_data") // 待确认中的提前结算订单，实际上赛果页面不会有未结算的订单，这里是占位，避免报错
const  list_data = ref({})  //列表数据
const container_height =ref(0)
const  get_note_sheet_records_data= ref({
    // "2023-12-20": {
    //     "betAmount": 11,
    //     "data": [
    //         {
    //             "acCode": "",
    //             "addition": 0,
    //             "backAmount": 22.55,
    //             "betTime": "1703042580240",
    //             "betTimeStr": "2023-12-20",
    //             "enablePreSettle": false,
    //             "initPresettleWs": false,
    //             "langCode": "zh",
    //             "managerCode": 1,
    //             "marketType": "EU",
    //             "maxCashout": null,
    //             "maxWinAmount": 11.33,
    //             "orderAmountTotal": 11,
    //             "orderNo": "5108966189343342",
    //             "orderStatus": "1",
    //             "orderVOS": [
    //                 {
    //                     "batchNo": "",
    //                     "beginTime": "1703048400000",
    //                     "betResult": 4,
    //                     "betStatus": 1,
    //                     "cancelType": 0,
    //                     "closingTime": null,
    //                     "hs": 0,
    //                     "langCode": "",
    //                     "marketId": "145521470554210306",
    //                     "marketType": "EU",
    //                     "marketValue": "大 2.5",
    //                     "matchDay": "",
    //                     "matchId": "2977021",
    //                     "matchInfo": "广岛三箭(女) v 浦和红钻(女)",
    //                     "matchName": "日本女子职业联赛",
    //                     "matchType": 1,
    //                     "oddFinally": "2.05",
    //                     "oddsValue": "",
    //                     "outrightYear": "",
    //                     "playId": 2,
    //                     "playName": "全场大小",
    //                     "playOptions": "Over",
    //                     "playOptionsId": "141332002597614370",
    //                     "scoreBenchmark": "",
    //                     "settleScore": "FT Score 1-2",
    //                     "sportId": 1,
    //                     "sportName": "足球",
    //                     "tournamentId": "9280",
    //                     "tournamentPic": "group1/M00/18/2E/CgURt2OnZd2AYmp7AAAOYrBYQjg727.png"
    //                 }
    //             ],
    //             "outcome": 4,
    //             "preBetAmount": null,
    //             "preOrder": 1,
    //             "preSettleBetAmount": null,
    //             "profitAmount": 11.55,
    //             "seriesSum": 1,
    //             "seriesType": "1",
    //             "seriesValue": "单关",
    //             "settleTime": "1703053068478",
    //             "settleType": 1
    //         }
    //     ],
    //     "totalOrders": 1,
    //     "profit": 11.55
    // }
})
onMounted(()=>{
    // tcontainer_height.value = innerHeight - rem(1.68)
})


</script>

<style lang="scss" scoped>
.choose-carefully-wrapper {
  width: 100%;
  border-top: 1px solid transparent;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
