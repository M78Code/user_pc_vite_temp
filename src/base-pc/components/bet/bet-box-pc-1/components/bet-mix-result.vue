
<template>
  <q-card flat class="bet-mix-result-card">
    <!--玩法,提示及删除区域-->
    <q-card-section>
      
      <div class="odds-wrap row">
        <!--几串几-->
        <div data-v-c14bfede="" class="line"></div>
        <div class="col bet-play-info yb-fontsize13">{{items.seriesValue}}</div>
        <!--投注状态0:投注失败 1:投注成功 2:投注确认中-->
        <div class="col-auto bet-icon-info">
          <template v-if="items.orderStatusCode==0">
            <!--投注失败图标-->
            <icon-wapper name="icon-failure" size="18px"/>
          </template>
          <template v-if="items.orderStatusCode==1">
            <!--投注成功图标-->
            <icon-wapper name="icon-success" size="18px"/>
          </template>
          <template v-if="items.orderStatusCode==2">
            <!--投注确认中转圈-->
            <!-- <span class="bet-confirm-handle"><img :src="(`/image/wwwassets/yabo/gif/${BetData.theme}/${BetData.theme}_confirming.gif`)" style="width:18px;height:18px"/></span> -->
          </template>
        </div>
      </div>

      <div class="row bet-win-info">
        <div class="col">
          <!--投注额-->
          {{ i18n_t('common.bets_val')}}
        </div>
          <div class="col auto text-right">
          {{ i18n_t('common.maxn_amount_val')}}
          <!-- 最高可赢额-->
        </div>
      </div>
      <div class="row bet-win-info2">
        <!--投注额(值)-->
        <div class="col bet-win-value">
          {{parseFloat(items.seriesBetAmount/100) }}
        </div>
        <!--最高可赢额(值)-->
        <div class="col auto bet-win-value text-right">{{parseFloat(items.maxWinAmount/100)}}</div>
      </div>
    
    </q-card-section>
  </q-card>
</template>
<script setup>
import { IconWapper } from 'src/components/icon'
const props = defineProps({
  items:{}
})

</script>
<style lang="scss" scoped>
/* *卡片获取焦点时的样式* */
.bet-mix-result-card {
  padding: 0;
  background: var(--q-bet-box-6);
  // margin: 0;
  // line-height: 0;
  // border: 0;
.odds-wrap{
  padding-top: 15px;
}
  /* *卡片组件样式重写* */
  :deep(.q-card__section){
    margin: 0;
    padding: 0;
    line-height: 0;
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
      padding-top: 1px;
      padding-left: 10px;
      border-radius: 1.5px;
    }

    /*  最低限额 */
    .bet-win-info {
      line-height: 1;
      align-items: center;
      margin-top: 6px !important;
      padding-bottom: 6px !important;
      padding-left: 15px;
      padding-right: 15px;
      /*  最高限额 */
    }
    .bet-win-info2 {
      line-height: 1;
      padding-left: 15px;
      padding-right: 15px;
      padding-bottom: 15px;
    }
  }
  .line {
      width: 3px;
      height: 14px; 
      background: var(--q-bet-box-2);
      border-radius: 1.5px ;
      margin-left:2px;
  }
}
</style>
