<!--
 * @Author: 
 * @Date: 
 * @Description: bw3新版矩形框底部
-->
<template>
  <div class="item-footer yb_mx10 yb_px14 yb_mt10 yb_pt8 row yb_fontsize12">
    <!-- 左 -->
    <div class="col-4">
      <p class="top-p">{{ is_pre ?  i18n.t('pre_record.book_bet_amount') : i18n.t('bet_record.bet_val2') }}</p>
      <p class="yb_fontsize14 money-p" v-if="data_f.orderAmountTotal">{{ format_money2(data_f.orderAmountTotal)}}</p>
    </div>

    <!-- 中 -->
    <!-- 未结算页面 -->
    <div v-if="get_main_item == 0 || get_main_item == 2">
      <!-- 订单状态orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
      <template v-if="data_f.orderStatus == 1 || data_f.orderStatus == 2 || data_f.orderStatus == 4">
        <p class="top-p">{{i18n.t('bet_record.go_back')}}</p>
        <!-- 有返还金额取返还金额，没有返还金额取投注金额 -->
        <p class="yb_fontsize14 money-p" :class="is_win && 'red'">
          <template v-if="data_f.backAmount !== null">{{ format_money2(data_f.backAmount)}}</template>
          <template v-else>{{ format_money2(data_f.orderAmountTotal)}}</template>
        </p>
      </template>
      <template v-else>
        <p class="top-p" v-if="[2,3].includes(data_f.preOrderStatus)||data_f.preOrderStatus == 4">
          <!-- {{i18n.t('bet_record.bet_refund')}} -->
        </p>
        <p class="top-p" v-else>{{i18n.t('bet_record.bet_max_win')}}</p>
        <p class="yb_fontsize14 money-p" v-if="[2,3].includes(data_f.preOrderStatus)||data_f.preOrderStatus == 4">
          <!-- 留空处理 -->
          <!-- <template v-if="data_f.acCode">- -</template> -->
          <!-- 返还金额 -->
          <!-- <template v-else>{{data_f.backAmount | format_money2}}</template> -->
        </p>
        <p class="yb_fontsize14 money-p" v-else>
          <!-- 留空处理 -->
          <template v-if="data_f.acCode">- -</template>
          <!-- 最高金额 -->
          <template v-else>{{ format_money2(data_f.maxWinAmount)}}</template>
        </p>
      </template>
    </div>
    <!-- 已结算页面 -->
    <div v-else>
      <p class="top-p">{{ i18n.t('bet_record.go_back') }}</p>
      <p class="yb_fontsize14 money-p" :class="is_win && 'red'">{{ format_money2(data_f.backAmount)}}</p>
    </div>

    <!-- 右 -->
    <div class="text-right" style="margin-left:auto">
      <p class="top-p">{{calc_settle_score}}</p>
      <!-- 订单状态 -->
      <p v-if='!is_pre' :class="class_foter" class="yb_fontsize12" style="line-height:0.2rem">{{calc_text}}</p>
    </div>

  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
  const props = defineProps({
    data_f: {
      type: Object
    },
    is_pre: {
      type: Boolean
    }
  })
//订单状态的颜色类名
  const class_foter = ref('')
  const bet_result = ref({
    //'未结算',
    // "0": i18n.t("bet_record.bet_no_status00"), 
    //'走水',
    "2": i18n.t("bet_record.bet_no_status02"), 
     //'输',
    "3": i18n.t("bet_record.bet_no_status03"),
    //'赢',
    "4": i18n.t("bet_record.bet_no_status04"), 
    //'赢半',
    "5": i18n.t("bet_record.bet_no_status05"), 
    //'输半',
    "6": i18n.t("bet_record.bet_no_status06"), 
    //'比赛取消',
    "7": i18n.t("bet_record.bet_no_status07"), 
    //'比赛延期',
    "8": i18n.t("bet_record.bet_no_status08"), 
    // '比赛延迟',
    "11": i18n.t("bet_record.bet_no_status11"), 
    // '比赛中断',
    "12": i18n.t("bet_record.bet_no_status12"), 
    // '比赛放弃'
    "15": i18n.t("bet_record.bet_no_status15"), 
  }) 
  const outcome = ref({
    //'走水',
    "2": i18n.t("bet_record.bet_no_status02"), 
    //'输',
    "3": i18n.t("bet_record.bet_no_status03"), 
    //'赢',
    "4": i18n.t("bet_record.bet_no_status04"), 
    //'赢半',
    "5": i18n.t("bet_record.bet_no_status05"), 
    //'输半',
    "6": i18n.t("bet_record.bet_no_status06"), 
  }) 
  const bet_result_1 = ref({
    "7": i18n.t("bet_record.bet_no_status07"),
    "8": i18n.t("bet_record.bet_no_status08"),
    "11": i18n.t("bet_record.bet_no_status11"),
    "12": i18n.t("bet_record.bet_no_status12"),
    "15": i18n.t("bet_record.bet_no_status15")
  }) 
  //手动取消订单的原因展示
  const bet_result_3 = ref({
    "1": i18n.t("bet_record.cancel_type_1"),
    "2": i18n.t("bet_record.cancel_type_2"),
    "3": i18n.t("bet_record.cancel_type_3"),
    "4": i18n.t("bet_record.cancel_type_4"),
    "5": i18n.t("bet_record.cancel_type_5"),
    "6": i18n.t("bet_record.cancel_type_6"),
    "17": i18n.t("bet_record.cancel_type_17"),
    "20": i18n.t("bet_record.cancel_type_20"),
  }) 
  //这一单是否赢钱了
  const is_win = ref(false)   
  onUnmounted(() => {
    // for (const key in $data) {
    //   $data[key] = null
    // }
  }) 
  
    // ...mapGetters(["get_main_item"]),
    //单关已结算投注成功状态（orderStatus == 1）此位置需要返回结算比分
    //单关注单无效状态（orderStatus == 2）此位置需要返回无效原因
  const calc_settle_score = () => {
      if (data_f.seriesType == '1' && data_f.orderVOS[0]) {
        if (data_f.orderStatus == '1') {
          return data_f.orderVOS[0].settleScore
        } else if (data_f.orderStatus == '2') {
          let betstatus = data_f.orderVOS[0].betStatus;
          let betresult = data_f.orderVOS[0].betResult;
          let canceltype = data_f.orderVOS[0].cancelType;
          if (betstatus == 1) {
            return bet_result_1[betresult] || '';
          } else if (betstatus == 3 || betstatus == 4) {
            return bet_result_3[canceltype] || '';
          } else {
            return '';
          }
        } else {
          return ''
        }
      }

    }
    //返回订单状态
  const calc_text = () => {
      let res = '';
      switch (data_f.orderStatus) {
        case '0':
          class_foter = 'green'
          res = i18n.t('bet_record.successful_betting')
          break;
        case '1':
          class_foter = 'black'
          let flag = data_f.seriesType == '1' && data_f.orderVOS[0]
          //单关
          if (flag) {   
            if (+data_f.preBetAmount > 0) { 
               // 提前结算的输赢单独一套逻辑算
              let difference = data_f.backAmount - data_f.orderAmountTotal
              // 赢
              if (difference > 0) {     
                class_foter = 'red'
                is_win = true
                res = bet_result[4]
              } else if (difference < 0) { 
                 // 输
                res = bet_result[3]
              } else {  // 走水
                res = bet_result[2]
              }
              break;
            }
            let betresult = data_f.orderVOS[0].betResult
            if (betresult == 13 || betresult == 16) {
              res = i18n.t('bet_record.invalid');
            } else {
              if (betresult == 4 || betresult == 5) {
                class_foter = 'red'
                is_win = true
              }
              res =  bet_result[betresult] || '';
            }
          } else {  
            //串关
            if (data_f.outcome == 4 || data_f.outcome == 5) {
              class_foter = 'red'
              is_win = true
            }
            res = outcome[data_f.outcome] || i18n.t('bet_record.successful_betting')
          }
          break;
        case '2':
          class_foter = 'black'
          res = i18n.t('bet_record.invalid_bet')
          break;
        case '3':
          class_foter = 'orange'
          res = i18n.t('bet_record.confirming')
          break;
        case '4':
          class_foter = 'red'
          res = i18n.t('bet.bet_err')
          break;
        default:
          res = ''
          break;
      }
      return res;
    }
</script>

<style lang="scss" scoped>
.item-footer {
  height: 0.5rem;
  border-radius: 0.04rem;
  .result-p {
    line-height: 0.12rem;
  }
  .top-p {
    margin-bottom: -0.02rem;
    min-height: 0.18rem;
  }
}
</style>
