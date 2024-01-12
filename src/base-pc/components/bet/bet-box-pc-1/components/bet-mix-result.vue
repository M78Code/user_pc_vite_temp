
<template>
  <q-card flat class="bet-mix-result-card">
    <!--玩法,提示及删除区域-->
    <q-card-section
      :class="{'bet-fail-bg':(series_obj.orderStatusCode==0),
      'bet-success-bg':(series_obj.orderStatusCode==1),
      'bet-confirm-bg':(series_obj.orderStatusCode==2)
      }">
      <div class="odds-wrap row">
        <div class="line"></div>
        <!--几串几-->
        <div class="col bet-play-info yb-fontsize13">{{series_obj.seriesValue}}</div>
        <!--投注状态0:投注失败 1:投注成功 2:投注确认中-->
        <div class="col-auto bet-icon-info">
          <template v-if="series_obj.orderStatusCode==0">
            <!--投注失败图标-->
            <icon-wapper name="icon-failure" size="18px"/>
          </template>
          <template v-if="series_obj.orderStatusCode==1">
            <!--投注成功图标-->
            <icon-wapper name="icon-success" size="18px"/>
          </template>
          <template v-if="series_obj.orderStatusCode==2">
            <!--投注确认中转圈-->
            <span class="bet-confirm-handle"><img :src="(`/image/wwwassets/yabo/gif/${BetData.theme}/${BetData.theme}_confirming.gif`)" style="width:18px;height:18px"/></span>
          </template>
        </div>
      </div>
      <div class="row bet-win-info">
        <div class="col yb-fontsize12">
          <!--投注额-->
          {{ i18n_t('common.bets_val')}}
        </div>
         <div class="col-auto yb-fontsize12">
          {{ i18n_t('common.maxn_amount_val')}}
          <!-- 最高可赢额-->
        </div>
      </div>
      <div class="row bet-win-info2 yb-fontsize12">
        <!--投注额(值)-->
        <div class="col bet-win-value">
          {{parseFloat(series_obj.seriesBetAmount/100) ||format_currency}}
        </div>
        <!--最高可赢额(值)-->
        <div class="col-auto bet-win-value text-right yb-fontsize12">{{parseFloat(max_win_amount)}}</div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { IconWapper } from 'src/components/icon'
// import bet_mix_result from "src/public/mixins/bet/bet_mix_result.js";
// import { format_currency } from 'src/output/index.js'
const props = defineProps({
  series_obj:{}
})

</script>
<style lang="scss" scoped>
/* *卡片获取焦点时的样式* */
.bet-mix-result-card {
  padding: 15px;
  margin: 0;
  line-height: 0;
  border: 0;

  /* *卡片组件样式重写* */
  :deep(.q-card__section){
    margin: 0;
    padding: 0;
    line-height: 0;
    margin-top: -15px;
    margin-left: -15px;
    margin-right: -15px;
    padding-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: -15px;
    padding-bottom: 15px;
    /*  投注失败背景样式 */
    &.bet-fail-bg {
      background: rgba(255, 0, 0, 0.15);
    }
    :deep(.icon-bet_fail.q-icon.c-icon ) {
      margin-top: -1px;
    }
    /*  投注图标  */
    .bet-icon-info {
      margin: 0;
      padding: 0;
      height: 18px;
    }
    /*  串关几串几样式 */
    .bet-play-info {
      line-height: 1;
      padding-top: 3px;
      padding-left: 10px;
      border-radius: 1.5px;
    }

    /*  最低限额 */
    .bet-win-info {
      line-height: 1;
      align-items: center;
      margin-top: 10px !important;
      padding-bottom: 6px !important;

      /*  最高限额 */
    }
    .bet-win-info2 {
      line-height: 1;
      /*  确认中的样式位置   */
      .bet-confirm-handle {
        position: relative;
        margin-right: 5px;
        top: -2px;
      }
    }
  }
}
</style>
