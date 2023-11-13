<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <!--串关-->
    <!-- <div class="bet-record-title">
      {{$root.$t('bet.bet_series')}}
    </div> -->
    <!--投注记录项部分-->
    <bet-mix-record-item
      :oid="item.playOptionsId"
      :view_ctr_obj="view_ctr_obj"    
      :item_obj="item"
      v-for="(item, index) in view_ctr_obj.order_detail_data"
      :key="item.playOptionsId"
      :class="{'bet-mix-record-item-first': (index==0 && vx_get_bet_list.length>1),  'bet-mix-record-item-last': ((index+1)==vx_get_bet_list.length && vx_get_bet_list.length>1)}"
    ></bet-mix-record-item>
    <!--投注结果部分-->
    <bet-mix-result 
      :series_obj="item" 
      v-for="(item, index) in view_ctr_obj.series_order_data" 
      :key="index"
      :class="{'bet-mix-record-result-last': ((index+1)==view_ctr_obj.series_order_data.length)}"></bet-mix-result>
      <q-card flat class="bet-mix-result-card">
        <q-card-section>
        <div class="row">
                <!-- 总投注 -->
                <div class="col bet-total-left">
                  {{$root.$t('bet.total_bet')}}
                  <template v-if="view_ctr_obj.series_order_data.length>0">
                    {{ view_ctr_obj.series_order_data.length }}
                  </template>
                </div>
                <div class="col-auto bet-total-right  bet-amount-text">
                  <span>¥</span>
                {{parseFloat(allBetAmount/100)|format_currency }}
                </div>
              </div>
              <div class="row">
                <!-- 预计总收益 -->
                <div class="col bet-total-left">
                  {{$root.$t('bet.total_income')}}
                </div>
                <div class="col-auto bet-total-right bet-gold-text">
                  <span>¥</span>
                {{parseFloat(all_max_win_amount/100)|format_currency }}
                </div>
              </div>
            </q-card-section>
            </q-card>
    
  </div>
</template>
<script>
import bet_mix_record from "src/public/mixins/bet/bet_mix_record.js";
import BetMixRecordItem from "src/public/components/bet/bet_mix_record_item.vue";
import BetMixResult from "src/public/components/bet/bet_mix_result.vue";
export default {
  // 串关投注记录mixin
  mixins: [bet_mix_record],
  components: {
    // 串关投注项记录组件
    "bet-mix-record-item": BetMixRecordItem,
    // 串关投注结果组件
    "bet-mix-result": BetMixResult
  },
};
</script>
<style lang="scss" scoped>
.bet-mix-result-card {
  padding: 15px;
  margin: 0;
  line-height: 0;
  border: 0;
  // height: 100px;

  /* *卡片组件样式重写* */
  ::v-deep .q-card__section {
    margin: 0;
    padding: 0;
    line-height: 24px;
    margin-top: -15px;
    margin-left: -15px;
    margin-right: -15px;
    padding-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: -15px;
    padding-bottom: 15px;
    /*  投注失败背景样式 */
  
    /*  投注图标  */
    .bet-icon-info {
      margin: 0;
      padding: 0;
      height: 18px;
    }
    .bet-gold-text{
      color:var(--qq--y0-text-color1);
     font-weight: 560;
    }
    .bet-amount-text{
      color: var(--qq--yb-text-color4);
     font-weight: 560;
    }
    .bet-total-left{
      color: var(--qq--yb-text-color4);
    }

   
    
  }
}

</style>