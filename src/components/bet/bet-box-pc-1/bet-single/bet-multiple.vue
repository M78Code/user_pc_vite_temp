<!--
 * @Description: 多项单注投注 
-->
<template>
	<q-card flat class="relative-position bet-multiple bet-card"
  >
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <div class="cathectic-appoint" v-if="!_.isEmpty(BetData.bet_appoint_obj)"></div>
		<q-card-section>
      <!--竖线以及多项单注-->
			<div class="row">
        <div class="line"></div>
        <div class="col">
          <!--多项单注-->
          {{i18n.t('bet.bet_multiple')}}
        </div>
			</div>
      <!--单关数量以及输入框-->
			<div class="row bet-multiple-input yb-flex-nowrap">
				<div class="col bet-count">
          <span>{{BetData.bet_single_list.length}}</span><span class="operation-symbol">×</span>
        </div>
				<div class="col-auto right-input" :data-check-money="view_ctr_obj.input_money_state">
          <!--投注金额输入框-->
          <currency-input
            :id="`but-${BetData.bet_single_list.length}`"
            :ref="'but-input-'+BetData.bet_single_list.length"
            class="bet-input input-border"
            :class="{'input-money': !is_empty_money,'input-border-red':![-4,0].includes(view_ctr_obj.input_money_state)}"
            :placeholder="`${i18n.t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
            v-model="money"
            :value="money"
            @keyup="keyup_handle"
            :distractionFree="{
              hideCurrencySymbol: true
            }"
            :precision="{
              min:0,
              max:2
            }"
            :currency="null"
            :valueRange="value_range"
            maxLength="11"
            autocomplete="off"
            locale="zh"/>
          <!--清除输入金额按钮-->
          <div class="bet-input-close" @click.stop="bet_clear_handle" v-show="!is_empty_money"><icon name="icon-failure" size="12px"/></div>
				</div>
			</div>
      <!--最高可赢-->
			<div class="row bet-win yb-fontsize12">
				<div class="col df-jb">
					<!--最高可赢额-->
					{{i18n.t('common.maxn_amount_val')}}
				</div>
				<div class="col-auto bet-win-money yb-number-bold">{{win_money || four_five_six_double(2) || format_currency}}</div>
			</div>
      <!--键盘-->
			<div class="row bet-keyboard bet-keyboard-content">
				<div class="col">
					<bet-keyboard
							ref="bet-keyboard"
							@keypress_handle="keypress_handle"
							@update_keyboard="update_keyboard"
							@input_max_money="input_max_money"
							:keyboard_data="keyboard_data" 
					></bet-keyboard>
				</div>
			</div>
		</q-card-section>

    <!-- <div class="mask-appointment" v-if="is_forward != -1"></div> -->

	</q-card>
</template>
<script setup>
// import betting from "src/public/mixins/betting/betting.js";
import BetKeyboard from "../common/bet-keyboard.vue";

</script>
<style scoped lang="stylus">
/**遮罩层**/
.mask-appointment {
  background: #F0F5FC !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  opacity: 0.6;
}
/**多项单注投注整体**/
.bet-card
  line-height 0 !important
  /* *卡片组件样式重写* */
  >>>.q-card__section
    margin 0
    padding 0
    line-height 1
.ie-browser
  .bet-input-close
    top 9.5px

</style>