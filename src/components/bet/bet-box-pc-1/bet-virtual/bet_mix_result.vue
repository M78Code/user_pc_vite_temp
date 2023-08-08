<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注结果
-->
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
        <div class="col bet-play-info yb-fontsize13">
          {{series_obj.seriesValue}}</div>
        <div class="col-auto bet-icon-info">
          <template v-if="series_obj.orderStatusCode==0">
            <icon name="icon-failure" size="18px"/>
          </template>
          <template v-if="series_obj.orderStatusCode==1">
            <icon name="icon-success" size="18px"/>
          </template>
          <template v-if="series_obj.orderStatusCode==2">
            <span class="bet-confirm-handle"><img :src="(`${$g_image_preffix}/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_confirming.gif`)" style="width:18px;height:18px"/></span>
          </template>
        </div>
      </div>
      <div class="row bet-win-info">
        <div class="col yb-fontsize12">
          <!--投注额-->
          {{$root.$t('common.bets_val')}}
        </div>
         <div class="col-auto yb-fontsize12">
          {{$root.$t('common.maxn_amount_val')}}
          <!-- 最高可赢额 max_win_money-->
        </div>
      </div>
      <div class="row bet-win-info2 yb-fontsize12">
        <div class="col bet-win-value">
          {{parseFloat(series_obj.seriesBetAmount/100)||format_currency}}
        </div>
        <div class="col-auto bet-win-value text-right yb-fontsize12">{{parseFloat(max_win_amount)||format_currency}}</div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
// import bet_mix_result from "src/public/mixins/bet/bet_mix_result.js";

</script>
<style lang="scss" scoped>
/* *卡片获取焦点时的样式* */
.bet-mix-result-card {
  padding: 15px;
  margin: 0;
  line-height: 0;
  border: 0;

  /* *卡片组件样式重写* */
  ::v-deep .q-card__section {
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
    &.bet-fail-bg {
      background: rgba(255, 0, 0, 0.15);
    }
    ::v-deep .icon-bet_fail.q-icon.c-icon {
      margin-top: -1px;
    }
    .bet-icon-info {
      margin: 0;
      padding: 0;
      height: 18px;
    }
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
      .bet-confirm-handle {
        position: relative;
        margin-right: 5px;
        top: -2px;
      }
    }
  }
}
</style>
