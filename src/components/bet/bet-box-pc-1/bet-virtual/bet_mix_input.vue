<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关金额输入
-->
<template>
  <q-card
    flat
    class="bet-mix-input-card"
    @click="click_handle"
  >
    <q-card-section>
      <div class="odds-wrap row">
        <div class="line"></div>
        <div class="col bet-mix-info">
          <!--单注-->
          {{$root.$t('bet')[`bet_${id}`]}}
        </div>
        <span v-if="index==0" class="odds-value yb-number-bold">
          <!--串关赔率(欧赔)-->
          {{'@' + get_series_odds}}
        </span>
      </div>
      <!--金额输入区域 -->
      <div class="row bet-mix-input  relative-position" :data-check-money="view_ctr_obj.mix_range_money" >
        <currency-input 
          :ref="'input-money-'+id"
          class="bet-input input-border"
          :class="{'input-money': !is_empty_money,'input-border-red':(![-4,0].includes(view_ctr_obj.mix_range_money) && money!=null) || view_ctr_obj.error_code=='M400005'}"
          :placeholder="`${$root.$t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
          v-model="money"
          :value="money"
          @keyup="keyup_handle"
          :distractionFree="{
            hideCurrencySymbol: true
          }"
          :precision="{
            min:0,
            max:has_input_integer? 0:2
          }"
          :valueRange="{
            min: 0,
            max: input_max
          }"
          :currency="null"
          autocomplete="off"
          maxLength="11"
          locale="zh"/>
        <div class="bet-max-btn">X{{count}}</div>
        <div :class="`bet-input-close-${count.length}`" @click.stop="bet_clear_handle" v-show="!is_empty_money"><icon name="icon-failure" size="12px"/></div> 
      </div> 
      <template v-if="is_show_keyboard">        
        <div class="row bet-win yb-fontsize12">
          <div class="col df-jb">
            <!--最高可赢额-->
            {{$root.$t('common.maxn_amount_val')}}
          </div>
          <div class="col-auto bet-win-money yb-number-bold">{{get_max_win_money()| four_five_six_double(2) | format_currency}}</div>
        </div>
        <div class="row input-keyboard">
          <!--投注键盘-->
          <bet-keyboard
            ref="bet-keyboard"
            @keypress_handle="keypress_handle"
            :keyboard_data="keyboard_data"
            :number="max_money"
          ></bet-keyboard>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>
<script>
// import bet_mix_input from "src/public/mixins/virtual_bet/bet_mix_input.js";

</script>
<style lang="scss" scoped>
/*  卡片获取焦点时的样式 */
.bet-mix-input-card {
  padding: 17px 10px 15px 10px;
  /*  卡片组件样式重写 */
  ::v-deep .q-card__section {
    margin: 0;
    padding: 0;
    line-height: 0;
  }
  .odds-wrap {
    justify-content: space-between;
    align-items: center;
    .line {
      width: 3px;
      height: 14px;
    }
    .bet-mix-info {
      height: 18px;
      line-height: 20px;
      padding-left: 10px;
    }

    /* *赔率的样式* */
    .odds-value {
      padding: 2px 3px;
      height: 18px;
      line-height: 16px;
    }
  }

  /*  输入框行样式 */
  .bet-mix-input {
    margin-top: 10px !important;
    margin-bottom: 5px !important;

    /*  输入金额的样式 */
    input {
      width: 100%;
      padding: 4px 6px;
      margin-top: 2px;
      height: 32px;
      outline: none;
      caret-color: #1286da;
    }
    /*  MAX 几串样式 */
    .bet-max-btn {
      position: absolute;
      right: 8px;
      top: 18px;
      z-index: 9;
      cursor: pointer;
    }
    /*  生成几串数字长度对应清空按钮样式 */
    .bet-input-close-1,
    .bet-input-close-2,
    .bet-input-close-3,
    .bet-input-close-4 {
      position: absolute;
      top: 12px;
      cursor: pointer;
      width: auto;
      height: auto;
      display: inline;
    }
    .bet-input-close-1 {
      right: 28px;
    }
    .bet-input-close-2 {
      right: 32px;
    }
    .bet-input-close-3 {
      right: 37px;
    }
    .bet-input-close-4 {
      right: 45px;
    }
  }
  /*  最高可赢额 */
  .bet-win {
    line-height: 1;
    margin-top: 10px;
    /*  输入无效的样式 */
    .valid-color {
      margin-top: -1px;
      padding-bottom: 1px;
    }
  }
  .input-keyboard {
    margin-top: 10px;
    padding-left: 3px;
    padding-right: 3px;
  }
}

/*  输入错误时抖动的动画效果 */
@keyframes mymove {
  0% {
    left: -4px;
  }
  33% {
    left: 0px;
  }
  66% {
    left: 4px;
  }
  100% {
    left: 0px;
  }
}
</style>