<!--
 * @Description: 单住投注项信息组件 正常
-->
<template>
  <div>
    <div v-for="(item,index) in betViewDataClass.orderNo_bet_obj" :key="index">
      <bet-result :items="item"></bet-result>
      <div>
        <div>
          <!--投注额-->
          <span v-if="item.preOrderDetailStatus == 0 || item.preOrderDetailStatus == 1">
            {{ i18n_t("bet.bet_book_stake")}}
          </span>
          <span>
            {{ i18n_t('common.bets_val')}}
          </span>
          <span>
            {{ i18n_t('common.maxn_amount_val')}}
          </span>
        </div>

        <div>
          <span>{{ format_currency(parseFloat(item.betMoney)/100) }}</span>
          <span>{{ format_currency(parseFloat(item.maxWinMoney)/100) }}</span>
        </div>

      </div>
    </div>
  </div>
 
</template>
<script setup>
import { IconWapper } from 'src/components/icon'
import { format_currency,formatTime } from "src/output/index.js"
import BetResult from './bet-result.vue';
import betViewDataClass from 'src/core/bet/class/bet-view-data-class';

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  id: {   //赛事id
    type: String,
    default: "0"
  },
  item: {}
})

</script>
<style lang="scss" scoped>
.mt5 {
  margin-top: 5px;
}
.fillet {
  border-radius: 4px;
}
/**最后一个投注项*/
.last-item {
  .bet-item {
    border-radius: 4px 4px 0px 0px !important;
  }
}
/*  卡片失去焦点时的样式 */
.bet-single-record {
  padding: 0 15px 15px;
  :deep(.q-card__actions) {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
    margin-top: -15px;
    justify-content: space-between;
    cursor: pointer;
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 10px;
    padding-right: 10px;
  }
  /*  单关投注记录标题 */
  .bet-record-title {
    font-size: 13px;
    height: 30px;
    line-height: 30px;
    i {
      margin-top: -1px;
    }
  }
  /*  卡片组件样式重写 */
  :deep( .q-card__section) {
    margin: 0;
    padding: 0;
    border: 0;
  }
  /**下注失败成功转圈圈图标*/
  .bet-icon-info {
    margin: 0;
    padding: 0;
    height: 18px;
  }
  /**整个投注项*/
  .bet-item {
    margin: -15px;
    margin-top: 0px;
    .row {
      padding: 0;
      margin: 0;
    }
    :deep(i.con-bet_fail ),
    :deep(i.icon-bet_success),
    :deep(i.icon-bet_confirm ) {
      margin-left: -20px;
    }

    /*  确认中的样式 */
    .bet-confirm-handle {
      position: relative;
      top: -2px;
    }

    /*  玩法及队名部分样式 */
    .bet-play-game {
      display: flex;
      align-items: flex-start;
      word-break: break-word;

      /*  盘口名称 */
      .bet-handicap-name {
        margin-top: 2px;
        white-space: pre-wrap;
      }
    }

    /*  队伍名称 */
    .bet-play-team {
      /*display: flex;
      align-items: flex-start; */
      /**第二部分*/
      .part-two{
        width:40px
      }
    }
  }

  /*  最高可赢额值 */
  .bet-win2 {
    padding-bottom: 5px;
  }
  /*  最高可赢额金额  */
  .bet-win-money {
    margin-top: -3px;
  }
}
</style>