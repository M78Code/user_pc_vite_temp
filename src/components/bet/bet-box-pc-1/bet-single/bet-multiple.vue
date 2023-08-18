<!--
 * @Description: 多项单注投注 
-->
<template>
	<q-card flat class="relative-position bet-multiple bet-card"
  >
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <div class="cathectic-appoint" v-if="!_.isEmpty(vx_get_bet_appoint_obj)"></div>
		<q-card-section>
      <!--竖线以及多项单注-->
			<div class="row">
        <div class="line"></div>
        <div class="col">
          <!--多项单注-->
          {{$root.$t('bet.bet_multiple')}}
        </div>
			</div>
      <!--单关数量以及输入框-->
			<div class="row bet-multiple-input yb-flex-nowrap">
				<div class="col bet-count">
          <span>{{vx_get_bet_single_list.length}}</span><span class="operation-symbol">×</span>
        </div>
				<div class="col-auto right-input" :data-check-money="view_ctr_obj.single_range_money">
          <!--投注金额输入框-->
          <currency-input
            :id="`but-${vx_get_bet_single_list.length}`"
            :ref="'but-input-'+vx_get_bet_single_list.length"
            class="bet-input input-border"
            :class="{'input-money': !is_empty_money,'input-border-red':![-4,0].includes(view_ctr_obj.single_range_money)}"
            :placeholder="`${$root.$t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
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
					{{$root.$t('common.maxn_amount_val')}}
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

<style lang="scss" scoped>
/**预约投注遮罩*/
.mask-appointment {
  background: #F0F5FC !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10000 !important;
  opacity: 0.6;
}

/**投注卡片*/
.bet-card {
  line-height: 0 !important;

  /* *蒙层* */
  .cathectic-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    opacity: 0;
  }
  .mt5 {
    margin-top: 5px;
  }
}
/* *卡片获取焦点时的样式background #FFD9D9 * */
/* *卡片组件样式重写* */
::v-deep .q-card__section {
  margin: 0;
  padding: 0;
  line-height: 1;
}

/* *玩法及队名部分样式* */
.bet-play-game {
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  /**玩法队名盘口*/
  .bet-play-text {
    line-height: 1.3;
    /**玩法*/
    .bet-match-playing {
      margin-right: 5px;
      white-space: nowrap;
    }
    /**盘口*/
    .bet-handicap-name {
      white-space: pre-wrap;
    }
  }
}
/*  玩法部分样式 */
.bet-play-team {
  display: flex;
  align-items: flex-start;
  padding-right: 5px !important;
  /*  投注项盘口样式 */
  .bet-team-handicap {
    display: block;
    word-break: break-all;
    line-height: 1.2;

    label {
      margin-left: 5px;
      word-break: break-word;
      /*  盘口样式 */
      &.bet-handicap {
        text-align: center;
        padding: 0px 5px;
      }
      &.margin-left-0 {
        margin-left: 0px;
      }
    }
  }
}
/* *赔率的样式* */
.bet-odds-value {
  display: inline-block;
  text-align: right;
  /*  赔率 */
  .odds-value {
    position: relative;
    padding: 1px 3px;
  }

  /*  显示无效时的样式 */
  .invalid {
    padding: 2px 5px;
  }
}

/*  删除按钮列的样式 */
.col-delete {
  display: flex;
  align-items: flex-start;

  /*  删除按钮 */
  .bet-del {
    z-index: 20;
    font-size: 6px;
  }
}
.text-right {
  text-align: right;
}
/*  单关输入框样式 */
.bet-single-input {
  margin-top: 8px !important;
  margin-bottom: 10px !important;
  /* *蒙层* */
  .cathectic-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0);
  }
  /* 输入金额的样式 */
  input {
    width: 100%;
    padding: 4px 6px;
    margin-top: 2px;
    color: #191c24;
    height: 32px;
    line-height: 18px;
    outline: none;
    /*  输入金额时的样式 */
    &.bet-input-money {
      outline: none;
    }
  }

  /*  MAX按钮的样式 */
  .bet-max-btn {
    position: absolute;
    top: 12px;
    right: 6px;
    z-index: 9;
    cursor: pointer;
    font-size: 12px;
    padding: 1px 2px;
  }

  /*  输入框中的关闭按钮样式 */
  .bet-input-close {
    position: absolute;
    top: 11px;
    right: 10px;
    cursor: pointer;
    width: auto;
    height: auto;
  }
}
/* 最高可赢额 */
.bet-win {
  line-height: 1;
  .bet-win-money {
    margin-top: 2px;
  }
}
/*  输入不在限额范围内错误提示的样式 */
.bet-win-valid {
  line-height: 1;
  margin-top: 3px;
}
/* 最高可赢额 */
.df-jb {
  height: 12px;
  display: flex;
  align-items: center;
}

/*  投注键盘区域 */
.bet-keyboard-zone {
  padding-top: 8px !important;
  margin-left: -10px !important;
  margin-right: -10px !important;

  /*  键盘按钮之间的间距 */
  .bet-keyboard-content {
    margin-left: 13px !important;
    margin-right: 13px !important;
  }
}
// 赔率换行
.book-content>div {
    word-break:break-all;
}
.ie-browser {
    /*  输入框中的关闭按钮样式 */
  .bet-input-close {
    top: 9.5px;
  }
}
 .appoint {
  height: 50px;
 }
</style>